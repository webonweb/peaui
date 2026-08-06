import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationIconCard from './index';

const meta = {
  title: 'React/navigation/NavigationIconCard',
  component: NavigationIconCard,
  args: getReactStoryArgs('NavigationIconCard'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationIconCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
