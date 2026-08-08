import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { dropdownMenuDemoItems } from './dropdown-menu.demo';
import { defineDropdownMenu, DropdownMenuElement } from './index.wc';

type DropdownMenuTestElement = InstanceType<typeof DropdownMenuElement> & {
  items: typeof dropdownMenuDemoItems;
  open: boolean;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createMenu(): DropdownMenuTestElement {
  const element = document.createElement(DropdownMenuElement.tagName) as DropdownMenuTestElement;
  element.items = dropdownMenuDemoItems;
  document.body.append(element);
  return element;
}

afterEach(() => document.body.replaceChildren());

describe('DropdownMenu Web Component', () => {
  it('rejestruje element i renderuje identyczny light DOM oraz role ARIA', async () => {
    expect(defineDropdownMenu()).toBe(DropdownMenuElement);
    expect(customElements.get(DropdownMenuElement.tagName)).toBe(DropdownMenuElement);
    const element = createMenu();
    await flush();
    const trigger = element.querySelector('.peaui-dropdown-menu__trigger') as HTMLButtonElement;
    trigger.click();
    await flush();
    const menu = element.querySelector('[role="menu"]') as HTMLElement;

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu).toHaveAttribute('aria-label', 'Menu akcji');
    expect(element.querySelectorAll('[role="menuitemradio"]')).toHaveLength(2);
    expect(element.querySelector('[role="group"]')).toBeInTheDocument();
  });

  it('emituje CustomEvent select i zamyka zwykłą akcję', async () => {
    const element = createMenu();
    const onSelect = vi.fn();
    const onOpen = vi.fn();
    element.addEventListener('select', onSelect);
    element.addEventListener('update:open', onOpen);
    await flush();
    (element.querySelector('.peaui-dropdown-menu__trigger') as HTMLButtonElement).click();
    await flush();
    (element.querySelector('[data-menu-path="0"]') as HTMLButtonElement).click();
    await flush();

    expect((onSelect.mock.calls[0]?.[0] as CustomEvent).detail).toEqual([
      dropdownMenuDemoItems[0],
      [0],
    ]);
    expect((onOpen.mock.calls.at(-1)?.[0] as CustomEvent).detail).toBe(false);
  });

  it('nawiguje klawiaturą, otwiera podmenu i przywraca fokus po Escape', async () => {
    const element = createMenu();
    await flush();
    const trigger = element.querySelector('.peaui-dropdown-menu__trigger') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await flush();
    expect(document.activeElement?.textContent).toContain('Edytuj profil');

    const submenu = element.querySelector('[data-menu-path="4"]') as HTMLButtonElement;
    submenu.focus();
    submenu.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await flush();
    expect(submenu).toHaveAttribute('aria-expanded', 'true');
    expect(document.activeElement?.textContent).toContain('Kopiuj link');
    submenu.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flush();
    expect(trigger).toHaveFocus();
  });

  it('przenosi semantykę na slotted trigger bez dodatkowego tab stopu', async () => {
    const element = document.createElement(DropdownMenuElement.tagName) as DropdownMenuTestElement;
    element.items = dropdownMenuDemoItems;
    const trigger = document.createElement('button');
    trigger.setAttribute('slot', 'trigger');
    trigger.textContent = 'Więcej';
    element.append(trigger);
    document.body.append(element);
    await flush();

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(element.querySelector('.peaui-dropdown-menu__trigger-proxy')).toHaveAttribute(
      'tabindex',
      '-1',
    );
    trigger.click();
    await flush();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('pozycjonuje menu względem widocznego triggera i zachowuje adapter po reconnect', async () => {
    const element = document.createElement(DropdownMenuElement.tagName) as DropdownMenuTestElement;
    element.items = dropdownMenuDemoItems;
    const trigger = document.createElement('button');
    const triggerRect = {
      bottom: 124,
      height: 36,
      left: 144,
      right: 234,
      top: 88,
      width: 90,
      x: 144,
      y: 88,
      toJSON: () => ({}),
    } as DOMRect;
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(triggerRect);
    trigger.setAttribute('slot', 'trigger');
    trigger.textContent = 'Więcej';
    element.append(trigger);
    document.body.append(element);
    await flush();

    let proxy = element.querySelector('.peaui-dropdown-menu__trigger-proxy') as HTMLButtonElement;
    expect(proxy.getBoundingClientRect()).toBe(triggerRect);

    element.remove();
    document.body.append(element);
    await flush();
    proxy = element.querySelector('.peaui-dropdown-menu__trigger-proxy') as HTMLButtonElement;
    expect(proxy.getBoundingClientRect()).toBe(triggerRect);

    trigger.click();
    await flush();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('respektuje atrybut disabled oraz stan loading', async () => {
    const element = createMenu();
    element.setAttribute('disabled', '');
    element.setAttribute('loading', '');
    await flush();
    const trigger = element.querySelector('.peaui-dropdown-menu__trigger') as HTMLButtonElement;
    expect(trigger).toBeDisabled();
    trigger.click();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renderuje empty i loading jako nieaktywne elementy menu', async () => {
    const element = createMenu();
    element.items = [];
    element.open = true;
    await flush();

    expect(element.querySelector('[role="menuitem"]')).toHaveAttribute('aria-disabled', 'true');

    element.setAttribute('loading', '');
    await flush();
    expect(element.querySelector('[role="menuitem"]')).toHaveAttribute('aria-live', 'polite');
  });
});
