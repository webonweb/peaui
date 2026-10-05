/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import TransferList from './index';
import {
  transferListDemoValue,
  transferListItems,
  transferListLongItems,
} from './transfer-list.demo';
import type { TransferListKey } from './transfer-list.shared';

const meta = {
  title: 'React/data-entry/TransferList',
  component: TransferList,
  args: {
    dataTestId: 'transfer-list-default',
    defaultValue: [...transferListDemoValue],
    items: transferListItems,
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['compact', 'standard'] },
    sort: { control: 'select', options: [false, 'asc', 'desc'] },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React z tym samym modelem, BEM, ARIA i klawiaturą co Vue i WC.',
  },
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SearchAndSort: Story = { args: { sort: 'asc' } };
export const Compact: Story = { args: { size: 'compact' } };
export const DisabledItems: Story = { args: { disabledKeys: ['billing', 'exports'] } };
export const Empty: Story = { args: { defaultValue: [], items: [] } };
export const LoadingPerPanel: Story = { args: { loading: { source: true } } };
export const Error: Story = { args: { error: 'Nie udało się zapisać przypisania.' } };
export const ObjectsAndLongLabels: Story = { args: { items: transferListLongItems } };

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<TransferListKey[]>([...transferListDemoValue]);
    return <TransferList {...args} onValueChange={setValue} value={value} />;
  },
};

export const VerticalMobile: Story = {
  args: { orientation: 'vertical' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div data-transfer-list-narrow style={{ inlineSize: '18rem', maxInlineSize: '100%' }}>
      <TransferList {...args} />
    </div>
  ),
};

export const CustomItem: Story = {
  args: {
    renderItem: ({ label, panel }) => (
      <>
        <strong>{label}</strong>
        <small>{panel}</small>
      </>
    ),
  },
};

export const Virtualized: Story = {
  args: {
    virtual: true,
    optionHeight: 64,
    items: Array.from({ length: 5000 }, (_, value) => ({
      key: value,
      value,
      label: `Option ${value}`,
    })),
    value: [0, 1],
  },
};
