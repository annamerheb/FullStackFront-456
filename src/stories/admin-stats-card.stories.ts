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
 * AdminStatsCard Component
 * Displays a key metric with icon, value, and trend indicator
 * Demonstrates Controls for numeric values, icon selection, and trend states
 */
@Component({
  selector: 'app-admin-stats-card-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-button
      (click)="onClick()"
      [class]="cardClass"
      class="!normal-case !justify-start !p-6 !h-auto !text-left w-full rounded-lg border transition-all hover:shadow-lg hover:border-current"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <div
            [class]="iconBackgroundClass"
            class="p-3 rounded-lg flex items-center justify-center"
          >
            <mat-icon [class]="iconClass" class="!text-3xl">{{ icon }}</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-600">{{ label }}</p>
            <p class="text-2xl font-bold text-slate-900">{{ formatValue(value) }}</p>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <div
            [class]="trendClass"
            class="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
          >
            <mat-icon class="!text-lg" *ngIf="isTrendPositive">trending_up</mat-icon>
            <mat-icon class="!text-lg" *ngIf="!isTrendPositive">trending_down</mat-icon>
            {{ Math.abs(trend) }}%
          </div>
          <p class="text-xs text-slate-500 mt-2">vs last month</p>
        </div>
      </div>
    </button>
  `,
})
class AdminStatsCardStoryComponent {
  @Input() value = 0;
  @Input() label = 'Metric';
  @Input() icon = 'shopping_cart';
  @Input() trend = 0;
  @Output() clicked = new EventEmitter<void>();

  Math = Math;

  get isTrendPositive(): boolean {
    return this.trend >= 0;
  }

  get cardClass(): string {
    return `border-slate-200 ${this.isTrendPositive ? 'hover:border-green-500' : 'hover:border-red-500'}`;
  }

  get iconBackgroundClass(): string {
    if (this.label.toLowerCase().includes('revenue')) {
      return 'bg-blue-100';
    }
    if (this.label.toLowerCase().includes('order')) {
      return 'bg-purple-100';
    }
    if (
      this.label.toLowerCase().includes('customer') ||
      this.label.toLowerCase().includes('user')
    ) {
      return 'bg-green-100';
    }
    if (this.label.toLowerCase().includes('stock')) {
      return 'bg-amber-100';
    }
    return 'bg-slate-100';
  }

  get iconClass(): string {
    if (this.label.toLowerCase().includes('revenue')) {
      return '!text-blue-600';
    }
    if (this.label.toLowerCase().includes('order')) {
      return '!text-purple-600';
    }
    if (
      this.label.toLowerCase().includes('customer') ||
      this.label.toLowerCase().includes('user')
    ) {
      return '!text-green-600';
    }
    if (this.label.toLowerCase().includes('stock')) {
      return '!text-amber-600';
    }
    return '!text-slate-600';
  }

  get trendClass(): string {
    if (this.isTrendPositive) {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-red-100 text-red-700';
  }

  formatValue(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  }

  onClick() {
    this.clicked.emit();
  }
}

const meta: Meta<AdminStatsCardStoryComponent> = {
  title: 'Admin/Stats Card',
  component: AdminStatsCardStoryComponent,
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
    value: {
      control: { type: 'number', min: 0, max: 100000, step: 100 },
      description: 'The numeric value to display',
    },
    label: {
      control: 'text',
      description: 'Label for the metric',
    },
    icon: {
      control: 'text',
      description: 'Material icon name',
    },
    trend: {
      control: { type: 'number', min: -100, max: 100, step: 5 },
      description: 'Percentage change trend (negative for decrease)',
    },
  },
  args: {
    clicked: fn(),
  },
};

export default meta;
type Story = StoryObj<AdminStatsCardStoryComponent>;

export const RevenueUp: Story = {
  args: {
    value: 24500,
    label: 'Total Revenue',
    icon: 'attach_money',
    trend: 12.5,
  },
};

export const OrdersUp: Story = {
  args: {
    value: 1234,
    label: 'Total Orders',
    icon: 'shopping_cart',
    trend: 8,
  },
};

export const CustomersGrowing: Story = {
  args: {
    value: 856,
    label: 'Total Customers',
    icon: 'people',
    trend: 5.3,
  },
};

export const LowStock: Story = {
  args: {
    value: 45,
    label: 'Low Stock Items',
    icon: 'warning',
    trend: -15,
  },
};

export const RevenueDown: Story = {
  args: {
    value: 18750,
    label: 'Total Revenue',
    icon: 'attach_money',
    trend: -5.8,
  },
};

export const HighValue: Story = {
  args: {
    value: 1500000,
    label: 'Total Revenue',
    icon: 'trending_up',
    trend: 23,
  },
};

export const ZeroTrend: Story = {
  args: {
    value: 5600,
    label: 'Average Order Value',
    icon: 'receipt',
    trend: 0,
  },
};
