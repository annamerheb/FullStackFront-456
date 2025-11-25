import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ProductDetailsPageComponent } from '../app/shop/product-details/product-details-page.component';
import { ShopApiService } from '../app/services/shop-api.service';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/ProductDetails',
  component: ProductDetailsPageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              items: [],
              totalPrice: 0,
              itemCount: 0,
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            paramMap: of(new Map([['id', '1']])),
          },
        },
        {
          provide: ShopApiService,
          useValue: {
            getProduct: () => of({}),
            getProducts: () => of({}),
            getRating: () => of({}),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductDetailsPageComponent>;

const mockProduct = {
  id: 1,
  name: 'Premium Wireless Headphones',
  price: 129.99,
  created_at: '2024-01-01',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  avgRating: 4.8,
  stock: 45,
  discount: 15,
};

const lowStockProduct = {
  id: 2,
  name: 'Limited Edition Watch',
  price: 249.99,
  created_at: '2024-01-02',
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  avgRating: 4.6,
  stock: 3,
  discount: 20,
};

const outOfStockProduct = {
  id: 3,
  name: 'Vintage Camera',
  price: 399.99,
  created_at: '2024-01-03',
  image: 'https://images.unsplash.com/photo-1606933248051-5ce98a0764b2?w=800',
  avgRating: 4.4,
  stock: 0,
  discount: 0,
};

const noImageProduct = {
  id: 4,
  name: 'Product Without Image',
  price: 19.99,
  created_at: '2024-01-04',
  image: '',
  avgRating: 3.5,
  stock: 100,
  discount: 5,
};

export const Default: Story = {
  render: () => ({
    template: `
      <app-product-details-page></app-product-details-page>
    `,
  }),
};

export const WithProduct: Story = {
  render: () => ({
    props: {
      product: mockProduct,
    },
    template: `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.name }}</h1>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div class="grid gap-8 md:grid-cols-2">
              <div class="flex items-center justify-center bg-slate-50 rounded-lg p-8">
                <img [src]="product.image" [alt]="product.name" class="h-full w-full object-cover rounded-lg" />
              </div>
              <div class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-3xl font-bold text-sky-600">€{{ product.price }}</span>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 mb-2">Rating</h3>
                  <span class="text-yellow-500">★★★★★</span>
                </div>
                <p class="text-slate-600">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const LowStockProduct: Story = {
  render: () => ({
    props: {
      product: lowStockProduct,
    },
    template: `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.name }}</h1>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div class="grid gap-8 md:grid-cols-2">
              <div class="flex items-center justify-center bg-slate-50 rounded-lg p-8">
                <img [src]="product.image" [alt]="product.name" class="h-full w-full object-cover rounded-lg" />
              </div>
              <div class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-3xl font-bold text-sky-600">€{{ product.price }}</span>
                  </div>
                </div>
                <div class="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  ⚠️ Only {{ product.stock }} in stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const OutOfStockProduct: Story = {
  render: () => ({
    props: {
      product: outOfStockProduct,
    },
    template: `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.name }}</h1>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div class="grid gap-8 md:grid-cols-2">
              <div class="flex items-center justify-center bg-slate-50 rounded-lg p-8">
                <img [src]="product.image" [alt]="product.name" class="h-full w-full object-cover rounded-lg" />
              </div>
              <div class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-3xl font-bold text-sky-600">€{{ product.price }}</span>
                  </div>
                </div>
                <div class="px-3 py-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  ✗ Out of Stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const NoImageProduct: Story = {
  render: () => ({
    props: {
      product: noImageProduct,
    },
    template: `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.name }}</h1>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div class="grid gap-8 md:grid-cols-2">
              <div class="flex items-center justify-center bg-slate-50 rounded-lg p-8">
                <div class="text-center">
                  <span class="text-5xl text-slate-400">🖼️</span>
                  <p class="text-slate-500 mt-4">Product Image</p>
                </div>
              </div>
              <div class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-3xl font-bold text-sky-600">€{{ product.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const HighRatingProduct: Story = {
  render: () => ({
    props: {
      product: { ...mockProduct, avgRating: 4.9 },
    },
    template: `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.name }}</h1>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div class="grid gap-8 md:grid-cols-2">
              <div class="flex items-center justify-center bg-slate-50 rounded-lg p-8">
                <img [src]="product.image" [alt]="product.name" class="h-full w-full object-cover rounded-lg" />
              </div>
              <div class="space-y-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-3xl font-bold text-sky-600">€{{ product.price }}</span>
                  </div>
                </div>
                <div class="px-3 py-2 bg-green-50 border border-green-200 rounded">
                  <span class="text-yellow-500">★★★★★</span> {{ product.avgRating }}/5 - Highly Rated!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
