import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, (state) => state.user);

export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);

export const selectUserError = createSelector(selectUserState, (state) => state.error);

export const selectOrders = createSelector(selectUser, (user) => user?.orders ?? []);

export const selectOrdersCount = createSelector(selectOrders, (orders) => orders.length);

export const selectSelectedOrder = createSelector(selectUserState, (state) => state.selectedOrder);

export const selectIsUserLoaded = createSelector(selectUser, (user) => user !== null);

export const selectUserEmail = createSelector(selectUser, (user) => user?.email ?? null);

export const selectUserPreferences = createSelector(
  selectUser,
  (user) => user?.preferences ?? null,
);

export const selectUserDefaultAddress = createSelector(
  selectUser,
  (user) => user?.defaultAddress ?? null,
);

/**
 * COMPOSED/MEMOIZED SELECTORS - Advanced order analytics
 */

/**
 * selectOrdersByStatus - Filters orders by status
 * Parametrized selector for flexible status filtering
 * @param status - Order status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
 * Memoized: Only recalculates when orders or status parameter change
 */
export const selectOrdersByStatus = (
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
) => createSelector(selectOrders, (orders) => orders.filter((order) => order.status === status));

/**
 * selectOrderStatistics - Comprehensive order statistics
 * Aggregates all order-related metrics in a single memoized selector
 * More efficient than multiple selector subscriptions
 */
export const selectOrderStatistics = createSelector(selectOrders, (orders) => {
  const total = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = total > 0 ? totalSpent / total : 0;

  const byStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return {
    total,
    totalSpent,
    averageOrderValue,
    byStatus,
    completedOrders: byStatus.delivered,
    activeOrders: byStatus.pending + byStatus.processing + byStatus.shipped,
  };
});

/**
 * selectRecentOrders - Returns most recent orders
 * Useful for dashboard or account homepage
 * @param limit - Number of recent orders to return (default: 5)
 */
export const selectRecentOrders = (limit: number = 5) =>
  createSelector(selectOrders, (orders) =>
    [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, limit),
  );

/**
 * selectHighValueOrders - Filters orders above value threshold
 * Identifies premium customer purchases
 * @param threshold - Minimum order value (default: 500)
 */
export const selectHighValueOrders = (threshold: number = 500) =>
  createSelector(selectOrders, (orders) => orders.filter((order) => order.totalPrice >= threshold));

/**
 * selectOrdersSummaryByDate - Groups orders by date range
 * Returns orders for today, this week, this month
 * Useful for historical analysis
 */
export const selectOrdersSummaryByDate = createSelector(selectOrders, (orders) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    today: orders.filter((o) => new Date(o.orderDate) >= today),
    thisWeek: orders.filter((o) => new Date(o.orderDate) >= weekAgo),
    thisMonth: orders.filter((o) => new Date(o.orderDate) >= monthAgo),
    older: orders.filter((o) => new Date(o.orderDate) < monthAgo),
    recentCount: 5,
    topOrder: orders.reduce(
      (max, order) => (order.totalPrice > max.totalPrice ? order : max),
      orders[0] || ({ totalPrice: 0 } as any),
    ),
  };
});

/**
 * selectOrderSearchResults - Advanced order search/filter
 * Combines multiple filtering criteria
 */
export const selectOrderSearchResults = (filters?: {
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}) =>
  createSelector(selectOrders, (orders) => {
    if (!filters) return orders;

    return orders.filter((order) => {
      // Filter by status
      if (filters.status && order.status !== filters.status) return false;

      // Filter by price range
      if (filters.minPrice !== undefined && order.totalPrice < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && order.totalPrice > filters.maxPrice) return false;

      // Filter by search term (search in order ID)
      if (filters.searchTerm && !order.id.toLowerCase().includes(filters.searchTerm.toLowerCase()))
        return false;

      return true;
    });
  });
