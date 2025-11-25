import { createReducer, on } from '@ngrx/store';
import * as WishlistActions from './wishlist.actions';
import { WishlistItem } from './wishlist.actions';

export interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistReducer = createReducer(
  initialState,

  on(WishlistActions.addToWishlist, (state, { product }) => ({
    ...state,
    items: state.items.some((item) => item.id === product.id)
      ? state.items
      : [...state.items, product],
  })),

  on(WishlistActions.removeFromWishlist, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== productId),
  })),

  on(WishlistActions.clearWishlist, (state) => ({
    ...state,
    items: [],
  })),
);
