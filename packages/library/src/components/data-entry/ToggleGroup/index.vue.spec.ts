import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ToggleGroup, { type ToggleGroupItem } from './index.vue';

const items: ToggleGroupItem[] = [
  { value: 'grid', label: 'Kafelki' },
  { value: 'list', label: 'Lista', disabled: true },
  { value: 3, label: 'Kompaktowo' },
];

afterEach(cleanup);

describe('ToggleGroup Vue', () => {
  it('przekazuje rozmiar i nie rezerwuje pustego miejsca na ikonę przy samym tekście', () => {
    render(ToggleGroup, { props: { items, orientation: 'vertical', size: 's' } });
    const group = screen.getByRole('toolbar');
    const buttons = screen.getAllByRole('button');

    expect(group).toHaveClass('peaui-toggle-group--size-s');
    expect(
      buttons.every((button) => button.classList.contains('peaui-toggle-button--size-s')),
    ).toBe(true);
    expect(document.querySelectorAll('.peaui-toggle-button__icon')).toHaveLength(0);
  });

  it('renderuje opisaną grupę i najwyżej jeden tab stop', () => {
    render(ToggleGroup, { props: { items, label: 'Widok wyników', value: 'grid' } });
    const group = screen.getByRole('toolbar', { name: 'Widok wyników' });
    const buttons = screen.getAllByRole('button');

    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(buttons.map((button) => button.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toBeDisabled();
  });

  it('emituje model przed change i zachowuje typ wartości single', async () => {
    const order: string[] = [];
    const onValueChange = vi.fn((..._args: unknown[]) => order.push('value'));
    const onChange = vi.fn((..._args: unknown[]) => order.push('change'));
    render(ToggleGroup, {
      props: { items, onChange, 'onUpdate:value': onValueChange },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Kompaktowo' }));

    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(onChange.mock.calls[0]?.[0]).toBe(3);
    expect(onChange.mock.calls[0]?.[1]).toMatchObject({ value: 3 });
    expect(onChange.mock.calls[0]?.[2]).toBeInstanceOf(MouseEvent);
    expect(order).toEqual(['value', 'change']);
  });

  it('obsługuje wielokrotny wybór i ukryte pola formularza', async () => {
    render(ToggleGroup, {
      props: { items, type: 'multiple', name: 'view', value: ['grid'] },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Kompaktowo' }));

    expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Kompaktowo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(document.querySelectorAll('input[name="view"]')).toHaveLength(2);
  });

  it('nie pozwala usunąć ostatniego wymaganego wyboru', async () => {
    const onValueChange = vi.fn();
    render(ToggleGroup, {
      props: { items, required: true, value: 'grid', 'onUpdate:value': onValueChange },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Kafelki' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('pokazuje dostępny błąd required i łączy aria-describedby', () => {
    render(ToggleGroup, { props: { items, label: 'Widok', required: true } });
    const group = screen.getByRole('toolbar', { name: 'Widok' });
    const alert = screen.getByRole('alert');

    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group.getAttribute('aria-describedby')?.split(' ')).toContain(alert.id);
    expect(alert).toHaveTextContent('Wybierz co najmniej');
  });

  it('nawiguje strzałkami, Home i End bez zmiany wyboru', async () => {
    const onFocusChange = vi.fn();
    render(ToggleGroup, { props: { items, value: 'grid', onFocusChange } });
    const buttons = screen.getAllByRole('button');
    buttons[0]?.focus();

    await fireEvent.keyDown(buttons[0]!, { key: 'ArrowRight' });
    expect(buttons[2]).toHaveFocus();
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    expect(onFocusChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 3 }), 2);
    await fireEvent.keyDown(buttons[2]!, { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
    await fireEvent.keyDown(buttons[0]!, { key: 'End' });
    expect(buttons[2]).toHaveFocus();
  });

  it('odwraca poziome strzałki w RTL i respektuje brak pętli', async () => {
    render(ToggleGroup, { attrs: { dir: 'rtl' }, props: { items, loop: false } });
    const buttons = screen.getAllByRole('button');
    buttons[0]?.focus();

    await fireEvent.keyDown(buttons[0]!, { key: 'ArrowLeft' });
    expect(buttons[2]).toHaveFocus();
    await fireEvent.keyDown(buttons[2]!, { key: 'ArrowLeft' });
    expect(buttons[2]).toHaveFocus();
  });

  it('po usunięciu aktywnej pozycji deterministycznie przenosi fokus', async () => {
    const { rerender } = render(ToggleGroup, { props: { items } });
    const before = screen.getAllByRole('button');
    before[2]?.focus();

    await rerender({ items: items.slice(0, 2) });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveFocus());
    expect(screen.getAllByRole('button').filter((button) => button.tabIndex === 0)).toHaveLength(1);
  });

  it('blokuje całą grupę bez pozostawiania tab stopu', () => {
    render(ToggleGroup, { props: { disabled: true, items } });
    const group = screen.getByRole('toolbar');
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByRole('button').every((button) => button.tabIndex === -1)).toBe(true);
  });
});
