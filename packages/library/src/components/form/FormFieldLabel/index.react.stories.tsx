import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormFieldLabel from './index';

const meta = {
  title: 'React/form/FormFieldLabel',
  component: FormFieldLabel,
  args: getReactStoryArgs('FormFieldLabel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormFieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
