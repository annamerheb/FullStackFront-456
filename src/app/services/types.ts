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

export interface Address {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
  orders: OrderSummary[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface OrderSummary {
  id: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  itemCount: number;
}

export interface OrderDetails extends OrderSummary {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface UserProfileResponse {
  user: User;
}

export interface UserResponse extends User {}

export interface OrdersListResponse {
  count: number;
  results: OrderSummary[];
}
