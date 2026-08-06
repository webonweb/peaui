import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import PaginationControl from './index';

const meta = {
  title: 'React/navigation/PaginationControl',
  component: PaginationControl,
  args: getReactStoryArgs('PaginationControl'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PaginationControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
