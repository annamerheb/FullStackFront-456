import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as ReviewsActions from './reviews.actions';
import { Review } from './reviews.models';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly notification = inject(NotificationService);

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
          map((review) => {
            this.notification.success('✅ Avis publié avec succès');
            return ReviewsActions.submitReviewSuccess({ productId, review });
          }),
          catchError((error) => {
            this.notification.error("❌ Erreur lors de la publication de l'avis");
            return of(ReviewsActions.submitReviewError({ error: error.message }));
          }),
        ),
      ),
    ),
  );
}
