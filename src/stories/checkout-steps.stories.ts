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

interface CheckoutStep {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
}

/**
 * CheckoutSteps Component
 * Displays a visual checkout progress indicator with multiple steps
 * Demonstrates Controls for step selection and status tracking
 */
@Component({
  selector: 'app-checkout-steps-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="w-full bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <!-- Progress Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Checkout</h3>
          <p class="text-sm text-slate-600">
            Step {{ currentStepIndex + 1 }} of {{ steps.length }}: {{ currentStep.label }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-blue-600">{{ progress }}%</div>
          <p class="text-xs text-slate-600">Complete</p>
        </div>
      </div>

      <!-- Steps -->
      <div class="mb-8">
        <!-- Step Line and Circles -->
        <div class="flex items-center justify-between">
          <div
            *ngFor="let step of steps; let i = index"
            class="flex flex-col items-center"
            [style.flex]="'1'"
          >
            <!-- Circle -->
            <button
              (click)="onStepClick(i)"
              [class]="getStepButtonClass(step)"
              type="button"
              class="mb-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm font-semibold transition-all hover:scale-110"
              [attr.aria-label]="'Go to ' + step.label"
              [attr.aria-current]="step.status === 'active' ? 'step' : false"
            >
              <mat-icon *ngIf="step.status === 'completed'" class="!text-lg">check</mat-icon>
              <mat-icon *ngIf="step.status === 'active'" class="!text-lg animate-pulse">{{
                step.icon
              }}</mat-icon>
              <span *ngIf="step.status === 'pending'">{{ i + 1 }}</span>
            </button>

            <!-- Label -->
            <p
              [class]="getStepLabelClass(step)"
              class="text-xs font-medium text-center line-clamp-2"
            >
              {{ step.label }}
            </p>

            <!-- Connector Line -->
            <div
              *ngIf="i < steps.length - 1"
              [class]="getConnectorClass(i)"
              class="w-0.5 h-8 mt-3 transition-all"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-slate-50 rounded-lg p-6 mb-6">
        <h4 class="font-semibold text-slate-900 mb-2">{{ currentStep.label }}</h4>
        <p class="text-sm text-slate-600">
          <span *ngIf="currentStep.id === 'cart'"
            >Review your items and proceed to delivery options</span
          >
          <span *ngIf="currentStep.id === 'delivery'">Select your preferred delivery method</span>
          <span *ngIf="currentStep.id === 'payment'">Enter your payment information</span>
          <span *ngIf="currentStep.id === 'review'">Review your order before confirming</span>
          <span *ngIf="currentStep.id === 'confirmation'"
            >Your order has been placed successfully</span
          >
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          *ngIf="currentStepIndex > 0"
          (click)="onPrevious()"
          mat-stroked-button
          class="!flex-1"
        >
          <mat-icon class="!mr-2">arrow_back</mat-icon>
          Previous
        </button>
        <button
          *ngIf="currentStepIndex < steps.length - 1"
          (click)="onNext()"
          mat-raised-button
          color="primary"
          class="!flex-1"
        >
          Next
          <mat-icon class="!ml-2">arrow_forward</mat-icon>
        </button>
        <button
          *ngIf="currentStepIndex === steps.length - 1"
          (click)="onComplete()"
          mat-raised-button
          color="primary"
          class="!flex-1"
        >
          <mat-icon class="!mr-2">check_circle</mat-icon>
          Complete Order
        </button>
      </div>
    </div>
  `,
})
class CheckoutStepsStoryComponent {
  @Input() steps: CheckoutStep[] = [];
  @Input() currentStepIndex = 0;
  @Output() stepChanged = new EventEmitter<number>();
  @Output() stepCompleted = new EventEmitter<string>();
  @Output() nextStep = new EventEmitter<number>();
  @Output() previousStep = new EventEmitter<number>();

  get currentStep(): CheckoutStep {
    return this.steps[this.currentStepIndex];
  }

  get progress(): number {
    const completed = this.steps.filter((s) => s.status === 'completed').length;
    return Math.round(((completed + 1) / this.steps.length) * 100);
  }

  getStepButtonClass(step: CheckoutStep): string {
    if (step.status === 'completed') {
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    }
    if (step.status === 'active') {
      return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg';
    }
    return 'bg-slate-100 text-slate-400 cursor-not-allowed';
  }

  getStepLabelClass(step: CheckoutStep): string {
    if (step.status === 'completed') {
      return 'text-green-700';
    }
    if (step.status === 'active') {
      return 'text-blue-600';
    }
    return 'text-slate-400';
  }

  getConnectorClass(index: number): string {
    const nextStep = this.steps[index + 1];
    if (nextStep.status === 'completed') {
      return 'bg-green-100';
    }
    return 'bg-slate-200';
  }

  onStepClick(index: number) {
    if (index <= this.currentStepIndex) {
      this.stepChanged.emit(index);
    }
  }

  onNext() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.nextStep.emit(this.currentStepIndex + 1);
    }
  }

  onPrevious() {
    if (this.currentStepIndex > 0) {
      this.previousStep.emit(this.currentStepIndex - 1);
    }
  }

  onComplete() {
    this.stepCompleted.emit(this.currentStep.id);
  }
}

const checkoutSteps: CheckoutStep[] = [
  {
    id: 'cart',
    label: 'Review Cart',
    icon: 'shopping_cart',
    status: 'completed',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: 'local_shipping',
    status: 'completed',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: 'credit_card',
    status: 'active',
  },
  {
    id: 'review',
    label: 'Review Order',
    icon: 'verified_user',
    status: 'pending',
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    icon: 'check_circle',
    status: 'pending',
  },
];

const meta: Meta<CheckoutStepsStoryComponent> = {
  title: 'Shop/Checkout Steps',
  component: CheckoutStepsStoryComponent,
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
    steps: {
      description: 'Array of checkout steps',
      table: { disable: true },
    },
    currentStepIndex: {
      control: { type: 'number', min: 0, max: 4, step: 1 },
      description: 'Index of the current active step',
    },
  },
  args: {
    steps: checkoutSteps,
    currentStepIndex: 2,
    stepChanged: fn(),
    stepCompleted: fn(),
    nextStep: fn(),
    previousStep: fn(),
  },
};

export default meta;
type Story = StoryObj<CheckoutStepsStoryComponent>;

export const AtPayment: Story = {
  args: {
    steps: checkoutSteps,
    currentStepIndex: 2,
  },
};

export const AtStart: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Review Cart', icon: 'shopping_cart', status: 'active' },
      { id: 'delivery', label: 'Delivery', icon: 'local_shipping', status: 'pending' },
      { id: 'payment', label: 'Payment', icon: 'credit_card', status: 'pending' },
      { id: 'review', label: 'Review Order', icon: 'verified_user', status: 'pending' },
      { id: 'confirmation', label: 'Confirmation', icon: 'check_circle', status: 'pending' },
    ],
    currentStepIndex: 0,
  },
};

export const AtDelivery: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Review Cart', icon: 'shopping_cart', status: 'completed' },
      { id: 'delivery', label: 'Delivery', icon: 'local_shipping', status: 'active' },
      { id: 'payment', label: 'Payment', icon: 'credit_card', status: 'pending' },
      { id: 'review', label: 'Review Order', icon: 'verified_user', status: 'pending' },
      { id: 'confirmation', label: 'Confirmation', icon: 'check_circle', status: 'pending' },
    ],
    currentStepIndex: 1,
  },
};

export const AlmostComplete: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Review Cart', icon: 'shopping_cart', status: 'completed' },
      { id: 'delivery', label: 'Delivery', icon: 'local_shipping', status: 'completed' },
      { id: 'payment', label: 'Payment', icon: 'credit_card', status: 'completed' },
      { id: 'review', label: 'Review Order', icon: 'verified_user', status: 'active' },
      { id: 'confirmation', label: 'Confirmation', icon: 'check_circle', status: 'pending' },
    ],
    currentStepIndex: 3,
  },
};

export const Completed: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Review Cart', icon: 'shopping_cart', status: 'completed' },
      { id: 'delivery', label: 'Delivery', icon: 'local_shipping', status: 'completed' },
      { id: 'payment', label: 'Payment', icon: 'credit_card', status: 'completed' },
      { id: 'review', label: 'Review Order', icon: 'verified_user', status: 'completed' },
      { id: 'confirmation', label: 'Confirmation', icon: 'check_circle', status: 'active' },
    ],
    currentStepIndex: 4,
  },
};

export const ThreeSteps: Story = {
  args: {
    steps: [
      { id: 'cart', label: 'Cart', icon: 'shopping_cart', status: 'completed' },
      { id: 'payment', label: 'Payment', icon: 'credit_card', status: 'active' },
      { id: 'confirmation', label: 'Confirmation', icon: 'check_circle', status: 'pending' },
    ],
    currentStepIndex: 1,
  },
};
