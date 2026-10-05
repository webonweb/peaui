import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { GuidedTourStep } from './guided-tour.shared';
import GuidedTour from './index';

const steps: GuidedTourStep[] = [
  {
    id: 'search',
    target: '[data-react-tour-target="search"]',
    title: 'Search the workspace',
    description: 'The React adapter forwards the same controlled API to GuidedTour.',
  },
];

const meta = {
  title: 'React/overlayer/GuidedTour/Examples',
  component: GuidedTour,
  args: { steps: [] },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof GuidedTour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spotlight: Story = {
  render: () => (
    <div style={{ minHeight: '24rem', padding: '2rem' }}>
      <button data-react-tour-target="search" type="button">
        Search workspace
      </button>
      <GuidedTour open step={0} steps={steps} />
    </div>
  ),
};

export const Modal: Story = {
  render: () => (
    <GuidedTour
      mode="modal"
      open
      step={0}
      steps={[{ id: 'welcome', title: 'Welcome', description: 'A target-free modal tour.' }]}
    />
  ),
};

function NestedPopoverExample() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Start tour
      </button>
      <GuidedTour
        open={open}
        onOpenChange={setOpen}
        mode="modal"
        steps={[{ id: 'nested', title: 'Nested popup' }]}
      >
        <button type="button" popoverTarget="tour-nested-popup">
          Open nested popup
        </button>
        <div id="tour-nested-popup" popover="auto">
          <button type="button">Nested action</button>
        </div>
      </GuidedTour>
    </>
  );
}

export const NestedPopoverEscape: Story = { render: () => <NestedPopoverExample /> };
