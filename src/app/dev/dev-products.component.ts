import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  imports: [JsonPipe, FormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10">
      <nav class="mb-4 flex gap-3 text-sm">
        <button type="button" routerLink="/dev" class="text-blue-600 hover:underline">
          ← Dev index
        </button>
        <button type="button" routerLink="/" class="text-blue-600 hover:underline">Accueil</button>
        <button
          type="button"
          routerLink="/dev/products/1/rating"
          class="text-blue-600 hover:underline"
        >
          Voir rating #1
        </button>
      </nav>

      <h2 class="text-2xl font-semibold">GET /api/products/</h2>

      <form
        class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6"
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
          <button
            class="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
            (click)="load()"
          >
            Fetch
          </button>
        </div>
      </form>

      @if (resp(); as r) {
        <div class="mt-4 text-sm text-gray-600">count: {{ r.count }}</div>
        <pre class="mt-2 rounded bg-gray-50 p-3 text-sm overflow-auto">{{ r | json }}</pre>
      }
      @if (err()) {
        <p class="mt-2 text-sm text-red-600">{{ err() }}</p>
      }
    </section>
  `,
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
