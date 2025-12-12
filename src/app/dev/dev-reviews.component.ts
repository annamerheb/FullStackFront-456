import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dev-reviews',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen containerbg px-4 py-10">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Reviews API Testing
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Reviews Endpoints</h1>
            </div>
            <button
              mat-stroked-button
              color="primary"
              routerLink="/dev"
              class="!border-sky-500 !text-sky-600"
            >
              Dev Index
            </button>
          </div>

          <div class="space-y-4">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 class="mb-4 text-lg font-semibold text-slate-900">
                GET /api/products/:id/reviews/
              </h2>
              <p class="mb-3 text-sm text-slate-600">Fetch reviews for a product</p>
              <button mat-raised-button color="primary" (click)="getReviews(1)">
                <mat-icon>download</mat-icon> Get Reviews (Product 1)
              </button>
              <pre *ngIf="getResponse" class="mt-3 overflow-auto rounded bg-white p-3 text-xs">{{
                getResponse | json
              }}</pre>
              <p *ngIf="getError" class="mt-2 text-red-600">{{ getError }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 class="mb-4 text-lg font-semibold text-slate-900">
                POST /api/products/:id/reviews/
              </h2>
              <p class="mb-3 text-sm text-slate-600">Submit a new review</p>
              <div class="space-y-2">
                <button mat-raised-button color="accent" (click)="submitReview(1, 5, 'Excellent!')">
                  <mat-icon>star</mat-icon> Submit 5★ Review
                </button>
                <button
                  mat-raised-button
                  color="accent"
                  (click)="submitReview(1, 3, 'Average product')"
                >
                  <mat-icon>star</mat-icon> Submit 3★ Review
                </button>
              </div>
              <pre *ngIf="postResponse" class="mt-3 overflow-auto rounded bg-white p-3 text-xs">{{
                postResponse | json
              }}</pre>
              <p *ngIf="postError" class="mt-2 text-red-600">{{ postError }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-blue-50 p-4">
              <h3 class="font-semibold text-slate-900">Last Request/Response:</h3>
              <pre class="mt-2 overflow-auto rounded bg-white p-3 text-xs">{{ lastRequest }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }
    `,
  ],
})
export class DevReviewsComponent implements OnInit {
  getResponse: any = null;
  postResponse: any = null;
  getError: string = '';
  postError: string = '';
  lastRequest: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getReviews(1);
  }

  getReviews(productId: number) {
    this.getError = '';
    this.lastRequest = `GET /api/products/${productId}/reviews/`;
    this.http.get<any>(`/api/products/${productId}/reviews/`).subscribe({
      next: (response) => {
        this.getResponse = response;
        this.lastRequest += `\n\nResponse: ${JSON.stringify(response, null, 2)}`;
      },
      error: (error) => {
        this.getError = error.message;
        this.lastRequest += `\n\nError: ${error.message}`;
      },
    });
  }

  submitReview(productId: number, rating: number, comment: string) {
    this.postError = '';
    this.lastRequest = `POST /api/products/${productId}/reviews/\n\nPayload: ${JSON.stringify({ rating, comment }, null, 2)}`;
    this.http.post<any>(`/api/products/${productId}/reviews/`, { rating, comment }).subscribe({
      next: (response) => {
        this.postResponse = response;
        this.getReviews(productId);
        this.lastRequest += `\n\nResponse: ${JSON.stringify(response, null, 2)}`;
      },
      error: (error) => {
        this.postError = error.message;
        this.lastRequest += `\n\nError: ${error.message}`;
      },
    });
  }
}
