import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import MessageText from './index';

const meta = {
  title: 'React/feedback/MessageText',
  component: MessageText,
  args: getReactStoryArgs('MessageText'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MessageText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WhiteVariant: Story = {
  render: (args) => (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '0.75rem',
        background: 'var(--peaui-color-grey-900)',
      }}
    >
      <MessageText {...args} />
    </div>
  ),
  args: {
    id: 'message-text-white',
    variant: 'white',
    size: 's',
    ownIcon: 'plus',
    children: 'Komunikat na odwroconej powierzchni; tekst i tlo grey-900 reaguja na motyw.',
    dataTestId: 'message-text-white',
  },
};
