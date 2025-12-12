import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as UserActions from '../../../../state/user/user.actions';
import { selectSelectedOrder, selectUserLoading } from '../../../../state/user/user.selectors';
import { OrderDetails } from '../../../../services/types';

@Component({
  standalone: true,
  selector: 'app-order-details-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-3xl">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Détails de la commande
            </p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">
              Commande #{{ (order$ | async)?.id }}
            </h1>
          </div>
          <button mat-raised-button color="primary" routerLink="/account/orders">
            ← Retour à la liste
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async; else orderContent" class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Order Content -->
        <ng-template #orderContent>
          <div *ngIf="order$ | async as order" class="space-y-6">
            <!-- Order Status Section -->
            <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-slate-900">État de la commande</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Statut:</span>
                  <span
                    [ngClass]="getStatusClass(order.status)"
                    class="rounded-full px-4 py-2 text-sm font-semibold uppercase"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-slate-600">Date de commande:</span>
                  <span class="font-semibold">
                    {{ order.orderDate | date: 'dd MMMM yyyy à HH:mm' }}
                  </span>
                </div>

                <div *ngIf="order.trackingNumber" class="flex items-center justify-between">
                  <span class="text-slate-600">Numéro de suivi:</span>
                  <span class="font-mono font-semibold">{{ order.trackingNumber }}</span>
                </div>

                <div *ngIf="order.estimatedDelivery" class="flex items-center justify-between">
                  <span class="text-slate-600">Livraison estimée:</span>
                  <span class="font-semibold">
                    {{ order.estimatedDelivery | date: 'dd MMMM yyyy' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Order Items Section -->
            <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-slate-900">
                Articles commandés ({{ order.items.length }})
              </h2>
              <div class="space-y-4">
                <div
                  *ngFor="let item of order.items; let last = last; trackBy: trackByOrderItemId"
                  class="space-y-2"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-semibold text-slate-900">{{ item.productName }}</p>
                      <p class="text-sm text-slate-600">Quantité: {{ item.quantity }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-sky-600">
                        {{ item.price | currency: 'EUR' }}
                      </p>
                      <p *ngIf="item.discount" class="text-sm text-green-600">
                        -{{ item.discount }}%
                      </p>
                    </div>
                  </div>
                  <mat-divider *ngIf="!last"></mat-divider>
                </div>
              </div>
            </div>

            <!-- Addresses Section -->
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Shipping Address -->
              <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900">Adresse de livraison</h3>
                <div class="space-y-1 text-sm text-slate-700">
                  <p class="font-semibold">{{ order.shippingAddress.street }}</p>
                  <p>{{ order.shippingAddress.postalCode }} {{ order.shippingAddress.city }}</p>
                  <p>{{ order.shippingAddress.country }}</p>
                </div>
              </div>

              <!-- Billing Address -->
              <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900">Adresse de facturation</h3>
                <div class="space-y-1 text-sm text-slate-700">
                  <p class="font-semibold">{{ order.billingAddress.street }}</p>
                  <p>{{ order.billingAddress.postalCode }} {{ order.billingAddress.city }}</p>
                  <p>{{ order.billingAddress.country }}</p>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="space-y-3 rounded-lg border border-slate-200 bg-sky-50 p-6 shadow-sm">
              <div class="flex justify-between text-sm">
                <span class="text-slate-700">Sous-total:</span>
                <span class="font-semibold">
                  {{ order.subtotalPrice || order.totalPrice | currency: 'EUR' }}
                </span>
              </div>
              <div *ngIf="order.shippingCost !== undefined" class="flex justify-between text-sm">
                <span class="text-slate-700">Livraison:</span>
                <span class="font-semibold">
                  {{ order.shippingCost | currency: 'EUR' }}
                </span>
              </div>
              <div *ngIf="order.taxAmount !== undefined" class="flex justify-between text-sm">
                <span class="text-slate-700">Taxe (8%):</span>
                <span class="font-semibold">
                  {{ order.taxAmount | currency: 'EUR' }}
                </span>
              </div>
              <div class="flex justify-between border-t pt-3">
                <span class="text-lg font-semibold text-slate-900">Montant total:</span>
                <span class="text-2xl font-bold text-sky-600">
                  {{ order.totalPrice | currency: 'EUR' }}
                </span>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      [routerLink] {
        text-decoration: none;
      }
    `,
  ],
})
export class OrderDetailsPageComponent implements OnInit, OnDestroy {
  order$: Observable<OrderDetails | null>;
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {
    this.order$ = this.store.select(selectSelectedOrder);
    this.loading$ = this.store.select(selectUserLoading);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const orderId = params['id'];
      if (orderId) {
        this.store.dispatch(UserActions.loadOrderDetails({ orderId }));
      }
    });
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

  ngOnDestroy(): void {
    this.store.dispatch(UserActions.clearOrderDetails());
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * TrackBy function for order items in *ngFor
   * Uses product name and index to identify items uniquely
   */
  trackByOrderItemId(index: number, item: any): string {
    return item.productName || index.toString();
  }
}
