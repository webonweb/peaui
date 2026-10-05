import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormPinInput, FormPinInputElement } from './index.wc';

type FormPinInputTestElement = InstanceType<typeof FormPinInputElement> & {
  disabled: boolean;
  error: string;
  id: string;
  label: string;
  length: number;
  loading: boolean;
  mask: boolean;
  name: string;
  readonly: boolean;
  required: boolean;
  separatorEvery: number;
  transform: 'none' | 'uppercase' | 'lowercase';
  type: 'numeric' | 'alphanumeric';
  value: string;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createPin(properties: Partial<FormPinInputTestElement> = {}): FormPinInputTestElement {
  const element = document.createElement(FormPinInputElement.tagName) as FormPinInputTestElement;
  Object.assign(
    element,
    { id: 'pin-wc', label: 'Kod weryfikacyjny', length: 6, name: 'otp', value: '' },
    properties,
  );
  document.body.append(element);
  return element;
}

function cells(element: FormPinInputTestElement): HTMLInputElement[] {
  return [...element.querySelectorAll<HTMLInputElement>('.peaui-form-pin-input__cell')];
}

function key(element: HTMLInputElement, value: string): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: value }));
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormPinInput Web Component', () => {
  it('scrolls an externally focused cell into view', async () => {
    const element = new FormPinInputElement();
    element.length = 12;
    document.body.append(element);
    await flush();
    const last = element.querySelectorAll('input').item(11);
    const scroll = vi.fn();
    last.scrollIntoView = scroll;
    last.focus();
    expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  });

  it('rejestruje light-DOM element z nazwaną grupą i komórkami', async () => {
    expect(defineFormPinInput()).toBe(FormPinInputElement);
    expect(customElements.get(FormPinInputElement.tagName)).toBe(FormPinInputElement);
    const element = createPin({ required: true });
    await flush();
    expect(element.querySelector('[role="group"]')).toHaveAccessibleName('Kod weryfikacyjny');
    expect(cells(element)).toHaveLength(6);
    expect(cells(element)[0]).toHaveAccessibleName('Cyfra 1 z 6');
    expect(cells(element)[5]).toHaveAccessibleName('Cyfra 6 z 6');
  });

  it('synchronizuje string z zerami przez property i update:value', async () => {
    const element = createPin();
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();
    key(cells(element)[0]!, '0');
    await flush();
    key(cells(element)[1]!, '0');
    await flush();
    expect(element.value).toBe('00');
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('00');
  });

  it('wkleja, filtruje niedozwolone znaki i emituje complete raz', async () => {
    const element = createPin();
    const onComplete = vi.fn();
    const onInvalid = vi.fn();
    element.addEventListener('complete', onComplete);
    element.addEventListener('invalidInput', onInvalid);
    await flush();
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => '12a345678' } });
    cells(element)[0]?.dispatchEvent(event);
    await flush();
    expect(element.value).toBe('123456');
    expect((onComplete.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe('123456');
    expect((onInvalid.mock.calls[0]?.[0] as CustomEvent).detail[0]).toMatchObject({
      rejected: 'a78',
    });
  });

  it('obsługuje edycję środka, Delete i Backspace', async () => {
    const element = createPin({ value: '1234' });
    await flush();
    key(cells(element)[1]!, 'Delete');
    await flush();
    expect(element.value).toBe('134');
    key(cells(element)[3]!, 'Backspace');
    await flush();
    expect(element.value).toBe('13');
  });

  it('obsługuje klawiaturę i utrzymuje jeden tab stop', async () => {
    const element = createPin();
    await flush();
    cells(element)[0]?.focus();
    key(cells(element)[0]!, 'End');
    await flush();
    expect(cells(element)[5]).toHaveFocus();
    expect(cells(element)[5]).toHaveAttribute('tabindex', '0');
    key(cells(element)[5]!, 'Home');
    await flush();
    expect(cells(element)[0]).toHaveFocus();
  });

  it('obsługuje alphanumeric, transformację i maskowanie', async () => {
    const element = createPin({
      length: 4,
      mask: true,
      transform: 'uppercase',
      type: 'alphanumeric',
    });
    await flush();
    key(cells(element)[0]!, 'a');
    await flush();
    expect(element.value).toBe('A');
    expect(cells(element)[0]).toHaveAttribute('type', 'password');
    expect(cells(element)[0]).toHaveAccessibleName('Znak 1 z 4');
  });

  it('zachowuje natywny slot separatora i formularzową wartość ukrytą', async () => {
    const element = document.createElement(FormPinInputElement.tagName) as FormPinInputTestElement;
    element.id = 'slot-pin';
    element.label = 'Kod';
    element.length = 6;
    element.name = 'otp';
    element.separatorEvery = 3;
    const separator = document.createElement('strong');
    separator.slot = 'separator';
    separator.textContent = '·';
    element.append(separator);
    document.body.append(element);
    await flush();
    expect(element).toHaveAttribute('data-peaui-native-slot-separator');
    expect(element.querySelector('.peaui-form-pin-input__separator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(element.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'otp');
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę w stanie %s',
    async (state) => {
      const element = createPin({ [state]: true });
      await flush();
      key(cells(element)[0]!, '1');
      await flush();
      expect(element.value).toBe('');
      if (state === 'readonly') expect(cells(element)[0]).toHaveAttribute('aria-readonly', 'true');
      else expect(cells(element)[0]).toBeDisabled();
      if (state === 'loading') expect(element.querySelector('[role="status"]')).toBeInTheDocument();
    },
  );
});
