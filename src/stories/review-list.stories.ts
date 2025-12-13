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

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
  verified?: boolean;
}

/**
 * ReviewList Component
 * Displays product reviews with sorting and filtering capabilities
 * Demonstrates Controls for sorting, filtering, and rating adjustments
 */
@Component({
  selector: 'app-review-list-story',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm w-full max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-slate-900">Reviews ({{ reviews.length }})</h3>
        <select
          (change)="onSortChange($event)"
          class="rounded border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      <div class="space-y-4">
        <div
          *ngFor="let review of sortedReviews"
          class="border-b border-slate-200 pb-4 last:border-b-0"
        >
          <!-- Review Header -->
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-semibold text-slate-900">{{ review.user }}</p>
              <p class="text-xs text-slate-500">{{ review.createdAt | date: 'mediumDate' }}</p>
            </div>
            <span
              *ngIf="review.verified"
              class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded"
            >
              <mat-icon class="text-sm">check_circle</mat-icon>
              Verified
            </span>
          </div>

          <!-- Rating Stars -->
          <div class="flex items-center gap-2 mb-2">
            <span class="flex gap-0.5">
              <span *ngFor="let i of [1, 2, 3, 4, 5]" [class.text-amber-400]="i <= review.rating">
                ★
              </span>
            </span>
            <span class="text-sm font-semibold text-slate-900">{{ review.rating }}/5</span>
          </div>

          <!-- Review Comment -->
          <p class="text-sm text-slate-700">{{ review.comment }}</p>

          <!-- Actions -->
          <div class="flex gap-3 mt-3">
            <button mat-stroked-button (click)="onHelpful(review.id)" class="!text-xs !h-8">
              <mat-icon class="!text-sm mr-1">thumb_up</mat-icon>
              Helpful
            </button>
            <button
              mat-stroked-button
              (click)="onReport(review.id)"
              class="!text-xs !h-8 !text-red-600"
            >
              <mat-icon class="!text-sm mr-1">flag</mat-icon>
              Report
            </button>
          </div>
        </div>
      </div>

      <button mat-stroked-button class="w-full mt-6" (click)="onLoadMore()">
        Load More Reviews
      </button>
    </div>
  `,
})
class ReviewListStoryComponent {
  @Input() reviews: Review[] = [];
  @Input() sortBy: 'newest' | 'highest' | 'lowest' = 'newest';
  @Input() minRating = 0;
  @Output() helpful = new EventEmitter<number>();
  @Output() report = new EventEmitter<number>();
  @Output() loadMore = new EventEmitter<void>();

  get sortedReviews(): Review[] {
    const filtered = this.reviews.filter((r) => r.rating >= this.minRating);

    switch (this.sortBy) {
      case 'highest':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...filtered].sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value as 'newest' | 'highest' | 'lowest';
  }

  onHelpful(reviewId: number) {
    this.helpful.emit(reviewId);
  }

  onReport(reviewId: number) {
    this.report.emit(reviewId);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent product! Really happy with my purchase. Fast shipping and great quality.',
    createdAt: new Date('2025-12-10'),
    verified: true,
  },
  {
    id: 2,
    user: 'Mike Chen',
    rating: 4,
    comment: 'Good value for money. Minor issue with packaging but the product itself is great.',
    createdAt: new Date('2025-12-08'),
    verified: true,
  },
  {
    id: 3,
    user: 'Emma Davis',
    rating: 5,
    comment: 'Best purchase ever! Exceeded all expectations. Highly recommend!',
    createdAt: new Date('2025-12-05'),
    verified: true,
  },
  {
    id: 4,
    user: 'John Wilson',
    rating: 3,
    comment: 'Average product. Does what it says but nothing special.',
    createdAt: new Date('2025-12-01'),
    verified: false,
  },
  {
    id: 5,
    user: 'Lisa Anderson',
    rating: 2,
    comment: 'Disappointing. Quality not as described.',
    createdAt: new Date('2025-11-28'),
    verified: true,
  },
];

const meta: Meta<ReviewListStoryComponent> = {
  title: 'Shop/Review List',
  component: ReviewListStoryComponent,
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
    reviews: {
      description: 'Array of review objects',
      table: { disable: true },
    },
    sortBy: {
      control: 'inline-radio',
      options: ['newest', 'highest', 'lowest'],
      description: 'Sort order for reviews',
    },
    minRating: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Minimum rating to display',
    },
  },
  args: {
    reviews: mockReviews,
    helpful: fn(),
    report: fn(),
    loadMore: fn(),
  },
};

export default meta;
type Story = StoryObj<ReviewListStoryComponent>;

export const AllReviews: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'newest',
    minRating: 0,
  },
};

export const HighestRated: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'highest',
    minRating: 0,
  },
};

export const FiveStarOnly: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'newest',
    minRating: 5,
  },
};

export const ThreeStarAndUp: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'highest',
    minRating: 3,
  },
};

export const LowestRated: Story = {
  args: {
    reviews: mockReviews,
    sortBy: 'lowest',
    minRating: 0,
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [mockReviews[0]],
    sortBy: 'newest',
  },
};

export const NoReviews: Story = {
  args: {
    reviews: [],
    sortBy: 'newest',
  },
};
