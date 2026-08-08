import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineVirtualList, VirtualListElement } from './index.wc';

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
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('VirtualList Web Component', () => {
  it('registers, renders property data and exposes the same imperative API', async () => {
    defineVirtualList();
    expect(customElements.get(VirtualListElement.tagName)).toBe(VirtualListElement);
    const element = document.createElement(VirtualListElement.tagName) as VirtualListElement;
    element.ariaLabel = 'Wyniki';
    element.items = items;
    element.itemSize = 64;
    document.body.append(element);
    await nextTick();
    await Promise.resolve();

    expect(element.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Wyniki');
    expect(element.querySelectorAll('[role="listitem"]')).toHaveLength(9);
    expect(element.querySelector('.peaui-virtual-list__end')).toBeNull();

    element.scrollToIndex(5_000, 'start');
    await vi.runAllTimersAsync();
    await nextTick();

    expect(element.viewport?.scrollTop).toBe(320_000);
    expect(element.getVisibleRange()).toMatchObject({
      visibleStartIndex: 5_000,
      visibleEndIndex: 5_004,
    });
    expect(element.querySelectorAll('[role="listitem"]').length).toBeLessThanOrEqual(13);
    expect(element.textContent).toContain('Element 5001');

    element.scrollToIndex(9_999, 'end');
    await vi.runAllTimersAsync();
    await nextTick();
    expect(element.querySelector('.peaui-virtual-list__end')?.textContent).toContain(
      'Koniec listy',
    );
  });

  it('synchronizes the active index and emits accessible item focus details', async () => {
    const element = document.createElement(VirtualListElement.tagName) as VirtualListElement;
    element.ariaLabel = 'Opcje';
    element.items = items.slice(0, 100);
    element.semanticRole = 'listbox';
    document.body.append(element);
    await nextTick();
    await Promise.resolve();
    const eventSpy = vi.fn();
    element.addEventListener('itemFocus', eventSpy);

    element
      .querySelector<HTMLElement>('[role="listbox"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    await vi.runAllTimersAsync();
    await nextTick();

    expect(element.activeIndex).toBe(99);
    expect(
      element.querySelector('[role="option"][aria-selected="true"]')?.getAttribute('aria-posinset'),
    ).toBe('100');
    expect(eventSpy).toHaveBeenCalledOnce();
  });
});
