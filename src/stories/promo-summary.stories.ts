import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { fn } from 'storybook/test';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

/**
 * PromoSummary Component
 * Displays promotional code discounts with calculations
 * Demonstrates Controls for manipulating discount amounts and types
 */
@Component({
  selector: 'app-promo-summary-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm w-full max-w-sm">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Promo Applied</h3>

      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-slate-600">Code:</span>
          <span class="font-semibold text-slate-900">{{ promoCode }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-slate-600">Subtotal:</span>
          <span class="text-slate-900">{{ formatPrice(subtotal) }}</span>
        </div>

        <div
          class="flex justify-between items-center p-3 rounded-lg"
          [ngClass]="{
            'bg-green-50': discountType === 'fixed',
            'bg-blue-50': discountType === 'percentage',
          }"
        >
          <span class="text-slate-600">Discount:</span>
          <span
            class="font-semibold"
            [ngClass]="{
              'text-green-600': discountType === 'fixed',
              'text-blue-600': discountType === 'percentage',
            }"
          >
            -{{ formatDiscount() }}
          </span>
        </div>

        <div class="border-t border-slate-200 pt-3">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-slate-900">Total:</span>
            <span class="text-2xl font-bold text-sky-600">{{ formatPrice(calculateTotal()) }}</span>
          </div>
          <p class="text-xs text-green-600 mt-2">
            💚 You save {{ formatPrice(calculateSavings()) }}!
          </p>
        </div>
      </div>

      <button
        mat-raised-button
        color="primary"
        (click)="onRemovePromo()"
        class="w-full mt-4 !rounded-lg"
      >
        Remove Code
      </button>
    </div>
  `,
})
class PromoSummaryStoryComponent {
  @Input() promoCode = 'WELCOME10';
  @Input() subtotal = 100;
  @Input() discountAmount = 10;
  @Input() discountType: 'fixed' | 'percentage' = 'percentage';
  @Output() removePromo = new EventEmitter<void>();

  onRemovePromo() {
    this.removePromo.emit();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  formatDiscount(): string {
    if (this.discountType === 'percentage') {
      return `${this.discountAmount}%`;
    }
    return this.formatPrice(this.discountAmount).replace('€', '');
  }

  calculateTotal(): number {
    if (this.discountType === 'percentage') {
      return this.subtotal - (this.subtotal * this.discountAmount) / 100;
    }
    return Math.max(0, this.subtotal - this.discountAmount);
  }

  calculateSavings(): number {
    if (this.discountType === 'percentage') {
      return (this.subtotal * this.discountAmount) / 100;
    }
    return this.discountAmount;
  }
}

const meta: Meta<PromoSummaryStoryComponent> = {
  title: 'Shop/Promo Summary',
  component: PromoSummaryStoryComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({}),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
          },
        },
      ],
    }),
  ],
  argTypes: {
    promoCode: {
      control: 'text',
      description: 'The promotional code applied',
    },
    subtotal: {
      control: { type: 'number', min: 0, max: 10000, step: 10 },
      description: 'Original cart subtotal',
    },
    discountAmount: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Discount value (percentage or fixed)',
    },
    discountType: {
      control: 'inline-radio',
      options: ['fixed', 'percentage'],
      description: 'Type of discount',
    },
  },
  args: {
    removePromo: fn(),
  },
};

export default meta;
type Story = StoryObj<PromoSummaryStoryComponent>;

export const PercentageDiscount: Story = {
  args: {
    promoCode: 'WELCOME10',
    subtotal: 150,
    discountAmount: 10,
    discountType: 'percentage',
  },
};

export const FixedDiscount: Story = {
  args: {
    promoCode: 'SAVE20',
    subtotal: 150,
    discountAmount: 20,
    discountType: 'fixed',
  },
};

export const VIPDiscount: Story = {
  args: {
    promoCode: 'VIP20',
    subtotal: 300,
    discountAmount: 20,
    discountType: 'percentage',
  },
};

export const FreeShipping: Story = {
  args: {
    promoCode: 'FREESHIP',
    subtotal: 80,
    discountAmount: 15,
    discountType: 'fixed',
  },
};

export const HighValue: Story = {
  args: {
    promoCode: 'BLACKFRIDAY',
    subtotal: 2500,
    discountAmount: 30,
    discountType: 'percentage',
  },
};

export const MinimalDiscount: Story = {
  args: {
    promoCode: 'TINY5',
    subtotal: 50,
    discountAmount: 5,
    discountType: 'fixed',
  },
};
