import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface RatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-dev-product-rating',
  imports: [FormsModule, RouterLink, JsonPipe],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10">
      <nav class="mb-4 flex gap-3 text-sm">
        <button type="button" routerLink="/dev" class="text-blue-600 hover:underline">
          ← Dev index
        </button>
        <button type="button" routerLink="/" class="text-blue-600 hover:underline">Accueil</button>
        <button type="button" routerLink="/dev/products" class="text-blue-600 hover:underline">
          Liste produits
        </button>
      </nav>

      <h2 class="text-2xl font-semibold">GET /api/products/:id/rating/</h2>

      <form class="mt-4 flex items-end gap-3" (submit)="$event.preventDefault(); load()">
        <label class="text-sm"
          >product id
          <input
            class="mt-1 w-28 rounded border px-2 py-1"
            type="number"
            [(ngModel)]="id"
            name="id"
          />
        </label>
        <button
          class="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          (click)="load()"
        >
          Fetch
        </button>
      </form>

      @if (resp(); as r) {
        <pre class="mt-4 rounded bg-gray-50 p-3 text-sm">{{ r | json }}</pre>
      }
      @if (err()) {
        <p class="mt-2 text-sm text-red-600">{{ err() }}</p>
      }
    </section>
  `,
})
export class DevProductRatingComponent {
  id = 1;
  readonly resp = signal<RatingResponse | null>(null);
  readonly err = signal<string | null>(null);

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    const res = await fetch(`/api/products/${this.id}/rating/`);
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as RatingResponse;
    this.resp.set(data);
  }
}
