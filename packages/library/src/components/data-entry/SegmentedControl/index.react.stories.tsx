/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SegmentedControl from './index';
import { segmentedControlPeriodItems, segmentedControlViewItems } from './segmented-control.demo';

const meta = {
  title: 'React/data-entry/SegmentedControl',
  component: SegmentedControl,
  args: {
    ariaLabel: 'Sposób wyświetlania',
    dataTestId: 'segmented-control-default',
    defaultValue: 'grid',
    items: segmentedControlViewItems,
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywna radiogroup React ze wspólnym wyglądem, wskaźnikiem, klawiaturą i dostępnością wersji Vue oraz WC.',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DistributionAndWidth: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', width: 'min(100%, 42rem)' }}>
      <SegmentedControl
        ariaLabel="Równy rozkład"
        defaultValue={30}
        items={segmentedControlPeriodItems}
      />
      <SegmentedControl
        ariaLabel="Naturalny rozkład"
        defaultValue={90}
        distribution="auto"
        items={segmentedControlPeriodItems}
      />
      <SegmentedControl
        fullWidth
        ariaLabel="Pełna szerokość"
        defaultValue={365}
        items={segmentedControlPeriodItems}
      />
    </div>
  ),
};

export const ContentAndSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
      <SegmentedControl
        ariaLabel="Ikony"
        content="icon"
        defaultValue="list"
        items={segmentedControlViewItems}
        size="s"
      />
      <SegmentedControl
        ariaLabel="Ikony i tekst"
        content="icon-text"
        defaultValue="grid"
        items={segmentedControlViewItems}
      />
      <SegmentedControl
        ariaLabel="Tekst"
        defaultValue="compact"
        items={segmentedControlViewItems}
        size="l"
      />
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
      <SegmentedControl
        ariaLabel="Wyłączona pozycja"
        defaultValue="list"
        items={segmentedControlViewItems.map((item, index) => ({
          ...item,
          disabled: index === 1,
        }))}
      />
      <SegmentedControl
        disabled
        ariaLabel="Wyłączona grupa"
        defaultValue="grid"
        items={segmentedControlViewItems}
      />
      <SegmentedControl
        ariaLabel="Niepoprawna wartość"
        defaultValue="missing"
        items={segmentedControlViewItems}
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | number | null>('list');
    return (
      <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
        <SegmentedControl
          ariaLabel="Kontrolowany widok"
          items={segmentedControlViewItems}
          value={value}
          onValueChange={setValue}
        />
        <output>Wybrano: {value}</output>
      </div>
    );
  },
};

export const ManualActivation: Story = {
  args: { activation: 'manual', ariaLabel: 'Ręczna aktywacja', defaultValue: 'list' },
};

export const VerticalAndRtl: Story = {
  render: () => (
    <div
      style={{
        alignItems: 'start',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        maxWidth: '100%',
        minWidth: 0,
        width: '100%',
      }}
    >
      <div style={{ flex: '1 1 14rem', maxWidth: '100%', minWidth: 0 }}>
        <SegmentedControl
          ariaLabel="Układ pionowy"
          defaultValue="grid"
          items={segmentedControlViewItems}
          orientation="vertical"
        />
      </div>
      <div dir="rtl" style={{ flex: '1 1 14rem', maxWidth: '100%', minWidth: 0 }}>
        <SegmentedControl
          ariaLabel="Kierunek RTL"
          defaultValue="grid"
          items={segmentedControlViewItems}
        />
      </div>
    </div>
  ),
};

export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-segmented-control-mobile style={{ maxWidth: '100%', width: '20rem' }}>
      <SegmentedControl
        fullWidth
        ariaLabel="Zakres raportu"
        dataTestId="segmented-control-mobile"
        defaultValue={0}
        items={Array.from({ length: 8 }, (_, index) => ({
          value: index,
          label: `Bardzo długa opcja ${index + 1}`,
        }))}
      />
    </div>
  ),
};

export const ReducedMotion: Story = {
  args: { ariaLabel: 'Ograniczony ruch', defaultValue: 'grid' },
};

export const DarkMode: Story = {
  args: { ariaLabel: 'Widok w ciemnym motywie', content: 'icon-text', defaultValue: 'grid' },
  parameters: { backgrounds: { default: 'dark' } },
};
