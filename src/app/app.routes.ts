import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevProductDetailsComponent } from './dev/dev-product-details.component';
import { DevCartValidateComponent } from './dev/dev-cart-validate.component';
import { DevOrderComponent } from './dev/dev-order.component';
import { DevProfileComponent } from './dev/dev-profile.component';
import { DevOrdersComponent } from './dev/dev-orders.component';
import { DevOrderDetailsComponent } from './dev/dev-order-details.component';
import { DevWishlistComponent } from './dev/dev-wishlist.component';
import { DevReviewsComponent } from './dev/dev-reviews.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './pages/login-page.component';
import { ProductsPageComponent } from './pages/products-page.component';
import { ProductRatingPageComponent } from './pages/product-rating-page.component';
import { CartPageComponent } from './shop/cart/cart-page.component';
import { ProductDetailsPageComponent } from './shop/product-details/product-details-page.component';
import { CheckoutSummaryComponent } from './shop/checkout/step1-summary.component';
import { CheckoutAddressComponent } from './shop/checkout/step2-address.component';
import { CheckoutConfirmComponent } from './shop/checkout/step3-confirm.component';
import { WishlistPageComponent } from './shop/wishlist/wishlist-page.component';
import { ProfilePageComponent } from './pages/account/profile-page.component';
import { OrdersPageComponent } from './pages/account/orders-page.component';
import { OrderDetailsPageComponent } from './pages/account/order-details-page.component';
import { AccountHomeComponent } from './pages/account/account-home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'shop',
    canActivate: [authGuard],
    children: [
      { path: 'products', component: ProductsPageComponent },
      { path: 'products/:id', component: ProductDetailsPageComponent },
      { path: 'rating', component: ProductRatingPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'wishlist', component: WishlistPageComponent },
      {
        path: 'checkout',
        children: [
          { path: 'summary', component: CheckoutSummaryComponent },
          { path: 'address', component: CheckoutAddressComponent },
          { path: 'confirm', component: CheckoutConfirmComponent },
        ],
      },
    ],
  },
  {
    path: 'account',
    canActivate: [authGuard],
    children: [
      { path: '', component: AccountHomeComponent, pathMatch: 'full' },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'orders/:id', component: OrderDetailsPageComponent },
    ],
  },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id', component: DevProductDetailsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'dev/cart-validate', component: DevCartValidateComponent },
  { path: 'dev/order', component: DevOrderComponent },
  { path: 'dev/profile', component: DevProfileComponent },
  { path: 'dev/orders', component: DevOrdersComponent },
  { path: 'dev/order-details', component: DevOrderDetailsComponent },
  { path: 'dev/wishlist', component: DevWishlistComponent },
  { path: 'dev/reviews', component: DevReviewsComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: '**', redirectTo: '' },
];
