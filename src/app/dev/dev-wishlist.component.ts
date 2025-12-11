import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dev-wishlist',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="min-h-screen containerbg px-4 py-10">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Wishlist API Testing
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Wishlist Endpoints</h1>
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
              <h2 class="mb-4 text-lg font-semibold text-slate-900">GET /api/me/wishlist/</h2>
              <p class="mb-3 text-sm text-slate-600">Fetch current wishlist product IDs</p>
              <button mat-raised-button color="primary" (click)="getWishlist()">
                <mat-icon>download</mat-icon> Get Wishlist
              </button>
              <pre *ngIf="getResponse" class="mt-3 overflow-auto rounded bg-white p-3 text-xs">{{
                getResponse | json
              }}</pre>
              <p *ngIf="getError" class="mt-2 text-red-600">{{ getError }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h2 class="mb-4 text-lg font-semibold text-slate-900">POST /api/me/wishlist/</h2>
              <p class="mb-3 text-sm text-slate-600">Update wishlist with product IDs</p>
              <div class="space-y-2">
                <button mat-raised-button color="accent" (click)="addToWishlist([1, 5, 10])">
                  <mat-icon>favorite</mat-icon> Add IDs: [1, 5, 10]
                </button>
                <button mat-raised-button color="accent" (click)="addToWishlist([2, 7])">
                  <mat-icon>favorite</mat-icon> Add IDs: [2, 7]
                </button>
                <button mat-raised-button color="warn" (click)="clearWishlist()">
                  <mat-icon>delete</mat-icon> Clear Wishlist
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
export class DevWishlistComponent implements OnInit {
  getResponse: any = null;
  postResponse: any = null;
  getError: string = '';
  postError: string = '';
  lastRequest: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWishlist();
  }

  getWishlist() {
    this.getError = '';
    this.lastRequest = 'GET /api/me/wishlist/';
    this.http.get<{ productIds: number[] }>('/api/me/wishlist/').subscribe({
      next: (response) => {
        this.getResponse = response;
        this.lastRequest = `GET /api/me/wishlist/\n\nResponse: ${JSON.stringify(response, null, 2)}`;
      },
      error: (error) => {
        this.getError = error.message;
        this.lastRequest = `GET /api/me/wishlist/\n\nError: ${error.message}`;
      },
    });
  }

  addToWishlist(productIds: number[]) {
    this.postError = '';
    this.lastRequest = `POST /api/me/wishlist/\n\nPayload: ${JSON.stringify({ productIds }, null, 2)}`;
    this.http.post<{ productIds: number[] }>('/api/me/wishlist/', { productIds }).subscribe({
      next: (response) => {
        this.postResponse = response;
        this.getWishlist();
        this.lastRequest += `\n\nResponse: ${JSON.stringify(response, null, 2)}`;
      },
      error: (error) => {
        this.postError = error.message;
        this.lastRequest += `\n\nError: ${error.message}`;
      },
    });
  }

  clearWishlist() {
    this.addToWishlist([]);
  }
}
