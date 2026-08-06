import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import InfoTooltip from './index';

const meta = {
  title: 'React/overlayer/InfoTooltip',
  component: InfoTooltip,
  args: getReactStoryArgs('InfoTooltip'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InfoTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
