import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SplitButton from './index.vue';
import { splitButtonDemoItems } from './split-button.demo';

afterEach(cleanup);

const renderSplitButton = (props: Record<string, unknown> = {}) =>
  render(SplitButton, {
    props: {
      ariaLabel: 'Akcje eksportu',
      items: splitButtonDemoItems,
      label: 'Eksportuj',
      menuAriaLabel: 'Więcej opcji eksportu',
      ...props,
    },
  });

describe('SplitButton Vue', () => {
  it('renderuje grupę dwóch natywnych, osobno nazwanych przycisków', async () => {
    renderSplitButton({ dataTestId: 'split' });

    const group = screen.getByRole('group', { name: 'Akcje eksportu' });
    const primary = screen.getByRole('button', { name: 'Eksportuj' });
    const trigger = await screen.findByRole('button', { name: 'Więcej opcji eksportu' });

    expect(group).toHaveClass('peaui-split-button', 'peaui-split-button--variant-primary');
    expect(primary).toHaveAttribute('data-testid', 'split-primary');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-haspopup', 'menu'));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('rozdziela główną akcję od otwierania i wyboru menu', async () => {
    const onPrimaryClick = vi.fn();
    const onSelect = vi.fn();
    const onOpen = vi.fn();
    renderSplitButton({
      onPrimaryClick,
      onSelect,
      'onUpdate:open': onOpen,
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Eksportuj' }));
    expect(onPrimaryClick).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();

    await fireEvent.click(screen.getByRole('button', { name: 'Więcej opcji eksportu' }));
    expect(onPrimaryClick).toHaveBeenCalledOnce();
    expect(onOpen).toHaveBeenLastCalledWith(true);

    await fireEvent.click(await screen.findByRole('menuitem', { name: 'Eksportuj jako PDF' }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pdf', value: 'pdf' }),
      [0, 0],
    );
    expect(onPrimaryClick).toHaveBeenCalledOnce();
  });

  it('otwiera menu ArrowDown, przenosi fokus i przywraca go po Escape', async () => {
    renderSplitButton();
    const trigger = await screen.findByRole('button', { name: 'Więcej opcji eksportu' });
    trigger.focus();

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const firstItem = await screen.findByRole('menuitem', { name: 'Eksportuj jako PDF' });
    await waitFor(() => expect(firstItem).toHaveFocus());
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await fireEvent.keyDown(firstItem, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('stosuje niezależne blokady obu części', async () => {
    const { rerender } = renderSplitButton({ primaryDisabled: true });
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeDisabled();
    expect(await screen.findByRole('button', { name: 'Więcej opcji eksportu' })).toBeEnabled();

    await rerender({
      ariaLabel: 'Akcje eksportu',
      items: splitButtonDemoItems,
      label: 'Eksportuj',
      menuAriaLabel: 'Więcej opcji eksportu',
      menuDisabled: true,
      primaryDisabled: false,
    });
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Więcej opcji eksportu' })).toBeDisabled();

    await rerender({
      ariaLabel: 'Akcje eksportu',
      disabled: true,
      items: splitButtonDemoItems,
      label: 'Eksportuj',
      menuDisabled: false,
      menuAriaLabel: 'Więcej opcji eksportu',
      primaryDisabled: false,
    });
    expect(screen.getAllByRole('button').every((button) => button.hasAttribute('disabled'))).toBe(
      true,
    );
  });

  it('loading blokuje tylko główną akcję i udostępnia status', async () => {
    renderSplitButton({ loading: true, loadingLabel: 'Trwa eksportowanie' });

    expect(screen.getByRole('button', { name: 'Eksportuj' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Eksportuj' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Trwa eksportowanie');
    expect(await screen.findByRole('button', { name: 'Więcej opcji eksportu' })).toBeEnabled();
  });

  it('menuLoading pozostawia trigger dostępny i oznacza powierzchnię jako zajętą', async () => {
    renderSplitButton({ menuLoading: true, menuLoadingLabel: 'Pobieranie formatów' });
    const trigger = await screen.findByRole('button', { name: 'Więcej opcji eksportu' });

    await fireEvent.click(trigger);

    const menu = await screen.findByRole('menu', { name: 'Więcej opcji eksportu' });
    expect(menu).toHaveAttribute('aria-busy', 'true');
    const loadingItem = screen.getByRole('menuitem', { name: 'Pobieranie formatów' });
    expect(loadingItem).toHaveAttribute('aria-disabled', 'true');
    expect(loadingItem).toHaveAttribute('aria-live', 'polite');
    expect(trigger).toBeEnabled();
  });

  it('respektuje kontrolowany stan open i wyrównanie menu', async () => {
    renderSplitButton({ menuAlign: 'start', open: true });

    const menu = await screen.findByRole('menu', { name: 'Więcej opcji eksportu' });
    expect(menu).toBeVisible();
    expect(menu).toHaveAttribute('data-align', 'start');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Więcej opcji eksportu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      ),
    );
  });
});
