import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FieldLabel from './index';

const meta = {
  title: 'React/form/FieldLabel',
  component: FieldLabel,
  args: getReactStoryArgs('FieldLabel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
