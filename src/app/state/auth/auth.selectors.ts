import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

const selectAuthFeature = createFeatureSelector<AuthState>('auth');

export const selectAccessToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.access
);

export const selectRefreshToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.refresh
);

export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (access: string | null) => !!access
);

export const selectAuthLoading = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.error
);
