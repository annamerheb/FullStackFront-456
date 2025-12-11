# My Shop — Angular Frontend (FullStackFront-456)

A comprehensive e‑commerce Angular frontend built with Angular 20 + NgRx + Angular Material using static mock data. This repository implements a full shopping experience with product browsing, cart management, wishlist, 3-step checkout flow, and advanced features like coupon codes and animated notifications. It is intended as a learning/sample project and for UI evaluations.

---

**Quick overview**

- Framework: Angular 20 (standalone components pattern used throughout)
- State: NgRx with 6 feature stores (cart, auth, products, wishlist, discounts, delivery)
- UI: Angular Material + Tailwind CSS + custom animations
- Mocking: static mock data in `src/mocks` with MSW (Mock Service Worker) integration
- Features: Full e-commerce workflow (browse → cart → wishlist → checkout → order)

---

## Features

### Core Features

- **Login flow** with demo credentials and secure navigation
- **Product browsing** with paging, filtering (min-rating), and sorting
- **Product details** page with stock indicators and ratings
- **Shopping cart** with persistent storage (localStorage + NgRx effects)
- **Wishlist** with add/remove items and count display in header
- **3-step checkout flow**:
  - Step 1: Order summary review
  - Step 2: Shipping address form (fullName, email, address, city, state, zipCode)
  - Step 3: Order confirmation with price breakdown and tax calculation
- **Product rating lookup** by product ID

### Advanced Features

- **Toast/Snackbar notifications** with blue gradient theme, sans-serif fonts, and slide-in animations when adding items to cart
- **Coupon code system** with validation (SAVE10, SAVE15, SAVE20, WELCOME codes) and automatic discount application
- **Product stock indicators** color-coded display: green (>20), yellow (5-20), red (≤5)
- **Delivery options** selector: Standard (€5.99), Express (€12.99), Overnight (€24.99), Pickup (Free)
- **Cart animations** with CSS keyframes for smooth item entry, quantity changes, and hover effects
- **Responsive design** optimized for desktop and tablet layouts
- **Skeleton loader** for async loading states
- **Consistent Material-themed UI** with blue/white color scheme

### Developer Features

- **Dev testing zone** with 4 dedicated pages for manual API endpoint testing
- **Storybook stories** for key components (CartItem, CartSummary, ProductDetails) with multiple test scenarios
- **Comprehensive error handling** and validation feedback

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

- The app should be available at `http://localhost:4200` by default.

---

## Routes & Navigation

### Public Routes

- **`/`** — Home page (landing)
- **`/login`** — Login page (demo credentials: username `demo`, password `demo`)

### Authenticated Routes

- **`/app`** — Dashboard/home for authenticated users

### Shopping Routes

- **`/shop/products`** — Product listing with filters, sorting, and pagination
- **`/shop/products/:id`** — Product details page with stock info, ratings, and "Add to cart" button
- **`/shop/cart`** — Shopping cart with item quantity controls, subtotal, coupon code input, delivery options selector, and checkout button
- **`/shop/wishlist`** — Wishlist page displaying saved items with add to cart action
- **`/shop/rating`** — Product rating lookup by product ID (demo feature)

### Checkout Routes (3-Step Flow)

- **`/shop/checkout/summary`** — Step 1: Review order items, subtotal, and delivery method before proceeding
- **`/shop/checkout/address`** — Step 2: Enter shipping address (fullName, email, address, city, state, zipCode)
- **`/shop/checkout/confirm`** — Step 3: Final order confirmation with complete price breakdown (subtotal, tax, delivery, discount) and place order button

### Dev Testing Zone

- **`/dev`** — Dev index page with links to all testing endpoints
- **`/dev/products/:id`** — Test individual product endpoint (shows all 20 products with clickable test buttons)
- **`/dev/cart-validate`** — Test POST `/api/cart/validate/` endpoint with editable request payload
- **`/dev/order`** — Test POST `/api/order/` endpoint with editable request payload and order confirmation response

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
│  ├─ app.ts                       # app bootstrap / root component
│  ├─ app.routes.ts                # complete routing configuration
│  ├─ app.config.ts                # NgRx providers and effects configuration
│  ├─ pages/                       # main page components
│  │  ├─ login-page.component.ts
│  │  ├─ products-page.component.ts
│  │  ├─ product-rating-page.component.ts
│  │  └─ ...
│  ├─ shop/                        # shopping feature components
│  │  ├─ cart/                     # Cart UI and components
│  │  ├─ checkout/                 # 3-step checkout flow
│  │  ├─ product-details/          # Product details page
│  │  └─ wishlist/                 # Wishlist feature
│  ├─ components/                  # shared UI components
│  │  ├─ header.component.ts       # header with cart/wishlist badges
│  │  ├─ login-form/
│  │  ├─ product-card/
│  │  ├─ products-list/
│  │  └─ skeleton-loader/
│  ├─ dev/                         # dev testing zone (4 pages)
│  │  ├─ dev-index.component.ts
│  │  ├─ dev-products.component.ts
│  │  ├─ dev-cart-validate.component.ts
│  │  └─ dev-order.component.ts
│  ├─ guards/                      # auth guards
│  ├─ services/                    # API service and interceptors
│  │  ├─ shop-api.service.ts
│  │  ├─ auth.interceptor.ts
│  │  └─ types.ts
│  └─ state/                       # NgRx feature stores
│     ├─ auth/                     # Authentication state
│     ├─ cart/                     # Shopping cart state (actions, effects, selectors)
│     ├─ products/                 # Product listing state
│     ├─ wishlist/                 # Wishlist state
│     ├─ discounts/                # Coupon/discount codes state
│     └─ delivery/                 # Delivery options state
├─ mocks/                          # Mock data and MSW handlers
│  ├─ data.ts                      # 20 sample products with stock and discount
│  ├─ handlers.ts                  # MSW request handlers
│  ├─ browser.ts
│  └─ utils.ts
├─ stories/                        # Storybook stories for components
│  ├─ cart-item.stories.ts
│  ├─ cart-summary.stories.ts
│  ├─ product-details.stories.ts
│  └─ ...
└─ main.ts
```

---

## Important files (where to look)

- `src/mocks/data.ts` — 20 sample products with ids 1–20, prices, stock levels, and discounts
- `src/mocks/handlers.ts` — MSW handlers for GET `/api/products/:id/`, POST `/api/cart/validate/`, and POST `/api/order/`
- `src/app/state/` — NgRx feature stores:
  - `auth/*` — Authentication actions, effects, selectors
  - `cart/*` — Shopping cart state with add/remove/update actions, localStorage persistence effects
  - `products/*` — Product listing state with filters and sorting
  - `wishlist/*` — Wishlist items with add/remove actions
  - `discounts/*` — Coupon validation and discount calculation effects
  - `delivery/*` — Delivery options and selection state
- `src/app/shop/cart/*` — Cart UI components:
  - `cart-page.component.ts` — Main cart view with item listing and checkout
  - `cart-item.component.ts` — Individual cart item card with quantity controls and stock display
  - `cart-summary.component.ts` — Price summary with subtotal, coupon input, delivery selector, and tax/total calculation
- `src/app/shop/checkout/*` — 3-step checkout components:
  - `step1-summary.component.ts` — Review order before checkout
  - `step2-address.component.ts` — Shipping address form with validation
  - `step3-confirm.component.ts` — Order confirmation with full price breakdown
- `src/app/shop/product-details/product-details-page.component.ts` — Product details with stock indicator and toast notifications
- `src/app/components/header.component.ts` — Header with cart and wishlist count badges
- `src/app/dev/*` — Developer testing zone components for API endpoint testing

---

## Detailed Feature Implementation

### 1. Toast/Snackbar Notifications

**File:** `src/app/shop/product-details/product-details-page.component.ts`

When a user adds a product to the cart, a Material Snackbar notification appears with:

- **Message**: `"✓ Added [quantity]x '[product name]' to cart"`
- **Position**: Bottom-right
- **Duration**: 3.5 seconds with automatic dismiss
- **Styling**: Modern blue gradient (#0284c7 → #0ea5e9), sans-serif fonts, smooth slide-in animation (400ms)
- **Interaction**: User can manually close via "Close" button

**Implementation:**

```typescript
this.snackBar.open(`✓ Added ${quantity}x "${this.product.name}" to cart`, 'Close', {
  duration: 3500,
  horizontalPosition: 'end',
  verticalPosition: 'bottom',
  panelClass: ['snackbar-success'],
  politeness: 'polite',
});
```

**CSS Styling:**

```css
.snackbar-success {
  background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%) !important;
  border-radius: 12px !important;
  animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100px) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}
```

---

### 2. Coupon Code Validation System

**File:** `src/app/state/discounts/discounts.effects.ts` (NEW)

A complete coupon validation system integrated into NgRx effects:

**Valid Coupon Codes:**

| Code    | Discount | Type       |
| ------- | -------- | ---------- |
| SAVE10  | 10%      | Percentage |
| SAVE15  | 15%      | Percentage |
| SAVE20  | 20%      | Percentage |
| WELCOME | 5%       | First-time |

**Features:**

- Case-insensitive validation
- Error messages for invalid codes
- Automatic discount calculation in cart summary
- Integration with NgRx cart state
- Registered in `app.config.ts` via `provideEffects(DiscountsEffects)`

**Error Message for Invalid Code:**

```
Invalid coupon code: "[code]". Try SAVE10, SAVE15, SAVE20, or WELCOME.
```

**Implementation:**

The `applyCoupon$` effect validates the code against a `VALID_COUPONS` map:

```typescript
const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE15: 15,
  SAVE20: 20,
  WELCOME: 5,
};
```

**UI Display:**

- Cart summary component shows:
  - Applied coupon code
  - Discount amount (calculated from subtotal)
  - Hint text about valid codes
- Error message displays if invalid code entered

**Cart Calculation Example:**

```
Subtotal:     $100.00
Coupon (SAVE10): -$10.00
Subtotal after:  $90.00
Tax (20%):       $18.00
Delivery:        $5.99
---
Total:           $113.99
```

---

### 3. Product Stock Indicator

**Status:** ✅ Already Implemented

**Locations:** Product cards, product details page, cart items

**Color-Coded Display:**

| Color     | Stock Level | Display                          |
| --------- | ----------- | -------------------------------- |
| 🟢 Green  | > 20 units  | "Plenty in stock"                |
| 🟡 Yellow | 5-20 units  | "Low stock warning"              |
| 🔴 Red    | ≤ 5 units   | "Out of stock" or "Very limited" |

**Implementation:**

Stock information displayed on:

1. **Product listing cards** - visual stock indicator below product image
2. **Product details page** - prominent stock display with color badge
3. **Cart items** - inline stock status with color coding
4. **Checkout summary** - verify stock availability before order

**Example Display Format:**

```
[check_circle_icon] 25 in stock (Green)
[warning_icon] 12 in stock (Yellow)
[error_icon] Out of stock (Red)
```

---

### 4. Wishlist Feature

**Status:** ✅ Already Implemented

**Components:**

- `WishlistPageComponent` - Full wishlist display at `/shop/wishlist`
- Heart icon on product cards - Toggle add/remove functionality
- Wishlist count badge in header - Updates in real-time

**State Management:**

- **File**: `src/app/state/wishlist/`
- **Actions**: Add item, Remove item, Load from storage
- **Storage**: localStorage persistence with auto-restore on app startup
- **Selectors**: Get all wishlist items, Check if item in wishlist, Get wishlist count

**Features:**

- Add/remove items with heart icon toggle
- Persistent storage across sessions
- Real-time badge count in header
- "Add to cart" button on wishlist page
- Empty state message when no items

**Route:**

- `/shop/wishlist` - View and manage wishlist items

---

### 5. Cart Animations

**File:** `src/app/shop/cart/cart-item.component.ts`

CSS keyframe animations for smooth, performant cart interactions:

#### Animation 1: Slide-In Entry

**Applied to:** Cart items on page load

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-item-card {
  animation: slideIn 0.3s ease-out;
}
```

- Duration: 300ms
- Easing: ease-out
- Effect: Fade in from 10px below with smooth arrival

#### Animation 2: Quantity Change Pulse

**Applied to:** Quantity input field on focus

```css
@keyframes quantityPulse {
  0%,
  100% {
    background-color: white;
  }
  50% {
    background-color: #fef3c7; /* yellow-100 */
  }
}

.quantity-input:focus {
  animation: quantityPulse 0.3s ease-in-out;
  background-color: #fef3c7;
}
```

- Duration: 300ms
- Effect: Yellow background pulse (draws user attention to quantity input)
- Provides tactile feedback for interaction

#### Animation 3: Remove Button Hover

**Applied to:** Remove button on cart item

```css
.remove-btn:hover {
  transform: scale(1.1);
  color: #dc2626; /* red-600 */
  transition: all 0.2s ease-out;
}
```

- Hover transform: Scale to 1.1
- Color change: Red (#dc2626)
- Duration: 200ms
- Provides visual feedback that action will remove item

#### Animation 4: General Transitions

All interactive elements use smooth transitions for consistency:

```css
button,
input,
.interactive-element {
  transition: all 0.2s ease-out;
}
```

**Performance Notes:**

- All animations use CSS keyframes (GPU-accelerated)
- No JavaScript animation library required
- Animations respect `prefers-reduced-motion` accessibility setting (can be enhanced)
- Smooth 60fps performance on modern devices

---

## Implementation Files Modified/Created

| File                                | Type     | Status  | Changes                                 |
| ----------------------------------- | -------- | ------- | --------------------------------------- |
| `product-details-page.component.ts` | Modified | ✅ Done | Added MatSnackBar with custom styling   |
| `discounts.effects.ts`              | Created  | ✅ Done | Coupon validation logic (4 codes)       |
| `app.config.ts`                     | Modified | ✅ Done | Registered DiscountsEffects             |
| `cart-item.component.ts`            | Modified | ✅ Done | Added CSS keyframe animations (4 types) |
| `cart-summary.component.ts`         | Modified | ✅ Done | Coupon input field and discount display |
| `wishlist-page.component.ts`        | Existing | ✅ Done | Full wishlist UI with add-to-cart       |

---

## Testing Checklist

- [ ] **Snackbar**: Add product to cart → Verify blue toast appears at bottom-right for 3.5s
- [ ] **Coupon Validation**:
  - [ ] Try valid codes: SAVE10, SAVE15, SAVE20, WELCOME
  - [ ] Try invalid code → Verify error message appears
  - [ ] Verify discount is correctly applied to cart total
- [ ] **Stock Indicator**:
  - [ ] Verify green color for 25+ units
  - [ ] Verify yellow color for 10-20 units
  - [ ] Verify red color for ≤5 units
- [ ] **Wishlist**:
  - [ ] Add item to wishlist via heart icon
  - [ ] Verify heart icon changes state (filled/empty)
  - [ ] Verify count badge updates in header
  - [ ] Verify item persists on page reload
  - [ ] Verify "Add to cart" button works on wishlist page
- [ ] **Animations**:
  - [ ] View cart items → Verify slide-in animation on entry
  - [ ] Click quantity input → Verify yellow pulse effect
  - [ ] Hover remove button → Verify scale and color change
  - [ ] General interactions → Verify smooth 200ms transitions

---

## Dependencies Used

- `@angular/material` (MatSnackBar) — Already included
- `@ngrx/store` — Already included
- `@ngrx/effects` (DiscountsEffects) — Already included
- CSS Keyframes — Native browser support, no additional dependencies

**No new npm packages were required for these features.**

---

## Styling Notes

- **Snackbar**: Material theme colors with custom blue gradient overlay
- **Animations**: CSS keyframes follow Material Design motion principles (cubic-bezier easing)
- **Color scheme**: Consistent with app theme (blue primary, yellow accents, red warnings)
- **Transitions**: 200-400ms durations for natural-feeling motion
- **Accessibility**: Consider adding `prefers-reduced-motion` media query support

---

## How the app works (flow)

### Authentication Flow

1. User opens `/login` and submits credentials (demo/demo)
2. `AuthActions.login` is dispatched and handled by an effect
3. The effect returns success/failure and updates the auth store
4. Authenticated users are redirected to `/app` (or dashboard)

### Shopping Flow

1. User browses products on `/shop/products` (with filters, sorting, pagination)
2. User clicks on a product to view details on `/shop/products/:id`
3. User can:
   - **Add to cart** → Item is stored in NgRx cart state and localStorage (displays blue toast notification with success message)
   - **Add to wishlist** → Item is stored in NgRx wishlist state (count badge updates in header)
4. User navigates to `/shop/cart` to review items:
   - View cart items with images, names, prices, quantities
   - Adjust item quantities or remove items
   - See real-time subtotal calculation
   - (Optional) Enter coupon code (SAVE10, SAVE15, SAVE20, or WELCOME) for discount
   - Select delivery option (Standard, Express, Overnight, or Pickup)
5. User proceeds to 3-step checkout:
   - **Step 1** (`/shop/checkout/summary`): Reviews order items and confirms ready to checkout
   - **Step 2** (`/shop/checkout/address`): Enters shipping address (form validates all required fields)
   - **Step 3** (`/shop/checkout/confirm`): Views final order summary with:
     - Line items with prices
     - Subtotal
     - Discount (if coupon applied)
     - Tax (calculated as 20% of subtotal - discount)
     - Delivery cost
     - **Final Total**
   - User clicks "Place Order" to complete purchase (order state is saved)

### Cart State Management

- **Persistence**: Cart data is automatically synced to `localStorage` and restored on page reload
- **Actions**: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `loadFromStorage`
- **Selectors**: Access cart items, count, subtotal, and by-product lookup
- **Effects**: Handle localStorage read/write and automatic cart restoration on app startup

### Discount/Coupon System

- **Valid codes**: SAVE10 (10% off), SAVE15 (15% off), SAVE20 (20% off), WELCOME (5% off)
- **Validation**: Applied via NgRx effects with error handling for invalid codes
- **UI feedback**: Discount applied message or error message displayed to user
- **Calculation**: Discount percentage automatically subtracted from subtotal in cart summary

### Notifications

- **Toast/Snackbar**: Blue gradient notification appears at bottom-right when:
  - Item successfully added to cart (displays "✓ Added [qty]x '[product name]' to cart")
  - Duration: 3.5 seconds with slide-in animation (400ms ease-out)
  - Styling: Modern blue gradient (#0284c7 → #0ea5e9), sans-serif, 12px border radius, shadow

### Stock Display

- **Green** (>20 units): Plenty in stock
- **Yellow** (5-20 units): Low stock warning
- **Red** (≤5 units or 0): Out of stock or very limited

---

## State Management Architecture

The application uses **NgRx** with 6 feature stores:

### 1. **Auth Store** (`src/app/state/auth/`)

- Manages user login state, credentials, and authentication tokens
- Effects handle login API calls and token storage

### 2. **Products Store** (`src/app/state/products/`)

- Manages product list, filters (min-rating), sorting, and pagination
- Effects load products from API/mocks

### 3. **Cart Store** (`src/app/state/cart/`)

- Manages shopping cart items, quantities, and totals
- **Effects**:
  - Auto-persist to localStorage on cart changes
  - Auto-restore from localStorage on app startup
  - Load cart from storage effect
- **Selectors**:
  - Get all cart items
  - Get cart item count
  - Get subtotal
  - Get item by product ID

### 4. **Wishlist Store** (`src/app/state/wishlist/`)

- Manages wishlist items and count
- **Design Decision**: Implemented as dedicated store slice (not integrated into user slice) for:
  - Clear separation of concerns (wishlist is user-independent feature)
  - Easier to extend (add features like wishlist sharing, notifications)
  - Better testability and reusability
- **Persistence**:
  - Wishlist product IDs stored in `localStorage` as JSON array
  - Automatically restored on app startup via `[App] Init` action
  - Synced to `localStorage` whenever wishlist changes (add/remove/clear)
- **Endpoints**:
  - `GET /api/me/wishlist/` - Returns `{ productIds: number[] }`
  - `POST /api/me/wishlist/` - Accepts `{ productIds: number[] }`, updates wishlist on server
- **Actions**: `addToWishlist`, `removeFromWishlist`, `clearWishlist`, `loadWishlistFromStorage`
- **Selectors**:
  - `selectWishlistItems` - Get all wishlist items with details
  - `selectWishlistCount` - Get total count
  - `selectIsInWishlist(productId)` - Check if product in wishlist

### 5. **Discounts Store** (`src/app/state/discounts/`)

- Manages applied coupon codes and discount percentages
- **Effects**: `applyCoupon$` validates code against VALID_COUPONS map
- **Validation**: SAVE10 (10%), SAVE15 (15%), SAVE20 (20%), WELCOME (5%)
- **Error handling**: Returns error message for invalid codes

### 6. **Delivery Store** (`src/app/state/delivery/`)

- Manages selected delivery option and cost
- **Options**:
  - Standard: €5.99
  - Express: €12.99
  - Overnight: €24.99
  - Pickup: Free

---

## Styling & Theming

- **Colors**: Blue gradient theme (#0284c7 → #0ea5e9) matches Material design
- **Fonts**: Material Design typography with sans-serif defaults
- **Components**: Angular Material (buttons, cards, forms, snackbars, selects, paginators)
- **Layout**: Tailwind CSS utility classes + component-specific inline styles
- **Animations**: CSS keyframes for smooth transitions:
  - Cart item entry: 300ms slide-in effect
  - Quantity change: Yellow pulse animation (300ms)
  - Toast notification: 400ms slide-in-up effect
  - Hover effects: Scale transitions on interactive elements

---

## Mocking & Development notes

- The project includes **Mock Service Worker (MSW)** handlers in `src/mocks/handlers.ts`
- **Static mock data**: 20 products (IDs 1–20) with prices, stock, discounts, and ratings in `src/mocks/data.ts`
- **API endpoints** mocked:
  - `GET /api/products` — Returns all products with filters
  - `GET /api/products/:id` — Returns single product details
  - `POST /api/cart/validate` — Validates cart items and pricing
  - `POST /api/order` — Creates new order and returns confirmation
- **Toggle MSW**: Check `src/environments/environment.ts` to enable/disable MSW
- **No backend required**: App works completely offline using mock data

---

## Dev Testing Zone

The application includes a dedicated dev testing zone (`/dev`) with 4 pages for manually testing API endpoints:

### `/dev` — Index Page

Hub page listing all available dev testing endpoints with navigation links.

### `/dev/products/:id` — Product Endpoint Tester

- Shows all 20 products (IDs 1–20)
- Click any product ID button to test `GET /api/products/:id/` endpoint
- Displays full product response (name, price, image, stock, discount, rating)

### `/dev/cart-validate` — Cart Validation Tester

- Editable request payload for testing `POST /api/cart/validate/` endpoint
- Input cart items with product IDs and quantities
- Displays price summary response with subtotals, discounts, taxes

### `/dev/order` — Order Creation Tester

- Editable request payload for testing `POST /api/order/` endpoint
- Input order details (items, address, delivery option, coupon)
- Displays order confirmation response with order ID and final total

**How to use the dev zone:**

1. Navigate to `/dev`
2. Click on any endpoint tester
3. Edit the JSON payload in the request editor
4. Click "Test Endpoint" to see the response
5. Review the response data and status

---

## Tests & Storybook

The project includes **Storybook stories** for key components:

- **CartItem** stories (`src/stories/cart-item.stories.ts`) — 5 variants:
  - Default state, low stock warning, out of stock, high quantity, multiple items
- **CartSummary** stories (`src/stories/cart-summary.stories.ts`) — 6 variants:
  - Empty cart, single item, large cart, high price, responsive layouts

- **ProductDetails** stories (`src/stories/product-details.stories.ts`) — 7 variants:
  - Default product, low stock, out of stock, no image, high rating, edge cases

**To run Storybook:**

```powershell
npm run storybook
```

**Unit tests** can be run with:

```powershell
npm test
```

---

## Troubleshooting

- **Cart not persisting?** Check that localStorage is enabled in your browser and that the `CartEffects` are registered in `app.config.ts` via `provideEffects()`.
- **Toast notification not showing?** Ensure `MatSnackBarModule` is imported and that the snackbar styling (::ng-deep CSS) is loaded in `global.css` or component styles.

- **Template compilation errors?** This repo uses Angular standalone components with modern syntax. Ensure all required modules are imported in component `imports` arrays.

- **Material components missing styling?** Verify that Angular Material theme is imported in `main.ts` or `styles.css` (typically a Material prebuilt theme like `@angular/material/prebuilt-themes/indigo-pink.css`).

- **API endpoints not responding?** Check that MSW is enabled in `src/environments/environment.ts` and that handlers are registered in `src/mocks/handlers.ts`.

- **Coupon code not working?** Verify the code matches one of the valid codes: `SAVE10`, `SAVE15`, `SAVE20`, or `WELCOME`. Check the browser console for validation error messages.

- **Dev zone not loading?** Navigate to `/dev` or ensure the dev routes are registered in `app.routes.ts` with proper lazy loading paths.

---

## Architecture Decisions

### Why NgRx?

- **Predictable state management**: All cart, wishlist, and discount changes flow through actions → effects → reducers → selectors
- **Persistence integration**: Effects automatically handle localStorage read/write
- **Developer tools**: NgRx DevTools allow time-travel debugging and state inspection
- **Testing**: Selectors and effects are easily unit testable

### Why CSS Animations over @angular/animations?

- **Reduced bundle size**: No extra animation module dependency
- **Performance**: CSS animations run on GPU and don't block the JavaScript thread
- **Simplicity**: CSS keyframes are easier to understand and modify for common transitions

### Why Standalone Components?

- **Smaller bundle**: No module boilerplate needed
- **Modern Angular**: Aligns with Angular 14+ best practices
- **Flexibility**: Components define their own dependencies via `imports` array
- **Testing**: Easier to test in isolation

### Why Tailwind + Material?

- **Best of both**: Material for complex components (forms, selects, snackbars), Tailwind for layout and utility styling
- **Theme consistency**: Material colors (#0284c7 → #0ea5e9) applied globally
- **Responsiveness**: Tailwind breakpoints for mobile/tablet/desktop layouts

---

## Future Enhancement Ideas

### Animation & UX Enhancements

- [ ] Extend animations to checkout flow page transitions
- [ ] Add cart summary update animations
- [ ] Implement loading state animations (skeleton, spinners)

### Coupon & Discount Enhancements

- [ ] Add coupon expiration dates
- [ ] Implement usage limits per coupon
- [ ] Support minimum purchase amount requirements
- [ ] Add fixed amount discounts (e.g., -€5.00) alongside percentages
- [ ] Create coupon management interface for admins

### Wishlist Enhancements

- [ ] Add "Move to cart" functionality from wishlist
- [ ] Implement wishlist sharing (via email or link)
- [ ] Add email notifications for price drops on wishlist items
- [ ] Create multiple wishlists (favorite collections)
- [ ] Show most popular wishlisted items

### Search & Discovery

- [ ] Add product search with autocomplete
- [ ] Integrate Algolia or Elasticsearch for advanced search
- [ ] Implement product recommendations based on purchase history
- [ ] Add related products section to product details

### Backend & Infrastructure

- [ ] Implement real-time inventory sync with backend WebSocket
- [ ] Add payment integration (Stripe/PayPal)
- [ ] Implement email notifications for order status
- [ ] Create backend REST API to replace mock data
- [ ] Add authentication with JWT tokens

### User Accounts & Admin

- [ ] Implement user account dashboard with order history
- [ ] Add order tracking and status updates
- [ ] Create admin panel for product/order management
- [ ] Add user profile and address book management
- [ ] Implement review ratings system with user reviews

### Testing & Quality

- [ ] Add unit tests for state management (Jasmine/Karma)
- [ ] Implement e2e tests with Cypress or Playwright
- [ ] Add integration tests for checkout flow
- [ ] Set up GitHub Actions for CI/CD pipeline
- [ ] Add performance monitoring and analytics

### Deployment & DevOps

- [ ] Deploy to production (Vercel, Netlify, AWS)
- [ ] Set up automated deployments on push to main
- [ ] Implement monitoring and error tracking (Sentry)
- [ ] Add performance optimization (lazy loading, code splitting)
- [ ] Create staging environment for testing

---

## Contribution & Next steps

- **For UI tweaks**: Edit the standalone component files in `src/app/pages`, `src/app/shop`, and `src/app/components`
- **For state changes**: Update `src/app/state/*` following the pattern:
  1. Define new `Action` in `*.actions.ts`
  2. Handle action in `*.reducer.ts`
  3. (Optional) Create `Effect` in `*.effects.ts` for side effects
  4. Create `Selector` in `*.selectors.ts` to expose state slice
- **For new features**:
  1. Create new state store in `src/app/state/[feature]/` with actions, reducer, effects, selectors
  2. Register effects in `app.config.ts` via `provideEffects()`
  3. Create UI components in `src/app/shop/` or `src/app/pages/`
  4. Add routes to `app.routes.ts`
  5. Add Storybook stories in `src/stories/`

If you'd like, I can:

- Run a build and fix any template/import errors
- Add unit tests for state management logic
- Set up GitHub Actions for CI/CD
- Create a CONTRIBUTING.md with branching/PR workflow

---

## Quick Reference

### Key Selectors (Cart Example)

```typescript
// In a component or effect
cart$: Observable<CartItem[]> = this.store.select(selectCartItems);
count$: Observable<number> = this.store.select(selectCartItemCount);
subtotal$: Observable<number> = this.store.select(selectCartSubtotal);
```

### Dispatching Actions (Cart Example)

```typescript
// Add item to cart
this.store.dispatch(
  CartActions.addToCart({
    product: product,
    quantity: 1,
  }),
);

// Apply coupon
this.store.dispatch(
  DiscountActions.applyCoupon({
    code: 'SAVE10',
  }),
);
```

### Using Selectors (Component Example)

```typescript
export class CartPageComponent {
  items$ = this.store.select(selectCartItems);
  total$ = this.store.select(selectCartSubtotal);
  discount$ = this.store.select(selectAppliedDiscount);

  constructor(private store: Store) {}
}
```

---

## License & Attribution

This project is designed as a learning and evaluation tool. Modify freely for your needs.
