/**
 * UX Improvements Configuration
 *
 * This file centralizes all configuration for the UX improvements
 * in the catalog module. Adjust these values based on your requirements.
 */

/**
 * DEBOUNCE SETTINGS
 * Controls how quickly the API is called after filter changes
 */
export const FILTER_DEBOUNCE_MS = 500; // milliseconds
// Guidelines:
// - 300ms: Very responsive, more API calls
// - 500ms: Balanced (recommended)
// - 1000ms: More conservative, fewer API calls but slower feedback

/**
 * API RESPONSE CACHING
 * Controls cache validity for the "stale-while-revalidate" pattern
 */
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
// Guidelines:
// - 1 min: Fresh data, more API calls
// - 5 min: Balanced (recommended)
// - 10 min: Less fresh data, fewer API calls

/**
 * PAGINATION DEFAULTS
 */
export const DEFAULT_PAGE_SIZE = 8;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

/**
 * FILTER DEFAULTS
 */
export const DEFAULT_MIN_RATING = 0;
export const DEFAULT_ORDERING = ''; // '' for default, or 'price', '-price', 'name', 'rating', etc.

/**
 * URL QUERY PARAM NAMES
 * Change these if your backend expects different names
 */
export const QUERY_PARAMS = {
  pageSize: 'pageSize', // Could be 'page_size' or 'pageSize'
  minRating: 'minRating', // Could be 'min_rating' or 'minRating'
  ordering: 'ordering', // Could be 'sort' or 'ordering'
  page: 'page', // Could be 'p' or 'page'
} as const;

/**
 * LOADING & SKELETON SETTINGS
 */
export const SKELETON_LOADER_COUNT = 12; // Number of skeleton cards to show
export const SKELETON_LOADER_TYPE = 'card'; // 'card', 'text', or 'table'

/**
 * ERROR HANDLING
 */
export const RETRY_DELAY_MS = 0; // Immediate retry (0ms) or delay with backoff
export const MAX_RETRIES = 3; // Maximum number of retry attempts

/**
 * ANALYTICS & TRACKING (Optional)
 */
export const TRACK_FILTER_CHANGES = false; // Enable to track filter analytics
export const TRACK_API_CALLS = false; // Enable to track API performance

/**
 * UI MESSAGES (Internationalization ready)
 */
export const MESSAGES = {
  empty: {
    title: 'No products match your filters',
    description:
      'Try adjusting your filters, reducing the minimum rating, or resetting the search.',
    resetButton: 'Reset Filters',
  },
  error: {
    default: 'Failed to load products. Please try again.',
    network: 'Network error. Check your connection and try again.',
    server: 'Server error. Please try again later.',
    retryButton: 'Retry',
  },
  loading: {
    skeleton: 'Loading products...',
  },
} as const;

/**
 * FEATURE FLAGS (Toggle features on/off)
 */
export const FEATURES = {
  enableUrlSync: true, // Sync filters to URL
  enableDebounce: true, // Debounce filter changes
  enableUrlRestore: true, // Restore filters from URL on navigation
  enableSkeletonLoader: true, // Show skeleton loaders
  enableRetryButton: true, // Show retry button on error
  enableResetButton: true, // Show reset button in empty state
  enableCaching: true, // Use "stale-while-revalidate" pattern
} as const;

/**
 * MOBILE SETTINGS
 */
export const MOBILE = {
  breakpoint: 768, // pixels (Bootstrap default)
  hideFiltersOnMobile: false, // Set true to hide filters sidebar on mobile
} as const;

/**
 * PERFORMANCE OPTIMIZATION
 */
export const PERFORMANCE = {
  enableTrackBy: true, // Use trackBy functions for *ngFor
  enableChangeDetectionPush: true, // Use OnPush change detection strategy
  enableLazyLoading: true, // Lazy load product images
} as const;

/**
 * ACCESSIBILITY
 */
export const ACCESSIBILITY = {
  enableAriaLabels: true,
  enableKeyboardNavigation: true,
  enableScreenReaderAnnouncements: true,
} as const;

/**
 * EXAMPLE USAGE
 *
 * In your component:
 *
 * import { FILTER_DEBOUNCE_MS, MESSAGES, FEATURES } from './config';
 *
 * // Use debounce setting
 * this.filterForm.valueChanges
 *   .pipe(
 *     debounceTime(FILTER_DEBOUNCE_MS),
 *     // ...
 *   )
 *
 * // Use feature flag
 * if (FEATURES.enableUrlSync) {
 *   this.syncFiltersToUrl();
 * }
 *
 * // Use message
 * const message = MESSAGES.empty.title;  // "No products match your filters"
 */
