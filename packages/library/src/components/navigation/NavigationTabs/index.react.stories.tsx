import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationTabs from './index';

const meta = {
  title: 'React/navigation/NavigationTabs',
  component: NavigationTabs,
  args: getReactStoryArgs('NavigationTabs'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
