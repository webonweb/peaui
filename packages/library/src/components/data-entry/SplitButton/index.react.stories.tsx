/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SplitButton from './index';
import { splitButtonDemoItems, splitButtonDemoProps } from './split-button.demo';

const meta = {
  title: 'React/data-entry/SplitButton',
  component: SplitButton,
  args: { ...splitButtonDemoProps },
  parameters: {
    layout: 'padded',
    description:
      'Natywny SplitButton React współdzielący CSS, kontrakt ARIA i zachowanie klawiatury z Vue oraz Web Components.',
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'split-button-default' } };

export const VariantsAndSizes: Story = {
  render: () => (
    <div data-split-button-parity style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      {(['primary', 'secondary', 'danger'] as const).map((variant) => (
        <SplitButton
          ariaLabel={`Akcje ${variant}`}
          items={splitButtonDemoItems}
          key={variant}
          label="Eksportuj"
          menuAriaLabel="Więcej opcji eksportu"
          variant={variant}
        />
      ))}
      {(['xxs', 'xs', 's', 'm', 'l'] as const).map((size) => (
        <SplitButton
          ariaLabel={`Rozmiar ${size}`}
          items={splitButtonDemoItems}
          key={size}
          label="Pobierz raport"
          menuAriaLabel="Więcej opcji pobierania"
          size={size}
          variant="secondary"
        />
      ))}
    </div>
  ),
};

export const LoadingAndDisabled: Story = {
  render: () => (
    <div style={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <SplitButton {...splitButtonDemoProps} loading loadingLabel="Trwa eksportowanie" />
      <SplitButton
        {...splitButtonDemoProps}
        defaultOpen
        menuLoading
        menuLoadingLabel="Pobieranie formatów…"
      />
      <SplitButton {...splitButtonDemoProps} primaryDisabled />
      <SplitButton {...splitButtonDemoProps} menuDisabled />
      <SplitButton {...splitButtonDemoProps} disabled />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState('Brak');
    return (
      <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
        <SplitButton
          {...args}
          open={open}
          onOpenChange={setOpen}
          onPrimaryClick={() => setSelection('Główna akcja')}
          onSelect={(item) => setSelection(item.label ?? String(item.id))}
        />
        <output>
          Otwarte: {open ? 'tak' : 'nie'}; wybrano: {selection}
        </output>
      </div>
    );
  },
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div
      data-split-button-mobile
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '18rem' }}
    >
      <SplitButton
        ariaLabel="Akcje bardzo długiego raportu"
        dataTestId="split-button-mobile"
        items={splitButtonDemoItems}
        label="Eksportuj bardzo długi raport podsumowujący cały kwartał"
        menuAriaLabel="Więcej opcji eksportu raportu"
      />
    </div>
  ),
};
