import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import Stepper from '../navigation/NavigationStepper/index.vue';
import Pagination from '../navigation/PaginationControl/index.vue';
import GuidedTour from '../overlayer/GuidedTour/index.vue';
vi.mock('@/components/layout/ScrollArea/scroll-area.controller', () => ({
  getScrollAreaRtlMode: () => 'negative',
}));

enableAutoUnmount(afterEach);
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('V-I02/V-I03: stepper observes parent size and scrolls along the RTL axis', async () => {
  const callbacks: ResizeObserverCallback[] = [];
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  const wrapper = mount(Stepper, {
    attachTo: document.body,
    props: { options: [{ key: 'a', label: 'Alpha', status: 'complete' }] },
  });
  await nextTick();
  const viewport = wrapper.get<HTMLElement>('nav').element;
  viewport.style.direction = 'rtl';
  Object.defineProperties(viewport, {
    scrollWidth: { value: 900 },
    clientWidth: { value: 200, configurable: true },
    scrollLeft: { value: 0, writable: true },
  });
  viewport.scrollBy = vi.fn();
  window.dispatchEvent(new Event('resize'));
  await nextTick();
  await wrapper.get('.peaui-navigation-stepper__control--next').trigger('click');
  expect(viewport.scrollBy).toHaveBeenCalledWith({ left: -284, behavior: 'smooth' });
  viewport.scrollLeft = -700;
  await wrapper.get('nav').trigger('scroll');
  expect(
    wrapper.get<HTMLButtonElement>('.peaui-navigation-stepper__control--next').element.disabled,
  ).toBe(true);
  expect(callbacks.length).toBeGreaterThan(0);
  viewport.scrollLeft = 0;
  Object.defineProperty(viewport, 'clientWidth', { value: 1000 });
  callbacks.forEach((callback) => callback([], {} as ResizeObserver));
  await nextTick();
  expect(
    wrapper.get<HTMLButtonElement>('.peaui-navigation-stepper__control--prev').element.disabled,
  ).toBe(true);
  wrapper.unmount();
  expect(disconnect).toHaveBeenCalled();
});

it('V-I05: a child consuming Escape keeps GuidedTour open', async () => {
  const wrapper = mount(GuidedTour, {
    attachTo: document.body,
    props: { open: true, mode: 'modal', steps: [{ id: 'one', title: 'Step' }] },
    slots: {
      content: () =>
        h('button', { onKeydown: (event: KeyboardEvent) => event.preventDefault() }, 'Nested'),
    },
  });
  await flushPromises();
  const nested = [...document.querySelectorAll('button')].find(
    (button) => button.textContent === 'Nested',
  )!;
  nested.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  );
  await flushPromises();
  expect(wrapper.emitted('update:open')).toBeUndefined();
});

it('V-I09: page ranges are unique, valid and include the current page', async () => {
  const wrapper = mount(Pagination, { props: { ariaLabel: 'Pages', totalPages: 6, page: 2 } });
  for (let total = 1; total <= 12; total++)
    for (let page = 1; page <= total; page++) {
      await wrapper.setProps({ totalPages: total, page });
      const numbers = wrapper
        .findAll('.peaui-pagination-control__button--page')
        .map((button) => Number(button.text()));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(numbers).toContain(page);
      expect(numbers.every((number) => number >= 1 && number <= total)).toBe(true);
    }
});

for (const kind of ['popover', 'dialog'] as const) {
  it(`V-I05: an open native ${kind} handles Escape before GuidedTour`, async () => {
    const wrapper = mount(GuidedTour, {
      attachTo: document.body,
      props: { open: true, mode: 'modal', steps: [{ id: 'one', title: 'Step' }] },
      slots: { content: () => h('div', { 'data-nested': '' }) },
    });
    await flushPromises();
    const slot = wrapper.get('[data-nested]').element;
    const nested = document.createElement(kind === 'dialog' ? 'dialog' : 'div');
    if (kind === 'dialog') nested.setAttribute('open', '');
    else {
      nested.setAttribute('popover', 'auto');
      vi.spyOn(nested, 'matches').mockImplementation((selector) => selector === ':popover-open');
    }
    slot.append(nested);
    nested.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(wrapper.emitted('update:open')).toBeUndefined();
    if (kind === 'popover') {
      const buttons = [
        ...wrapper
          .get<HTMLElement>('.peaui-guided-tour__card')
          .element.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
      ];
      buttons.at(-1)!.focus();
      buttons
        .at(-1)!
        .dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
        );
      expect(document.activeElement).toBe(buttons[0]);
      buttons[0]!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
      expect(document.activeElement).toBe(buttons.at(-1));
    }
    nested.remove();
    slot.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await flushPromises();
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });
}
