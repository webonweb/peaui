import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ProgressIndicator from './index';

const meta = {
  title: 'React/feedback/ProgressIndicator',
  component: ProgressIndicator,
  args: getReactStoryArgs('ProgressIndicator'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotStarted: Story = { args: { steps: 4, active: undefined } };
