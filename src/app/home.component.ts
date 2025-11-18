import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur-md"
        >
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Welcome</p>
            <h1 class="mt-2 text-3xl font-semibold text-slate-900">Bienvenue sur My Shop</h1>
            <p class="mt-2 text-sm text-slate-600">
              Sélectionne l'espace de travail que tu souhaites explorer
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              routerLink="/dev"
              mat-raised-button
              color="primary"
              class="h-11 w-full sm:w-auto"
            >
              Zone de test MSW
            </button>
            <button
              type="button"
              routerLink="/app"
              mat-stroked-button
              color="primary"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50 h-11 w-full sm:w-auto"
            >
              Accéder à l'app
            </button>
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
export class HomeComponent {
  protected readonly title = signal('my-shop');
}
