import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FullscreenContainer from './index';

const meta = {
  title: 'React/layout/FullscreenContainer',
  component: FullscreenContainer,
  args: getReactStoryArgs('FullscreenContainer'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FullscreenContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
