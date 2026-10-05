/** @jsxImportSource react */
import { createElement, type ComponentType } from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormColorPicker from '../form/FormColorPicker';
import FormDatePicker from '../form/FormDatePicker';
import FormYearPicker from '../form/FormYearPicker';
import FormDateRangePicker from '../form/FormDateRangePicker';
import FormDateTimePicker from '../form/FormDateTimePicker';
import FormFileUploadSimple from '../form/FormFileUploadSimple';
import FormCheckbox from '../form/FormCheckbox';
import FormTimePicker from '../form/FormTimePicker';
import FormTagsInput from '../form/FormTagsInput';
import FormInput from '../form/FormInput';
import FormField from '../form/FormField';
import FormFileUpload from '../form/FormFileUpload';
import SearchInput from '../data-entry/SearchInput';
import FormNumber from '../form/FormNumber';

afterEach(cleanup);

const element = (component: unknown, props: Record<string, unknown>) =>
  createElement(component as ComponentType<Record<string, unknown>>, props);

describe('form visual parity: React', () => {
  for (const state of ['disabled', 'readonly'] as const) {
    it(`preserves the number control inset while ${state}, without showing the clear action`, () => {
      const { container, rerender } = render(
        element(FormNumber, {
          id: 'number',
          name: 'number',
          defaultValue: 42,
          canErase: true,
          [state]: true,
        }),
      );
      const input = container.querySelector('input')!;
      expect(input.style.getPropertyValue('--pr')).toBe('48px');
      expect(container.querySelector('.peaui-form-field__erase-button')).toBeNull();
      rerender(
        element(FormNumber, {
          id: 'number',
          name: 'number',
          defaultValue: 42,
          canErase: false,
          [state]: true,
        }),
      );
      expect(input.style.getPropertyValue('--pr')).toBe('12px');
    });
  }

  it('forwards search control clicks once while keeping combobox attributes on the input', () => {
    const onClick = vi.fn();
    const { container } = render(
      <SearchInput
        defaultValue="Query"
        onClick={onClick}
        role="combobox"
        aria-expanded="false"
        aria-controls="results"
      />,
    );
    const wrapper = container.querySelector('.peaui-search-input')!;
    const input = container.querySelector('input')!;
    expect(wrapper.getAttribute('role')).toBe('search');
    expect(wrapper.hasAttribute('aria-expanded')).toBe(false);
    expect(wrapper.hasAttribute('aria-controls')).toBe(false);
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe('results');
    fireEvent.click(input);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('.peaui-search-input__button')!);
    expect(onClick).toHaveBeenCalledTimes(2);
    fireEvent.click(container.querySelector('.peaui-search-input__erase-button')!);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('binds a composed field control to its label, validation and native state', () => {
    const { container, rerender } = render(
      <FormField
        id="field"
        name="field"
        label="Field"
        value="Saved"
        required
        disabled
        error="Invalid"
      >
        <input aria-label="Field" />
      </FormField>,
    );
    const input = container.querySelector('input')!;
    expect(input.id).toBe('field');
    expect(input.name).toBe('field');
    expect(input.value).toBe('Saved');
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--basic')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--medium')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--disabled')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('field-error');
    rerender(
      <FormField id="field" name="field" label="Field" value="" readonly>
        <input aria-label="Field" />
      </FormField>,
    );
    expect(input.disabled).toBe(false);
    expect(input.required).toBe(false);
    expect(input.readOnly).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--normal')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--readonly')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--basic')).toBe(false);
    expect(input.classList.contains('peaui-form-field__element--error')).toBe(false);
  });

  it('preserves explicit composed control props, styles and handlers while associating its label', () => {
    const onChange = vi.fn();
    const { container } = render(
      <FormField
        id="wrapper"
        name="wrapper"
        label="Field"
        value="Wrapper"
        before="Prefix"
        description="Help"
      >
        <input
          aria-label="Field"
          id="custom"
          name="custom"
          defaultValue="Own"
          className="consumer"
          style={{ padding: 4 }}
          onChange={onChange}
        />
      </FormField>,
    );
    const input = container.querySelector('input')!;
    expect(input.id).toBe('custom');
    expect(container.querySelector('label')?.htmlFor).toBe('custom');
    expect(input.name).toBe('custom');
    expect(input.value).toBe('Own');
    expect(input.classList.contains('consumer')).toBe(true);
    expect(input.classList.contains('peaui-form-field__element--basic')).toBe(true);
    expect(input.style.padding).toBe('4px');
    expect(input.style.getPropertyValue('--pl')).not.toBe('');
    expect(input.getAttribute('aria-describedby')).toBe('custom-description');
    fireEvent.change(input, { target: { value: 'Changed' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(input.value).toBe('Changed');
  });

  it('preserves array values when the composed field control is a multiple select', () => {
    const { container, rerender } = render(
      <FormField id="field" name="field" label="Field" value={['beta']}>
        <select multiple aria-label="Field">
          <option value="alpha">Alpha</option>
          <option value="beta">Beta</option>
        </select>
      </FormField>,
    );
    const select = container.querySelector('select')!;
    expect([...select.selectedOptions].map((option) => option.value)).toEqual(['beta']);
    rerender(
      <FormField id="field" name="field" label="Field" value={['alpha', 'beta']}>
        <select multiple aria-label="Field">
          <option value="alpha">Alpha</option>
          <option value="beta">Beta</option>
        </select>
      </FormField>,
    );
    expect([...select.selectedOptions].map((option) => option.value)).toEqual(['alpha', 'beta']);
  });

  it('marks the loading color field disabled and leaves the inline panel height responsive', () => {
    const { container, rerender } = render(<FormColorPicker id="color" name="color" loading />);
    expect(container.querySelector('.peaui-form-color-picker')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(
      container.querySelector('input')?.classList.contains('peaui-form-field__element--disabled'),
    ).toBe(true);
    rerender(<FormColorPicker id="color" name="color" variant="inline" />);
    const panel = container.querySelector<HTMLElement>('[role="group"]')!;
    expect(panel.style.getPropertyValue('--peaui-form-color-picker-available-height')).toBe('');
    expect(
      container.querySelector('.peaui-form-color-picker')?.getAttribute('aria-disabled'),
    ).toBeNull();
  });

  it('uses the shared required upload message for the danger variant', () => {
    const { container } = render(<FormFileUpload variant="danger" />);
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Pole jest wymagane');
  });

  for (const [name, component] of [
    ['Input', FormInput],
    ['Color', FormColorPicker],
    ['DateRange', FormDateRangePicker],
    ['DateTime', FormDateTimePicker],
    ['Time', FormTimePicker],
  ] as const) {
    it(`hides the optional note and dims the ${name} label only while readonly`, () => {
      const props = { id: 'field', name: 'field', label: 'Field', required: false };
      const { container, rerender } = render(element(component, { ...props, readonly: true }));
      expect(container.querySelector('.peaui-form-label__optional')).toBeNull();
      expect(container.querySelector('.peaui-form-label__text--readonly')).not.toBeNull();
      rerender(element(component, { ...props, readonly: false }));
      expect(container.querySelector('.peaui-form-label__optional')).not.toBeNull();
      expect(container.querySelector('.peaui-form-label__text--readonly')).toBeNull();
    });
  }

  for (const [name, component, hintProp] of [
    ['Color', FormColorPicker, 'hintContent'],
    ['DateRange', FormDateRangePicker, 'hint'],
    ['DateTime', FormDateTimePicker, 'hint'],
    ['Time', FormTimePicker, 'hint'],
    ['Tags', FormTagsInput, 'hintContent'],
  ] as const) {
    it(`uses a styled, keyboard-accessible ${name} hint with the shared tooltip behavior`, async () => {
      const { container } = render(
        element(component, { id: 'field', name: 'field', label: 'Field', [hintProp]: 'Help' }),
      );
      expect(container.querySelector('.peaui-form-label__hint-icon path')).not.toBeNull();
      const trigger = container.querySelector<HTMLElement>('.peaui-info-tooltip[tabindex="0"]')!;
      expect(trigger).not.toBeNull();
      act(() => trigger.focus());
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 250));
      });
      expect(trigger.getAttribute('data-open')).toBe('true');
      const tooltip = container.querySelector('[role="tooltip"]')!;
      expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(tooltip.id);
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(trigger.getAttribute('data-open')).toBeNull();
    });
  }

  it('updates the native mixed checkbox state without changing its submitted value', () => {
    const props = { id: 'selection', name: 'selection', value: false };
    const { container, rerender } = render(
      element(FormCheckbox, { ...props, indeterminate: true }),
    );
    const input = container.querySelector<HTMLInputElement>('input')!;
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(false);
    rerender(element(FormCheckbox, { ...props, indeterminate: false }));
    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(false);
  });

  for (const [name, component] of [
    ['DateRange', FormDateRangePicker],
    ['DateTime', FormDateTimePicker],
  ] as const) {
    it(`keeps ${name} in the full-width popover layout used by Vue and Web Components`, () => {
      const { container } = render(element(component, { id: 'field', name: 'field' }));
      const trigger = container.querySelector('.peaui-popover-overlayer')!;
      expect(trigger.classList.contains('peaui-popover-overlayer--match-trigger-width')).toBe(true);
    });
  }

  it('shows the optional color label by default and updates it when required changes', () => {
    const { container, rerender } = render(
      <FormColorPicker id="color" name="color" label="Brand color" />,
    );
    expect(container.querySelector('.peaui-form-label__optional')?.textContent).toBe(
      '(pole niewymagane)',
    );
    rerender(<FormColorPicker id="color" name="color" label="Brand color" required />);
    expect(container.querySelector('.peaui-form-label__optional')).toBeNull();
    rerender(<FormColorPicker id="color" name="color" label="Brand color" required={false} />);
    expect(container.querySelector('.peaui-form-label__optional')).not.toBeNull();
  });

  for (const [name, component, defaultValue] of [
    ['Date', FormDatePicker, '2026-10-02'],
    ['Year', FormYearPicker, 2026],
  ] as const) {
    it(`hides the destructive ${name} clear action while readonly and restores it when editable`, () => {
      const onValueChange = vi.fn();
      const props = { id: 'field', name: 'field', defaultValue, onValueChange };
      const { container, rerender } = render(element(component, { ...props, readonly: true }));
      const input = container.querySelector<HTMLInputElement>('input:not([type=hidden])')!;
      const before = input.value;
      expect(container.querySelector('.peaui-form-field__erase-button')).toBeNull();
      expect(input.value).toBe(before);
      expect(onValueChange).not.toHaveBeenCalled();
      rerender(element(component, { ...props, readonly: false }));
      fireEvent.click(container.querySelector('.peaui-form-field__erase-button')!);
      expect(input.value).toBe('');
      expect(onValueChange).toHaveBeenCalledWith(undefined);
    });
  }

  it('separates upload format names using the same readable spacing as Vue and Web Components', () => {
    const { container } = render(<FormFileUploadSimple />);
    const description = container.querySelector('.peaui-form-file-upload-simple__description')!;
    expect(description.textContent).toContain('DOC ,PDF ,DOCX ,JPEG ,JPG ,PNG ');
  });
});
