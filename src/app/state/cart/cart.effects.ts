import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { appInit } from '../app.actions';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);

  saveCartToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addToCart,
          CartActions.removeFromCart,
          CartActions.updateCartItemQuantity,
          CartActions.clearCart,
        ),
        tap(() => {
          this.store.select(selectCartItems).subscribe((items) => {
            localStorage.setItem('cart', JSON.stringify(items));
          });
        }),
      ),
    { dispatch: false },
  );

  loadCartFromStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(appInit),
        tap(() => {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const cart = JSON.parse(savedCart);
              this.store.dispatch(CartActions.loadCartFromStorage({ items: cart }));
            } catch (e) {
              localStorage.removeItem('cart');
            }
          }
        }),
      ),
    { dispatch: false },
  );

  validateStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.validateStockRequest),
      switchMap(() => {
        return this.store.select(selectCartItems).pipe(
          switchMap((items) => {
            const payload = {
              items: items.map((item) => ({
                product: item.product.id,
                quantity: item.quantity,
              })),
            };

            return this.http.post<any>('/api/cart/validate-stock/', payload).pipe(
              map((response) => {
                if (response.valid) {
                  return CartActions.validateStockSuccess();
                } else {
                  // Format error messages for display
                  const errors = response.errors?.map((error: any) => {
                    if (error.message) {
                      return error.message;
                    }
                    // Handle format: "Stock insuffisant pour le produit X" or similar
                    if (error.product && error.quantity) {
                      return `Stock insuffisant pour le produit ${error.product}. Quantité demandée: ${error.quantity}`;
                    }
                    return error;
                  }) || ['Validation du stock échouée'];
                  return CartActions.validateStockFailure({ errors });
                }
              }),
              catchError((error) => {
                let errors: string[] = [];

                // Handle different error response formats
                if (error.error?.errors) {
                  if (Array.isArray(error.error.errors)) {
                    errors = error.error.errors.map((e: any) => {
                      if (typeof e === 'string') return e;
                      if (e.message) return e.message;
                      if (e.product) return `Stock insuffisant pour le produit ${e.product}`;
                      return 'Stock insuffisant';
                    });
                  } else {
                    errors = [error.error.errors];
                  }
                } else if (error.error?.detail) {
                  errors = [error.error.detail];
                } else if (error.error?.message) {
                  errors = [error.error.message];
                } else {
                  errors = ['Impossible de valider le stock'];
                }

                return of(CartActions.validateStockFailure({ errors }));
              }),
            );
          }),
        );
      }),
    ),
  );
}
