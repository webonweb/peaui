/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  formColorPickerDemoProps,
  formColorPickerLongLabel,
  formColorPickerSavedColors,
} from './form-color-picker.demo';
import FormColorPicker from './index';

const { value: defaultValue, ...defaultProps } = formColorPickerDemoProps;

const meta = {
  title: 'React/form/FormColorPicker',
  component: FormColorPicker,
  args: { ...defaultProps, defaultValue },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormColorPicker React z tym samym modelem HSVA, wyglądem, ARIA, klawiaturą i responsywnością jak Vue i Web Components.',
  },
} satisfies Meta<typeof FormColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-color-picker-default' } };

export const FormatsAndDensity: Story = {
  render: () => (
    <div
      data-color-picker-parity
      style={{
        alignItems: 'start',
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,20rem),1fr))',
      }}
    >
      <FormColorPicker
        id="color-hex-react"
        label="HEX"
        name="colorHex"
        defaultValue="#4C9A2A"
        variant="inline"
      />
      <FormColorPicker
        id="color-rgb-react"
        label="RGB compact"
        name="colorRgb"
        defaultValue="rgb(76, 154, 42)"
        format="rgb"
        density="compact"
        variant="inline"
      />
      <FormColorPicker
        id="color-hsl-react"
        label="HSL z alpha"
        name="colorHsl"
        defaultValue="hsla(102, 57%, 38%, .7)"
        format="hsl"
        alpha
        variant="inline"
      />
    </div>
  ),
};

export const PalettesAndEyedropper: Story = {
  args: { defaultOpen: true, showEyedropper: true },
};

export const KeyboardAndContrast: Story = {
  render: () => (
    <div>
      <p>
        Ustaw fokus na powierzchni koloru i użyj strzałek; Shift zmienia wartość o większy krok.
      </p>
      <div
        style={{
          alignItems: 'start',
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
        }}
      >
        <FormColorPicker
          id="color-dark-react"
          label="Wskaźnik na czerni"
          name="colorDark"
          defaultValue="#000000"
          variant="inline"
          density="compact"
        />
        <FormColorPicker
          id="color-light-react"
          label="Wskaźnik na bieli"
          name="colorLight"
          defaultValue="#FFFFFF"
          variant="inline"
          density="compact"
        />
      </div>
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
      <FormColorPicker
        id="color-required-react"
        label="Wymagany kolor"
        name="colorRequired"
        defaultValue=""
        required
      />
      <FormColorPicker
        id="color-error-react"
        label="Błąd zewnętrzny"
        name="colorError"
        defaultValue="#C73E3A"
        error="Ten kolor nie spełnia zasad marki."
      />
      <FormColorPicker
        id="color-readonly-react"
        label="Tylko do odczytu"
        name="colorReadonly"
        defaultValue="#4C9A2A"
        readonly
      />
      <FormColorPicker
        id="color-loading-react"
        label="Ładowanie"
        name="colorLoading"
        defaultValue="#4C9A2A"
        loading
      />
      <FormColorPicker
        id="color-disabled-react"
        label="Niedostępny"
        name="colorDisabled"
        defaultValue="#4C9A2A"
        disabled
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('#287BB5');
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '32rem' }}>
        <FormColorPicker
          id="color-controlled-react"
          label="Kontrolowany kolor"
          name="colorControlled"
          alpha
          open={open}
          value={value}
          onOpenChange={setOpen}
          onValueChange={setValue}
        />
        <output>
          Wartość: {value}; panel: {open ? 'otwarty' : 'zamknięty'}
        </output>
      </div>
    );
  },
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div
      data-color-picker-mobile
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' }}
    >
      <FormColorPicker
        alpha
        dataTestId="form-color-picker-mobile"
        defaultValue="#4C9A2AE6"
        id="color-mobile-react"
        label={formColorPickerLongLabel}
        name="colorMobile"
        savedColors={[...formColorPickerSavedColors]}
        variant="inline"
      />
    </div>
  ),
};
