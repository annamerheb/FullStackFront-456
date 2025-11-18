import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './state/auth/auth.selectors';
import * as AuthActions from './state/auth/auth.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="app-shell">
      <header class="top-nav">
        <div class="nav-left">
          <mat-icon class="brand-icon">storefront</mat-icon>
          <span class="brand-name">My Shop</span>
        </div>

        <nav class="nav-links">
          <a mat-button routerLink="/">Home</a>
          <a mat-button routerLink="/shop/products">Products</a>
          <a mat-button routerLink="/shop/rating">Ratings</a>
          <a mat-button routerLink="/dev">Dev Pages</a>
        </nav>

        <div class="nav-right" *ngIf="isAuthenticated$ | async; else navLoggedOut">
          <button mat-icon-button class="avatar-btn" aria-label="User profile">
            <mat-icon>account_circle</mat-icon>
          </button>
          <button mat-stroked-button color="warn" class="logout-btn" (click)="logout()">
            Logout
          </button>
        </div>

        <ng-template #navLoggedOut>
          <div class="nav-right">
            <button mat-raised-button color="primary" routerLink="/login">Sign In</button>
          </div>
        </ng-template>
      </header>

      <main class="content">
        <section class="hero">
          <div class="hero-inner">
            <div class="hero-text">
              <h1>Welcome to My Shop</h1>
              <p>
                Browse a compact shop demo with sign-in, product exploration, and rating features.
              </p>
            </div>
          </div>
        </section>

        <section class="features-grid">
          <mat-card class="feature-card">
            <mat-icon class="feature-icon">login</mat-icon>
            <h3>Sign In</h3>
            <p>Access your account with the demo credentials <code>demo/demo</code>.</p>
            <button mat-raised-button color="primary" routerLink="/login">Go to Login</button>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">shopping_bag</mat-icon>
            <h3>Shop Products</h3>
            <p>Browse the product list with filters and sorting options.</p>
            <button mat-raised-button color="primary" routerLink="/shop/products">
              Browse products
            </button>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">star_rate</mat-icon>
            <h3>Check Ratings</h3>
            <p>See aggregate ratings for any product by its ID.</p>
            <button mat-raised-button color="primary" routerLink="/shop/rating">
              View Ratings
            </button>
          </mat-card>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: radial-gradient(circle at top left, #439cf5 0, #b6dcff 40%, #62adf2 100%);
      }

      .top-nav {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 32px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #e0e0e0;
      }

      .nav-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .brand-icon {
        font-size: 26px;
        color: #1976d2;
      }

      .brand-name {
        font-weight: 600;
        font-size: 18px;
        letter-spacing: 0.04em;
        color: #202124;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        justify-content: center;
      }

      .nav-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar-btn mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #1976d2;
      }

      .logout-btn {
        text-transform: none;
      }

      .content {
        flex: 1;
        padding: 32px;
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .hero {
        padding: 24px 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, #1976d2, #42a5f5);
        color: #ffffff;
        box-shadow: 0 18px 40px rgba(25, 118, 210, 0.35);
      }

      .hero-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      .hero-text h1 {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 600;
      }

      .hero-text p {
        margin: 0 0 0;
        font-size: 14px;
        opacity: 0.95;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 20px;
      }

      .feature-card {
        border-radius: 18px;
        padding: 18px 18px 20px;
        border: 1px solid #e3e6ea;
        background: linear-gradient(145deg, #ffffff, #f7f9fc);
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          border-color 0.18s ease;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 30px rgba(15, 23, 42, 0.09);
        border-color: #c5d0de;
      }

      .feature-icon {
        font-size: 26px;
        color: #1976d2;
      }

      .feature-card h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #202124;
      }

      .feature-card p {
        margin: 0;
        font-size: 14px;
        color: #5f6368;
      }

      .feature-card button {
        margin-top: 6px;
        text-transform: none;
      }

      @media (max-width: 768px) {
        .top-nav {
          padding: 10px 16px;
          flex-wrap: wrap;
        }

        .nav-links {
          order: 3;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .content {
          padding: 16px;
        }

        .hero-inner {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class AppPlaceholderComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
