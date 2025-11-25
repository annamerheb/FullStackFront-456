import { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from '../app/shop/cart/cart-summary.component';

const meta: Meta<CartSummaryComponent> = {
  title: 'Shop/CartSummary',
  component: CartSummaryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CartSummaryComponent>;

export const Default: Story = {
  args: {
    cart: {
      itemCount: 3,
      totalPrice: 45.99,
    },
  },
};

export const EmptyCart: Story = {
  args: {
    cart: {
      itemCount: 0,
      totalPrice: 0,
    },
  },
};

export const SingleItem: Story = {
  args: {
    cart: {
      itemCount: 1,
      totalPrice: 29.99,
    },
  },
};

export const LargeCart: Story = {
  args: {
    cart: {
      itemCount: 15,
      totalPrice: 299.99,
    },
  },
};

export const WithHighPrice: Story = {
  args: {
    cart: {
      itemCount: 2,
      totalPrice: 999.99,
    },
  },
};

export const ResponsiveLayout: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50">
        <app-cart-summary [cart]="cart"></app-cart-summary>
        <app-cart-summary [cart]="cart"></app-cart-summary>
        <app-cart-summary [cart]="cart"></app-cart-summary>
      </div>
    `,
  }),
  args: {
    cart: {
      itemCount: 5,
      totalPrice: 125.5,
    },
  },
};
