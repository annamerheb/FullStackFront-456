import { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from '../app/modules/shop/components/cart/cart-item.component';
import { CartItem } from '../app/state/cart/cart.models';

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
  argTypes: {
    quantityChanged: { action: 'quantityChanged' },
    removed: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<CartItemComponent>;

const mockCartItem: CartItem = {
  product: {
    id: 1,
    name: 'Stylo Bleu Premium',
    price: 2.99,
    created_at: '2024-01-01',
    image: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500',
    avgRating: 4.5,
    stock: 50,
    lowStockThreshold: 10,
    discount: 10,
  },
  quantity: 2,
};

const lowStockItem: CartItem = {
  product: {
    id: 2,
    name: 'Notebook Eco',
    price: 5.99,
    created_at: '2024-01-02',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
    avgRating: 4.2,
    stock: 8,
    lowStockThreshold: 15,
    discount: 5,
  },
  quantity: 1,
};

const outOfStockItem: CartItem = {
  product: {
    id: 3,
    name: 'Pencil Set',
    price: 3.49,
    created_at: '2024-01-03',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500',
    avgRating: 4.8,
    stock: 0,
    lowStockThreshold: 20,
    discount: 0,
  },
  quantity: 1,
};

export const Default: Story = {
  args: {
    item: mockCartItem,
  },
};

export const LowStock: Story = {
  args: {
    item: lowStockItem,
  },
};

export const OutOfStock: Story = {
  args: {
    item: outOfStockItem,
  },
};

export const HighQuantity: Story = {
  args: {
    item: {
      ...mockCartItem,
      quantity: 5,
    },
  },
};

export const MultipleItems: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-4 p-4 bg-slate-50">
        <app-cart-item [item]="item" (quantityChanged)="quantityChanged($event)" (removed)="removed($event)"></app-cart-item>
        <app-cart-item [item]="item" (quantityChanged)="quantityChanged($event)" (removed)="removed($event)"></app-cart-item>
        <app-cart-item [item]="item" (quantityChanged)="quantityChanged($event)" (removed)="removed($event)"></app-cart-item>
      </div>
    `,
  }),
  args: {
    item: mockCartItem,
  },
};
