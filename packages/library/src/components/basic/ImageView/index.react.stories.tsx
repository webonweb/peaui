import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ImageView from './index';

const meta = {
  title: 'React/basic/ImageView',
  component: ImageView,
  args: getReactStoryArgs('ImageView'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ImageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
