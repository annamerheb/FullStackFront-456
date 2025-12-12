import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.models';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdminStats = createSelector(
  selectAdminState,
  (state: AdminState) => state.stats,
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.loading,
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state: AdminState) => state.error,
);

export const selectTopProducts = createSelector(
  selectAdminStats,
  (stats) => stats?.topProducts || [],
);

export const selectRecentOrders = createSelector(
  selectAdminStats,
  (stats) => stats?.recentOrders || [],
);
