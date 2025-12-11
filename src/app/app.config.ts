import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartFeatureReducer } from './state/cart/cart.reducer';
import { wishlistReducer } from './state/wishlist/wishlist.reducer';
import { discountsReducer } from './state/discounts/discounts.reducer';
import { deliveryReducer } from './state/delivery/delivery.reducer';
import { userReducer } from './state/user/user.reducer';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { CartEffects } from './state/cart/cart.effects';
import { WishlistEffects } from './state/wishlist/wishlist.effects';
import { DiscountsEffects } from './state/discounts/discounts.effects';
import { UserEffects } from './state/user/user.effects';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { authInterceptor } from './services/auth.interceptor';
import { provideState } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer, products: productsReducer }),
    provideState('cart', cartFeatureReducer),
    provideState('wishlist', wishlistReducer),
    provideState('discounts', discountsReducer),
    provideState('delivery', deliveryReducer),
    provideState('user', userReducer),
    provideState('reviews', reviewsReducer),
    provideEffects([
      AuthEffects,
      ProductsEffects,
      CartEffects,
      WishlistEffects,
      DiscountsEffects,
      UserEffects,
      ReviewsEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
