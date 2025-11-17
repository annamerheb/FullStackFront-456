import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h2 class="text-2xl font-semibold">Dev / MSW — Index</h2>
      <nav class="grid gap-2">
        <button
          type="button"
          routerLink="/dev/auth"
          class="rounded border px-3 py-2 text-left hover:bg-gray-50"
        >
          Auth: POST /api/auth/token/ (+refresh)
        </button>
        <button
          type="button"
          routerLink="/dev/products"
          class="rounded border px-3 py-2 text-left hover:bg-gray-50"
        >
          Products: GET /api/products/
        </button>
        <button
          type="button"
          routerLink="/dev/products/1/rating"
          class="rounded border px-3 py-2 text-left hover:bg-gray-50"
        >
          Product rating: GET /api/products/:id/rating/
        </button>
      </nav>
      <div class="pt-2">
        <button type="button" routerLink="/" class="text-blue-600 hover:underline">
          ← Retour accueil
        </button>
      </div>
    </section>
  `,
})
export class DevIndexComponent {}
