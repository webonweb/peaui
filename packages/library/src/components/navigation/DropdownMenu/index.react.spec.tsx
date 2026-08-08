/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dropdownMenuDemoItems } from './dropdown-menu.demo';
import DropdownMenu from './index';

afterEach(cleanup);

describe('DropdownMenu React', () => {
  it('pozwala kontrolowanemu menu zamknąć się i otworzyć ponownie', () => {
    function ControlledMenu() {
      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu
          items={[{ id: 'edit', label: 'Edytuj' }]}
          onOpenChange={setOpen}
          open={open}
        />
      );
    }

    render(<ControlledMenu />);
    const trigger = screen.getByRole('button', { name: 'Otwórz menu' });
    const menu = screen.getByRole('menu', { hidden: true });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toBeVisible();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toBeVisible();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toBeVisible();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toBeVisible();
  });

  it('renderuje natywny kontrakt menu i wiąże ARIA triggera', async () => {
    render(
      <DropdownMenu ariaLabel="Akcje rekordu" dataTestId="actions" items={dropdownMenuDemoItems} />,
    );
    const trigger = screen.getByRole('button', { name: 'Otwórz menu' });
    fireEvent.click(trigger);
    const menu = screen.getByRole('menu', { name: 'Akcje rekordu' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(screen.getByRole('group', { name: 'Preferencje' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(2);
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: /Edytuj profil/ })).toHaveFocus(),
    );
  });

  it('pomija disabled, wspiera Home/End, zapętlenie i typeahead', async () => {
    const items = [
      { id: 'disabled', label: 'Niedostępna', disabled: true },
      { id: 'alpha', label: 'Alfa' },
      { id: 'beta', label: 'Beta' },
      { id: 'path', label: 'Ścieżka' },
    ];
    render(<DropdownMenu items={items} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Otwórz menu' }), { key: 'ArrowDown' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Alfa' })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Alfa' }), { key: 'End' });
    expect(screen.getByRole('menuitem', { name: 'Ścieżka' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Ścieżka' }), { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Alfa' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Alfa' }), { key: 's' });
    expect(screen.getByRole('menuitem', { name: 'Ścieżka' })).toHaveFocus();
  });

  it('emituje akcję, wartość i kontrolowaną zmianę checked', () => {
    const onSelect = vi.fn();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    const items = [
      { id: 'check', type: 'checkbox' as const, label: 'Powiadomienia', checked: true },
      { id: 'radio', type: 'radio' as const, label: 'Kompaktowy', value: 'compact' },
    ];
    render(
      <DropdownMenu
        defaultOpen
        items={items}
        onCheckedChange={onCheckedChange}
        onSelect={onSelect}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('menuitemcheckbox'));
    fireEvent.click(screen.getByRole('menuitemradio'));

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, items[0], false, [0]);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, items[1], true, [1]);
    expect(onValueChange).toHaveBeenCalledWith(items[1], 'compact', [1]);
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('obsługuje podmenu, ArrowLeft i Escape z przywróceniem fokusu', async () => {
    const onEscape = vi.fn();
    render(
      <DropdownMenu
        items={[
          {
            id: 'share',
            type: 'submenu',
            label: 'Udostępnij',
            children: [{ id: 'link', label: 'Kopiuj link' }],
          },
        ]}
        onEscape={onEscape}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Otwórz menu' });
    fireEvent.click(trigger);
    const parent = screen.getByRole('menuitem', { name: 'Udostępnij' });
    fireEvent.keyDown(parent, { key: 'ArrowRight' });
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Kopiuj link' })).toHaveFocus(),
    );
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Kopiuj link' }), { key: 'ArrowLeft' });
    expect(parent).toHaveFocus();
    expect(parent).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(parent, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(onEscape).toHaveBeenCalledOnce();
  });

  it('zamyka zwykłą akcję i kliknięcie poza menu, lecz Tab nie więzi fokusu', () => {
    const onOpenChange = vi.fn();
    const onOutsideClick = vi.fn();
    const { rerender } = render(
      <DropdownMenu
        defaultOpen
        items={[{ id: 'edit', label: 'Edytuj' }]}
        onOpenChange={onOpenChange}
        onOutsideClick={onOutsideClick}
      />,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edytuj' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    rerender(
      <DropdownMenu
        defaultOpen
        items={[{ id: 'edit', label: 'Edytuj' }]}
        onOpenChange={onOpenChange}
        onOutsideClick={onOutsideClick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Otwórz menu' }));
    fireEvent.pointerDown(document.body);
    expect(onOutsideClick).toHaveBeenCalledOnce();
  });

  it('wspiera bezpieczny render prop triggera, stany i gęstość', () => {
    const { rerender } = render(
      <DropdownMenu
        density="compact"
        disabled
        items={[]}
        renderTrigger={() => <button type="button">Więcej</button>}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Więcej' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger.closest('.peaui-dropdown-menu')).toHaveClass(
      'peaui-dropdown-menu--density-compact',
    );

    rerender(<DropdownMenu items={[]} open />);
    expect(screen.getByRole('menuitem', { name: 'Brak dostępnych akcji' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    rerender(<DropdownMenu items={[]} loading loadingContent="Pobieranie…" open />);
    expect(screen.getByRole('menuitem', { name: 'Pobieranie…' })).toHaveAttribute(
      'aria-live',
      'polite',
    );
    expect(screen.getByRole('menu')).toHaveAttribute('aria-busy', 'true');
  });
});
