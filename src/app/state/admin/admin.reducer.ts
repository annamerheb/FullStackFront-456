import { createReducer, on } from '@ngrx/store';
import { AdminState, initialAdminState } from './admin.models';
import * as AdminActions from './admin.actions';

export const adminReducer = createReducer(
  initialAdminState,

  on(AdminActions.loadAdminStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AdminActions.loadAdminStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null,
  })),

  on(AdminActions.loadAdminStatsFailure, (state, { error }) => ({
    ...state,
    stats: null,
    loading: false,
    error,
  })),
);
