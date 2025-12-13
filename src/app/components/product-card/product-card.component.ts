import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { selectIsInWishlist } from '../../state/wishlist/wishlist.selectors';
import * as WishlistActions from '../../state/wishlist/wishlist.actions';
import { getStockStatus, StockStatus } from '../../services/stock.utils';

export interface Product {
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
  id?: number;
  image?: string;
  stock?: number;
  lowStockThreshold?: number;
}

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div
      class="relative h-full rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <button
        mat-icon-button
        class="absolute top-2 right-2 z-10 rounded-full bg-white shadow-md hover:bg-slate-100"
        [class.!bg-red-50]="isInWishlist$ | async"
        (click)="toggleWishlist()"
        [attr.aria-label]="
          (isInWishlist$ | async)
            ? 'Remove ' + name + ' from wishlist'
            : 'Add ' + name + ' to wishlist'
        "
      >
        <mat-icon [class.text-red-500]="isInWishlist$ | async" aria-hidden="true">{{
          (isInWishlist$ | async) ? 'favorite' : 'favorite_border'
        }}</mat-icon>
      </button>

      <div class="flex-1 flex flex-col p-4 space-y-3">
        <div>
          <h3 class="font-semibold text-slate-900 line-clamp-2">{{ name }}</h3>
          <p class="text-sm text-slate-600">{{ created_at | date: 'short' }}</p>
        </div>

        <p class="text-xl font-bold text-sky-600">\${{ price }}</p>

        <div class="flex items-center gap-2">
          <span class="text-amber-400">★</span>
          <span class="font-semibold text-slate-900">{{ avgRating }}/5</span>
        </div>

        <!-- Stock Status Badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs w-fit"
          [ngClass]="{
            'bg-green-100 text-green-700':
              getStockStatus(stock, lowStockThreshold).status === StockStatus.IN_STOCK,
            'bg-yellow-100 text-yellow-700':
              getStockStatus(stock, lowStockThreshold).status === StockStatus.LOW_STOCK,
            'bg-slate-100 text-slate-700':
              getStockStatus(stock, lowStockThreshold).status === StockStatus.OUT_OF_STOCK,
          }"
        >
          <mat-icon class="text-sm">{{ stock > 0 ? 'check_circle' : 'error' }}</mat-icon>
          <span>{{ getStockStatus(stock, lowStockThreshold).label }}</span>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent implements Product, OnInit {
  @Input() name!: string;
  @Input() price!: number;
  @Input() created_at!: string;
  @Input() avgRating!: number;
  @Input() id!: number;
  @Input() image?: string;
  @Input() stock: number = 0;
  @Input() lowStockThreshold: number = 0;

  isInWishlist$!: Observable<boolean>;
  StockStatus = StockStatus;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isInWishlist$ = this.store.select(selectIsInWishlist(this.id));
  }

  getStockStatus(stock: number, lowStockThreshold: number) {
    return getStockStatus(stock, lowStockThreshold);
  }

  toggleWishlist() {
    this.isInWishlist$.pipe(take(1)).subscribe((isInWishlist) => {
      if (isInWishlist) {
        this.store.dispatch(WishlistActions.removeFromWishlist({ productId: this.id }));
      } else {
        this.store.dispatch(
          WishlistActions.addToWishlist({
            product: {
              id: this.id,
              name: this.name,
              price: this.price,
              image: this.image || '',
              stock: this.stock,
              lowStockThreshold: this.lowStockThreshold,
            },
          }),
        );
      }
    });
  }
}
