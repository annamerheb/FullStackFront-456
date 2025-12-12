import { createAction, props } from '@ngrx/store';

export interface ProductsFilters {
  page?: number;
  pageSize?: number;
  minRating?: number;
  ordering?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  image: string;
  avgRating: number;
  stock: number;
  lowStockThreshold: number;
  discount?: number;
}

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filters?: ProductsFilters }>(),
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: { count: number; results: Product[] } }>(),
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>(),
);

export const loadRating = createAction('[Products] Load Rating', props<{ productId: number }>());

export const loadRatingSuccess = createAction(
  '[Products] Load Rating Success',
  props<{ data: { product_id: number; avg_rating: number; count: number } }>(),
);

export const loadRatingFailure = createAction(
  '[Products] Load Rating Failure',
  props<{ error: string }>(),
);

/**
 * Cache-aware loading actions for "stale-while-revalidate" pattern
 */

export const loadProductsFromCache = createAction(
  '[Products] Load Products From Cache',
  props<{ filters?: ProductsFilters }>(),
);

export const startRevalidatingCache = createAction(
  '[Products] Start Revalidating Cache',
  props<{ filters?: ProductsFilters }>(),
);

export const revalidateCacheSuccess = createAction(
  '[Products] Revalidate Cache Success',
  props<{ data: { count: number; results: Product[] } }>(),
);

export const setCacheTimestamp = createAction(
  '[Products] Set Cache Timestamp',
  props<{ timestamp: number }>(),
);

export const markCacheAsStale = createAction('[Products] Mark Cache As Stale');

export const markCacheAsFresh = createAction('[Products] Mark Cache As Fresh');
