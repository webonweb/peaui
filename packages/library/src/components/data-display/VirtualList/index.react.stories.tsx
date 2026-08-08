/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { createRef, useState } from 'react';

import VirtualList from './index';
import { virtualListDemoItems } from './virtual-list.demo';
import type { VirtualListHandle } from './virtual-list.shared';

const meta = {
  title: 'React/data-display/VirtualList',
  component: VirtualList,
  args: {
    ariaLabel: 'Wyniki wyszukiwania',
    dataTestId: 'virtual-list-default',
    height: 320,
    items: virtualListDemoItems,
    itemSize: 64,
    onActiveIndexChange: fn(),
    onItemFocus: fn(),
    onMeasureError: fn(),
    onReachEnd: fn(),
    onScroll: fn(),
    onVisibleRangeChange: fn(),
    overscan: 4,
  },
  argTypes: {
    semanticRole: { control: 'select', options: ['list', 'listbox'] },
    height: { control: 'text' },
    itemSize: { control: { type: 'range', min: 24, max: 120, step: 4 } },
    overscan: { control: { type: 'range', min: 0, max: 20, step: 1 } },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React z tym samym zakresem, wyglądem, ARIA i API co Vue i WC.',
  },
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LargeDataset: Story = {};

export const ListboxKeyboard: Story = {
  args: { semanticRole: 'listbox' },
  render: (args) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    return <VirtualList {...args} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />;
  },
};

export const Programmatic: Story = {
  render: (args) => {
    const list = createRef<VirtualListHandle>();
    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <button type="button" onClick={() => list.current?.scrollToIndex(7500, 'center')}>
          Przejdź do wyniku 7501
        </button>
        <VirtualList {...args} ref={list} />
      </div>
    );
  },
};

export const Empty: Story = { args: { items: [] } };
export const InitialLoading: Story = { args: { items: [], loading: true } };
export const LoadingMore: Story = { args: { hasMore: true, loading: true } };
export const Error: Story = { args: { error: 'Nie udało się pobrać kolejnej strony.' } };

export const DynamicCollection: Story = {
  render: (args) => {
    const [count, setCount] = useState(100);
    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <button type="button" onClick={() => setCount((value) => (value === 100 ? 250 : 100))}>
          Zmień liczbę elementów
        </button>
        <VirtualList {...args} items={virtualListDemoItems.slice(0, count)} />
      </div>
    );
  },
};

export const LongContentMobile: Story = {
  args: {
    height: 280,
    items: virtualListDemoItems.slice(0, 500).map((item) => ({
      ...item,
      label: `${item.label} — bardzo długa nazwa tolerująca wąski kontener i powiększony tekst`,
    })),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div data-virtual-list-narrow style={{ inlineSize: '18rem', maxInlineSize: '100%' }}>
      <VirtualList {...args} />
    </div>
  ),
};

export const CustomItem: Story = {
  args: {
    renderItem: ({ index, item }) => {
      const record = item as { description: string; label: string };
      return (
        <>
          <strong>
            {index + 1}. {record.label}
          </strong>
          <small>{record.description}</small>
        </>
      );
    },
  },
};
