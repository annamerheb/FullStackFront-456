import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/dashboard-page.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
