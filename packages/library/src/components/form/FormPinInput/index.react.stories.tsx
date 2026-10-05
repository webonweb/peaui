/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { formPinInputDemoProps, formPinInputLongLabel } from './form-pin-input.demo';
import FormPinInput from './index';

const { value: defaultValue, ...defaultProps } = formPinInputDemoProps;

const meta = {
  title: 'React/form/FormPinInput',
  component: FormPinInput,
  args: { ...defaultProps, defaultValue },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormPinInput React z identyczną normalizacją, wyglądem, ARIA, klawiaturą i responsywnością jak Vue i WC.',
  },
} satisfies Meta<typeof FormPinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-pin-input-default' } };

export const NumericAndAlphanumeric: Story = {
  render: () => (
    <div
      data-pin-parity
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
      }}
    >
      <FormPinInput
        defaultValue="0123"
        id="pin-numeric-react"
        label="Kod numeryczny"
        length={4}
        name="pinNumeric"
      />
      <FormPinInput
        defaultValue="A1B2C3"
        id="pin-alpha-react"
        label="Kod alfanumeryczny"
        name="pinAlpha"
        transform="uppercase"
        type="alphanumeric"
      />
    </div>
  ),
};

export const MaskedAndGrouped: Story = {
  args: {
    dataTestId: 'form-pin-input-masked',
    defaultValue: '120045',
    description:
      'Maskowanie ogranicza podgląd kodu, ale nie zastępuje bezpiecznego przechowywania.',
    mask: true,
    separatorEvery: 3,
  },
};

export const PasteAndKeyboard: Story = {
  render: () => (
    <div data-pin-keyboard style={{ maxInlineSize: '100%', width: '30rem' }}>
      <p>Wklej cały kod albo użyj strzałek, Home, End, Backspace i Delete.</p>
      <FormPinInput
        dataTestId="form-pin-input-keyboard"
        description="Tab opuszcza grupę; strzałki zmieniają aktywną komórkę."
        id="pin-keyboard-react"
        label="Kod obsługiwany klawiaturą"
        name="pinKeyboard"
      />
    </div>
  ),
};

export const ValidationAndStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
      }}
    >
      <FormPinInput
        defaultValue=""
        id="pin-required-react"
        label="Kod wymagany"
        name="pinRequired"
        required
      />
      <FormPinInput
        defaultValue="1234"
        error="Kod wygasł. Wpisz nowy kod."
        id="pin-error-react"
        label="Kod z błędem"
        name="pinError"
      />
      <FormPinInput
        defaultValue="120045"
        id="pin-readonly-react"
        label="Tylko do odczytu"
        name="pinReadonly"
        readonly
      />
      <FormPinInput
        defaultValue=""
        id="pin-loading-react"
        label="Ładowanie"
        loading
        name="pinLoading"
      />
      <FormPinInput
        defaultValue="120045"
        disabled
        id="pin-disabled-react"
        label="Niedostępny"
        name="pinDisabled"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '30rem' }}>
        <FormPinInput
          id="pin-controlled-react"
          label="Kontrolowany kod"
          name="pinControlled"
          onValueChange={setValue}
          value={value}
        />
        <output>Wartość: {value || 'pusta'}</output>
      </div>
    );
  },
};

export const MobileAndLongCode: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-pin-mobile style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' }}>
      <FormPinInput
        dataTestId="form-pin-input-mobile"
        defaultValue="AB12CD34EF56"
        description="Dwanaście znaków jest dostępne przez kontrolowane przewijanie poziome."
        id="pin-mobile-react"
        label={formPinInputLongLabel}
        length={12}
        name="pinMobile"
        separatorEvery={4}
        transform="uppercase"
        type="alphanumeric"
      />
    </div>
  ),
};
