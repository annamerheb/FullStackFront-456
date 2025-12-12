export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface StockInfo {
  status: StockStatus;
  label: string;
  available: number;
}

export function getStockStatus(stock: number, lowStockThreshold: number): StockInfo {
  if (stock === 0) {
    return {
      status: StockStatus.OUT_OF_STOCK,
      label: 'Rupture de stock',
      available: 0,
    };
  }

  if (stock > 0 && stock <= lowStockThreshold) {
    return {
      status: StockStatus.LOW_STOCK,
      label: `Plus que ${stock} en stock`,
      available: stock,
    };
  }

  return {
    status: StockStatus.IN_STOCK,
    label: 'En stock',
    available: stock,
  };
}

export function isInStock(stock: number): boolean {
  return stock > 0;
}
