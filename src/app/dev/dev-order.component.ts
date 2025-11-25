import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-dev-order',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 px-4 py-10 !font-sans"
    >
      <div class="mx-auto max-w-4xl">
        <div
          class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md mb-6"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Create Order</h1>
              <p class="mt-1 text-sm text-slate-600">
                POST /api/order/ - Returns order confirmation number
              </p>
            </div>
            <button
              mat-stroked-button
              color="primary"
              routerLink="/dev"
              class="!border-sky-500 !bg-white !text-sky-700 shadow-sm hover:!bg-sky-50"
            >
              Dev Index
            </button>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <mat-card class="rounded-2xl border border-white/70 shadow-xl backdrop-blur-md">
            <mat-card-header>
              <mat-card-title>Request Payload</mat-card-title>
            </mat-card-header>
            <mat-card-content class="space-y-4">
              <textarea
                [(ngModel)]="requestPayload"
                class="w-full h-64 p-4 border border-slate-200 rounded-lg font-mono text-sm"
              ></textarea>
              <button
                mat-raised-button
                color="primary"
                (click)="sendRequest()"
                class="w-full !bg-gradient-to-r !from-sky-600 !to-blue-600 !text-white"
              >
                <mat-icon class="mr-2">send</mat-icon>
                Send Request
              </button>
            </mat-card-content>
          </mat-card>

          <mat-card class="rounded-2xl border border-white/70 shadow-xl backdrop-blur-md">
            <mat-card-header>
              <mat-card-title>Response</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <pre
                *ngIf="response"
                class="p-4 bg-slate-900 text-sky-400 rounded-lg overflow-auto max-h-96 text-sm"
                >{{ response | json }}</pre
              >
              <p *ngIf="!response" class="text-slate-500 text-center py-8">No response yet...</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DevOrderComponent implements OnInit {
  requestPayload = `{
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Stylo Bleu",
        "price": 2.5
      },
      "quantity": 2
    }
  ],
  "total_amount": 10.49,
  "coupon_code": "SAVE10",
  "delivery_option": "standard",
  "shipping_address": {
    "street": "123 Main St",
    "city": "Paris",
    "zip": "75000",
    "country": "France"
  },
  "payment_method": "card"
}`;

  response: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  sendRequest() {
    try {
      const payload = JSON.parse(this.requestPayload);
      this.http.post('/api/order/', payload).subscribe({
        next: (res) => {
          this.response = res;
        },
        error: (err) => {
          this.response = { error: err.message };
        },
      });
    } catch (e) {
      this.response = { error: 'Invalid JSON' };
    }
  }
}
