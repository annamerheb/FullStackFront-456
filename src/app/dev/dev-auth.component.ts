import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

interface TokenResponse {
  access: string;
  refresh: string;
}
interface RefreshResponse {
  access: string;
}

@Component({
  standalone: true,
  selector: 'app-dev-auth',
  imports: [JsonPipe, RouterLink, MatButtonModule],
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
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Authentication</h1>
              <p class="mt-1 text-sm text-slate-600">/api/auth/token/ & /api/auth/token/refresh/</p>
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

          <div class="p-4 flex gap-3">
            <button mat-raised-button color="primary" (click)="login()">POST token</button>
            <button mat-raised-button color="primary" (click)="refresh()">POST refresh</button>
          </div>
        </div>

        @if (loginResp(); as r) {
          <div
            class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
          >
            <h3 class="font-semibold text-slate-900">Login response</h3>
            <pre class="mt-3 rounded bg-slate-50 p-3 text-sm overflow-auto">{{ r | json }}</pre>
          </div>
        }
        @if (refreshResp(); as rr) {
          <div
            class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
          >
            <h3 class="font-semibold text-slate-900">Refresh response</h3>
            <pre class="mt-3 rounded bg-slate-50 p-3 text-sm overflow-auto">{{ rr | json }}</pre>
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
export class DevAuthComponent {
  readonly loginResp = signal<TokenResponse | null>(null);
  readonly refreshResp = signal<RefreshResponse | null>(null);
  readonly err = signal<string | null>(null);

  async login(): Promise<void> {
    this.err.set(null);
    this.loginResp.set(null);
    const res = await fetch('/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'demo' }),
    });
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as TokenResponse;
    this.loginResp.set(data);
  }

  async refresh(): Promise<void> {
    this.err.set(null);
    this.refreshResp.set(null);
    const res = await fetch('/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: 'mock-refresh-token' }),
    });
    if (!res.ok) {
      this.err.set(`${res.status} ${res.statusText}`);
      return;
    }
    const data = (await res.json()) as RefreshResponse;
    this.refreshResp.set(data);
  }
}
