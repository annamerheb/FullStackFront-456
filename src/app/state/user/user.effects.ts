import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private shopApi = inject(ShopApiService);
  private notification = inject(NotificationService);

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserProfile),
      switchMap(() =>
        this.shopApi.getMe().pipe(
          map((user) => UserActions.loadUserProfileSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.loadUserProfileFailure({
                error: error.message || 'Failed to load user profile',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserProfile),
      switchMap(({ user }) =>
        this.shopApi.updateMe(user).pipe(
          map((updatedUser) => {
            this.notification.success('✅ Profil mis à jour');
            return UserActions.updateUserProfileSuccess({ user: updatedUser });
          }),
          catchError((error) => {
            this.notification.error('❌ Erreur lors de la mise à jour du profil');
            return of(
              UserActions.updateUserProfileFailure({
                error: error.message || 'Failed to update user profile',
              }),
            );
          }),
        ),
      ),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrders),
      switchMap(({ page = 1, pageSize = 10 }) =>
        this.shopApi.getMyOrders(page, pageSize).pipe(
          map((response) =>
            UserActions.loadOrdersSuccess({
              orders: response.results,
            }),
          ),
          catchError((error) => {
            this.notification.error('❌ Erreur lors du chargement des commandes');
            return of(
              UserActions.loadOrdersFailure({
                error: error.message || 'Failed to load orders',
              }),
            );
          }),
        ),
      ),
    ),
  );

  loadOrderDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrderDetails),
      switchMap(({ orderId }) =>
        this.shopApi.getOrder(orderId).pipe(
          map((order) => UserActions.loadOrderDetailsSuccess({ order })),
          catchError((error) => {
            this.notification.error('❌ Erreur lors du chargement des détails de la commande');
            return of(
              UserActions.loadOrderDetailsFailure({
                error: error.message || 'Failed to load order details',
              }),
            );
          }),
        ),
      ),
    ),
  );

  logoutUser$ = createEffect(() => this.actions$.pipe(ofType(UserActions.logoutUser)), {
    dispatch: false,
  });
}
