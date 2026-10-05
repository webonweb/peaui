import type { Meta, StoryObj } from '@storybook/react';
import NavigationIconCard from './index';

const meta = {
  title: 'React/navigation/NavigationIconCard examples',
  component: NavigationIconCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationIconCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  args: { icon: 'home', text: 'Unavailable', path: '' },
  parameters: {
    docs: {
      description: {
        story: 'An empty path exposes a disabled named link outside the Tab order.',
      },
    },
  },
};
