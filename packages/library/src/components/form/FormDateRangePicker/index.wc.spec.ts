import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormDateRangePicker, FormDateRangePickerElement } from './index.wc';
import type { DateRangePreset, DateRangeValue } from './date-range-picker.shared';

type TestElement = InstanceType<typeof FormDateRangePickerElement> & {
  calendars: 1 | 2;
  confirm: boolean;
  dateFormat: 'iso' | 'locale';
  disabled: boolean;
  id: string;
  isDateDisabled?: (date: string) => boolean;
  label: string;
  loading: boolean;
  name: string;
  open: boolean;
  presets: DateRangePreset[];
  readonly: boolean;
  selectionOrder: 'swap' | 'reject' | 'resetEnd';
  value: DateRangeValue | undefined;
  variant: 'single-input' | 'two-inputs';
};

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

function createPicker(properties: Partial<TestElement> = {}): TestElement {
  const element = document.createElement(FormDateRangePickerElement.tagName) as TestElement;
  Object.assign(
    element,
    {
      calendars: 1,
      id: 'report-range-wc',
      label: 'Zakres raportu',
      name: 'reportRange',
    },
    properties,
  );
  document.body.append(element);
  return element;
}

function getStart(element: TestElement): HTMLInputElement {
  return element.querySelector('[role="combobox"]') as HTMLInputElement;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormDateRangePicker Web Component', () => {
  it('rejestruje light-DOM element z kompletnymi relacjami ARIA', async () => {
    expect(defineFormDateRangePicker()).toBe(FormDateRangePickerElement);
    expect(customElements.get(FormDateRangePickerElement.tagName)).toBe(FormDateRangePickerElement);
    const element = createPicker({ value: ['2026-08-10', '2026-08-18'] });
    await flush();
    const inputs = element.querySelectorAll('[role="combobox"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAccessibleName('Data początkowa');
    expect(inputs[1]).toHaveAccessibleName('Data końcowa');
    expect(inputs[0]).toHaveAttribute('aria-controls', 'report-range-wc-panel');
  });

  it('synchronizuje property value po ręcznym wpisie', async () => {
    const element = createPicker({ dateFormat: 'iso', variant: 'single-input' });
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();
    const input = getStart(element);
    input.value = '2026-08-25 – 2026-08-20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await flush();
    expect(element.value).toEqual(['2026-08-20', '2026-08-25']);
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual([
      '2026-08-20',
      '2026-08-25',
    ]);
  });

  it('otwiera panel i publikuje wybór obu końców', async () => {
    const element = createPicker();
    const onStart = vi.fn();
    const onEnd = vi.fn();
    element.addEventListener('startChange', onStart);
    element.addEventListener('endChange', onEnd);
    await flush();
    getStart(element).click();
    await flush();
    expect(element.open).toBe(true);
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAccessibleName('Wybierz zakres dat');
    expect(dialog.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    (dialog.querySelector('[data-date="2026-08-10"]') as HTMLButtonElement).click();
    await flush();
    (dialog.querySelector('[data-date="2026-08-18"]') as HTMLButtonElement).click();
    await flush();
    expect((onStart.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('2026-08-10');
    expect((onEnd.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('2026-08-18');
    expect(element.value).toEqual(['2026-08-10', '2026-08-18']);
  });

  it('w trybie confirm przywraca szkic po cancel i zatwierdza apply', async () => {
    const initial: DateRangeValue = ['2026-08-10', '2026-08-18'];
    const element = createPicker({ confirm: true, value: initial });
    const onApply = vi.fn();
    element.addEventListener('apply', onApply);
    await flush();
    getStart(element).click();
    await flush();
    (element.querySelector('[data-date="2026-08-20"]') as HTMLButtonElement).click();
    await flush();
    (element.querySelector('[data-date="2026-08-25"]') as HTMLButtonElement).click();
    await flush();
    expect(element.value).toEqual(initial);
    const applyButton = element.querySelector(
      '.peaui-form-date-range-picker__button--primary',
    ) as HTMLButtonElement;
    expect(applyButton).toHaveClass(
      'peaui-button-action',
      'peaui-button-action--size-xs',
      'peaui-button-action--variant-primary',
    );
    applyButton.click();
    await flush();
    expect(element.value).toEqual(['2026-08-20', '2026-08-25']);
    expect((onApply.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual([
      '2026-08-20',
      '2026-08-25',
    ]);
  });

  it('wybiera preset i synchronizuje property value', async () => {
    const element = createPicker({
      presets: [
        {
          id: 'previous-week',
          label: 'Poprzedni tydzień',
          value: ['2026-08-03', '2026-08-09'],
        },
      ],
    });
    await flush();
    getStart(element).click();
    await flush();
    const presetButton = element.querySelector(
      '.peaui-form-date-range-picker__preset',
    ) as HTMLButtonElement;
    expect(presetButton).toHaveClass(
      'peaui-button-action',
      'peaui-button-action--size-xxs',
      'peaui-button-action--variant-ghost',
    );
    presetButton.click();
    await flush();
    expect(element.value).toEqual(['2026-08-03', '2026-08-09']);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje panel w stanie %s',
    async (state) => {
      const element = createPicker({ [state]: true });
      await flush();
      const input = getStart(element);
      input.click();
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      await flush();
      expect(element.open).not.toBe(true);
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
    },
  );
});
