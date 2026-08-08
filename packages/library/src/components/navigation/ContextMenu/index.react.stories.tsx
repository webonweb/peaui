/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { contextMenuDemoItems, contextMenuDemoProps } from './context-menu.demo';
import ContextMenu from './index';

const targetStyle = {
  alignItems: 'center',
  background: 'var(--peaui-color-grey-50)',
  border: '1px solid var(--peaui-color-grey-300)',
  borderRadius: '.75rem',
  boxSizing: 'border-box' as const,
  cursor: 'context-menu',
  display: 'flex',
  minHeight: '7rem',
  padding: '1.25rem',
};

const Target = ({ children }: { children: string }) => (
  <button className="context-story-target" style={targetStyle} type="button">
    {children}
  </button>
);

const meta = {
  title: 'React/navigation/ContextMenu',
  component: ContextMenu,
  args: { ...contextMenuDemoProps },
  parameters: {
    layout: 'padded',
    description:
      'Natywna implementacja React współdzieląca z Vue i Web Components wygląd, pozycjonowanie, role ARIA, typeahead, podmenu i bezpieczny long press.',
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <Target>Raport kwartalny — prawy przycisk lub Shift+F10</Target>
    </ContextMenu>
  ),
};

export const PointerActivation: Story = {
  render: () => (
    <ContextMenu
      ariaLabel="Akcje raportu"
      context={{ id: 'report-q3' }}
      dataTestId="context-pointer"
      items={contextMenuDemoItems}
    >
      <Target>Raport kwartalny</Target>
    </ContextMenu>
  ),
};

export const KeyboardActivation: Story = {
  render: () => (
    <ContextMenu
      ariaLabel="Akcje dokumentu"
      dataTestId="context-keyboard"
      items={contextMenuDemoItems}
      position="target"
    >
      <Target>Ustaw fokus i naciśnij Shift+F10</Target>
    </ContextMenu>
  ),
};

export const LongPress: Story = {
  render: () => (
    <ContextMenu dataTestId="context-long-press" items={contextMenuDemoItems} longPressDelay={350}>
      <Target>Przytrzymaj palec; ruch anuluje otwarcie</Target>
    </ContextMenu>
  ),
};

export const ViewportEdges: Story = {
  render: () => (
    <div
      data-context-edge-grid
      style={{
        alignContent: 'space-between',
        display: 'grid',
        gap: 'clamp(2rem, 16vw, 16rem)',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        maxWidth: '100%',
        minHeight: '40rem',
        minWidth: 0,
        width: '100%',
      }}
    >
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <ContextMenu dataTestId={`edge-${corner}`} items={contextMenuDemoItems} key={corner}>
          <Target>{corner}</Target>
        </ContextMenu>
      ))}
    </div>
  ),
};

export const Submenu: Story = {
  render: () => (
    <ContextMenu ariaLabel="Akcje z podmenu" items={contextMenuDemoItems}>
      <Target>Wszystkie typy pozycji i dwupoziomowe podmenu</Target>
    </ContextMenu>
  ),
};

export const DynamicContext: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '.75rem' }}>
      {[
        { id: 1, name: 'Raport A' },
        { id: 2, name: 'Raport B' },
      ].map((record) => (
        <ContextMenu context={record} items={contextMenuDemoItems} key={record.id}>
          <Target>{record.name}</Target>
        </ContextMenu>
      ))}
    </div>
  ),
};

export const RemovedTarget: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <ContextMenu items={contextMenuDemoItems}>
          {show ? <Target>Tymczasowy cel</Target> : null}
        </ContextMenu>
        <button type="button" onClick={() => setShow(false)}>
          Usuń aktywny cel
        </button>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <ContextMenu disabled items={contextMenuDemoItems}>
      <Target>Natywne menu pozostaje dostępne</Target>
    </ContextMenu>
  ),
};
