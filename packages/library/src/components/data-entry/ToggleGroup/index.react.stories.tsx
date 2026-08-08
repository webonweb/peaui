/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ToggleGroup from './index';
import { toggleGroupFormattingItems, toggleGroupViewItems } from './toggle-group.demo';

const meta = {
  title: 'React/data-entry/ToggleGroup',
  component: ToggleGroup,
  args: {
    dataTestId: 'toggle-group-default',
    defaultValue: 'grid',
    items: toggleGroupViewItems,
    label: 'Widok wyników',
    size: 'm',
  },
  argTypes: {
    appearance: { control: 'select', options: ['separate', 'attached'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    overflow: { control: 'select', options: ['wrap', 'scroll'] },
    semanticRole: { control: 'select', options: ['toolbar', 'group'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny ToggleGroup React współdzielący kontrakt, wygląd, klawiaturę i dostępność z Vue oraz Web Components.',
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup
      type="multiple"
      defaultValue={['bold', 'underline']}
      items={toggleGroupFormattingItems}
      label="Formatowanie"
    />
  ),
};

export const SizesAndAlignment: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      {(['xxs', 'xs', 's', 'm', 'l'] as const).map((size) => (
        <ToggleGroup
          appearance="attached"
          dataTestId={`toggle-group-size-${size}`}
          defaultValue="grid"
          items={toggleGroupViewItems}
          key={size}
          label={`Rozmiar ${size}`}
          size={size}
        />
      ))}
    </div>
  ),
};

export const RequiredAndAllowEmpty: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <ToggleGroup
        required
        defaultValue="grid"
        items={toggleGroupViewItems}
        label="Wymagany widok"
      />
      <ToggleGroup
        allowEmpty={false}
        defaultValue="list"
        items={toggleGroupViewItems}
        label="Zawsze jeden wybór"
      />
      <ToggleGroup required items={toggleGroupViewItems} label="Pusty wymagany wybór" />
    </div>
  ),
};

export const OrientationsAndAppearance: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
      <ToggleGroup
        appearance="attached"
        defaultValue="grid"
        items={toggleGroupViewItems}
        label="Poziomo"
      />
      <ToggleGroup
        defaultValue="list"
        items={toggleGroupViewItems}
        label="Pionowo"
        orientation="vertical"
      />
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <ToggleGroup
        defaultValue="grid"
        items={toggleGroupViewItems.map((item, index) => ({ ...item, disabled: index === 1 }))}
        label="Wyłączona pozycja"
      />
      <ToggleGroup
        disabled
        defaultValue="grid"
        items={toggleGroupViewItems}
        label="Wyłączona grupa"
      />
      <ToggleGroup
        readonly
        defaultValue="grid"
        items={toggleGroupViewItems}
        label="Tylko do odczytu"
      />
    </div>
  ),
};

export const DynamicItems: Story = {
  render: () => {
    const [items, setItems] = useState([...toggleGroupViewItems]);
    return (
      <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
        <ToggleGroup dataTestId="toggle-group-dynamic" items={items} label="Dynamiczny widok" />
        <button type="button" onClick={() => setItems((current) => current.slice(0, -1))}>
          Usuń ostatnią pozycję
        </button>
        <button type="button" onClick={() => setItems([...toggleGroupViewItems])}>
          Przywróć pozycje
        </button>
      </div>
    );
  },
};

export const CustomItems: Story = {
  args: {
    renderItem: (item, state) => `${state.pressed ? '✓ ' : ''}${item.label}`,
  },
};

export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-toggle-group-mobile style={{ maxWidth: '100%', width: '20rem' }}>
      <ToggleGroup
        appearance="attached"
        defaultValue={0}
        items={Array.from({ length: 8 }, (_, index) => ({
          value: index,
          label: `Opcja ${index + 1}`,
        }))}
        label="Filtry"
        overflow="scroll"
      />
    </div>
  ),
};

export const Rtl: Story = {
  args: { dir: 'rtl', label: 'Kierunek RTL' },
};

export const DarkMode: Story = {
  args: { appearance: 'attached' },
  parameters: { backgrounds: { default: 'dark' } },
};
