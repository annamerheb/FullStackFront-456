import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import * as ReviewsActions from '../../../../state/reviews/reviews.actions';
import {
  selectReviewsFiltered,
  selectReviewsSorted,
  selectReviewsLoading,
  selectReviewsError,
  selectAverageRating,
  selectReviewsCount,
} from '../../../../state/reviews/reviews.selectors';

@Component({
  standalone: true,
  selector: 'app-reviews-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="mt-12 rounded-lg border border-slate-200 bg-white p-8">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">Avis clients</h2>
        <div class="flex items-center gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-amber-500">
              {{ averageRating$ | async | number: '1.1-1' }}
            </p>
            <p class="text-sm text-slate-600">{{ reviewsCount$ | async }} avis</p>
          </div>
        </div>
      </div>

      <!-- Filters & Sort -->
      <div class="mb-6 flex gap-4">
        <select
          (change)="onFilterChange($event)"
          class="rounded border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Tous les avis</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles +</option>
          <option value="3">3 étoiles +</option>
          <option value="1">1 étoile +</option>
        </select>

        <select
          (change)="onSortChange($event)"
          class="rounded border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="newest">Les plus récents</option>
          <option value="highest">Les mieux notés</option>
        </select>
      </div>

      <!-- Reviews List -->
      <div *ngIf="reviewsLoading$ | async" class="flex justify-center py-8">
        <p class="text-slate-600">Chargement des avis...</p>
      </div>

      <div *ngIf="filteredReviews$ | async as reviews" class="space-y-4">
        <div
          *ngFor="let review of reviews; trackBy: trackByReviewId"
          class="rounded-lg border border-slate-200 p-4 hover:border-sky-300 transition"
        >
          <div class="mb-2 flex items-center justify-between">
            <div>
              <p class="font-semibold text-slate-900">{{ review.user }}</p>
              <p class="text-xs text-slate-500">{{ review.createdAt | date: 'dd/MM/yyyy' }}</p>
            </div>
            <div class="flex items-center gap-1">
              <span
                *ngFor="let i of [1, 2, 3, 4, 5]; trackBy: trackByIndex"
                [class.text-amber-400]="i <= review.rating"
              >
                ★
              </span>
            </div>
          </div>
          <p class="text-slate-700">{{ review.comment }}</p>
        </div>

        <div *ngIf="reviews.length === 0" class="py-8 text-center">
          <p class="text-slate-600">Aucun avis ne correspond aux filtres</p>
        </div>
      </div>

      <!-- Review Form -->
      <div class="mt-8 border-t border-slate-200 pt-6">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">Laisser un avis</h3>

        <form [formGroup]="reviewForm" (ngSubmit)="submitReview()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Note</label>
            <div class="flex gap-2">
              <button
                *ngFor="let i of [1, 2, 3, 4, 5]; trackBy: trackByIndex"
                type="button"
                (click)="setRating(i)"
                class="text-3xl transition hover:scale-110"
                [class.text-amber-400]="i <= (reviewForm.get('rating')?.value || 0)"
                [class.text-slate-300]="i > (reviewForm.get('rating')?.value || 0)"
              >
                ★
              </button>
            </div>
            <p
              *ngIf="
                reviewForm.get('rating')?.errors?.['required'] && reviewForm.get('rating')?.touched
              "
              class="mt-1 text-xs text-red-600"
            >
              La note est requise
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Commentaire</label>
            <textarea
              formControlName="comment"
              placeholder="Partagez votre expérience..."
              class="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              rows="4"
            ></textarea>
            <p
              *ngIf="
                reviewForm.get('comment')?.errors?.['required'] &&
                reviewForm.get('comment')?.touched
              "
              class="mt-1 text-xs text-red-600"
            >
              Le commentaire est requis
            </p>
          </div>

          <div class="flex gap-2">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="reviewForm.invalid || (reviewsLoading$ | async)"
            >
              Soumettre l'avis
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="resetForm()"
              class="!border-slate-300 !text-slate-600"
            >
              Réinitialiser
            </button>
          </div>

          <p *ngIf="reviewsError$ | async as error" class="text-sm text-red-600">
            Erreur: {{ error }}
          </p>
        </form>
      </div>
    </div>
  `,
})
export class ReviewsSectionComponent implements OnInit {
  @Input() productId!: number;

  reviewForm!: FormGroup;

  filteredReviews$!: Observable<any[]>;
  averageRating$!: Observable<number>;
  reviewsCount$!: Observable<number>;
  reviewsLoading$!: Observable<boolean>;
  reviewsError$!: Observable<string | null>;

  constructor(
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.store.dispatch(ReviewsActions.loadReviews({ productId: this.productId }));

    this.filteredReviews$ = this.store.select(selectReviewsSorted(this.productId, 'newest'));
    this.averageRating$ = this.store.select(selectAverageRating(this.productId));
    this.reviewsCount$ = this.store.select(selectReviewsCount(this.productId));
    this.reviewsLoading$ = this.store.select(selectReviewsLoading);
    this.reviewsError$ = this.store.select(selectReviewsError);
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onFilterChange(event: Event) {
    const minRatingValue = (event.target as HTMLSelectElement).value;
    this.filteredReviews$ = this.store.select(
      selectReviewsFiltered(this.productId, minRatingValue ? Number(minRatingValue) : undefined),
    );
  }

  onSortChange(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value as 'newest' | 'highest';
    this.filteredReviews$ = this.store.select(selectReviewsSorted(this.productId, sortValue));
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const { rating, comment } = this.reviewForm.value;
      this.store.dispatch(
        ReviewsActions.submitReview({
          productId: this.productId,
          rating,
          comment,
        }),
      );
      this.store.dispatch(ReviewsActions.loadReviews({ productId: this.productId }));
      this.resetForm();
    }
  }

  resetForm() {
    this.reviewForm.reset({ rating: '', comment: '' });
  }

  /**
   * TrackBy functions for *ngFor lists
   * Improves performance with OnPush change detection
   */
  trackByReviewId(_index: number, review: any): number {
    return review.id || _index;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
