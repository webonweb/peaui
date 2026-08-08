import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormColorPicker, FormColorPickerElement } from './index.wc';
import type { FormColorPickerSwatch } from './color-picker.shared';

type FormColorPickerTestElement = InstanceType<typeof FormColorPickerElement> & {
  alpha: boolean;
  disabled: boolean;
  format: 'hex' | 'rgb' | 'hsl';
  id: string;
  label: string;
  loading: boolean;
  name: string;
  open: boolean;
  readonly: boolean;
  required: boolean;
  savedColors: FormColorPickerSwatch[];
  showEyedropper: boolean;
  value: string;
  variant: 'popover' | 'inline';
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

function createPicker(
  properties: Partial<FormColorPickerTestElement> = {},
): FormColorPickerTestElement {
  const element = document.createElement(
    FormColorPickerElement.tagName,
  ) as FormColorPickerTestElement;
  Object.assign(
    element,
    {
      id: 'brand-color-wc',
      label: 'Kolor marki',
      name: 'brandColor',
      value: '#4C9A2A',
    },
    properties,
  );
  document.body.append(element);
  return element;
}

function getInput(element: FormColorPickerTestElement): HTMLInputElement {
  return element.querySelector('[role="combobox"]') as HTMLInputElement;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormColorPicker Web Component', () => {
  it('używa systemowej strzałki selecta jako osobnej ikony SVG', async () => {
    const element = createPicker();
    await flush();

    await vi.waitFor(() => {
      expect(element.querySelector('svg.peaui-form-color-picker__toggle-icon')).toBeInTheDocument();
    });
    expect(element.querySelector('.peaui-form-color-picker__toggle')?.textContent).toBe('');
  });

  it('rejestruje light-DOM element z kompletną semantyką pola', async () => {
    expect(defineFormColorPicker()).toBe(FormColorPickerElement);
    expect(customElements.get(FormColorPickerElement.tagName)).toBe(FormColorPickerElement);
    const element = createPicker();
    await flush();
    const input = getInput(element);
    expect(input).toHaveAccessibleName(/^Kolor marki/);
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-controls', 'brand-color-wc-panel');
    expect(input).toHaveValue('#4C9A2A');
  });

  it('synchronizuje zatwierdzony wpis z property i eventem modelu', async () => {
    const element = createPicker({ format: 'rgb' });
    const onValue = vi.fn();
    const onCommit = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('commit', onCommit);
    await flush();
    const input = getInput(element);
    input.value = '#FF0000';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await flush();
    expect(element.value).toBe('rgb(255, 0, 0)');
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('rgb(255, 0, 0)');
    expect((onCommit.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('rgb(255, 0, 0)');
  });

  it('zachowuje niepoprawny tekst i zgłasza jednoznaczny błąd', async () => {
    const element = createPicker();
    const onInvalid = vi.fn();
    element.addEventListener('invalid', onInvalid);
    await flush();
    const input = getInput(element);
    input.value = 'nie-kolor';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await flush();
    expect(input).toHaveValue('nie-kolor');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect((onInvalid.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual({
      input: 'nie-kolor',
      reason: 'format',
    });
  });

  it('otwiera panel, obsługuje klawiaturę 2D i udostępnia opis wartości', async () => {
    const element = createPicker({ savedColors: [{ label: 'Zieleń marki', value: '#4C9A2A' }] });
    const onCommit = vi.fn();
    element.addEventListener('commit', onCommit);
    await flush();
    getInput(element).click();
    await flush();
    expect(element.open).toBe(true);
    const panel = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel).toHaveAccessibleName('Wybierz kolor');
    const saturation = panel.querySelector('[role="slider"]') as HTMLElement;
    expect(saturation).toHaveAttribute('aria-valuetext');
    saturation.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
    await flush();
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(element.querySelector('button[aria-label="Zieleń marki"]')).toBeInTheDocument();
  });

  it('wariant inline używa nazwanej grupy bez semantyki combobox', async () => {
    const element = createPicker({ variant: 'inline' });
    await flush();
    expect(element.querySelector('[role="combobox"]')).not.toBeInTheDocument();
    expect(element.querySelector('[role="group"]')).toHaveAccessibleName('Wybierz kolor');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje otwarcie i zmianę w stanie %s',
    async (state) => {
      const element = createPicker({ [state]: true });
      await flush();
      const input = getInput(element);
      input.click();
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      await flush();
      expect(element.open).not.toBe(true);
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(element.querySelector('[role="dialog"] input[type="range"]')).toBeDisabled();
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
      if (state === 'loading') expect(element.querySelector('[role="status"]')).toBeInTheDocument();
    },
  );
});
