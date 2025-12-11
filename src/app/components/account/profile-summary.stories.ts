import type { Meta, StoryObj } from '@storybook/angular';
import { ProfileSummaryComponent } from './profile-summary.component';

const meta: Meta<ProfileSummaryComponent> = {
  component: ProfileSummaryComponent,
  title: 'Account/Profile Summary',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProfileSummaryComponent>;

export const Default: Story = {
  args: {
    user: {
      id: 'user-123',
      username: 'johndoe',
      email: 'john@example.com',
      fullName: 'John Doe',
      defaultAddress: {
        street: '123 Main Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      preferences: {
        newsletter: true,
        defaultMinRating: 3.5,
      },
      orders: [],
      createdAt: '2025-01-15T10:30:00Z',
    },
  },
};

export const WithoutFullName: Story = {
  args: {
    user: {
      id: 'user-456',
      username: 'janedoe',
      email: 'jane@example.com',
      preferences: {
        newsletter: false,
        defaultMinRating: 0,
      },
      orders: [],
    },
  },
};

export const NewsletterSubscribed: Story = {
  args: {
    user: {
      id: 'user-789',
      username: 'bob',
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      preferences: {
        newsletter: true,
        defaultMinRating: 4.0,
      },
      defaultAddress: {
        street: '456 Oak Avenue',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France',
      },
      orders: [],
    },
  },
};

export const NoNewsletterAndLowRating: Story = {
  args: {
    user: {
      id: 'user-999',
      username: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      preferences: {
        newsletter: false,
        defaultMinRating: 1.0,
      },
      orders: [],
    },
  },
};
