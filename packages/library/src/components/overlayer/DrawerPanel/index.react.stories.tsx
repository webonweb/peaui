import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import DrawerPanel from './index';

const meta = {
  title: 'React/overlayer/DrawerPanel',
  component: DrawerPanel,
  args: getReactStoryArgs('DrawerPanel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DrawerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
