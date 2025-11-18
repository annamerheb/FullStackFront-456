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
  avgRating: number;
}

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filters?: ProductsFilters }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: { count: number; results: Product[] } }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const loadRating = createAction(
  '[Products] Load Rating',
  props<{ productId: number }>()
);

export const loadRatingSuccess = createAction(
  '[Products] Load Rating Success',
  props<{ data: { product_id: number; avg_rating: number; count: number } }>()
);

export const loadRatingFailure = createAction(
  '[Products] Load Rating Failure',
  props<{ error: string }>()
);
