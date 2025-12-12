import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../../../../state/cart/cart.selectors';
import { CartItem } from '../../../../state/cart/cart.models';
import { CartSummaryComponent } from '../cart/cart-summary.component';

@Component({
  standalone: true,
  selector: 'app-checkout-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CartSummaryComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-8 checkout-page-enter">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Checkout</p>
              <h3 class="mt-2 text-3xl font-medium text-slate-500">Step 1: Order Summary</h3>
              <p class="mt-1 text-sm text-slate-600">Review your items before proceeding</p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4">
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white font-bold"
            >
              1
            </div>
            <p class="mt-2 text-sm font-semibold text-slate-700">Summary</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-200"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold"
            >
              2
            </div>
            <p class="mt-2 text-sm text-slate-600">Address</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-200"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold"
            >
              3
            </div>
            <p class="mt-2 text-sm text-slate-600">Confirm</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
              <div
                *ngFor="let item of cartItems$ | async; trackBy: trackByProductId"
                class="flex justify-between items-center py-4 border-b last:border-b-0"
              >
                <div>
                  <p class="font-medium text-slate-900">{{ item.product.name }}</p>
                  <p class="text-sm text-slate-600">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-slate-900">
                  {{ formatPrice(getDiscountedPrice(item.product) * item.quantity) }}
                </p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-4">
              <app-cart-summary
                [cart]="{
                  itemCount: (cartCount$ | async) || 0,
                  totalPrice: (cartTotal$ | async) || 0,
                }"
                [hidePromoAndDelivery]="true"
              ></app-cart-summary>

              <button
                mat-raised-button
                color="primary"
                routerLink="/shop/checkout/address"
                class="mt-4 w-full h-12"
              >
                Continue to Address
              </button>

              <button
                mat-stroked-button
                routerLink="/shop/cart"
                class="mt-2 w-full !border-sky-500 !text-sky-600 hover:!bg-sky-50"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutSummaryComponent {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartCount$: Observable<number>;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.cartCount$ = this.store.select(selectCartCount);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getDiscountedPrice(product: any): number {
    if (!product.discount) {
      return product.price;
    }
    return product.price - (product.price * product.discount) / 100;
  }

  /**
   * TrackBy function for cart items in *ngFor
   * Improves performance with OnPush change detection
   */
  trackByProductId(_index: number, item: CartItem): number {
    return item.product.id;
  }
}
