import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import DescriptionField from './index';

const meta = {
  title: 'React/data-display/DescriptionField',
  component: DescriptionField,
  args: getReactStoryArgs('DescriptionField'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DescriptionField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
