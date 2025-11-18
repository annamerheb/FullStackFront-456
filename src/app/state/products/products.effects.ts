import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as ProductsActions from './products.actions';
import { products } from '../../../mocks/data';
import { avgRating, paginate } from '../../../mocks/utils';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      map(({ filters }) => {
        // Static mock products list with filtering
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const minRating = filters?.minRating || 0;
        const ordering = filters?.ordering || '-created_at';

        // Calculate average rating and filter
        let rows = products.map((p: any) => ({
          ...p,
          _avg: avgRating(p.ratings),
        })).filter((p: any) => p._avg >= minRating);

        // Sort
        const sign = ordering.startsWith('-') ? -1 : 1;
        const key = ordering.replace(/^-/, '');
        rows.sort((a: any, b: any) =>
          (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign
        );

        // Paginate
        const { count, results } = paginate(rows, page, pageSize);

        return ProductsActions.loadProductsSuccess({
          data: { count, next: null, previous: null, results } as any,
        });
      })
    )
  );

  loadRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadRating),
      map(({ productId }) => {
        // Static mock product rating
        const product = products.find((p: any) => p.id === productId);

        if (!product) {
          return ProductsActions.loadRatingFailure({
            error: 'Product not found',
          });
        }

        return ProductsActions.loadRatingSuccess({
          data: {
            product_id: productId,
            avg_rating: avgRating(product.ratings),
            count: product.ratings.length,
          },
        });
      })
    )
  );
}
