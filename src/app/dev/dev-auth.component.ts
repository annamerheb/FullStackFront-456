import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  imports: [JsonPipe, RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10">
      <nav class="mb-4 flex gap-3 text-sm">
        <button type="button" routerLink="/dev" class="text-blue-600 hover:underline">
          ← Dev index
        </button>
        <button type="button" routerLink="/" class="text-blue-600 hover:underline">Accueil</button>
      </nav>

      <h2 class="text-2xl font-semibold">/api/auth/token/ & /api/auth/token/refresh/</h2>
      <div class="mt-4 flex gap-3">
        <button
          class="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          (click)="login()"
        >
          POST token
        </button>
        <button
          class="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
          (click)="refresh()"
        >
          POST refresh
        </button>
      </div>

      @if (loginResp(); as r) {
        <h3 class="mt-4 font-medium">Login response</h3>
        <pre class="rounded bg-gray-50 p-3 text-sm">{{ r | json }}</pre>
      }
      @if (refreshResp(); as rr) {
        <h3 class="mt-4 font-medium">Refresh response</h3>
        <pre class="rounded bg-gray-50 p-3 text-sm">{{ rr | json }}</pre>
      }
      @if (err()) {
        <p class="mt-2 text-sm text-red-600">{{ err() }}</p>
      }
    </section>
  `,
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
