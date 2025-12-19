import {
  selectOrdersByStatus,
  selectOrderStatistics,
  selectRecentOrders,
  selectHighValueOrders,
  selectOrdersSummaryByDate,
  selectOrderSearchResults,
} from './user.selectors';

/**
 * Unit tests for Order Composed/Memoized Selectors
 * Tests selector logic for order analytics and filtering
 */
describe('Order Composed Selectors', () => {
  const mockOrder1 = {
    id: 'ORD-001',
    orderDate: new Date().toISOString(),
    status: 'shipped' as const,
    totalPrice: 245.75,
    itemCount: 5,
  };

  const mockOrder2 = {
    id: 'ORD-002',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'delivered' as const,
    totalPrice: 89.5,
    itemCount: 2,
  };

  const mockOrder3 = {
    id: 'ORD-003',
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    status: 'pending' as const,
    totalPrice: 520.0,
    itemCount: 8,
  };

  const mockOrder4 = {
    id: 'ORD-004',
    orderDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    status: 'cancelled' as const,
    totalPrice: 150.0,
    itemCount: 3,
  };

  const mockOrder5 = {
    id: 'ORD-005',
    orderDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    status: 'processing' as const,
    totalPrice: 1250.0,
    itemCount: 15,
  };

  describe('selectOrdersByStatus', () => {
    it('should filter orders by shipped status', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersByStatus('shipped');
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-001');
      expect(result[0].status).toBe('shipped');
    });

    it('should filter orders by delivered status', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersByStatus('delivered');
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-002');
      expect(result[0].status).toBe('delivered');
    });

    it('should filter orders by pending status', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersByStatus('pending');
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-003');
      expect(result[0].status).toBe('pending');
    });

    it('should return empty array when no orders match status', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectOrdersByStatus('cancelled');
      const result = selector.projector(orders);

      expect(result.length).toBe(0);
    });

    it('should return empty array for empty orders', () => {
      const selector = selectOrdersByStatus('shipped');
      const result = selector.projector([]);

      expect(result.length).toBe(0);
    });

    it('should filter multiple orders with same status', () => {
      const orders = [
        mockOrder1,
        { ...mockOrder2, status: 'shipped' as const },
        { ...mockOrder3, status: 'shipped' as const },
      ];

      const selector = selectOrdersByStatus('shipped');
      const result = selector.projector(orders);

      expect(result.length).toBe(3);
    });
  });

  describe('selectOrderStatistics', () => {
    it('should calculate total number of orders', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.total).toBe(5);
    });

    it('should calculate total amount spent', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.totalSpent).toBe(855.25); // 245.75 + 89.50 + 520.00
    });

    it('should calculate average order value', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.averageOrderValue).toBeCloseTo(285.08, 1); // 855.25 / 3
    });

    it('should count orders by status', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.byStatus.shipped).toBe(1);
      expect(result.byStatus.delivered).toBe(1);
      expect(result.byStatus.pending).toBe(1);
      expect(result.byStatus.cancelled).toBe(1);
      expect(result.byStatus.processing).toBe(1);
    });

    it('should calculate completed orders', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.completedOrders).toBe(1); // Only delivered
    });

    it('should calculate active orders', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      // pending + processing + shipped = 1 + 1 + 1
      expect(result.activeOrders).toBe(3);
    });

    it('should handle empty orders list', () => {
      const selector = selectOrderStatistics;
      const result = selector.projector([]);

      expect(result.total).toBe(0);
      expect(result.totalSpent).toBe(0);
      expect(result.averageOrderValue).toBe(0);
      expect(result.completedOrders).toBe(0);
      expect(result.activeOrders).toBe(0);
    });

    it('should provide comprehensive statistics in one selector', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3];

      const selector = selectOrderStatistics;
      const result = selector.projector(orders);

      expect(result.total).toBeDefined();
      expect(result.totalSpent).toBeDefined();
      expect(result.averageOrderValue).toBeDefined();
      expect(result.byStatus).toBeDefined();
      expect(result.completedOrders).toBeDefined();
      expect(result.activeOrders).toBeDefined();
    });
  });

  describe('selectRecentOrders', () => {
    it('should return most recent 5 orders by default', () => {
      const orders = [mockOrder5, mockOrder4, mockOrder3, mockOrder2, mockOrder1];

      const selector = selectRecentOrders();
      const result = selector.projector(orders);

      expect(result.length).toBe(5);
      expect(result[0].id).toBe('ORD-001'); // Most recent
    });

    it('should respect custom limit parameter', () => {
      const orders = [mockOrder5, mockOrder4, mockOrder3, mockOrder2, mockOrder1];

      const selector = selectRecentOrders(3);
      const result = selector.projector(orders);

      expect(result.length).toBe(3);
    });

    it('should sort orders by date in descending order', () => {
      const orders = [mockOrder1, mockOrder5, mockOrder2, mockOrder3, mockOrder4];

      const selector = selectRecentOrders(5);
      const result = selector.projector(orders);

      // Check that first is most recent (mockOrder1 - today)
      expect(result[0].id).toBe('ORD-001');
      // Check that last is oldest (mockOrder5 - 60 days ago)
      expect(result[result.length - 1].id).toBe('ORD-005');
    });

    it('should handle limit larger than order count', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectRecentOrders(10);
      const result = selector.projector(orders);

      expect(result.length).toBe(2);
    });

    it('should return empty array for empty orders', () => {
      const selector = selectRecentOrders(5);
      const result = selector.projector([]);

      expect(result.length).toBe(0);
    });

    it('should limit to 1 order', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3];

      const selector = selectRecentOrders(1);
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-001');
    });
  });

  describe('selectHighValueOrders', () => {
    it('should filter orders above default threshold (500)', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectHighValueOrders();
      const result = selector.projector(orders);

      expect(result.length).toBe(2);
      expect(result.find((o) => o.id === mockOrder3.id)).toBeTruthy(); // 520.00
      expect(result.find((o) => o.id === mockOrder5.id)).toBeTruthy(); // 1250.00
    });

    it('should filter orders above custom threshold', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectHighValueOrders(200);
      const result = selector.projector(orders);

      // Orders >= 200: mockOrder1 (245.75), mockOrder3 (520), mockOrder5 (1250) = 3 orders
      expect(result.length).toBe(3);
      expect(result.find((o) => o.id === mockOrder2.id)).toBeFalsy(); // 89.50 < 200
      expect(result.find((o) => o.id === mockOrder4.id)).toBeFalsy(); // 150.00 < 200
    });

    it('should return empty array when no orders above threshold', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectHighValueOrders(1000);
      const result = selector.projector(orders);

      expect(result.length).toBe(0);
    });

    it('should include orders equal to threshold', () => {
      const orders = [mockOrder1, { ...mockOrder3, totalPrice: 500 }];

      const selector = selectHighValueOrders(500);
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].totalPrice).toBe(500);
    });

    it('should handle zero threshold', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectHighValueOrders(0);
      const result = selector.projector(orders);

      expect(result.length).toBe(2);
    });
  });

  describe('selectOrdersSummaryByDate', () => {
    it('should group orders by date range', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersSummaryByDate;
      const result = selector.projector(orders);

      expect(result.today).toBeDefined();
      expect(result.thisWeek).toBeDefined();
      expect(result.thisMonth).toBeDefined();
      expect(result.older).toBeDefined();
    });

    it("should include today's orders in today category", () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3];

      const selector = selectOrdersSummaryByDate;
      const result = selector.projector(orders);

      expect(result.today.length).toBeGreaterThan(0);
    });

    it('should separate recent from older orders', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersSummaryByDate;
      const result = selector.projector(orders);

      expect(result.today.length).toBeGreaterThan(0);
      expect(result.older.length).toBeGreaterThan(0);
    });

    it('should provide topOrder with highest value', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrdersSummaryByDate;
      const result = selector.projector(orders);

      expect(result.topOrder.id).toBe('ORD-005'); // 1250.00
      expect(result.topOrder.totalPrice).toBe(1250.0);
    });

    it('should return empty arrays for each period if no orders', () => {
      const selector = selectOrdersSummaryByDate;
      const result = selector.projector([]);

      expect(result.today.length).toBe(0);
      expect(result.thisWeek.length).toBe(0);
      expect(result.thisMonth.length).toBe(0);
      expect(result.older.length).toBe(0);
    });
  });

  describe('selectOrderSearchResults', () => {
    it('should return all orders when no filters applied', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults();
      const result = selector.projector(orders);

      expect(result.length).toBe(5);
    });

    it('should filter by status', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({ status: 'shipped' });
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-001');
    });

    it('should filter by minimum price', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({ minPrice: 300 });
      const result = selector.projector(orders);

      expect(result.length).toBe(2); // ORD-003 (520) and ORD-005 (1250)
    });

    it('should filter by maximum price', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({ maxPrice: 300 });
      const result = selector.projector(orders);

      expect(result.length).toBe(3); // ORD-001, ORD-002, ORD-004
    });

    it('should combine status and price filters', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({
        status: 'pending',
        minPrice: 100,
      });
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-003');
    });

    it('should filter by search term (order ID)', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({ searchTerm: 'ORD-00' });
      const result = selector.projector(orders);

      expect(result.length).toBe(5); // All match
    });

    it('should filter by specific order ID', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({ searchTerm: 'ORD-003' });
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-003');
    });

    it('should be case-insensitive in search term', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectOrderSearchResults({ searchTerm: 'ord-001' });
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-001');
    });

    it('should return empty array when filters match nothing', () => {
      const orders = [mockOrder1, mockOrder2];

      const selector = selectOrderSearchResults({
        status: 'shipped',
        minPrice: 1000,
      });
      const result = selector.projector(orders);

      expect(result.length).toBe(0);
    });

    it('should handle price range that spans all orders', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({
        minPrice: 0,
        maxPrice: 10000,
      });
      const result = selector.projector(orders);

      expect(result.length).toBe(5);
    });

    it('should apply multiple filters simultaneously', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({
        status: 'pending',
        minPrice: 400,
        maxPrice: 600,
        searchTerm: 'ORD-003',
      });
      const result = selector.projector(orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ORD-003');
    });
  });

  describe('Selector Memoization', () => {
    it('selectOrderStatistics should combine multiple inputs efficiently', () => {
      const selector = selectOrderStatistics;

      // Verify selector has a projector function (indicates it's a memoized selector)
      expect(typeof selector.projector).toBe('function');
    });

    it('selectOrdersByStatus should be parametrized', () => {
      const selector1 = selectOrdersByStatus('shipped');
      const selector2 = selectOrdersByStatus('delivered');

      expect(selector1).not.toBe(selector2);
    });

    it('selectRecentOrders should accept custom limit parameter', () => {
      const selector1 = selectRecentOrders(5);
      const selector2 = selectRecentOrders(10);

      expect(selector1).not.toBe(selector2);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle large order history', () => {
      const largeOrderList = Array.from({ length: 100 }, (_, i) => ({
        id: `ORD-${String(i).padStart(3, '0')}`,
        orderDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5] as any,
        totalPrice: Math.random() * 2000,
        itemCount: Math.floor(Math.random() * 20) + 1,
      }));

      const selector = selectOrderStatistics;
      const result = selector.projector(largeOrderList);

      expect(result.total).toBe(100);
      expect(result.totalSpent).toBeGreaterThan(0);
    });

    it('should handle orders with identical values', () => {
      const orders = [
        { ...mockOrder1, totalPrice: 100 },
        { ...mockOrder2, totalPrice: 100 },
        { ...mockOrder3, totalPrice: 100 },
      ];

      const selector = selectHighValueOrders(100);
      const result = selector.projector(orders);

      expect(result.length).toBe(3);
    });

    it('should maintain order in search results', () => {
      const orders = [mockOrder1, mockOrder2, mockOrder3, mockOrder4, mockOrder5];

      const selector = selectOrderSearchResults({
        minPrice: 100,
        maxPrice: 600,
      });
      const result = selector.projector(orders);

      // Results should maintain original order
      expect(result[0]).toEqual(mockOrder1);
    });
  });
});
