import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of, EMPTY } from 'rxjs';
import { map, catchError, switchMap, tap, filter, take } from 'rxjs/operators';
import * as DiscountsActions from './discounts.actions';
import * as DeliveryActions from '../delivery/delivery.actions';
import { selectCartItems } from '../cart/cart.selectors';
import {
  selectSelectedDeliveryOption,
  selectDeliveryOptionCost,
} from '../delivery/delivery.selectors';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';

@Injectable()
export class DiscountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);

  applyCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountsActions.applyCoupon),
      switchMap(({ code }) => {
        return combineLatest([
          this.store.select(selectCartItems),
          this.store.select(selectDeliveryOptionCost),
        ]).pipe(
          take(1), // Only take the first emission, don't re-trigger on changes
          switchMap(([items, shippingCost]) => {
            // Format items for the API
            const apiItems = items.map((item: any) => ({
              product: item.product,
              quantity: item.quantity,
            }));

            const payload = {
              items: apiItems,
              promo_code: code,
              shipping: shippingCost || 10,
            };

            return this.http.post<any>('/api/cart/apply-promo/', payload).pipe(
              map((response) => {
                const coupon = {
                  code: code.toUpperCase(),
                  discount: response.discount,
                  type: 'fixed' as const,
                };

                // Dispatch free shipping action if the code is FREESHIP
                if (code.toUpperCase() === 'FREESHIP') {
                  this.store.dispatch(DeliveryActions.setFreeShipping());
                } else {
                  this.store.dispatch(DeliveryActions.clearFreeShipping());
                }

                return DiscountsActions.applyCouponSuccess({
                  coupon,
                  discountAmount: response.discount,
                });
              }),
              catchError((error) => {
                this.store.dispatch(DeliveryActions.clearFreeShipping());
                return of(
                  DiscountsActions.applyCouponFailure({
                    error:
                      error.error?.error ||
                      `Invalid promo code: "${code}". Try WELCOME10, FREESHIP, or VIP20.`,
                  }),
                );
              }),
            );
          }),
        );
      }),
    ),
  );

  removeCoupon$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DiscountsActions.removeCoupon),
        tap(() => {
          // Immediately dispatch clearFreeShipping to ensure delivery state is updated
          this.store.dispatch(DeliveryActions.clearFreeShipping());
        }),
      ),
    { dispatch: false },
  );
}
