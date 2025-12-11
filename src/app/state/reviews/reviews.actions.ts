import { createAction, props } from '@ngrx/store';
import { Review } from './reviews.models';

export const loadReviews = createAction('[Reviews] Load Reviews', props<{ productId: number }>());

export const loadReviewsSuccess = createAction(
  '[Reviews] Load Reviews Success',
  props<{ productId: number; reviews: Review[] }>(),
);

export const loadReviewsError = createAction(
  '[Reviews] Load Reviews Error',
  props<{ error: string }>(),
);

export const submitReview = createAction(
  '[Reviews] Submit Review',
  props<{ productId: number; rating: number; comment: string }>(),
);

export const submitReviewSuccess = createAction(
  '[Reviews] Submit Review Success',
  props<{ productId: number; review: Review }>(),
);

export const submitReviewError = createAction(
  '[Reviews] Submit Review Error',
  props<{ error: string }>(),
);
