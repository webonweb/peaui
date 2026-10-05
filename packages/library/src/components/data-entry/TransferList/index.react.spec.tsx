/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TransferList from './index';
import { transferListItems } from './transfer-list.demo';
import type { TransferListKey } from './transfer-list.shared';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('TransferList React', () => {
  it('does not highlight an option before the listbox receives focus', () => {
    const { container } = render(<TransferList items={transferListItems} />);
    expect(container.querySelector('.peaui-transfer-list__option--active')).toBeNull();
    const listbox = screen.getByRole('listbox', { name: 'Dostępne' });
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
    fireEvent.focus(listbox);
    expect(container.querySelector('.peaui-transfer-list__option--active')).not.toBeNull();
    expect(listbox).toHaveAttribute('aria-activedescendant');
  });

  it('renderuje tę samą strukturę listbox i stan disabled', () => {
    const { container } = render(
      <TransferList defaultValue={['analytics']} items={transferListItems} />,
    );
    const source = screen.getByRole('listbox', { name: 'Dostępne' });
    const target = screen.getByRole('listbox', { name: 'Przypisane' });

    expect(source).toHaveAttribute('aria-multiselectable', 'true');
    expect(target).toHaveAttribute('aria-multiselectable', 'true');
    expect(
      [...container.querySelector('.peaui-transfer-list__layout')!.children].map(
        (element) => element.getAttribute('data-panel') ?? 'controls',
      ),
    ).toEqual(['source', 'controls', 'target']);
    expect(screen.getByRole('option', { name: /Administracja systemowa/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('zachowuje kontrakt kontrolowany i emituje jeden szczegółowy move', () => {
    const onMove = vi.fn();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<TransferListKey[]>(['analytics']);
      return (
        <TransferList
          items={transferListItems}
          onMove={onMove}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
          value={value}
        />
      );
    }

    render(<Controlled />);
    fireEvent.click(screen.getByRole('option', { name: /Rozliczenia/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Przenieś zaznaczone do przypisanych' }));

    expect(onValueChange).toHaveBeenCalledWith(['analytics', 'billing']);
    expect(onMove).toHaveBeenCalledOnce();
    expect(onMove).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'to-target', movedKeys: ['billing'] }),
    );
    expect(screen.getByRole('status').textContent).toContain('Przeniesiono 1');
  });

  it('filtruje niezależnie i transfer all ogranicza do widocznych dozwolonych opcji', () => {
    const onValueChange = vi.fn();
    const onSearch = vi.fn();
    render(
      <TransferList
        defaultValue={['analytics', 'security']}
        items={transferListItems}
        onSearch={onSearch}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Filtruj dostępne elementy' }), {
      target: { value: 'rozliczenia' },
    });
    const source = screen.getByRole('listbox', { name: 'Dostępne' });
    const target = screen.getByRole('listbox', { name: 'Przypisane' });
    expect(within(source).getAllByRole('option')).toHaveLength(1);
    expect(within(target).getAllByRole('option')).toHaveLength(2);
    fireEvent.click(
      screen.getByRole('button', { name: 'Przenieś wszystkie widoczne do przypisanych' }),
    );

    expect(onValueChange).toHaveBeenCalledWith(['analytics', 'security', 'billing']);
    expect(onSearch).toHaveBeenLastCalledWith({ panel: 'source', query: 'rozliczenia' });
  });

  it('obsługuje klawiaturę wielokrotnego wyboru i pomija disabled', () => {
    const onSelection = vi.fn();
    render(<TransferList items={transferListItems} onSourceSelectedChange={onSelection} />);
    const source = screen.getByRole('listbox', { name: 'Dostępne' });

    source.focus();
    fireEvent.keyDown(source, { key: 'End' });
    expect(source.getAttribute('aria-activedescendant')).toContain('option-6');
    fireEvent.keyDown(source, { key: 'Home' });
    fireEvent.keyDown(source, { key: 'ArrowDown', shiftKey: true });
    expect(onSelection).toHaveBeenLastCalledWith(['analytics', 'billing']);
    fireEvent.keyDown(source, { key: 'a', ctrlKey: true });
    expect(onSelection.mock.calls.at(-1)?.[0]).toHaveLength(7);
  });

  it('blokuje wszystkie interakcje przy disabled oraz per-panel loading', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <TransferList disabled items={transferListItems} onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('group')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByRole('listbox').every((listbox) => listbox.tabIndex === -1)).toBe(true);

    rerender(
      <TransferList
        dataTestId="transfer"
        items={transferListItems}
        loading={{ source: true }}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByTestId('transfer-source-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('transfer-target-loading')).not.toBeInTheDocument();
  });

  it('łączy błąd z root i obiema listami', () => {
    render(<TransferList error="Nie udało się zapisać" items={transferListItems} />);
    const group = screen.getByRole('group');
    const error = screen.getByText('Nie udało się zapisać').closest('.peaui-message-text');

    expect(error).not.toBeNull();
    if (!error) return;

    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    for (const listbox of screen.getAllByRole('listbox')) {
      expect(listbox).toHaveAttribute('aria-describedby', error.id);
    }
  });

  it('renderuje wszystkie odpowiedniki slotów jako render props', () => {
    render(
      <TransferList
        items={[]}
        renderSourceEmpty={() => <span>Brak własny</span>}
        renderSourceHeader={({ count }) => <span>Źródło ({count})</span>}
      />,
    );

    expect(screen.getByRole('listbox', { name: 'Źródło (0)' })).toBeInTheDocument();
    expect(screen.getByText('Brak własny')).toBeInTheDocument();
  });
});
