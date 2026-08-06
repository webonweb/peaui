import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationDisclosureCard from './index';

const meta = {
  title: 'React/navigation/NavigationDisclosureCard',
  component: NavigationDisclosureCard,
  args: getReactStoryArgs('NavigationDisclosureCard'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationDisclosureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
