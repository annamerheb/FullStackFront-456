import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewsSectionComponent } from './reviews-section.component';
import { ProductDetailSkeletonComponent } from './product-details-skeleton.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product } from '../../../../services/types';
import * as CartActions from '../../../../state/cart/cart.actions';
import * as WishlistActions from '../../../../state/wishlist/wishlist.actions';
import { selectIsInWishlist } from '../../../../state/wishlist/wishlist.selectors';
import { ShopApiService } from '../../../../services/shop-api.service';
import { finalize } from 'rxjs/operators';
import { isInStock, getStockStatus, StockStatus } from '../../../../services/stock.utils';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ReviewsSectionComponent,
    ProductDetailSkeletonComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-5xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Product Details
            </p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">{{ product?.name }}</h1>
          </div>
          <div class="flex gap-3">
            <button
              mat-icon-button
              class="!rounded-full border border-slate-200 bg-white hover:!bg-slate-100"
              [class.!bg-blue-50]="isInWishlist$ | async"
              [class.!hover:bg-blue-50]="isInWishlist$ | async"
              (click)="toggleWishlist()"
              [attr.aria-label]="
                (isInWishlist$ | async) ? 'Remove from wishlist' : 'Add to wishlist'
              "
            >
              <mat-icon
                aria-hidden="true"
                [class.text-slate-400]="!(isInWishlist$ | async)"
                [ngStyle]="
                  (isInWishlist$ | async) ? { color: 'var(--color-primary) !important' } : {}
                "
                >{{ (isInWishlist$ | async) ? 'favorite' : 'favorite_border' }}</mat-icon
              >
            </button>
            <button
              mat-raised-button
              color="primary"
              routerLink="/shop/products"
              aria-label="Back to Products"
            >
              ← Back to Products
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div
          *ngIf="product"
          class="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div class="grid gap-8 p-8 md:grid-cols-2">
            <!-- Product Image -->
            <div class="flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
              <img
                *ngIf="product.image"
                [src]="product.image"
                [alt]="product.name"
                class="h-full w-full object-cover"
              />
              <div *ngIf="!product.image" class="flex flex-col items-center py-12 text-slate-400">
                <mat-icon class="text-6xl">image</mat-icon>
                <p class="mt-2 text-sm">Product Image</p>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex flex-col justify-between space-y-6">
              <!-- Title & Rating -->
              <div>
                <h2 class="text-2xl font-bold text-slate-900 mb-3">{{ product.name }}</h2>
                <!-- Rating -->
                <div class="flex items-center gap-3">
                  <span class="text-amber-400 text-lg">★</span>
                  <span class="font-semibold text-slate-900">
                    {{ product.avgRating | number: '1.1-1' }}
                  </span>
                </div>
              </div>

              <!-- Pricing & Stock Info -->
              <div class="space-y-4">
                <!-- Price -->
                <div>
                  <p class="text-sm text-slate-600 mb-2">Price</p>
                  <div class="flex items-center gap-3">
                    <span
                      *ngIf="product.discount"
                      class="text-sm font-semibold text-slate-400 line-through"
                    >
                      {{ product.price | currency: 'EUR' }}
                    </span>
                    <span
                      class="text-xl font-bold"
                      [ngClass]="{
                        'text-green-600': product.discount,
                        'text-sky-600': !product.discount,
                      }"
                    >
                      {{ getDiscountedPrice(product) | currency: 'EUR' }}
                    </span>
                    <span
                      *ngIf="product.discount"
                      class="ml-auto inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold"
                    >
                      -{{ product.discount }}% SAVE
                    </span>
                  </div>
                </div>

                <!-- Stock Status -->
                <div>
                  <p class="text-sm text-slate-600 mb-2">Availability</p>
                  <div
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold"
                    [ngClass]="{
                      'bg-green-100 text-green-700':
                        product &&
                        getStockStatus(product.stock, product.lowStockThreshold).status ===
                          StockStatus.IN_STOCK,
                      'bg-yellow-100 text-yellow-700':
                        product &&
                        getStockStatus(product.stock, product.lowStockThreshold).status ===
                          StockStatus.LOW_STOCK,
                      'bg-slate-100 text-slate-700':
                        product &&
                        getStockStatus(product.stock, product.lowStockThreshold).status ===
                          StockStatus.OUT_OF_STOCK,
                    }"
                  >
                    <mat-icon class="text-sm">{{
                      product && product.stock > 0 ? 'check_circle' : 'error'
                    }}</mat-icon>
                    <span>{{
                      product
                        ? getStockStatus(product.stock, product.lowStockThreshold).label
                        : 'Loading...'
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Add to Cart Form -->
              <form [formGroup]="addToCartForm" (ngSubmit)="addToCart()" class="space-y-3">
                <div>
                  <label class="block text-sm font-semibold text-slate-900 mb-2">Quantité</label>
                  <mat-form-field appearance="fill" class="w-full">
                    <input
                      matInput
                      type="number"
                      min="1"
                      [max]="product.stock"
                      formControlName="quantity"
                      (input)="addToCartForm.get('quantity')?.markAsTouched()"
                    />
                    <mat-error *ngIf="addToCartForm.get('quantity')?.hasError('required')">
                      La quantité est requise
                    </mat-error>
                    <mat-error *ngIf="addToCartForm.get('quantity')?.hasError('min')">
                      La quantité doit être au moins 1
                    </mat-error>
                  </mat-form-field>
                  <p
                    class="text-xs text-red-600 font-semibold mt-2"
                    *ngIf="
                      product &&
                      (addToCartForm.get('quantity')?.value ?? 0) > product.stock &&
                      addToCartForm.get('quantity')?.touched
                    "
                  >
                    ✗ Stock insuffisant. Maximum disponible: {{ product.stock }}
                  </p>
                  <p class="text-xs text-slate-500 mt-2" *ngIf="product">
                    Stock disponible:
                    <span class="font-semibold">{{ product.stock }}</span> article(s)
                  </p>
                </div>

                <button
                  mat-raised-button
                  [color]="
                    (addToCartForm.get('quantity')?.value ?? 0) > product.stock ? 'warn' : 'primary'
                  "
                  type="submit"
                  class="w-full h-12 !rounded-lg !font-semibold"
                  [disabled]="
                    addToCartForm.invalid ||
                    !product ||
                    product.stock === 0 ||
                    (addToCartForm.get('quantity')?.value ?? 0) > product.stock
                  "
                >
                  <mat-icon>shopping_cart</mat-icon>
                  {{ product && product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
                </button>

                <button
                  mat-stroked-button
                  routerLink="/shop/cart"
                  class="w-full h-11 !rounded-lg !font-semibold !border-sky-500 !text-sky-600 hover:!bg-sky-50"
                >
                  Voir votre panier
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Loading State - Skeleton Loader -->
        <app-product-details-skeleton *ngIf="!product"></app-product-details-skeleton>

        <!-- Reviews Section -->
        <app-reviews-section *ngIf="product" [productId]="product.id"></app-reviews-section>
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }

      :host ::ng-deep button[mat-raised-button][color='primary'] {
        background-color: var(--color-primary) !important;
        color: white !important;
      }

      :host ::ng-deep button[mat-raised-button][color='primary']:disabled {
        background-color: #9ca3af !important;
        color: rgba(0, 0, 0, 0.38) !important;
      }

      :host ::ng-deep button[mat-raised-button][color='warn'] {
        background-color: #dc2626 !important;
        color: white !important;
      }

      :host ::ng-deep button[mat-raised-button][color='warn']:disabled {
        background-color: #9ca3af !important;
        color: rgba(0, 0, 0, 0.38) !important;
      }
    `,
  ],
})
export class ProductDetailsPageComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  addToCartForm: FormGroup;
  isInWishlist$!: Observable<boolean>;

  // Stock utilities
  getStockStatus = getStockStatus;
  StockStatus = StockStatus;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private fb: FormBuilder,
    private api: ShopApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.addToCartForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      const productId = +params['id'];
      this.loadProductDetails(productId);
    });
  }

  private loadProductDetails(productId: number) {
    this.isLoading = true;
    this.product = null; // Reset product to show skeleton
    this.cdr.markForCheck();

    this.api
      .getProduct(productId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
        take(1),
      )
      .subscribe({
        next: (product) => {
          this.product = product;
          // Set max quantity validator based on available stock
          this.addToCartForm
            .get('quantity')
            ?.setValidators([Validators.required, Validators.min(1)]);
          this.addToCartForm.get('quantity')?.updateValueAndValidity();
          this.isInWishlist$ = this.store.select(selectIsInWishlist(product.id));
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load product:', error);
          this.product = null;
          this.cdr.markForCheck();
        },
      });
  }

  addToCart() {
    if (this.product && this.addToCartForm.valid) {
      // Check if product is in stock
      if (!isInStock(this.product.stock)) {
        return;
      }

      const quantity = this.addToCartForm.get('quantity')?.value || 1;

      this.store.dispatch(CartActions.addToCart({ product: this.product, quantity }));

      this.addToCartForm.reset({ quantity: 1 });
    }
  }

  toggleWishlist() {
    if (!this.product) return;

    this.isInWishlist$.pipe(take(1)).subscribe((isInWishlist) => {
      if (isInWishlist) {
        this.store.dispatch(WishlistActions.removeFromWishlist({ productId: this.product!.id }));
      } else {
        this.store.dispatch(
          WishlistActions.addToWishlist({
            product: {
              id: this.product!.id,
              name: this.product!.name,
              price: this.product!.price,
              image: this.product!.image || '',
              stock: this.product!.stock,
              lowStockThreshold: this.product!.lowStockThreshold,
            },
          }),
        );
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getDiscountedPrice(product: Product): number {
    if (!product.discount) {
      return product.price;
    }
    return product.price - (product.price * product.discount) / 100;
  }
}
