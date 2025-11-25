import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsCount,
} from '../state/products/products.selectors';
import * as WishlistActions from '../state/wishlist/wishlist.actions';
import { selectIsInWishlist, selectWishlistItems } from '../state/wishlist/wishlist.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  image: string;
  avgRating: number;
  stock: number;
  discount?: number;
}

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white px-4 py-12">
      <div class="mx-auto max-w-7xl">
        <!-- Header Section -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Products</p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">Shop Collection</h1>
            <p class="mt-2 text-slate-600">Discover our curated selection of products</p>
          </div>
          <button
            mat-raised-button
            color="primary"
            routerLink="/app"
            class="w-full sm:w-auto"
          >
            ← Back to Dashboard
          </button>
        </div>

        <!-- Filters Card -->
        <div class="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Filters & Sort
          </h3>
          <form
            [formGroup]="filterForm"
            (ngSubmit)="applyFilters()"
            class="grid gap-4 md:grid-cols-4"
          >
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Items per Page</mat-label>
              <mat-select formControlName="pageSize">
                <mat-option value="6">6 items</mat-option>
                <mat-option value="12">12 items</mat-option>
                <mat-option value="24">24 items</mat-option>
                <mat-option value="48">48 items</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Min Rating</mat-label>
              <input
                matInput
                type="text"
                inputmode="decimal"
                formControlName="minRating"
              />
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Sort By</mat-label>
              <mat-select formControlName="ordering">
                <mat-option value="">Default</mat-option>
                <mat-option value="price">Price: Low to High</mat-option>
                <mat-option value="-price">Price: High to Low</mat-option>
                <mat-option value="name">Name: A–Z</mat-option>
              </mat-select>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="h-11 w-full"
            >
              Apply Filters
            </button>
          </form>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async" class="flex justify-center py-20">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Error State -->
        <div
          *ngIf="error$ | async as error"
          class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          ⚠️ {{ error }}
        </div>

        <!-- Products Grid -->
        <div *ngIf="products$ | async as products">
          <div
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            *ngIf="(products?.length ?? 0) > 0"
          >
            <div
              *ngFor="let product of products"
              class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-sky-300 hover:shadow-lg"
            >
              <!-- Image Section -->
              <div class="relative h-48 overflow-hidden bg-slate-100">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <!-- Badges -->
                <div class="absolute inset-0 flex flex-col gap-2 p-3">
                  <div class="ml-auto flex flex-col gap-2">
                    <div
                      *ngIf="product.discount"
                      class="w-fit rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white"
                    >
                      -{{ product.discount }}% OFF
                    </div>
                    <div
                      [ngClass]="{
                        'bg-green-500': product.stock > 20,
                        'bg-yellow-500': product.stock > 5 && product.stock <= 20,
                        'bg-red-500': product.stock <= 5,
                      }"
                      class="w-fit rounded-lg px-2 py-1 text-xs font-semibold text-white"
                    >
                      {{ product.stock }} left
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="flex flex-1 flex-col p-4">
                <!-- Title -->
                <h3
                  class="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition"
                >
                  {{ product.name }}
                </h3>

                <!-- Rating -->
                <div class="mb-3 flex items-center gap-1">
                  <span class="text-amber-400 text-sm">★</span>
                  <span class="text-xs font-semibold text-slate-700">
                    {{ product.avgRating | number: '1.1-1' }}
                  </span>
                  <span class="text-xs text-slate-500">({{ product.reviews_count }})</span>
                </div>

                <!-- Prices -->
                <div class="mb-4 space-y-1">
                  <div *ngIf="product.discount" class="flex items-center gap-2">
                    <span class="text-xs line-through text-slate-500">
                      {{ product.price | currency: 'EUR' }}
                    </span>
                    <span class="text-sm font-bold text-green-600">
                      {{ getDiscountedPrice(product) | currency: 'EUR' }}
                    </span>
                  </div>
                  <div *ngIf="!product.discount" class="text-sm font-bold text-slate-900">
                    {{ product.price | currency: 'EUR' }}
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-auto flex gap-2">
                  <button
                    mat-raised-button
                    color="primary"
                    [routerLink]="['/shop/products', product.id]"
                    class="flex-1 !h-9 !text-xs !font-semibold !rounded-lg"
                  >
                    View Details
                  </button>
                  <button
                    mat-icon-button
                    (click)="toggleWishlist(product)"
                    [class.text-red-500]="selectIsInWishlist(product.id) | async"
                    class="text-slate-400 transition hover:text-red-500"
                  >
                    <mat-icon class="text-lg">{{
                      (selectIsInWishlist(product.id) | async) ? 'favorite' : 'favorite_border'
                    }}</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            *ngIf="(products?.length ?? 0) === 0"
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-slate-500"
          >
            <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500"
            >
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <p class="text-sm font-medium">No products found</p>
            <p class="mt-1 text-xs text-slate-400">
              Try adjusting your filters or reset the page &amp; rating.
            </p>
          </div>

          <div *ngIf="(products?.length ?? 0) > 0" class="flex justify-center py-4">
            <mat-paginator
              [length]="totalProducts"
              [pageSize]="pageSize"
              [pageSizeOptions]="[6, 12, 24, 48]"
              (page)="onPageChange($event)"
              showFirstLastButtons
            ></mat-paginator>
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
        background: radial-gradient(circle at top left, #439cf5 0, #b6dcff 40%, #62adf2 100%);
      }

      .product-card {
        border-radius: 1rem;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
        overflow: hidden;
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          border-color 0.18s ease;
      }

      .product-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
        border-color: #bfdbfe;
      }

      .mat-mdc-select-panel,
      .mat-mdc-option,
      .mat-mdc-select-value-text,
      .mat-mdc-form-field,
      .mat-mdc-input-element {
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif !important;
      }
    `,
  ],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalProducts$: Observable<number>;
  totalProducts = 0;
  pageSize = 6;
  currentPage = 0;
  private destroy$ = new Subject<void>();
  wishlistItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.filterForm = this.fb.group({
      pageSize: [6],
      minRating: [0],
      ordering: [''],
    });

    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
    this.totalProducts$ = this.store.select(selectProductsCount);
    this.totalProducts$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.totalProducts = count;
    });

    // Subscribe to wishlist items to keep track
    this.store
      .select(selectWishlistItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: any) => {
        this.wishlistItems = items;
      });
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterForm.patchValue({ pageSize: event.pageSize });
    this.loadProducts();
  }

  selectIsInWishlist(productId: number): Observable<boolean> {
    return this.store.select(selectIsInWishlist(productId));
  }

  toggleWishlist(product: Product): void {
    const isInWishlist = this.wishlistItems.some((item) => item.id === product.id);

    if (isInWishlist) {
      this.store.dispatch(WishlistActions.removeFromWishlist({ productId: product.id }));
    } else {
      this.store.dispatch(
        WishlistActions.addToWishlist({
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          },
        }),
      );
    }
  }

  getDiscountedPrice(product: Product): number {
    if (!product.discount) {
      return product.price;
    }
    return product.price - (product.price * product.discount) / 100;
  }

  private loadProducts(): void {
    const pageSize = Number(this.filterForm.get('pageSize')?.value) || 6;
    const minRating = Number(this.filterForm.get('minRating')?.value) || 0;

    const filters = {
      page: this.currentPage,
      pageSize,
      minRating,
      ordering: this.filterForm.get('ordering')?.value || '',
    };

    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }
}
