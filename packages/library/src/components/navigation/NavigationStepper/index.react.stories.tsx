import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationStepper from './index';

const meta = {
  title: 'React/navigation/NavigationStepper',
  component: NavigationStepper,
  args: getReactStoryArgs('NavigationStepper'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RtlResizableContainer: Story = {
  render: () => (
    <div
      dir="rtl"
      style={{ resize: 'horizontal', overflow: 'auto', width: '24rem', maxWidth: '100%' }}
    >
      <NavigationStepper
        options={Array.from({ length: 8 }, (_, i) => ({
          key: `step-${i}`,
          label: `Long step ${i + 1}`,
          status: 'complete' as const,
        }))}
      />
    </div>
  ),
};
