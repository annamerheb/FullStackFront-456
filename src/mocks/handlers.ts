/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

const sanitizeOrder = (order: any) => ({
  id: order.id || '',
  status: order.status || 'pending',
  orderDate: String(order.created_at || new Date().toISOString()),
  totalPrice: Number(order.total_amount || 0),
  itemCount: Number(order.items_count || 0),
  trackingNumber: order.tracking_number || '',
  estimatedDelivery: String(order.expected_delivery || new Date().toISOString()),
  items: Array.isArray(order.items)
    ? order.items.map((item: any) => ({
        productId: Number(item.product_id || 0),
        productName: String(item.product_name || ''),
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
      }))
    : [],
  shippingAddress: {
    street: order.shipping_address?.street || '',
    city: order.shipping_address?.city || '',
    postalCode: order.shipping_address?.postalCode || '',
    country: order.shipping_address?.country || '',
  },
  billingAddress: {
    street: order.billing_address?.street || '',
    city: order.billing_address?.city || '',
    postalCode: order.billing_address?.postalCode || '',
    country: order.billing_address?.country || '',
  },
});

const dynamicUser: any = {
  id: 'user-demo-123',
  username: 'demo',
  email: 'demo@example.com',
  fullName: 'Demo User',
  preferences: {
    newsletter: true,
    defaultMinRating: 3.0,
  },
  defaultAddress: {
    street: '123 Main Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  },
  createdAt: '2024-01-15T10:30:00Z',
};

const dynamicOrders: any[] = [
  {
    id: 'order-001',
    order_number: 'ORD-ABC123456',
    status: 'delivered',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expected_delivery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 159.99,
    items_count: 3,
    delivery_option: 'standard',
    tracking_number: 'TRK-ABC123456789',
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: 'Stylo Bleu',
        quantity: 2,
        price: 2.5,
        line_total: 5.0,
      },
      {
        id: 2,
        product_id: 2,
        product_name: 'Cahier A4',
        quantity: 1,
        price: 8.99,
        line_total: 8.99,
      },
      {
        id: 3,
        product_id: 3,
        product_name: 'Crayon HB',
        quantity: 10,
        price: 14.5,
        line_total: 145.0,
      },
    ],
    shipping_address: {
      street: '123 Main Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    billing_address: {
      street: '123 Main Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
  },
];

let dynamicWishlist: number[] = [];

const dynamicReviews: Record<number, any[]> = {
  1: [
    {
      id: 1,
      productId: 1,
      user: 'Alice',
      userId: 1,
      rating: 5,
      comment: 'Excellent product! Very satisfied.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      productId: 1,
      user: 'Bob',
      userId: 2,
      rating: 4,
      comment: 'Good quality, delivery was fast.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const handlers = [
  http.post(`${API}/auth/token/`, async () => {
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        created_at: p.created_at,
        image: p.image,
        avgRating: avgRating(p.ratings),
      }))
      .filter((p) => p.avgRating >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '') === 'rating' ? 'avgRating' : ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),
  // Fetch single product - supports both `/api/products/:id/` and `/api/products/:id`
  // MUST come BEFORE the rating handler since it's more specific
  http.get(`${API}/products/:productId/`, async ({ params }) => {
    console.log(`[MSW] Intercepted GET /api/products/:productId/`, params);
    const productId = params['productId'];
    const id = Number(productId);

    if (isNaN(id)) {
      console.error(`[MSW] Invalid product ID: ${productId}`);
      return HttpResponse.json({ detail: 'Invalid product ID.' }, { status: 400 });
    }

    const p = products.find((x) => x.id === id);

    if (!p) {
      console.warn(`[MSW] Product not found: ${id}`);
      return HttpResponse.json({ detail: 'Product not found.' }, { status: 404 });
    }

    console.log(`[MSW] ✅ GET /api/products/${id}/ → Found "${p.name}"`);
    return HttpResponse.json(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        created_at: p.created_at,
        image: p.image,
        avgRating: avgRating(p.ratings),
        stock: p.stock,
        discount: p.discount,
        lowStockThreshold: p.lowStockThreshold,
      },
      { status: 200 },
    );
  }),
  // Fetch product rating
  http.get(`${API}/products/:productId/rating/`, async ({ params }) => {
    const id = Number(params['productId']);
    const p = products.find((x) => x.id === id);

    if (!p) {
      console.warn(`[MSW] Product rating not found: ${id}`);
      return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    console.log(`[MSW] GET /api/products/${id}/rating/`);
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.product.id);
      const itemPrice = (product?.price || item.product.price) * item.quantity;
      subtotal += itemPrice;
      return {
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: product?.price || item.product.price,
        in_stock: true,
        available_quantity: product?.stock || 999,
        line_total: itemPrice,
      };
    });

    const deliveryCharge = body.delivery_charge || 10;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + deliveryCharge + tax;

    return HttpResponse.json(
      {
        items: validatedItems,
        valid: true,
        summary: {
          subtotal,
          delivery_charge: deliveryCharge,
          tax,
          total,
        },
      },
      { status: 200 },
    );
  }),
  http.post(`${API}/order/`, async ({ request }) => {
    const body = (await request.json()) as any;

    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderId = 'order-' + Math.random().toString(36).substr(2, 10);

    const orderItems = (body.items || []).map((item: any, idx: number) => ({
      id: idx + 1,
      product_id: item.product?.id || item.product_id,
      product_name: item.product?.name || item.product_name,
      quantity: item.quantity,
      price: item.product?.price || item.price,
      line_total: (item.product?.price || item.price) * item.quantity,
    }));

    const newOrder = {
      id: orderId,
      order_number: orderNumber,
      status: 'processing',
      created_at: new Date().toISOString(),
      expected_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      total_amount: body.total_amount || 0,
      subtotal_amount: body.subtotal_amount || 0,
      shipping_cost: body.shipping_cost || 0,
      tax_amount: body.tax_amount || 0,
      items_count: body.items?.length || 0,
      delivery_option: body.delivery_option || 'standard',
      tracking_number: 'TRK-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
      items: orderItems,
      shipping_address: body.shipping_address || {},
      billing_address: body.shipping_address || {},
    };

    dynamicOrders.unshift(newOrder);

    return HttpResponse.json(
      {
        order_id: orderId,
        order_number: orderNumber,
        status: 'confirmed',
        created_at: newOrder.created_at,
        expected_delivery: newOrder.expected_delivery,
        total_amount: body.total_amount || 0,
        subtotal_amount: body.subtotal_amount || 0,
        shipping_cost: body.shipping_cost || 0,
        tax_amount: body.tax_amount || 0,
        items_count: body.items?.length || 0,
        shipping_address: body.shipping_address || {},
        delivery_option: body.delivery_option || 'standard',
        coupon_applied: body.coupon_code || null,
        payment_method: body.payment_method || 'card',
        tracking_number: newOrder.tracking_number,
        message: 'Your order has been confirmed! You will receive an email confirmation shortly.',
      },
      { status: 201 },
    );
  }),
  http.get(`${API}/user/profile/`, async () => {
    const orderSummaries = dynamicOrders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      total_amount: order.total_amount,
      items_count: order.items_count,
      delivery_option: order.delivery_option,
    }));

    return HttpResponse.json(
      {
        user: {
          id: 'user-demo-123',
          username: 'demo',
          email: 'demo@example.com',
          fullName: 'Demo User',
          preferences: {
            newsletter: true,
            defaultMinRating: 3.0,
          },
          defaultAddress: {
            street: '123 Main Street',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
          orders: orderSummaries,
          createdAt: '2024-01-15T10:30:00Z',
        },
      },
      { status: 200 },
    );
  }),
  http.patch(`${API}/user/profile/`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        user: {
          id: 'user-demo-123',
          username: 'demo',
          email: 'demo@example.com',
          fullName: body.fullName || 'Demo User',
          preferences: body.preferences || {
            newsletter: true,
            defaultMinRating: 3.0,
          },
          defaultAddress: body.defaultAddress || {
            street: '123 Main Street',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
          orders: [],
          createdAt: '2024-01-15T10:30:00Z',
        },
      },
      { status: 200 },
    );
  }),
  http.get(`${API}/user/orders/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('page_size') || '10');

    const allOrders = dynamicOrders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      total_amount: order.total_amount,
      items_count: order.items_count,
      delivery_option: order.delivery_option,
    }));

    const { count, results } = paginate(allOrders, page, pageSize);

    return HttpResponse.json(
      {
        count,
        next: null,
        previous: null,
        results,
      },
      { status: 200 },
    );
  }),
  http.get('/api/user/orders/:id', ({ params }) => {
    const orderId = params['id'] as string;
    const order = dynamicOrders.find((o) => o.id === orderId);

    if (!order) {
      return HttpResponse.json({ detail: 'Order not found.' }, { status: 404 });
    }

    const sanitized = sanitizeOrder(order);
    return HttpResponse.json(sanitized);
  }),
  http.get(`${API}/me/`, async () => {
    const orderSummaries = dynamicOrders.map((order) => ({
      id: order.id,
      status: order.status,
      orderDate: order.created_at,
      totalPrice: order.total_amount,
      itemCount: order.items_count,
    }));

    return HttpResponse.json(
      {
        ...dynamicUser,
        orders: orderSummaries,
      },
      { status: 200 },
    );
  }),
  http.patch(`${API}/me/`, async ({ request }) => {
    const body = (await request.json()) as any;

    if (body.fullName) {
      dynamicUser.fullName = body.fullName;
    }
    if (body.preferences) {
      dynamicUser.preferences = { ...dynamicUser.preferences, ...body.preferences };
    }
    if (body.defaultAddress) {
      dynamicUser.defaultAddress = { ...dynamicUser.defaultAddress, ...body.defaultAddress };
    }

    return HttpResponse.json(
      {
        ...dynamicUser,
        orders: [],
      },
      { status: 200 },
    );
  }),
  http.get(`${API}/me/orders/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('page_size') || '10');

    const allOrders = dynamicOrders.map((order) => ({
      id: order.id,
      status: order.status,
      orderDate: order.created_at,
      totalPrice: order.total_amount,
      itemCount: order.items_count,
    }));

    const { count, results } = paginate(allOrders, page, pageSize);

    return HttpResponse.json(
      {
        count,
        next: null,
        previous: null,
        results,
      },
      { status: 200 },
    );
  }),
  http.get('/api/orders/:id', ({ params }) => {
    const orderId = params['id'] as string;

    const order = dynamicOrders.find((o) => o.id === orderId);

    if (!order) {
      console.log('Order not found:', orderId);
      return HttpResponse.json({ detail: 'Order not found.' }, { status: 404 });
    }

    const sanitized = sanitizeOrder(order);
    return HttpResponse.json(sanitized);
  }),

  http.get('/api/me/wishlist/', () => {
    return HttpResponse.json({ productIds: dynamicWishlist }, { status: 200 });
  }),

  http.post('/api/me/wishlist/', async ({ request }) => {
    const body = (await request.json()) as { productIds: number[] };
    dynamicWishlist = body.productIds || [];
    return HttpResponse.json({ productIds: dynamicWishlist }, { status: 200 });
  }),

  http.get('/api/products/:id/reviews/', ({ params }) => {
    const productId = Number(params['id']);
    const reviews = dynamicReviews[productId] || [];
    return HttpResponse.json({ results: reviews }, { status: 200 });
  }),

  http.post('/api/products/:id/reviews/', async ({ request, params }) => {
    const productId = Number(params['id']);
    const body = (await request.json()) as { rating: number; comment: string };

    const newReview = {
      id: Math.max(...(dynamicReviews[productId]?.map((r) => r.id) || [0])) + 1,
      productId,
      user: 'Current User',
      userId: 1,
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };

    if (!dynamicReviews[productId]) {
      dynamicReviews[productId] = [];
    }
    dynamicReviews[productId].push(newReview);

    return HttpResponse.json(newReview, { status: 201 });
  }),

  http.post(`${API}/cart/apply-promo/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const promoCode = body.promo_code ? (body.promo_code as string).toUpperCase() : '';
    const items = body.items || [];

    // Calculate itemsTotal
    let itemsTotal = 0;
    items.forEach((item: any) => {
      itemsTotal += (item.product?.price || item.price) * item.quantity;
    });

    let discount = 0;
    let shipping = body.shipping || 10; // Default shipping cost
    const appliedPromos: string[] = [];
    let error: string | null = null;

    // Promo codes logic - NEW CODES ONLY
    if (promoCode === 'WELCOME10') {
      // -10% on items total
      discount = Math.round(itemsTotal * 0.1 * 100) / 100;
      appliedPromos.push('WELCOME10');
    } else if (promoCode === 'FREESHIP') {
      // Free shipping
      shipping = 0;
      appliedPromos.push('FREESHIP');
    } else if (promoCode === 'VIP20') {
      // -20% but only if itemsTotal >= 50
      if (itemsTotal >= 50) {
        discount = Math.round(itemsTotal * 0.2 * 100) / 100;
        appliedPromos.push('VIP20');
      } else {
        error = 'Code VIP20 requires a minimum purchase of 50€';
        return HttpResponse.json(
          {
            error,
            itemsTotal,
            discount: 0,
            shipping: shipping,
            taxes: 0,
            grandTotal: itemsTotal + shipping,
            appliedPromos: [],
          },
          { status: 400 },
        );
      }
    } else if (promoCode) {
      // Invalid promo code
      error = `Promo code "${promoCode}" is not valid`;
      return HttpResponse.json(
        {
          error,
          itemsTotal,
          discount: 0,
          shipping: shipping,
          taxes: 0,
          grandTotal: itemsTotal + shipping,
          appliedPromos: [],
        },
        { status: 400 },
      );
    }

    // Calculate taxes on discounted amount
    const taxableAmount = itemsTotal - discount;
    const taxes = Math.round(taxableAmount * 0.08 * 100) / 100;
    const grandTotal = Math.round((itemsTotal - discount + shipping + taxes) * 100) / 100;

    return HttpResponse.json(
      {
        itemsTotal,
        discount,
        shipping,
        taxes,
        grandTotal,
        appliedPromos,
      },
      { status: 200 },
    );
  }),

  // Validate stock before order placement
  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    const body = (await request.json()) as any;
    const items = body.items || [];

    // Check stock for each item
    const errors: string[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.product);
      if (!product) {
        errors.push(`Product ${item.product} not found`);
        continue;
      }

      if (product.stock < item.quantity) {
        errors.push(
          `Stock insuffisant pour le produit "${product.name}". Disponible: ${product.stock}, Demandé: ${item.quantity}`,
        );
      }
    }

    if (errors.length > 0) {
      return HttpResponse.json(
        {
          valid: false,
          errors,
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        valid: true,
        errors: [],
      },
      { status: 200 },
    );
  }),

  // Admin Stats Endpoint
  http.get(`${API}/admin/stats/`, async () => {
    // Calculate stats from dynamic data
    const totalUsers = 42;
    const totalOrders = dynamicOrders.length;
    const totalRevenue = dynamicOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    // Top products (mock data)
    const topProducts = [
      { productId: '1', name: 'Premium Headphones', sold: 245, revenue: 12250 },
      { productId: '2', name: 'Wireless Charger', sold: 189, revenue: 5670 },
      { productId: '3', name: 'Phone Case', sold: 412, revenue: 2472 },
      { productId: '4', name: 'Screen Protector', sold: 328, revenue: 1640 },
      { productId: '5', name: 'USB-C Cable', sold: 567, revenue: 2835 },
    ];

    // Recent orders
    const recentOrders = dynamicOrders.slice(0, 5).map((order) => ({
      id: order.order_number,
      user: 'demo@example.com',
      total: order.total_amount || 0,
      createdAt: order.created_at,
      status: order.status,
    }));

    return HttpResponse.json(
      {
        totalUsers,
        totalOrders,
        totalRevenue,
        topProducts,
        recentOrders,
      },
      { status: 200 },
    );
  }),
];
