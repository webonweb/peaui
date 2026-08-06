import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SectionDivider from './index';

const meta = {
  title: 'React/layout/SectionDivider',
  component: SectionDivider,
  args: getReactStoryArgs('SectionDivider'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
