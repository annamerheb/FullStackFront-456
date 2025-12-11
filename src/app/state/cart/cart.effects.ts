import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { appInit } from '../app.actions';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

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
}
