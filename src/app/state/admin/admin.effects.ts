import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AdminActions from './admin.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private notification = inject(NotificationService);

  constructor(private shopApi: ShopApiService) {}

  loadAdminStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminStats),
      switchMap(() =>
        this.shopApi.getAdminStats().pipe(
          map((stats) => AdminActions.loadAdminStatsSuccess({ stats })),
          catchError((error: any) => {
            this.notification.error('❌ Erreur lors du chargement des statistiques');
            return of(
              AdminActions.loadAdminStatsFailure({ error: error?.message || 'Unknown error' }),
            );
          }),
        ),
      ),
    ),
  );
}
