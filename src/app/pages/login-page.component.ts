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
    <div class="login-root">
      <div class="login-wrap">
        <mat-card class="login-card">
          <div class="login-header">
            <div class="brand-icon-wrap">
              <div class="brand-icon-circle">
                <mat-icon>storefront</mat-icon>
              </div>
              <div>
                <h1 class="brand">My Shop</h1>
                <p class="tagline">Sign in to continue</p>
              </div>
            </div>
          </div>

          <mat-card-content>
            <div *ngIf="loading$ | async" class="loading-wrap">
              <mat-spinner diameter="40"></mat-spinner>
            </div>

            <div *ngIf="error$ | async as error" class="error-box">
              <p class="error-text">{{ error }}</p>
            </div>

            <app-login-form (submit)="handleLogin($event)"></app-login-form>

            <div class="demo-note">
              <p>Demo credentials: <code>demo / demo</code></p>
            </div>
          </mat-card-content>

          <mat-card-actions class="actions">
            <button type="button" routerLink="/app" mat-button class="back-btn">
              <mat-icon class="back-icon">arrow_back</mat-icon>
              Back to Home
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .login-root {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: radial-gradient(circle at top left, #449df5, #4d6c8b 40%, #7592af 100%);
      }

      .login-wrap {
        width: 100%;
        max-width: 480px;
      }

      .login-card {
        padding: 55px 26px 22px;
        border-radius: 18px;
        border: 1px solid #e3e6ea;
        background: linear-gradient(145deg, #ffffff, #f7f9fc);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
      }

      .login-header {
        margin-bottom: 20px;
        border-bottom: 1px solid #e3e6ea;
        padding-bottom: 16px;
      }

      .brand-icon-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-icon-circle {
        width: 41px;
        height: 41px;
        border-radius: 999px;
        background: linear-gradient(135deg, #1976d2, #42a5f5);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(25, 118, 210, 0.35);
      }

      .brand-icon-circle mat-icon {
        color: #ffffff;
        font-size: 23px;
      }

      .brand {
        margin: 0 0 4px 0;
        color: #202124;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: 0.03em;
      }

      .tagline {
        margin: 0;
        color: #5f6368;
        font-size: 13px;
      }

      mat-card-content {
        padding: 0;
      }

      .loading-wrap {
        display: flex;
        justify-content: center;
        padding: 12px 0 16px;
      }

      .error-box {
        background: #fce8e6;
        border: 1px solid #f8d7da;
        padding: 10px 12px;
        border-radius: 6px;
        margin-bottom: 14px;
      }

      .error-text {
        color: #c5221f;
        margin: 0;
        font-size: 13px;
      }

      .demo-note {
        margin-top: 14px;
        color: #80868b;
        font-size: 12px;
        text-align: center;
      }

      .demo-note code {
        background: #eceff1;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
      }

      .actions {
        display: flex;
        justify-content: flex-start;
        padding-top: 12px;
        margin-top: 8px;
        border-top: 1px solid #e3e6ea;
      }

      .back-btn {
        text-transform: none;
        font-size: 13px;
        gap: 4px;
      }

      .back-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      @media (max-width: 480px) {
        .login-card {
          padding: 22px 18px 18px;
        }
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
