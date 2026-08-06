import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormContainer from './index';

const meta = {
  title: 'React/form/FormContainer',
  component: FormContainer,
  args: getReactStoryArgs('FormContainer'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
