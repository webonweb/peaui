import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationStepper from './index';

const meta = {
  title: 'React/navigation/NavigationStepper',
  component: NavigationStepper,
  args: getReactStoryArgs('NavigationStepper'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
