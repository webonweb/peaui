import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormCheckbox from './index';

const meta = {
  title: 'React/form/FormCheckbox',
  component: FormCheckbox,
  args: getReactStoryArgs('FormCheckbox'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
