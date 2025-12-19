import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { NotificationService } from '../../services/notification.service';

/**
 * Unit tests for Auth Effects
 * Tests effect logic for login/logout flows with localStorage and notifications
 */
describe('Auth Effects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockStorageKey = 'auth_tokens';

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    notificationService = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;

    // Clear localStorage before each test
    localStorage.removeItem(mockStorageKey);
  });

  afterEach(() => {
    localStorage.removeItem(mockStorageKey);
  });

  describe('login$', () => {
    it('should return loginSuccess action with mock tokens', (done) => {
      const credentials = { username: 'testuser', password: 'password123' };
      const action = AuthActions.login(credentials);
      actions$ = of(action);

      effects.login$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Login Success');
        expect(resultAction.access).toBeDefined();
        expect(resultAction.refresh).toBeDefined();
        expect(resultAction.access).toContain('mock-access-token-');
        expect(resultAction.refresh).toContain('mock-refresh-token-');
        done();
      });
    });

    it('should generate tokens with timestamp suffix', (done) => {
      const action = AuthActions.login({ username: 'user', password: 'pass' });
      actions$ = of(action);

      effects.login$.subscribe((resultAction) => {
        // Token should contain timestamp (numeric suffix)
        const tokenParts = resultAction.access.split('-');
        const timestamp = tokenParts[tokenParts.length - 1];
        expect(Number(timestamp)).toBeGreaterThan(0);
        done();
      });
    });

    it('should accept any credentials (mock implementation)', (done) => {
      const action = AuthActions.login({ username: 'any', password: 'any' });
      actions$ = of(action);

      effects.login$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Login Success');
        done();
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should store tokens in localStorage', (done) => {
      const tokens = { access: 'test-access', refresh: 'test-refresh' };
      const action = AuthActions.loginSuccess(tokens);
      actions$ = of(action);

      effects.loginSuccess$.subscribe(() => {
        const stored = localStorage.getItem(mockStorageKey);
        expect(stored).toBeDefined();
        const parsed = JSON.parse(stored!);
        expect(parsed.access).toBe('test-access');
        expect(parsed.refresh).toBe('test-refresh');
        done();
      });
    });

    it('should show success notification', (done) => {
      const action = AuthActions.loginSuccess({ access: 'token', refresh: 'refresh' });
      actions$ = of(action);

      effects.loginSuccess$.subscribe(() => {
        expect(notificationService.success).toHaveBeenCalledWith('✅ Connexion réussie');
        done();
      });
    });
  });

  describe('refreshToken$', () => {
    it('should return refreshTokenSuccess with new access token', (done) => {
      const action = AuthActions.refreshToken({ refreshToken: 'old-refresh-token' });
      actions$ = of(action);

      effects.refreshToken$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Refresh Token Success');
        expect(resultAction.access).toBeDefined();
        expect(resultAction.access).toContain('mock-access-token-refreshed-');
        done();
      });
    });

    it('should generate refreshed tokens with timestamp suffix', (done) => {
      const action = AuthActions.refreshToken({ refreshToken: 'refresh' });
      actions$ = of(action);

      effects.refreshToken$.subscribe((resultAction) => {
        // Token should contain 'refreshed' and timestamp
        expect(resultAction.access).toContain('refreshed');
        const tokenParts = resultAction.access.split('-');
        const timestamp = tokenParts[tokenParts.length - 1];
        expect(Number(timestamp)).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('refreshTokenSuccess$', () => {
    it('should update access token in localStorage', (done) => {
      // Pre-populate localStorage
      localStorage.setItem(mockStorageKey, JSON.stringify({ access: 'old', refresh: 'refresh' }));

      const action = AuthActions.refreshTokenSuccess({ access: 'new-access-token' });
      actions$ = of(action);

      effects.refreshTokenSuccess$.subscribe(() => {
        const stored = localStorage.getItem(mockStorageKey);
        const parsed = JSON.parse(stored!);
        expect(parsed.access).toBe('new-access-token');
        expect(parsed.refresh).toBe('refresh'); // Refresh token preserved
        done();
      });
    });

    it('should not fail if no existing tokens in storage', (done) => {
      localStorage.removeItem(mockStorageKey);

      const action = AuthActions.refreshTokenSuccess({ access: 'new-access' });
      actions$ = of(action);

      effects.refreshTokenSuccess$.subscribe(() => {
        // Should complete without error
        expect(true).toBe(true);
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should remove tokens from localStorage', (done) => {
      localStorage.setItem(mockStorageKey, JSON.stringify({ access: 'a', refresh: 'r' }));

      const action = AuthActions.logout();
      actions$ = of(action);

      effects.logout$.subscribe(() => {
        const stored = localStorage.getItem(mockStorageKey);
        expect(stored).toBeNull();
        done();
      });
    });

    it('should show logout notification', (done) => {
      const action = AuthActions.logout();
      actions$ = of(action);

      effects.logout$.subscribe(() => {
        expect(notificationService.success).toHaveBeenCalledWith('👋 Déconnexion réussie');
        done();
      });
    });
  });

  describe('restoreAuthFromStorage$', () => {
    it('should restore tokens from localStorage', (done) => {
      localStorage.setItem(
        mockStorageKey,
        JSON.stringify({ access: 'stored-access', refresh: 'stored-refresh' }),
      );

      const action = AuthActions.restoreAuthFromStorage();
      actions$ = of(action);

      effects.restoreAuthFromStorage$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Restore From Storage Success');
        expect(resultAction.access).toBe('stored-access');
        expect(resultAction.refresh).toBe('stored-refresh');
        done();
      });
    });

    it('should return null tokens when nothing in storage', (done) => {
      localStorage.removeItem(mockStorageKey);

      const action = AuthActions.restoreAuthFromStorage();
      actions$ = of(action);

      effects.restoreAuthFromStorage$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Restore From Storage Success');
        expect(resultAction.access).toBeNull();
        expect(resultAction.refresh).toBeNull();
        done();
      });
    });

    it('should handle corrupted localStorage data gracefully', (done) => {
      localStorage.setItem(mockStorageKey, 'invalid-json-data');

      const action = AuthActions.restoreAuthFromStorage();
      actions$ = of(action);

      effects.restoreAuthFromStorage$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Auth] Restore From Storage Success');
        expect(resultAction.access).toBeNull();
        expect(resultAction.refresh).toBeNull();
        // Should also clean up corrupted data
        expect(localStorage.getItem(mockStorageKey)).toBeNull();
        done();
      });
    });
  });

  describe('Full Auth Flow Integration', () => {
    it('should handle login -> store -> restore flow', (done) => {
      // Step 1: Login
      const loginAction = AuthActions.login({ username: 'user', password: 'pass' });
      actions$ = of(loginAction);

      effects.login$.subscribe((loginResult) => {
        expect(loginResult.type).toBe('[Auth] Login Success');
        const tokens = { access: loginResult.access, refresh: loginResult.refresh };

        // Step 2: Store tokens
        actions$ = of(AuthActions.loginSuccess(tokens));
        effects.loginSuccess$.subscribe(() => {
          // Step 3: Restore from storage
          actions$ = of(AuthActions.restoreAuthFromStorage());
          effects.restoreAuthFromStorage$.subscribe((restoreResult) => {
            expect(restoreResult.access).toBe(tokens.access);
            expect(restoreResult.refresh).toBe(tokens.refresh);
            done();
          });
        });
      });
    });
  });
});
