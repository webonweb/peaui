import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SelectableCard from './index';

const meta = {
  title: 'React/data-entry/SelectableCard',
  component: SelectableCard,
  args: getReactStoryArgs('SelectableCard'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SelectableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
