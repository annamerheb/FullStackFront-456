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

export interface Product {
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
  id?: number;
  image?: string;
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
      >
        <mat-icon [class.text-red-500]="isInWishlist$ | async">{{
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

  isInWishlist$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isInWishlist$ = this.store.select(selectIsInWishlist(this.id));
  }

  toggleWishlist() {
    this.isInWishlist$.pipe(take(1)).subscribe((isInWishlist) => {
      if (isInWishlist) {
        this.store.dispatch(WishlistActions.removeFromWishlist({ productId: this.id }));
      } else {
        this.store.dispatch(
          WishlistActions.addToWishlist({
            product: { id: this.id, name: this.name, price: this.price, image: this.image || '' },
          }),
        );
      }
    });
  }
}
