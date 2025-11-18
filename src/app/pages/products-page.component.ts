import { Component, OnInit } from '@angular/core';
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
import { Store } from '@ngrx/store';
import * as ProductsActions from '../state/products/products.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from '../state/products/products.selectors';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
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
  ],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-6xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Catalogue
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Shop Products</h1>
              <p class="mt-1 text-sm text-slate-600">
                Fine-tune your view by page, rating and ordering.
              </p>
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
              [formGroup]="filterForm"
              (ngSubmit)="applyFilters()"
              class="mt-4 grid gap-3 md:grid-cols-4"
            >
              <mat-form-field appearance="fill" class="w-full text-sm">
                <mat-label>Page</mat-label>
                <input
                  matInput
                  type="text"
                  inputmode="numeric"
                  formControlName="page"
                  class="text-sm"
                />
              </mat-form-field>

              <mat-form-field appearance="fill" class="w-full text-sm">
                <mat-label>Page Size</mat-label>
                <input
                  matInput
                  type="text"
                  inputmode="numeric"
                  formControlName="pageSize"
                  class="text-sm"
                />
              </mat-form-field>

              <mat-form-field appearance="fill" class="w-full text-sm">
                <mat-label>Min Rating</mat-label>
                <input
                  matInput
                  type="text"
                  inputmode="decimal"
                  formControlName="minRating"
                  class="text-sm"
                />
              </mat-form-field>

              <div class="flex flex-col gap-3 md:flex-row md:items-end">
                <mat-form-field appearance="fill" class="w-full text-sm">
                  <mat-label>Sort By</mat-label>
                  <mat-select formControlName="ordering">
                    <mat-option value="">Default</mat-option>
                    <mat-option value="price">Price (Low to High)</mat-option>
                    <mat-option value="-price">Price (High to Low)</mat-option>
                    <mat-option value="name">Name (A–Z)</mat-option>
                  </mat-select>
                </mat-form-field>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  class="h-11 w-full md:w-auto"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>

        <div *ngIf="loading$ | async" class="flex justify-center py-10">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div
          *ngIf="error$ | async as error"
          class="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm"
        >
          {{ error }}
        </div>

        <div *ngIf="products$ | async as products" class="space-y-4">
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" *ngIf="(products?.length ?? 0) > 0">
            <mat-card *ngFor="let product of products" class="group product-card">
              <mat-card-content class="pt-4 pb-5">
                <div class="flex items-start justify-between gap-3">
                  <h2
                    class="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700"
                  >
                    {{ product.name }}
                  </h2>

                  <span
                    class="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700"
                  >
                    €{{ product.price | number: '1.2-2' }}
                  </span>
                </div>

                <div class="mt-3 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="text-amber-500">★</span>
                    <span class="font-medium text-slate-800">
                      {{ product.avgRating | number: '1.1-1' }}
                    </span>
                    <span class="text-slate-400">/ 5</span>
                  </div>
                  <span class="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                    {{ product.created_at | date: 'mediumDate' }}
                  </span>
                </div>

                <div
                  class="mt-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                ></div>

                <div class="mt-3 flex items-center justify-between text-xs">
                  <span class="text-slate-500">
                    ID: <span class="font-medium text-slate-700">{{ product.id }}</span>
                  </span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <div
            *ngIf="(products?.length ?? 0) === 0"
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-slate-500"
          >
            <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500"
            >
              🛒
            </div>
            <p class="text-sm font-medium">No products found</p>
            <p class="mt-1 text-xs text-slate-400">
              Try adjusting your filters or reset the page &amp; rating.
            </p>
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
export class ProductsPageComponent implements OnInit {
  filterForm: FormGroup;
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.filterForm = this.fb.group({
      page: [0],
      pageSize: [6],
      minRating: [0],
      ordering: [''],
    });

    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const page = Number(this.filterForm.get('page')?.value) || 0;
    const pageSize = Number(this.filterForm.get('pageSize')?.value) || 6;
    const minRating = Number(this.filterForm.get('minRating')?.value) || 0;

    const filters = {
      page,
      pageSize,
      minRating,
      ordering: this.filterForm.get('ordering')?.value || '',
    };

    this.store.dispatch(ProductsActions.loadProducts({ filters }));
  }
}
