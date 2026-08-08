/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SplitButton from './index';
import { splitButtonDemoItems } from './split-button.demo';

afterEach(cleanup);

const renderSplitButton = (props: Record<string, unknown> = {}) =>
  render(
    <SplitButton
      ariaLabel="Akcje eksportu"
      items={splitButtonDemoItems}
      label="Eksportuj"
      menuAriaLabel="Więcej opcji eksportu"
      {...props}
    />,
  );

describe('SplitButton React', () => {
  it('renderuje natywną grupę, dwa przyciski, menu ARIA i ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SplitButton
        ref={ref}
        ariaLabel="Akcje eksportu"
        dataTestId="split"
        items={splitButtonDemoItems}
        label="Eksportuj"
        menuAriaLabel="Więcej opcji eksportu"
      />,
    );

    const group = screen.getByRole('group', { name: 'Akcje eksportu' });
    const trigger = screen.getByRole('button', { name: 'Więcej opcji eksportu' });
    expect(ref.current).toBe(group);
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toHaveAttribute(
      'data-testid',
      'split-primary',
    );
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('rozdziela primaryClick, otwieranie i select', () => {
    const onPrimaryClick = vi.fn();
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    renderSplitButton({ onOpenChange, onPrimaryClick, onSelect });

    fireEvent.click(screen.getByRole('button', { name: 'Eksportuj' }));
    expect(onPrimaryClick).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Więcej opcji eksportu' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Eksportuj jako PDF' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'pdf' }), [0, 0]);
    expect(onPrimaryClick).toHaveBeenCalledOnce();
  });

  it('obsługuje ArrowDown i Escape z przywróceniem fokusu', async () => {
    renderSplitButton();
    const trigger = screen.getByRole('button', { name: 'Więcej opcji eksportu' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const firstItem = screen.getByRole('menuitem', { name: 'Eksportuj jako PDF' });
    await waitFor(() => expect(firstItem).toHaveFocus());

    fireEvent.keyDown(firstItem, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('obsługuje niezależne blokady i globalne disabled', () => {
    const { rerender } = renderSplitButton({ primaryDisabled: true });
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Więcej opcji eksportu' })).toBeEnabled();

    rerender(
      <SplitButton
        ariaLabel="Akcje eksportu"
        items={splitButtonDemoItems}
        label="Eksportuj"
        menuAriaLabel="Więcej opcji eksportu"
        menuDisabled
      />,
    );
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Więcej opcji eksportu' })).toBeDisabled();

    rerender(
      <SplitButton
        ariaLabel="Akcje eksportu"
        disabled
        items={splitButtonDemoItems}
        label="Eksportuj"
        menuAriaLabel="Więcej opcji eksportu"
      />,
    );
    expect(screen.getAllByRole('button').every((button) => button.hasAttribute('disabled'))).toBe(
      true,
    );
  });

  it('renderuje niezależne stany loading i funkcje renderujące', () => {
    renderSplitButton({
      loading: true,
      loadingLabel: 'Trwa eksportowanie',
      renderMenuItem: (item: { label?: string }) => `Opcja: ${item.label}`,
    });

    expect(screen.getByRole('status')).toHaveTextContent('Trwa eksportowanie');
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Więcej opcji eksportu' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Więcej opcji eksportu' }));
    expect(screen.getByRole('menuitem', { name: 'Opcja: Eksportuj jako PDF' })).toBeVisible();
  });

  it('w menuLoading pokazuje dostępny stan bez blokowania triggera', () => {
    renderSplitButton({ menuLoading: true, menuLoadingLabel: 'Pobieranie formatów' });
    const trigger = screen.getByRole('button', { name: 'Więcej opcji eksportu' });
    fireEvent.click(trigger);

    expect(screen.getByRole('menu')).toHaveAttribute('aria-busy', 'true');
    const loadingItem = screen.getByRole('menuitem', { name: 'Pobieranie formatów' });
    expect(loadingItem).toHaveAttribute('aria-disabled', 'true');
    expect(loadingItem).toHaveAttribute('aria-live', 'polite');
    expect(trigger).toBeEnabled();
  });
});
