import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ModalDialog from './index';

const meta = {
  title: 'React/overlayer/ModalDialog',
  component: ModalDialog,
  args: getReactStoryArgs('ModalDialog'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ModalDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
