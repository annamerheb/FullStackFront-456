import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoaderComponent } from '../../../../components/skeleton-loader/skeleton-loader.component';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../../../../state/products/products.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsCount,
  selectDiscountedProducts,
  selectProductCatalogSummary,
  selectLowStockProducts,
  selectProductsByRating,
  selectCacheStatus,
  selectIsRevalidating,
  selectIsCacheStale,
} from '../../../../state/products/products.selectors';
import * as WishlistActions from '../../../../state/wishlist/wishlist.actions';
import {
  selectIsInWishlist,
  selectWishlistItems,
} from '../../../../state/wishlist/wishlist.selectors';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { getStockStatus, StockStatus } from '../../../../services/stock.utils';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  image: string;
  avgRating: number;
  stock: number;
  lowStockThreshold: number;
  discount?: number;
}

@Component({
  standalone: true,
  selector: 'app-products-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    SkeletonLoaderComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-7xl">
        <!-- Header Section -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Products</p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">Shop Collection</h1>
            <p class="mt-2 text-slate-600">Discover our curated selection of products</p>
          </div>
          <button
            mat-stroked-button
            routerLink="/app"
            class="w-full sm:w-auto !border-sky-500 !text-sky-600 hover:!bg-sky-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        <!-- Filters Card -->
        <div class="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
            Filters & Sort
          </h3>
          <form [formGroup]="filterForm" class="grid gap-4 md:grid-cols-3">
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
              <input matInput type="text" inputmode="decimal" formControlName="minRating" />
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
          </form>
        </div>

        <!-- Loading State - Skeleton Loader -->
        <app-skeleton-loader
          *ngIf="(loading$ | async) && !(error$ | async)"
          type="card"
          [count]="12"
        ></app-skeleton-loader>

        <!-- Error State with Retry Button -->
        <div
          *ngIf="error$ | async as error"
          class="mb-6 rounded-xl border-2 border-red-300 bg-red-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <mat-icon class="text-red-600 text-2xl">error_outline</mat-icon>
            <div>
              <p class="font-semibold text-red-900">Oops! Something went wrong</p>
              <p class="text-red-700 text-sm mt-1">{{ error }}</p>
            </div>
          </div>
          <button
            mat-raised-button
            (click)="retryLastRequest()"
            color="warn"
            class="flex-shrink-0 !rounded-lg !font-semibold"
          >
            <mat-icon class="text-sm mr-1">refresh</mat-icon>
            Try Again
          </button>
        </div>

        <!-- Empty State Template (defined before use) -->
        <ng-template #noProducts>
          <div
            class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 px-6 py-16 text-center"
          >
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <mat-icon class="text-2xl text-slate-500">shopping_cart</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-900">No products found</h3>
            <p class="mt-2 text-slate-600 max-w-md">
              No products match your current filters. Try adjusting your criteria or resetting all
              filters.
            </p>
            <button
              mat-raised-button
              (click)="resetFilters()"
              class="mt-6 !rounded-lg !font-semibold !bg-sky-600 !text-white hover:!bg-sky-700"
            >
              <mat-icon class="text-sm mr-1">restart_alt</mat-icon>
              Reset Filters
            </button>
          </div>
        </ng-template>

        <!-- Products Grid -->
        <div *ngIf="products$ | async as products; else noProducts">
          <div
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            *ngIf="(products?.length ?? 0) > 0 && !(loading$ | async)"
          >
            <div
              *ngFor="let product of products; trackBy: trackByProductId"
              class="group relative flex flex-col rounded-t-xl border border-slate-200 bg-white transition-all duration-300 hover:border-sky-300 hover:shadow-lg"
            >
              <!-- Image Section -->
              <div class="h-48 bg-slate-100 overflow-hidden rounded-t-xl">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <!-- Badges -->
              <div class="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <!-- Discount badge -->
                <div
                  *ngIf="product.discount !== null && product.discount !== undefined"
                  class="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg whitespace-nowrap"
                >
                  -{{ product.discount }}%
                </div>

                <!-- Stock badge -->
                <div
                  class="rounded-lg px-3 py-1 text-xs font-semibold shadow-lg whitespace-nowrap"
                  [ngClass]="{
                    'bg-green-600 text-white':
                      getStockStatus(product.stock, product.lowStockThreshold).status ===
                      StockStatus.IN_STOCK,
                    'bg-yellow-600 text-white':
                      getStockStatus(product.stock, product.lowStockThreshold).status ===
                      StockStatus.LOW_STOCK,
                    'bg-slate-500 text-white':
                      getStockStatus(product.stock, product.lowStockThreshold).status ===
                      StockStatus.OUT_OF_STOCK,
                  }"
                >
                  {{ getStockStatus(product.stock, product.lowStockThreshold).label }}
                </div>
              </div>

              <!-- Content Section -->
              <div class="flex flex-1 flex-col p-4">
                <!-- Title -->
                <h5
                  class="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition"
                >
                  {{ product.name }}
                </h5>

                <!-- Rating -->
                <div class="mb-3 flex items-center gap-1">
                  <span class="text-amber-400 text-sm">★</span>
                  <span class="text-xs font-semibold text-slate-700">
                    {{ product.avgRating | number: '1.1-1' }}
                  </span>
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
                    mat-stroked-button
                    [routerLink]="['/shop/products', product.id]"
                    class="flex-1 !h-9 !text-xs !font-semibold !rounded-lg !border-sky-500 !text-sky-600 hover:!bg-sky-50"
                  >
                    View Details
                  </button>
                  <button
                    mat-icon-button
                    (click)="toggleWishlist(product)"
                    [attr.aria-label]="
                      (selectIsInWishlist(product.id) | async)
                        ? 'Remove from wishlist: ' + product.name
                        : 'Add to wishlist: ' + product.name
                    "
                    [style.color]="(selectIsInWishlist(product.id) | async) ? '#0ea5e9' : '#cbd5e1'"
                    class="transition hover:text-sky-600"
                  >
                    <mat-icon class="text-lg" aria-hidden="true">{{
                      (selectIsInWishlist(product.id) | async) ? 'favorite' : 'favorite_border'
                    }}</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="(products?.length ?? 0) > 0" class="flex justify-center py-4">
            <mat-paginator
              [length]="totalProducts"
              [pageSize]="pageSize"
              [pageSizeOptions]="[]"
              hidePageSize="true"
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
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
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

      button[mat-icon-button] mat-icon {
        color: inherit !important;
        fill: var(--color-primary) !important;
      }

      .mat-mdc-icon-button {
        color: var(--color-primary) !important;
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
  pageSize = 8;
  currentPage = 0;
  private destroy$ = new Subject<void>();
  private filterChanged$ = new Subject<void>();
  private urlRestored$ = new BehaviorSubject<boolean>(false);
  wishlistItems: any[] = [];
  private lastFilters: any = null;

  // New composed selectors for catalog analytics
  discountedProducts$: Observable<any>;
  catalogSummary$: Observable<any>;
  lowStockProducts$: Observable<Product[]>;
  highRatedProducts$: Observable<Product[]>;

  // Cache status selectors for "stale-while-revalidate" pattern
  cacheStatus$: Observable<any>;
  isRevalidating$: Observable<boolean>;
  isCacheStale$: Observable<boolean>;

  // Stock utilities
  getStockStatus = getStockStatus;
  StockStatus = StockStatus;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      pageSize: [8],
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

    // Subscribe to composed selectors
    this.discountedProducts$ = this.store.select(selectDiscountedProducts);
    this.catalogSummary$ = this.store.select(selectProductCatalogSummary);
    this.lowStockProducts$ = this.store.select(selectLowStockProducts(10)); // Threshold: 10 items
    this.highRatedProducts$ = this.store.select(selectProductsByRating(4.0)); // Min rating: 4.0

    // Cache status selectors for monitoring
    this.cacheStatus$ = this.store.select(selectCacheStatus);
    this.isRevalidating$ = this.store.select(selectIsRevalidating);
    this.isCacheStale$ = this.store.select(selectIsCacheStale);

    this.store
      .select(selectWishlistItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: any) => {
        this.wishlistItems = items;
      });
  }

  ngOnInit(): void {
    // Step 1: Restore filters from URL on init (Back/Forward support)
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.restoreFiltersFromUrl(params);
          this.urlRestored$.next(true);
          return this.urlRestored$;
        }),
      )
      .subscribe();

    // Step 2: Setup debounced filter changes (500ms) with API spam prevention
    this.filterForm.valueChanges
      .pipe(
        // Wait 500ms after user stops typing to avoid API spam
        debounceTime(500),
        // Only react to actual changes
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        // Ensure URL was restored before processing changes
        switchMap(() => {
          if (!this.urlRestored$.getValue()) {
            return this.urlRestored$.pipe(
              distinctUntilChanged(),
              switchMap(() => {
                return this.applyFilterChanges();
              }),
            );
          }
          return this.applyFilterChanges();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    // Step 3: Initial products load with restored filters
    this.applyFilters();
  }

  /**
   * Apply filter changes with API call and URL sync
   */
  private applyFilterChanges(): Observable<void> {
    return new Observable((observer) => {
      this.currentPage = 0; // Reset to first page on filter change
      this.pageSize = Number(this.filterForm.get('pageSize')?.value) || 8;

      // Sync URL with current filters
      this.syncFiltersToUrl();

      // Load products
      this.loadProducts();

      observer.next();
      observer.complete();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.filterChanged$.complete();
  }

  /**
   * Restore filter values from URL query params (for Back/Forward support)
   * Handles the browser back/forward navigation to restore the exact catalog state
   */
  private restoreFiltersFromUrl(params: any): void {
    if (Object.keys(params).length > 0) {
      const pageSize = params['pageSize'] ? parseInt(params['pageSize'], 10) : 8;
      const minRating = params['minRating'] ? parseFloat(params['minRating']) : 0;
      const ordering = params['ordering'] || '';
      const page = params['page'] ? parseInt(params['page'], 10) : 0;

      // Update form without triggering valueChanges to avoid duplicate API calls
      this.filterForm.patchValue({ pageSize, minRating, ordering }, { emitEvent: false });

      this.currentPage = page;
      this.pageSize = pageSize;

      // Load products with restored filters
      this.loadProducts();
    }
  }

  /**
   * Sync current filter values to URL query params
   * Ensures browser history has all necessary state to restore catalog state via back/forward
   */
  private syncFiltersToUrl(): void {
    const pageSize = Number(this.filterForm.get('pageSize')?.value) || 8;
    const minRating = Number(this.filterForm.get('minRating')?.value) || 0;
    const ordering = this.filterForm.get('ordering')?.value || '';

    const queryParams: any = {
      pageSize: pageSize.toString(),
      minRating: minRating.toString(),
      page: this.currentPage.toString(),
    };

    // Only add ordering if it's not the default (empty) value
    if (ordering) {
      queryParams['ordering'] = ordering;
    }

    // Update URL without reloading the component
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      // Replace history instead of adding new entry when just filtering
      queryParamsHandling: 'merge',
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.syncFiltersToUrl();
    this.loadProducts();
  }

  /**
   * Reset filters to default values and reload products
   */
  resetFilters(): void {
    this.filterForm.reset(
      {
        pageSize: 8,
        minRating: 0,
        ordering: '',
      },
      { emitEvent: false }, // Prevent triggering debounce
    );
    this.currentPage = 0;
    this.syncFiltersToUrl();
    this.loadProducts();
  }

  onPageChange(event: any): void {
    console.log('Page change event:', event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log('Updated currentPage and pageSize:', {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
    this.filterForm.patchValue({ pageSize: this.pageSize }, { emitEvent: false });
    this.syncFiltersToUrl();
    this.loadProducts();
  }

  /**
   * Retry last request if API error occurred
   */
  retryLastRequest(): void {
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
            stock: product.stock,
            lowStockThreshold: product.lowStockThreshold,
            created_at: product.created_at,
            avgRating: product.avgRating,
            discount: product.discount,
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

  /**
   * Load products with current filters
   * Dispatches action to NgRx store which will trigger API call if debounce is passed
   */
  private loadProducts(): void {
    const pageSize = this.pageSize;
    const minRating = Number(this.filterForm.get('minRating')?.value) || 0;
    const ordering = this.filterForm.get('ordering')?.value || '';

    const filters = {
      page: this.currentPage,
      pageSize,
      minRating,
      ordering,
    };

    this.lastFilters = filters;
    console.log('loadProducts() called with filters:', filters);
    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }

  // TrackBy function for product list
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
