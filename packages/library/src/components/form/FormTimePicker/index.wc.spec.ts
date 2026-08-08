import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormTimePicker, FormTimePickerElement } from './index.wc';

type FormTimePickerTestElement = InstanceType<typeof FormTimePickerElement> & {
  description: string;
  disabled: boolean;
  format: '12h' | '24h';
  id: string;
  label: string;
  loading: boolean;
  max: string;
  min: string;
  minuteStep: number;
  name: string;
  open: boolean;
  readonly: boolean;
  required: boolean;
  secondStep: number;
  showSeconds: boolean;
  value: string | undefined;
  variant: 'input' | 'segmented';
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

function createTimePicker(
  properties: Partial<FormTimePickerTestElement> = {},
): FormTimePickerTestElement {
  const element = document.createElement(
    FormTimePickerElement.tagName,
  ) as FormTimePickerTestElement;
  Object.assign(
    element,
    {
      id: 'meeting-time-wc',
      label: 'Godzina spotkania',
      minuteStep: 5,
      name: 'meetingTime',
      value: '09:30',
    },
    properties,
  );
  document.body.append(element);
  return element;
}

function getInput(element: FormTimePickerTestElement): HTMLInputElement {
  return element.querySelector('[role="combobox"]') as HTMLInputElement;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormTimePicker Web Component', () => {
  it('rejestruje light-DOM combobox z kompletnymi relacjami ARIA', async () => {
    expect(defineFormTimePicker()).toBe(FormTimePickerElement);
    expect(customElements.get(FormTimePickerElement.tagName)).toBe(FormTimePickerElement);
    const element = createTimePicker({ description: 'Czas lokalny' });
    await flush();
    const input = getInput(element);

    expect(input).toHaveAttribute('aria-labelledby', 'label-meeting-time-wc');
    expect(element.querySelector('#label-meeting-time-wc')).toHaveTextContent('Godzina spotkania');
    expect(input).toHaveAccessibleName(/^Godzina spotkania/);
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-controls', 'meeting-time-wc-time-panel');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveValue('09:30');
    expect(element.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('synchronizuje wpisaną wartość z property i emituje neutralny model', async () => {
    const element = createTimePicker();
    const onValue = vi.fn();
    const onChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('change', onChange);
    await flush();
    const input = getInput(element);

    input.value = '14:45';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();

    expect(element.value).toBe('14:45');
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('14:45');
    expect((onChange.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual([
      '14:45',
      { hour: 14, minute: 45, second: 0 },
    ]);
  });

  it('odrzuca format, zakres i wartość poza krokiem bez zmiany modelu', async () => {
    for (const [draft, reason] of [
      ['tekst', 'format'],
      ['07:30', 'range'],
      ['09:32', 'step'],
    ] as const) {
      const element = createTimePicker({ max: '18:00', min: '08:00' });
      const onInvalid = vi.fn();
      element.addEventListener('invalid', onInvalid);
      await flush();
      const input = getInput(element);
      input.value = draft;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      await flush();

      expect((onInvalid.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
        input: draft,
        reason,
      });
      expect(element.value).toBe('09:30');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      element.remove();
    }
  });

  it('otwiera panel klawiaturą, wybiera opcję i synchronizuje open', async () => {
    const element = createTimePicker();
    const onOpen = vi.fn();
    element.addEventListener('update:open', onOpen);
    await flush();
    const input = getInput(element);

    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await flush();

    expect(element.open).toBe(true);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toHaveAccessibleName('Wybór czasu: Godzina spotkania');
    const minute = element.querySelector(
      '[data-time-option-segment="minute"][data-time-option-value="35"]',
    ) as HTMLButtonElement;
    minute.click();
    await flush();
    expect(element.value).toBe('09:35');
    expect(onOpen).toHaveBeenCalled();
  });

  it('renderuje format 12h z sekundami przy zachowaniu modelu 24h', async () => {
    const element = createTimePicker({
      format: '12h',
      minuteStep: 1,
      secondStep: 1,
      showSeconds: true,
      value: '13:05:09',
    });
    await flush();
    const input = getInput(element);
    expect(input).toHaveValue('01:05:09 PM');

    input.value = '11:10:07 PM';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();
    expect(element.value).toBe('23:10:07');
  });

  it('wariant segmented udostępnia spinbuttony i roving focus', async () => {
    const element = createTimePicker({ variant: 'segmented' });
    await flush();
    const group = element.querySelector('[role="group"]') as HTMLElement;
    const segments = group.querySelectorAll<HTMLButtonElement>('[role="spinbutton"]');

    expect(segments).toHaveLength(2);
    expect(segments[0]).toHaveAttribute('aria-valuenow', '9');
    segments[0]?.focus();
    segments[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    expect(segments[1]).toHaveFocus();
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę i otwarcie panelu w stanie %s',
    async (state) => {
      const element = createTimePicker({ [state]: true });
      const onValue = vi.fn();
      element.addEventListener('update:value', onValue);
      await flush();
      const input = getInput(element);
      input.click();
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
      await flush();

      expect(element.open).not.toBe(true);
      expect(onValue).not.toHaveBeenCalled();
      if (state === 'readonly') expect(input).toHaveAttribute('aria-readonly', 'true');
      else expect(input).toBeDisabled();
      if (state === 'loading') expect(element.querySelector('[role="status"]')).toBeVisible();
    },
  );

  it('renderuje natywne sloty opcji, opisu i stopki', async () => {
    const element = document.createElement(
      FormTimePickerElement.tagName,
    ) as FormTimePickerTestElement;
    Object.assign(element, {
      id: 'slotted-time-wc',
      label: 'Godzina',
      minuteStep: 5,
      name: 'slottedTime',
      open: true,
      value: '09:30',
    });
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Opis ze slotu';
    const option = document.createElement('span');
    option.slot = 'hour-option';
    option.textContent = 'godz.';
    const footer = document.createElement('button');
    footer.slot = 'footer';
    footer.textContent = 'Gotowe';
    element.append(description, option, footer);
    document.body.append(element);
    await flush();

    expect(element).toHaveAttribute('data-peaui-native-slot-description');
    expect(element).toHaveAttribute('data-peaui-native-slot-footer');
    expect(element).toHaveTextContent('Opis ze slotu');
    expect(element).toHaveTextContent('godz.');
    expect(element.querySelector('.peaui-form-time-picker__footer')).toHaveTextContent('Gotowe');
  });
});
