import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollArea from './index.vue';
import { clearScrollAreaRestoredPositions } from './scroll-area.controller';
import type { ScrollAreaHandle } from './scroll-area.shared';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  disconnect = vi.fn();
  observe = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this);
  }
}

function metric(element: HTMLElement, property: string): number {
  if (element.classList.contains('peaui-scroll-area__viewport')) {
    if (property === 'clientWidth') return 200;
    if (property === 'scrollWidth') return 500;
    if (property === 'clientHeight') return 120;
    if (property === 'scrollHeight') return 400;
  }
  if (element.classList.contains('peaui-scroll-area__scrollbar--horizontal')) return 180;
  if (element.classList.contains('peaui-scroll-area__scrollbar--vertical')) return 100;
  return 0;
}

beforeEach(() => {
  vi.useFakeTimers();
  ResizeObserverMock.instances = [];
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
  clearScrollAreaRestoredPositions();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ScrollArea Vue', () => {
  it('keeps the viewport out of Tab order by default and names it only when requested', () => {
    const unnamed = mount(ScrollArea, { slots: { default: 'Treść' } });
    const unnamedViewport = unnamed.get('.peaui-scroll-area__viewport');
    expect(unnamedViewport.attributes('tabindex')).toBeUndefined();
    expect(unnamedViewport.attributes('role')).toBeUndefined();

    const named = mount(ScrollArea, {
      props: { ariaLabel: 'Wyniki', tabindex: 0 },
      slots: { default: 'Treść' },
    });
    expect(named.get('.peaui-scroll-area__viewport').attributes()).toMatchObject({
      'aria-label': 'Wyniki',
      role: 'region',
      tabindex: '0',
    });
  });

  it('exposes accessible styled scrollbars and the programmatic ref API', async () => {
    const wrapper = mount(ScrollArea, {
      props: {
        ariaLabel: 'Raport',
        dataTestId: 'scroll-area',
        orientation: 'both',
        scrollbarVisibility: 'always',
      },
      slots: { default: '<div id="target">Cel</div>' },
    });
    await nextTick();

    const bars = wrapper.findAll('[role="scrollbar"]');
    expect(bars).toHaveLength(2);
    expect(bars[0]?.attributes('aria-valuemax')).toBe('300');
    expect(bars[1]?.attributes('aria-valuemax')).toBe('280');
    expect(bars.every((bar) => bar.attributes('tabindex') === '0')).toBe(true);

    const handle = wrapper.vm as unknown as ScrollAreaHandle;
    handle.scrollTo({ left: 80, top: 140 });
    await vi.runAllTimersAsync();

    expect(handle.getPosition()).toMatchObject({ x: 80, y: 140, maxX: 300, maxY: 280 });
    expect(wrapper.emitted('scrollStart')).toHaveLength(1);
    expect(wrapper.emitted('scroll')).toHaveLength(1);
    expect(wrapper.emitted('scrollEnd')).toHaveLength(1);
  });

  it('supports scrollbar keyboard control and disconnects observers on unmount', async () => {
    const wrapper = mount(ScrollArea, {
      props: { ariaLabel: 'Lista', orientation: 'vertical', type: 'styled' },
      slots: { default: 'Treść' },
    });
    await wrapper.get('[aria-orientation="vertical"]').trigger('keydown', { key: 'End' });

    expect(wrapper.get('.peaui-scroll-area__viewport').element.scrollTop).toBe(280);
    const observer = ResizeObserverMock.instances[0];
    wrapper.unmount();
    expect(observer?.disconnect).toHaveBeenCalledOnce();
  });

  it('deduplicates edge events, reports resize and respects reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const wrapper = mount(ScrollArea, {
      props: { ariaLabel: 'Lista', orientation: 'both' },
      slots: { default: 'Treść' },
    });
    const handle = wrapper.vm as unknown as ScrollAreaHandle;

    ResizeObserverMock.instances[0]?.callback([], ResizeObserverMock.instances[0] as never);
    await vi.runAllTimersAsync();
    expect(wrapper.emitted('resize')).toHaveLength(1);

    handle.scrollTo({ behavior: 'smooth', left: 300, top: 280 });
    await vi.runAllTimersAsync();
    handle.scrollTo({ left: 300, top: 280 });
    await vi.runAllTimersAsync();

    const calls = vi.mocked(HTMLElement.prototype.scrollTo).mock.calls;
    expect(calls.some(([options]) => (options as ScrollToOptions).behavior === 'auto')).toBe(true);
    expect(wrapper.emitted('reachEnd')).toHaveLength(1);
  });

  it('restores a logical position only for an explicit stable id', async () => {
    const first = mount(ScrollArea, {
      props: { id: 'saved-report', orientation: 'vertical', restorePosition: true },
      slots: { default: 'Treść' },
    });
    (first.vm as unknown as ScrollAreaHandle).scrollTo({ top: 125 });
    await vi.runAllTimersAsync();
    first.unmount();

    const second = mount(ScrollArea, {
      props: { id: 'saved-report', orientation: 'vertical', restorePosition: true },
      slots: { default: 'Treść' },
    });
    await vi.runAllTimersAsync();

    expect((second.vm as unknown as ScrollAreaHandle).getPosition().y).toBe(125);
  });
});
