import { createReducer, on } from '@ngrx/store';
import * as DiscountsActions from './discounts.actions';
import { Coupon } from './discounts.actions';

export interface DiscountsState {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  error: string | null;
  productDiscounts: Record<number, number>;
}

const initialState: DiscountsState = {
  appliedCoupon: null,
  discountAmount: 0,
  error: null,
  productDiscounts: {},
};

export const discountsReducer = createReducer(
  initialState,

  on(DiscountsActions.applyCoupon, (state, { code }) => state),

  on(DiscountsActions.applyCouponSuccess, (state, { coupon, discountAmount }) => ({
    ...state,
    appliedCoupon: coupon,
    discountAmount,
    error: null,
  })),

  on(DiscountsActions.applyCouponFailure, (state, { error }) => ({
    ...state,
    error,
    appliedCoupon: null,
    discountAmount: 0,
  })),

  on(DiscountsActions.removeCoupon, (state) => ({
    ...state,
    appliedCoupon: null,
    discountAmount: 0,
    error: null,
  })),

  on(DiscountsActions.addProductDiscount, (state, { productId, discount }) => ({
    ...state,
    productDiscounts: {
      ...state.productDiscounts,
      [productId]: discount,
    },
  })),

  on(DiscountsActions.removeProductDiscount, (state, { productId }) => {
    const newProductDiscounts = { ...state.productDiscounts };
    delete newProductDiscounts[productId];
    return {
      ...state,
      productDiscounts: newProductDiscounts,
    };
  }),
);
