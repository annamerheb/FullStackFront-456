import { createAction, props } from '@ngrx/store';
import { Product } from '../../services/types';
import { CartItem } from './cart.models';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product; quantity: number }>(),
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>(),
);

export const updateCartItemQuantity = createAction(
  '[Cart] Update Item Quantity',
  props<{ productId: number; quantity: number }>(),
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCartFromStorage = createAction(
  '[Cart] Load From Storage',
  props<{ items: CartItem[] }>(),
);

export const saveCartToStorage = createAction('[Cart] Save To Storage');
