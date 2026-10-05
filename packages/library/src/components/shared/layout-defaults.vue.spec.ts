import { mount, enableAutoUnmount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import CardPanel from '../layout/CardPanel/index.vue';
import GridSection from '../layout/GridSection/index.vue';
import GridItem from '../layout/GridItem/index.vue';
import PageLayout from '../layout/PageLayout/index.vue';
import FullscreenContainer from '../layout/FullscreenContainer/index.vue';
import ScrollArea from '../layout/ScrollArea/index.vue';
import CalculationResults from '../data-display/CalculationResults/index.vue';
import ProgressIndicator from '../feedback/ProgressIndicator/index.vue';

enableAutoUnmount(afterEach);

describe('regressions: layout and display Vue contracts', () => {
  it('keeps Tab in fullscreen and restores the toggle on Escape', async () => {
    const wrapper = mount(FullscreenContainer, {
      attachTo: document.body,
      slots: { default: '<button>Inside</button>' },
    });
    const toggle = wrapper.get<HTMLButtonElement>('.peaui-fullscreen-container__toggle');
    await toggle.trigger('click');
    expect(document.activeElement).toBe(toggle.element);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    toggle.element.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe('Inside');
    await wrapper
      .get('.peaui-fullscreen-container__content button')
      .trigger('keydown', { key: 'Escape' });
    expect(wrapper.classes()).not.toContain('peaui-fullscreen-container--fullscreen');
    expect(document.activeElement).toBe(toggle.element);
  });
  it('adds native viewport keyboard access while respecting explicit tabindex', async () => {
    const wrapper = mount(ScrollArea, { props: { type: 'native' } });
    expect(wrapper.get('.peaui-scroll-area__viewport').attributes('tabindex')).toBe('0');
    await wrapper.setProps({ tabindex: -1 });
    expect(wrapper.get('.peaui-scroll-area__viewport').attributes('tabindex')).toBe('-1');
  });
  it('preserves native keyboard scrolling when custom scroll controls are disabled', async () => {
    const wrapper = mount(ScrollArea, { props: { type: 'native', disabled: true } });
    expect(wrapper.get('.peaui-scroll-area__viewport').attributes('tabindex')).toBe('0');
    await wrapper.setProps({ tabindex: -1 });
    expect(wrapper.get('.peaui-scroll-area__viewport').attributes('tabindex')).toBe('-1');
  });
  for (const [Component, slot, selector] of [
    [CardPanel, 'header', '.peaui-card-panel__header'],
    [GridSection, 'additional', '.peaui-grid-section__additional'],
  ] as const) {
    it(`updates conditional ${slot} composition after mount`, async () => {
      const visible = ref(false);
      const wrapper = mount({
        render: () =>
          h(
            Component,
            {},
            { default: () => 'Body', ...(visible.value ? { [slot]: () => 'Added' } : {}) },
          ),
      });
      expect(wrapper.find(selector).exists()).toBe(false);
      visible.value = true;
      await nextTick();
      expect(wrapper.get(selector).text()).toBe('Added');
      visible.value = false;
      await nextTick();
      expect(wrapper.find(selector).exists()).toBe(false);
    });
  }
  it('keeps the shared grid defaults', () => {
    const item = mount(GridItem);
    expect(item.classes()).toContain('peaui-grid-item--grid');
    expect((item.element as HTMLElement).style.getPropertyValue('--peaui-grid-item-columns')).toBe(
      '2',
    );
    const section = mount(GridSection);
    expect(
      (section.get('.peaui-grid-section__content').element as HTMLElement).style.getPropertyValue(
        '--columns',
      ),
    ).toBe('4');
  });
  it('uses a semantic footer consistent with React and WC', () => {
    const wrapper = mount(PageLayout, {
      props: { ariaLabel: 'Account' },
      slots: { top: 'Toolbar', footer: 'Footer' },
    });
    expect(wrapper.get('header').attributes('aria-label')).toBe('Account');
    expect(wrapper.get('footer').text()).toBe('Footer');
  });
  it('blocks calculation during loading and starts progress at zero', () => {
    const calculation = mount(CalculationResults, { props: { label: 'Total', isLoading: true } });
    expect(calculation.get<HTMLButtonElement>('button').element.disabled).toBe(true);
    const progress = mount(ProgressIndicator, { props: { steps: 4 } });
    expect(progress.attributes('aria-valuenow')).toBe('0');
  });
});
