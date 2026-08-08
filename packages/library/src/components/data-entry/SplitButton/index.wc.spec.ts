import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineSplitButton, SplitButtonElement } from './index.wc';
import { splitButtonDemoItems } from './split-button.demo';

type SplitButtonTestElement = InstanceType<typeof SplitButtonElement> & {
  ariaLabel: string;
  disabled: boolean;
  items: Array<Record<string, unknown>>;
  label: string;
  loading: boolean;
  menuAriaLabel: string;
  menuDisabled: boolean;
  menuLoading: boolean;
  open: boolean;
  primaryDisabled: boolean;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createSplitButton(
  properties: Partial<SplitButtonTestElement> = {},
): SplitButtonTestElement {
  const element = document.createElement(SplitButtonElement.tagName) as SplitButtonTestElement;
  Object.assign(
    element,
    {
      ariaLabel: 'Akcje eksportu',
      items: splitButtonDemoItems,
      label: 'Eksportuj',
      menuAriaLabel: 'Więcej opcji eksportu',
      open: false,
    },
    properties,
  );
  document.body.append(element);
  return element;
}

function getControlButtons(element: SplitButtonTestElement): HTMLButtonElement[] {
  return [
    element.querySelector<HTMLButtonElement>('.peaui-split-button__primary'),
    element.querySelector<HTMLButtonElement>('.peaui-split-button__trigger'),
  ].filter((button): button is HTMLButtonElement => button !== null);
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('SplitButton Web Component', () => {
  it('rejestruje light-DOM grupę i dwa prawidłowo nazwane przyciski', async () => {
    expect(defineSplitButton()).toBe(SplitButtonElement);
    const element = createSplitButton();
    await flush();

    const group = element.querySelector('[role="group"]');
    const buttons = getControlButtons(element);
    expect(group).toHaveAccessibleName('Akcje eksportu');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAccessibleName('Eksportuj');
    expect(buttons[1]).toHaveAccessibleName('Więcej opcji eksportu');
    expect(buttons[1]).toHaveAttribute('aria-haspopup', 'menu');
    expect(buttons[1]).toHaveAttribute('aria-controls');
  });

  it('emituje rozdzielne zdarzenia primaryClick, update:open i select', async () => {
    const element = createSplitButton();
    const primary = vi.fn();
    const updateOpen = vi.fn();
    const select = vi.fn();
    element.addEventListener('primaryClick', primary);
    element.addEventListener('update:open', updateOpen);
    element.addEventListener('select', select);
    await flush();
    const buttons = getControlButtons(element);

    buttons[0]?.click();
    expect(primary).toHaveBeenCalledOnce();
    expect(updateOpen).not.toHaveBeenCalled();

    buttons[1]?.click();
    await flush();
    expect(element.open).toBe(true);
    expect(updateOpen).toHaveBeenCalledOnce();
    (element.querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    await flush();
    expect(select).toHaveBeenCalledOnce();
    expect(primary).toHaveBeenCalledOnce();
  });

  it('obsługuje ArrowDown, Escape i przywrócenie fokusu', async () => {
    const element = createSplitButton();
    await flush();
    const trigger = getControlButtons(element)[1] as HTMLButtonElement;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await flush();
    const item = element.querySelector('[role="menuitem"]') as HTMLButtonElement;
    expect(item).toHaveFocus();

    item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flush();
    expect(trigger).toHaveFocus();
    expect(element.open).toBe(false);
  });

  it('synchronizuje open property i respektuje częściowe blokady', async () => {
    const element = createSplitButton({ primaryDisabled: true });
    await flush();
    let buttons = getControlButtons(element);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeEnabled();

    element.primaryDisabled = false;
    element.menuDisabled = true;
    await flush();
    buttons = getControlButtons(element);
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toBeDisabled();

    element.disabled = true;
    await flush();
    buttons = getControlButtons(element);
    expect(buttons.every((button) => button.disabled)).toBe(true);
  });

  it('loading blokuje tylko główną akcję i udostępnia status', async () => {
    const element = createSplitButton({ loading: true });
    await flush();
    const buttons = getControlButtons(element);

    expect(buttons[0]).toBeDisabled();
    expect(buttons[0]).toHaveAttribute('aria-busy', 'true');
    expect(buttons[1]).toBeEnabled();
    expect(element.querySelector('[role="status"]')).toHaveTextContent(
      'Trwa wykonywanie głównej akcji',
    );
  });

  it('menuLoading pozostawia trigger dostępny i oznacza menu jako zajęte', async () => {
    const element = createSplitButton({ menuLoading: true });
    await flush();
    const trigger = getControlButtons(element)[1] as HTMLButtonElement;
    trigger.click();
    await flush();

    expect(trigger).toBeEnabled();
    expect(element.querySelector('[role="menu"]')).toHaveAttribute('aria-busy', 'true');
    const loadingItem = element.querySelector('[role="menuitem"]');
    expect(loadingItem).toHaveTextContent('Ładowanie menu');
    expect(loadingItem).toHaveAttribute('aria-disabled', 'true');
    expect(loadingItem).toHaveAttribute('aria-live', 'polite');
  });
});
