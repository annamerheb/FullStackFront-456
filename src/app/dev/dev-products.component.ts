import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
}
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Component({
  standalone: true,
  selector: 'app-dev-products',
  imports: [JsonPipe, FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Products API</h1>
              <p class="mt-1 text-sm text-slate-600">GET /api/products/</p>
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

          <form
            class="grid grid-cols-2 gap-3 md:grid-cols-6"
            (submit)="$event.preventDefault(); load()"
          >
            <label class="text-sm"
              >page
              <input
                class="mt-1 w-full rounded border px-2 py-1"
                type="number"
                [(ngModel)]="page"
                name="page"
              />
            </label>
            <label class="text-sm"
              >page_size
              <input
                class="mt-1 w-full rounded border px-2 py-1"
                type="number"
                [(ngModel)]="pageSize"
                name="pageSize"
              />
            </label>
            <label class="text-sm"
              >min_rating
              <input
                class="mt-1 w-full rounded border px-2 py-1"
                type="number"
                step="0.1"
                [(ngModel)]="minRating"
                name="minRating"
              />
            </label>
            <label class="text-sm md:col-span-2"
              >ordering
              <input
                class="mt-1 w-full rounded border px-2 py-1"
                type="text"
                [(ngModel)]="ordering"
                name="ordering"
                placeholder="-created_at|price|name"
              />
            </label>
            <div class="flex items-end">
              <button mat-raised-button color="primary" (click)="load()">Fetch</button>
            </div>
          </form>
        </div>

        @if (resp(); as r) {
          <div
            class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
          >
            <h3 class="font-semibold text-slate-900">Response (count: {{ r.count }})</h3>
            <pre class="mt-3 rounded bg-slate-50 p-3 text-sm overflow-auto">{{ r | json }}</pre>
          </div>
        }
        @if (err()) {
          <div
            class="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm"
          >
            {{ err() }}
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
export class DevProductsComponent {
  page = 1;
  pageSize = 10;
  minRating = 0;
  ordering = '-created_at';

  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    const q = new URLSearchParams({
      page: String(this.page),
      page_size: String(this.pageSize),
      min_rating: String(this.minRating),
      ordering: this.ordering,
    });
    const res = await fetch(`/api/products/?${q.toString()}`);
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as Paginated<Product>;
    this.resp.set(data);
  }
}
