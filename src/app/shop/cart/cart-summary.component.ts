import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CartState } from '../../state/cart/cart.models';
import { Store } from '@ngrx/store';
import * as DiscountsActions from '../../state/discounts/discounts.actions';
import * as DeliveryActions from '../../state/delivery/delivery.actions';
import {
  selectAppliedCoupon,
  selectDiscountAmount,
  selectDiscountsError,
} from '../../state/discounts/discounts.selectors';
import {
  selectAvailableDeliveryOptions,
  selectSelectedDeliveryOption,
  selectDeliveryOptionCost,
} from '../../state/delivery/delivery.selectors';
import { selectCartTotal } from '../../state/cart/cart.selectors';
import { DeliveryOption } from '../../state/delivery/delivery.actions';
import { combineLatest, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-cart-summary',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
  ],
  template: `
    <mat-card class="summary-card summary-card-enter">
      <h3 class="summary-title">Order Summary</h3>

      <div class="coupon-section" *ngIf="!hidePromoAndDelivery">
        <div class="coupon-input-group">
          <mat-form-field appearance="fill" class="coupon-input">
            <mat-label>Promo Code</mat-label>
            <input
              matInput
              [(ngModel)]="couponCode"
              name="couponCode"
              placeholder="WELCOME10, FREESHIP, VIP20"
              (keyup.enter)="applyCoupon()"
            />
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            (click)="applyCoupon()"
            [disabled]="!couponCode"
            class="apply-button"
          >
            Apply
          </button>
        </div>
        <div class="coupon-hint text-xs text-slate-500 mt-2">
          Try: <strong>WELCOME10</strong> (10% off), <strong>FREESHIP</strong> (free shipping),
          <strong>VIP20</strong> (20% off, min €50)
        </div>
        <div
          *ngIf="appliedCoupon$ | async as coupon"
          class="coupon-applied text-green-600 mt-2 flex items-center justify-between gap-2"
        >
          <span>✓ Promo "{{ coupon.code }}" applied</span>
          <button
            mat-stroked-button
            (click)="removeCoupon()"
            class="remove-coupon-btn"
            title="Remove coupon"
            type="button"
          >
            <mat-icon>clear</mat-icon>
            <span>Remove</span>
          </button>
        </div>
        <div *ngIf="discountError$ | async as error" class="coupon-error text-red-600 mt-2 text-sm">
          ✗ {{ error }}
        </div>
      </div>

      <mat-form-field appearance="fill" class="delivery-select" *ngIf="!hidePromoAndDelivery">
        <mat-label>Delivery Option</mat-label>
        <mat-select
          [value]="selectedDelivery$ | async"
          (selectionChange)="selectDelivery($event.value)"
        >
          <mat-option *ngFor="let option of availableOptions$ | async" [value]="option">
            {{ option.name }} - {{ option.cost | currency: 'EUR' }} ({{ option.estimatedDays }}
            days)
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div class="summary-row">
        <span>Subtotal</span>
        <span>{{ formatPrice(cart.totalPrice) }}</span>
      </div>

      <div *ngIf="discountAmount$ | async as discount" class="summary-row discount">
        <span>Discount</span>
        <span>-{{ formatPrice(discount) }}</span>
      </div>

      <div *ngIf="deliveryCost$ | async as cost" class="summary-row">
        <span>Shipping</span>
        <span>{{ formatPrice(cost) }}</span>
      </div>

      <div *ngIf="summary$ | async as summary" class="summary-row">
        <span>Tax (8%)</span>
        <span>{{ formatPrice(summary.taxAmount) }}</span>
      </div>

      <div class="summary-divider"></div>

      <div *ngIf="summary$ | async as summary" class="summary-row total">
        <span>Total</span>
        <span>{{ formatPrice(summary.totalAmount) }}</span>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .summary-card {
        padding: 20px;
        border-radius: 12px;
        background: white;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .summary-title {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .coupon-section {
        margin-bottom: 16px;
      }

      .coupon-input-group {
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }

      .coupon-input {
        flex: 1;
        margin-bottom: 0;
      }

      .apply-button {
        margin-top: 8px !important;
        height: 46px !important;
      }

      .coupon-applied {
        font-size: 12px;
        font-weight: 500;
        padding: 4px 0;
      }

      .coupon-error {
        font-size: 12px;
        font-weight: 500;
        padding: 4px 0;
      }

      .remove-coupon-btn {
        color: #dc2626;
        border-color: #dc2626;
        font-size: 12px;
        height: auto;
        padding: 4px 12px;
      }

      .remove-coupon-btn:hover {
        background-color: rgba(220, 38, 38, 0.1);
        border-color: #b91c1c;
      }

      .delivery-select {
        width: 100%;
        margin-bottom: 16px;
      }

      :host ::ng-deep .delivery-select .mdc-text-field__input {
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 14px !important;
      }

      :host ::ng-deep .mat-mdc-select-panel .mat-mdc-option {
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 14px !important;
      }

      :host ::ng-deep .mat-mdc-select-panel {
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
      }

      :host ::ng-deep .mdc-select__anchor {
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
        color: #666;
      }

      .summary-row span:last-child {
        font-weight: 500;
      }

      .summary-row.discount {
        color: #16a34a;
        font-weight: 600;
      }

      .summary-divider {
        height: 1px;
        background: #e0e0e0;
        margin: 12px 0;
      }

      .summary-row.total {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .summary-row.total span:last-child {
        color: #1976d2;
        font-size: 18px;
      }
    `,
  ],
})
export class CartSummaryComponent implements OnInit {
  @Input() cart!: any;
  @Input() hidePromoAndDelivery = false;

  couponCode = '';
  appliedCoupon$;
  discountAmount$;
  discountError$;
  availableOptions$;
  selectedDelivery$;
  deliveryCost$;

  summary$;

  constructor(private store: Store) {
    this.appliedCoupon$ = this.store.select(selectAppliedCoupon);
    this.discountAmount$ = this.store.select(selectDiscountAmount);
    this.discountError$ = this.store.select(selectDiscountsError);
    this.availableOptions$ = this.store.select(selectAvailableDeliveryOptions);
    this.selectedDelivery$ = this.store.select(selectSelectedDeliveryOption);
    this.deliveryCost$ = this.store.select(selectDeliveryOptionCost);

    this.summary$ = combineLatest([
      this.store.select(selectCartTotal),
      this.discountAmount$,
      this.deliveryCost$,
    ]).pipe(
      map(([cartTotal, discount, deliveryCost]) => {
        const discountAmount = discount || 0;
        const deliveryAmount = deliveryCost || 0;

        const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
        // Tax is 8% on the subtotal after discount + shipping
        const taxAmount = (subtotalAfterDiscount + deliveryAmount) * 0.08;
        const totalAmount = subtotalAfterDiscount + deliveryAmount + taxAmount;

        return {
          cartTotal,
          discountAmount,
          deliveryAmount,
          subtotalAfterDiscount,
          taxAmount,
          totalAmount,
        };
      }),
    );
  }

  ngOnInit() {
    const options: DeliveryOption[] = [
      {
        id: 'standard',
        name: 'Standard Delivery',
        cost: 5.99,
        estimatedDays: 5,
        description: 'Delivery in 5-7 business days',
      },
      {
        id: 'express',
        name: 'Express Delivery',
        cost: 12.99,
        estimatedDays: 2,
        description: 'Delivery in 2-3 business days',
      },
      {
        id: 'overnight',
        name: 'Overnight Delivery',
        cost: 24.99,
        estimatedDays: 1,
        description: 'Next business day delivery',
      },
      {
        id: 'pickup',
        name: 'Store Pickup',
        cost: 0,
        estimatedDays: 0,
        description: 'Free pickup at store',
      },
    ];
    this.store.dispatch(DeliveryActions.setDeliveryOptions({ options }));
  }

  applyCoupon() {
    if (this.couponCode.trim()) {
      this.store.dispatch(DiscountsActions.applyCoupon({ code: this.couponCode }));
      this.couponCode = '';
    }
  }

  selectDelivery(option: DeliveryOption) {
    this.store.dispatch(DeliveryActions.selectDeliveryOption({ option }));
  }

  removeCoupon() {
    this.store.dispatch(DiscountsActions.removeCoupon());
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }
}
