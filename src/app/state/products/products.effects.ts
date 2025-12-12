import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, switchMap, tap } from 'rxjs/operators';
import * as ProductsActions from './products.actions';
import { selectCacheTimestamp, selectIsCacheStale } from './products.selectors';
import { products } from '../../../mocks/data';
import { avgRating, paginate } from '../../../mocks/utils';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  /**
   * STALE-WHILE-REVALIDATE PATTERN
   * When loadProducts is dispatched:
   * 1. Check if cache exists and is fresh
   * 2. If fresh cache exists: return cached data immediately + dispatch background revalidation
   * 3. If stale/missing cache: fetch and return new data
   */
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      withLatestFrom(this.store.select(selectCacheTimestamp)),
      switchMap(([{ filters }, cacheTimestamp]) => {
        const cacheAge =
          cacheTimestamp !== null && cacheTimestamp !== undefined
            ? Date.now() - (cacheTimestamp as number)
            : null;
        const isCacheFresh = cacheAge !== null && cacheAge < CACHE_DURATION;

        console.log('LoadProducts - Cache Status:', {
          isFresh: isCacheFresh,
          cacheAge,
        });

        // If cache is fresh, return cached data and trigger background revalidation
        if (isCacheFresh) {
          console.log('Using cached data - triggering background revalidation');
          // Dispatch revalidation in background (doesn't block the response)
          this.store.dispatch(ProductsActions.startRevalidatingCache({ filters }));
          // Return action to keep existing cached data
          return [ProductsActions.loadProductsFromCache({ filters })];
        }

        // Cache is stale or missing - fetch fresh data
        return [this.getProductsData(filters)];
      }),
    ),
  );

  /**
   * Background revalidation effect
   * Fetches fresh data without blocking the UI
   */
  revalidateCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.startRevalidatingCache),
      map(({ filters }) => this.getProductsData(filters)),
      switchMap((action) => [action]),
    ),
  );

  /**
   * Helper method to fetch products data
   * Factored out to be reused by both initial load and background revalidation
   */
  private getProductsData(filters: any): any {
    const page = (filters?.page || 0) + 1; // Convert from 0-based to 1-based
    const pageSize = filters?.pageSize || 8;
    const minRating = filters?.minRating || 0;
    const ordering = filters?.ordering || '-created_at';

    console.log('Fetching products with filters:', { page, pageSize, minRating, ordering });

    let rows = products
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        created_at: p.created_at,
        image: p.image,
        avgRating: avgRating(p.ratings),
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        discount: p.discount,
      }))
      .filter((p: any) => p.avgRating >= minRating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '') === 'rating' ? 'avgRating' : ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, pageSize);

    console.log('Fetched results:', {
      count,
      page,
      pageSize,
      resultsLength: results.length,
    });

    return ProductsActions.revalidateCacheSuccess({
      data: { count, next: null, previous: null, results } as any,
    });
  }

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
