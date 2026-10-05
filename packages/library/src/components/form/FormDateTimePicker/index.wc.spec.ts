import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormDateTimePicker, FormDateTimePickerElement } from './index.wc';
import type { LocalDateTimeValue } from './date-time-picker.shared';

type FormDateTimePickerTestElement = InstanceType<typeof FormDateTimePickerElement> & {
  confirm: boolean;
  dateFormat: 'iso' | 'locale';
  description: string;
  disabled: boolean;
  id: string;
  label: string;
  loading: boolean;
  name: string;
  open: boolean;
  readonly: boolean;
  showTimeZone: boolean;
  timeZone: string;
  value: LocalDateTimeValue | undefined;
  variant: 'single-input' | 'split-input';
};

const initialValue: LocalDateTimeValue = { date: '2026-08-18', time: '09:30' };

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

if (!HTMLElement.prototype.showPopover) {
  Object.defineProperty(HTMLElement.prototype, 'showPopover', {
    configurable: true,
    value(this: HTMLElement) {
      const event = new Event('toggle') as Event & { newState: 'open' | 'closed' };
      event.newState = 'open';
      this.dispatchEvent(event);
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    value(this: HTMLElement) {
      const event = new Event('toggle') as Event & { newState: 'open' | 'closed' };
      event.newState = 'closed';
      this.dispatchEvent(event);
    },
  });
}

function createPicker(
  properties: Partial<FormDateTimePickerTestElement> = {},
): FormDateTimePickerTestElement {
  const element = document.createElement(
    FormDateTimePickerElement.tagName,
  ) as FormDateTimePickerTestElement;
  Object.assign(
    element,
    {
      id: 'meeting-date-time-wc',
      label: 'Termin spotkania',
      name: 'meetingDateTime',
      value: initialValue,
    },
    properties,
  );
  document.body.append(element);
  return element;
}

function getInput(element: FormDateTimePickerTestElement): HTMLInputElement {
  return element.querySelector('[role="combobox"]') as HTMLInputElement;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormDateTimePicker Web Component', () => {
  it('rejestruje light-DOM element z kompletną semantyką pola', async () => {
    expect(defineFormDateTimePicker()).toBe(FormDateTimePickerElement);
    expect(customElements.get(FormDateTimePickerElement.tagName)).toBe(FormDateTimePickerElement);
    const element = createPicker({ description: 'Czas lokalny' });
    await flush();
    const input = getInput(element);
    expect(input).toHaveAccessibleName(/^Termin spotkania/);
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-controls', 'meeting-date-time-wc-control-panel');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveValue('18.08.2026 09:30');
  });

  it('synchronizuje ręczny wpis z property bez konwersji czasu', async () => {
    const element = createPicker({ dateFormat: 'iso', timeZone: 'Europe/Warsaw' });
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();
    const input = getInput(element);
    input.value = '2026-10-25 02:30';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await flush();
    expect(element.value).toEqual({ date: '2026-10-25', time: '02:30' });
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual({
      date: '2026-10-25',
      time: '02:30',
    });
  });

  it('otwiera wspólny panel i publikuje wybór obu sekcji', async () => {
    const element = createPicker({ showTimeZone: true });
    const onDate = vi.fn();
    const onTime = vi.fn();
    element.addEventListener('dateChange', onDate);
    element.addEventListener('timeChange', onTime);
    await flush();
    getInput(element).click();
    await flush();
    expect(element.open).toBe(true);
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAccessibleName('Wybierz datę i czas');
    expect(dialog.querySelector('[role="grid"]')).toBeInTheDocument();
    expect(dialog.querySelectorAll('[role="spinbutton"]')).toHaveLength(2);
    (dialog.querySelector('[data-date="2026-08-20"]') as HTMLButtonElement).click();
    await flush();
    expect((onDate.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('2026-08-20');
    (dialog.querySelector('button[aria-label="Zwiększ: godzina"]') as HTMLButtonElement).click();
    await flush();
    expect((onTime.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('10:30');
    expect(element.value).toEqual({ date: '2026-08-20', time: '10:30' });
  });

  it('w trybie confirm zatwierdza dopiero kompletny szkic', async () => {
    const element = createPicker({ confirm: true });
    const onApply = vi.fn();
    element.addEventListener('apply', onApply);
    await flush();
    getInput(element).click();
    await flush();
    (element.querySelector('[data-date="2026-08-20"]') as HTMLButtonElement).click();
    await flush();
    expect(element.value).toEqual(initialValue);
    (
      element.querySelector('.peaui-form-date-time-picker__button--primary') as HTMLButtonElement
    ).click();
    await flush();
    expect(element.value).toEqual({ date: '2026-08-20', time: '09:30' });
    expect((onApply.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual({
      date: '2026-08-20',
      time: '09:30',
    });
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje panel w stanie %s',
    async (state) => {
      const element = createPicker({ [state]: true });
      await flush();
      const input = getInput(element);
      input.click();
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      await flush();
      expect(element.open).not.toBe(true);
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
    },
  );
});
