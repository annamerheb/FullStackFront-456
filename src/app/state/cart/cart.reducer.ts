import { createReducer, on, Action } from '@ngrx/store';
import * as CartActions from './cart.actions';
import {
  CartState,
  initialCartState,
  calculateTotalPrice,
  calculateItemCount,
} from './cart.models';

const cartReducerImpl = createReducer(
  initialCartState,
  on(CartActions.addToCart, (state, { product, quantity }) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);

    let newItems;
    if (existingItem) {
      newItems = state.items.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    } else {
      newItems = [...state.items, { product, quantity }];
    }

    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotalPrice(newItems),
      itemCount: calculateItemCount(newItems),
    };
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const newItems = state.items.filter((item) => item.product.id !== productId);

    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotalPrice(newItems),
      itemCount: calculateItemCount(newItems),
    };
  }),

  on(CartActions.updateCartItemQuantity, (state, { productId, quantity }): CartState => {
    if (quantity <= 0) {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      return {
        ...state,
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    const newItems = state.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );

    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotalPrice(newItems),
      itemCount: calculateItemCount(newItems),
    };
  }),

  on(CartActions.clearCart, () => initialCartState),

  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items: items || [],
    totalPrice: calculateTotalPrice(items || []),
    itemCount: calculateItemCount(items || []),
  })),

  on(CartActions.validateStockRequest, (state) => ({
    ...state,
    isValidatingStock: true,
    stockValidationErrors: [],
  })),

  on(CartActions.validateStockSuccess, (state) => ({
    ...state,
    isValidatingStock: false,
    stockValidationErrors: [],
  })),

  on(CartActions.validateStockFailure, (state, { errors }) => ({
    ...state,
    isValidatingStock: false,
    stockValidationErrors: errors,
  })),
);

export function cartFeatureReducer(state: CartState | undefined, action: Action): CartState {
  return cartReducerImpl(state, action);
}
