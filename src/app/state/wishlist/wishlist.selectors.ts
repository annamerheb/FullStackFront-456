import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';

const selectWishlistFeature = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistFeature,
  (state: WishlistState) => state.items,
);

export const selectWishlistCount = createSelector(selectWishlistItems, (items) => items.length);

export const selectIsInWishlist = (productId: number) =>
  createSelector(selectWishlistItems, (items) => items.some((item) => item.id === productId));
