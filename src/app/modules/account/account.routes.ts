import { Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile/profile-page.component';
import { OrdersPageComponent } from './pages/orders/orders-page.component';
import { AccountHomeComponent } from './pages/account-home.component';
import { OrderDetailsPageComponent } from './pages/order-details/order-details-page.component';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', component: AccountHomeComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'orders/:id', component: OrderDetailsPageComponent },
];
