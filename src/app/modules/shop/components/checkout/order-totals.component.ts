import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * OrderTotalsComponent - Displays a clear breakdown of order costs
 * Used in checkout confirmation and order summaries
 */
@Component({
  selector: 'app-order-totals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="order-totals-card">
      <h3 class="totals-title">Order Breakdown</h3>

      <!-- Subtotal -->
      <div class="totals-row subtotal-row">
        <div class="totals-label">
          <span>Subtotal</span>
          <span class="text-xs text-slate-500">({{ itemCount }} items)</span>
        </div>
        <span class="totals-value">{{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Discount -->
      <div *ngIf="discount > 0" class="totals-row discount-row">
        <div class="totals-label">
          <span>Discount</span>
          <span class="text-xs text-green-600">{{ discountLabel }}</span>
        </div>
        <span class="totals-value discount-value">-{{ formatPrice(discount) }}</span>
      </div>

      <!-- Subtotal after discount -->
      <div *ngIf="discount > 0" class="totals-row subtotal-after-discount">
        <span>Subtotal after discount</span>
        <span class="totals-value">{{ formatPrice(subtotalAfterDiscount) }}</span>
      </div>

      <!-- Shipping -->
      <div class="totals-row shipping-row">
        <div class="totals-label">
          <span>Shipping</span>
          <span class="text-xs text-slate-500" *ngIf="shippingMethod">{{ shippingMethod }}</span>
        </div>
        <span class="totals-value" [class.free]="shipping === 0">
          {{ shipping === 0 ? 'FREE' : formatPrice(shipping) }}
        </span>
      </div>

      <!-- Taxes -->
      <div class="totals-row tax-row">
        <div class="totals-label">
          <span>Taxes</span>
          <span class="text-xs text-slate-500">8% VAT</span>
        </div>
        <span class="totals-value">{{ formatPrice(tax) }}</span>
      </div>

      <!-- Total -->
      <div class="totals-divider"></div>
      <div class="totals-row total-row">
        <span class="total-label">Total Amount</span>
        <span class="total-value">{{ formatPrice(total) }}</span>
      </div>

      <!-- Trust badges -->
      <div class="trust-badges">
        <div class="badge">
          <mat-icon>verified_user</mat-icon>
          <span>Secure Checkout</span>
        </div>
        <div class="badge">
          <mat-icon>local_shipping</mat-icon>
          <span>Free Returns</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .order-totals-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .totals-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 16px 0;
      }

      .totals-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
      }

      .totals-row:last-of-type {
        border-bottom: none;
      }

      .totals-label {
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: #64748b;
      }

      .totals-label span:first-child {
        color: #475569;
        font-weight: 500;
      }

      .totals-value {
        font-weight: 600;
        color: #334155;
        text-align: right;
      }

      .subtotal-row {
        font-weight: 500;
      }

      .discount-row {
        background: rgba(34, 197, 94, 0.05);
        padding: 10px 12px;
        border-radius: 8px;
        margin: 8px 0;
      }

      .discount-row .totals-label {
        color: #16a34a;
      }

      .discount-value {
        color: #16a34a !important;
      }

      .subtotal-after-discount {
        background: rgba(59, 130, 246, 0.05);
        padding: 8px 0;
        font-weight: 500;
      }

      .shipping-row {
        padding: 10px 0;
      }

      .tax-row {
        padding: 10px 0;
      }

      .free {
        color: #16a34a;
        font-weight: 600;
      }

      .totals-divider {
        height: 2px;
        background: linear-gradient(to right, #e2e8f0, transparent);
        margin: 12px 0;
      }

      .total-row {
        border: none;
        padding: 12px 0;
        font-size: 16px;
      }

      .total-label {
        font-weight: 600;
        color: #1e293b;
        font-size: 15px;
      }

      .total-value {
        font-size: 20px;
        font-weight: 700;
        color: #0ea5e9;
      }

      .trust-badges {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #f1f5f9;
      }

      .badge {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #64748b;
        flex: 1;
        justify-content: center;
      }

      .badge mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #0ea5e9;
      }
    `,
  ],
})
export class OrderTotalsComponent {
  @Input() subtotal = 0;
  @Input() discount = 0;
  @Input() discountLabel = '';
  @Input() subtotalAfterDiscount = 0;
  @Input() shipping = 0;
  @Input() shippingMethod = '';
  @Input() tax = 0;
  @Input() total = 0;
  @Input() itemCount = 0;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }
}
