import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../services/types';
import * as CartActions from '../../state/cart/cart.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white px-4 py-12">
      <div class="mx-auto max-w-5xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Product Details</p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">{{ product?.name }}</h1>
          </div>
          <button
            mat-raised-button
            color="primary"
            routerLink="/shop/products"
          >
            ← Back to Products
          </button>
        </div>

        <!-- Main Content -->
        <div
          *ngIf="product"
          class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div class="grid gap-8 p-6 md:grid-cols-2 lg:gap-12">
            <!-- Product Image -->
            <div class="flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
              <img
                *ngIf="product?.image"
                [src]="product.image"
                [alt]="product.name"
                class="h-full w-full object-cover"
              />
              <div *ngIf="!product?.image" class="flex flex-col items-center py-12 text-slate-400">
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
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center">
                    <span class="text-amber-400 text-lg">★</span>
                    <span class="ml-1 font-semibold text-slate-900">
                      {{ product.avgRating | number: '1.1-1' }}
                    </span>
                  </div>
                  <span class="text-sm text-slate-500">({{ product.reviews_count }} reviews)</span>
                </div>
              </div>

              <!-- Pricing Section -->
              <div class="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p class="text-sm text-slate-600 mb-1">Price</p>
                  <div class="flex items-center gap-3">
                    <span
                      *ngIf="product.discount"
                      class="text-lg font-semibold text-slate-400 line-through"
                    >
                      {{ product.price | currency: 'EUR' }}
                    </span>
                    <span
                      class="text-3xl font-bold"
                      [ngClass]="{
                        'text-green-600': product.discount,
                        'text-sky-600': !product.discount,
                      }"
                    >
                      {{ getDiscountedPrice(product) | currency: 'EUR' }}
                    </span>
                    <div *ngIf="product.discount" class="ml-auto">
                      <span class="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        -{{ product.discount }}% SAVE
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Stock Status -->
                <div class="border-t border-slate-200 pt-3">
                  <p class="text-sm text-slate-600 mb-2">Availability</p>
                  <div
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold"
                    [ngClass]="{
                      'bg-green-100 text-green-700': product.stock > 20,
                      'bg-yellow-100 text-yellow-700': product.stock > 5 && product.stock <= 20,
                      'bg-red-100 text-red-700': product.stock <= 5,
                    }"
                  >
                    <mat-icon class="text-sm">{{ product.stock > 0 ? 'check_circle' : 'error' }}</mat-icon>
                    <span>{{ product.stock }} in stock</span>
                  </div>
                </div>
              </div>

              <!-- Add to Cart Form -->
              <form [formGroup]="addToCartForm" (ngSubmit)="addToCart()" class="space-y-3">
                <div>
                  <label class="block text-sm font-semibold text-slate-900 mb-2">Quantity</label>
                  <mat-form-field appearance="fill" class="w-full">
                    <input matInput type="number" min="1" max="100" formControlName="quantity" />
                  </mat-form-field>
                </div>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="w-full h-12 btn-add-to-cart !rounded-lg !font-semibold"
                  [disabled]="addToCartForm.invalid"
                >
                  <mat-icon>shopping_cart</mat-icon>
                  Add to Cart
                </button>

                <button
                  mat-stroked-button
                  routerLink="/shop/cart"
                  class="w-full h-11 !rounded-lg !font-semibold"
                >
                  View Your Cart
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!product" class="flex justify-center py-20">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Snackbar styling */
      :host ::ng-deep .snackbar-success {
        background: white !important;
        border-radius: 8px !important;
        padding: 16px 20px !important;
        box-shadow:
          0 10px 25px -5px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(226, 232, 240, 0.5) !important;
        border: none !important;
        animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      }

      :host ::ng-deep .snackbar-success .mdc-snackbar__label {
        color: #1e293b !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif !important;
      }

      :host ::ng-deep .snackbar-success .mat-mdc-button {
        color: #0284c7 !important;
        font-weight: 600 !important;
      }

      :host ::ng-deep .snackbar-success .mat-mdc-button:hover {
        background-color: rgba(2, 132, 199, 0.08) !important;
      }

      :host ::ng-deep .mat-mdc-snack-bar-container.snackbar-success {
        --mdc-snackbar-container-color: transparent !important;
        background: transparent !important;
      }

      :host ::ng-deep .mdc-snackbar__surface {
        background: white !important;
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(100px) translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
      }

      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }

      .product-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
      }
    `,
  ],
})
export class ProductDetailsPageComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  addToCartForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private fb: FormBuilder,
    private api: ShopApiService,
    private snackBar: MatSnackBar,
  ) {
    this.addToCartForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = +params['id'];
      this.loadProductDetails(productId);
    });
  }

  private loadProductDetails(productId: number) {
    this.isLoading = true;
    this.api
      .getProduct(productId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => {
          console.error('Failed to load product:', error);
        },
      });
  }

  addToCart() {
    if (this.product && this.addToCartForm.valid) {
      const quantity = this.addToCartForm.get('quantity')?.value || 1;
      this.store.dispatch(CartActions.addToCart({ product: this.product, quantity }));

      this.snackBar.open(`✓ Added ${quantity}x "${this.product.name}" to cart`, 'Close', {
        duration: 3500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success'],
        politeness: 'polite',
      });

      this.addToCartForm.reset({ quantity: 1 });
    }
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
