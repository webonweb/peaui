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

export const Loading: Story = { args: { isLoading: true, showCalculateButton: true } };

export const SimpleLongResult: Story = {
  args: {
    label: 'Wynik uproszczony',
    result: '123456789.123456789 kWh/m²',
    isSimple: true,
  },
};
