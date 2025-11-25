import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);

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
}
