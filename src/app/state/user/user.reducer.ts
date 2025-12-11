import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User, OrderDetails } from '../../services/types';

export interface UserState {
  user: User | null;
  selectedOrder: OrderDetails | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  user: null,
  selectedOrder: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.loadUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(UserActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.updateUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    user: state.user ? { ...state.user, orders } : state.user,
    loading: false,
    error: null,
  })),

  on(UserActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.loadOrderDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadOrderDetailsSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
    error: null,
  })),

  on(UserActions.loadOrderDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.clearOrderDetails, (state) => ({
    ...state,
    selectedOrder: null,
  })),

  on(UserActions.logoutUser, () => initialUserState),
);
