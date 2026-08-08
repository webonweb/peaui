import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineToggleButton, ToggleButtonElement } from './index.wc';

type ToggleButtonTestElement = InstanceType<typeof ToggleButtonElement> & {
  allowWrap: boolean;
  ariaLabel: string;
  content: string;
  disabled: boolean;
  icon: string;
  label: string;
  loading: boolean;
  pressedIcon: string;
  pressedLabel: string;
  readonly: boolean;
  value: boolean;
  variant: string;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createToggle(properties: Partial<ToggleButtonTestElement> = {}): ToggleButtonTestElement {
  const element = document.createElement(ToggleButtonElement.tagName) as ToggleButtonTestElement;
  Object.assign(
    element,
    { ariaLabel: 'Pokaż podgląd', label: 'Podgląd', value: false },
    properties,
  );
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('ToggleButton Web Component', () => {
  it('rejestruje light-DOM element z natywnym toggle button', async () => {
    expect(defineToggleButton()).toBe(ToggleButtonElement);
    expect(customElements.get(ToggleButtonElement.tagName)).toBe(ToggleButtonElement);
    const element = createToggle({ icon: 'eye', variant: 'outline' });
    await flush();
    const button = element.querySelector('button') as HTMLButtonElement;

    expect(button).toHaveAccessibleName('Pokaż podgląd');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('peaui-toggle-button--variant-outline');
    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelector('.peaui-toggle-button__state-marker')).not.toBeInTheDocument();
  });

  it('synchronizuje property value i emituje model oraz change raz', async () => {
    const element = createToggle();
    const onValue = vi.fn();
    const onChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('change', onChange);
    await flush();

    (element.querySelector('button') as HTMLButtonElement).click();
    await flush();

    expect(onValue).toHaveBeenCalledOnce();
    expect((onValue.mock.calls[0]?.[0] as CustomEvent).detail).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe(true);
    expect(element.value).toBe(true);
    expect(element.querySelector('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('nie dubluje zdarzenia click z wewnętrznego przycisku', async () => {
    const element = createToggle();
    const onClick = vi.fn();
    element.addEventListener('click', onClick);
    await flush();

    (element.querySelector('button') as HTMLButtonElement).click();
    await flush();

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((onClick.mock.calls[0]?.[0] as CustomEvent).detail).toBeInstanceOf(MouseEvent);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę w stanie %s',
    async (state) => {
      const element = createToggle({ [state]: true });
      const onValue = vi.fn();
      element.addEventListener('update:value', onValue);
      await flush();
      const button = element.querySelector('button') as HTMLButtonElement;

      button.click();
      await flush();

      expect(onValue).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      if (state === 'readonly') expect(button).not.toBeDisabled();
      else expect(button).toBeDisabled();
      element.remove();
    },
  );

  it('zachowuje stałą nazwę po zmianie widocznej etykiety i ikony', async () => {
    const element = createToggle({
      icon: 'eye',
      pressedIcon: 'checkCircle',
      pressedLabel: 'Podgląd widoczny',
    });
    await flush();
    const button = element.querySelector('button') as HTMLButtonElement;

    button.click();
    await flush();

    expect(button).toHaveAccessibleName('Pokaż podgląd');
    expect(button).toHaveTextContent('Podgląd widoczny');
  });

  it('renderuje nazwane sloty bez dodatkowego tab stopu', async () => {
    const element = document.createElement(ToggleButtonElement.tagName) as ToggleButtonTestElement;
    Object.assign(element, { ariaLabel: 'Własna ikona', content: 'icon', value: true });
    const icon = document.createElement('span');
    icon.slot = 'pressed-icon';
    icon.textContent = '!';
    element.append(icon);
    document.body.append(element);
    await flush();

    expect(element.querySelector('button')).toHaveAccessibleName('Własna ikona');
    expect(element.querySelector('.peaui-toggle-button__icon')).toHaveTextContent('!');
    expect(element.querySelectorAll('button')).toHaveLength(1);
  });
});
