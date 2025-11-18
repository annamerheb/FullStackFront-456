import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../state/auth/auth.selectors';
import { take, switchMap } from 'rxjs/operators';

/**
 * AuthInterceptor (Class-based)
 * 
 * Automatically appends the Authorization header with Bearer token
 * to all HTTP requests when an access token is available in the store.
 * 
 * Note: The functional version below is recommended for Angular 15+
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the access token from store and add it to request
    return this.store.select(selectAccessToken).pipe(
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

        return next.handle(authReq);
      })
    );
  }
}

/**
 * Functional Auth Interceptor (Angular 15+)
 * 
 * This is the recommended approach - simpler and more flexible
 * 
 * Register in app.config.ts:
 * ```
 * import { withInterceptors } from '@angular/common/http';
 * 
 * providers: [
 *   provideHttpClient(
 *     withInterceptors([authInterceptor])
 *   )
 * ]
 * ```
 */

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
    })
  );
};

