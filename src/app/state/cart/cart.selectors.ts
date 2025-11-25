import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.models';

export const selectCartFeature = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartFeature, (state) => state.items);

export const selectCartTotal = createSelector(selectCartFeature, (state) => state.totalPrice);

export const selectCartCount = createSelector(selectCartFeature, (state) => state.itemCount);

export const selectCartEmpty = createSelector(selectCartCount, (count) => count === 0);
