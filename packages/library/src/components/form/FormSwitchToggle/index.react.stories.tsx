/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import FormSwitchToggle from './index';
import { formSwitchToggleDemoProps, formSwitchToggleLongLabel } from './form-switch-toggle.demo';

const meta = {
  title: 'React/form/FormSwitchToggle',
  component: FormSwitchToggle,
  args: {
    defaultValue: formSwitchToggleDemoProps.value,
    description: formSwitchToggleDemoProps.description,
    id: formSwitchToggleDemoProps.id,
    label: formSwitchToggleDemoProps.label,
    name: formSwitchToggleDemoProps.name,
    showStateLabel: formSwitchToggleDemoProps.showStateLabel,
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny komponent React z generycznymi wartościami, formularzem, rolą switch i CSS współdzielonym 1:1 z Vue oraz Web Components.',
  },
} satisfies Meta<typeof FormSwitchToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnAndOff: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <FormSwitchToggle defaultValue label="Włączony przełącznik" showStateLabel />
      <FormSwitchToggle defaultValue={false} label="Wyłączony przełącznik" showStateLabel />
    </div>
  ),
};

export const SizesAndLabelPositions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '.75rem', maxWidth: '28rem' }}>
      <FormSwitchToggle defaultValue={false} label="Mały" size="s" />
      <FormSwitchToggle defaultValue label="Średni" size="m" />
      <FormSwitchToggle
        defaultValue
        label="Duży, etykieta przed szyną"
        labelPosition="start"
        size="l"
      />
    </div>
  ),
};

export const CustomValues: Story = {
  render: () => {
    const [value, setValue] = useState<'enabled' | 'disabled'>('disabled');
    return (
      <div style={{ display: 'grid', gap: '.75rem' }}>
        <output>Wartość: {value}</output>
        <FormSwitchToggle
          falseValue="disabled"
          label="Tryb ekspercki"
          showStateLabel
          trueValue="enabled"
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const BlockingAndErrorStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <FormSwitchToggle defaultValue disabled label="Disabled" />
      <FormSwitchToggle defaultValue label="Tylko do odczytu" readonly />
      <FormSwitchToggle defaultValue={false} label="Zapisywanie" loading />
      <FormSwitchToggle
        defaultValue={false}
        error="Włącz zgodę, aby kontynuować."
        label="Wymagana zgoda"
        required
      />
    </div>
  ),
};

export const CustomRendering: Story = {
  args: {
    defaultValue: true,
    labelContent: <strong>Własna etykieta</strong>,
    onLabelContent: <span>Aktywne</span>,
    renderThumb: ({ checked }) => <span>{checked ? '✓' : '–'}</span>,
    showStateLabel: true,
  },
};

export const ResponsiveLongContent: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-switch-responsive style={{ maxWidth: '100%', width: '18rem' }}>
      <FormSwitchToggle
        defaultValue={false}
        description="Opis również może zajmować wiele wierszy bez zmniejszania szyny przełącznika."
        label={formSwitchToggleLongLabel}
        showStateLabel
      />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { defaultValue: true },
  parameters: { backgrounds: { default: 'dark' } },
};
