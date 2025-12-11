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
  selector: 'app-dev-orders',
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
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">User Orders</h1>
              <p class="mt-1 text-sm text-slate-600">
                GET /api/me/orders/ - Paginated list of user's orders
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

          <div class="p-4 flex gap-3 flex-wrap">
            <button mat-raised-button color="primary" (click)="getOrders(1, 10)">
              GET Orders (Page 1, Size 10)
            </button>
            <button mat-raised-button color="primary" (click)="getOrders(1, 5)">
              GET Orders (Page 1, Size 5)
            </button>
          </div>
        </div>

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
export class DevOrdersComponent implements OnInit {
  response = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getOrders(page: number, pageSize: number) {
    this.error.set(null);
    this.response.set(null);

    this.http.get(`/api/me/orders/?page=${page}&page_size=${pageSize}`).subscribe({
      next: (res) => {
        this.response.set(res);
      },
      error: (err) => {
        this.error.set(err.error?.message || err.message || 'Request failed');
      },
    });
  }
}
