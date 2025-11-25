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
};

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
);
