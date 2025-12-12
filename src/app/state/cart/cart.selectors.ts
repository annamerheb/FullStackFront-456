import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.models';

export const selectCartFeature = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartFeature, (state) => state.items);

export const selectCartTotal = createSelector(selectCartFeature, (state) => state.totalPrice);

export const selectCartCount = createSelector(selectCartFeature, (state) => state.itemCount);

export const selectCartEmpty = createSelector(selectCartCount, (count) => count === 0);

export const selectStockValidationErrors = createSelector(
  selectCartFeature,
  (state) => state.stockValidationErrors,
);

export const selectIsValidatingStock = createSelector(
  selectCartFeature,
  (state) => state.isValidatingStock,
);

export const selectHasStockErrors = createSelector(
  selectStockValidationErrors,
  (errors) => errors.length > 0,
);

/**
 * COMPOSED/MEMOIZED SELECTORS - Advanced shopping cart analytics
 */

/**
 * selectCartTotalItems - Calculates total number of items in cart
 * Considers quantity per item
 * Memoized: Re-calculates only when cart items change
 */
export const selectCartTotalItems = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

/**
 * selectCartAveragePrice - Calculates average item price in cart
 * Includes discounts in the calculation
 * Returns 0 if cart is empty
 */
export const selectCartAveragePrice = createSelector(
  selectCartTotal,
  selectCartTotalItems,
  (total, itemCount) => (itemCount > 0 ? total / itemCount : 0),
);

/**
 * selectCartTotalDiscount - Calculates total discount amount
 * Aggregates all discounts from items in cart
 * Memoized for performance with large carts
 */
export const selectCartTotalDiscount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => {
    const originalPrice = item.product.price * item.quantity;
    const discountPercent = item.product.discount || 0;
    const discountAmount = (originalPrice * discountPercent) / 100;
    return total + discountAmount;
  }, 0),
);

/**
 * selectCartSummary - Complete cart summary with computed fields
 * Single memoized selector combining all cart metrics
 * More efficient than multiple selector subscriptions
 */
export const selectCartSummary = createSelector(
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartTotalItems,
  selectCartAveragePrice,
  selectCartTotalDiscount,
  (items, count, total, totalItems, avgPrice, totalDiscount) => ({
    items,
    itemCount: count,
    totalPrice: total,
    totalItems,
    averagePrice: avgPrice,
    totalDiscount,
    isEmpty: count === 0,
    hasItems: count > 0,
  }),
);

/**
 * selectHighValueCartItems - Filters items above price threshold
 * Useful for highlighting premium items
 * @param threshold - Price threshold (default: 100)
 */
export const selectHighValueCartItems = (threshold: number = 100) =>
  createSelector(selectCartItems, (items) =>
    items.filter((item) => item.product.price >= threshold),
  );

/**
 * selectCartItemsByDiscount - Groups items by discount status
 * Returns items with and without discounts
 */
export const selectCartItemsByDiscount = createSelector(selectCartItems, (items) => ({
  discounted: items.filter((item) => (item.product.discount ?? 0) > 0),
  regularPrice: items.filter((item) => (item.product.discount ?? 0) === 0),
  totalDiscountedValue: items
    .filter((item) => (item.product.discount ?? 0) > 0)
    .reduce((sum, item) => sum + item.quantity, 0),
}));
