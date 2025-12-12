import { createAction, props } from '@ngrx/store';
import { AdminStats } from './admin.models';

export const loadAdminStats = createAction('[Admin] Load Admin Stats');

export const loadAdminStatsSuccess = createAction(
  '[Admin] Load Admin Stats Success',
  props<{ stats: AdminStats }>(),
);

export const loadAdminStatsFailure = createAction(
  '[Admin] Load Admin Stats Failure',
  props<{ error: string }>(),
);
