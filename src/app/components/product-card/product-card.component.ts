import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface Product {
  name: string;
  price: number;
  created_at: string;
  avgRating: number;
}

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="hover:shadow-lg transition-shadow h-full">
      <mat-card-header>
        <mat-card-title class="text-lg">{{ name }}</mat-card-title>
      </mat-card-header>
      <mat-card-content class="space-y-3">
        <p class="text-2xl font-bold text-indigo-600">\${{ price }}</p>
        <p class="text-sm text-gray-600">Created: {{ created_at | date: 'short' }}</p>
        <div class="flex items-center gap-2">
          <span class="text-yellow-500 text-lg">★</span>
          <span class="font-semibold">{{ avgRating }}/5</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ProductCardComponent implements Product {
  @Input() name!: string;
  @Input() price!: number;
  @Input() created_at!: string;
  @Input() avgRating!: number;
}
