/**
 * API Response Types for Shop Service
 */

export interface AuthTokenResponse {
  access: string;
  refresh: string;
}

export interface AuthRefreshResponse {
  access: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
  image: string;
  stock: number;
  discount?: number;
}

export interface ProductsListResponse {
  count: number;
  results: Product[];
}

export interface ProductRatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
