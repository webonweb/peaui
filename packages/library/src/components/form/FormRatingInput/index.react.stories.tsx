/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  formRatingInputDemoProps,
  formRatingInputLabels,
  formRatingInputLongLabel,
} from './form-rating-input.demo';
import FormRatingInput from './index';
import type { RatingValue } from './rating-input.shared';

const { value: defaultValue, ...defaultProps } = formRatingInputDemoProps;

const meta = {
  title: 'React/form/FormRatingInput',
  component: FormRatingInput,
  args: { ...defaultProps, allowClear: true, defaultValue, step: 0.5 },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormRatingInput React ze stabilnym opisem wartości, gwiazdkami primary i identyczną semantyką suwaka jak Vue oraz Web Components.',
  },
} satisfies Meta<typeof FormRatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-rating-input-default' } };

export const FullAndHalfSteps: Story = {
  render: () => (
    <div data-rating-parity style={{ display: 'grid', gap: '1rem' }}>
      <FormRatingInput
        {...defaultProps}
        defaultValue={4}
        id="rating-full-react"
        label="Pełne oceny"
        labels={formRatingInputLabels}
      />
      <FormRatingInput
        {...defaultProps}
        defaultValue={3.5}
        id="rating-half-react"
        label="Połówkowe oceny"
        labels={formRatingInputLabels}
        step={0.5}
      />
      <FormRatingInput
        {...defaultProps}
        allowClear
        defaultValue={null}
        id="rating-empty-react"
        label="Pusta ocena"
      />
    </div>
  ),
};

export const SizesAndCustomIcon: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '.75rem' }}>
      <FormRatingInput
        {...defaultProps}
        defaultValue={3}
        id="rating-s-react"
        label="Mała"
        size="s"
      />
      <FormRatingInput {...defaultProps} defaultValue={3} id="rating-m-react" label="Średnia" />
      <FormRatingInput
        {...defaultProps}
        defaultValue={3}
        icon="core/heart"
        id="rating-l-react"
        label="Duża, własna ikona"
        size="l"
      />
    </div>
  ),
};

export const ReadonlyDisabledAndError: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <FormRatingInput {...defaultProps} defaultValue={4} id="rating-readonly-react" readonly />
      <FormRatingInput {...defaultProps} defaultValue={2} disabled id="rating-disabled-react" />
      <FormRatingInput
        {...defaultProps}
        defaultValue={null}
        error="Wybierz ocenę, aby kontynuować."
        id="rating-error-react"
        required
      />
    </div>
  ),
};

export const ControlledKeyboardAndClear: Story = {
  render: function Render() {
    const [value, setValue] = useState<RatingValue>(2.5);
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxWidth: '32rem' }}>
        <p>Użyj strzałek, Home, End oraz Delete lub Backspace.</p>
        <FormRatingInput
          {...defaultProps}
          allowClear
          id="rating-keyboard-react"
          step={0.5}
          value={value}
          onValueChange={setValue}
        />
        <output>Model: {value ?? 'brak'}</output>
      </div>
    );
  },
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    dataTestId: 'form-rating-input-mobile',
    defaultValue: 7,
    label: formRatingInputLongLabel,
    max: 10,
  },
};

export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
};
