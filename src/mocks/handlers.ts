/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

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
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
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
      },
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

    const couponDiscount = body.coupon_discount || 0;
    const deliveryCharge = body.delivery_charge || 0;
    const tax = subtotal * 0.08;
    const total = subtotal - couponDiscount + deliveryCharge + tax;

    return HttpResponse.json(
      {
        items: validatedItems,
        valid: true,
        summary: {
          subtotal,
          coupon_discount: couponDiscount,
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
    const orderId = Math.floor(Math.random() * 10000) + 1000;

    return HttpResponse.json(
      {
        order_id: orderId,
        order_number: orderNumber,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        expected_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        total_amount: body.total_amount || 0,
        items_count: body.items?.length || 0,
        shipping_address: body.shipping_address || {},
        delivery_option: body.delivery_option || 'standard',
        coupon_applied: body.coupon_code || null,
        payment_method: body.payment_method || 'card',
        tracking_number: 'TRK-' + Math.random().toString(36).substr(2, 10).toUpperCase(),
        message: 'Your order has been confirmed! You will receive an email confirmation shortly.',
      },
      { status: 201 },
    );
  }),
];
