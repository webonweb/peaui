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
