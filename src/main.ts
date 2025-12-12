import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

async function main() {
  if (environment.useMsw) {
    try {
      console.log('%c[MSW] 🚀 MSW enabled in environment', 'color: blue; font-weight: bold');
      const { worker } = await import('./mocks/browser');
      console.log('%c[MSW] 📦 Browser worker imported successfully', 'color: blue');
      console.log('%c[MSW] ⏳ Starting worker with onUnhandledRequest: warn...', 'color: blue');

      await worker.start({
        onUnhandledRequest: 'warn',
        quiet: false,
      });

      console.log(
        '%c[MSW] ✅ Worker started successfully - Ready to intercept requests',
        'color: green; font-weight: bold',
      );
      console.log('%c[MSW] 📡 Handlers loaded - API mocking active', 'color: green');
    } catch (error) {
      console.error('%c[MSW] ❌ Failed to start worker:', 'color: red; font-weight: bold', error);
      throw error;
    }
  } else {
    console.log('%c[MSW] ⚠️  MSW disabled in environment', 'color: orange');
  }

  await bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
main();
