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
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const minRating = filters?.minRating || 0;
        const ordering = filters?.ordering || '-created_at';

        let rows = products
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            created_at: p.created_at,
            image: p.image,
            avgRating: avgRating(p.ratings),
          }))
          .filter((p: any) => p.avgRating >= minRating);

        const sign = ordering.startsWith('-') ? -1 : 1;
        const key =
          ordering.replace(/^-/, '') === 'rating' ? 'avgRating' : ordering.replace(/^-/, '');
        rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

        const { count, results } = paginate(rows, page, pageSize);

        return ProductsActions.loadProductsSuccess({
          data: { count, next: null, previous: null, results } as any,
        });
      }),
    ),
  );

  loadRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadRating),
      map(({ productId }) => {
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
      }),
    ),
  );
}
