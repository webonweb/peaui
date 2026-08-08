import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineSegmentedControl, SegmentedControlElement } from './index.wc';

type SegmentedControlTestElement = InstanceType<typeof SegmentedControlElement> & {
  activation: string;
  ariaLabel: string;
  disabled: boolean;
  items: Array<Record<string, unknown>>;
  orientation: string;
  value: string | number | null;
};

const items = [
  { value: 'list', label: 'Lista' },
  { value: 'grid', label: 'Kafelki', disabled: true },
  { value: 30, label: 'Kompaktowo' },
];

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createControl(
  properties: Partial<SegmentedControlTestElement> = {},
): SegmentedControlTestElement {
  const element = document.createElement(
    SegmentedControlElement.tagName,
  ) as SegmentedControlTestElement;
  Object.assign(element, { ariaLabel: 'Widok wyników', items, value: null }, properties);
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('SegmentedControl Web Component', () => {
  it('rejestruje light-DOM radiogroup z jednym tab stopem', async () => {
    expect(defineSegmentedControl()).toBe(SegmentedControlElement);
    const element = createControl({ value: 'list' });
    await flush();
    const group = element.querySelector('[role="radiogroup"]');
    const radios = [...element.querySelectorAll('[role="radio"]')];

    expect(group).toHaveAccessibleName('Widok wyników');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(radios.map((radio) => (radio as HTMLElement).tabIndex)).toEqual([0, -1, -1]);
    expect(radios.filter((radio) => radio.getAttribute('aria-checked') === 'true')).toHaveLength(1);
  });

  it('synchronizuje liczbową property i emituje zmianę raz', async () => {
    const element = createControl();
    const onValue = vi.fn();
    const onChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('change', onChange);
    await flush();

    (element.querySelectorAll('button')[2] as HTMLButtonElement).click();
    await flush();

    expect(element.value).toBe(30);
    expect(onValue).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe(30);
  });

  it('automatycznie wybiera strzałką, pomija disabled i emituje focusChange', async () => {
    const element = createControl();
    const onValue = vi.fn();
    const onFocusChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('focusChange', onFocusChange);
    await flush();
    const radios = [...element.querySelectorAll('button')];
    radios[0]?.focus();
    radios[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await flush();

    expect(radios[2]).toHaveFocus();
    expect(element.value).toBe(30);
    expect(onValue).toHaveBeenCalledWith(expect.objectContaining({ detail: 30 }));
    expect((onFocusChange.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual([
      expect.objectContaining({ value: 30 }),
      2,
    ]);
  });

  it('w trybie manual sama strzałka nie zmienia wartości', async () => {
    const element = createControl({ activation: 'manual', value: 'list' });
    const onValue = vi.fn();
    element.addEventListener('update:value', onValue);
    await flush();
    const radios = [...element.querySelectorAll('button')];
    radios[0]?.focus();
    radios[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await flush();

    expect(radios[2]).toHaveFocus();
    expect(element.value).toBe('list');
    expect(onValue).not.toHaveBeenCalled();
  });

  it('obsługuje orientację pionową i Home/End', async () => {
    const enabled = items.map((item) => ({ ...item, disabled: false }));
    const element = createControl({ items: enabled, orientation: 'vertical', value: 'list' });
    await flush();
    const radios = [...element.querySelectorAll('button')];
    radios[0]?.focus();
    radios[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    await flush();

    expect(radios[2]).toHaveFocus();
    expect(element.querySelector('[role="radiogroup"]')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('blokuje grupę bez pozostawiania tab stopu', async () => {
    const element = createControl({ disabled: true, value: 'list' });
    await flush();

    expect(element.querySelector('[role="radiogroup"]')).toHaveAttribute('aria-disabled', 'true');
    expect([...element.querySelectorAll('button')].every((button) => button.tabIndex === -1)).toBe(
      true,
    );
  });
});
