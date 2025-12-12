import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access: string; refresh: string }>(),
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const restoreAuthFromStorage = createAction('[Auth] Restore From Storage');

export const restoreAuthFromStorageSuccess = createAction(
  '[Auth] Restore From Storage Success',
  props<{ access: string | null; refresh: string | null }>(),
);

export const logout = createAction('[Auth] Logout');

export const refreshToken = createAction('[Auth] Refresh Token', props<{ refreshToken: string }>());

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ access: string }>(),
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>(),
);
