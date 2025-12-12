import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

async function main() {
  if (environment.useMsw) {
    try {
      const { worker } = await import('./mocks/browser');
      console.log('[MSW] Starting worker with onUnhandledRequest: warn...');
      await worker.start({
        onUnhandledRequest: 'warn', // Log warnings for unhandled requests
        quiet: false, // Show logs
      });
      console.log('[MSW] Worker started successfully - Ready to intercept requests');
    } catch (error) {
      console.error('[MSW] Failed to start worker:', error);
      throw error; // Fail fast if MSW startup fails
    }
  }
  await bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
main();
