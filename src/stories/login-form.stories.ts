import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoginFormComponent } from '../app/components/login-form/login-form.component';

const meta: Meta<LoginFormComponent> = {
  component: LoginFormComponent,
  title: 'Components/Login Form',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideMockStore({}),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {};
