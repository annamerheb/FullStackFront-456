import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-container" [attr.data-type]="type">
      <div *ngFor="let item of skeletonItems; trackBy: trackByIndex" class="skeleton-item">
        <div *ngIf="type === 'card'" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-text"></div>
            <div class="skeleton-line skeleton-text short"></div>
          </div>
        </div>
        <div *ngIf="type === 'text'" class="skeleton-text-block">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div *ngIf="type === 'table'" class="skeleton-table-row">
          <div class="skeleton-line cell cell-1"></div>
          <div class="skeleton-line cell cell-2"></div>
          <div class="skeleton-line cell cell-3"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .skeleton-container {
        display: grid;
        gap: 1.5rem;
        padding: 1rem;
      }
      .skeleton-container[data-type='card'] {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
      .skeleton-container[data-type='text'] {
        max-width: 600px;
      }
      .skeleton-container[data-type='table'] {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .skeleton-item {
        animation: fadeIn 0.3s ease-in;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .skeleton-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem;
        overflow: hidden;
        backdrop-filter: blur(10px);
      }
      .skeleton-image {
        width: 100%;
        height: 200px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      .skeleton-content {
        padding: 1.5rem;
      }
      .skeleton-line {
        height: 12px;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
        border-radius: 4px;
        margin-bottom: 0.75rem;
      }
      .skeleton-title {
        height: 18px;
        margin-bottom: 1rem;
      }
      .skeleton-text {
        height: 14px;
      }
      .skeleton-line.short {
        width: 60%;
      }
      .skeleton-text-block {
        padding: 1rem;
      }
      .skeleton-text-block .skeleton-line {
        margin-bottom: 1rem;
      }
      .skeleton-table-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .skeleton-line.cell {
        height: 16px;
        margin-bottom: 0;
      }
      .skeleton-line.cell-3 {
        width: 80%;
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: calc(200% + 200px) 0;
        }
      }
      @media (max-width: 768px) {
        .skeleton-container[data-type='card'] {
          grid-template-columns: 1fr;
        }
        .skeleton-table-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {
  @Input() count = 3;
  @Input() type: 'card' | 'text' | 'table' = 'card';
  get skeletonItems() {
    return Array(this.count).fill(0);
  }

  /**
   * TrackBy function for skeleton items in *ngFor
   * Improves performance by tracking items by their index
   */
  trackByIndex(index: number): number {
    return index;
  }
}
