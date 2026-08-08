import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VirtualList from './index.vue';
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

describe('VirtualList Vue', () => {
  it('renders a bounded DOM range for ten thousand items and scrolls through its public API', async () => {
    const wrapper = mount(VirtualList, {
      props: { ariaLabel: 'Wyniki', dataTestId: 'virtual-list', items },
    });
    await nextTick();

    expect(wrapper.get('[role="region"]').attributes('aria-label')).toBe('Wyniki');
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(9);
    expect(wrapper.text()).toContain('Element 1');
    expect(wrapper.find('.peaui-virtual-list__end').exists()).toBe(false);

    const handle = wrapper.vm as unknown as VirtualListHandle;
    handle.scrollToIndex(5_000, 'start');
    await vi.runAllTimersAsync();
    await nextTick();

    expect(handle.viewport?.scrollTop).toBe(320_000);
    expect(handle.getVisibleRange()).toMatchObject({
      visibleStartIndex: 5_000,
      visibleEndIndex: 5_004,
    });
    expect(wrapper.findAll('[role="listitem"]').length).toBeLessThanOrEqual(13);
    expect(wrapper.text()).toContain('Element 5001');

    handle.scrollToIndex(9_999, 'end');
    await vi.runAllTimersAsync();
    await nextTick();
    expect(wrapper.get('.peaui-virtual-list__end').text()).toBe('Koniec listy');
  });

  it('supports the listbox keyboard pattern and controlled active index', async () => {
    const wrapper = mount(VirtualList, {
      props: { ariaLabel: 'Opcje', items: items.slice(0, 100), semanticRole: 'listbox' },
    });
    const listbox = wrapper.get('[role="listbox"]');
    await listbox.trigger('keydown', { key: 'End' });
    await vi.runAllTimersAsync();
    await nextTick();

    expect(wrapper.emitted('update:activeIndex')?.at(-1)?.[0]).toBe(99);
    expect(wrapper.get('[role="listbox"]').attributes('aria-activedescendant')).toContain(
      'item-99',
    );
    expect(wrapper.get('[role="option"][aria-selected="true"]').attributes('aria-posinset')).toBe(
      '100',
    );
  });

  it('retains a focused descendant even after its row leaves the visible range', async () => {
    const wrapper = mount(VirtualList, {
      attachTo: document.body,
      props: { items },
      slots: {
        item: ({ index }: { index: number }) => h('button', { type: 'button' }, `Akcja ${index}`),
      },
    });
    const button = wrapper.get('button');
    (button.element as HTMLButtonElement).focus();
    await nextTick();

    (wrapper.vm as unknown as VirtualListHandle).scrollToIndex(500, 'start');
    await vi.runAllTimersAsync();
    await nextTick();

    expect(document.activeElement).toBe(button.element);
    expect(wrapper.find('[data-index="0"]').exists()).toBe(true);
    expect(wrapper.findAll('[role="listitem"]').length).toBeLessThanOrEqual(14);
    wrapper.unmount();
  });

  it('composes accessible loading, empty and error states', async () => {
    const wrapper = mount(VirtualList, { props: { items: [], loading: true } });
    expect(wrapper.get('[role="status"]').text()).toContain('Ładowanie');

    await wrapper.setProps({ loading: false });
    expect(wrapper.get('.peaui-empty-state').attributes('aria-labelledby')).toBeTruthy();

    await wrapper.setProps({ error: 'Nie udało się pobrać danych.' });
    expect(wrapper.get('[role="alert"]').text()).toBe('Nie udało się pobrać danych.');
  });

  it('deduplicates reachEnd until the collection size changes', async () => {
    const wrapper = mount(VirtualList, {
      props: { hasMore: true, items: items.slice(0, 10), itemSize: 64 },
    });
    const handle = wrapper.vm as unknown as VirtualListHandle;
    handle.scrollToIndex(9, 'end');
    await vi.runAllTimersAsync();
    await nextTick();
    handle.scrollToIndex(9, 'end');
    await vi.runAllTimersAsync();

    expect(wrapper.emitted('reachEnd')).toHaveLength(1);
    await wrapper.setProps({ items: items.slice(0, 11) });
    handle.scrollToIndex(10, 'end');
    await vi.runAllTimersAsync();
    expect(wrapper.emitted('reachEnd')).toHaveLength(2);
  });
});
