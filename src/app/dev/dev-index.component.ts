import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div
      class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10 !font-sans"
    >
      <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">MSW Test Zone</h1>
              <p class="mt-1 text-sm text-slate-600">Mock Service Worker API endpoints</p>
            </div>

            <button
              mat-stroked-button
              color="primary"
              routerLink="/"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50"
            >
              ← Back Home
            </button>
          </div>

          <div class="p-4">
            <nav class="grid gap-3">
              <button
                type="button"
                routerLink="/dev/auth"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Auth:</span>&nbsp;POST /api/auth/token/ (+refresh)
              </button>
              <button
                type="button"
                routerLink="/dev/products"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Products List:</span>&nbsp;GET /api/products/
              </button>
              <button
                type="button"
                routerLink="/dev/products/1"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Product Details:</span>&nbsp;GET /api/products/:id/ (with
                stock & discount)
              </button>
              <button
                type="button"
                routerLink="/dev/products/1/rating"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Product Rating:</span>&nbsp;GET /api/products/:id/rating/
              </button>
              <button
                type="button"
                routerLink="/dev/cart-validate"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Cart Validate:</span>&nbsp;POST /api/cart/validate/ (price
                summary)
              </button>
              <button
                type="button"
                routerLink="/dev/order"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Create Order:</span>&nbsp;POST /api/order/ (confirmation
                #)
              </button>
              <button
                type="button"
                routerLink="/dev/profile"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">User Profile:</span>&nbsp;GET /api/me/ + PATCH /api/me/
              </button>
              <button
                type="button"
                routerLink="/dev/orders"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">User Orders:</span>&nbsp;GET /api/me/orders/
              </button>
              <button
                type="button"
                routerLink="/dev/order-details"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Order Details:</span>&nbsp;GET /api/orders/:id/
              </button>
              <button
                type="button"
                routerLink="/dev/wishlist"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Wishlist:</span>&nbsp;GET /api/me/wishlist/ + POST
                /api/me/wishlist/
              </button>
              <button
                type="button"
                routerLink="/dev/reviews"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-500 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Reviews:</span>&nbsp;GET /api/products/:id/reviews/ + POST
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }
    `,
  ],
})
export class DevIndexComponent {}
