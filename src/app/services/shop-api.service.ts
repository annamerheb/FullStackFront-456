import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AuthTokenResponse,
  AuthRefreshResponse,
  ProductsListResponse,
  ProductRatingResponse,
  Product,
  UserProfileResponse,
  OrdersListResponse,
  OrderDetails,
  User,
  UserResponse,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthTokenResponse> {
    const url = `${this.baseUrl}/auth/token/`;
    const body = { username, password };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthTokenResponse>(url, body);
  }

  refreshToken(refreshToken: string): Observable<AuthRefreshResponse> {
    const url = `${this.baseUrl}/auth/token/refresh/`;
    const body = { refresh: refreshToken };
    console.log(`[API] POST ${url}`, body);
    return this.http.post<AuthRefreshResponse>(url, body);
  }

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

  getProduct(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${productId}/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<Product>(url);
  }

  getProductRating(productId: number): Observable<ProductRatingResponse> {
    const url = `${this.baseUrl}/products/${productId}/rating/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<ProductRatingResponse>(url);
  }

  getUserProfile(): Observable<UserProfileResponse> {
    const url = `${this.baseUrl}/user/profile/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<UserProfileResponse>(url);
  }

  updateUserProfile(userUpdate: Partial<User>): Observable<UserProfileResponse> {
    const url = `${this.baseUrl}/user/profile/`;
    console.log(`[API] PATCH ${url}`, userUpdate);
    return this.http.patch<UserProfileResponse>(url, userUpdate);
  }

  getUserOrders(page: number = 1, pageSize: number = 10): Observable<OrdersListResponse> {
    const url = `${this.baseUrl}/user/orders/`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    console.log(`[API] GET ${url}`, params);
    return this.http.get<OrdersListResponse>(url, { params });
  }

  getOrderDetails(orderId: string): Observable<OrderDetails> {
    const url = `${this.baseUrl}/user/orders/${orderId}/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<OrderDetails>(url);
  }

  getMe(): Observable<UserResponse> {
    const url = `${this.baseUrl}/me/`;
    console.log(`[API] GET ${url}`);
    return this.http.get<UserResponse>(url);
  }

  updateMe(userUpdate: Partial<User>): Observable<UserResponse> {
    const url = `${this.baseUrl}/me/`;
    console.log(`[API] PATCH ${url}`, userUpdate);
    return this.http.patch<UserResponse>(url, userUpdate);
  }

  getMyOrders(page: number = 1, pageSize: number = 10): Observable<OrdersListResponse> {
    const url = `${this.baseUrl}/me/orders/`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    console.log(`[API] GET ${url}`, params);
    return this.http.get<OrdersListResponse>(url, { params });
  }

  getOrder(orderId: string): Observable<OrderDetails> {
    const url = `${this.baseUrl}/orders/${orderId}`;
    console.log(`[API] GET ${url}`);
    return this.http.get<OrderDetails>(url);
  }

  createOrder(orderPayload: any): Observable<any> {
    const url = `${this.baseUrl}/order/`;
    console.log(`[API] POST ${url}`, orderPayload);
    return this.http.post<any>(url, orderPayload);
  }
}
