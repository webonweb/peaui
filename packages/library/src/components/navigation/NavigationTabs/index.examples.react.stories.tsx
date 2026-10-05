import type { Meta, StoryObj } from '@storybook/react';
import NavigationTabs from './index';

const meta = {
  title: 'React/navigation/NavigationTabs examples',
  component: NavigationTabs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardInteraction: Story = {
  args: {
    ariaLabel: 'Keyboard navigation',
    tabs: [
      { key: 'account', label: 'Account', active: true },
      { key: 'blocked', label: 'Unavailable', disabled: true },
      { key: 'settings', label: 'Settings' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use Left/Right, Home and End to move focus; Enter or Space selects the original tab object, including its key.',
      },
    },
  },
};
