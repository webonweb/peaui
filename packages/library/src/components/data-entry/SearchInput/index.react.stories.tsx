import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SearchInput from './index';

const meta = {
  title: 'React/data-entry/SearchInput',
  component: SearchInput,
  args: getReactStoryArgs('SearchInput'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
