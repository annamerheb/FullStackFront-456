import { createAction, props } from '@ngrx/store';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const addToWishlist = createAction(
  '[Wishlist] Add To Wishlist',
  props<{ product: WishlistItem }>(),
);

export const removeFromWishlist = createAction(
  '[Wishlist] Remove From Wishlist',
  props<{ productId: number }>(),
);

export const clearWishlist = createAction('[Wishlist] Clear Wishlist');

export const loadWishlistFromStorage = createAction(
  '[Wishlist] Load From Storage',
  props<{ productIds: number[] }>(),
);
