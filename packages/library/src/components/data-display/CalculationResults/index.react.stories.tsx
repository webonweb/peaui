import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import CalculationResults from './index';

const meta = {
  title: 'React/data-display/CalculationResults',
  component: CalculationResults,
  args: getReactStoryArgs('CalculationResults'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CalculationResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
