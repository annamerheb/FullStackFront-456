import { createAction, props } from '@ngrx/store';
import { Product } from '../../services/types';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: number;
  lowStockThreshold?: number;
  created_at?: string;
  avgRating?: number;
  discount?: number;
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
