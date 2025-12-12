import { createAction, props } from '@ngrx/store';

export interface DeliveryOption {
  id: string;
  name: string;
  cost: number;
  estimatedDays: number;
  description: string;
}

export const selectDeliveryOption = createAction(
  '[Delivery] Select Option',
  props<{ option: DeliveryOption }>(),
);

export const setDeliveryOptions = createAction(
  '[Delivery] Set Options',
  props<{ options: DeliveryOption[] }>(),
);

export const setFreeShipping = createAction('[Delivery] Set Free Shipping');

export const clearFreeShipping = createAction('[Delivery] Clear Free Shipping');
