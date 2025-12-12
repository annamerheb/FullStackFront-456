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
  selectDeliveryState,
  selectSelectedDeliveryOption,
  (state, option) => {
    if (state.isFreeShippingActive) {
      return 0;
    }
    return option?.cost || 0;
  },
);

export const selectDeliveryEstimatedDays = createSelector(
  selectSelectedDeliveryOption,
  (option) => option?.estimatedDays || 0,
);
