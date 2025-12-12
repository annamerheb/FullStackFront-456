import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-checkout-address',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-8 checkout-page-enter">
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">Checkout</p>
              <h3 class="mt-2 text-3xl font-medium text-slate-500">Step 2: Shipping Address</h3>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center gap-4">
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-400 text-white font-bold"
            >
              ✓
            </div>
            <p class="mt-2 text-sm text-slate-600">Summary</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-300"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white font-bold"
            >
              2
            </div>
            <p class="mt-2 text-sm font-semibold text-slate-700">Address</p>
          </div>
          <div class="flex-shrink-0 w-8 h-1 bg-slate-200"></div>
          <div class="flex-1 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold"
            >
              3
            </div>
            <p class="mt-2 text-sm text-slate-600">Confirm</p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm max-w-2xl mx-auto w-full"
        >
          <form [formGroup]="addressForm" (ngSubmit)="submit()" class="space-y-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" />
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Street Address</mat-label>
              <input matInput formControlName="address" />
            </mat-form-field>

            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" />
              </mat-form-field>
              <mat-form-field appearance="fill" class="w-full">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="w-full">
              <mat-label>ZIP Code</mat-label>
              <input matInput formControlName="zipCode" />
            </mat-form-field>

            <div class="flex gap-4 pt-4">
              <button mat-raised-button color="primary" type="submit" class="flex-1">
                Continue to Confirmation
              </button>
              <button
                mat-stroked-button
                routerLink="/shop/checkout/summary"
                class="flex-1 !border-sky-500 !text-sky-600 hover:!bg-sky-50"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .black-text-snackbar {
        background-color: #2882acff !important;
        border: 1px solid #e5e7eb !important;
      }

      :host ::ng-deep .black-text-snackbar .mdc-snackbar__label {
        color: #000000 !important;
      }

      :host ::ng-deep .black-text-snackbar .mat-mdc-button-base {
        color: #000000 !important;
      }
    `,
  ],
})
export class CheckoutAddressComponent {
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
  }

  submit() {
    if (this.addressForm.valid) {
      sessionStorage.setItem('checkout_address', JSON.stringify(this.addressForm.value));
      this.router.navigate(['/shop/checkout/confirm']);
    } else {
      this.snackBar.open('Please fill all the fields', 'Close', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['black-text-snackbar'],
      });
    }
  }
}
