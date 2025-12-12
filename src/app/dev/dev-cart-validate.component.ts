import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dev-cart-validate',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    JsonPipe,
  ],
  template: `
    <div class="min-h-screen containerbg from-blue-50 via-sky-100 to-indigo-100 px-4 py-10">
      <div class="mx-auto flex max-w-3xl flex-col gap-6">
        <div
          class="flex flex-col gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Development
              </p>
              <h1 class="mt-2 text-3xl font-semibold text-slate-900">Apply Promo Code</h1>
              <p class="mt-1 text-sm text-slate-600">
                POST /api/cart/apply-promo/ - Apply promo codes and calculate totals (WELCOME10,
                FREESHIP, VIP20)
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

          <div class="p-4 flex gap-3">
            <button mat-raised-button color="primary" (click)="sendRequest()">Send Request</button>
          </div>
        </div>

        <div class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <h3 class="font-semibold text-slate-900">Request Payload</h3>
          <textarea
            [(ngModel)]="requestPayload"
            class="mt-3 w-full h-64 p-3 rounded bg-slate-50 border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          ></textarea>
        </div>

        @if (response()) {
          <div
            class="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md"
          >
            <h3 class="font-semibold text-slate-900">Response</h3>
            <pre class="mt-3 rounded bg-slate-50 p-3 text-sm overflow-auto">{{
              response() | json
            }}</pre>
          </div>
        }
        @if (error()) {
          <div
            class="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm"
          >
            {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .containerbg {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%);
      }
    `,
  ],
})
export class DevCartValidateComponent implements OnInit {
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
  "promo_code": "WELCOME10",
  "shipping": 10
}`;

  response = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  sendRequest() {
    this.error.set(null);
    this.response.set(null);

    try {
      const payload = JSON.parse(this.requestPayload);
      this.http.post('/api/cart/apply-promo/', payload).subscribe({
        next: (res) => {
          this.response.set(res);
        },
        error: (err) => {
          this.error.set(err.error?.message || err.message || 'Request failed');
        },
      });
    } catch (e) {
      this.error.set('Invalid JSON payload');
    }
  }
}
