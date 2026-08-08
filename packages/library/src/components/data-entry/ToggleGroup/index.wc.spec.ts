import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineToggleGroup, ToggleGroupElement } from './index.wc';

type ToggleGroupTestElement = InstanceType<typeof ToggleGroupElement> & {
  allowEmpty: boolean;
  ariaLabel: string;
  disabled: boolean;
  items: Array<Record<string, unknown>>;
  label: string;
  orientation: string;
  required: boolean;
  size: string;
  type: string;
  value: string | number | Array<string | number> | null;
};

const items = [
  { value: 'grid', label: 'Kafelki' },
  { value: 'list', label: 'Lista', disabled: true },
  { value: 3, label: 'Kompaktowo' },
];

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createGroup(properties: Partial<ToggleGroupTestElement> = {}): ToggleGroupTestElement {
  const element = document.createElement(ToggleGroupElement.tagName) as ToggleGroupTestElement;
  Object.assign(element, { ariaLabel: 'Widok wyników', items, value: null }, properties);
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('ToggleGroup Web Component', () => {
  it('przekazuje rozmiar i nie rezerwuje pustego miejsca na ikonę przy samym tekście', async () => {
    const element = createGroup({ orientation: 'vertical', size: 's' });
    await flush();
    const group = element.querySelector('[role="toolbar"]');
    const buttons = [...element.querySelectorAll('button')];

    expect(group).toHaveClass('peaui-toggle-group--size-s');
    expect(
      buttons.every((button) => button.classList.contains('peaui-toggle-button--size-s')),
    ).toBe(true);
    expect(element.querySelectorAll('.peaui-toggle-button__icon')).toHaveLength(0);
  });

  it('rejestruje light-DOM grupę z jednym tab stopem', async () => {
    expect(defineToggleGroup()).toBe(ToggleGroupElement);
    const element = createGroup({ value: 'grid' });
    await flush();
    const group = element.querySelector('[role="toolbar"]');
    const buttons = [...element.querySelectorAll('button')];

    expect(group).toHaveAccessibleName('Widok wyników');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(buttons.map((button) => button.tabIndex)).toEqual([0, -1, -1]);
  });

  it('synchronizuje scalar property i emituje zmianę raz', async () => {
    const element = createGroup();
    const onValue = vi.fn();
    const onChange = vi.fn();
    element.addEventListener('update:value', onValue);
    element.addEventListener('change', onChange);
    await flush();

    (element.querySelectorAll('button')[2] as HTMLButtonElement).click();
    await flush();

    expect(element.value).toBe(3);
    expect(onValue).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe(3);
  });

  it('obsługuje tablicowy model multiple', async () => {
    const element = createGroup({ type: 'multiple', value: ['grid'] });
    await flush();
    (element.querySelectorAll('button')[2] as HTMLButtonElement).click();
    await flush();

    expect(element.value).toEqual(['grid', 3]);
    expect(element.querySelectorAll('[aria-pressed="true"]')).toHaveLength(2);
  });

  it('egzekwuje required i opisuje pusty stan jako błędny', async () => {
    const element = createGroup({ required: true });
    await flush();
    const group = element.querySelector('[role="toolbar"]') as HTMLElement;
    const alert = element.querySelector('[role="alert"]') as HTMLElement;

    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group.getAttribute('aria-describedby')?.split(' ')).toContain(alert.id);
    expect(alert).toHaveTextContent('Wybierz co najmniej');
  });

  it('nawiguje strzałkami i pomija disabled', async () => {
    const element = createGroup({ value: 'grid' });
    const onFocusChange = vi.fn();
    element.addEventListener('focusChange', onFocusChange);
    await flush();
    const buttons = [...element.querySelectorAll('button')];
    buttons[0]?.focus();
    buttons[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await flush();

    expect(buttons[2]).toHaveFocus();
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    expect((onFocusChange.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual([
      expect.objectContaining({ value: 3 }),
      2,
    ]);
  });

  it('usuwa tab stop po wyłączeniu całej grupy', async () => {
    const element = createGroup({ disabled: true });
    await flush();

    expect(element.querySelector('[role="toolbar"]')).toHaveAttribute('aria-disabled', 'true');
    expect([...element.querySelectorAll('button')].every((button) => button.tabIndex === -1)).toBe(
      true,
    );
  });
});
