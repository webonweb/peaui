/** @jsxImportSource react */
import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollArea, { type ScrollAreaHandle } from './index';

class ResizeObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
}

function metric(element: HTMLElement, property: string): number {
  if (element.classList.contains('peaui-scroll-area__viewport')) {
    return (
      { clientWidth: 200, scrollWidth: 500, clientHeight: 120, scrollHeight: 400 }[property] ?? 0
    );
  }
  if (element.classList.contains('peaui-scroll-area__scrollbar--horizontal')) return 180;
  if (element.classList.contains('peaui-scroll-area__scrollbar--vertical')) return 100;
  return 0;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  for (const property of ['clientWidth', 'scrollWidth', 'clientHeight', 'scrollHeight']) {
    vi.spyOn(HTMLElement.prototype, property as 'clientWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return metric(this, property);
    });
  }
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
      if (options.left !== undefined) this.scrollLeft = options.left;
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

describe('ScrollArea React', () => {
  it('matches the Vue DOM, ARIA contract and imperative API', async () => {
    const ref = createRef<ScrollAreaHandle>();
    const onScrollEnd = vi.fn();
    render(
      <ScrollArea
        ariaLabel="Raport"
        dataTestId="scroll-area"
        onScrollEnd={onScrollEnd}
        orientation="both"
        ref={ref}
        scrollbarVisibility="always"
      >
        <div id="react-target">Cel</div>
      </ScrollArea>,
    );

    expect(screen.getByRole('region', { name: 'Raport' })).not.toHaveAttribute('tabindex');
    const bars = screen.getAllByRole('scrollbar');
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveAttribute('aria-valuemax', '300');
    expect(bars[1]).toHaveAttribute('aria-valuemax', '280');

    act(() => ref.current?.scrollTo({ left: 90, top: 160 }));
    await act(async () => vi.runAllTimersAsync());
    expect(ref.current?.getPosition()).toMatchObject({ x: 90, y: 160 });
    expect(onScrollEnd).toHaveBeenCalledOnce();
    expect(ref.current?.scrollIntoView('#missing')).toBe(false);
  });

  it('makes the native viewport keyboard reachable without adding custom scrollbars', () => {
    render(
      <ScrollArea ariaLabel="Lista" orientation="vertical" type="native">
        Treść
      </ScrollArea>,
    );
    expect(screen.getByRole('region', { name: 'Lista' })).toHaveAttribute('tabindex', '0');
    expect(screen.queryAllByRole('scrollbar')).toHaveLength(0);
  });
});
