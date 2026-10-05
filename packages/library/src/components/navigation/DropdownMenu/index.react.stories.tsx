/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { dropdownMenuDemoItems, dropdownMenuDemoProps } from './dropdown-menu.demo';
import DropdownMenu from './index';

const meta = {
  title: 'React/navigation/DropdownMenu',
  component: DropdownMenu,
  args: { ...dropdownMenuDemoProps },
  parameters: {
    layout: 'padded',
    description:
      'Natywna implementacja React współdzieląca kontrakt ARIA, zachowanie klawiatury i CSS z Vue oraz Web Components.',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return <DropdownMenu {...args} open={open} onOpenChange={setOpen} />;
  },
};

export const ItemTypesAndSubmenu: Story = {
  args: { defaultOpen: true, items: dropdownMenuDemoItems, triggerLabel: 'Wszystkie typy pozycji' },
};

export const Placements: Story = {
  render: () => (
    <div
      data-dropdown-placement-grid
      style={{
        alignItems: 'center',
        boxSizing: 'border-box',
        display: 'grid',
        gap: 'clamp(3rem, 15vw, 7rem)',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        maxWidth: '100%',
        minHeight: '32rem',
        minWidth: 0,
        padding: 'clamp(2.5rem, 15vw, 7rem)',
        width: '100%',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <DropdownMenu
          align="center"
          dataTestId={`placement-${placement}`}
          items={dropdownMenuDemoItems.slice(0, 2)}
          key={placement}
          placement={placement}
          triggerLabel={placement}
        />
      ))}
    </div>
  ),
};

export const StatesAndCustomRendering: Story = {
  render: () => (
    <div style={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <DropdownMenu {...dropdownMenuDemoProps} density="compact" triggerLabel="Kompaktowe" />
      <DropdownMenu {...dropdownMenuDemoProps} disabled triggerLabel="Wyłączone" />
      <DropdownMenu defaultOpen items={[]} triggerLabel="Puste" />
      <DropdownMenu defaultOpen items={[]} loading loadingContent="Ładowanie akcji…" />
      <DropdownMenu
        {...dropdownMenuDemoProps}
        renderItem={(item) =>
          item.variant === 'danger' ? <strong>{item.label}</strong> : item.label
        }
        renderTrigger={({ open }) => <button type="button">Profil {open ? '▲' : '▼'}</button>}
      />
    </div>
  ),
};

export const MobileAndLongContent: Story = {
  render: () => (
    <div style={{ maxWidth: '100%', width: '18rem' }}>
      <DropdownMenu
        defaultOpen
        items={[
          {
            id: 'long',
            label: 'Bardzo długa nazwa akcji, która nie może wypchnąć menu poza viewport',
            shortcut: 'Ctrl+Shift+Alt+L',
          },
          { id: 'disabled', label: 'Niedostępna bardzo długa akcja', disabled: true },
        ]}
        triggerLabel="Menu mobilne"
      />
    </div>
  ),
};
