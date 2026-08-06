import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import PageLayout from './index';

const meta = {
  title: 'React/layout/PageLayout',
  component: PageLayout,
  args: getReactStoryArgs('PageLayout'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
