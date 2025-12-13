import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="grid gap-8 p-8 md:grid-cols-2">
        <!-- Image Skeleton -->
        <div class="flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
          <div class="w-full h-96 bg-slate-200 animate-pulse rounded-lg"></div>
        </div>

        <!-- Content Skeleton -->
        <div class="flex flex-col justify-between space-y-6">
          <!-- Title Skeleton -->
          <div class="space-y-3">
            <div class="h-8 bg-slate-200 animate-pulse rounded w-3/4"></div>
            <div class="h-6 bg-slate-200 animate-pulse rounded w-1/4"></div>
          </div>

          <!-- Price & Stock Skeleton -->
          <div class="space-y-6">
            <!-- Price Section -->
            <div>
              <div class="h-4 bg-slate-200 animate-pulse rounded w-1/4 mb-3"></div>
              <div class="h-8 bg-slate-200 animate-pulse rounded w-1/3"></div>
            </div>

            <!-- Stock Section -->
            <div>
              <div class="h-4 bg-slate-200 animate-pulse rounded w-1/4 mb-3"></div>
              <div class="h-10 bg-slate-200 animate-pulse rounded w-1/2"></div>
            </div>
          </div>

          <!-- Form Skeleton -->
          <div class="space-y-3">
            <!-- Quantity Input Skeleton -->
            <div>
              <div class="h-4 bg-slate-200 animate-pulse rounded w-1/4 mb-2"></div>
              <div class="h-12 bg-slate-200 animate-pulse rounded w-full"></div>
            </div>

            <!-- Buttons Skeleton -->
            <div class="space-y-2">
              <div class="h-12 bg-slate-200 animate-pulse rounded w-full"></div>
              <div class="h-11 bg-slate-200 animate-pulse rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ProductDetailSkeletonComponent {}
