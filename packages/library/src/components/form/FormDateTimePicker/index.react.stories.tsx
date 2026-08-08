/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  formDateTimePickerDemoProps,
  formDateTimePickerDemoValue,
  formDateTimePickerLongLabel,
} from './form-date-time-picker.demo';
import FormDateTimePicker from './index';
import type { LocalDateTimeValue } from './date-time-picker.shared';

const { value: formDateTimePickerDefaultValue, ...formDateTimePickerDefaultProps } =
  formDateTimePickerDemoProps;

const meta = {
  title: 'React/form/FormDateTimePicker',
  component: FormDateTimePicker,
  args: {
    ...formDateTimePickerDefaultProps,
    defaultValue: formDateTimePickerDefaultValue,
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormDateTimePicker React ze wspólnym modelem, klasami CSS, ARIA, klawiaturą i responsywnością jak Vue i Web Components.',
  },
} satisfies Meta<typeof FormDateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-date-time-picker-default' } };

export const InputAndLayoutVariants: Story = {
  render: () => (
    <div
      data-date-time-picker-parity
      style={{
        alignItems: 'start',
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))',
      }}
    >
      <FormDateTimePicker {...formDateTimePickerDemoProps} id="date-time-single-react" />
      <FormDateTimePicker
        {...formDateTimePickerDemoProps}
        id="date-time-split-react"
        label="Dwa pola"
        variant="split-input"
      />
      <FormDateTimePicker
        {...formDateTimePickerDemoProps}
        id="date-time-stacked-react"
        label="Panel pionowy"
        layout="stacked"
      />
    </div>
  ),
};

export const ConfirmAndBoundaries: Story = {
  args: {
    confirm: true,
    defaultOpen: true,
    max: { date: '2026-08-20', time: '17:00' },
    min: { date: '2026-08-18', time: '09:00' },
  },
};

export const TwelveHourWithSeconds: Story = {
  args: {
    defaultValue: { date: '2026-08-18', time: '13:05:09' },
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    timeZone: 'America/New_York',
  },
};

export const ValidationAndStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,20rem),1fr))',
      }}
    >
      <FormDateTimePicker {...formDateTimePickerDemoProps} value={undefined} required />
      <FormDateTimePicker
        {...formDateTimePickerDemoProps}
        error="Termin koliduje z innym spotkaniem."
        id="date-time-error-react"
      />
      <FormDateTimePicker {...formDateTimePickerDemoProps} id="date-time-readonly-react" readonly />
      <FormDateTimePicker {...formDateTimePickerDemoProps} id="date-time-loading-react" loading />
      <FormDateTimePicker {...formDateTimePickerDemoProps} disabled id="date-time-disabled-react" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<LocalDateTimeValue>();
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '32rem' }}>
        <FormDateTimePicker
          id="date-time-controlled-react"
          label="Kontrolowany termin"
          name="dateTimeControlled"
          open={open}
          value={value}
          onOpenChange={setOpen}
          onValueChange={setValue}
        />
        <output>
          Wartość: {value ? `${value.date} ${value.time}` : 'brak'}; panel:{' '}
          {open ? 'otwarty' : 'zamknięty'}
        </output>
      </div>
    );
  },
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div
      data-date-time-picker-mobile
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' }}
    >
      <FormDateTimePicker
        dataTestId="form-date-time-picker-mobile"
        defaultValue={formDateTimePickerDemoValue}
        id="date-time-mobile-react"
        label={formDateTimePickerLongLabel}
        name="dateTimeMobile"
        variant="split-input"
      />
    </div>
  ),
};
