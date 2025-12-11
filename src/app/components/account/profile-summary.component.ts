import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { User } from '../../services/types';

@Component({
  standalone: true,
  selector: 'app-profile-summary',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="grid gap-4 md:grid-cols-2">
      <!-- User Info Section -->
      <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900">Informations personnelles</h3>
        <div class="space-y-3 text-sm">
          <div>
            <p class="text-slate-600">Email</p>
            <p class="font-semibold">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-slate-600">Nom d'utilisateur</p>
            <p class="font-semibold">{{ user.username }}</p>
          </div>
          <div *ngIf="user.fullName">
            <p class="text-slate-600">Nom complet</p>
            <p class="font-semibold">{{ user.fullName }}</p>
          </div>
          <div *ngIf="user.createdAt">
            <p class="text-slate-600">Membre depuis</p>
            <p class="font-semibold">{{ user.createdAt | date: 'dd MMMM yyyy' }}</p>
          </div>
        </div>
      </div>

      <!-- Preferences Section -->
      <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900">Préférences</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <p class="text-slate-600">Newsletter</p>
            <mat-icon [class.text-green-600]="user.preferences.newsletter">
              {{ user.preferences.newsletter ? 'check_circle' : 'cancel' }}
            </mat-icon>
          </div>
          <div>
            <p class="text-slate-600">Note minimale</p>
            <p class="font-semibold">{{ user.preferences.defaultMinRating ?? 0 }}/5 ⭐</p>
          </div>
          <div *ngIf="user.defaultAddress">
            <p class="text-slate-600">Adresse par défaut</p>
            <p class="font-semibold">{{ user.defaultAddress.city }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      button {
        align-self: flex-end;
      }
    `,
  ],
})
export class ProfileSummaryComponent {
  @Input() user!: User;
}
