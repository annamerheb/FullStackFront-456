import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="form-root">
      <div class="field">
        <label for="username" class="label">Username</label>
        <div class="input-wrapper">
          <mat-icon class="icon">person</mat-icon>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="demo"
            class="input"
            [disabled]="loading()"
          />
        </div>
        @if (
          loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched
        ) {
          <p class="error-msg">Username is required</p>
        }
      </div>

      <div class="field">
        <label for="password" class="label">Password</label>
        <div class="input-wrapper">
          <mat-icon class="icon">lock</mat-icon>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="demo"
            class="input"
            [disabled]="loading()"
          />
        </div>
        @if (
          loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched
        ) {
          <p class="error-msg">Password is required</p>
        }
      </div>

      @if (error()) {
        <div class="error-box">
          <p class="error-text">{{ error() }}</p>
        </div>
      }

      <button type="submit" [disabled]="loginForm.invalid || loading()" class="submit-btn">
        @if (loading()) {
          <span class="loader"></span>
          Signing in...
        } @else {
          Sign In
        }
      </button>
    </form>
  `,
  styles: [
    `
      .form-root {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .icon {
        position: absolute;
        left: 12px;
        font-size: 15px;
        opacity: 0.6;
      }

      .input {
        width: 100%;
        padding: 12px 12px 12px 36px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: white;
        font-size: 14px;
        transition: all 0.2s ease;
        outline: none;
      }

      .input:focus {
        border-color: #0284c7;
        box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
      }

      .input:disabled {
        background: #f8fafc;
        color: #cbd5e1;
      }

      .error-msg {
        font-size: 12px;
        color: #dc2626;
      }

      .error-box {
        padding: 12px;
        background: #fef2f2;
        border: 1px solid #fee2e2;
        border-radius: 8px;
      }

      .error-text {
        font-size: 13px;
        color: #b91c1c;
        margin: 0;
      }

      .submit-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 10px;
        background: linear-gradient(135deg, #2987df, #2684db);
        color: white;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition:
          background 0.2s,
          transform 0.1s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .submit-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #3794ecff, #1871c4ff);
      }

      .submit-btn:active:not(:disabled) {
        transform: scale(0.98);
      }

      .submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .loader {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        border: 2px solid white;
        border-top-color: transparent;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoginFormComponent {
  @Input() loading = (): boolean => false;
  @Input() error = (): string | null => null;
  @Output() submit = new EventEmitter<{ username: string; password: string }>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['demo', Validators.required],
      password: ['demo', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submit.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
