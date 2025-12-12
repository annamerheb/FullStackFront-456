import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as UserActions from '../../../../state/user/user.actions';
import {
  selectUser,
  selectUserLoading,
  selectUserError,
} from '../../../../state/user/user.selectors';
import { User } from '../../../../services/types';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="min-h-screen containerbg px-4 py-12">
      <div class="mx-auto max-w-2xl">
        <!-- Header -->
        <div class="mb-8">
          <p class="text-sm font-semibold uppercase tracking-wider text-sky-600">Mon compte</p>
          <h1 class="mt-2 text-4xl font-bold text-slate-900">Mon Profil</h1>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <div *ngIf="loading$ | async; else formContent" class="flex justify-center py-8">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <ng-template #formContent>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <!-- Email (Read-only) -->
              <mat-form-field class="w-full" appearance="fill">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" readonly />
              </mat-form-field>

              <!-- Username (Read-only) -->
              <mat-form-field class="w-full" appearance="fill">
                <mat-label>Nom d'utilisateur</mat-label>
                <input matInput formControlName="username" readonly />
              </mat-form-field>

              <!-- Full Name -->
              <mat-form-field class="w-full" appearance="fill">
                <mat-label>Nom complet</mat-label>
                <input matInput formControlName="fullName" />
              </mat-form-field>

              <!-- Preferences Section -->
              <div class="mt-6 border-t pt-6">
                <h2 class="mb-4 text-lg font-semibold text-slate-900">Préférences</h2>

                <!-- Newsletter -->
                <div class="mb-4 flex items-center justify-between">
                  <label for="newsletter" class="text-slate-700">S'abonner à la newsletter</label>
                  <mat-slide-toggle id="newsletter" formControlName="newsletter"></mat-slide-toggle>
                </div>

                <!-- Min Rating -->
                <mat-form-field class="w-full" appearance="fill">
                  <mat-label>Note minimale pour les produits</mat-label>
                  <input
                    matInput
                    formControlName="defaultMinRating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                  />
                  <mat-hint>Filtrer les produits par note minimale (0-5)</mat-hint>
                </mat-form-field>
              </div>

              <!-- Actions -->
              <div class="mt-8 flex gap-3">
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="loading$ | async"
                >
                  Enregistrer les modifications
                </button>
                <button mat-stroked-button type="button" (click)="goBack()">Retour</button>
              </div>
            </form>

            <!-- Error message -->
            <div *ngIf="error$ | async as error" class="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
              {{ error }}
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      mat-form-field {
        margin-bottom: 1.5rem;
      }

      .w-full {
        width: 100%;
      }
    `,
  ],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      fullName: ['', [Validators.required]],
      newsletter: [false],
      defaultMinRating: [0, [Validators.min(0), Validators.max(5)]],
    });

    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserProfile());

    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.profileForm.patchValue({
            email: user.email,
            username: user.username,
            fullName: user.fullName || '',
            newsletter: user.preferences?.newsletter || false,
            defaultMinRating: user.preferences?.defaultMinRating || 0,
          });
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.getRawValue();
      const userUpdate: Partial<User> = {
        fullName: formValue.fullName,
        preferences: {
          newsletter: formValue.newsletter,
          defaultMinRating: formValue.defaultMinRating,
        },
      };

      this.store.dispatch(UserActions.updateUserProfile({ user: userUpdate }));

      this.store
        .select(selectUserLoading)
        .pipe(takeUntil(this.destroy$))
        .subscribe((loading) => {
          if (!loading) {
            this.snackBar.open('Profil mis à jour avec succès!', 'Fermer', { duration: 3000 });
            this.router.navigate(['/account']);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }
}
