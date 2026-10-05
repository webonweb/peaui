/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act, createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SegmentedControl from './index';

const items = [
  { value: 'list', label: 'Lista' },
  { value: 'grid', label: 'Kafelki', disabled: true },
  { value: 30, label: 'Kompaktowo' },
];

afterEach(cleanup);

describe('SegmentedControl React', () => {
  it('renderuje natywną radiogroup z refem, wyborem i jednym tab stopem', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SegmentedControl ref={ref} ariaLabel="Widok wyników" defaultValue="list" items={items} />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Widok wyników' });
    const radios = screen.getAllByRole('radio');

    expect(ref.current).toBe(group);
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios.filter((radio) => radio.getAttribute('aria-checked') === 'true')).toHaveLength(1);
  });

  it('obsługuje niekontrolowany model i kolejność callbacków', () => {
    const order: string[] = [];
    const onValueChange = vi.fn((..._args: unknown[]) => order.push('value'));
    const onChange = vi.fn((..._args: unknown[]) => order.push('change'));
    render(
      <SegmentedControl
        items={items}
        name="period"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Kompaktowo' }));

    expect(onValueChange).toHaveBeenCalledWith(30);
    expect(onChange.mock.calls[0]?.[0]).toBe(30);
    expect(onChange.mock.calls[0]?.[1]).toMatchObject({ value: 30 });
    expect(order).toEqual(['value', 'change']);
    expect(screen.getByRole('radio', { name: 'Kompaktowo' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(document.querySelector('input[name="period"]')).toHaveValue('30');
  });

  it('automatycznie wybiera strzałką, pomija disabled i emituje fokus', () => {
    const onValueChange = vi.fn();
    const onFocusChange = vi.fn();
    render(
      <SegmentedControl
        items={items}
        onFocusChange={onFocusChange}
        onValueChange={onValueChange}
      />,
    );
    const radios = screen.getAllByRole('radio');
    fireEvent.focus(radios[0]!);
    fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });

    expect(radios[2]).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith(30);
    expect(onFocusChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 30 }), 2);
  });

  it('w trybie manual wybiera dopiero po aktywacji', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        activation="manual"
        defaultValue="list"
        items={items}
        onValueChange={onValueChange}
      />,
    );
    const radios = screen.getAllByRole('radio');
    fireEvent.focus(radios[0]!);
    fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });
    expect(radios[2]).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.click(radios[2]!);
    expect(onValueChange).toHaveBeenCalledWith(30);
  });

  it('obsługuje pion, RTL i funkcje renderujące', () => {
    const enabledItems = items.map((item) => ({ ...item, disabled: false }));
    render(
      <SegmentedControl
        defaultValue="list"
        dir="rtl"
        items={enabledItems}
        renderIndicator={(item) => item?.label}
        renderItem={(item, state) => `${state.selected ? 'Wybrano' : 'Wybierz'} ${item.label}`}
      />,
    );
    const first = screen.getByRole('radio', { name: 'Lista' });
    fireEvent.focus(first);
    fireEvent.keyDown(first, { key: 'ArrowLeft' });

    const second = screen.getByRole('radio', { name: 'Kafelki' });
    expect(second).toHaveFocus();
    expect(first).toHaveTextContent('Wybierz Lista');
    expect(second).toHaveTextContent('Wybrano Kafelki');
    expect(document.querySelector('.peaui-segmented-control__indicator')).toHaveTextContent(
      'Kafelki',
    );
  });

  it('przenosi fokus po dynamicznym usunięciu aktywnej pozycji', async () => {
    const { rerender } = render(<SegmentedControl items={items} />);
    await act(async () => {
      screen.getByRole('radio', { name: 'Kompaktowo' }).focus();
      rerender(<SegmentedControl items={items.slice(0, 2)} />);
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByRole('radio', { name: 'Lista' })).toHaveFocus());
  });

  it('blokuje grupę i nie emituje dla aktywnej lub disabled pozycji', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl disabled defaultValue="list" items={items} onValueChange={onValueChange} />,
    );
    const group = screen.getByRole('radiogroup');
    screen.getAllByRole('radio').forEach((radio) => fireEvent.click(radio));

    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByRole('radio').every((radio) => radio.tabIndex === -1)).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
