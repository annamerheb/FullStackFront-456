import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.models';

const selectReviewsFeature = createFeatureSelector<ReviewsState>('reviews');

export const selectReviewsByProductId = (productId: number) =>
  createSelector(selectReviewsFeature, (state: ReviewsState) => state.byProductId[productId] || []);

export const selectAverageRating = (productId: number) =>
  createSelector(selectReviewsByProductId(productId), (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  });

export const selectReviewsLoading = createSelector(
  selectReviewsFeature,
  (state: ReviewsState) => state.loading,
);

export const selectReviewsError = createSelector(
  selectReviewsFeature,
  (state: ReviewsState) => state.error,
);

export const selectReviewsCount = (productId: number) =>
  createSelector(selectReviewsByProductId(productId), (reviews) => reviews.length);

export const selectReviewsFiltered = (productId: number, minRating?: number) =>
  createSelector(selectReviewsByProductId(productId), (reviews) => {
    if (!minRating) return reviews;
    return reviews.filter((review) => review.rating >= minRating);
  });

export const selectReviewsSorted = (productId: number, sortBy: 'newest' | 'highest' = 'newest') =>
  createSelector(selectReviewsByProductId(productId), (reviews) => {
    const sorted = [...reviews];
    if (sortBy === 'newest') {
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === 'highest') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  });
