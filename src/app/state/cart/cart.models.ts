import { Product } from '../../services/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  stockValidationErrors: string[];
  isValidatingStock: boolean;
}

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  stockValidationErrors: [],
  isValidatingStock: false,
};

export function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const itemPrice = item.product.price;
    const discount = item.product.discount || 0;
    const discountedPrice = itemPrice - (itemPrice * discount) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);
}

export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
