/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import FormTimePicker from './index';
import { formTimePickerDemoProps, formTimePickerLongLabel } from './form-time-picker.demo';

const meta = {
  title: 'React/form/FormTimePicker',
  component: FormTimePicker,
  args: {
    defaultValue: formTimePickerDemoProps.value,
    description: formTimePickerDemoProps.description,
    id: formTimePickerDemoProps.id,
    label: formTimePickerDemoProps.label,
    max: formTimePickerDemoProps.max,
    min: formTimePickerDemoProps.min,
    minuteStep: formTimePickerDemoProps.minuteStep,
    name: formTimePickerDemoProps.name,
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormTimePicker React współdzielący model czasu, klasy CSS, kontrakt ARIA i klawiaturę z Vue oraz Web Components.',
  },
} satisfies Meta<typeof FormTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-time-picker-default' } };

export const VariantsAndPanels: Story = {
  render: () => (
    <div
      data-time-picker-parity
      style={{
        alignItems: 'start',
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      }}
    >
      <FormTimePicker
        defaultValue="09:30"
        id="time-input-react"
        label="Pole tekstowe"
        name="timeInput"
      />
      <FormTimePicker
        defaultValue="09:30"
        id="time-segmented-react"
        label="Segmenty"
        name="timeSegmented"
        variant="segmented"
      />
      <FormTimePicker
        defaultValue="09:30"
        id="time-spin-react"
        label="Panel spinbutton"
        name="timeSpin"
        panelMode="spinbutton"
      />
    </div>
  ),
};

export const TwelveHourWithSeconds: Story = {
  args: {
    defaultValue: '13:05:09',
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
  },
};

export const ValidationAndStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      }}
    >
      <FormTimePicker id="time-required-react" label="Wymagany czas" name="timeRequired" required />
      <FormTimePicker
        defaultValue="07:30"
        error="Godzina musi mieścić się w godzinach pracy."
        id="time-error-react"
        label="Błąd zewnętrzny"
        name="timeError"
      />
      <FormTimePicker
        defaultValue="09:30"
        id="time-readonly-react"
        label="Tylko do odczytu"
        name="timeReadonly"
        readonly
      />
      <FormTimePicker
        defaultValue="09:30"
        id="time-loading-react"
        label="Ładowanie"
        loading
        name="timeLoading"
      />
      <FormTimePicker
        defaultValue="09:30"
        disabled
        id="time-disabled-react"
        label="Niedostępny"
        name="timeDisabled"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '22rem' }}>
        <FormTimePicker
          id="time-controlled-react"
          label="Kontrolowany czas"
          name="timeControlled"
          open={open}
          value={value}
          onOpenChange={setOpen}
          onValueChange={setValue}
        />
        <output>
          Wartość: {value ?? 'brak'}; panel: {open ? 'otwarty' : 'zamknięty'}
        </output>
      </div>
    );
  },
};

export const CustomOptions: Story = {
  args: {
    defaultOpen: true,
    footerContent: <button type="button">Gotowe</button>,
    renderHourOption: (option, selected) => `${option.label}${selected ? ' — wybrana' : ''}`,
  },
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div
      data-time-picker-mobile
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '18rem' }}
    >
      <FormTimePicker
        dataTestId="form-time-picker-mobile"
        defaultValue="09:30"
        id="time-mobile-react"
        label={formTimePickerLongLabel}
        name="timeMobile"
      />
    </div>
  ),
};
