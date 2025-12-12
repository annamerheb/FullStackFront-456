// src/app/state/shared/shared.selectors.ts
import { createSelector } from '@ngrx/store';
import { selectCartFeature } from '../cart/cart.selectors';
import { selectWishlistItems } from '../wishlist/wishlist.selectors';
import { selectOrders } from '../user/user.selectors';

/**
 * Memoized selector for cart total items
 * Only recalculates when cart items actually change
 */
export const selectCartTotalItems = createSelector(selectCartFeature, (cart: any) => {
  if (!cart?.items) return 0;
  return cart.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
});

/**
 * Memoized selector for cart total price
 * Includes subtotal + shipping + tax
 */
export const selectCartTotalPrice = createSelector(selectCartFeature, (cart: any) => ({
  subtotal: cart?.subtotal || 0,
  shipping: cart?.shipping || 0,
  tax: cart?.tax || 0,
  total: (cart?.subtotal || 0) + (cart?.shipping || 0) + (cart?.tax || 0),
}));

/**
 * Memoized selector for wishlist product count
 */
export const selectWishlistCount = createSelector(
  selectWishlistItems,
  (wishlist: any) => wishlist?.length || 0,
);

/**
 * Memoized selector for orders filtered by status
 */
export const selectOrdersByStatus = (status: string) =>
  createSelector(
    selectOrders,
    (orders: any) => orders?.filter?.((order: any) => order.status === status) || [],
  );

/**
 * Memoized selector for orders count by status
 */
export const selectOrdersCountByStatus = createSelector(selectOrders, (orders: any) => {
  if (!orders || orders.length === 0) {
    return { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  }
  return {
    pending: orders.filter((o: any) => o.status === 'pending').length,
    processing: orders.filter((o: any) => o.status === 'processing').length,
    shipped: orders.filter((o: any) => o.status === 'shipped').length,
    delivered: orders.filter((o: any) => o.status === 'delivered').length,
    cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
  };
});
