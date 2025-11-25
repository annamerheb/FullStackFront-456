import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, take } from 'rxjs/operators';
import * as DiscountsActions from './discounts.actions';
import { selectCartTotal } from '../cart/cart.selectors';
import { Store } from '@ngrx/store';

// Coupon database
const VALID_COUPONS: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
  SAVE10: { discount: 10, type: 'percentage' },
  SAVE15: { discount: 15, type: 'percentage' },
  SAVE20: { discount: 20, type: 'percentage' },
  WELCOME: { discount: 5, type: 'percentage' },
};

@Injectable()
export class DiscountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  applyCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscountsActions.applyCoupon),
      switchMap(({ code }) => {
        const upperCode = code.toUpperCase().trim();
        const couponData = VALID_COUPONS[upperCode];

        if (!couponData) {
          return of(
            DiscountsActions.applyCouponFailure({
              error: `Invalid coupon code: "${code}". Try SAVE10, SAVE15, SAVE20, or WELCOME.`,
            }),
          );
        }

        // Get current cart total and calculate discount
        return this.store.select(selectCartTotal).pipe(
          take(1),
          map((total) => {
            const discountAmount =
              couponData.type === 'percentage'
                ? (total * couponData.discount) / 100
                : couponData.discount;

            const coupon = {
              code: upperCode,
              discount: couponData.discount,
              type: couponData.type,
            };

            return DiscountsActions.applyCouponSuccess({
              coupon,
              discountAmount,
            });
          }),
        );
      }),
    ),
  );
}
