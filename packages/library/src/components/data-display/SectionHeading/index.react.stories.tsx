import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SectionHeading from './index';

const meta = {
  title: 'React/data-display/SectionHeading',
  component: SectionHeading,
  args: getReactStoryArgs('SectionHeading'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondaryVariant: Story = {
  render: (args) => (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '0.75rem',
        background: 'var(--peaui-color-grey-900)',
      }}
    >
      <SectionHeading {...args} />
    </div>
  ),
  args: {
    size: 'xl',
    as: 'section',
    variant: 'secondary',
    title: 'Odwrocona powierzchnia',
    description:
      'Wariant secondary odwraca kolor tekstu wraz z motywem; tlo korzysta z tokenu grey-900.',
    dataTestId: 'section-heading-secondary',
  },
};
