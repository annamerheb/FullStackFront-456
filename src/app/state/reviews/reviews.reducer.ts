import { createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';
import { ReviewsState, initialReviewsState } from './reviews.models';

export const reviewsReducer = createReducer(
  initialReviewsState,

  on(ReviewsActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ReviewsActions.loadReviewsSuccess, (state, { productId, reviews }) => ({
    ...state,
    byProductId: {
      ...state.byProductId,
      [productId]: reviews,
    },
    loading: false,
  })),

  on(ReviewsActions.loadReviewsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ReviewsActions.submitReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ReviewsActions.submitReviewSuccess, (state, { productId, review }) => ({
    ...state,
    byProductId: {
      ...state.byProductId,
      [productId]: [...(state.byProductId[productId] || []), review],
    },
    loading: false,
  })),

  on(ReviewsActions.submitReviewError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
