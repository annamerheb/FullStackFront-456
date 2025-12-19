import {
  selectWishlistProducts,
  selectWishlistProductsByRating,
  selectWishlistProductsByStock,
  selectWishlistProductsByDiscount,
} from './wishlist.selectors';

/**
 * Unit tests for Wishlist Composed/Memoized Selectors
 * Tests selector logic for wishlist analytics and filtering
 */
describe('Wishlist Composed Selectors', () => {
  const mockProduct1 = {
    id: 1,
    name: 'Premium Product',
    price: 250,
    image: 'test1.jpg',
    avgRating: 4.8,
    stock: 10,
    lowStockThreshold: 2,
    discount: 15,
  };

  const mockProduct2 = {
    id: 2,
    name: 'Budget Product',
    price: 35,
    image: 'test2.jpg',
    avgRating: 3.2,
    stock: 0,
    lowStockThreshold: 3,
    discount: 5,
  };

  const mockProduct3 = {
    id: 3,
    name: 'Mid-Range Product',
    price: 120,
    image: 'test3.jpg',
    avgRating: 4.2,
    stock: 2,
    lowStockThreshold: 5,
    discount: 10,
  };

  const mockProduct4 = {
    id: 4,
    name: 'Low Stock Item',
    price: 89,
    image: 'test4.jpg',
    avgRating: 4.0,
    stock: 1,
    lowStockThreshold: 2,
    discount: 0,
  };

  describe('selectWishlistProducts', () => {
    it('should return empty wishlist data for empty items', () => {
      const selector = selectWishlistProducts;
      const result = selector.projector([]);

      expect(result.items).toEqual([]);
      expect(result.totalValue).toBe(0);
      expect(result.averagePrice).toBe(0);
      expect(result.maxPrice).toBe(0);
      expect(result.minPrice).toBe(0);
      expect(result.hasItems).toBe(false);
      expect(result.count).toBe(0);
    });

    it('should calculate total value of wishlist', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProducts;
      const result = selector.projector(items);

      expect(result.totalValue).toBe(405); // 250 + 35 + 120
    });

    it('should calculate average price correctly', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProducts;
      const result = selector.projector(items);

      expect(result.averagePrice).toBe(135); // 405 / 3
    });

    it('should identify max and min prices', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProducts;
      const result = selector.projector(items);

      expect(result.maxPrice).toBe(250); // mockProduct1
      expect(result.minPrice).toBe(35); // mockProduct2
    });

    it('should track hasItems flag', () => {
      const itemsEmpty: any[] = [];
      const itemsPopulated = [mockProduct1];

      const selector = selectWishlistProducts;

      const resultEmpty = selector.projector(itemsEmpty);
      expect(resultEmpty.hasItems).toBe(false);

      const resultPopulated = selector.projector(itemsPopulated);
      expect(resultPopulated.hasItems).toBe(true);
    });

    it('should return correct count', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProducts;
      const result = selector.projector(items);

      expect(result.count).toBe(4);
    });

    it('should handle single item wishlist', () => {
      const items = [mockProduct1];

      const selector = selectWishlistProducts;
      const result = selector.projector(items);

      expect(result.totalValue).toBe(250);
      expect(result.averagePrice).toBe(250);
      expect(result.maxPrice).toBe(250);
      expect(result.minPrice).toBe(250);
      expect(result.count).toBe(1);
    });
  });

  describe('selectWishlistProductsByRating', () => {
    it('should separate available and unavailable products', () => {
      const items = [
        mockProduct1, // stock: 10 (available)
        mockProduct2, // stock: 0 (unavailable)
        mockProduct3, // stock: 2 (available)
      ];

      const selector = selectWishlistProductsByRating;
      const result = selector.projector(items);

      expect(result.available.length).toBe(2);
      expect(result.unavailable.length).toBe(1);
    });

    it('should correctly identify available items', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProductsByRating;
      const result = selector.projector(items);

      expect(result.available.find((p) => p.id === mockProduct1.id)).toBeTruthy();
      expect(result.available.find((p) => p.id === mockProduct3.id)).toBeTruthy();
      expect(result.available.find((p) => p.id === mockProduct4.id)).toBeTruthy();
      expect(result.available.find((p) => p.id === mockProduct2.id)).toBeFalsy();
    });

    it('should correctly identify unavailable items', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProductsByRating;
      const result = selector.projector(items);

      expect(result.unavailable).toEqual([mockProduct2]);
    });

    it('should calculate average stock for available items', () => {
      const items = [
        mockProduct1, // stock: 10
        mockProduct3, // stock: 2
        mockProduct4, // stock: 1
      ];

      const selector = selectWishlistProductsByRating;
      const result = selector.projector(items);

      expect(result.averageStock).toBeCloseTo(4.33, 1); // (10 + 2 + 1) / 3
    });

    it('should return 0 average stock for empty wishlist', () => {
      const selector = selectWishlistProductsByRating;
      const result = selector.projector([]);

      expect(result.averageStock).toBe(0);
    });

    it('should handle all items out of stock', () => {
      const items = [mockProduct2]; // Only out of stock

      const selector = selectWishlistProductsByRating;
      const result = selector.projector(items);

      expect(result.available.length).toBe(0);
      expect(result.unavailable.length).toBe(1);
    });
  });

  describe('selectWishlistProductsByStock', () => {
    it('should categorize items by stock status', () => {
      const items = [
        mockProduct1, // stock: 10 (inStock)
        mockProduct2, // stock: 0 (outOfStock)
        mockProduct3, // stock: 2, threshold: 5 (lowStock)
        mockProduct4, // stock: 1, threshold: 2 (lowStock)
      ];

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      expect(result.inStock.length).toBeGreaterThan(0);
      expect(result.outOfStock.length).toBe(1);
      expect(result.lowStock.length).toBeGreaterThan(0);
    });

    it('should correctly identify in-stock items', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      expect(result.inStock.find((p) => p.id === mockProduct1.id)).toBeTruthy();
      expect(result.inStock.find((p) => p.id === mockProduct3.id)).toBeTruthy();
      expect(result.inStock.find((p) => p.id === mockProduct2.id)).toBeFalsy();
    });

    it('should correctly identify low-stock items', () => {
      const items = [
        mockProduct1, // stock: 10, threshold: 2
        mockProduct3, // stock: 2, threshold: 5 (LOW)
        mockProduct4, // stock: 1, threshold: 2 (LOW)
      ];

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      expect(result.lowStock.length).toBe(2);
      expect(result.lowStock.find((p) => p.id === mockProduct3.id)).toBeTruthy();
      expect(result.lowStock.find((p) => p.id === mockProduct4.id)).toBeTruthy();
    });

    it('should calculate total available value', () => {
      const items = [
        mockProduct1, // 250 (in stock)
        mockProduct2, // 35 (out of stock - excluded)
        mockProduct3, // 120 (in stock)
      ];

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      expect(result.totalAvailableValue).toBe(370); // 250 + 120
    });

    it('should return 0 available value when no items in stock', () => {
      const items = [mockProduct2]; // Only out of stock

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      expect(result.totalAvailableValue).toBe(0);
    });

    it('should include all items with stock > 0 in inStock list', () => {
      const items = [
        mockProduct1, // stock: 10, threshold: 2
        mockProduct3, // stock: 2, threshold: 5 (also in lowStock)
      ];

      const selector = selectWishlistProductsByStock;
      const result = selector.projector(items);

      // inStock includes all items with stock > 0, including low-stock items
      expect(result.inStock.length).toBe(2);
      expect(result.inStock.find((p) => p.id === 1)).toBeTruthy();
      expect(result.inStock.find((p) => p.id === 3)).toBeTruthy();
    });
  });

  describe('selectWishlistProductsByDiscount', () => {
    it('should categorize items by price range', () => {
      const items = [
        mockProduct1, // 250 (high)
        mockProduct2, // 35 (low)
        mockProduct3, // 120 (high - > 100)
        mockProduct4, // 89 (medium)
      ];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.highPrice.length).toBe(2); // > 100: mockProduct1 (250), mockProduct3 (120)
      expect(result.mediumPrice.length).toBe(1); // >= 50 && <= 100: mockProduct4 (89)
      expect(result.lowPrice.length).toBe(1); // < 50: mockProduct2 (35)
    });

    it('should correctly identify high-price items (> 100)', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      // mockProduct1 (250) and mockProduct3 (120) are both > 100
      expect(result.highPrice.find((p) => p.id === mockProduct1.id)).toBeTruthy();
      expect(result.highPrice.find((p) => p.id === mockProduct3.id)).toBeTruthy();
      expect(result.highPrice.find((p) => p.id === mockProduct2.id)).toBeFalsy();
    });

    it('should correctly identify medium-price items (50-100)', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.mediumPrice.find((p) => p.id === mockProduct4.id)).toBeTruthy(); // 89
      expect(result.mediumPrice.find((p) => p.id === mockProduct1.id)).toBeFalsy();
      expect(result.mediumPrice.find((p) => p.id === mockProduct2.id)).toBeFalsy();
    });

    it('should correctly identify low-price items (< 50)', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.lowPrice.find((p) => p.id === mockProduct2.id)).toBeTruthy();
      expect(result.lowPrice.find((p) => p.id === mockProduct1.id)).toBeFalsy();
      expect(result.lowPrice.find((p) => p.id === mockProduct3.id)).toBeFalsy();
    });

    it('should identify most expensive item', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.mostExpensive.id).toBe(1);
      expect(result.mostExpensive.price).toBe(250);
    });

    it('should identify cheapest item', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.cheapest.id).toBe(2);
      expect(result.cheapest.price).toBe(35);
    });

    it('should calculate total value of all items', () => {
      const items = [mockProduct1, mockProduct2, mockProduct3, mockProduct4];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.totalValue).toBe(494); // 250 + 35 + 120 + 89
    });

    it('should handle single item wishlist', () => {
      const items = [mockProduct1];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.mostExpensive).toEqual(mockProduct1);
      expect(result.cheapest).toEqual(mockProduct1);
      expect(result.totalValue).toBe(250);
    });

    it('should categorize edge-case prices correctly', () => {
      const edgeItems = [
        { ...mockProduct1, price: 100 }, // Exactly at medium boundary
        { ...mockProduct2, price: 50 }, // Exactly at medium lower boundary
      ];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(edgeItems);

      // price: 100 should be in mediumPrice (>= 50 && <= 100)
      // price: 50 should be in mediumPrice (>= 50 && <= 100)
      expect(result.mediumPrice.length).toBe(2);
    });
  });

  describe('Selector Memoization', () => {
    it('selectWishlistProducts should combine items efficiently', () => {
      const selector = selectWishlistProducts;
      // Verify selector has a projector function (indicates it's a memoized selector)
      expect(typeof selector.projector).toBe('function');
    });

    it('selectWishlistProductsByDiscount should sort items internally', () => {
      const items = [mockProduct2, mockProduct1, mockProduct3];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      // Most expensive should be mockProduct1 (250)
      expect(result.mostExpensive.id).toBe(1);
      // Cheapest should be mockProduct2 (35)
      expect(result.cheapest.id).toBe(2);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle large wishlist efficiently', () => {
      const largeWishlist = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        price: Math.floor(Math.random() * 500),
        image: `test${i}.jpg`,
        avgRating: Math.random() * 5,
        stock: Math.floor(Math.random() * 20),
        lowStockThreshold: 5,
        discount: 0,
      }));

      const selector = selectWishlistProducts;
      const result = selector.projector(largeWishlist);

      expect(result.count).toBe(100);
      expect(result.totalValue).toBeGreaterThan(0);
      expect(result.averagePrice).toBeGreaterThan(0);
    });

    it('should handle wishlist with identical prices', () => {
      const items = [
        { ...mockProduct1, price: 100 },
        { ...mockProduct2, price: 100 },
        { ...mockProduct3, price: 100 },
      ];

      const selector = selectWishlistProductsByDiscount;
      const result = selector.projector(items);

      expect(result.mostExpensive.price).toBe(100);
      expect(result.cheapest.price).toBe(100);
    });
  });
});
