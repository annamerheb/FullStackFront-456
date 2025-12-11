import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as ReviewsActions from './reviews.actions';
import { Review } from './reviews.models';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      switchMap(({ productId }) =>
        this.http.get<{ results: Review[] }>(`/api/products/${productId}/reviews/`).pipe(
          map((response) =>
            ReviewsActions.loadReviewsSuccess({
              productId,
              reviews: response.results,
            }),
          ),
          catchError((error) => of(ReviewsActions.loadReviewsError({ error: error.message }))),
        ),
      ),
    ),
  );

  submitReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.submitReview),
      switchMap(({ productId, rating, comment }) =>
        this.http.post<Review>(`/api/products/${productId}/reviews/`, { rating, comment }).pipe(
          map((review) => ReviewsActions.submitReviewSuccess({ productId, review })),
          catchError((error) => of(ReviewsActions.submitReviewError({ error: error.message }))),
        ),
      ),
    ),
  );
}
