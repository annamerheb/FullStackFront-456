import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { appInit } from '../app.actions';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  addToCartNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addToCart),
        tap(({ product, quantity }) => {
          this.notification.success(`✅ "${product.name}" x${quantity} ajouté au panier`);
        }),
      ),
    { dispatch: false },
  );

  removeFromCartNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.removeFromCart),
        tap(({ productId }) => {
          this.notification.success(`🗑️ Produit supprimé du panier`);
        }),
      ),
    { dispatch: false },
  );

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
                  this.notification.success('✅ Stock vérifié avec succès');
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

                  // Show first error as notification
                  if (errors.length > 0) {
                    this.notification.error(`❌ ${errors[0]}`);
                  }
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

                // Show notification for error
                if (errors.length > 0) {
                  this.notification.error(`⚠️ ${errors[0]}`);
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
