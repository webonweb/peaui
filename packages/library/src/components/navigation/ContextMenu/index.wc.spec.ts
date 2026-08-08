import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { contextMenuDemoItems } from './context-menu.demo';
import { ContextMenuElement, defineContextMenu } from './index.wc';

type ContextMenuTestElement = InstanceType<typeof ContextMenuElement> & {
  context: unknown;
  disabled: boolean;
  items: typeof contextMenuDemoItems;
  open: boolean;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createMenu(withButton = true): ContextMenuTestElement {
  const element = document.createElement(ContextMenuElement.tagName) as ContextMenuTestElement;
  element.items = contextMenuDemoItems;
  element.context = { id: 'report' };
  if (withButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Raport kwartalny';
    element.append(button);
  }
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('ContextMenu Web Component', () => {
  it('rejestruje light-DOM element i zachowuje role ARIA wspólnego menu', async () => {
    expect(defineContextMenu()).toBe(ContextMenuElement);
    expect(customElements.get(ContextMenuElement.tagName)).toBe(ContextMenuElement);
    const element = createMenu();
    await flush();
    const target = element.querySelector('button:not(.peaui-context-menu__virtual-trigger)')!;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 80,
      clientY: 60,
    });
    target.dispatchEvent(event);
    await flush();
    const menu = element.querySelector('[role="menu"]') as HTMLElement;

    expect(event.defaultPrevented).toBe(true);
    expect(target).toHaveAttribute('aria-haspopup', 'menu');
    expect(target).toHaveAttribute('aria-expanded', 'true');
    expect(target.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu).toBeVisible();
    expect(element.querySelectorAll('[role="menuitemradio"]')).toHaveLength(2);
  });

  it('udostępnia openAt/close i przekazuje kontekst w CustomEvent select', async () => {
    const element = createMenu(false);
    const onSelect = vi.fn();
    element.addEventListener('select', onSelect);
    await flush();
    expect(element.openAt({ context: { id: 'manual' }, x: 30, y: 40 })).toBe(true);
    await flush();
    (element.querySelector('[data-menu-path="0"]') as HTMLButtonElement).click();
    await flush();

    expect((onSelect.mock.calls[0]?.[0] as CustomEvent).detail).toEqual([
      contextMenuDemoItems[0],
      [0],
      { id: 'manual' },
    ]);
    element.close();
  });

  it('obsługuje Shift+F10 i przywraca fokus po Escape', async () => {
    const element = createMenu();
    await flush();
    const target = element.querySelector(
      'button:not(.peaui-context-menu__virtual-trigger)',
    ) as HTMLButtonElement;
    target.focus();
    target.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'F10', shiftKey: true }),
    );
    await flush();
    const firstItem = element.querySelector('[data-menu-path="0"]') as HTMLButtonElement;
    expect(firstItem).toHaveFocus();
    firstItem.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flush();
    expect(target).toHaveFocus();
  });

  it('nie przechwytuje contextmenu w stanie disabled', async () => {
    const element = createMenu();
    element.disabled = true;
    await flush();
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    element.querySelector('button:not(.peaui-context-menu__virtual-trigger)')?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(element.querySelector('[role="menu"]')).not.toBeVisible();
  });
});
