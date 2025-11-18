import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

const selectProductsFeature = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.items
);

export const selectProductsCount = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.count
);

export const selectProductsLoading = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.error
);

export const selectLastFilters = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.lastFilters
);

export const selectRating = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.rating
);

export const selectRatingLoading = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.ratingLoading
);

export const selectRatingError = createSelector(
  selectProductsFeature,
  (state: ProductsState) => state.ratingError
);
