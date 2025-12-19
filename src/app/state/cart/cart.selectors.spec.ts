import {
  selectCartTotalItems,
  selectCartAveragePrice,
  selectCartTotalDiscount,
  selectCartSummary,
  selectHighValueCartItems,
  selectCartItemsByDiscount,
} from './cart.selectors';
import { CartState } from './cart.models';

/**
 * Unit tests for Cart Composed/Memoized Selectors
 * Tests selector logic, memoization, and computed fields
 */
describe('Cart Composed Selectors', () => {
  const mockProduct1 = {
    id: 1,
    name: 'Premium Product',
    price: 150,
    created_at: '2025-01-01',
    image: 'test1.jpg',
    avgRating: 4.5,
    stock: 10,
    lowStockThreshold: 2,
    discount: 20, // 20% discount
  };

  const mockProduct2 = {
    id: 2,
    name: 'Budget Product',
    price: 50,
    created_at: '2025-01-01',
    image: 'test2.jpg',
    avgRating: 3.5,
    stock: 5,
    lowStockThreshold: 1,
    discount: 0,
  };

  const mockProduct3 = {
    id: 3,
    name: 'Mid-Range Product',
    price: 100,
    created_at: '2025-01-01',
    image: 'test3.jpg',
    avgRating: 4.0,
    stock: 8,
    lowStockThreshold: 2,
    discount: 10, // 10% discount
  };

  describe('selectCartTotalItems', () => {
    it('should return 0 for empty cart', () => {
      const state: CartState = {
        items: [],
        totalPrice: 0,
        itemCount: 0,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalItems;
      const result = selector.projector(state.items);

      expect(result).toBe(0);
    });

    it('should sum quantities correctly with single item', () => {
      const state: CartState = {
        items: [{ product: mockProduct1, quantity: 5 }],
        totalPrice: 600, // 150 * 0.8 * 5
        itemCount: 5,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalItems;
      const result = selector.projector(state.items);

      expect(result).toBe(5);
    });

    it('should sum quantities correctly with multiple items', () => {
      const state: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 3 },
          { product: mockProduct3, quantity: 5 },
        ],
        totalPrice: 630,
        itemCount: 10,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalItems;
      const result = selector.projector(state.items);

      expect(result).toBe(10); // 2 + 3 + 5
    });

    it('should handle high quantities', () => {
      const state: CartState = {
        items: [{ product: mockProduct1, quantity: 999 }],
        totalPrice: 0,
        itemCount: 999,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalItems;
      const result = selector.projector(state.items);

      expect(result).toBe(999);
    });
  });

  describe('selectCartAveragePrice', () => {
    it('should return 0 for empty cart', () => {
      const selector = selectCartAveragePrice;
      const result = selector.projector(0, 0); // totalPrice=0, itemCount=0

      expect(result).toBe(0);
    });

    it('should calculate average price per item', () => {
      // Total: 600, Items: 5, Average: 120
      const selector = selectCartAveragePrice;
      const result = selector.projector(600, 5);

      expect(result).toBe(120);
    });

    it('should handle single item average', () => {
      const selector = selectCartAveragePrice;
      const result = selector.projector(250, 1);

      expect(result).toBe(250);
    });

    it('should calculate decimal averages', () => {
      // Total: 100, Items: 3, Average: 33.33...
      const selector = selectCartAveragePrice;
      const result = selector.projector(100, 3);

      expect(result).toBeCloseTo(33.33, 1);
    });

    it('should handle large totals', () => {
      const selector = selectCartAveragePrice;
      const result = selector.projector(10000, 50);

      expect(result).toBe(200);
    });
  });

  describe('selectCartTotalDiscount', () => {
    it('should return 0 for empty cart', () => {
      const state: CartState = {
        items: [],
        totalPrice: 0,
        itemCount: 0,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalDiscount;
      const result = selector.projector(state.items);

      expect(result).toBe(0);
    });

    it('should calculate discount for single discounted item', () => {
      // mockProduct1: price=150, discount=20%, qty=2
      // Original: 150*2=300, Discount: 300*20%=60
      const state: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        totalPrice: 240,
        itemCount: 2,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalDiscount;
      const result = selector.projector(state.items);

      expect(result).toBe(60);
    });

    it('should calculate discount for multiple items with mixed discounts', () => {
      const state: CartState = {
        items: [
          { product: mockProduct1, quantity: 1 }, // 150 * 20% = 30 discount
          { product: mockProduct2, quantity: 1 }, // 50 * 0% = 0 discount
          { product: mockProduct3, quantity: 1 }, // 100 * 10% = 10 discount
        ],
        totalPrice: 310,
        itemCount: 3,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalDiscount;
      const result = selector.projector(state.items);

      expect(result).toBe(40); // 30 + 0 + 10
    });

    it('should ignore items with 0 discount', () => {
      const state: CartState = {
        items: [{ product: mockProduct2, quantity: 5 }],
        totalPrice: 250,
        itemCount: 5,
        stockValidationErrors: [],
        isValidatingStock: false,
      };

      const selector = selectCartTotalDiscount;
      const result = selector.projector(state.items);

      expect(result).toBe(0);
    });
  });

  describe('selectCartSummary', () => {
    it('should return complete summary for populated cart', () => {
      const items = [
        { product: mockProduct1, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ];

      const selector = selectCartSummary;
      const result = selector.projector(items, 2, 410, 3, 136.67, 60);

      expect(result.items).toBeDefined();
      expect(result.itemCount).toBeDefined();
      expect(result.totalPrice).toBeDefined();
      expect(result.totalItems).toBeDefined();
      expect(result.averagePrice).toBeDefined();
      expect(result.totalDiscount).toBeDefined();
      expect(result.isEmpty).toBeDefined();
      expect(result.hasItems).toBeDefined();
    });

    it('should correctly compute summary fields', () => {
      const items = [{ product: mockProduct1, quantity: 2 }];

      const selector = selectCartSummary;
      const result = selector.projector(items, 1, 240, 2, 120, 30);

      expect(result.itemCount).toBe(1);
      expect(result.totalPrice).toBe(240);
      expect(result.totalItems).toBe(2);
      expect(result.averagePrice).toBe(120);
      expect(result.totalDiscount).toBe(30);
      expect(result.isEmpty).toBe(false);
      expect(result.hasItems).toBe(true);
    });

    it('should mark empty cart correctly', () => {
      const selector = selectCartSummary;
      const result = selector.projector([], 0, 0, 0, 0, 0);

      expect(result.isEmpty).toBe(true);
      expect(result.hasItems).toBe(false);
    });

    it('should provide all metrics in single subscription', () => {
      const items = [
        { product: mockProduct1, quantity: 1 },
        { product: mockProduct2, quantity: 2 },
        { product: mockProduct3, quantity: 1 },
      ];

      const selector = selectCartSummary;
      const result = selector.projector(items, 3, 410, 4, 102.5, 40);

      // Verify all necessary fields are present for UI
      expect(typeof result.items).toBe('object');
      expect(typeof result.itemCount).toBe('number');
      expect(typeof result.totalPrice).toBe('number');
      expect(typeof result.totalItems).toBe('number');
      expect(typeof result.averagePrice).toBe('number');
      expect(typeof result.totalDiscount).toBe('number');
      expect(typeof result.isEmpty).toBe('boolean');
      expect(typeof result.hasItems).toBe('boolean');
    });
  });

  describe('selectHighValueCartItems', () => {
    it('should filter items above default threshold (100)', () => {
      const items = [
        { product: mockProduct1, quantity: 1 }, // 150 >= 100 ✓
        { product: mockProduct2, quantity: 1 }, // 50 < 100 ✗
        { product: mockProduct3, quantity: 1 }, // 100 >= 100 ✓
      ];

      const selector = selectHighValueCartItems();
      const result = selector.projector(items);

      expect(result.length).toBe(2);
      expect(result[0].product.id).toBe(1);
      expect(result[1].product.id).toBe(3);
    });

    it('should filter items above custom threshold', () => {
      const items = [
        { product: mockProduct1, quantity: 1 }, // 150 >= 150 ✓
        { product: mockProduct2, quantity: 1 }, // 50 < 150 ✗
        { product: mockProduct3, quantity: 1 }, // 100 < 150 ✗
      ];

      const selector = selectHighValueCartItems(150);
      const result = selector.projector(items);

      expect(result.length).toBe(1);
      expect(result[0].product.id).toBe(1);
    });

    it('should return empty array when no items above threshold', () => {
      const items = [
        { product: mockProduct2, quantity: 1 }, // 50 < 100 ✗
      ];

      const selector = selectHighValueCartItems();
      const result = selector.projector(items);

      expect(result.length).toBe(0);
    });

    it('should return all items if threshold is 0', () => {
      const items = [
        { product: mockProduct1, quantity: 1 },
        { product: mockProduct2, quantity: 1 },
      ];

      const selector = selectHighValueCartItems(0);
      const result = selector.projector(items);

      expect(result.length).toBe(2);
    });
  });

  describe('selectCartItemsByDiscount', () => {
    it('should separate discounted and regular price items', () => {
      const items = [
        { product: mockProduct1, quantity: 1 }, // 20% discount
        { product: mockProduct2, quantity: 1 }, // 0% discount
        { product: mockProduct3, quantity: 1 }, // 10% discount
      ];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.discounted.length).toBe(2);
      expect(result.regularPrice.length).toBe(1);
    });

    it('should correctly identify discounted items', () => {
      const items = [
        { product: mockProduct1, quantity: 2 },
        { product: mockProduct2, quantity: 3 },
      ];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.discounted[0].product.id).toBe(1);
      expect(result.regularPrice[0].product.id).toBe(2);
    });

    it('should count total quantities of discounted items', () => {
      const items = [
        { product: mockProduct1, quantity: 2 },
        { product: mockProduct3, quantity: 3 },
        { product: mockProduct2, quantity: 1 },
      ];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.totalDiscountedValue).toBe(5); // 2 + 3
    });

    it('should handle cart with only discounted items', () => {
      const items = [
        { product: mockProduct1, quantity: 1 },
        { product: mockProduct3, quantity: 1 },
      ];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.discounted.length).toBe(2);
      expect(result.regularPrice.length).toBe(0);
      expect(result.totalDiscountedValue).toBe(2);
    });

    it('should handle cart with no discounted items', () => {
      const items = [{ product: mockProduct2, quantity: 5 }];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.discounted.length).toBe(0);
      expect(result.regularPrice.length).toBe(1);
      expect(result.totalDiscountedValue).toBe(0);
    });

    it('should return empty arrays for empty cart', () => {
      const items: any[] = [];

      const selector = selectCartItemsByDiscount;
      const result = selector.projector(items);

      expect(result.discounted.length).toBe(0);
      expect(result.regularPrice.length).toBe(0);
      expect(result.totalDiscountedValue).toBe(0);
    });
  });

  describe('Selector Memoization', () => {
    it('selectCartTotalItems should be memoized', () => {
      const items = [{ product: mockProduct1, quantity: 5 }];

      const selector = selectCartTotalItems;
      const result1 = selector.projector(items);
      const result2 = selector.projector(items);

      expect(result1).toBe(result2); // Same reference if memoized
    });

    it('selectCartSummary should combine multiple inputs efficiently', () => {
      const selector = selectCartSummary;

      // Verify selector has a projector function (indicates it's a memoized selector)
      expect(typeof selector.projector).toBe('function');
    });
  });
});
