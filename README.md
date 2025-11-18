# My Shop — Angular Frontend (FullStackFront-456)

A compact, opinionated Angular frontend demo built with Angular + NgRx + Angular Material using static mock data. This repository implements a simple e‑commerce UI with Login, Product listing and Product rating pages. It is intended as a learning/sample project and for UI evaluations.

---

**Quick overview**

- Framework: Angular (standalone components pattern used across the app)
- State: NgRx (actions / reducers / selectors / effects)
- UI: Angular Material + small utility CSS
- Mocking: static mock data in `src/mocks` (and an MSW mock service worker is included)

---

## Features

- Login flow (demo credentials) with redirect to the app hub
- Products listing with paging / min-rating filter / sorting
- Product rating lookup by ID
- Consistent, modern blue/white Material-themed UI
- Small skeleton loader component for async loading states

---

## Prerequisites

- Node.js 18+ (or compatible LTS)
- npm 8+ (or yarn/pnpm if you prefer — adapt commands accordingly)
- (optional) Angular CLI for local ng commands: `npm i -g @angular/cli`

---

## Install

From the repository root:

```powershell
npm install
```

---

## Run (development)

- Start the app in development mode (the workspace includes an npm `start` task):

```powershell
npx ng serve --open
```

- The app should be available at `http://localhost:4200` by default. Visit `/login` to sign in (demo/demo).

---

## Available scripts

(If you use npm scripts included in `package.json`)

- `npx ng serve` — start dev server
- `npm run build` — produce a production build
- `npm test` — run tests (if configured)
- `npm run storybook` — run Storybook (if present in the repo)

Run `npm run` to list available scripts in your local `package.json`.

---

## Project structure (high level)

```
src/
├─ app/
│  ├─ app.ts                  # app bootstrap / root component
│  ├─ app.routes.ts          # routes for pages
│  ├─ pages/                 # main page components (login, products, rating)
│  ├─ components/            # small shared components (e.g., login-form, skeleton-loader)
│  ├─ services/              # API / shop service (uses mock data)
│  └─ state/                 # NgRx actions/reducers/selectors/effects
├─ mocks/                    # static mock data and MSW handlers
└─ main.ts
```

Files and folders may be slightly different in your copy; this shows the main areas to check when editing features.

---

## Important files (where to look)

- `src/mocks/data.ts` — sample product data (IDs 1–20) and ratings
- `src/mocks/handlers.ts` — MSW handlers (if MSW is enabled)
- `src/app/state/auth/*` — auth actions, effects and selectors
- `src/app/state/products/*` — product actions, effects and selectors
- `src/app/pages/*` — UI pages that render the main flows
- `src/app/components/*` — shared UI components used by pages

---

## How the app works (flow)

1. User opens `/login` and submits credentials
2. `AuthActions.login` is dispatched and handled by an effect
3. The effect returns mocked success/failure and updates the store
4. Components select `selectAuthLoading`, `selectAuthError`, `selectIsAuthenticated` to update the UI
5. The products page fetches products via `ProductsActions.loadProducts` using filters from a reactive form
6. Ratings page dispatches `ProductsActions.loadRating` by product id

---

## Styling & Theming

- The UI uses Angular Material components for consistent controls and spacing. Components include local inline styles to keep each page visually consistent with the blue/white theme.
- If you want a global theme adjustment, update Material theme variables or add global CSS in `styles.css`.

---

## Mocking & Development notes

- The project includes a Service Worker mock (`mockServiceWorker.js`) and MSW handlers under `src/mocks`. To toggle MSW, check the `environments` entries (see `src/environments/environment.ts`).
- Because the project uses static mock data, the app works offline and does not require a backend to evaluate UI and state flows.

---

## Tests & Storybook

- There may be unit tests and Storybook stories included. Run `npm test` or `npm run storybook` if they exist in `package.json`.

---

## Troubleshooting

- If you see template compilation errors after editing components, ensure you removed any non-Angular template syntax (this repo previously contained Razor-style `@if`/`@for` fragments which will not compile in Angular).
- If a Material module is missing, add it to the component `imports` array (standalone components) or to a Material module that you import in the app.
- If `@angular/forms` import errors appear, ensure `@angular/forms` is installed and that your TypeScript/Angular versions match the project (run `npm install` again).

---

## Contribution & Next steps

- For UI tweaks, edit the standalone component files in `src/app/pages` and `src/app/components`.
- For state changes, update `src/app/state/*` (actions → effects → reducers → selectors).
- If you'd like, I can:
  - run a build and fix any remaining template/import errors,
  - add a small CONTRIBUTING.md describing branch/PR workflow,
  - or extract shared styles to a global theme file.
