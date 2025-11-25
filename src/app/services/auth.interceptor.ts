import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../state/auth/auth.selectors';
import { take, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectAccessToken).pipe(
      take(1),
      switchMap((token) => {
        let authReq = req;

        if (token) {
          authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(`[Interceptor] Added Authorization header to ${req.url}`);
        }

        return next.handle(authReq);
      }),
    );
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Get the access token from store
  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap((token) => {
      let authReq = req;

      // If token exists, clone request and add Authorization header
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`[Interceptor] Added Authorization header to ${req.url}`);
      }

      return next(authReq);
    }),
  );
};
