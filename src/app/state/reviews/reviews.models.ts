export interface Review {
  id: number;
  productId: number;
  user: string;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsState {
  byProductId: { [productId: number]: Review[] };
  loading: boolean;
  error: string | null;
}

export const initialReviewsState: ReviewsState = {
  byProductId: {},
  loading: false,
  error: null,
};
