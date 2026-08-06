import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import GridSection from './index';

const meta = {
  title: 'React/layout/GridSection',
  component: GridSection,
  args: getReactStoryArgs('GridSection'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof GridSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
