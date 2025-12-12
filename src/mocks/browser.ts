import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

console.log(`%c[MSW Browser] 📋 Registering ${handlers.length} handlers`, 'color: blue');
console.log(
  `%c[MSW Browser] Handlers:`,
  'color: blue',
  handlers.map((h: any) => h.info?.method + ' ' + h.info?.path).join(', '),
);

export const worker = setupWorker(...handlers);
