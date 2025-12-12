import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';
import {
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistProducts,
  selectWishlistProductsByStock,
  selectWishlistProductsByDiscount,
} from '../../../../state/wishlist/wishlist.selectors';
import * as WishlistActions from '../../../../state/wishlist/wishlist.actions';
import * as CartActions from '../../../../state/cart/cart.actions';
import { WishlistItem } from '../../../../state/wishlist/wishlist.actions';
import { getStockStatus, StockStatus } from '../../../../services/stock.utils';

@Component({
  standalone: true,
  selector: 'app-wishlist-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-10">
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                My Wishlist
              </p>
              <h3 class="mt-2 text-3xl font-medium text-slate-500">Wishlist</h3>
              <p class="mt-1 text-sm text-slate-600">Items you've saved for later</p>
            </div>

            <button
              mat-stroked-button
              routerLink="/shop/products"
              class="!border-sky-500 !text-sky-600 hover:!bg-sky-50"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        <div *ngIf="wishlistItems$ | async as items" class="space-y-4">
          <div
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            *ngIf="(items?.length ?? 0) > 0"
          >
            <div
              *ngFor="let item of items; trackBy: trackByItemId"
              class="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                class="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200"
              >
                <img
                  [src]="item.image"
                  [alt]="item.name"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                ></div>
                <!-- Stock Status Badge -->
                <div
                  class="absolute top-3 right-3 rounded-lg px-3 py-1 text-xs font-semibold shadow-lg whitespace-nowrap"
                  [ngClass]="{
                    'bg-green-600 text-white':
                      item.stock !== undefined &&
                      getStockStatus(item.stock, item.lowStockThreshold || 0).status ===
                        StockStatus.IN_STOCK,
                    'bg-yellow-600 text-white':
                      item.stock !== undefined &&
                      getStockStatus(item.stock, item.lowStockThreshold || 0).status ===
                        StockStatus.LOW_STOCK,
                    'bg-slate-500 text-white':
                      item.stock !== undefined &&
                      getStockStatus(item.stock, item.lowStockThreshold || 0).status ===
                        StockStatus.OUT_OF_STOCK,
                  }"
                >
                  {{
                    item.stock !== undefined
                      ? getStockStatus(item.stock, item.lowStockThreshold || 0).label
                      : ''
                  }}
                </div>
              </div>

              <div class="flex flex-col p-4">
                <div class="mb-3 flex items-start justify-between gap-2">
                  <span
                    class="inline-flex items-center rounded-lg bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700"
                  >
                    {{ item.price | currency: 'EUR' }}
                  </span>
                  <span class="text-xs font-medium text-slate-500"> ID: {{ item.id }} </span>
                </div>

                <h4
                  class="mb-2 line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-sky-600"
                >
                  {{ item.name }}
                </h4>

                <div class="mt-auto flex gap-2">
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="addToCart(item)"
                    [disabled]="item.stock === 0"
                    class="flex-1 !rounded-lg !bg-gradient-to-r !from-sky-500 !to-cyan-600 !text-white text-xs font-semibold h-9"
                  >
                    <mat-icon class="mr-1">shopping_cart</mat-icon>
                    {{ item.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                  </button>
                  <button
                    mat-icon-button
                    (click)="removeFromWishlist(item.id)"
                    class="!text-red-500 transition hover:!text-red-700"
                    title="Remove from wishlist"
                  >
                    <mat-icon>favorite</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            *ngIf="(items?.length ?? 0) === 0"
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center text-slate-500"
          >
            <mat-icon class="mb-3 text-6xl text-slate-300">favorite_border</mat-icon>
            <p class="text-lg font-medium">Your wishlist is empty</p>
            <p class="mt-1 text-sm text-slate-400">
              Start adding items to your wishlist by clicking the heart icon on products
            </p>
            <button
              mat-raised-button
              color="primary"
              routerLink="/shop/products"
              class="mt-6 !bg-gradient-to-r !from-sky-500 !to-cyan-600 !text-white"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
        color: #0f172a;
      }

      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }

      mat-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class WishlistPageComponent implements OnInit {
  wishlistItems$: Observable<WishlistItem[]>;
  wishlistCount$: Observable<number>;
  // New composed selectors for wishlist analytics
  wishlistProducts$: Observable<any>;
  inStockProducts$: Observable<any>;
  bestDealsProducts$: Observable<any>;
  StockStatus = StockStatus;

  constructor(private store: Store) {
    this.wishlistItems$ = this.store.select(selectWishlistItems);
    this.wishlistCount$ = this.store.select(selectWishlistCount);
    // Subscribe to composed selectors
    this.wishlistProducts$ = this.store.select(selectWishlistProducts);
    this.inStockProducts$ = this.store.select(selectWishlistProductsByStock);
    this.bestDealsProducts$ = this.store.select(selectWishlistProductsByDiscount);
  }

  ngOnInit(): void {}

  getStockStatus(stock: number, lowStockThreshold: number) {
    return getStockStatus(stock, lowStockThreshold);
  }

  removeFromWishlist(productId: number): void {
    this.store.dispatch(WishlistActions.removeFromWishlist({ productId }));
  }

  addToCart(item: WishlistItem): void {
    // Prevent adding out-of-stock items
    if ((item.stock || 0) === 0) {
      alert('Ce produit est en rupture de stock');
      return;
    }

    this.store.dispatch(
      CartActions.addToCart({
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          created_at: item.created_at || new Date().toISOString(),
          image: item.image,
          avgRating: item.avgRating || 0,
          stock: item.stock || 100,
          lowStockThreshold: item.lowStockThreshold || 20,
          discount: item.discount,
        },
        quantity: 1,
      }),
    );
    alert('Product added to cart!');
  }

  // TrackBy function for wishlist items
  trackByItemId(index: number, item: any): number {
    return item.id;
  }
}
