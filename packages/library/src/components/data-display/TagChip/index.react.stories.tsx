import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TagChip from './index';

const meta = {
  title: 'React/data-display/TagChip',
  component: TagChip,
  args: getReactStoryArgs('TagChip'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TagChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
