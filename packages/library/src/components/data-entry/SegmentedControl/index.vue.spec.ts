import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SegmentedControl, { type SegmentedControlItem } from './index.vue';

const items: SegmentedControlItem[] = [
  { value: 'list', label: 'Lista' },
  { value: 'grid', label: 'Kafelki', disabled: true },
  { value: 30, label: 'Kompaktowo' },
];

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('SegmentedControl Vue', () => {
  it('renderuje radiogroup, pojedynczy wybór i jeden tab stop', () => {
    render(SegmentedControl, {
      props: { ariaLabel: 'Widok wyników', items, value: 'list' },
    });
    const group = screen.getByRole('radiogroup', { name: 'Widok wyników' });
    const radios = screen.getAllByRole('radio');

    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1]);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios.filter((radio) => radio.getAttribute('aria-checked') === 'true')).toHaveLength(1);
    expect(radios[1]).toBeDisabled();
  });

  it('emituje model przed change, zachowuje typ wartości i pole formularza', async () => {
    const order: string[] = [];
    const onValueChange = vi.fn((..._args: unknown[]) => order.push('value'));
    const onChange = vi.fn((..._args: unknown[]) => order.push('change'));
    render(SegmentedControl, {
      props: { items, name: 'period', onChange, 'onUpdate:value': onValueChange },
    });

    await fireEvent.click(screen.getByRole('radio', { name: 'Kompaktowo' }));

    expect(onValueChange).toHaveBeenCalledWith(30);
    expect(onChange.mock.calls[0]?.[0]).toBe(30);
    expect(onChange.mock.calls[0]?.[1]).toMatchObject({ value: 30 });
    expect(onChange.mock.calls[0]?.[2]).toBeInstanceOf(MouseEvent);
    expect(order).toEqual(['value', 'change']);
    expect(document.querySelector('input[name="period"]')).toHaveValue('30');
  });

  it('wybiera automatycznie strzałką i pomija disabled', async () => {
    const onValueChange = vi.fn();
    const onFocusChange = vi.fn();
    render(SegmentedControl, {
      props: { items, onFocusChange, 'onUpdate:value': onValueChange },
    });
    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();

    await fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });

    expect(radios[2]).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith(30);
    expect(onFocusChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 30 }), 2);
  });

  it('w trybie manual strzałka przenosi tylko fokus, a aktywacja wybiera', async () => {
    const onValueChange = vi.fn();
    render(SegmentedControl, {
      props: { activation: 'manual', items, value: 'list', 'onUpdate:value': onValueChange },
    });
    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();

    await fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });
    expect(radios[2]).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    await fireEvent.click(radios[2]!);
    expect(onValueChange).toHaveBeenCalledWith(30);
  });

  it('obsługuje orientację pionową, Home, End oraz RTL', async () => {
    const enabledItems = items.map((item) => ({ ...item, disabled: false }));
    const { rerender } = render(SegmentedControl, {
      attrs: { dir: 'rtl' },
      props: { items: enabledItems, value: 'list' },
    });
    let radios = screen.getAllByRole('radio');
    radios[0]?.focus();
    await fireEvent.keyDown(radios[0]!, { key: 'ArrowLeft' });
    expect(radios[1]).toHaveFocus();
    await fireEvent.keyDown(radios[1]!, { key: 'End' });
    expect(radios[2]).toHaveFocus();

    await rerender({ items: enabledItems, orientation: 'vertical', value: 'list' });
    radios = screen.getAllByRole('radio');
    radios[0]?.focus();
    await fireEvent.keyDown(radios[0]!, { key: 'ArrowDown' });
    expect(radios[1]).toHaveFocus();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('przenosi fokus deterministycznie po usunięciu aktywnej pozycji', async () => {
    const { rerender } = render(SegmentedControl, { props: { items } });
    screen.getByRole('radio', { name: 'Kompaktowo' }).focus();

    await rerender({ items: items.slice(0, 2) });

    await waitFor(() => expect(screen.getByRole('radio', { name: 'Lista' })).toHaveFocus());
    expect(screen.getAllByRole('radio').filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
  });

  it('nie emituje ponownie dla wybranego ani wyłączonego segmentu', async () => {
    const onValueChange = vi.fn();
    render(SegmentedControl, {
      props: { items, value: 'list', 'onUpdate:value': onValueChange },
    });

    await fireEvent.click(screen.getByRole('radio', { name: 'Lista' }));
    await fireEvent.click(screen.getByRole('radio', { name: 'Kafelki' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('ukrywa wskaźnik dla niepoprawnej wartości i blokuje całą grupę', () => {
    render(SegmentedControl, { props: { disabled: true, items, value: 'missing' } });
    const group = screen.getByRole('radiogroup');
    const indicator = group.querySelector('.peaui-segmented-control__indicator');

    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(indicator).not.toHaveAttribute('data-visible');
    expect(screen.getAllByRole('radio').every((radio) => radio.tabIndex === -1)).toBe(true);
  });

  it('aktualizuje geometrię wskaźnika po resize bez wpływu na layout', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(SegmentedControl, { props: { items, value: 'list' } });
    const group = screen.getByRole('radiogroup');
    const selected = screen.getByRole('radio', { name: 'Lista' });
    Object.defineProperties(selected, {
      offsetHeight: { configurable: true, value: 44 },
      offsetLeft: { configurable: true, value: 12 },
      offsetTop: { configurable: true, value: 4 },
      offsetWidth: { configurable: true, value: 96 },
    });

    window.dispatchEvent(new Event('resize'));

    await waitFor(() =>
      expect(group.getAttribute('style')).toContain(
        '--peaui-segmented-control-indicator-width: 96px',
      ),
    );
    expect(group.getAttribute('style')).toContain('--peaui-segmented-control-indicator-x: 12px');
  });
});
