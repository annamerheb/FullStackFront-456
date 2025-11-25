import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeliveryState } from './delivery.reducer';

export const selectDeliveryState = createFeatureSelector<DeliveryState>('delivery');

export const selectAvailableDeliveryOptions = createSelector(
  selectDeliveryState,
  (state: DeliveryState) => state.options,
);

export const selectSelectedDeliveryOption = createSelector(
  selectDeliveryState,
  (state: DeliveryState) => state.selectedOption,
);

export const selectDeliveryOptionCost = createSelector(
  selectSelectedDeliveryOption,
  (option) => option?.cost || 0,
);

export const selectDeliveryEstimatedDays = createSelector(
  selectSelectedDeliveryOption,
  (option) => option?.estimatedDays || 0,
);
