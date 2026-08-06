import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormRadio from './index';

const meta = {
  title: 'React/form/FormRadio',
  component: FormRadio,
  args: getReactStoryArgs('FormRadio'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
