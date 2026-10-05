/** @jsxImportSource react */
import { createElement, type ComponentType } from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormButtonGroup from '../form/FormButtonGroup';
import SegmentedControl from '../data-entry/SegmentedControl';
import FormDatePicker from '../form/FormDatePicker';
import FormYearPicker from '../form/FormYearPicker';
import FormColorPicker from '../form/FormColorPicker';
import FormTimePicker from '../form/FormTimePicker';
import FormDateTimePicker from '../form/FormDateTimePicker';
import FormDateRangePicker from '../form/FormDateRangePicker';
import FormPinInput from '../form/FormPinInput';
import FormRatingInput from '../form/FormRatingInput';
import FormTagsInput from '../form/FormTagsInput';
import FormContainer from '../form/FormContainer';
import FormCheckbox from '../form/FormCheckbox';
import FormButtonCheckbox from '../form/FormButtonCheckbox';
import FormRadio from '../form/FormRadio';
import FormTextarea from '../form/FormTextarea';
import InputSlider from '../data-entry/InputSlider';

afterEach(cleanup);
const element = (component: unknown, props: Record<string, unknown>) =>
  createElement(component as ComponentType<Record<string, unknown>>, props);
const options = [
  { key: 'a', value: 'a', label: 'Alpha' },
  { key: 'b', value: 'b', label: 'Beta' },
];
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('form integration: React', () => {
  for (const [name, component, defaultValue] of [
    ['Color', FormColorPicker, '#4C9A2A'],
    ['Time', FormTimePicker, '10:30'],
    ['DateTime', FormDateTimePicker, { date: '2026-10-02', time: '10:30' }],
    ['DateRange', FormDateRangePicker, ['2026-10-02', '2026-10-05']],
  ] as const) {
    it(`V-F01 resets a controlled ${name} draft while preserving the owner value`, async () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <form>{element(component, { name: 'field', value: defaultValue, onValueChange })}</form>,
      );
      const input = container.querySelector<HTMLInputElement>(
        'input:not([type=hidden]):not([aria-hidden=true])',
      )!;
      const before = input.value;
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);
      onValueChange.mockClear();
      await act(async () => {
        container.querySelector('form')!.reset();
        await settle();
      });
      expect(input.value).toBe(before);
      expect(onValueChange).not.toHaveBeenCalled();
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });
    it(`V-F01 resets an uncommitted invalid ${name} draft even when model is unchanged`, async () => {
      const { container } = render(
        <form>{element(component, { name: 'field', defaultValue })}</form>,
      );
      const input = container.querySelector<HTMLInputElement>(
        'input:not([type=hidden]):not([aria-hidden=true])',
      )!;
      const before = input.value;
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);
      expect(input.value).not.toBe(before);
      await act(async () => {
        container.querySelector('form')!.reset();
        await settle();
      });
      expect(input.value).toBe(before);
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });
  }
  for (const [name, component, initial, changed] of [
    ['ButtonGroup', FormButtonGroup, 'a', 'b'],
    ['SegmentedControl', SegmentedControl, 'a', 'b'],
    ['Date', FormDatePicker, '2026-10-02', ''],
    ['Year', FormYearPicker, 2026, ''],
    ['Color', FormColorPicker, '#4c9a2a', '#ff0000'],
    ['Time', FormTimePicker, '10:30', '16:30'],
    ['DateTime', FormDateTimePicker, { date: '2026-10-02', time: '10:30' }, '03.01.2027 16:30'],
    ['DateRange', FormDateRangePicker, ['2026-10-02', '2026-10-05'], '03.01.2027'],
  ] as const) {
    it(`V-F01 restores ${name} after edit, canceled reset, reset and rerender`, async () => {
      const props = { id: 'field', name: 'field', defaultValue: initial, options, items: options };
      const content = (extra = {}) => <form>{element(component, { ...props, ...extra })}</form>;
      const { container, rerender, getByRole } = render(content());
      const form = container.querySelector('form')!;
      const before = [...new FormData(form)];
      const input = container.querySelector<HTMLInputElement>(
        'input:not([type=hidden]):not([aria-hidden=true])',
      );
      if (name === 'ButtonGroup' || name === 'SegmentedControl')
        fireEvent.click(getByRole('radio', { name: 'Beta' }));
      else if (name === 'Date' || name === 'Year') {
        fireEvent.keyDown(input!, { key: 'ArrowDown' });
        await act(settle);
        const choice = container.querySelector<HTMLElement>(
          '[data-picker-option]:not([data-selected=true]):not(:disabled)',
        )!;
        fireEvent.click(choice);
      } else {
        fireEvent.change(input!, { target: { value: changed } });
        fireEvent.blur(input!);
      }
      await act(settle);
      const edited = [...new FormData(form)];
      expect(edited).not.toEqual(before);
      form.addEventListener('reset', (event) => event.preventDefault(), { once: true });
      await act(async () => {
        form.reset();
        await settle();
      });
      expect([...new FormData(form)]).toEqual(edited);
      await act(async () => {
        form.reset();
        await settle();
      });
      rerender(content({ dataTestId: 'updated' }));
      expect([...new FormData(form)]).toEqual(before);
    });
  }
  it('V-F03 validates segmented time and omits disabled values', () => {
    const content = (props = {}) => (
      <form>
        {element(FormTimePicker, { name: 'time', variant: 'segmented', required: true, ...props })}
      </form>
    );
    const { container, rerender } = render(content());
    const form = container.querySelector('form')!;
    expect(form.checkValidity()).toBe(false);
    rerender(content({ value: '10:30' }));
    expect(form.checkValidity()).toBe(true);
    rerender(content({ value: '10:30', disabled: true }));
    expect([...new FormData(form)]).toEqual([]);
    rerender(content({ readonly: true }));
    expect(form.checkValidity()).toBe(true);
  });
  it('V-F04 split date-time enforces required and serializes the common name', () => {
    const content = (props = {}) => (
      <form>
        {element(FormDateTimePicker, {
          name: 'when',
          variant: 'split-input',
          required: true,
          ...props,
        })}
      </form>
    );
    const { container, rerender } = render(content());
    const form = container.querySelector('form')!;
    expect(form.checkValidity()).toBe(false);
    rerender(content({ value: { date: '2026-10-02', time: '10:30' } }));
    expect([...new FormData(form)]).toEqual([
      ['when', '02.10.2026'],
      ['when', '10:30'],
    ]);
  });
  for (const [name, component, initial, selector, changed] of [
    ['Pin', FormPinInput, '123456', 'input:not([type=hidden])', '9'],
    ['Tags', FormTagsInput, ['Alpha'], 'input:not([type=hidden])', 'Beta'],
    ['Rating', FormRatingInput, 2, 'input[type=range]', '3'],
  ] as const) {
    it(`V-F05 associates ${name} interaction and reset with an external form`, async () => {
      const { container } = render(
        <>
          <form id="owner" />
          {element(component, { name: 'field', form: 'owner', defaultValue: initial })}
        </>,
      );
      const form = container.querySelector('form')!;
      const before = [...new FormData(form)];
      const input = container.querySelector<HTMLInputElement>(selector)!;
      expect(input.form).toBe(form);
      if (name === 'Pin') fireEvent.input(input, { target: { value: changed } });
      else fireEvent.change(input, { target: { value: changed } });
      if (name === 'Tags') fireEvent.keyDown(input, { key: 'Enter' });
      expect([...new FormData(form)]).not.toEqual(before);
      await act(async () => {
        form.reset();
        await settle();
      });
      expect([...new FormData(form)]).toEqual(before);
    });
  }
  it('V-F07 prevents disabled or loading form submission from any submission path', () => {
    const onSubmit = vi.fn();
    const { container, rerender } = render(element(FormContainer, { disabled: true, onSubmit }));
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(element(FormContainer, { isLoading: true, onSubmit }));
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
    rerender(element(FormContainer, { onSubmit }));
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledOnce();
  });
  for (const [name, component] of [
    ['Time', FormTimePicker],
    ['DateTime', FormDateTimePicker],
  ] as const) {
    it(`V-F08 supplies a focusable, dismissible hint for ${name}`, async () => {
      const { container } = render(
        element(component, { name: 'field', label: 'Field', hint: 'Help' }),
      );
      const trigger = container.querySelector<HTMLElement>('[aria-label="Dodatkowa informacja"]');
      expect(trigger).not.toBeNull();
      act(() => trigger!.focus());
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 250));
      });
      expect(container.querySelector('.peaui-info-tooltip[data-open="true"]')).not.toBeNull();
      fireEvent.keyDown(trigger!, { key: 'Escape' });
      expect(container.querySelector('.peaui-info-tooltip[data-open="true"]')).toBeNull();
    });
  }
  it('V-F09 uses active option consistently for selection, required and submission', () => {
    const { container, getByRole } = render(
      <form>
        {element(FormButtonGroup, {
          name: 'choice',
          required: true,
          options: [
            { key: 'a', label: 'Alpha', active: true },
            { key: 'b', label: 'Beta', active: true },
          ],
        })}
      </form>,
    );
    expect(getByRole('radio', { name: 'Alpha' }).getAttribute('aria-checked')).toBe('true');
    expect(getByRole('radio', { name: 'Beta' }).getAttribute('aria-checked')).toBe('false');
    expect(container.querySelector('form')!.checkValidity()).toBe(true);
    expect([...new FormData(container.querySelector('form')!)]).toEqual([['choice', 'a']]);
  });
  it('V-F09 permits toggling an active default off and clearing a controlled model', async () => {
    const props = {
      name: 'choice',
      isToggle: true,
      options: [{ key: 'a', label: 'Alpha', active: true }],
    };
    const { container, getByRole, rerender } = render(
      <form>{element(FormButtonGroup, props)}</form>,
    );
    fireEvent.click(getByRole('radio', { name: 'Alpha' }));
    expect(getByRole('radio').getAttribute('aria-checked')).toBe('false');
    await act(async () => {
      container.querySelector('form')!.reset();
      await settle();
    });
    expect(getByRole('radio').getAttribute('aria-checked')).toBe('true');
    rerender(<form>{element(FormButtonGroup, { ...props, value: undefined })}</form>);
    expect(getByRole('radio').getAttribute('aria-checked')).toBe('false');
  });
  for (const component of [FormCheckbox, FormButtonCheckbox, FormRadio]) {
    it(`V-F10 supports Enter in ${component.displayName}`, () => {
      const { container } = render(element(component, { name: 'choice', optionValue: 'a' }));
      const input = container.querySelector('input')!;
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input.checked).toBe(true);
    });
  }
  it('V-F11 defaults textarea to five rows', () => {
    const { container } = render(<FormTextarea id="text" name="text" />);
    expect(container.querySelector('textarea')!.rows).toBe(5);
  });
  it('V-F12 forwards sizeButton to both actions', () => {
    const { container } = render(element(FormContainer, { sizeButton: 'l' }));
    expect(
      container.querySelectorAll(
        '.peaui-form-container__actions-button.peaui-button-action--size-l',
      ),
    ).toHaveLength(2);
  });
  it('V-F14 assigns id only to the labelable native slider', () => {
    const { container } = render(
      <>
        <label htmlFor="slider">Volume</label>
        <InputSlider id="slider" name="volume" />
      </>,
    );
    expect(container.querySelectorAll('#slider')).toHaveLength(1);
    expect(container.querySelector('label')!.control).toBe(container.querySelector('input'));
  });
  it('V-F13 filters large tag suggestions with a linear number of identity reads', () => {
    const tags = Array.from({ length: 200 }, (_, i) => ({ id: i, label: `Tag ${i}` }));
    const suggestions = Array.from({ length: 200 }, (_, i) => ({
      id: i + 200,
      label: `Next ${i}`,
    }));
    const getTagKey = vi.fn((tag: { id: number }) => tag.id);
    const { container } = render(
      element(FormTagsInput, { name: 'tags', value: tags, suggestions, getTagKey }),
    );
    fireEvent.focus(container.querySelector('input:not([type=hidden])')!);
    expect(getTagKey.mock.calls.length).toBeLessThan(6000);
  });
});
