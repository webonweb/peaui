import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ButtonAction from './index';

const meta = {
  title: 'React/data-entry/ButtonAction',
  component: ButtonAction,
  args: getReactStoryArgs('ButtonAction'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ButtonAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
