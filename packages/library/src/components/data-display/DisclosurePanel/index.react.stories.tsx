import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import DisclosurePanel from './index';

const meta = {
  title: 'React/data-display/DisclosurePanel',
  component: DisclosurePanel,
  args: getReactStoryArgs('DisclosurePanel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DisclosurePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
