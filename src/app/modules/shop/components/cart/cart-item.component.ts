import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartItem } from '../../../../state/cart/cart.models';

@Component({
  standalone: true,
  selector: 'app-cart-item',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card class="cart-item-card cart-item-enter">
      <div class="item-content">
        <div class="product-info">
          <h5 class="product-name">{{ item.product.name }}</h5>
          <div class="price-section">
            <p *ngIf="item.product.discount" class="original-price">
              {{ formatPrice(item.product.price) }}
            </p>
            <p class="product-price">{{ formatPrice(getDiscountedPrice()) }}</p>
            <p *ngIf="item.product.discount" class="discount-badge">
              -{{ item.product.discount }}% OFF
            </p>
          </div>
          <p
            class="product-stock"
            [ngClass]="{
              'text-green-600': item.product.stock > 20,
              'text-yellow-600': item.product.stock > 5 && item.product.stock <= 20,
              'text-red-600': item.product.stock <= 5,
            }"
          >
            <mat-icon class="stock-icon">{{
              item.product.stock > 0 ? 'check_circle' : 'error'
            }}</mat-icon>
            {{ item.product.stock }} in stock
          </p>
        </div>

        <div class="quantity-control">
          <label [for]="'qty-' + item.product.id" class="qty-label">Qty:</label>
          <input
            [id]="'qty-' + item.product.id"
            type="number"
            min="1"
            [max]="item.product.stock"
            [(ngModel)]="quantity"
            (change)="onQuantityChange()"
            class="qty-input qty-input-change"
          />
        </div>

        <div class="item-total">
          <p class="total-label">Subtotal:</p>
          <p class="total-value">{{ formatPrice(itemTotal) }}</p>
        </div>

        <button
          mat-icon-button
          color="warn"
          (click)="onRemove()"
          class="remove-btn"
          matTooltip="Remove from cart"
          [attr.aria-label]="'Remove ' + item.product.name + ' from cart'"
        >
          <mat-icon aria-hidden="true">delete</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .cart-item-card {
        margin: 12px 0;
        padding: 16px;
        border-radius: 12px;
        background: white;
        border: 1px solid #e0e0e0;
      }

      .item-content {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .product-info {
        flex: 1;
        min-width: 200px;
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 4px;
      }

      .original-price {
        margin: 0;
        color: #999;
        font-size: 13px;
        text-decoration: line-through;
      }

      .product-price {
        margin: 0;
        color: #18a34a;
        font-size: 16px;
        font-weight: 600;
      }

      .discount-badge {
        margin: 0;
        color: #dc2626;
        font-size: 12px;
        font-weight: 700;
        background-color: #fee2e2;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .product-stock {
        margin: 6px 0 0 0;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .stock-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .qty-label {
        font-weight: 500;
        font-size: 14px;
        color: #555;
      }

      .qty-input {
        width: 60px;
        padding: 6px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
      }

      .item-total {
        text-align: right;
        min-width: 100px;
      }

      .total-label {
        margin: 0;
        color: #666;
        font-size: 12px;
        font-weight: 500;
      }

      .total-value {
        margin: 4px 0 0 0;
        font-weight: 600;
        color: #1976d2;
        font-size: 16px;
      }

      .remove-btn {
        margin-left: auto;
        transition: all 0.2s ease;
      }

      .remove-btn:hover {
        color: #dc2626 !important;
        transform: scale(1.1);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes quantityPulse {
        0%,
        100% {
          background-color: white;
        }
        50% {
          background-color: #fef3c7;
        }
      }

      .cart-item-card {
        animation: slideIn 0.3s ease-out;
      }

      .qty-input {
        transition: background-color 0.2s ease;
      }

      .qty-input:focus {
        background-color: #fef3c7;
      }

      @media (max-width: 640px) {
        .item-content {
          flex-direction: column;
          align-items: flex-start;
        }

        .item-total,
        .remove-btn {
          align-self: flex-end;
          margin-left: 0;
        }
      }
    `,
  ],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<number>();
  @Output() removed = new EventEmitter<{ productId: number }>();

  quantity: number = 0;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.quantity = this.item.quantity;
  }

  get itemTotal(): number {
    const discountedPrice = this.getDiscountedPrice();
    return discountedPrice * this.quantity;
  }

  getDiscountedPrice(): number {
    const price = this.item.product.price;
    const discount = this.item.product.discount || 0;
    return price - (price * discount) / 100;
  }

  onQuantityChange() {
    if (this.quantity > this.item.product.stock) {
      this.snackBar.open(
        `✗ Stock insuffisant pour le produit ${this.item.product.name}. Maximum: ${this.item.product.stock}`,
        'Fermer',
        {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
          politeness: 'assertive',
        },
      );
      this.quantity = this.item.quantity;
      return;
    }

    if (this.quantity > 0) {
      this.quantityChanged.emit(this.quantity);
    }
  }

  onRemove() {
    this.removed.emit({ productId: this.item.product.id });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }
}
