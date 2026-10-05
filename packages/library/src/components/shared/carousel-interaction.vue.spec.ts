import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CardCarousel from '../data-display/CardCarousel/index.vue';
beforeEach(() =>
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  }),
);
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
});
describe('regressions: Vue carousel', () => {
  it('honors a pointer pause click even when focus pauses rotation before click', async () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const wrapper = mount(CardCarousel, {
      props: {
        withAnimation: true,
        defaultVisibleSlides: 1,
        pauseLabel: 'Pause',
        resumeLabel: 'Resume',
      },
      slots: { default: '<div>One</div><div>Two</div>' },
    });
    try {
      await nextTick();
      await nextTick();
      const control = wrapper.get('.peaui-card-carousel__rotation');
      await control.trigger('pointerdown');
      await control.trigger('focusin');
      await control.trigger('pointerup');
      control.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
      await nextTick();
      expect(control.text()).toBe('Resume');
      vi.advanceTimersByTime(4000);
      expect(scroll).not.toHaveBeenCalled();
      await control.trigger('click');
      expect(control.text()).toBe('Pause');
      vi.advanceTimersByTime(2000);
      expect(scroll).toHaveBeenCalled();
    } finally {
      wrapper.unmount();
    }
  });
  it('stops rotation on focus until resumed and exposes a pause control', async () => {
    vi.useFakeTimers();
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollTo').mockImplementation(() => undefined);
    const wrapper = mount(CardCarousel, {
      props: { withAnimation: true, defaultVisibleSlides: 1 },
      slots: { default: '<div>One</div><div>Two</div>' },
    });
    try {
      await nextTick();
      await nextTick();
      vi.advanceTimersByTime(2000);
      expect(scroll).toHaveBeenCalled();
      scroll.mockClear();
      await wrapper.get('.peaui-card-carousel__viewport').trigger('focusin');
      await wrapper.get('.peaui-card-carousel__viewport').trigger('focusout');
      vi.advanceTimersByTime(4000);
      expect(scroll).not.toHaveBeenCalled();
      await wrapper.get('.peaui-card-carousel__rotation').trigger('click');
      vi.advanceTimersByTime(2000);
      expect(scroll).toHaveBeenCalled();
    } finally {
      wrapper.unmount();
    }
  });
});
