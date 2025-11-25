import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiscountsState } from './discounts.reducer';

const selectDiscountsFeature = createFeatureSelector<DiscountsState>('discounts');

export const selectAppliedCoupon = createSelector(
  selectDiscountsFeature,
  (state: DiscountsState) => state.appliedCoupon,
);

export const selectDiscountAmount = createSelector(
  selectDiscountsFeature,
  (state: DiscountsState) => state.discountAmount,
);

export const selectDiscountsError = createSelector(
  selectDiscountsFeature,
  (state: DiscountsState) => state.error,
);

export const selectProductDiscounts = createSelector(
  selectDiscountsFeature,
  (state: DiscountsState) => state.productDiscounts,
);

export const selectProductDiscount = (productId: number) =>
  createSelector(selectProductDiscounts, (discounts) => discounts[productId] || 0);
