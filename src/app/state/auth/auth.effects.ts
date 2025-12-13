import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly storageKey = 'auth_tokens';
  private readonly notification = inject(NotificationService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map(({ username, password }) => {
        return AuthActions.loginSuccess({
          access: 'mock-access-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
        });
      }),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ access, refresh }) => {
          localStorage.setItem(this.storageKey, JSON.stringify({ access, refresh }));
          this.notification.success('✅ Connexion réussie');
        }),
      ),
    { dispatch: false },
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      map(({ refreshToken }) => {
        return AuthActions.refreshTokenSuccess({
          access: 'mock-access-token-refreshed-' + Date.now(),
        });
      }),
    ),
  );

  refreshTokenSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ access }) => {
          const stored = localStorage.getItem(this.storageKey);
          if (stored) {
            const tokens = JSON.parse(stored);
            localStorage.setItem(this.storageKey, JSON.stringify({ ...tokens, access }));
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.notification.success('👋 Déconnexion réussie');
          localStorage.removeItem(this.storageKey);
        }),
      ),
    { dispatch: false },
  );

  restoreAuthFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreAuthFromStorage),
      map(() => {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          try {
            const { access, refresh } = JSON.parse(stored);
            return AuthActions.restoreAuthFromStorageSuccess({
              access,
              refresh,
            });
          } catch (error) {
            console.error('Failed to parse stored auth tokens:', error);
            localStorage.removeItem(this.storageKey);
            return AuthActions.restoreAuthFromStorageSuccess({
              access: null,
              refresh: null,
            });
          }
        }
        return AuthActions.restoreAuthFromStorageSuccess({
          access: null,
          refresh: null,
        });
      }),
    ),
  );
}
