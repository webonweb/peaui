import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import MessageText from './index';

const meta = {
  title: 'React/feedback/MessageText',
  component: MessageText,
  args: getReactStoryArgs('MessageText'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MessageText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
