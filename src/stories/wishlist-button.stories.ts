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
 * WishlistButton Component
 * Demonstrates a reusable wishlist toggle button with different states
 */
@Component({
  selector: 'app-wishlist-button-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-icon-button
      (click)="onToggle()"
      [attr.aria-label]="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
      class="rounded-full transition"
      [class.text-red-500]="isInWishlist"
      [class.text-slate-400]="!isInWishlist"
    >
      <mat-icon>{{ isInWishlist ? 'favorite' : 'favorite_border' }}</mat-icon>
    </button>
  `,
})
class WishlistButtonStoryComponent {
  @Input() isInWishlist = false;
  @Input() productName = 'Product';
  @Output() toggleWishlist = new EventEmitter<boolean>();

  onToggle() {
    this.isInWishlist = !this.isInWishlist;
    this.toggleWishlist.emit(this.isInWishlist);
  }
}

const meta: Meta<WishlistButtonStoryComponent> = {
  title: 'Shop/Wishlist Button',
  component: WishlistButtonStoryComponent,
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
    isInWishlist: {
      control: 'boolean',
      description: 'Whether the product is in the wishlist',
    },
    productName: {
      control: 'text',
      description: 'Name of the product for accessibility',
    },
  },
  args: {
    toggleWishlist: fn(),
  },
};

export default meta;
type Story = StoryObj<WishlistButtonStoryComponent>;

export const NotInWishlist: Story = {
  args: {
    isInWishlist: false,
    productName: 'Nike Air Max 90',
  },
};

export const InWishlist: Story = {
  args: {
    isInWishlist: true,
    productName: 'Nike Air Max 90',
  },
};

export const WithDifferentProducts: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex gap-8 items-center p-6 bg-slate-50">
        <div class="text-center">
          <p class="text-sm text-slate-600 mb-2">Laptop</p>
          <app-wishlist-button-story
            [isInWishlist]="false"
            productName="Dell XPS 13"
            (toggleWishlist)="toggleWishlist($event)"
          ></app-wishlist-button-story>
        </div>
        <div class="text-center">
          <p class="text-sm text-slate-600 mb-2">Phone</p>
          <app-wishlist-button-story
            [isInWishlist]="true"
            productName="iPhone 15 Pro"
            (toggleWishlist)="toggleWishlist($event)"
          ></app-wishlist-button-story>
        </div>
        <div class="text-center">
          <p class="text-sm text-slate-600 mb-2">Watch</p>
          <app-wishlist-button-story
            [isInWishlist]="false"
            productName="Apple Watch Series 8"
            (toggleWishlist)="toggleWishlist($event)"
          ></app-wishlist-button-story>
        </div>
      </div>
    `,
  }),
  args: {
    toggleWishlist: fn(),
  },
};
