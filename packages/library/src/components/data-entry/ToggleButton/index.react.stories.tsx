/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ToggleButton from './index';
import { toggleButtonDemoProps, toggleButtonLongLabel } from './toggle-button.demo';

const meta = {
  title: 'React/data-entry/ToggleButton',
  component: ToggleButton,
  args: {
    ariaLabel: toggleButtonDemoProps.ariaLabel,
    content: toggleButtonDemoProps.content,
    defaultValue: toggleButtonDemoProps.value,
    icon: toggleButtonDemoProps.icon,
    label: toggleButtonDemoProps.label,
    pressedIcon: toggleButtonDemoProps.pressedIcon,
    pressedLabel: toggleButtonDemoProps.pressedLabel,
    variant: toggleButtonDemoProps.variant,
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny komponent React z aria-pressed, kontrolowanym i niekontrolowanym modelem oraz CSS współdzielonym 1:1 z Vue i Web Components.',
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ContentModes: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
      <ToggleButton content="text" label="Pogrubienie" />
      <ToggleButton ariaLabel="Pokaż podgląd" content="icon" icon="eye" />
      <ToggleButton content="icon-text" icon="lock" label="Zablokuj" />
    </div>
  ),
};

export const VariantsAndSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
      <ToggleButton label="Default xxs" size="xxs" variant="default" />
      <ToggleButton defaultValue label="Outline xs" size="xs" variant="outline" />
      <ToggleButton label="Ghost s" size="s" variant="ghost" />
      <ToggleButton defaultValue icon="eye" label="Default m" size="m" />
      <ToggleButton defaultValue icon="lock" label="Outline l" size="l" variant="outline" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '.75rem', justifyItems: 'start' }}>
        <output>Stan: {value ? 'włączony' : 'wyłączony'}</output>
        <ToggleButton
          ariaLabel="Pokaż podgląd"
          icon="eye"
          label="Podgląd"
          pressedIcon="eye"
          pressedLabel="Podgląd widoczny"
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const BlockingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
      <ToggleButton defaultValue dataTestId="toggle-disabled" disabled label="Disabled" />
      <ToggleButton defaultValue dataTestId="toggle-readonly" label="Tylko do odczytu" readonly />
      <ToggleButton dataTestId="toggle-loading" label="Zapisywanie" loading />
    </div>
  ),
};

export const StableAccessibleName: Story = {
  args: { ...meta.args, defaultValue: true },
};

export const CustomIcons: Story = {
  args: {
    ariaLabel: 'Przełącz wyróżnienie',
    defaultValue: false,
    iconContent: <span>☆</span>,
    label: 'Wyróżnij',
    pressedIconContent: <span>★</span>,
    pressedLabel: 'Wyróżnione',
  },
};

export const ResponsiveLongContent: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-toggle-responsive style={{ maxWidth: '100%', width: '18rem' }}>
      <ToggleButton allowWrap icon="eye" label={toggleButtonLongLabel} variant="outline" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { ...meta.args, defaultValue: true },
  parameters: { backgrounds: { default: 'dark' } },
};
