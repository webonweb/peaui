import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import PopoverOverlayer from './index';

const meta = {
  title: 'React/overlayer/PopoverOverlayer',
  component: PopoverOverlayer,
  args: getReactStoryArgs('PopoverOverlayer'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PopoverOverlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
