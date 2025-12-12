// src/app/services/products-cache.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { tap, shareReplay, switchMap } from 'rxjs/operators';
import { ShopApiService } from './shop-api.service';

interface CacheEntry {
  data: any;
  timestamp: number;
  refetching: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsCacheService {
  private cache = new Map<string, CacheEntry>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private revalidateSubject$ = new Subject<string>();

  constructor(private shopApi: ShopApiService) {
    // Handle background revalidation
    this.revalidateSubject$
      .pipe(switchMap((filters) => this.shopApi.getProducts(this.parseFilters(filters as any))))
      .subscribe((newData) => {
        const cacheKey = this.getCacheKey({} as any); // Use default key for background fetch
        const entry = this.cache.get(cacheKey);
        if (entry) {
          entry.data = newData;
          entry.timestamp = Date.now();
          entry.refetching = false;
        }
      });
  }

  /**
   * Get products with cache + background revalidation
   * Strategy: "stale-while-revalidate"
   * 1. Return cached data immediately if exists
   * 2. If stale (>5min), trigger background refetch
   * 3. Return fresh data once available
   */
  getProductsWithCache(filters?: any): Observable<any> {
    const cacheKey = this.getCacheKey(filters);
    const entry = this.cache.get(cacheKey);
    const now = Date.now();

    // If no cache, fetch fresh
    if (!entry) {
      return this.shopApi.getProducts(filters).pipe(
        tap((data) => {
          this.cache.set(cacheKey, {
            data,
            timestamp: now,
            refetching: false,
          });
        }),
        shareReplay(1),
      );
    }

    const age = now - entry.timestamp;
    const isStale = age > this.cacheDuration;

    // If stale and not already refetching, trigger background refetch
    if (isStale && !entry.refetching) {
      entry.refetching = true;
      this.revalidateSubject$.next(cacheKey);
    }

    // Return cached data (fresh or stale)
    return new Observable((observer) => {
      observer.next(entry.data);
      observer.complete();
    });
  }

  /**
   * Invalidate cache for specific filters
   */
  invalidateCache(filters?: any): void {
    const cacheKey = this.getCacheKey(filters);
    this.cache.delete(cacheKey);
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  private getCacheKey(filters?: any): string {
    if (!filters) return 'all';
    return JSON.stringify(filters);
  }

  private parseFilters(key: string): any {
    if (key === 'all') return undefined;
    try {
      return JSON.parse(key);
    } catch {
      return undefined;
    }
  }
}
