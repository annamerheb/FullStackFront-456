import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dev-order-details',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    JsonPipe,
  ],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Order Details</h1>
              <p class="mt-1 text-sm text-slate-600">
                GET /api/orders/:id/ - Complete order details with items, addresses, status
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

          <div class="p-4 flex gap-3 flex-wrap items-center">
            <input
              [(ngModel)]="orderId"
              type="text"
              placeholder="Enter order ID (e.g., order-001)"
              class="px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button mat-raised-button color="primary" (click)="getOrderDetails()">
              GET Order Details
            </button>
          </div>
        </div>

        @if (showEmptyMessage()) {
          <div class="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
            <div class="flex items-start gap-4">
              <mat-icon class="mt-1 text-xl text-amber-600">info</mat-icon>
              <div>
                <h3 class="font-semibold text-amber-900">No Orders Available</h3>
                <p class="mt-1 text-sm text-amber-700">
                  No orders found in the system. Try the following:
                </p>
                <ol class="mt-3 list-inside list-decimal space-y-1 text-sm text-amber-700">
                  <li>
                    Go to
                    <button
                      routerLink="/dev/order"
                      class="font-semibold underline hover:text-amber-900"
                    >
                      Create Order
                    </button>
                    to create a new order
                  </li>
                  <li>
                    Use the default order ID:
                    <code class="bg-amber-100 px-2 py-1 rounded">order-001</code>
                  </li>
                  <li>Copy the Order ID from the created order response</li>
                </ol>
              </div>
            </div>
          </div>
        }

        @if (response()) {
          <div
            class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
          >
            <h3 class="font-semibold text-slate-900">Response</h3>
            <pre class="mt-3 rounded bg-slate-50 p-3 text-sm overflow-auto">{{
              response() | json
            }}</pre>
          </div>
        }
        @if (error()) {
          <div
            class="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm"
          >
            {{ error() }}
          </div>
        }
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
export class DevOrderDetailsComponent implements OnInit {
  orderId = 'order-001';
  response = signal<any>(null);
  error = signal<string | null>(null);
  showEmptyMessage = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkAvailableOrders();
  }

  checkAvailableOrders() {
    this.http.get('/api/me/orders/?page=1&page_size=1').subscribe({
      next: (res: any) => {
        this.showEmptyMessage.set(res.count === 0);
      },
      error: () => {
        this.showEmptyMessage.set(true);
      },
    });
  }

  getOrderDetails() {
    if (!this.orderId.trim()) {
      this.error.set('Please enter an order ID');
      return;
    }

    this.error.set(null);
    this.response.set(null);
    this.showEmptyMessage.set(false);

    this.http.get(`/api/orders/${this.orderId}`).subscribe({
      next: (res) => {
        this.response.set(res);
      },
      error: (err) => {
        this.error.set(err.error?.message || err.message || 'Request failed');
      },
    });
  }
}
