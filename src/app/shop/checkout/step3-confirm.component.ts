import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectCartItems, selectCartTotal, selectCartCount } from '../../state/cart/cart.selectors';
import { CartItem } from '../../state/cart/cart.models';
import * as CartActions from '../../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-checkout-confirm',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen containerbg px-4 py-8 checkout-page-enter">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Checkout</p>
              <h3 class="mt-2 text-3xl font-medium text-slate-500">Step 3: Order Confirmation</h3>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4">
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400 text-white font-bold"
            >
              ✓
            </div>
            <p class="mt-2 text-sm text-slate-600">Summary</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-300"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400 text-white font-bold"
            >
              ✓
            </div>
            <p class="mt-2 text-sm text-slate-600">Address</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-300"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white font-bold"
            >
              3
            </div>
            <p class="mt-2 text-sm font-semibold text-slate-700">Confirm</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
              <div
                *ngFor="let item of cartItems$ | async"
                class="flex justify-between items-center py-3 border-b last:border-b-0"
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

            <div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Delivery Address</h2>
              <div *ngIf="address" class="space-y-2 text-slate-700">
                <p><span class="font-medium">Name:</span> {{ address.fullName }}</p>
                <p><span class="font-medium">Email:</span> {{ address.email }}</p>
                <p><span class="font-medium">Address:</span> {{ address.address }}</p>
                <p>
                  <span class="font-medium">City:</span> {{ address.city }}, {{ address.state }}
                  {{ address.zipCode }}
                </p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-4">
              <div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-slate-900 mb-4">Total Amount</h3>
                <div class="space-y-2 mb-4 pb-4 border-b">
                  <div class="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{{ formatPrice(cartTotal$ | async) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{{ formatPrice(((cartTotal$ | async) || 0) * 0.08) }}</span>
                  </div>
                </div>
                <div class="flex justify-between font-bold text-lg text-sky-600 mb-6">
                  <span>Total:</span>
                  <span>{{ formatPrice(((cartTotal$ | async) || 0) * 1.08) }}</span>
                </div>

                <button
                  mat-raised-button
                  color="primary"
                  (click)="placeOrder()"
                  class="w-full h-12 mb-2"
                >
                  Place Order
                </button>
                <button
                  mat-stroked-button
                  routerLink="/shop/checkout/address"
                  class="w-full !border-sky-500 !text-sky-600 hover:!bg-sky-50"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CheckoutConfirmComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  address: any;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
  }

  ngOnInit() {
    const savedAddress = sessionStorage.getItem('checkout_address');
    if (savedAddress) {
      this.address = JSON.parse(savedAddress);
    }
  }

  placeOrder() {
    alert(
      'Order placed successfully! Order #' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    );
    this.store.dispatch(CartActions.clearCart());
    localStorage.removeItem('cart');
    sessionStorage.removeItem('checkout_address');
    this.router.navigate(['/shop/products']);
  }

  formatPrice(price: number | null | undefined): string {
    if (!price) return '$0.00';
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
}
