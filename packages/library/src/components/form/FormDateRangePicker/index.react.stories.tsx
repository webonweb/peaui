/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  formDateRangePickerDemoProps,
  formDateRangePickerDemoValue,
  formDateRangePickerLongLabel,
} from './form-date-range-picker.demo';
import FormDateRangePicker from './index';
import type { DateRangeValue } from './date-range-picker.shared';

const { value: defaultValue, ...defaultProps } = formDateRangePickerDemoProps;

const meta = {
  title: 'React/form/FormDateRangePicker',
  component: FormDateRangePicker,
  args: { ...defaultProps, defaultValue },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormDateRangePicker React z identycznym modelem, kompaktowymi presetami xxs, systemowymi akcjami xs, ARIA, klawiaturą i responsywnością jak Vue i Web Components.',
  },
} satisfies Meta<typeof FormDateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-date-range-picker-default' } };

export const VariantsAndCalendars: Story = {
  render: () => (
    <div
      data-date-range-picker-parity
      style={{
        alignItems: 'start',
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))',
      }}
    >
      <FormDateRangePicker {...formDateRangePickerDemoProps} id="range-two-react" />
      <FormDateRangePicker
        {...formDateRangePickerDemoProps}
        id="range-single-react"
        label="Jedno pole"
        variant="single-input"
      />
      <FormDateRangePicker
        {...formDateRangePickerDemoProps}
        calendars={1}
        id="range-calendar-react"
        label="Jeden kalendarz"
      />
    </div>
  ),
};

export const ConfirmBoundariesAndPresets: Story = {
  args: { confirm: true, defaultOpen: true, maxDate: '2026-08-31', minDate: '2026-08-01' },
};

export const SelectionPolicies: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,20rem),1fr))',
      }}
    >
      <FormDateRangePicker
        {...defaultProps}
        dateFormat="iso"
        id="range-swap-react"
        label="Swap"
        selectionOrder="swap"
        variant="single-input"
      />
      <FormDateRangePicker
        {...defaultProps}
        dateFormat="iso"
        id="range-reject-react"
        label="Reject"
        selectionOrder="reject"
        variant="single-input"
      />
      <FormDateRangePicker
        {...defaultProps}
        dateFormat="iso"
        id="range-reset-react"
        label="Reset końca"
        selectionOrder="resetEnd"
        variant="single-input"
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,20rem),1fr))',
      }}
    >
      <FormDateRangePicker
        {...defaultProps}
        defaultValue={undefined}
        id="range-required-react"
        label="Wymagany zakres"
        required
      />
      <FormDateRangePicker
        {...formDateRangePickerDemoProps}
        error="Zakres koliduje z zamkniętym okresem."
        id="range-error-react"
      />
      <FormDateRangePicker {...formDateRangePickerDemoProps} id="range-readonly-react" readonly />
      <FormDateRangePicker {...formDateRangePickerDemoProps} id="range-loading-react" loading />
      <FormDateRangePicker {...formDateRangePickerDemoProps} disabled id="range-disabled-react" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>();
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '34rem' }}>
        <FormDateRangePicker
          id="range-controlled-react"
          label="Kontrolowany zakres"
          name="rangeControlled"
          open={open}
          value={value}
          onOpenChange={setOpen}
          onValueChange={setValue}
        />
        <output>
          Wartość: {value?.filter(Boolean).join(' – ') || 'brak'}; panel:{' '}
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
      data-date-range-picker-mobile
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' }}
    >
      <FormDateRangePicker
        dataTestId="form-date-range-picker-mobile"
        defaultValue={formDateRangePickerDemoValue}
        id="range-mobile-react"
        label={formDateRangePickerLongLabel}
        name="rangeMobile"
      />
    </div>
  ),
};
