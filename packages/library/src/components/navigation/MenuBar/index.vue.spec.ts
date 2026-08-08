import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { menuBarDemoMenus } from './menu-bar.demo';
import MenuBar from './index.vue';
import type { MenuBarMenu } from './index.vue';

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

const menusWithDisabled = (): MenuBarMenu[] => [
  menuBarDemoMenus[0]!,
  { ...menuBarDemoMenus[1]!, disabled: true },
  menuBarDemoMenus[2]!,
];

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('MenuBar Vue', () => {
  it('renderuje nazwany menubar i poprawne ARIA triggerów z jednym tab stopem', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { ariaLabel: 'Menu projektu', dataTestId: 'app-menu', menus: menusWithDisabled() },
    });
    await flush();
    const bar = wrapper.get('[role="menubar"]');
    const triggers = wrapper.findAll<HTMLButtonElement>('[data-menubar-index]');

    expect(bar.attributes('aria-label')).toBe('Menu projektu');
    expect(bar.attributes('aria-orientation')).toBe('horizontal');
    expect(triggers.map((trigger) => trigger.attributes('tabindex'))).toEqual(['0', '-1', '-1']);
    expect(triggers[0]?.attributes('aria-haspopup')).toBe('menu');
    expect(triggers[0]?.attributes('aria-expanded')).toBe('false');
    expect(triggers[1]?.element.disabled).toBe(true);
    expect(triggers[1]?.attributes('aria-disabled')).toBe('true');
  });

  it('pomija disabled przy ArrowLeft/Right, Home/End i emituje focusChange', async () => {
    const onFocusChange = vi.fn();
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus: menusWithDisabled(), onFocusChange },
    });
    const triggers = wrapper.findAll<HTMLButtonElement>('[data-menubar-index]');
    triggers[0]?.element.focus();
    await triggers[0]?.trigger('keydown', { key: 'ArrowRight' });

    expect(triggers[2]?.element).toBe(document.activeElement);
    expect(triggers[2]?.attributes('tabindex')).toBe('0');
    expect(onFocusChange).toHaveBeenLastCalledWith(menusWithDisabled()[2], 2);
    await triggers[2]?.trigger('keydown', { key: 'Home' });
    expect(triggers[0]?.element).toBe(document.activeElement);
    await triggers[0]?.trigger('keydown', { key: 'End' });
    expect(triggers[2]?.element).toBe(document.activeElement);
    await triggers[2]?.trigger('keydown', { key: 'ArrowRight' });
    expect(triggers[0]?.element).toBe(document.activeElement);
  });

  it('otwiera skrajną pozycję strzałkami góra/dół i przełącza otwartą sekcję bez wyjścia z trybu menu', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus: menuBarDemoMenus.slice(0, 3) },
    });
    const triggers = wrapper.findAll<HTMLButtonElement>('[data-menubar-index]');

    await triggers[0]?.trigger('keydown', { key: 'ArrowDown' });
    await flush();
    expect(wrapper.emitted('update:openMenu')?.at(-1)).toEqual(['file']);
    expect(document.activeElement?.textContent).toContain('Nowy dokument');
    expect(triggers[0]?.attributes('aria-expanded')).toBe('true');
    await wrapper.get('[data-menu-path="0"]').trigger('keydown', { key: 'Escape' });
    await flush();
    await triggers[0]?.trigger('keydown', { key: 'ArrowUp' });
    await flush();
    expect(document.activeElement?.textContent).toContain('Eksportuj');
  });

  it('przełącza sekcję ArrowRight z pozycji root menu i zachowuje zachowanie podmenu', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus: menuBarDemoMenus.slice(0, 3) },
    });
    const firstTrigger = wrapper.get<HTMLButtonElement>('[data-menubar-index="0"]');
    await firstTrigger.trigger('keydown', { key: 'ArrowDown' });
    await flush();
    const firstItem = wrapper.get('[data-menu-path="0"]');
    await firstItem.trigger('keydown', { key: 'ArrowRight' });
    await flush();

    expect(wrapper.get('[data-menubar-index="1"]').attributes('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toContain('Cofnij');

    const fileTrigger = wrapper.get('[data-menubar-index="0"]');
    await fileTrigger.trigger('click');
    await flush();
    const submenu = wrapper.findAll('[data-menu-path="4"]')[0]!;
    await submenu.trigger('keydown', { key: 'ArrowRight' });
    await flush();
    expect(submenu.attributes('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toContain('Dokument PDF');
  });

  it('obsługuje typeahead triggerów bez znaków diakrytycznych', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: {
        menus: [
          { id: 'alpha', label: 'Alfa', items: [] },
          { id: 'path', label: 'Ścieżka', items: [] },
          { id: 'beta', label: 'Beta', items: [] },
        ],
      },
    });
    const first = wrapper.get<HTMLButtonElement>('[data-menubar-index="0"]');
    first.element.focus();
    await first.trigger('keydown', { key: 's' });
    expect(wrapper.get<HTMLButtonElement>('[data-menubar-index="1"]').element).toHaveFocus();
  });

  it('przekazuje select, checkbox, wartość i sekcję nadrzędną', async () => {
    const onSelect = vi.fn();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    const menus: MenuBarMenu[] = [
      {
        id: 'view',
        label: 'Widok',
        items: [
          { id: 'grid', type: 'checkbox', label: 'Siatka', checked: true },
          { id: 'compact', type: 'radio', label: 'Kompaktowy', value: 'compact' },
        ],
      },
    ];
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus, onCheckedChange, onSelect, onValueChange },
    });
    await wrapper.get('[data-menubar-index="0"]').trigger('click');
    await flush();
    await wrapper.get('[data-menu-path="0"]').trigger('click');
    await wrapper.get('[data-menu-path="1"]').trigger('click');

    expect(onSelect).toHaveBeenNthCalledWith(1, menus[0]?.items[0], [0], menus[0]);
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, menus[0]?.items[0], false, [0], menus[0]);
    expect(onValueChange).toHaveBeenCalledWith(menus[0]?.items[1], 'compact', [1], menus[0]);
  });

  it('zamyka sekcję usuniętą dynamicznie i naprawia roving tabindex', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus: menuBarDemoMenus.slice(0, 3) },
    });
    await wrapper.get('[data-menubar-index="1"]').trigger('click');
    await flush();
    await wrapper.setProps({ menus: [menuBarDemoMenus[0]!, menuBarDemoMenus[2]!] });
    await flush();

    expect(wrapper.emitted('update:openMenu')?.at(-1)).toEqual([null]);
    expect(wrapper.findAll('[data-menubar-index]')).toHaveLength(2);
    expect(wrapper.findAll('[data-menubar-index]')[0]?.attributes('tabindex')).toBe('0');
  });

  it('utrzymuje DOM w jednej kolejności i dosuwa fokusowany trigger w wąskim viewportcie', async () => {
    const wrapper = mount(MenuBar, {
      attachTo: document.body,
      props: { menus: menuBarDemoMenus },
    });
    const viewport = wrapper.get<HTMLElement>('.peaui-menu-bar__viewport').element;
    Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 240 });
    Object.defineProperty(viewport, 'scrollWidth', { configurable: true, value: 720 });
    const triggers = wrapper.findAll<HTMLButtonElement>('[data-menubar-index]');
    const scrollIntoView = vi.fn();
    triggers.at(-1)!.element.scrollIntoView = scrollIntoView;
    triggers[0]?.element.focus();
    await triggers[0]?.trigger('keydown', { key: 'End' });

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(triggers.map((trigger) => trigger.attributes('data-menubar-id'))).toEqual(
      menuBarDemoMenus.map((menu) => String(menu.id)),
    );
  });
});
