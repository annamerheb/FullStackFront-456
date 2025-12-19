import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';

/**
 * Unit tests for LoginFormComponent
 * Tests form validation, user interactions, and submit event emission
 */
describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')?.value).toBe('demo');
      expect(component.loginForm.get('password')?.value).toBe('demo');
    });

    it('should have submit EventEmitter', () => {
      expect(component.formSubmit).toBeDefined();
    });
  });

  describe('Form Rendering', () => {
    it('should render username input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const usernameInput = compiled.querySelector('#username');
      expect(usernameInput).toBeTruthy();
    });

    it('should render password input field', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const passwordInput = compiled.querySelector('#password');
      expect(passwordInput).toBeTruthy();
    });

    it('should render submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
      expect(submitButton?.textContent).toContain('Sign In');
    });

    it('should have labels for inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('label[for="username"]')).toBeTruthy();
      expect(compiled.querySelector('label[for="password"]')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should require username field', () => {
      component.loginForm.get('username')?.setValue('');
      expect(component.loginForm.get('username')?.hasError('required')).toBe(true);
    });

    it('should require password field', () => {
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
    });

    it('should be valid when both fields are filled', () => {
      component.loginForm.get('username')?.setValue('testuser');
      component.loginForm.get('password')?.setValue('testpass');
      expect(component.loginForm.valid).toBe(true);
    });

    it('should be invalid when username is empty', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('password');
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should be invalid when password is empty', () => {
      component.loginForm.get('username')?.setValue('username');
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.invalid).toBe(true);
    });
  });

  describe('Validation Error Messages', () => {
    it('should show username error when touched and empty', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('username')?.markAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMsg = compiled.querySelector('.error-msg');
      expect(errorMsg?.textContent).toContain('Username is required');
    });

    it('should show password error when touched and empty', () => {
      component.loginForm.get('password')?.setValue('');
      component.loginForm.get('password')?.markAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorMsgs = compiled.querySelectorAll('.error-msg');
      const passwordError = Array.from(errorMsgs).find((el) =>
        el.textContent?.includes('Password is required'),
      );
      expect(passwordError).toBeTruthy();
    });

    it('should not show error messages initially', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const errorMsgs = compiled.querySelectorAll('.error-msg');
      expect(errorMsgs.length).toBe(0);
    });
  });

  describe('Form Submission', () => {
    it('should emit submit event with form values when valid', () => {
      const submitSpy = spyOn(component.formSubmit, 'emit');

      component.loginForm.get('username')?.setValue('testuser');
      component.loginForm.get('password')?.setValue('testpass');

      component.onSubmit();

      expect(submitSpy).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should not emit submit event when form is invalid', () => {
      const submitSpy = spyOn(component.formSubmit, 'emit');

      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(submitSpy).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.loginForm.get('username')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(component.loginForm.get('username')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should emit on form ngSubmit', () => {
      const submitSpy = spyOn(component.formSubmit, 'emit');

      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pass');

      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form');
      form?.dispatchEvent(new Event('submit'));

      expect(submitSpy).toHaveBeenCalled();
    });
  });

  describe('Submit Button State', () => {
    it('should disable submit button when form is invalid', () => {
      component.loginForm.get('username')?.setValue('');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pass');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });
  });

  describe('Loading State', () => {
    it('should disable submit button when loading', () => {
      component.loading = () => true;
      component.loginForm.get('username')?.setValue('user');
      component.loginForm.get('password')?.setValue('pass');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should show loading text when loading', () => {
      component.loading = () => true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Signing in...');
    });

    it('should show normal text when not loading', () => {
      component.loading = () => false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      expect(submitButton?.textContent).toContain('Sign In');
    });

    it('should show loader spinner when loading', () => {
      component.loading = () => true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const loader = compiled.querySelector('.loader');
      expect(loader).toBeTruthy();
    });
  });

  describe('Error Display', () => {
    it('should display error message from error input', () => {
      component.error = () => 'Invalid credentials';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorBox = compiled.querySelector('.error-box');
      expect(errorBox?.textContent).toContain('Invalid credentials');
    });

    it('should not display error box when no error', () => {
      component.error = () => null;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorBox = compiled.querySelector('.error-box');
      expect(errorBox).toBeFalsy();
    });

    it('should display different error messages', () => {
      component.error = () => 'Network error';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-text')?.textContent).toContain('Network error');
    });
  });

  describe('Input Field Behavior', () => {
    it('should update form value when typing in username', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const usernameInput = compiled.querySelector('#username') as HTMLInputElement;

      usernameInput.value = 'newuser';
      usernameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.loginForm.get('username')?.value).toBe('newuser');
    });

    it('should update form value when typing in password', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const passwordInput = compiled.querySelector('#password') as HTMLInputElement;

      passwordInput.value = 'newpass';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.loginForm.get('password')?.value).toBe('newpass');
    });

    it('should have password input type', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const passwordInput = compiled.querySelector('#password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('should have text input type for username', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const usernameInput = compiled.querySelector('#username') as HTMLInputElement;
      expect(usernameInput.type).toBe('text');
    });
  });

  describe('Accessibility', () => {
    it('should have labels associated with inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const usernameLabel = compiled.querySelector('label[for="username"]');
      const passwordLabel = compiled.querySelector('label[for="password"]');

      expect(usernameLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
    });

    it('should have placeholder text for inputs', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const usernameInput = compiled.querySelector('#username') as HTMLInputElement;
      const passwordInput = compiled.querySelector('#password') as HTMLInputElement;

      expect(usernameInput.placeholder).toBe('demo');
      expect(passwordInput.placeholder).toBe('demo');
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only username', () => {
      component.loginForm.get('username')?.setValue('   ');
      expect(component.loginForm.valid).toBe(true); // Validators.required allows whitespace
    });

    it('should handle special characters in credentials', () => {
      const submitSpy = spyOn(component.formSubmit, 'emit');

      component.loginForm.get('username')?.setValue('user@domain.com');
      component.loginForm.get('password')?.setValue('P@ssw0rd!#$%');

      component.onSubmit();

      expect(submitSpy).toHaveBeenCalledWith({
        username: 'user@domain.com',
        password: 'P@ssw0rd!#$%',
      });
    });

    it('should handle very long credentials', () => {
      const longUsername = 'a'.repeat(100);
      const longPassword = 'b'.repeat(100);

      component.loginForm.get('username')?.setValue(longUsername);
      component.loginForm.get('password')?.setValue(longPassword);

      expect(component.loginForm.valid).toBe(true);
    });
  });
});
