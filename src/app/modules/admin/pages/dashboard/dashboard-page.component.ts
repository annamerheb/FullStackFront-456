import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import * as AdminActions from '../../../../state/admin/admin.actions';
import {
  selectAdminStats,
  selectAdminLoading,
  selectAdminError,
  selectTopProducts,
  selectRecentOrders,
} from '../../../../state/admin/admin.selectors';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Admin</p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
            <p class="mt-2 text-slate-600">Vue globale de l'activité du site</p>
          </div>
          <button mat-raised-button color="primary" routerLink="/app" class="w-full sm:w-auto">
            ← Retour à l'accueil
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async; else dashboardContent" class="flex justify-center py-12">
          <mat-spinner diameter="50"></mat-spinner>
        </div>

        <!-- Error State -->
        <div *ngIf="error$ | async as error" class="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          Erreur: {{ error }}
        </div>

        <ng-template #dashboardContent>
          <div *ngIf="stats$ | async as stats" class="space-y-8">
            <!-- Statistics Cards -->
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <!-- Total Users -->
              <mat-card class="section-card">
                <mat-card-content class="space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-600">Total Utilisateurs</p>
                    <mat-icon class="text-sky-600">people</mat-icon>
                  </div>
                  <p class="text-3xl font-bold text-slate-900">{{ stats.totalUsers }}</p>
                </mat-card-content>
              </mat-card>

              <!-- Total Orders -->
              <mat-card class="shadow-sm">
                <mat-card-content class="space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-600">Total Commandes</p>
                    <mat-icon class="text-green-600">shopping_cart</mat-icon>
                  </div>
                  <p class="text-3xl font-bold text-slate-900">{{ stats.totalOrders }}</p>
                </mat-card-content>
              </mat-card>

              <!-- Total Revenue -->
              <mat-card class="shadow-sm">
                <mat-card-content class="space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-600">Chiffre d'affaires</p>
                    <mat-icon class="text-amber-600">trending_up</mat-icon>
                  </div>
                  <p class="text-3xl font-bold text-slate-900">
                    {{ stats.totalRevenue | currency: 'EUR' }}
                  </p>
                </mat-card-content>
              </mat-card>
            </div>

            <!-- Top Products Section -->
            <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-slate-900">Produits les plus vendus</h2>
              <div class="space-y-4">
                <div
                  *ngFor="
                    let product of topProducts$ | async;
                    let last = last;
                    trackBy: trackByProductId
                  "
                  class="space-y-2"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-semibold text-slate-900">{{ product.name }}</p>
                      <p class="text-sm text-slate-600">Quantité vendue: {{ product.sold }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-sky-600">
                        {{ product.revenue | currency: 'EUR' }}
                      </p>
                    </div>
                  </div>
                  <mat-divider *ngIf="!last"></mat-divider>
                </div>
              </div>
            </div>

            <!-- Recent Orders Section -->
            <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-slate-900">Commandes récentes</h2>
              <div class="space-y-4">
                <div
                  *ngFor="
                    let order of recentOrders$ | async;
                    let last = last;
                    trackBy: trackByOrderId
                  "
                  class="space-y-2"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-semibold text-slate-900">{{ order.id }}</p>
                      <p class="text-sm text-slate-600">{{ order.user }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-sky-600">
                        {{ order.total | currency: 'EUR' }}
                      </p>
                      <p class="text-sm">
                        {{ order.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">Statut:</span>
                    <span
                      [ngClass]="getStatusClass(order.status)"
                      class="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                    >
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>
                  <mat-divider *ngIf="!last"></mat-divider>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
      }

      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }

      mat-card {
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
      }

      .section-card {
        border-radius: 1rem;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      }

      mat-card-header {
        margin-bottom: 0;
        padding: 0;
        border-bottom: none;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  topProducts$: Observable<any>;
  recentOrders$: Observable<any>;

  constructor(private store: Store) {
    this.stats$ = this.store.select(selectAdminStats);
    this.loading$ = this.store.select(selectAdminLoading);
    this.error$ = this.store.select(selectAdminError);
    this.topProducts$ = this.store.select(selectTopProducts);
    this.recentOrders$ = this.store.select(selectRecentOrders);
  }

  ngOnInit() {
    this.store.dispatch(AdminActions.loadAdminStats());
  }

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classMap[status] || 'bg-slate-100 text-slate-800';
  }

  // TrackBy functions for *ngFor lists
  trackByProductId(index: number, product: any): any {
    return product.productId;
  }

  trackByOrderId(index: number, order: any): any {
    return order.id;
  }
}
