import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectCartItems } from '../state/cart/cart.selectors';
import { selectUserDefaultAddress } from '../state/user/user.selectors';

/**
 * CheckoutConfirmGuard - Prevents access to checkout confirmation if:
 * 1. Cart is empty
 * 2. No default address is set
 */
@Injectable({ providedIn: 'root' })
export class CheckoutConfirmGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(selectCartItems).pipe(
      take(1),
      switchMap((cartItems) => {
        // Cart is empty - redirect to cart page
        if (!cartItems || cartItems.length === 0) {
          this.router.navigate(['/shop/cart'], {
            queryParams: { reason: 'empty-cart' },
          });
          return of(false);
        }

        // Cart has items, check for address
        return this.store.select(selectUserDefaultAddress).pipe(
          take(1),
          map((address) => {
            // No address - redirect to address step
            if (!address) {
              this.router.navigate(['/shop/checkout/address'], {
                queryParams: { reason: 'no-address' },
              });
              return false;
            }

            // All checks passed
            return true;
          }),
        );
      }),
    );
  }
}

/**
 * CheckoutAddressGuard - Prevents access to address step if cart is empty
 */
@Injectable({ providedIn: 'root' })
export class CheckoutAddressGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(selectCartItems).pipe(
      take(1),
      map((cartItems) => {
        // Cart is empty - redirect to cart page
        if (!cartItems || cartItems.length === 0) {
          this.router.navigate(['/shop/cart'], {
            queryParams: { reason: 'empty-cart' },
          });
          return false;
        }

        // Cart has items, allow access
        return true;
      }),
    );
  }
}
