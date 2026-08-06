import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SvgIcon from './index';

const meta = {
  title: 'React/basic/SvgIcon',
  component: SvgIcon,
  args: getReactStoryArgs('SvgIcon'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SvgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
