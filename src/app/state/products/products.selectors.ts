import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

const selectProductsFeature = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.items,
);

export const selectProductsCount = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.count,
);

export const selectProductsLoading = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.loading,
);

export const selectProductsError = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.error,
);

export const selectLastFilters = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.lastFilters,
);

export const selectRating = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.rating,
);

export const selectRatingLoading = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.ratingLoading,
);

export const selectRatingError = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.ratingError,
);

/**
 * COMPOSED/MEMOIZED SELECTORS - Advanced product analytics
 */

/**
 * selectProductsByRating - Filters products by minimum rating threshold
 * Useful for showing highly-rated products
 * @param minRating - Minimum average rating (default: 3.5)
 */
export const selectProductsByRating = (minRating: number = 3.5) =>
  createSelector(selectAllProducts, (products) =>
    products.filter((product) => (product.avgRating || 0) >= minRating),
  );

/**
 * selectDiscountedProducts - Filters products with active discounts
 * Groups products by discount percentage
 * Useful for sales and promotional pages
 */
export const selectDiscountedProducts = createSelector(selectAllProducts, (products) => {
  const discounted = products.filter((p) => (p.discount || 0) > 0);
  const maxDiscount =
    discounted.length > 0 ? Math.max(...discounted.map((p) => p.discount || 0)) : 0;

  return {
    all: discounted,
    highDiscount: discounted.filter((p) => (p.discount || 0) >= 20),
    mediumDiscount: discounted.filter((p) => (p.discount || 0) >= 10 && (p.discount || 0) < 20),
    lowDiscount: discounted.filter((p) => (p.discount || 0) < 10),
    maxDiscount,
    bestDeal: discounted.reduce(
      (best, product) => ((product.discount || 0) > (best.discount || 0) ? product : best),
      { discount: 0 } as any,
    ),
    totalSavingsPotential: discounted.reduce((sum, p) => {
      const discount = (p.price * (p.discount || 0)) / 100;
      return sum + discount;
    }, 0),
  };
});

/**
 * selectLowStockProducts - Identifies products with low stock
 * Alerts for inventory management
 * @param threshold - Stock threshold (default: 5)
 */
export const selectLowStockProducts = (threshold: number = 5) =>
  createSelector(selectAllProducts, (products) =>
    products.filter((product) => product.stock > 0 && product.stock <= threshold),
  );

/**
 * selectOutOfStockProducts - Filters out-of-stock products
 * Useful for managing availability notifications
 */
export const selectOutOfStockProducts = createSelector(selectAllProducts, (products) =>
  products.filter((product) => product.stock === 0),
);

/**
 * selectProductCatalogSummary - Complete product catalog metrics
 * Single memoized selector for all product-related statistics
 * More efficient than multiple subscriptions
 */
export const selectProductCatalogSummary = createSelector(
  selectAllProducts,
  selectProductsCount,
  (products, count) => {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const averagePrice = count > 0 ? products.reduce((sum, p) => sum + p.price, 0) / count : 0;
    const averageRating =
      count > 0 ? products.reduce((sum, p) => sum + (p.avgRating || 0), 0) / count : 0;
    const withDiscount = products.filter((p) => (p.discount || 0) > 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    return {
      totalProducts: count,
      totalValue,
      averagePrice,
      averageRating,
      withDiscount,
      lowStock,
      outOfStock,
      availableProducts: count - outOfStock,
      availabilityRate: count > 0 ? ((count - outOfStock) / count) * 100 : 0,
    };
  },
);

/**
 * selectProductsByPriceRange - Groups products by price brackets
 * Useful for price filtering UI
 */
export const selectProductsByPriceRange = createSelector(selectAllProducts, (products) => ({
  budget: products.filter((p) => p.price < 50),
  midRange: products.filter((p) => p.price >= 50 && p.price < 200),
  premium: products.filter((p) => p.price >= 200 && p.price < 500),
  luxury: products.filter((p) => p.price >= 500),
}));

/**
 * CACHE MANAGEMENT SELECTORS - "stale-while-revalidate" pattern
 */

/**
 * selectCacheTimestamp - Returns when cache was last updated
 * Useful for debugging and cache validation
 */
export const selectCacheTimestamp = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.cacheTimestamp,
);

/**
 * selectIsCacheStale - Determines if cache needs revalidation
 * Returns true if cache is older than 5 minutes or never set
 */
export const selectIsCacheStale = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.isCacheStale,
);

/**
 * selectIsRevalidating - Indicates if background revalidation is happening
 * Useful for loading indicators in background
 */
export const selectIsRevalidating = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.isRevalidating,
);

/**
 * selectCacheStatus - Complete cache status information
 * Combines all cache-related state into single object
 * Memoized: Only recalculates when cache state changes
 */
export const selectCacheStatus = createSelector(
  selectCacheTimestamp,
  selectIsCacheStale,
  selectIsRevalidating,
  selectProductsCount,
  (timestamp, isStale, isRevalidating, count) => ({
    timestamp,
    isStale,
    isRevalidating,
    hasData: count > 0,
    cacheAge: timestamp ? Date.now() - timestamp : null,
    status: isRevalidating ? 'revalidating' : isStale ? 'stale' : 'fresh',
  }),
);
