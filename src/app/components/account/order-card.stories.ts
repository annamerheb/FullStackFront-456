import type { Meta, StoryObj } from '@storybook/angular';
import { OrderCardComponent } from './order-card.component';

const meta: Meta<OrderCardComponent> = {
  component: OrderCardComponent,
  title: 'Account/Order Card',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OrderCardComponent>;

export const Pending: Story = {
  args: {
    order: {
      id: 'ORD-001',
      orderDate: '2025-12-10T10:30:00Z',
      status: 'pending',
      totalPrice: 125.99,
      itemCount: 3,
    },
  },
};

export const Processing: Story = {
  args: {
    order: {
      id: 'ORD-002',
      orderDate: '2025-12-09T14:15:00Z',
      status: 'processing',
      totalPrice: 89.5,
      itemCount: 2,
    },
  },
};

export const Shipped: Story = {
  args: {
    order: {
      id: 'ORD-003',
      orderDate: '2025-12-08T09:45:00Z',
      status: 'shipped',
      totalPrice: 245.75,
      itemCount: 5,
    },
  },
};

export const Delivered: Story = {
  args: {
    order: {
      id: 'ORD-004',
      orderDate: '2025-12-05T16:20:00Z',
      status: 'delivered',
      totalPrice: 52.99,
      itemCount: 1,
    },
  },
};

export const Cancelled: Story = {
  args: {
    order: {
      id: 'ORD-005',
      orderDate: '2025-12-01T11:00:00Z',
      status: 'cancelled',
      totalPrice: 199.99,
      itemCount: 4,
    },
  },
};
