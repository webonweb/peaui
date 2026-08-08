/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { contextMenuDemoItems } from './context-menu.demo';
import ContextMenu from './index';
import type { ContextMenuHandle } from './index';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function rootMenu(): HTMLElement {
  return document.querySelector(
    '.peaui-context-menu__menu > .peaui-dropdown-menu__surface',
  ) as HTMLElement;
}

describe('ContextMenu React', () => {
  it('renderuje natywny kontrakt ARIA i otwiera menu dokładnie przez contextmenu', async () => {
    const onOpen = vi.fn();
    render(
      <ContextMenu
        ariaLabel="Akcje rekordu"
        context={{ id: 7 }}
        items={contextMenuDemoItems}
        onOpen={onOpen}
      >
        <button type="button">Raport kwartalny</button>
      </ContextMenu>,
    );
    const target = screen.getByRole('button', { name: 'Raport kwartalny' });
    const nativeEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 90,
    });
    fireEvent(target, nativeEvent);

    const menu = screen.getByRole('menu', { name: 'Akcje rekordu' });
    expect(nativeEvent.defaultPrevented).toBe(true);
    expect(target).toHaveAttribute('aria-haspopup', 'menu');
    expect(target).toHaveAttribute('aria-expanded', 'true');
    expect(target).toHaveAttribute('aria-controls', menu.id);
    expect(menu).toBeVisible();
    expect(onOpen).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'pointer', x: 120, y: 90 }),
    );
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: /Edytuj profil/ })).toHaveFocus(),
    );
  });

  it('obsługuje Shift+F10, Escape i ponowne otwarcie w trybie kontrolowanym', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <ContextMenu items={contextMenuDemoItems} open={open} onOpenChange={setOpen}>
          <button type="button">Dokument</button>
        </ContextMenu>
      );
    }
    render(<Controlled />);
    const target = screen.getByRole('button', { name: 'Dokument' });
    target.focus();
    fireEvent.keyDown(target, { key: 'F10', shiftKey: true });
    await waitFor(() =>
      expect(screen.getByRole('menu', { name: 'Menu kontekstowe' })).toBeVisible(),
    );
    fireEvent.keyDown(screen.getByRole('menuitem', { name: /Edytuj profil/ }), { key: 'Escape' });
    await waitFor(() => expect(target).toHaveFocus());
    expect(rootMenu()).not.toBeVisible();
    fireEvent.keyDown(target, { key: 'ContextMenu' });
    await waitFor(() =>
      expect(screen.getByRole('menu', { name: 'Menu kontekstowe' })).toBeVisible(),
    );
  });

  it('przekazuje aktualny kontekst w akcji oraz udostępnia openAt i close przez ref', () => {
    const onSelect = vi.fn();
    const onContextChange = vi.fn();
    const reference = createRef<ContextMenuHandle>();
    render(
      <ContextMenu
        context={{ id: 'first' }}
        items={contextMenuDemoItems}
        onContextChange={onContextChange}
        onSelect={onSelect}
        ref={reference}
      />,
    );
    act(() => {
      expect(reference.current?.openAt({ context: { id: 'second' }, x: 40, y: 60 })).toBe(true);
    });
    fireEvent.click(screen.getByRole('menuitem', { name: /Edytuj profil/ }));

    expect(onContextChange).toHaveBeenCalledWith({ id: 'second' });
    expect(onSelect).toHaveBeenCalledWith(
      contextMenuDemoItems[0],
      [0],
      expect.objectContaining({ id: 'second' }),
    );
    reference.current?.close();
  });

  it('nie anuluje natywnego menu w stanie disabled', () => {
    render(<ContextMenu disabled items={contextMenuDemoItems} />);
    const target = screen.getByText('Kliknij prawym przyciskiem lub naciśnij Shift+F10');
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fireEvent(target, event);
    expect(event.defaultPrevented).toBe(false);
    expect(rootMenu()).not.toBeVisible();
  });

  it('anuluje long press po ruchu i otwiera go po nieruchomym przytrzymaniu', async () => {
    vi.useFakeTimers();
    const onLongPressCancel = vi.fn();
    render(
      <ContextMenu
        items={contextMenuDemoItems}
        longPressDelay={400}
        longPressMoveThreshold={8}
        onLongPressCancel={onLongPressCancel}
      />,
    );
    const target = screen.getByText('Kliknij prawym przyciskiem lub naciśnij Shift+F10');
    fireEvent.pointerDown(target, {
      button: 0,
      clientX: 20,
      clientY: 30,
      isPrimary: true,
      pointerId: 1,
      pointerType: 'touch',
    });
    fireEvent.pointerMove(target, { clientX: 40, clientY: 30, pointerId: 1 });
    act(() => vi.advanceTimersByTime(450));
    expect(rootMenu()).not.toBeVisible();
    expect(onLongPressCancel).toHaveBeenCalledWith('move');

    fireEvent.pointerDown(target, {
      button: 0,
      clientX: 50,
      clientY: 70,
      isPrimary: true,
      pointerId: 2,
      pointerType: 'touch',
    });
    act(() => vi.advanceTimersByTime(400));
    await Promise.resolve();
    expect(screen.getByRole('menu', { name: 'Menu kontekstowe' })).toBeVisible();
  });
});
