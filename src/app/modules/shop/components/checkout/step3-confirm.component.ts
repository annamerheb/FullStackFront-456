import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import * as CartActions from '../../../../state/cart/cart.actions';
import * as UserActions from '../../../../state/user/user.actions';
import { ShopApiService } from '../../../../services/shop-api.service';
import { selectUserLoading } from '../../../../state/user/user.selectors';
import { filter, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CartSummaryComponent } from '../cart/cart-summary.component';
import { selectDiscountAmount } from '../../../../state/discounts/discounts.selectors';
import { selectDeliveryOptionCost } from '../../../../state/delivery/delivery.selectors';

@Component({
  standalone: true,
  selector: 'app-checkout-confirm',
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
                *ngFor="let item of cartItems$ | async; trackBy: trackByProductId"
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
                (click)="placeOrder()"
                class="w-full h-12 mb-2 mt-4"
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
  `,
  styles: [],
})
export class CheckoutConfirmComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartCount$: Observable<number>;
  address: any;
  private isSubmitting = false;
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
    private shopApi: ShopApiService,
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.cartCount$ = this.store.select(selectCartCount);
    this.loading$ = this.store.select(selectUserLoading);
  }

  ngOnInit() {
    const savedAddress = sessionStorage.getItem('checkout_address');
    if (savedAddress) {
      this.address = JSON.parse(savedAddress);
    }
  }

  placeOrder() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    combineLatest([
      this.cartItems$,
      this.cartTotal$,
      this.store.select(selectDiscountAmount),
      this.store.select(selectDeliveryOptionCost),
    ])
      .pipe(take(1))
      .subscribe({
        next: ([items, cartTotal, discount, deliveryCost]) => {
          const discountAmount = discount || 0;
          const deliveryAmount = deliveryCost || 0;
          const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
          const taxAmount = (subtotalAfterDiscount + deliveryAmount) * 0.08;
          const totalAmount = subtotalAfterDiscount + deliveryAmount + taxAmount;

          const orderPayload = {
            items: items,
            total_amount: totalAmount,
            subtotal_amount: subtotalAfterDiscount,
            shipping_cost: deliveryAmount,
            tax_amount: taxAmount,
            delivery_option: 'standard',
            shipping_address: this.address || {},
            payment_method: 'card',
          };

          this.shopApi.createOrder(orderPayload).subscribe({
            next: (response: any) => {
              alert('Order placed successfully! Order #' + response.order_number);
              this.store.dispatch(CartActions.clearCart());
              this.store.dispatch(UserActions.loadOrders({ page: 1, pageSize: 3 }));
              localStorage.removeItem('cart');
              sessionStorage.removeItem('checkout_address');

              this.loading$
                .pipe(
                  filter((isLoading) => !isLoading),
                  take(1),
                )
                .subscribe(() => {
                  this.router.navigate(['/account/orders']);
                  this.isSubmitting = false;
                });
            },
            error: (error: any) => {
              console.error('Order creation error:', error);
              alert('Failed to place order: ' + (error.error?.message || error.message));
              this.isSubmitting = false;
            },
          });
        },
        error: (error: any) => {
          console.error('Error getting cart data:', error);
          alert('Failed to retrieve cart data');
          this.isSubmitting = false;
        },
      });
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

  /**
   * TrackBy function for cart items in *ngFor
   * Improves performance with OnPush change detection
   */
  trackByProductId(_index: number, item: CartItem): number {
    return item.product.id;
  }
}
