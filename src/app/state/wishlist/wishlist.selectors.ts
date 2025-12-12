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

/**
 * COMPOSED/MEMOIZED SELECTORS - Advanced wishlist analytics
 */

/**
 * selectWishlistProducts - Returns wishlist items with enriched metadata
 * Includes calculation of total value and average price
 * Memoized: Only recalculates when wishlist items change
 */
export const selectWishlistProducts = createSelector(selectWishlistItems, (items) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  const averagePrice = items.length > 0 ? totalValue / items.length : 0;
  const maxPrice = items.length > 0 ? Math.max(...items.map((i) => i.price)) : 0;
  const minPrice = items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;

  return {
    items,
    totalValue,
    averagePrice,
    maxPrice,
    minPrice,
    hasItems: items.length > 0,
    count: items.length,
  };
});

/**
 * selectWishlistProductsByRating - Groups wishlist items by stock priority
 * Prioritizes items that are available vs. out of stock
 * Useful for sorting wishlist by availability
 */
export const selectWishlistProductsByRating = createSelector(selectWishlistItems, (items) => ({
  available: items.filter((item) => (item.stock || 0) > 0),
  unavailable: items.filter((item) => (item.stock || 0) === 0),
  averageStock:
    items.length > 0 ? items.reduce((sum, item) => sum + (item.stock || 0), 0) / items.length : 0,
}));

/**
 * selectWishlistProductsByStock - Groups by stock availability
 * Identifies items in stock vs. out of stock in wishlist
 * Helps with purchase decisions and notifications
 */
export const selectWishlistProductsByStock = createSelector(selectWishlistItems, (items) => ({
  inStock: items.filter((item) => (item.stock || 0) > 0),
  outOfStock: items.filter((item) => (item.stock || 0) === 0),
  lowStock: items.filter(
    (item) => (item.stock || 0) > 0 && (item.stock || 0) <= (item.lowStockThreshold || 5),
  ),
  totalAvailableValue: items
    .filter((item) => (item.stock || 0) > 0)
    .reduce((sum, item) => sum + item.price, 0),
}));

/**
 * selectWishlistProductsByDiscount - Groups by price range
 * Categorizes items by price brackets for smart shopping
 * Useful for "Best deals in wishlist" feature
 */
export const selectWishlistProductsByDiscount = createSelector(selectWishlistItems, (items) => {
  const sorted = [...items].sort((a, b) => a.price - b.price);
  const highPriceItems = items.filter((item) => item.price > 100);
  const mediumPriceItems = items.filter((item) => item.price >= 50 && item.price <= 100);
  const lowPriceItems = items.filter((item) => item.price < 50);

  return {
    highPrice: highPriceItems,
    mediumPrice: mediumPriceItems,
    lowPrice: lowPriceItems,
    mostExpensive: sorted[sorted.length - 1],
    cheapest: sorted[0],
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
  };
});
