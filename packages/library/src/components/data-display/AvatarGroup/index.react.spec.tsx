/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AvatarGroup from './index';
import { avatarGroupDemoItems } from './avatar-group.demo';

afterEach(cleanup);

describe('AvatarGroup React', () => {
  it('renderuje semantyczną listę, limit i stabilną kolejność osób', () => {
    const { container } = render(
      <AvatarGroup
        ariaLabel="Zespół"
        dataTestId="team"
        items={avatarGroupDemoItems}
        maxVisible={3}
      />,
    );

    expect(screen.getByRole('list', { name: 'Zespół' })).toBeInTheDocument();
    expect(container.querySelectorAll('.peaui-avatar-group__avatar-button')).toHaveLength(3);
    expect(
      [...container.querySelectorAll('.peaui-avatar-group__avatar-button')].map((button) =>
        button.getAttribute('aria-label'),
      ),
    ).toEqual(['Anna Kowalska, Dostępny', 'Jan Nowak, Zaraz wracam', 'Maria Wiśniewska, Zajęty']);
    expect(
      screen.getByRole('button', { name: 'Pokaż 2 pozostałych użytkowników' }),
    ).toHaveTextContent('+2');
  });

  it('przekazuje rekord i indeks, zachowując natywne disabled', () => {
    const onSelect = vi.fn();
    const items = [avatarGroupDemoItems[0]!, { ...avatarGroupDemoItems[1]!, disabled: true }];
    render(<AvatarGroup items={items} maxVisible={2} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Anna Kowalska/ }));
    fireEvent.click(screen.getByRole('button', { name: /Jan Nowak/ }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(items[0], 0);
    expect(screen.getByRole('button', { name: /Jan Nowak/ })).toBeDisabled();
  });

  it('obsługuje niekontrolowany popover, Escape i przywrócenie fokusu', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <AvatarGroup
        dataTestId="team"
        defaultOpen
        items={avatarGroupDemoItems}
        maxVisible={2}
        onOpenChange={onOpenChange}
        overflowMode="popover"
      />,
    );
    const overflow = screen.getByRole('button', { name: 'Pokaż 3 pozostałych użytkowników' });
    const dialog = screen.getByRole('dialog', { name: 'Pozostali użytkownicy (3)' });

    expect(overflow).toHaveAttribute('aria-expanded', 'true');
    expect(overflow).toHaveAttribute('aria-haspopup', 'dialog');
    expect(overflow).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog.querySelectorAll('.peaui-avatar-group__popover-button')).toHaveLength(3);
    await waitFor(() =>
      expect(document.activeElement).toBe(dialog.querySelector('button:not(:disabled)')),
    );

    fireEvent.keyDown(container.querySelector('.peaui-avatar-group')!, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(overflow).toHaveFocus());
    expect(overflow).toHaveAttribute('aria-expanded', 'false');
  });

  it('nie renderuje licznika w trybie none i wspiera render props', () => {
    const renderItem = vi.fn((item: (typeof avatarGroupDemoItems)[number]) => (
      <span>{item.initials ?? item.name}</span>
    ));
    const { container, rerender } = render(
      <AvatarGroup
        items={avatarGroupDemoItems}
        maxVisible={2}
        overflowMode="none"
        renderItem={renderItem}
      />,
    );

    expect(container.querySelector('.peaui-avatar-group__overflow-button')).toBeNull();
    expect(renderItem).toHaveBeenCalledTimes(2);

    rerender(
      <AvatarGroup
        defaultOpen
        items={avatarGroupDemoItems}
        maxVisible={2}
        overflowMode="popover"
        popoverHeader={<strong>Pełny skład</strong>}
        renderOverflow={(count) => <span>Pozostało {count}</span>}
      />,
    );
    expect(screen.getByText('Pełny skład')).toBeInTheDocument();
    expect(screen.getByText('Pozostało 3')).toBeInTheDocument();
  });

  it('renderuje pusty i ładowany stan z poprawnym aria-busy', () => {
    const { rerender } = render(<AvatarGroup empty={<span>Brak członków</span>} items={[]} />);
    expect(screen.getByText('Brak członków')).toBeInTheDocument();

    rerender(
      <AvatarGroup
        items={avatarGroupDemoItems}
        loading
        maxVisible={1}
        open
        overflowMode="popover"
      />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie użytkowników');
  });
});
