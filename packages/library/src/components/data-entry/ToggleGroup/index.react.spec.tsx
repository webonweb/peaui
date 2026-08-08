/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act, createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ToggleGroup from './index';

const items = [
  { value: 'grid', label: 'Kafelki' },
  { value: 'list', label: 'Lista', disabled: true },
  { value: 3, label: 'Kompaktowo' },
];

afterEach(cleanup);

describe('ToggleGroup React', () => {
  it('przekazuje rozmiar i nie rezerwuje pustego miejsca na ikonę przy samym tekście', () => {
    render(<ToggleGroup items={items} orientation="vertical" size="s" />);
    const group = screen.getByRole('toolbar');
    const buttons = screen.getAllByRole('button');

    expect(group).toHaveClass('peaui-toggle-group--size-s');
    expect(
      buttons.every((button) => button.classList.contains('peaui-toggle-button--size-s')),
    ).toBe(true);
    expect(document.querySelectorAll('.peaui-toggle-button__icon')).toHaveLength(0);
  });

  it('renderuje natywną grupę z refem i jednym tab stopem', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ToggleGroup ref={ref} items={items} label="Widok wyników" defaultValue="grid" />);

    expect(ref.current).toBe(screen.getByRole('toolbar', { name: 'Widok wyników' }));
    expect(screen.getAllByRole('button').map((button) => button.tabIndex)).toEqual([0, -1, -1]);
    expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('obsługuje niekontrolowany model single i kolejność callbacków', () => {
    const order: string[] = [];
    const onValueChange = vi.fn(() => order.push('value'));
    const onChange = vi.fn(() => order.push('change'));
    render(<ToggleGroup items={items} onChange={onChange} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Kompaktowo' }));

    expect(screen.getByRole('button', { name: 'Kompaktowo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(onChange.mock.calls[0]?.[0]).toBe(3);
    expect(order).toEqual(['value', 'change']);
  });

  it('utrzymuje tablicowy model multiple i pola formularza', () => {
    render(<ToggleGroup type="multiple" items={items} name="view" defaultValue={['grid']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kompaktowo' }));

    expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Kompaktowo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(document.querySelectorAll('input[name="view"]')).toHaveLength(2);
  });

  it('egzekwuje required i udostępnia błąd technologii asystującej', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ToggleGroup items={items} required defaultValue="grid" onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Kafelki' }));
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(<ToggleGroup items={items} required value={null} />);
    const group = screen.getByRole('toolbar');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Wybierz co najmniej');
  });

  it('nawiguje klawiaturą i pomija disabled bez zmiany wyboru', () => {
    const onFocusChange = vi.fn();
    render(<ToggleGroup items={items} defaultValue="grid" onFocusChange={onFocusChange} />);
    const buttons = screen.getAllByRole('button');
    buttons[0]?.focus();
    fireEvent.keyDown(buttons[0]!, { key: 'ArrowRight' });

    expect(buttons[2]).toHaveFocus();
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    expect(onFocusChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 3 }), 2);
    fireEvent.keyDown(buttons[2]!, { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
  });

  it('obsługuje pion, RTL i niestandardowe renderowanie pozycji', () => {
    render(
      <ToggleGroup
        items={items}
        orientation="vertical"
        renderItem={(item, state) => `${state.pressed ? 'Wybrano' : 'Wybierz'} ${item.label}`}
      />,
    );
    const group = screen.getByRole('toolbar');
    const first = screen.getByRole('button', { name: 'Kafelki' });

    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(first).toHaveTextContent('Wybierz Kafelki');
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: 'Kompaktowo' })).toHaveFocus();
  });

  it('przenosi fokus po dynamicznym usunięciu aktywnej pozycji', async () => {
    const { rerender } = render(<ToggleGroup items={items} />);
    await act(async () => {
      screen.getByRole('button', { name: 'Kompaktowo' }).focus();
      rerender(<ToggleGroup items={items.slice(0, 2)} />);
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Kafelki' })).toHaveFocus());
  });
});
