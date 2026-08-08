/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { createRef, useState } from 'react';

import ScrollArea, { type ScrollAreaHandle, type ScrollAreaProps } from './index';
import { scrollAreaDemoItems } from './scroll-area.demo';

const meta = {
  title: 'React/layout/ScrollArea',
  component: ScrollArea,
  args: {
    ariaLabel: 'Sekcje raportu',
    autoHideDelay: 700,
    dataTestId: 'scroll-area',
    orientation: 'vertical',
    scrollbarSize: 10,
    scrollbarVisibility: 'auto',
    tabIndex: 0,
    type: 'styled',
  },
  argTypes: {
    type: { control: 'select', options: ['native', 'styled'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    scrollbarVisibility: { control: 'select', options: ['auto', 'always', 'hover'] },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React z identycznym DOM, geometrią, eventami i ARIA jak Vue oraz WC.',
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = scrollAreaDemoItems.map((item) => (
  <article
    id={item.id}
    key={item.id}
    style={{ background: '#fff', border: '1px solid #dfe5eb', borderRadius: 10, padding: 14 }}
  >
    <strong>{item.title}</strong>
    <p style={{ margin: '4px 0 0' }}>{item.description}</p>
  </article>
));

const renderVertical = (args: ScrollAreaProps) => (
  <ScrollArea {...args} style={{ blockSize: '18rem', maxInlineSize: '40rem' }}>
    <div style={{ display: 'grid', gap: 10, padding: 12 }}>{cards}</div>
  </ScrollArea>
);

export const Default: Story = { render: renderVertical };
export const Vertical: Story = { render: renderVertical };
export const Native: Story = { args: { type: 'native' }, render: renderVertical };
export const AlwaysVisible: Story = {
  args: { scrollbarVisibility: 'always' },
  render: renderVertical,
};
export const HoverVisible: Story = {
  args: { scrollbarVisibility: 'hover' },
  render: renderVertical,
};
export const NoOverflow: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ blockSize: '12rem' }}>
      <p style={{ padding: 16 }}>Krótka treść bez przepełnienia.</p>
    </ScrollArea>
  ),
};
export const Horizontal: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => (
    <ScrollArea {...args} style={{ blockSize: '12rem', maxInlineSize: '40rem' }}>
      <div style={{ display: 'flex', gap: 12, inlineSize: 'max-content', padding: 12 }}>
        {scrollAreaDemoItems.slice(0, 6).map((item) => (
          <article
            key={item.id}
            style={{ border: '1px solid #dfe5eb', borderRadius: 10, inlineSize: 224, padding: 16 }}
          >
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </ScrollArea>
  ),
};
export const BothAxes: Story = {
  args: { orientation: 'both', scrollbarVisibility: 'always' },
  render: (args) => (
    <ScrollArea {...args} style={{ blockSize: '18rem', inlineSize: 'min(100%, 32rem)' }}>
      <div style={{ blockSize: '36rem', inlineSize: '54rem', padding: 16 }}>
        Duża powierzchnia w obu osiach
      </div>
    </ScrollArea>
  ),
};
export const RTL: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => (
    <div dir="rtl">
      <ScrollArea {...args} style={{ blockSize: '12rem', maxInlineSize: '40rem' }}>
        <div style={{ display: 'flex', gap: 12, inlineSize: 'max-content', padding: 12 }}>
          {scrollAreaDemoItems.slice(0, 6).map((item) => (
            <article
              key={item.id}
              style={{
                border: '1px solid #dfe5eb',
                borderRadius: 10,
                inlineSize: 224,
                padding: 16,
              }}
            >
              {item.title}
            </article>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
export const Programmatic: Story = {
  render: (args) => {
    const area = createRef<ScrollAreaHandle>();
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <button
          type="button"
          onClick={() =>
            area.current?.scrollIntoView('#section-10', { behavior: 'smooth', block: 'start' })
          }
        >
          Przejdź do sekcji 10
        </button>
        <ScrollArea {...args} ref={area} style={{ blockSize: '18rem' }}>
          <div style={{ display: 'grid', gap: 10, padding: 12 }}>{cards}</div>
        </ScrollArea>
      </div>
    );
  },
};
export const DynamicAndNarrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const [count, setCount] = useState(4);
    return (
      <div style={{ display: 'grid', gap: 12, inlineSize: 'min(100%, 14rem)' }}>
        <button type="button" onClick={() => setCount(count === 4 ? 12 : 4)}>
          Zmień liczbę elementów
        </button>
        <ScrollArea {...args} style={{ blockSize: '16rem' }}>
          <div style={{ display: 'grid', gap: 8, padding: 10 }}>{cards.slice(0, count)}</div>
        </ScrollArea>
      </div>
    );
  },
};
export const Nested: Story = {
  render: (args) => (
    <ScrollArea {...args} ariaLabel="Zewnętrzny obszar" style={{ blockSize: '22rem' }}>
      <div style={{ display: 'grid', gap: 16, padding: 16 }}>
        {cards.slice(0, 3)}
        <ScrollArea
          ariaLabel="Wewnętrzny obszar"
          orientation="horizontal"
          scrollbarVisibility="always"
          style={{ blockSize: '9rem' }}
        >
          <div style={{ inlineSize: '48rem', padding: 16 }}>Niezależna zawartość pozioma</div>
        </ScrollArea>
        {cards.slice(3, 8)}
      </div>
    </ScrollArea>
  ),
};
