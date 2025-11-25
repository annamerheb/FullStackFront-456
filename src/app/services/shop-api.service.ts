import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuthTokenResponse,
  AuthRefreshResponse,
  ProductsListResponse,
  ProductRatingResponse,
  Product,
} from './types';

/**
 * ShopApiService
 *
 * HTTP client for all API interactions with the backend.
 *
 * Base URL: /api/
 *
 * Endpoints:
 * - POST /api/auth/token/ - Login
 * - POST /api/auth/token/refresh/ - Refresh access token
 * - GET /api/products/ - List products with filters
 * - GET /api/products/:id/rating/ - Get product rating
 */
@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Login with username and password
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Observable of auth tokens (access + refresh)
   *
   * @example
   * this.shopApi.login('demo', 'demo').subscribe(tokens => {
   *   console.log('Access token:', tokens.access);
   *   console.log('Refresh token:', tokens.refresh);
   * });
   */
  login(username: string, password: string): Observable<AuthTokenResponse> {
    const url = `${this.baseUrl}/auth/token/`;
    const body = { username, password };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthTokenResponse>(url, body);
  }

  /**
   * Refresh access token using refresh token
   *
   * @param refreshToken - Refresh token from login
   * @returns Observable of new access token
   *
   * @example
   * this.shopApi.refreshToken(refreshToken).subscribe(response => {
   *   console.log('New access token:', response.access);
   * });
   */
  refreshToken(refreshToken: string): Observable<AuthRefreshResponse> {
    const url = `${this.baseUrl}/auth/token/refresh/`;
    const body = { refresh: refreshToken };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthRefreshResponse>(url, body);
  }

  /**
   * Get list of products with optional filters
   *
   * @param filters - Optional filters for products
   * @param filters.page - Page number (0-indexed)
   * @param filters.pageSize - Products per page
   * @param filters.minRating - Minimum average rating
   * @param filters.ordering - Sort field: 'price', '-price', 'name', etc.
   * @returns Observable of products list
   *
   * @example
   * this.shopApi.getProducts({
   *   page: 0,
   *   pageSize: 6,
   *   minRating: 3,
   *   ordering: 'price'
   * }).subscribe(response => {
   *   console.log('Total products:', response.count);
   *   console.log('Current page:', response.results);
   * });
   */
  getProducts(filters?: {
    page?: number;
    pageSize?: number;
    minRating?: number;
    ordering?: string;
  }): Observable<ProductsListResponse> {
    const url = `${this.baseUrl}/products/`;
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.pageSize !== undefined) {
        params = params.set('page_size', filters.pageSize.toString());
      }
      if (filters.minRating !== undefined && filters.minRating > 0) {
        params = params.set('min_rating', filters.minRating.toString());
      }
      if (filters.ordering) {
        params = params.set('ordering', filters.ordering);
      }
    }

    console.log(`[API] GET ${url}`, params);
    return this.http.get<ProductsListResponse>(url, { params });
  }

  /**
   * Get a specific product by ID
   *
   * @param productId - Product ID
   * @returns Observable of product details
   *
   * @example
   * this.shopApi.getProduct(1).subscribe(product => {
   *   console.log('Product:', product.name);
   * });
   */
  getProduct(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${productId}/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<Product>(url);
  }

  /**
   * Get rating for a specific product
   *
   * @param productId - Product ID
   * @returns Observable of product rating data
   *
   * @example
   * this.shopApi.getProductRating(1).subscribe(rating => {
   *   console.log('Average rating:', rating.avg_rating);
   *   console.log('Number of reviews:', rating.count);
   * });
   */
  getProductRating(productId: number): Observable<ProductRatingResponse> {
    const url = `${this.baseUrl}/products/${productId}/rating/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<ProductRatingResponse>(url);
  }
}
