import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen containerbg">
      <div class="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl"
          ></div>
          <div
            class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sky-300 opacity-20 blur-3xl"
          ></div>
        </div>

        <div class="relative mx-auto max-w-4xl text-center">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-2 backdrop-blur-md"
          >
            <span class="h-2 w-2 rounded-full bg-sky-500"></span>
            <span class="text-sm font-medium text-sky-700">Welcome to our premium store</span>
          </div>

          <h1 class="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Shop the
            <span class="bg-gradient-to-r from-sky-500 to-cyan-600 bg-clip-text text-transparent">
              Future
            </span>
          </h1>

          <p class="mx-auto mb-8 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Discover our curated collection of premium products. Experience seamless shopping with
            modern technology and exceptional customer service.
          </p>

          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              routerLink="/shop/products"
              mat-raised-button
              color="primary"
              class="h-12 px-8 text-base font-semibold !bg-gradient-to-r !from-sky-500 !to-cyan-600 !text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <mat-icon class="mr-2">shopping_bag</mat-icon>
              Start Shopping
            </button>

            <button
              routerLink="/app"
              mat-stroked-button
              class="h-12 px-8 text-base font-semibold !border-sky-500 !text-sky-600 hover:!bg-sky-50"
            >
              <mat-icon class="mr-2">dashboard</mat-icon>
              View Dashboard
            </button>
          </div>

          <div class="mt-20 grid gap-6 sm:grid-cols-3">
            <div
              class="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-md transition hover:border-sky-300 hover:bg-white/80"
            >
              <div
                class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100"
              >
                <mat-icon class="text-sky-600">local_shipping</mat-icon>
              </div>
              <h3 class="mb-2 font-semibold text-slate-900">Free Shipping</h3>
              <p class="text-sm text-slate-600">On orders over $50</p>
            </div>

            <div
              class="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-md transition hover:border-sky-300 hover:bg-white/80"
            >
              <div
                class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100"
              >
                <mat-icon class="text-sky-600">shield</mat-icon>
              </div>
              <h3 class="mb-2 font-semibold text-slate-900">Secure Payment</h3>
              <p class="text-sm text-slate-600">100% secure transactions</p>
            </div>

            <div
              class="group rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-md transition hover:border-sky-300 hover:bg-white/80"
            >
              <div
                class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100"
              >
                <mat-icon class="text-sky-600">support_agent</mat-icon>
              </div>
              <h3 class="mb-2 font-semibold text-slate-900">24/7 Support</h3>
              <p class="text-sm text-slate-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-t border-slate-200/50 bg-white/50 px-4 py-12 backdrop-blur-md sm:px-6 lg:px-8"
      >
        <div class="mx-auto max-w-4xl text-center">
          <p class="mb-6 text-sm font-medium uppercase tracking-wider text-slate-500">
            Development & Testing
          </p>
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              routerLink="/dev"
              mat-stroked-button
              class="h-11 px-6 text-sm font-medium !border-slate-300 !text-slate-600 hover:!bg-slate-50"
            >
              <mat-icon class="mr-2">engineering</mat-icon>
              MSW Testing Zone
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HomeComponent {
  protected readonly title = signal('my-shop');
}
