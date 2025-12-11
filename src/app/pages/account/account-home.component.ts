import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as UserActions from '../../state/user/user.actions';
import { selectUser, selectUserLoading, selectOrders } from '../../state/user/user.selectors';
import { ProfileSummaryComponent } from '../../components/account/profile-summary.component';
import { OrderCardComponent } from '../../components/account/order-card.component';
import { User, OrderSummary } from '../../services/types';

@Component({
  standalone: true,
  selector: 'app-account-home',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProfileSummaryComponent,
    OrderCardComponent,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-6xl">
        <!-- Header with Welcome -->
        <div class="mb-12">
          <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Mon compte</p>
          <h1 class="mt-2 text-4xl font-bold text-slate-900">
            Bienvenue{{ (user$ | async)?.fullName ? ', ' + (user$ | async)?.fullName : '' }}!
          </h1>
          <p class="mt-2 text-slate-600">
            Gérez votre profil, vos préférences et consultez l'historique de vos commandes.
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async; else contentReady" class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Main Content -->
        <ng-template #contentReady>
          <div class="space-y-12">
            <!-- Profile Summary Section -->
            <section>
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">Mon Profil</h2>
                  <p class="mt-1 text-slate-600">Informations personnelles et préférences</p>
                </div>
                <button
                  mat-raised-button
                  color="primary"
                  routerLink="/account/profile"
                  class="hidden sm:inline-flex"
                >
                  Modifier le profil
                  <mat-icon>edit</mat-icon>
                </button>
              </div>
              <app-profile-summary
                *ngIf="user$ | async as user"
                [user]="user"
              ></app-profile-summary>
            </section>

            <!-- Recent Orders Section -->
            <section>
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">Commandes Récentes</h2>
                  <p class="mt-1 text-slate-600">Vos 3 dernières commandes</p>
                </div>
                <button
                  mat-raised-button
                  color="primary"
                  routerLink="/account/orders"
                  class="hidden sm:inline-flex"
                >
                  Voir tout l'historique
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>

              <div *ngIf="(recentOrders$ | async)?.length; else noOrders">
                <div class="grid gap-4 md:grid-cols-3">
                  <app-order-card
                    *ngFor="let order of recentOrders$ | async"
                    [order]="order"
                  ></app-order-card>
                </div>
              </div>

              <ng-template #noOrders>
                <div class="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                  <mat-icon class="mb-3 inline-block text-4xl text-slate-300"
                    >shopping_bag</mat-icon
                  >
                  <p class="text-slate-600">Aucune commande encore</p>
                  <button
                    mat-stroked-button
                    color="primary"
                    routerLink="/shop/products"
                    class="mt-4"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              </ng-template>
            </section>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      section {
        animation: slideIn 0.3s ease-in-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class AccountHomeComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  orders$: Observable<OrderSummary[]>;
  recentOrders$: Observable<OrderSummary[]>;
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.orders$ = this.store.select(selectOrders);
    this.loading$ = this.store.select(selectUserLoading);

    this.recentOrders$ = this.orders$.pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserProfile());
    this.store.dispatch(UserActions.loadOrders({ page: 1, pageSize: 3 }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
