import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderSummary } from '../../services/types';

@Component({
  standalone: true,
  selector: 'app-order-card',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div
      class="cursor-pointer space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-start justify-between">
        <div>
          <h5 class="font-semibold text-slate-900">Commande #{{ order.id }}</h5>
          <p class="text-sm text-slate-600">
            {{ order.orderDate | date: 'dd/MM/yyyy à HH:mm' }}
          </p>
        </div>
        <span
          [ngClass]="getStatusClass(order.status)"
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
        >
          {{ getStatusLabel(order.status) }}
        </span>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-slate-600">Nombre d'articles:</span>
          <span class="font-semibold">{{ order.itemCount }}</span>
        </div>
        <div class="flex justify-between border-t pt-2">
          <span class="text-slate-600">Montant total:</span>
          <span class="text-lg font-bold text-sky-600">
            {{ order.totalPrice | currency: 'EUR' }}
          </span>
        </div>
      </div>

      <button mat-button color="primary" [routerLink]="['/account/orders', order.id]" class="mt-2">
        Voir les détails
        <mat-icon>arrow_forward</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      button {
        justify-content: flex-end;
      }
    `,
  ],
})
export class OrderCardComponent {
  @Input() order!: OrderSummary;

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classMap[status] || 'bg-slate-100 text-slate-800';
  }
}
