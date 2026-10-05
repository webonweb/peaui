/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VirtualList from './index';
import type { VirtualListHandle } from './virtual-list.shared';

const items = Array.from({ length: 10_000 }, (_, index) => ({
  id: `item-${index}`,
  label: `Element ${index + 1}`,
  description: `Opis ${index + 1}`,
}));

class ResizeObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('peaui-scroll-area__viewport') ? 320 : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('peaui-scroll-area__viewport') ? 640_000 : 0;
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
      if (options.top !== undefined) this.scrollTop = options.top;
      this.dispatchEvent(new Event('scroll'));
    }),
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('VirtualList React', () => {
  it('V-D04 preserves the visible keyed anchor after prepend and removal before it', async () => {
    const reference = createRef<VirtualListHandle>();
    const initial = items.slice(0, 100);
    const { rerender } = render(<VirtualList items={initial} itemSize={64} ref={reference} />);
    act(() => reference.current?.scrollToIndex(50, 'start'));
    await act(async () => vi.runAllTimersAsync());
    rerender(
      <VirtualList
        items={[{ id: 'new', label: 'New' }, ...initial]}
        itemSize={64}
        ref={reference}
      />,
    );
    await act(async () => vi.runAllTimersAsync());
    expect(reference.current?.viewport?.scrollTop).toBe(51 * 64);
    expect(reference.current?.getVisibleRange().visibleStartIndex).toBe(51);
    rerender(<VirtualList items={initial.slice(1)} itemSize={64} ref={reference} />);
    await act(async () => vi.runAllTimersAsync());
    expect(reference.current?.viewport?.scrollTop).toBe(49 * 64);
  });
  it('V-D09 does not rearm reachEnd for keyboard state or callback identity changes', async () => {
    const reference = createRef<VirtualListHandle>();
    const reachEnd = vi.fn();
    const data = items.slice(0, 20);
    const { rerender } = render(
      <VirtualList
        items={data}
        ref={reference}
        hasMore
        semanticRole="listbox"
        onReachEnd={reachEnd}
        onActiveIndexChange={() => undefined}
      />,
    );
    act(() => reference.current?.scrollToIndex(19, 'end'));
    await act(async () => vi.runAllTimersAsync());
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'End' });
    await act(async () => vi.runAllTimersAsync());
    rerender(
      <VirtualList
        items={data}
        ref={reference}
        hasMore
        loading
        semanticRole="listbox"
        onReachEnd={reachEnd}
        onActiveIndexChange={() => undefined}
      />,
    );
    act(() => reference.current?.scrollToIndex(0));
    await act(async () => vi.runAllTimersAsync());
    act(() => reference.current?.scrollToIndex(19, 'end'));
    await act(async () => vi.runAllTimersAsync());
    expect(reachEnd).toHaveBeenCalledTimes(1);
  });
  it('keeps a bounded DOM and exposes the same imperative range API', async () => {
    const ref = createRef<VirtualListHandle>();
    render(<VirtualList ariaLabel="Wyniki" dataTestId="virtual-list" items={items} ref={ref} />);

    expect(screen.getByRole('region', { name: 'Wyniki' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(9);
    expect(screen.queryByText('Koniec listy')).not.toBeInTheDocument();

    act(() => ref.current?.scrollToIndex(5_000, 'start'));
    await act(async () => vi.runAllTimersAsync());

    expect(ref.current?.viewport?.scrollTop).toBe(320_000);
    expect(ref.current?.getVisibleRange()).toMatchObject({
      visibleStartIndex: 5_000,
      visibleEndIndex: 5_004,
    });
    expect(screen.getAllByRole('listitem').length).toBeLessThanOrEqual(13);
    expect(screen.getByText('Element 5001')).toBeVisible();

    act(() => ref.current?.scrollToIndex(9_999, 'end'));
    await act(async () => vi.runAllTimersAsync());
    expect(screen.getByText('Koniec listy')).toBeVisible();
  });

  it('implements listbox keyboard navigation and an uncontrolled active index', async () => {
    const onActiveIndexChange = vi.fn();
    render(
      <VirtualList
        ariaLabel="Opcje"
        items={items.slice(0, 100)}
        semanticRole="listbox"
        onActiveIndexChange={onActiveIndexChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole('listbox', { name: 'Opcje' }), { key: 'End' });
    await act(async () => vi.runAllTimersAsync());

    expect(onActiveIndexChange).toHaveBeenLastCalledWith(99);
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-activedescendant',
      expect.stringContaining('item-99'),
    );
    expect(screen.getByRole('option', { selected: true })).toHaveAttribute('aria-posinset', '100');
  });

  it('retains an actually focused row outside the next virtual range', async () => {
    const ref = createRef<VirtualListHandle>();
    render(
      <VirtualList
        items={items}
        ref={ref}
        renderItem={({ index }) => <button type="button">Akcja {index}</button>}
      />,
    );
    const button = screen.getByRole('button', { name: 'Akcja 0' });
    act(() => button.focus());
    act(() => ref.current?.scrollToIndex(500, 'start'));
    await act(async () => vi.runAllTimersAsync());

    expect(document.activeElement).toBe(button);
    expect(document.querySelector('[data-index="0"]')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeLessThanOrEqual(14);
  });

  it('renders matching loading, empty and error semantics', () => {
    const { rerender } = render(<VirtualList items={[]} loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie');

    rerender(<VirtualList items={[]} />);
    expect(screen.getByRole('heading', { name: 'Brak elementów' })).toBeVisible();

    rerender(<VirtualList error="Nie udało się pobrać danych." items={[]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Nie udało się pobrać danych.');
  });
});
