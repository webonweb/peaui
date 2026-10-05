import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import GuidedTour from './index';

const meta = {
  title: 'React/overlayer/GuidedTour',
  component: GuidedTour,
  args: {
    mode: 'modal',
    open: true,
    step: 0,
    steps: [{ id: 'welcome', title: 'Witaj', description: 'Poznaj najwazniejsze funkcje.' }],
    onBack: fn(),
    onComplete: fn(),
    onError: fn(),
    onNext: fn(),
    onOpenChange: fn(),
    onSkip: fn(),
    onStart: fn(),
    onStepChange: fn(),
    onStepEnter: fn(),
    onStepLeave: fn(),
    onTargetMissing: fn(),
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof GuidedTour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
