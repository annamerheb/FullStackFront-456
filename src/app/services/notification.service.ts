import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    duration: 4000,
  };

  private readonly typeConfig: Record<NotificationType, { panelClass: string; duration: number }> =
    {
      success: {
        panelClass: 'snackbar-success',
        duration: 3000,
      },
      error: {
        panelClass: 'snackbar-error',
        duration: 5000,
      },
      warning: {
        panelClass: 'snackbar-warning',
        duration: 4000,
      },
      info: {
        panelClass: 'snackbar-info',
        duration: 4000,
      },
    };

  /**
   * Show success notification
   * @param message Message to display
   * @param action Optional action button text
   */
  success(message: string, action = 'Fermer'): void {
    const config = this.typeConfig['success'];
    this.show(message, action, config);
  }

  /**
   * Show error notification
   * @param message Message to display
   * @param action Optional action button text
   */
  error(message: string, action = 'Fermer'): void {
    const config = this.typeConfig['error'];
    this.show(message, action, config);
    console.error(`[Notification] ${message}`);
  }

  /**
   * Show warning notification
   * @param message Message to display
   * @param action Optional action button text
   */
  warning(message: string, action = 'Fermer'): void {
    const config = this.typeConfig['warning'];
    this.show(message, action, config);
  }

  /**
   * Show info notification
   * @param message Message to display
   * @param action Optional action button text
   */
  info(message: string, action = 'Fermer'): void {
    const config = this.typeConfig['info'];
    this.show(message, action, config);
  }

  /**
   * Internal method to show snackbar
   */
  private show(
    message: string,
    action: string,
    config: { panelClass: string; duration: number },
  ): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config,
    });
  }
}
