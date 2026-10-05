/** @jsxImportSource react */
import { createElement, type ComponentType } from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormTextarea from '../form/FormTextarea';
import FormPinInput from '../form/FormPinInput';
import FormRatingInput from '../form/FormRatingInput';
import FormSwitchToggle from '../form/FormSwitchToggle';
import FormTagsInput from '../form/FormTagsInput';
import FormDatePicker from '../form/FormDatePicker';
import FormYearPicker from '../form/FormYearPicker';
import FormButtonGroup from '../form/FormButtonGroup';
import FormDateRangePicker from '../form/FormDateRangePicker';
import FormColorPicker from '../form/FormColorPicker';
import FormDateTimePicker from '../form/FormDateTimePicker';
import FormTimePicker from '../form/FormTimePicker';
import FormContainer from '../form/FormContainer';
import InputSlider from '../data-entry/InputSlider';
import ToggleGroup from '../data-entry/ToggleGroup';

afterEach(cleanup);
const element = (component: unknown, props: Record<string, unknown>) =>
  createElement(component as ComponentType<Record<string, unknown>>, props);
const options = [{ key: 'a', value: 'a', label: 'Alpha' }];

describe('form accessibility regressions: React', () => {
  it('F02 keeps the native slider and buttons within the same default range', () => {
    const { container } = render(<InputSlider name="slider" defaultValue={0.5} />);
    const input = container.querySelector('input')!;
    expect([input.min, input.max, input.step, input.value]).toEqual(['0', '1', '0.1', '0.5']);
    input.stepUp();
    expect(input.value).toBe('0.6');
  });
  it('F03 omits disabled date ranges from FormData', () => {
    const { container } = render(
      <form>
        <FormDateRangePicker
          id="dates"
          name="dates"
          value={['2026-10-02', '2026-10-05']}
          disabled
        />
      </form>,
    );
    expect([...new FormData(container.querySelector('form')!)]).toEqual([]);
  });
  for (const variant of ['single-input', 'two-inputs'] as const) {
    it(`F03 submits only canonical date endpoints for ${variant}`, () => {
      const { container } = render(
        <form>
          <FormDateRangePicker
            id="dates"
            name="dates"
            value={['2026-10-02', '2026-10-05']}
            variant={variant}
          />
        </form>,
      );
      expect([...new FormData(container.querySelector('form')!)]).toEqual([
        ['dates.start', '2026-10-02'],
        ['dates.end', '2026-10-05'],
      ]);
    });
  }
  for (const [name, component, initial, selector, change] of [
    ['Textarea', FormTextarea, 'Alpha', 'textarea', 'Beta'],
    ['Pin', FormPinInput, '123456', 'input:not([type=hidden])', '9'],
    ['Rating', FormRatingInput, 2, 'input[type=range]', '3'],
    ['Switch', FormSwitchToggle, false, 'input[type=checkbox]', true],
    ['Tags', FormTagsInput, ['a'], 'input:not([type=hidden])', 'new'],
  ] as const) {
    it(`F04 restores ${name} default model after native reset and rerender`, async () => {
      const props = { id: 'field', name: 'field', defaultValue: initial };
      const content = (extra = {}) => <form>{element(component, { ...props, ...extra })}</form>;
      const { container, rerender } = render(content());
      const form = container.querySelector('form')!;
      const initialData = [...new FormData(form)];
      const control = container.querySelector<HTMLInputElement>(selector)!;
      if (name === 'Switch') fireEvent.click(control);
      else if (name === 'Pin') fireEvent.input(control, { target: { value: change } });
      else fireEvent.change(control, { target: { value: change } });
      if (name === 'Tags') fireEvent.keyDown(control, { key: 'Enter' });
      expect([...new FormData(form)]).not.toEqual(initialData);
      await act(async () => {
        form.reset();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      });
      rerender(content({ dataTestId: 'unrelated' }));
      expect([...new FormData(form)]).toEqual(initialData);
    });
  }
  it('F07 forwards native textarea attributes and handlers', () => {
    const { container } = render(
      <FormTextarea id="address" name="address" minLength={5} autoComplete="street-address" />,
    );
    const textarea = container.querySelector('textarea')!;
    expect(textarea.minLength).toBe(5);
    expect(textarea.autocomplete).toBe('street-address');
  });
  for (const [name, component] of [
    ['Color', FormColorPicker],
    ['DateTime', FormDateTimePicker],
    ['Time', FormTimePicker],
  ] as const) {
    it(`F08 honors the standard aria-label on ${name}`, () => {
      const { container } = render(
        element(component, { name: 'machine', 'aria-label': 'Accessible name' }),
      );
      expect(computeAccessibleName(container.querySelector('input[type=text]')!)).toBe(
        'Accessible name',
      );
    });
  }
  it('F09 opens and dismisses ColorPicker help on focus and Escape', async () => {
    const { container } = render(
      <FormColorPicker id="color" name="color" label="Color" hintContent="Help text" />,
    );
    const trigger = container.querySelector<HTMLElement>('[aria-label="Dodatkowa informacja"]')!;
    act(() => trigger.focus());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(container.querySelector('.peaui-info-tooltip[data-open="true"]')).not.toBeNull();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(container.querySelector('.peaui-info-tooltip[data-open="true"]')).toBeNull();
  });
  for (const [name, component, value] of [
    ['Date', FormDatePicker, '2026-10-02'],
    ['Year', FormYearPicker, 2026],
    ['Rating', FormRatingInput, 2],
    ['ButtonGroup', FormButtonGroup, 'a'],
    ['ToggleGroup', ToggleGroup, 'a'],
  ] as const) {
    it(`F10 enforces required ${name} and exempts disabled/readonly`, () => {
      const props = { id: 'field', name: 'field', required: true, options, items: options };
      const content = (extra = {}) => <form>{element(component, { ...props, ...extra })}</form>;
      const { container, rerender } = render(content());
      const form = container.querySelector('form')!;
      expect(form.checkValidity()).toBe(false);
      expect(document.activeElement).not.toBe(document.body);
      expect(document.activeElement?.getAttribute('aria-hidden')).not.toBe('true');
      rerender(content({ value }));
      expect(form.checkValidity()).toBe(true);
      rerender(content({ disabled: true }));
      expect(form.checkValidity()).toBe(true);
      rerender(content({ readonly: true }));
      expect(form.checkValidity()).toBe(true);
    });
  }
  it('F11 exposes the same default cancel action and action placement', () => {
    const { container, getByRole } = render(<FormContainer label="Form" />);
    expect(getByRole('button', { name: 'Anuluj' })).toBeTruthy();
    expect(container.querySelector('.peaui-form-container--bottom-left')).not.toBeNull();
  });
  it('F12 resets a group after its last selected value disappears', async () => {
    const content = (extra = {}) => (
      <form>
        <ToggleGroup name="choice" defaultValue="a" items={options} allowEmpty {...extra} />
      </form>
    );
    const { container, rerender, getByRole } = render(content());
    const form = container.querySelector('form')!;
    fireEvent.click(getByRole('button', { name: 'Alpha' }));
    expect([...new FormData(form)]).toEqual([]);
    await act(async () => {
      form.reset();
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    });
    rerender(content({ dataTestId: 'unrelated' }));
    expect([...new FormData(form)]).toEqual([['choice', 'a']]);
  });
});
