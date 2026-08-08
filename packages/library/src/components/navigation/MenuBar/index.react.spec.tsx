/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { menuBarDemoMenus } from './menu-bar.demo';
import MenuBar from './index';

afterEach(cleanup);

const triggers = (): HTMLButtonElement[] =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menubar-index]'));

describe('MenuBar React', () => {
  it('renderuje natywny menubar z roving tabindex i kompletnym ARIA', () => {
    render(<MenuBar ariaLabel="Menu projektu" dataTestId="app-menu" menus={menuBarDemoMenus} />);
    const bar = screen.getByRole('menubar', { name: 'Menu projektu' });

    expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    expect(triggers().map((trigger) => trigger.tabIndex)).toEqual([0, -1, -1, -1, -1]);
    expect(triggers()[0]).toHaveAttribute('aria-haspopup', 'menu');
    expect(triggers()[0]?.getAttribute('aria-controls')).toBeTruthy();
  });

  it('nawiguje między triggerami, pomija disabled i wspiera Home/End oraz typeahead', () => {
    const onFocusChange = vi.fn();
    const menus = menuBarDemoMenus.slice(0, 4).map((menu, index) => ({
      ...menu,
      disabled: index === 1,
    }));
    render(<MenuBar menus={menus} onFocusChange={onFocusChange} />);
    triggers()[0]?.focus();
    fireEvent.keyDown(triggers()[0]!, { key: 'ArrowRight' });
    expect(triggers()[2]).toHaveFocus();
    fireEvent.keyDown(triggers()[2]!, { key: 'Home' });
    expect(triggers()[0]).toHaveFocus();
    fireEvent.keyDown(triggers()[0]!, { key: 'End' });
    expect(triggers()[3]).toHaveFocus();
    fireEvent.keyDown(triggers()[3]!, { key: 'w' });
    expect(triggers()[2]).toHaveFocus();
    expect(onFocusChange).toHaveBeenCalled();
  });

  it('działa kontrolowanie, otwiera strzałką i przełącza sekcję z pozycji menu', async () => {
    function Controlled() {
      const [openMenu, setOpenMenu] = useState<string | number | null>(null);
      return (
        <MenuBar
          menus={menuBarDemoMenus.slice(0, 3)}
          openMenu={openMenu}
          onOpenMenuChange={setOpenMenu}
        />
      );
    }
    render(<Controlled />);
    fireEvent.keyDown(triggers()[0]!, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: /Nowy dokument/ })).toHaveFocus(),
    );
    fireEvent.keyDown(screen.getByRole('menuitem', { name: /Nowy dokument/ }), {
      key: 'ArrowRight',
    });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Cofnij/ })).toHaveFocus());
    expect(triggers()[1]).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(screen.getByRole('menuitem', { name: /Cofnij/ }), { key: 'Escape' });
    await waitFor(() => expect(triggers()[1]).toHaveFocus());
    fireEvent.click(triggers()[1]!);
    await waitFor(() => expect(screen.getByRole('menu', { name: 'Edycja' })).toBeVisible());
  });

  it('nie przechwytuje ArrowRight od pozycji posiadającej podmenu', async () => {
    render(<MenuBar defaultOpenMenu="file" menus={menuBarDemoMenus.slice(0, 2)} />);
    const submenu = screen.getByRole('menuitem', { name: 'Eksportuj' });
    fireEvent.keyDown(submenu, { key: 'ArrowRight' });
    expect(submenu).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(document.querySelector('[data-menu-path="4-0"]')).toHaveFocus());
    expect(triggers()[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('przekazuje zdarzenia z menu i sekcję nadrzędną', () => {
    const onSelect = vi.fn();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    const menu = {
      id: 'view',
      label: 'Widok',
      items: [
        { id: 'grid', type: 'checkbox' as const, label: 'Siatka', checked: true },
        { id: 'compact', type: 'radio' as const, label: 'Kompaktowy', value: 'compact' },
      ],
    };
    render(
      <MenuBar
        defaultOpenMenu="view"
        menus={[menu]}
        onCheckedChange={onCheckedChange}
        onSelect={onSelect}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('menuitemcheckbox'));
    fireEvent.click(screen.getByRole('menuitemradio'));

    expect(onSelect).toHaveBeenNthCalledWith(1, menu.items[0], [0], menu);
    expect(onCheckedChange).toHaveBeenCalledWith(menu.items[0], false, [0], menu);
    expect(onValueChange).toHaveBeenCalledWith(menu.items[1], 'compact', [1], menu);
  });

  it('zamyka usuniętą sekcję i utrzymuje fokusowany trigger w mobilnym overflow', async () => {
    const onOpenMenuChange = vi.fn();
    const { rerender } = render(
      <MenuBar
        defaultOpenMenu="edit"
        menus={menuBarDemoMenus}
        onOpenMenuChange={onOpenMenuChange}
      />,
    );
    rerender(<MenuBar menus={[menuBarDemoMenus[0]!]} onOpenMenuChange={onOpenMenuChange} />);
    await waitFor(() => expect(onOpenMenuChange).toHaveBeenCalledWith(null));

    rerender(<MenuBar menus={menuBarDemoMenus} onOpenMenuChange={onOpenMenuChange} />);

    const viewport = document.querySelector('.peaui-menu-bar__viewport') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 220 });
    Object.defineProperty(viewport, 'scrollWidth', { configurable: true, value: 640 });
    const scrollIntoView = vi.fn();
    triggers().at(-1)!.scrollIntoView = scrollIntoView;
    triggers()[0]?.focus();
    fireEvent.keyDown(triggers()[0]!, { key: 'End' });
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
  });

  it('wspiera wariant compact, stan disabled i bezpieczne render props', () => {
    render(
      <MenuBar
        disabled
        menus={menuBarDemoMenus.slice(0, 1)}
        renderItem={(item) => <strong>{item.label}</strong>}
        renderMenuTrigger={(menu) => <span>Dział: {menu.label}</span>}
        renderShortcut={(item) => <kbd>{item.shortcut}</kbd>}
        variant="compact"
      />,
    );
    expect(screen.getByRole('menubar')).toHaveClass('peaui-menu-bar--compact');
    expect(triggers()[0]).toBeDisabled();
    expect(triggers()[0]).toHaveTextContent('Dział: Plik');
  });
});
