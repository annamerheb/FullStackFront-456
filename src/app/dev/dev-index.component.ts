import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [RouterLink, MatButtonModule, MatIconModule],
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
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">MSW Test Zone</h1>
              <p class="mt-1 text-sm text-slate-600">Mock Service Worker API endpoints</p>
            </div>

            <button
              mat-stroked-button
              color="primary"
              routerLink="/"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50"
            >
              ← Back Home
            </button>
          </div>

          <div class="p-4">
            <nav class="grid gap-3">
              <button
                type="button"
                routerLink="/dev/auth"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-200 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Auth:</span>&nbsp;POST /api/auth/token/ (+refresh)
              </button>
              <button
                type="button"
                routerLink="/dev/products"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-200 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Products:</span>&nbsp;GET /api/products/
              </button>
              <button
                type="button"
                routerLink="/dev/products/1/rating"
                mat-stroked-button
                class="!justify-start !text-left !border-sky-200 !text-slate-700 hover:!bg-sky-50"
              >
                <span class="font-medium">Product rating:</span>&nbsp;GET /api/products/:id/rating/
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: radial-gradient(circle at top left, #439cf5 0, #b6dcff 40%, #62adf2 100%);
      }
    `,
  ],
})
export class DevIndexComponent {}
