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
