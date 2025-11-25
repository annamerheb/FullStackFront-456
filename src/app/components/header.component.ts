import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { selectCartCount } from '../state/cart/cart.selectors';
import { selectWishlistCount } from '../state/wishlist/wishlist.selectors';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';
import * as AuthActions from '../state/auth/auth.actions';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  template: `
    <header
      class="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          routerLink="/"
          class="group flex items-center gap-2 text-lg font-bold text-slate-900 transition hover:text-sky-600 cursor-pointer"
        >
          <mat-icon class="brand-icon !text-sky-500">storefront</mat-icon>
          <span class="brand-name hidden sm:inline">My Shop</span>
        </button>

        <nav class="hidden md:flex items-center gap-8">
          <button
            routerLink="/"
            class="text-sm font-medium text-slate-600 transition hover:text-sky-600 cursor-pointer"
          >
            Home
          </button>
          <button
            routerLink="/app"
            class="text-sm font-medium text-slate-600 transition hover:text-sky-600 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            routerLink="/shop/products"
            routerLinkActive="active"
            class="text-sm font-medium text-slate-600 transition hover:text-sky-600 cursor-pointer"
          >
            Products
          </button>

          <button
            routerLink="/shop/rating"
            class="text-sm font-medium text-slate-600 transition hover:text-sky-600 cursor-pointer"
          >
            Ratings
          </button>
          <button
            routerLink="/dev"
            class="text-sm font-medium text-slate-600 transition hover:text-sky-600 cursor-pointer"
          >
            Dev
          </button>
        </nav>

        <div class="flex items-center gap-2">
          <button
            mat-icon-button
            routerLink="/shop/wishlist"
            class="relative text-slate-600 transition hover:text-red-600"
            [attr.aria-label]="'Wishlist: ' + (wishlistCount$ | async) + ' items'"
          >
            <mat-icon>favorite</mat-icon>
            <span
              *ngIf="wishlistCount$ | async as count"
              [class.hidden]="count === 0"
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ count }}
            </span>
          </button>

          <button
            mat-icon-button
            routerLink="/shop/cart"
            class="relative text-slate-600 transition hover:text-sky-600"
            [attr.aria-label]="'Cart: ' + (cartCount$ | async) + ' items'"
          >
            <mat-icon>shopping_cart</mat-icon>
            <span
              *ngIf="cartCount$ | async as count"
              [class.hidden]="count === 0"
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ count }}
            </span>
          </button>

          <button
            *ngIf="!(isAuthenticated$ | async)"
            mat-stroked-button
            routerLink="/login"
            class="hidden sm:inline !border-sky-500 !text-sky-600 hover:!bg-sky-50"
          >
            <mat-icon class="mr-2">person</mat-icon>
            Sign In
          </button>

          <button
            *ngIf="isAuthenticated$ | async"
            [matMenuTriggerFor]="userMenu"
            mat-stroked-button
            class="hidden sm:inline !border-sky-500 !text-sky-600 hover:!bg-sky-50"
          >
            <mat-icon class="mr-2">account_circle</mat-icon>
            Account
          </button>

          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
            <button mat-menu-item routerLink="/shop/wishlist">
              <mat-icon>favorite</mat-icon>
              <span>My Wishlist</span>
            </button>
            <button mat-menu-item routerLink="/shop/cart">
              <mat-icon>shopping_cart</mat-icon>
              <span>My Cart</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HeaderComponent {
  cartCount$: Observable<number>;
  wishlistCount$: Observable<number>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.cartCount$ = this.store.select(selectCartCount);
    this.wishlistCount$ = this.store.select(selectWishlistCount);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    localStorage.removeItem('cart');
    sessionStorage.removeItem('checkout_address');
    this.router.navigate(['/login']);
  }
}
