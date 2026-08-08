import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineScrollArea, ScrollAreaElement } from './index.wc';

class ResizeObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('peaui-scroll-area__viewport') ? 100 : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('peaui-scroll-area__viewport') ? 200 : 0;
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
      if (options.left !== undefined) this.scrollLeft = options.left;
      if (options.top !== undefined) this.scrollTop = options.top;
    }),
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ScrollArea Web Component', () => {
  it('registers and renders the same accessible light-DOM implementation', async () => {
    defineScrollArea();
    expect(customElements.get(ScrollAreaElement.tagName)).toBe(ScrollAreaElement);

    const element = document.createElement(ScrollAreaElement.tagName) as ScrollAreaElement;
    element.ariaLabel = 'Dane';
    element.orientation = 'both';
    element.scrollbarVisibility = 'always';
    element.innerHTML = '<div id="wc-target">Cel</div>';
    document.body.append(element);
    await nextTick();
    await Promise.resolve();

    expect(element.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Dane');
    expect(element.querySelectorAll('[role="scrollbar"]')).toHaveLength(2);
    expect(element.viewport).toBeInstanceOf(HTMLElement);
  });

  it('exposes safe scroll methods and rejects targets outside its content', async () => {
    const element = document.createElement(ScrollAreaElement.tagName) as ScrollAreaElement;
    element.ariaLabel = 'Dane';
    element.innerHTML = '<div id="inside">Cel</div>';
    document.body.append(element);
    await nextTick();
    await Promise.resolve();

    element.scrollTo({ top: 40 });
    expect(element.viewport?.scrollTop).toBe(40);
    expect(element.scrollIntoView('#missing')).toBe(false);
    expect(element.getPosition()).toMatchObject({ y: 40 });
  });
});
