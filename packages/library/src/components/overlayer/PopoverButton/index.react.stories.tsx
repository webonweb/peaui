import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import PopoverButton from './index';

const meta = {
  title: 'React/overlayer/PopoverButton',
  component: PopoverButton,
  args: getReactStoryArgs('PopoverButton'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PopoverButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const KeyboardBetweenControls: Story = {
  args: {
    ariaLabel: 'Open panel',
    children: 'Open panel',
    content: (
      <>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </>
    ),
  },
};
