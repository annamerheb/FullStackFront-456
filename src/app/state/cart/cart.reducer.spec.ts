import { cartFeatureReducer } from './cart.reducer';
import * as CartActions from './cart.actions';
import { CartState, initialCartState } from './cart.models';

/**
 * Unit tests for Cart Reducer
 * Tests pure reducer logic for cart state management
 */
describe('Cart Reducer', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
    created_at: '2025-01-01',
    image: 'test.jpg',
    avgRating: 4.5,
    stock: 10,
    lowStockThreshold: 2,
    discount: 10, // 10% discount
  };

  const mockProduct2 = {
    id: 2,
    name: 'Test Product 2',
    price: 50,
    created_at: '2025-01-01',
    image: 'test2.jpg',
    avgRating: 3.5,
    stock: 5,
    lowStockThreshold: 1,
    discount: 0,
  };

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'UNKNOWN' };
      const result = cartFeatureReducer(undefined, action as any);

      expect(result).toEqual(initialCartState);
      expect(result.items).toEqual([]);
      expect(result.totalPrice).toBe(0);
      expect(result.itemCount).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add a new item to empty cart', () => {
      const action = CartActions.addToCart({ product: mockProduct, quantity: 2 });
      const state = cartFeatureReducer(initialCartState, action);

      expect(state.items.length).toBe(1);
      expect(state.items[0].product.id).toBe(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should calculate correct total price with discount', () => {
      // mockProduct has 10% discount: 100 * 0.9 = 90 per unit
      // With quantity 2: 90 * 2 = 180
      const action = CartActions.addToCart({ product: mockProduct, quantity: 2 });
      const state = cartFeatureReducer(initialCartState, action);

      expect(state.totalPrice).toBe(180);
    });

    it('should increment quantity if product already exists', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct, quantity: 3 }),
      );

      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(5); // 2 + 3
    });

    it('should increment count correctly', () => {
      const action = CartActions.addToCart({ product: mockProduct, quantity: 3 });
      const state = cartFeatureReducer(initialCartState, action);

      expect(state.itemCount).toBe(3);
    });

    it('should add multiple different products', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 1 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct2, quantity: 2 }),
      );

      expect(state.items.length).toBe(2);
      expect(state.itemCount).toBe(3); // 1 + 2
      // mockProduct: 100 * 0.9 * 1 = 90
      // mockProduct2: 50 * 1 * 2 = 100
      // Total: 190
      expect(state.totalPrice).toBe(190);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(state, CartActions.removeFromCart({ productId: 1 }));

      expect(state.items.length).toBe(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should recalculate total after removing item', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 1 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct2, quantity: 1 }),
      );

      state = cartFeatureReducer(state, CartActions.removeFromCart({ productId: 1 }));

      expect(state.items.length).toBe(1);
      expect(state.items[0].product.id).toBe(2);
      expect(state.totalPrice).toBe(50); // Only mockProduct2
      expect(state.itemCount).toBe(1);
    });

    it('should not affect other items when removing one', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct2, quantity: 3 }),
      );

      state = cartFeatureReducer(state, CartActions.removeFromCart({ productId: 1 }));

      expect(state.items.length).toBe(1);
      expect(state.items[0].product.id).toBe(2);
      expect(state.items[0].quantity).toBe(3); // Unchanged
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update quantity of existing item', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.updateCartItemQuantity({ productId: 1, quantity: 5 }),
      );

      expect(state.items[0].quantity).toBe(5);
      expect(state.itemCount).toBe(5);
    });

    it('should recalculate total price when quantity updates', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.updateCartItemQuantity({ productId: 1, quantity: 3 }),
      );

      // mockProduct: (100 * 0.9) * 3 = 270
      expect(state.totalPrice).toBe(270);
    });

    it('should remove item if quantity is set to 0', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.updateCartItemQuantity({ productId: 1, quantity: 0 }),
      );

      expect(state.items.length).toBe(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should remove item if quantity is negative', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.updateCartItemQuantity({ productId: 1, quantity: -1 }),
      );

      expect(state.items.length).toBe(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should not affect other items when updating one', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct2, quantity: 1 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.updateCartItemQuantity({ productId: 1, quantity: 5 }),
      );

      expect(state.items.length).toBe(2);
      expect(state.items[0].quantity).toBe(5);
      expect(state.items[1].quantity).toBe(1); // Unchanged
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      let state = cartFeatureReducer(
        initialCartState,
        CartActions.addToCart({ product: mockProduct, quantity: 2 }),
      );

      state = cartFeatureReducer(
        state,
        CartActions.addToCart({ product: mockProduct2, quantity: 3 }),
      );

      state = cartFeatureReducer(state, CartActions.clearCart());

      expect(state).toEqual(initialCartState);
      expect(state.items.length).toBe(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});
