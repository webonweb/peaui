import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ToastAlert from './index';

const meta = {
  title: 'React/feedback/ToastAlert',
  component: ToastAlert,
  args: getReactStoryArgs('ToastAlert'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ToastAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closable: Story = {
  args: { title: 'Zapisano', description: 'Zmiany zostały zapisane.', canClose: true },
};

export const WithShadow: Story = { args: { withShadow: true } };

export const WithBorder: Story = { args: { withBorder: true } };
