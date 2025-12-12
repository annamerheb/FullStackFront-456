import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import * as CartActions from '../../../../state/cart/cart.actions';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartEmpty,
  selectStockValidationErrors,
  selectCartSummary,
  selectCartAveragePrice,
  selectHighValueCartItems,
} from '../../../../state/cart/cart.selectors';
import { CartItem } from '../../../../state/cart/cart.models';
import { CartItemComponent } from './cart-item.component';
import { CartSummaryComponent } from './cart-summary.component';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CartItemComponent,
    CartSummaryComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-8">
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-3xl font-medium text-slate-500">Shopping Cart</h3>
            <p class="mt-1 text-slate-600">Review and manage your items</p>
          </div>

          <button
            mat-stroked-button
            color="primary"
            routerLink="/shop/products"
            class="h-11 self-start !border-sky-500 !text-sky-700 hover:!bg-sky-50"
          >
            <mat-icon class="mr-2">arrow_back</mat-icon>
            Continue Shopping
          </button>
        </div>

        <div
          *ngIf="isEmpty$ | async"
          class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
          >
            <mat-icon class="text-3xl text-slate-400">shopping_cart</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <p class="mt-2 text-slate-600">Add some products to get started</p>
          <button
            mat-raised-button
            color="primary"
            routerLink="/shop/products"
            class="mt-6 h-11 px-8 !bg-gradient-to-r !from-sky-500 !to-cyan-600 !text-white font-semibold"
          >
            <mat-icon class="mr-2">shopping_bag</mat-icon>
            Start Shopping
          </button>
        </div>

        <div *ngIf="!(isEmpty$ | async)" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <!-- Stock Validation Errors Alert -->
            <div
              *ngIf="stockValidationErrors$ | async as errors"
              [ngClass]="
                errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              "
              class="mb-4 rounded-lg border p-4"
            >
              <div class="flex items-start gap-3">
                <mat-icon [ngClass]="errors.length > 0 ? 'text-red-600' : 'text-green-600'">
                  {{ errors.length > 0 ? 'error' : 'check_circle' }}
                </mat-icon>
                <div class="flex-1">
                  <h4
                    [ngClass]="errors.length > 0 ? 'text-red-900' : 'text-green-900'"
                    class="font-semibold"
                  >
                    {{ errors.length > 0 ? 'Problèmes de stock détectés' : 'Stock validé' }}
                  </h4>
                  <ul *ngIf="errors.length > 0" class="mt-2 space-y-1">
                    <li
                      *ngFor="let error of errors; trackBy: trackByIndex"
                      [ngClass]="'text-red-700'"
                      class="text-sm"
                    >
                      ✗ {{ error }}
                    </li>
                  </ul>
                  <p *ngIf="errors.length === 0" class="mt-1 text-sm text-green-700">
                    ✓ Tous les articles en stock sont disponibles
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm">
              <h3 class="mb-6 text-lg font-medium text-slate-500">
                Items <span class="text-sky-600">({{ cartCount$ | async }})</span>
              </h3>
              <app-cart-item
                *ngFor="let item of cartItems$ | async; trackBy: trackByProductId"
                [item]="item"
                (quantityChanged)="updateQuantity(item.product.id, $event)"
                (removed)="removeItem($event.productId)"
              ></app-cart-item>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="sticky top-20 space-y-4">
              <app-cart-summary
                [cart]="{
                  itemCount: (cartCount$ | async) || 0,
                  totalPrice: (cartTotal$ | async) || 0,
                }"
              ></app-cart-summary>

              <button
                mat-raised-button
                color="primary"
                routerLink="/shop/checkout/summary"
                class="mt-4 w-full h-12 !rounded-lg font-semibold"
              >
                <mat-icon class="mr-2">payment</mat-icon>
                Proceed to Checkout
              </button>

              <button
                mat-stroked-button
                (click)="clearCart()"
                class="w-full !border-red-300 !text-red-600 hover:!bg-red-50"
              >
                <mat-icon class="mr-2">delete</mat-icon>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CartPageComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartCount$: Observable<number>;
  isEmpty$: Observable<boolean>;
  stockValidationErrors$: Observable<string[]>;
  // New composed selectors for advanced cart analytics
  cartSummary$: Observable<any>;
  avgPrice$: Observable<number>;
  highValueItems$: Observable<CartItem[]>;

  constructor(private store: Store) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
    this.cartCount$ = this.store.select(selectCartCount);
    this.isEmpty$ = this.store.select(selectCartEmpty);
    this.stockValidationErrors$ = this.store.select(selectStockValidationErrors);
    // Subscribe to composed selectors
    this.cartSummary$ = this.store.select(selectCartSummary);
    this.avgPrice$ = this.store.select(selectCartAveragePrice);
    this.highValueItems$ = this.store.select(selectHighValueCartItems(50)); // Items with price > 50
  }

  ngOnInit() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      this.store.dispatch(CartActions.loadCartFromStorage({ items: cart }));
    }
  }

  updateQuantity(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateCartItemQuantity({ productId, quantity }));
  }

  removeItem(productId: number) {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.store.dispatch(CartActions.clearCart());
    }
  }

  // TrackBy function for cart items
  trackByProductId(index: number, item: any): number {
    return item.product.id;
  }

  /**
   * TrackBy function for error list in *ngFor
   * Improves performance by tracking errors by their index
   */
  trackByIndex(index: number): number {
    return index;
  }
}
