import { createReducer, on } from '@ngrx/store';
import * as DeliveryActions from './delivery.actions';
import { DeliveryOption } from './delivery.actions';

export interface DeliveryState {
  options: DeliveryOption[];
  selectedOption: DeliveryOption | null;
}

const initialDeliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    cost: 5.99,
    estimatedDays: 5,
    description: 'Delivery in 5-7 business days',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    cost: 12.99,
    estimatedDays: 2,
    description: 'Delivery in 2-3 business days',
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    cost: 24.99,
    estimatedDays: 1,
    description: 'Next business day delivery',
  },
  {
    id: 'pickup',
    name: 'Store Pickup',
    cost: 0,
    estimatedDays: 0,
    description: 'Free pickup at store',
  },
];

const initialState: DeliveryState = {
  options: initialDeliveryOptions,
  selectedOption: initialDeliveryOptions[0],
};

export const deliveryReducer = createReducer(
  initialState,

  on(DeliveryActions.selectDeliveryOption, (state, { option }) => ({
    ...state,
    selectedOption: option,
  })),

  on(DeliveryActions.setDeliveryOptions, (state, { options }) => ({
    ...state,
    options,
    selectedOption: state.selectedOption || options[0],
  })),
);
