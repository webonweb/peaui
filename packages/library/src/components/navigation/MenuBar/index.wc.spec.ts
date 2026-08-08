import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { menuBarDemoMenus } from './menu-bar.demo';
import { defineMenuBar, MenuBarElement } from './index.wc';

type MenuBarTestElement = InstanceType<typeof MenuBarElement> & {
  disabled: boolean;
  menus: typeof menuBarDemoMenus;
  openMenu: string | number | null;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createMenuBar(): MenuBarTestElement {
  const element = document.createElement(MenuBarElement.tagName) as MenuBarTestElement;
  element.menus = menuBarDemoMenus;
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('MenuBar Web Component', () => {
  it('rejestruje light-DOM element z identycznym kontraktem menubar', async () => {
    expect(defineMenuBar()).toBe(MenuBarElement);
    expect(customElements.get(MenuBarElement.tagName)).toBe(MenuBarElement);
    const element = createMenuBar();
    await flush();
    const bar = element.querySelector('[role="menubar"]') as HTMLElement;
    const triggers = element.querySelectorAll<HTMLButtonElement>('[data-menubar-index]');

    expect(bar).toHaveAttribute('aria-label', 'Menu aplikacji');
    expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(triggers).toHaveLength(menuBarDemoMenus.length);
    expect(Array.from(triggers).map((trigger) => trigger.tabIndex)).toEqual([0, -1, -1, -1, -1]);
  });

  it('otwiera klawiaturą, przełącza sekcję i emituje model jako CustomEvent', async () => {
    const element = createMenuBar();
    const onOpenMenu = vi.fn();
    element.addEventListener('update:openMenu', onOpenMenu);
    await flush();
    const firstTrigger = element.querySelector('[data-menubar-index="0"]') as HTMLButtonElement;
    firstTrigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await flush();
    expect((onOpenMenu.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('file');
    expect(document.activeElement?.textContent).toContain('Nowy dokument');

    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
    );
    await flush();
    expect((onOpenMenu.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe('edit');
    expect(document.activeElement?.textContent).toContain('Cofnij');
  });

  it('przekazuje pozycję, ścieżkę i sekcję w CustomEvent select', async () => {
    const element = createMenuBar();
    const onSelect = vi.fn();
    element.addEventListener('select', onSelect);
    await flush();
    (element.querySelector('[data-menubar-index="0"]') as HTMLButtonElement).click();
    await flush();
    (element.querySelector('[data-menu-path="0"]') as HTMLButtonElement).click();
    await flush();

    expect((onSelect.mock.calls[0]?.[0] as CustomEvent).detail).toEqual([
      menuBarDemoMenus[0]?.items[0],
      [0],
      menuBarDemoMenus[0],
    ]);
  });

  it('zamyka się i wyłącza wszystkie triggery po zmianie disabled', async () => {
    const element = createMenuBar();
    const onOpenMenu = vi.fn();
    element.addEventListener('update:openMenu', onOpenMenu);
    element.openMenu = 'file';
    await flush();
    element.disabled = true;
    await flush();

    expect((onOpenMenu.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe(null);
    for (const trigger of element.querySelectorAll<HTMLButtonElement>('[data-menubar-index]')) {
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    }
  });
});
