import { createAction, props } from '@ngrx/store';
import { User, OrderSummary, OrderDetails } from '../../services/types';

export const loadUserProfile = createAction('[User] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[User] Load User Profile Success',
  props<{ user: User }>(),
);

export const loadUserProfileFailure = createAction(
  '[User] Load User Profile Failure',
  props<{ error: string }>(),
);

export const updateUserProfile = createAction(
  '[User] Update User Profile',
  props<{ user: Partial<User> }>(),
);

export const updateUserProfileSuccess = createAction(
  '[User] Update User Profile Success',
  props<{ user: User }>(),
);

export const updateUserProfileFailure = createAction(
  '[User] Update User Profile Failure',
  props<{ error: string }>(),
);

export const loadOrders = createAction(
  '[User] Load Orders',
  props<{ page?: number; pageSize?: number }>(),
);

export const loadOrdersSuccess = createAction(
  '[User] Load Orders Success',
  props<{ orders: OrderSummary[] }>(),
);

export const loadOrdersFailure = createAction(
  '[User] Load Orders Failure',
  props<{ error: string }>(),
);

export const loadOrderDetails = createAction(
  '[User] Load Order Details',
  props<{ orderId: string }>(),
);

export const loadOrderDetailsSuccess = createAction(
  '[User] Load Order Details Success',
  props<{ order: OrderDetails }>(),
);

export const loadOrderDetailsFailure = createAction(
  '[User] Load Order Details Failure',
  props<{ error: string }>(),
);

export const clearOrderDetails = createAction('[User] Clear Order Details');

export const logoutUser = createAction('[User] Logout User');
