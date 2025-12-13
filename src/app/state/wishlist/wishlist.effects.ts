import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as WishlistActions from './wishlist.actions';
import { selectWishlistItems } from './wishlist.selectors';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';
import { appInit } from '../app.actions';

@Injectable()
export class WishlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ShopApiService);
  private readonly notification = inject(NotificationService);

  saveWishlistToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WishlistActions.addToWishlist,
          WishlistActions.removeFromWishlist,
          WishlistActions.clearWishlist,
        ),
        tap((action) => {
          this.store.select(selectWishlistItems).subscribe((items) => {
            const productIds = items.map((item) => item.id);
            localStorage.setItem('wishlist', JSON.stringify(productIds));

            // Show notifications
            if (action.type === WishlistActions.addToWishlist.type) {
              this.notification.success('❤️ Ajouté à votre wishlist');
            } else if (action.type === WishlistActions.removeFromWishlist.type) {
              this.notification.success('❤️ Supprimé de votre wishlist');
            } else if (action.type === WishlistActions.clearWishlist.type) {
              this.notification.success('🧹 Wishlist vidée');
            }
          });
        }),
      ),
    { dispatch: false },
  );

  loadWishlistFromStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(appInit),
        tap(() => {
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            try {
              const productIds = JSON.parse(savedWishlist);
              this.store.dispatch(WishlistActions.loadWishlistFromStorage({ productIds }));
            } catch (e) {
              localStorage.removeItem('wishlist');
            }
          }
        }),
      ),
    { dispatch: false },
  );

  syncWishlistToServer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WishlistActions.addToWishlist,
          WishlistActions.removeFromWishlist,
          WishlistActions.clearWishlist,
        ),
        switchMap(() =>
          this.store.select(selectWishlistItems).pipe(
            switchMap((items) => {
              const productIds = items.map((item) => item.id);
              return this.api.updateWishlist(productIds).pipe(catchError(() => of(null)));
            }),
          ),
        ),
      ),
    { dispatch: false },
  );
}
