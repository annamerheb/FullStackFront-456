export interface TopProduct {
  productId: string;
  name: string;
  sold: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  user: string;
  total: number;
  createdAt: string;
  status: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export interface AdminState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

export const initialAdminState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};
