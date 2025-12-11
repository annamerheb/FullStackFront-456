import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as UserActions from '../../state/user/user.actions';
import {
  selectOrders,
  selectUserLoading,
  selectOrdersCount,
} from '../../state/user/user.selectors';
import { OrderSummary } from '../../services/types';
import { OrderCardComponent } from '../../components/account/order-card.component';

@Component({
  standalone: true,
  selector: 'app-orders-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    OrderCardComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Mon compte</p>
            <h1 class="mt-2 text-4xl font-bold text-slate-900">Mes Commandes</h1>
          </div>
          <button mat-raised-button color="primary" routerLink="/account">
            ← Retour au profil
          </button>
        </div>

        <!-- Orders List -->
        <div *ngIf="loading$ | async; else ordersContent" class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <ng-template #ordersContent>
          <div *ngIf="(orders$ | async)?.length; else noOrders">
            <!-- Orders Grid -->
            <div class="grid gap-4 md:grid-cols-2">
              <app-order-card
                *ngFor="let order of orders$ | async"
                [order]="order"
              ></app-order-card>
            </div>

            <!-- Pagination -->
            <div class="mt-8">
              <mat-paginator
                [length]="ordersCount$ | async"
                [pageSize]="10"
                [pageSizeOptions]="[5, 10, 20]"
                (page)="onPageChange($event)"
              ></mat-paginator>
            </div>
          </div>

          <ng-template #noOrders>
            <mat-card class="text-center">
              <mat-card-content>
                <mat-icon class="mb-4 text-6xl text-slate-300">shopping_bag</mat-icon>
                <p class="text-lg text-slate-600">Vous n'avez encore aucune commande</p>
                <button mat-raised-button color="primary" routerLink="/shop/products" class="mt-4">
                  Découvrir nos produits
                </button>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      mat-card {
        border-radius: 0.75rem;
      }

      [routerLink] {
        text-decoration: none;
      }

      mat-card-actions {
        justify-content: flex-end;
      }
    `,
  ],
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  orders$: Observable<OrderSummary[]>;
  loading$: Observable<boolean>;
  ordersCount$: Observable<number>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.orders$ = this.store.select(selectOrders);
    this.loading$ = this.store.select(selectUserLoading);
    this.ordersCount$ = this.store.select(selectOrdersCount);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserProfile());
    this.store.dispatch(UserActions.loadOrders({ page: 1, pageSize: 10 }));
  }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1; // Convert 0-indexed to 1-indexed
    const pageSize = event.pageSize;
    this.store.dispatch(UserActions.loadOrders({ page, pageSize }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
