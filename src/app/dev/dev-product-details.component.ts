import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-dev-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-10 !font-sans"
    >
      <div class="mx-auto max-w-4xl">
        <div
          class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md mb-6"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Product Details</h1>
              <p class="mt-1 text-sm text-slate-600">
                GET /api/products/:id/ - Full product with stock & discount
              </p>
            </div>
            <button
              mat-stroked-button
              color="primary"
              routerLink="/dev"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50"
            >
              Dev Index
            </button>
          </div>
        </div>

        <mat-card class="rounded-2xl border border-white/70 shadow-xl backdrop-blur-md">
          <mat-card-content class="space-y-4">
            <div
              class="grid gap-2 sm:grid-cols-5 lg:grid-cols-10 max-h-24 overflow-y-auto pb-2 border-b border-slate-200 mb-4"
            >
              <button
                mat-raised-button
                *ngFor="let id of productIds; trackBy: trackByProductId"
                (click)="loadProduct(id)"
                class="!bg-gradient-to-r !from-sky-600 !to-blue-600 !text-white text-xs !py-1"
              >
                {{ id }}
              </button>
            </div>

            <div
              *ngIf="response"
              class="p-4 bg-slate-900 text-sky-400 rounded-lg overflow-auto max-h-96 text-sm"
            >
              <pre>{{ response | json }}</pre>
            </div>

            <p *ngIf="!response" class="text-slate-500 text-center py-8">
              Click a product ID to load details...
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [],
})
export class DevProductDetailsComponent implements OnInit {
  response: any = null;
  productIds = Array.from({ length: 20 }, (_, i) => i + 1);

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  loadProduct(id: number) {
    this.http.get(`/api/products/${id}/`).subscribe({
      next: (res) => {
        this.response = res;
      },
      error: (err) => {
        this.response = { error: err.message };
      },
    });
  }

  /**
   * TrackBy function for product IDs in *ngFor
   * Improves performance by tracking product IDs directly
   */
  trackByProductId(index: number, id: number): number {
    return id;
  }
}
