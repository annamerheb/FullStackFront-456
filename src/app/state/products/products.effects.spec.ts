import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { ProductsEffects } from './products.effects';
import * as ProductsActions from './products.actions';
import { selectCacheTimestamp } from './products.selectors';

/**
 * Unit tests for Products Effects
 * Tests effect logic for loading products with stale-while-revalidate pattern
 */
describe('Products Effects', () => {
  let actions$: Observable<any>;
  let effects: ProductsEffects;
  let store: MockStore;

  const initialState = {
    products: {
      items: [],
      loading: false,
      error: null,
      cacheTimestamp: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState,
          selectors: [{ selector: selectCacheTimestamp, value: null }],
        }),
      ],
    });

    effects = TestBed.inject(ProductsEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('loadProducts$', () => {
    it('should fetch fresh data when cache is missing', (done) => {
      // Set cache timestamp to null (no cache)
      store.overrideSelector(selectCacheTimestamp, null);

      const filters = { page: 0, pageSize: 8 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        // Should return revalidateCacheSuccess with products data
        expect(resultAction.type).toBe('[Products] Revalidate Cache Success');
        expect(resultAction.data).toBeDefined();
        expect(resultAction.data.results).toBeDefined();
        expect(Array.isArray(resultAction.data.results)).toBe(true);
        done();
      });
    });

    it('should fetch fresh data when cache is stale', (done) => {
      // Set cache timestamp to 10 minutes ago (stale)
      const staleTimestamp = Date.now() - 10 * 60 * 1000;
      store.overrideSelector(selectCacheTimestamp, staleTimestamp);

      const filters = { page: 0, pageSize: 8 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        // Should return revalidateCacheSuccess since cache is stale
        expect(resultAction.type).toBe('[Products] Revalidate Cache Success');
        expect(resultAction.data).toBeDefined();
        done();
      });
    });

    it('should use cache and trigger revalidation when cache is fresh', (done) => {
      // Set cache timestamp to 1 minute ago (fresh, within 5 min threshold)
      const freshTimestamp = Date.now() - 1 * 60 * 1000;
      store.overrideSelector(selectCacheTimestamp, freshTimestamp);

      const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

      const filters = { page: 0, pageSize: 8 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        // Should return loadProductsFromCache action
        expect(resultAction.type).toBe('[Products] Load Products From Cache');

        // Should also dispatch startRevalidatingCache for background revalidation
        expect(dispatchSpy).toHaveBeenCalledWith(
          ProductsActions.startRevalidatingCache({ filters }),
        );
        done();
      });
    });

    it('should handle empty filters', (done) => {
      store.overrideSelector(selectCacheTimestamp, null);

      const action = ProductsActions.loadProducts({ filters: undefined });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Products] Revalidate Cache Success');
        expect(resultAction.data.results).toBeDefined();
        done();
      });
    });

    it('should apply minRating filter correctly', (done) => {
      store.overrideSelector(selectCacheTimestamp, null);

      const filters = { page: 0, pageSize: 100, minRating: 4 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Products] Revalidate Cache Success');
        // All returned products should have rating >= 4
        resultAction.data.results.forEach((product: any) => {
          expect(product.avgRating).toBeGreaterThanOrEqual(4);
        });
        done();
      });
    });
  });

  describe('revalidateCache$', () => {
    it('should fetch products data on cache revalidation', (done) => {
      const filters = { page: 0, pageSize: 8 };
      const action = ProductsActions.startRevalidatingCache({ filters });
      actions$ = of(action);

      effects.revalidateCache$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Products] Revalidate Cache Success');
        expect(resultAction.data).toBeDefined();
        expect(resultAction.data.results).toBeDefined();
        done();
      });
    });
  });

  describe('loadRating$', () => {
    it('should return rating data for existing product', (done) => {
      const action = ProductsActions.loadRating({ productId: 1 });
      actions$ = of(action);

      effects.loadRating$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Products] Load Rating Success');
        if (resultAction.type === '[Products] Load Rating Success') {
          expect(resultAction.data.product_id).toBe(1);
          expect(resultAction.data.avg_rating).toBeDefined();
          expect(resultAction.data.count).toBeDefined();
        }
        done();
      });
    });

    it('should return failure for non-existent product', (done) => {
      const action = ProductsActions.loadRating({ productId: 99999 });
      actions$ = of(action);

      effects.loadRating$.subscribe((resultAction) => {
        expect(resultAction.type).toBe('[Products] Load Rating Failure');
        if (resultAction.type === '[Products] Load Rating Failure') {
          expect(resultAction.error).toBe('Product not found');
        }
        done();
      });
    });
  });

  describe('Pagination', () => {
    it('should return correct page of results', (done) => {
      store.overrideSelector(selectCacheTimestamp, null);

      const filters = { page: 0, pageSize: 2 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        expect(resultAction.data.results.length).toBeLessThanOrEqual(2);
        done();
      });
    });

    it('should include count in response', (done) => {
      store.overrideSelector(selectCacheTimestamp, null);

      const filters = { page: 0, pageSize: 8 };
      const action = ProductsActions.loadProducts({ filters });
      actions$ = of(action);

      effects.loadProducts$.subscribe((resultAction) => {
        expect(resultAction.data.count).toBeDefined();
        expect(typeof resultAction.data.count).toBe('number');
        done();
      });
    });
  });
});
