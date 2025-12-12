import { Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { ProductDetailsPageComponent } from './pages/product-details/product-details-page.component';
import { ProductRatingPageComponent } from './pages/product-rating/product-rating-page.component';
import { CartPageComponent } from './components/cart/cart-page.component';
import { WishlistPageComponent } from './components/wishlist/wishlist-page.component';
import { CheckoutSummaryComponent } from './components/checkout/step1-summary.component';
import { CheckoutAddressComponent } from './components/checkout/step2-address.component';
import { CheckoutConfirmComponent } from './components/checkout/step3-confirm.component';

export const SHOP_ROUTES: Routes = [
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
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
