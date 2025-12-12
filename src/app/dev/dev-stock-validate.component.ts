import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as CartActions from '../state/cart/cart.actions';
import { selectStockValidationErrors, selectIsValidatingStock } from '../state/cart/cart.selectors';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dev-stock-validate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card class="m-4">
      <mat-card-header>
        <mat-card-title>Validate Stock</mat-card-title>
        <mat-card-subtitle>
          Test POST /api/cart/validate-stock/ endpoint - validates cart stock before checkout
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content class="space-y-4">
        <div class="flex gap-2">
          <button mat-raised-button color="primary" (click)="validateStock()">
            Validate Current Cart Stock
          </button>
        </div>

        <div *ngIf="isValidating$ | async" class="p-4 bg-blue-50 rounded-lg">
          Validating stock...
        </div>

        <div
          *ngIf="errors$ | async as errors"
          [ngClass]="errors.length > 0 ? 'bg-red-50' : 'bg-green-50'"
          class="p-4 rounded-lg"
        >
          <h4 class="font-semibold mb-2">{{ errors.length > 0 ? 'Errors:' : 'Success!' }}</h4>
          <ul *ngIf="errors.length > 0" class="space-y-1 text-red-700">
            <li *ngFor="let error of errors; trackBy: trackByIndex" class="text-sm">
              ✗ {{ error }}
            </li>
          </ul>
          <p *ngIf="errors.length === 0" class="text-green-700 text-sm">
            ✓ All items in cart are in stock!
          </p>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">How to test:</h4>
          <ol class="text-sm space-y-1 list-decimal list-inside text-slate-700">
            <li>Add items to your cart from the shop</li>
            <li>Click "Validate Current Cart Stock"</li>
            <li>Check the response for validation results</li>
            <li>In checkout, stock validation will run automatically</li>
          </ol>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class DevStockValidateComponent {
  errors$: Observable<string[]>;
  isValidating$: Observable<boolean>;

  constructor(private store: Store) {
    this.errors$ = this.store.select(selectStockValidationErrors);
    this.isValidating$ = this.store.select(selectIsValidatingStock);
  }

  validateStock() {
    this.store.dispatch(CartActions.validateStockRequest());
  }

  /**
   * TrackBy function for error list in *ngFor
   * Improves performance by tracking errors by their index
   */
  trackByIndex(index: number): number {
    return index;
  }
}
