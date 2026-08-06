import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SectionHeading from './index';

const meta = {
  title: 'React/data-display/SectionHeading',
  component: SectionHeading,
  args: getReactStoryArgs('SectionHeading'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
