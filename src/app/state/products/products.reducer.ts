import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { Product, ProductsFilters } from './products.actions';

export interface ProductsState {
  items: Product[];
  count: number;
  loading: boolean;
  error: string | null;
  lastFilters: ProductsFilters | null;
  rating: {
    product_id: number;
    avg_rating: number;
    count: number;
  } | null;
  ratingLoading: boolean;
  ratingError: string | null;
  // Cache management - "stale-while-revalidate" pattern
  cacheTimestamp: number | null;
  isRevalidating: boolean;
  isCacheStale: boolean;
}

const initialState: ProductsState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
  lastFilters: null,
  rating: null,
  ratingLoading: false,
  ratingError: null,
  cacheTimestamp: null,
  isRevalidating: false,
  isCacheStale: true,
};

// Cache validity: 5 minutes (300000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.loadProducts, (state, { filters }) => ({
    ...state,
    loading: true,
    error: null,
    lastFilters: filters || null,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { data }) => ({
    ...state,
    items: data.results,
    count: data.count,
    loading: false,
    error: null,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductsActions.loadRating, (state) => ({
    ...state,
    ratingLoading: true,
    ratingError: null,
  })),

  on(ProductsActions.loadRatingSuccess, (state, { data }) => ({
    ...state,
    rating: data,
    ratingLoading: false,
    ratingError: null,
  })),

  on(ProductsActions.loadRatingFailure, (state, { error }) => ({
    ...state,
    ratingLoading: false,
    ratingError: error,
  })),

  // Cache-aware handlers
  on(ProductsActions.loadProductsFromCache, (state, { filters }) => ({
    ...state,
    loading: state.items.length === 0, // Only show loading if no cached items
    error: null,
    lastFilters: filters || null,
  })),

  on(ProductsActions.startRevalidatingCache, (state) => ({
    ...state,
    isRevalidating: true,
  })),

  on(ProductsActions.revalidateCacheSuccess, (state, { data }) => ({
    ...state,
    items: data.results,
    count: data.count,
    loading: false,
    error: null,
    isRevalidating: false,
    isCacheStale: false,
    cacheTimestamp: Date.now(),
  })),

  on(ProductsActions.setCacheTimestamp, (state, { timestamp }) => ({
    ...state,
    cacheTimestamp: timestamp,
    isCacheStale: false,
  })),

  on(ProductsActions.markCacheAsStale, (state) => ({
    ...state,
    isCacheStale: true,
    isRevalidating: false,
  })),

  on(ProductsActions.markCacheAsFresh, (state) => ({
    ...state,
    isCacheStale: false,
  })),
);
