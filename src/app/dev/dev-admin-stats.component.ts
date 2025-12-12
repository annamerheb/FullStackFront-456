import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { AdminStats } from '../state/admin/admin.models';

@Component({
  standalone: true,
  selector: 'app-dev-admin-stats',
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
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Admin Stats</h1>
              <p class="mt-1 text-sm text-slate-600">GET /api/admin/stats/ (mocked)</p>
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

          <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div class="flex flex-wrap items-center gap-3">
              <button
                mat-raised-button
                color="primary"
                (click)="loadStats()"
                [disabled]="loading()"
              >
                GET /api/admin/stats/
              </button>
              @if (loading()) {
                <span class="text-sm text-slate-500">Loading stats…</span>
              }
            </div>
            <p class="mt-3 text-sm text-slate-600">
              Inspects the mocked admin dashboard summary. Network errors are reported below.
            </p>
          </div>

          @if (error(); as message) {
            <div
              class="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm"
            >
              {{ message }}
            </div>
          }
          @if (stats(); as payload) {
            <div
              class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
            >
              <h2 class="text-lg font-semibold text-slate-900">Sample response</h2>
              <pre
                class="mt-3 rounded border border-slate-200 bg-slate-900/90 p-4 text-sm text-slate-50"
                >{{ payload | json }}
              </pre
              >
            </div>
          }
        </div>
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
export class DevAdminStatsComponent {
  private readonly http = inject(HttpClient);
  readonly stats = signal<AdminStats | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadStats(): Promise<void> {
    this.error.set(null);
    this.stats.set(null);
    this.loading.set(true);
    try {
      const payload = await firstValueFrom(this.http.get<AdminStats>('/api/admin/stats/'));
      this.stats.set(payload);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? `${err.status} ${err.statusText}`
          : err instanceof Error
            ? err.message
            : 'Request failed';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
