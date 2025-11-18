import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import {
  selectRating,
  selectRatingLoading,
  selectRatingError,
} from '../state/products/products.selectors';
import { Observable } from 'rxjs';

export interface ProductRating {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-product-rating-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Ratings</p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Product Ratings</h1>
              <p class="mt-1 text-sm text-slate-600">Check the average rating and reviews count</p>
            </div>

            <button
              mat-stroked-button
              color="primary"
              routerLink="/app"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50"
            >
              ← Back to dashboard
            </button>
          </div>

          <div class="p-4">
            <form
              [formGroup]="searchForm"
              (ngSubmit)="searchRating()"
              class="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <mat-form-field appearance="fill" class="flex-1 text-sm">
                <mat-label>Product ID</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="productId"
                  placeholder="e.g. 1"
                  class="text-sm"
                />
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="searchForm.invalid || (loading$ | async)"
                class="h-11 w-full sm:w-auto"
              >
                <ng-container *ngIf="loading$ | async; else showTxt">
                  <mat-spinner diameter="20"></mat-spinner>
                </ng-container>
                <ng-template #showTxt>Get Rating</ng-template>
              </button>
            </form>

            <div
              *ngIf="error$ | async as e"
              class="mt-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm"
            >
              {{ e }}
            </div>
          </div>
        </div>

        <div *ngIf="loading$ | async" class="flex justify-center py-10">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngIf="rating$ | async as r">
          <div *ngIf="r; else noRating">
            <mat-card class="rating-card">
              <span class="chip">Product #{{ r.product_id }}</span>

              <div class="rating-value">
                <h2 class="avg">{{ r.avg_rating | number: '1.1-1' }}</h2>

                <div class="stars">
                  <span
                    *ngFor="let s of [1, 2, 3, 4, 5]"
                    [class.filled]="s <= Math.round(r.avg_rating)"
                  >
                    ★
                  </span>
                </div>

                <p class="reviews">
                  Based on <strong>{{ r.count }}</strong> reviews
                </p>
              </div>
            </mat-card>
          </div>

          <ng-template #noRating>
            <mat-card class="empty-card">
              <mat-icon>info</mat-icon>
              No rating found for this product.
            </mat-card>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: radial-gradient(circle at top left, #439cf5 0, #b6dcff 40%, #62adf2 100%);
      }

      .rating-card {
        max-width: 700px;
        margin: 0 auto;
        padding: 30px 26px;
        border-radius: 18px;
        background: white;
        border: 1px solid #dde2e7;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        text-align: center;
      }

      .chip {
        background: #e3f2fd;
        color: #1976d2;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
      }

      .rating-value {
        margin-top: 35px;
      }

      .avg {
        margin: 0;
        font-size: 52px;
        font-weight: 700;
        color: #1976d2;
      }

      .stars {
        margin-top: 40px;
        font-size: 32px;
        color: #ffd54f;
        letter-spacing: 4px;
      }

      .stars span {
        opacity: 0.35;
      }

      .stars span.filled {
        opacity: 1;
      }

      .reviews {
        margin-top: 12px;
        color: #495057;
        font-size: 14px;
      }

      .empty-card {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
        border-radius: 14px;
        background: #e3f2fd;
        color: #1976d2;
        border: 1px dashed #1976d2;
      }

      .empty-card mat-icon {
        font-size: 22px;
      }

      @media (max-width: 600px) {
        .rating-card {
          padding: 20px;
        }
      }
    `,
  ],
})
export class ProductRatingPageComponent {
  Math = Math;

  searchForm: FormGroup;
  rating$: Observable<ProductRating | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.searchForm = this.fb.group({
      productId: ['', [Validators.required, Validators.min(1)]],
    });

    this.rating$ = this.store.select(selectRating);
    this.loading$ = this.store.select(selectRatingLoading);
    this.error$ = this.store.select(selectRatingError);
  }

  searchRating() {
    if (this.searchForm.invalid) return;
    const productId = this.searchForm.value.productId;
    this.store.dispatch(ProductsActions.loadRating({ productId }));
  }
}
