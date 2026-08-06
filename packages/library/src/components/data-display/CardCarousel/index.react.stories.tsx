import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import CardCarousel from './index';

const meta = {
  title: 'React/data-display/CardCarousel',
  component: CardCarousel,
  args: getReactStoryArgs('CardCarousel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
