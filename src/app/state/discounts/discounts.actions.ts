import { createAction, props } from '@ngrx/store';

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxUses?: number;
  expiresAt?: string;
}

export const applyCoupon = createAction('[Discounts] Apply Coupon', props<{ code: string }>());

export const applyCouponSuccess = createAction(
  '[Discounts] Apply Coupon Success',
  props<{ coupon: Coupon; discountAmount: number }>(),
);

export const applyCouponFailure = createAction(
  '[Discounts] Apply Coupon Failure',
  props<{ error: string }>(),
);

export const removeCoupon = createAction('[Discounts] Remove Coupon');

export const addProductDiscount = createAction(
  '[Discounts] Add Product Discount',
  props<{ productId: number; discount: number }>(),
);

export const removeProductDiscount = createAction(
  '[Discounts] Remove Product Discount',
  props<{ productId: number }>(),
);
