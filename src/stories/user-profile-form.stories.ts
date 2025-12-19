import { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

type FormErrors = Record<string, string | null>;

/**
 * UserProfileForm Component
 * Displays a form for editing user profile information
 * Demonstrates Controls for validation states and error display
 */
@Component({
  selector: 'app-user-profile-form-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="w-full max-w-lg bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Name Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              [(ngModel)]="profile.firstName"
              name="firstName"
              [disabled]="isSubmitting"
              [class.border-red-500]="showErrors && errors['firstName']"
              class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            />
            <p *ngIf="showErrors && errors['firstName']" class="text-xs text-red-600 mt-1">
              {{ errors['firstName'] }}
            </p>
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              [(ngModel)]="profile.lastName"
              name="lastName"
              [disabled]="isSubmitting"
              [class.border-red-500]="showErrors && errors['lastName']"
              class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            />
            <p *ngIf="showErrors && errors['lastName']" class="text-xs text-red-600 mt-1">
              {{ errors['lastName'] }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            [(ngModel)]="profile.email"
            name="email"
            [disabled]="isSubmitting"
            [class.border-red-500]="showErrors && errors['email']"
            class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
          <p *ngIf="showErrors && errors['email']" class="text-xs text-red-600 mt-1">
            {{ errors['email'] }}
          </p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            [(ngModel)]="profile.phone"
            name="phone"
            [disabled]="isSubmitting"
            [class.border-red-500]="showErrors && errors['phone']"
            class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
          <p *ngIf="showErrors && errors['phone']" class="text-xs text-red-600 mt-1">
            {{ errors['phone'] }}
          </p>
        </div>

        <!-- Location Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Country -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Country</label>
            <select
              [(ngModel)]="profile.country"
              name="country"
              [disabled]="isSubmitting"
              [class.border-red-500]="showErrors && errors['country']"
              class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="UK">United Kingdom</option>
              <option value="ES">Spain</option>
            </select>
            <p *ngIf="showErrors && errors['country']" class="text-xs text-red-600 mt-1">
              {{ errors['country'] }}
            </p>
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input
              type="text"
              [(ngModel)]="profile.city"
              name="city"
              [disabled]="isSubmitting"
              [class.border-red-500]="showErrors && errors['city']"
              class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
            />
            <p *ngIf="showErrors && errors['city']" class="text-xs text-red-600 mt-1">
              {{ errors['city'] }}
            </p>
          </div>
        </div>

        <!-- Success Message -->
        <div
          *ngIf="isSubmitted && hasNoErrors()"
          class="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2 text-sm text-green-700"
        >
          <mat-icon class="!text-lg">check_circle</mat-icon>
          Profile updated successfully!
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-6">
          <button
            type="submit"
            [disabled]="isSubmitting"
            mat-raised-button
            color="primary"
            class="!flex-1"
          >
            <mat-icon *ngIf="isSubmitting" class="!mr-2">refresh</mat-icon>
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <button
            type="button"
            (click)="onCancel()"
            [disabled]="isSubmitting"
            mat-stroked-button
            class="!flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
class UserProfileFormStoryComponent {
  @Input() profile: UserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+33612345678',
    country: 'FR',
    city: 'Paris',
  };

  @Input() errors: FormErrors = {};
  @Input() showErrors = false;
  @Input() isSubmitting = false;
  @Input() isSubmitted = false;

  @Output() submit = new EventEmitter<UserProfile>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    this.submit.emit(this.profile);
  }

  onCancel() {
    this.cancel.emit();
  }

  hasNoErrors(): boolean {
    return !Object.keys(this.errors).some((key) => this.errors[key]);
  }
}

const defaultProfile: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+33612345678',
  country: 'FR',
  city: 'Paris',
};

const meta: Meta<UserProfileFormStoryComponent> = {
  title: 'Account/UserProfileForm',
  component: UserProfileFormStoryComponent,
  tags: ['autodocs'],
  argTypes: {
    profile: {
      description: 'User profile data',
      table: { disable: true },
    },
    errors: {
      description: 'Form validation errors object',
      table: { disable: true },
    },
    showErrors: {
      control: 'boolean',
      description: 'Whether to display validation errors',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is being submitted',
    },
    isSubmitted: {
      control: 'boolean',
      description: 'Whether the form was successfully submitted',
    },
  },
  args: {
    profile: defaultProfile,
    errors: {},
    showErrors: false,
    isSubmitting: false,
    isSubmitted: false,
    submit: fn(),
    cancel: fn(),
  },
};

export default meta;
type Story = StoryObj<UserProfileFormStoryComponent>;

export const EmptyForm: Story = {
  args: {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
    },
    showErrors: false,
  },
};

export const FilledForm: Story = {
  args: {
    profile: defaultProfile,
    showErrors: false,
    isSubmitted: false,
  },
};

export const WithValidationErrors: Story = {
  args: {
    profile: {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '',
      country: '',
      city: '',
    },
    showErrors: true,
    errors: {
      firstName: 'First name is required',
      email: 'Please enter a valid email address',
      phone: 'Phone number is required',
      country: 'Country is required',
    },
  },
};

export const Submitting: Story = {
  args: {
    profile: defaultProfile,
    isSubmitting: true,
    showErrors: false,
  },
};

export const SubmittedSuccess: Story = {
  args: {
    profile: defaultProfile,
    isSubmitted: true,
    showErrors: false,
    errors: {},
  },
};

export const PartialErrors: Story = {
  args: {
    profile: {
      firstName: 'Jane',
      lastName: '',
      email: 'jane@example.com',
      phone: '+33987654321',
      country: 'DE',
      city: '',
    },
    showErrors: true,
    errors: {
      lastName: 'Last name is required',
      city: 'City is required',
    },
  },
};

export const LoadedFromDatabase: Story = {
  args: {
    profile: {
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@example.com',
      phone: '+33698765432',
      country: 'FR',
      city: 'Lyon',
    },
    showErrors: false,
    isSubmitted: false,
  },
};
