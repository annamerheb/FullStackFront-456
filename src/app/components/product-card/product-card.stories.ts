import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCardComponent, type Product } from './product-card.component';

const meta: Meta<ProductCardComponent> = {
  component: ProductCardComponent,
  title: 'Shop/Product Card',
  argTypes: {
    name: { control: 'text' },
    price: { control: 'number' },
    created_at: { control: 'text' },
    avgRating: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<ProductCardComponent>;

export const Default: Story = {
  args: {
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T00:00:00Z',
    avgRating: 4,
  },
};

export const HighRating: Story = {
  args: {
    name: 'Premium Pen',
    price: 15.99,
    created_at: '2025-01-01T00:00:00Z',
    avgRating: 4.8,
  },
};

export const LowRating: Story = {
  args: {
    name: 'Basic Pencil',
    price: 0.99,
    created_at: '2025-01-20T00:00:00Z',
    avgRating: 2.5,
  },
};

export const ExpensiveProduct: Story = {
  args: {
    name: 'Luxury Fountain Pen',
    price: 125.0,
    created_at: '2024-12-15T00:00:00Z',
    avgRating: 4.9,
  },
};
