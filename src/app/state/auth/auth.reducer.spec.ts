import { authReducer, AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';

/**
 * Unit tests for Auth Reducer
 * Tests pure reducer logic for authentication state management
 */
describe('Auth Reducer', () => {
  const initialAuthState: AuthState = {
    access: null,
    refresh: null,
    loading: false,
    error: null,
  };

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'UNKNOWN' };
      const result = authReducer(undefined, action as any);

      expect(result.access).toBeNull();
      expect(result.refresh).toBeNull();
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('login', () => {
    it('should set loading to true on login action', () => {
      const action = AuthActions.login({ username: 'testuser', password: 'password123' });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should not change token values on login action', () => {
      const action = AuthActions.login({ username: 'testuser', password: 'password123' });
      const state = authReducer(initialAuthState, action);

      expect(state.access).toBeNull();
      expect(state.refresh).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should store access and refresh tokens', () => {
      const tokens = {
        access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh...',
      };

      const action = AuthActions.loginSuccess(tokens);
      const state = authReducer(initialAuthState, action);

      expect(state.access).toBe(tokens.access);
      expect(state.refresh).toBe(tokens.refresh);
    });

    it('should set loading to false on loginSuccess', () => {
      const tokens = {
        access: 'access_token',
        refresh: 'refresh_token',
      };

      const action = AuthActions.loginSuccess(tokens);
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe(false);
    });

    it('should clear error message on successful login', () => {
      const stateWithError: AuthState = {
        ...initialAuthState,
        error: 'Previous error',
        loading: true,
      };

      const tokens = {
        access: 'new_access_token',
        refresh: 'new_refresh_token',
      };

      const action = AuthActions.loginSuccess(tokens);
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('should update tokens even if already authenticated', () => {
      const oldTokens = {
        access: 'old_access',
        refresh: 'old_refresh',
      };

      let state = authReducer(initialAuthState, AuthActions.loginSuccess(oldTokens));

      const newTokens = {
        access: 'new_access',
        refresh: 'new_refresh',
      };

      state = authReducer(state, AuthActions.loginSuccess(newTokens));

      expect(state.access).toBe(newTokens.access);
      expect(state.refresh).toBe(newTokens.refresh);
    });
  });

  describe('loginFailure', () => {
    it('should store error message on login failure', () => {
      const errorMessage = 'Invalid username or password';
      const action = AuthActions.loginFailure({ error: errorMessage });
      const state = authReducer(initialAuthState, action);

      expect(state.error).toBe(errorMessage);
    });

    it('should set loading to false on login failure', () => {
      const stateLoading: AuthState = {
        ...initialAuthState,
        loading: true,
      };

      const action = AuthActions.loginFailure({ error: 'Login failed' });
      const state = authReducer(stateLoading, action);

      expect(state.loading).toBe(false);
    });

    it('should preserve tokens on login failure', () => {
      const stateWithTokens: AuthState = {
        ...initialAuthState,
        access: 'old_token',
        refresh: 'old_refresh',
      };

      const action = AuthActions.loginFailure({ error: 'Network error' });
      const state = authReducer(stateWithTokens, action);

      expect(state.access).toBe('old_token');
      expect(state.refresh).toBe('old_refresh');
    });

    it('should replace error message on subsequent failures', () => {
      let state = authReducer(initialAuthState, AuthActions.loginFailure({ error: 'First error' }));

      expect(state.error).toBe('First error');

      state = authReducer(state, AuthActions.loginFailure({ error: 'Second error' }));

      expect(state.error).toBe('Second error');
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', () => {
      const stateWithTokens: AuthState = {
        ...initialAuthState,
        access: 'access_token',
        refresh: 'refresh_token',
      };

      const action = AuthActions.logout();
      const state = authReducer(stateWithTokens, action);

      expect(state.access).toBeNull();
      expect(state.refresh).toBeNull();
    });

    it('should clear error on logout', () => {
      const stateWithError: AuthState = {
        ...initialAuthState,
        error: 'Some error',
      };

      const action = AuthActions.logout();
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('should keep loading unchanged on logout', () => {
      const action = AuthActions.logout();
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should set loading to true on refreshToken action', () => {
      const action = AuthActions.refreshToken({ refreshToken: 'refresh_token' });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe(true);
    });

    it('should clear error on refresh attempt', () => {
      const stateWithError: AuthState = {
        ...initialAuthState,
        error: 'Previous error',
      };

      const action = AuthActions.refreshToken({ refreshToken: 'refresh_token' });
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('should not modify tokens during refresh attempt', () => {
      const stateWithTokens: AuthState = {
        ...initialAuthState,
        access: 'old_access',
        refresh: 'old_refresh',
      };

      const action = AuthActions.refreshToken({ refreshToken: 'old_refresh' });
      const state = authReducer(stateWithTokens, action);

      expect(state.access).toBe('old_access');
      expect(state.refresh).toBe('old_refresh');
    });
  });

  describe('refreshTokenSuccess', () => {
    it('should update access token on successful refresh', () => {
      const stateWithOldToken: AuthState = {
        ...initialAuthState,
        access: 'old_access',
        refresh: 'refresh_token',
        loading: true,
      };

      const action = AuthActions.refreshTokenSuccess({ access: 'new_access' });
      const state = authReducer(stateWithOldToken, action);

      expect(state.access).toBe('new_access');
    });

    it('should preserve refresh token on successful refresh', () => {
      const stateWithTokens: AuthState = {
        ...initialAuthState,
        access: 'old_access',
        refresh: 'refresh_token',
        loading: true,
      };

      const action = AuthActions.refreshTokenSuccess({ access: 'new_access' });
      const state = authReducer(stateWithTokens, action);

      expect(state.refresh).toBe('refresh_token');
    });

    it('should set loading to false after token refresh', () => {
      const stateLoading: AuthState = {
        ...initialAuthState,
        loading: true,
      };

      const action = AuthActions.refreshTokenSuccess({ access: 'new_access' });
      const state = authReducer(stateLoading, action);

      expect(state.loading).toBe(false);
    });

    it('should clear error on successful refresh', () => {
      const stateWithError: AuthState = {
        ...initialAuthState,
        error: 'Previous error',
        loading: true,
      };

      const action = AuthActions.refreshTokenSuccess({ access: 'new_access' });
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('refreshTokenFailure', () => {
    it('should store error on token refresh failure', () => {
      const stateLoading: AuthState = {
        ...initialAuthState,
        loading: true,
      };

      const action = AuthActions.refreshTokenFailure({ error: 'Refresh token expired' });
      const state = authReducer(stateLoading, action);

      expect(state.error).toBe('Refresh token expired');
      expect(state.loading).toBe(false);
    });

    it('should preserve tokens on refresh failure', () => {
      const stateWithTokens: AuthState = {
        ...initialAuthState,
        access: 'access_token',
        refresh: 'refresh_token',
        loading: true,
      };

      const action = AuthActions.refreshTokenFailure({ error: 'Invalid refresh token' });
      const state = authReducer(stateWithTokens, action);

      expect(state.access).toBe('access_token');
      expect(state.refresh).toBe('refresh_token');
    });
  });

  describe('restoreAuthFromStorageSuccess', () => {
    it('should restore tokens from storage', () => {
      const action = AuthActions.restoreAuthFromStorageSuccess({
        access: 'stored_access',
        refresh: 'stored_refresh',
      });
      const state = authReducer(initialAuthState, action);

      expect(state.access).toBe('stored_access');
      expect(state.refresh).toBe('stored_refresh');
    });

    it('should handle null tokens from storage', () => {
      const action = AuthActions.restoreAuthFromStorageSuccess({
        access: null,
        refresh: null,
      });
      const state = authReducer(initialAuthState, action);

      expect(state.access).toBeNull();
      expect(state.refresh).toBeNull();
    });
  });

  describe('State Transitions', () => {
    it('should handle complete login flow: start -> success -> logout', () => {
      let state = initialAuthState;
      expect(state.loading).toBe(false);
      expect(state.access).toBeNull();

      state = authReducer(state, AuthActions.login({ username: 'testuser', password: 'pass' }));
      expect(state.loading).toBe(true);

      state = authReducer(state, AuthActions.loginSuccess({ access: 'token', refresh: 'refresh' }));
      expect(state.loading).toBe(false);
      expect(state.access).toBe('token');

      state = authReducer(state, AuthActions.logout());
      expect(state.access).toBeNull();
      expect(state.refresh).toBeNull();
    });

    it('should handle login failure followed by retry', () => {
      let state = authReducer(
        initialAuthState,
        AuthActions.loginFailure({ error: 'Network error' }),
      );
      expect(state.error).toBe('Network error');
      expect(state.access).toBeNull();

      state = authReducer(state, AuthActions.login({ username: 'testuser', password: 'pass' }));
      expect(state.loading).toBe(true);

      state = authReducer(state, AuthActions.loginSuccess({ access: 'token', refresh: 'refresh' }));
      expect(state.error).toBeNull();
      expect(state.access).toBe('token');
    });

    it('should handle token refresh flow', () => {
      let state = authReducer(
        initialAuthState,
        AuthActions.loginSuccess({ access: 'old_token', refresh: 'refresh' }),
      );

      state = authReducer(state, AuthActions.refreshToken({ refreshToken: 'refresh' }));
      expect(state.loading).toBe(true);

      state = authReducer(state, AuthActions.refreshTokenSuccess({ access: 'new_token' }));
      expect(state.loading).toBe(false);
      expect(state.access).toBe('new_token');
      expect(state.refresh).toBe('refresh');
    });
  });
});
