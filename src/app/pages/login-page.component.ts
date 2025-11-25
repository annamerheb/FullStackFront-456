import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import * as AuthActions from '../state/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '../state/auth/auth.selectors';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    RouterLink,
    LoginFormComponent,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen containerbg flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="login-glass-card">
          <div class="mb-8 text-center">
            <div
              class="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-sky-500 mb-4"
            >
              <mat-icon class="text-white text-3xl">storefront</mat-icon>
            </div>
            <h1 class="signin-title">Sign In</h1>
            <p class="text-sm text-slate-600 mt-1">Welcome back to My Shop</p>
          </div>

          <div *ngIf="loading$ | async" class="flex justify-center py-4">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div
            *ngIf="error$ | async as error"
            class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6"
          >
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <app-login-form (submit)="handleLogin($event)"></app-login-form>

          <div class="mt-6 p-3 bg-white/30 rounded-lg border border-white/40">
            <p class="text-xs text-slate-700 text-center">
              Demo:
              <code class="bg-white/50 px-2 py-1 rounded text-slate-900 font-mono"
                >demo / demo</code
              >
            </p>
          </div>

          <button
            mat-stroked-button
            routerLink="/app"
            class="w-full mt-6 !border-sky-500 !text-sky-600 hover:!bg-sky-50"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .signin-title {
        font-size: 34px;
        font-weight: 700;
      }

      .login-glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 32px rgba(2, 132, 199, 0.1);
      }

      :host ::ng-deep .mat-mdc-form-field {
        width: 100%;
      }

      :host ::ng-deep .mat-mdc-text-field {
        border-radius: 6px;
      }

      :host ::ng-deep .mat-mdc-raised-button[color='primary'] {
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
      }
    `,
  ],
})
export class LoginPageComponent implements OnInit {
  loading$: any;
  error$: any;
  isAuthenticated$: any;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigate(['/app']);
      }
    });
  }

  handleLogin(credentials: { username: string; password: string }): void {
    this.store.dispatch(
      AuthActions.login({
        username: credentials.username,
        password: credentials.password,
      }),
    );
  }
}
