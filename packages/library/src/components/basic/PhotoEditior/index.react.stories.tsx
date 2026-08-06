import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import PhotoEditor from './index';

const meta = {
  title: 'React/basic/PhotoEditor',
  component: PhotoEditor,
  args: getReactStoryArgs('PhotoEditor'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PhotoEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
