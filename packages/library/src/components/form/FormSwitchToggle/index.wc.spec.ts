import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineFormSwitchToggle, FormSwitchToggleElement } from './index.wc';

type FormSwitchToggleTestElement = InstanceType<typeof FormSwitchToggleElement> & {
  ariaLabel: string;
  description: string;
  disabled: boolean;
  error: string;
  falseValue: unknown;
  form: string;
  label: string;
  loading: boolean;
  name: string;
  readonly: boolean;
  required: boolean;
  showStateLabel: boolean;
  offLabel: string;
  onLabel: string;
  trueValue: unknown;
  value: unknown;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createSwitch(
  properties: Partial<FormSwitchToggleTestElement> = {},
): FormSwitchToggleTestElement {
  const element = document.createElement(
    FormSwitchToggleElement.tagName,
  ) as FormSwitchToggleTestElement;
  Object.assign(element, { ariaLabel: 'Powiadomienia', value: false }, properties);
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('FormSwitchToggle Web Component', () => {
  it('rejestruje light-DOM element z natywną kontrolką switch', async () => {
    expect(defineFormSwitchToggle()).toBe(FormSwitchToggleElement);
    expect(customElements.get(FormSwitchToggleElement.tagName)).toBe(FormSwitchToggleElement);
    const element = createSwitch({ label: 'Aktualizacje', name: 'updates', value: true });
    await flush();
    const input = element.querySelector('[role="switch"]') as HTMLInputElement;

    expect(input).toHaveAccessibleName('Aktualizacje');
    expect(input).toHaveAttribute('aria-labelledby');
    expect(element.querySelector(`#${input.getAttribute('aria-labelledby')}`)).toHaveTextContent(
      'Aktualizacje',
    );
    expect(input).toBeChecked();
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).toHaveAttribute('name', 'updates');
  });

  it('emituje generyczną wartość modelu oraz change jako CustomEvent', async () => {
    const enabled = { code: 'enabled' };
    const disabled = { code: 'disabled' };
    const element = createSwitch({ falseValue: disabled, trueValue: enabled, value: disabled });
    const onValue = vi.fn();
    const onChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('change', onChange);
    await flush();

    (element.querySelector('[role="switch"]') as HTMLInputElement).click();
    await flush();

    expect((onValue.mock.calls[0]?.[0] as CustomEvent).detail).toBe(enabled);
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe(enabled);
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail[1]).toBeInstanceOf(Event);
    expect(element.value).toBe(enabled);
  });

  it('aktywuje natywną kontrolkę po kliknięciu widocznej etykiety', async () => {
    const element = createSwitch({ ariaLabel: '', label: 'Powiadomienia' });
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();

    (element.querySelector('.peaui-form-switch-toggle__label') as HTMLElement).click();
    await flush();

    expect(onValue).toHaveBeenCalledWith(expect.objectContaining({ detail: true }));
    expect(element.querySelector('[role="switch"]')).toBeChecked();
  });

  it('pokazuje tylko etykietę aktualnego stanu po ponownym renderze', async () => {
    const element = createSwitch({
      offLabel: 'Wyłączone',
      onLabel: 'Włączone',
      showStateLabel: true,
    });
    await flush();
    const state = element.querySelector('.peaui-form-switch-toggle__state') as HTMLElement;
    const stateValues = state.querySelectorAll('.peaui-form-switch-toggle__state-value');

    expect(stateValues[0]).toHaveTextContent('Włączone');
    expect(stateValues[0]).not.toBeVisible();
    expect(stateValues[1]).toHaveTextContent('Wyłączone');
    expect(stateValues[1]).toBeVisible();

    (element.querySelector('[role="switch"]') as HTMLInputElement).click();
    await flush();

    expect(stateValues[0]).toBeVisible();
    expect(stateValues[1]).not.toBeVisible();
  });

  it('zachowuje blokady disabled, readonly i loading', async () => {
    for (const state of ['disabled', 'readonly', 'loading'] as const) {
      const element = createSwitch({ [state]: true });
      const onValue = vi.fn();
      element.addEventListener('update:value', onValue);
      await flush();
      const input = element.querySelector('[role="switch"]') as HTMLInputElement;

      input.click();
      await flush();

      expect(onValue).not.toHaveBeenCalled();
      expect(input).not.toBeChecked();
      if (state === 'readonly') {
        expect(input).not.toBeDisabled();
        expect(input).toHaveAttribute('aria-readonly', 'true');
      } else {
        expect(input).toBeDisabled();
      }
      element.remove();
    }
  });

  it('łączy relacje ARIA i dostępny stan ładowania', async () => {
    const element = createSwitch({
      description: 'Opis ustawienia',
      error: 'Wymagane ustawienie',
      loading: true,
      required: true,
    });
    await flush();
    const input = element.querySelector('[role="switch"]') as HTMLInputElement;
    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toContain(
      element.querySelector('.peaui-form-switch-toggle__description')?.id,
    );
    expect(describedBy).toContain(element.querySelector('.peaui-form-switch-toggle__error')?.id);
    expect(describedBy).toContain(element.querySelector('[role="status"]')?.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-busy', 'true');
  });

  it('uczestniczy w natywnym formularzu light DOM', async () => {
    const form = document.createElement('form');
    form.id = 'publication-form';
    const element = document.createElement(
      FormSwitchToggleElement.tagName,
    ) as FormSwitchToggleTestElement;
    Object.assign(element, {
      ariaLabel: 'Publikacja',
      falseValue: 'no',
      form: form.id,
      name: 'published',
      required: true,
      trueValue: 'yes',
      value: 'yes',
    });
    document.body.append(form, element);
    await flush();
    const input = element.querySelector('[role="switch"]') as HTMLInputElement;

    expect(input.checkValidity()).toBe(true);
    expect(input.form).toBe(form);
    expect(new FormData(form).get('published')).toBe('yes');
  });
});
