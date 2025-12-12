import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevAdminStatsComponent } from './dev/dev-admin-stats.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevProductDetailsComponent } from './dev/dev-product-details.component';
import { DevCartValidateComponent } from './dev/dev-cart-validate.component';
import { DevStockValidateComponent } from './dev/dev-stock-validate.component';
import { DevOrderComponent } from './dev/dev-order.component';
import { DevProfileComponent } from './dev/dev-profile.component';
import { DevOrdersComponent } from './dev/dev-orders.component';
import { DevOrderDetailsComponent } from './dev/dev-order-details.component';
import { DevWishlistComponent } from './dev/dev-wishlist.component';
import { DevReviewsComponent } from './dev/dev-reviews.component';
import { AppPlaceholderComponent } from './app-placeholder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/shop/pages/login-page.component').then((m) => m.LoginPageComponent),
  },
  { path: 'app', component: AppPlaceholderComponent },

  // Lazy-loaded Shop Module (from modules/shop)
  {
    path: 'shop',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/shop/shop.routes').then((m) => m.SHOP_ROUTES),
  },

  // Lazy-loaded Account Module (from modules/account)
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
  },

  // Lazy-loaded Admin Module (from modules/admin)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Dev routes (not lazy-loaded for testing)
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id', component: DevProductDetailsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'dev/cart-validate', component: DevCartValidateComponent },
  { path: 'dev/stock-validate', component: DevStockValidateComponent },
  { path: 'dev/order', component: DevOrderComponent },
  { path: 'dev/profile', component: DevProfileComponent },
  { path: 'dev/orders', component: DevOrdersComponent },
  { path: 'dev/order-details', component: DevOrderDetailsComponent },
  { path: 'dev/wishlist', component: DevWishlistComponent },
  { path: 'dev/reviews', component: DevReviewsComponent },
  { path: 'dev/admin-stats', component: DevAdminStatsComponent },

  { path: '**', redirectTo: '' },
];
