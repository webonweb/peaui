import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import PopoverButtonComponent from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

describe('PopoverButtonComponent', () => {
  it('renders trigger button and popover content; popovertarget matches popover id', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'Open popover',
      },
      slots: {
        default: 'Trigger text',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('button');
    const popover = wrapper.get('[popover]');

    const popoverId = popover.attributes('id');
    expect(popoverId).toMatch(/^popover-button-/);

    expect(trigger.attributes('popovertarget')).toBe(popoverId);
    expect(trigger.attributes('popovertargetaction')).toBe('toggle');
    expect(trigger.attributes('aria-controls')).toBe(popoverId);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.attributes('aria-label')).toBeUndefined();

    expect(trigger.text()).toContain('Trigger text');
    expect(popover.text()).toContain('Popover content');
  });

  it('sets aria-haspopup from popupType prop', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'Open menu',
        popupType: 'menu',
      },
      slots: {
        default: 'Trigger text',
        content: 'Popover content',
      },
    });

    expect(wrapper.get('button').attributes('aria-haspopup')).toBe('menu');
  });

  it('sets aria-label on trigger only when useAriaLabel is enabled', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'Open popover',
        useAriaLabel: true,
      },
      slots: {
        default: h('span', { 'aria-hidden': 'true' }),
        content: 'Popover content',
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Open popover');
  });

  it('inherits icon-only accessible name fallback from ButtonAction', () => {
    const wrapper = mount(PopoverButtonComponent, {
      slots: {
        default: () => h('span', { 'aria-hidden': 'true', class: 'icon-only' }),
        content: 'Popover content',
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('Przycisk akcji');
  });

  it('preserves explicit aria-haspopup attr passed on the component', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'Open listbox',
      },
      attrs: {
        'aria-haspopup': 'listbox',
      },
      slots: {
        default: 'Trigger text',
        content: 'Popover content',
      },
    });

    expect(wrapper.get('button').attributes('aria-haspopup')).toBe('listbox');
  });

  it('applies default placement class (top)', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: { ariaLabel: 'A11y label' },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const popover = wrapper.get('[popover]');
    expect(popover.classes()).toContain('peaui-popover-button__content');
    expect(popover.classes()).toContain('peaui-popover-button__content--placement-top');
  });

  it('applies placement class from prop', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: { ariaLabel: 'A11y label', placement: 'bottom-right' },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const popover = wrapper.get('[popover]');
    expect(popover.classes()).toContain('peaui-popover-button__content--placement-bottom-right');
  });

  it('adds data-test-id suffixes when dataTestId is provided', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: { ariaLabel: 'A11y label', dataTestId: 'popover-button' },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');
    const popover = wrapper.get('[popover]');

    expect(trigger.attributes('data-testid')).toBe('popover-button-trigger');
    expect(popover.attributes('data-test-id')).toBe('popover-button-content');
  });

  it('passes disabled to trigger button', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: { ariaLabel: 'A11y label', disabled: true },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');
    expect(trigger.attributes()).toHaveProperty('disabled');
  });

  it('emits pointerdown and keydown from trigger interactions', async () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: { ariaLabel: 'A11y label' },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');

    await trigger.trigger('pointerdown');
    await trigger.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('pointerdown')).toHaveLength(1);
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect((wrapper.emitted('keydown')?.[0]?.[0] as KeyboardEvent).key).toBe('Enter');
  });

  it('passes size and variant down to ButtonAction via attributes/props (smoke)', () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'A11y label',
        size: 'l',
        variant: 'danger',
      },
      slots: { default: 'Trigger', content: 'Content' },
    });

    expect(wrapper.get('button')).toBeTruthy();
    expect(wrapper.get('[popover]')).toBeTruthy();
  });

  it('can match popover width to trigger width', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 280,
      bottom: 40,
      left: 0,
      width: 280,
      height: 40,
      toJSON: () => ({}),
    });

    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'A11y label',
        matchTriggerWidth: true,
      },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const popover = wrapper.get('[popover]');

    await nextTick();

    expect(popover.classes()).toContain('peaui-popover-button__content--match-trigger-width');
    expect(popover.attributes('style')).toContain('--peaui-popover-button-trigger-width: 280px;');
  });

  it('switches bottom placement to top when there is not enough space below trigger', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 560,
      right: 280,
      bottom: 620,
      left: 0,
      width: 280,
      height: 60,
      toJSON: () => ({}),
    });

    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 700,
    });

    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'A11y label',
        placement: 'bottom',
      },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');
    const popover = wrapper.get('[popover]');
    Object.defineProperty(popover.element, 'scrollHeight', {
      configurable: true,
      value: 240,
    });

    await trigger.trigger('pointerdown');
    await nextTick();

    expect(popover.classes()).toContain('peaui-popover-button__content--placement-top');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('recomputes placement on window resize while popover is open', async () => {
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    rectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 120,
      right: 280,
      bottom: 180,
      left: 0,
      width: 280,
      height: 60,
      toJSON: () => ({}),
    });

    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 900,
    });

    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'A11y label',
        placement: 'bottom',
      },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');
    const popover = wrapper.get('[popover]');
    Object.defineProperty(popover.element, 'scrollHeight', {
      configurable: true,
      value: 240,
    });

    await trigger.trigger('pointerdown');
    await nextTick();

    expect(popover.classes()).toContain('peaui-popover-button__content--placement-bottom');

    const toggleEvent = new Event('toggle') as Event & { newState?: 'open' | 'closed' };
    toggleEvent.newState = 'open';
    popover.element.dispatchEvent(toggleEvent);

    rectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 560,
      right: 280,
      bottom: 620,
      left: 0,
      width: 280,
      height: 60,
      toJSON: () => ({}),
    });

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 700,
    });

    window.dispatchEvent(new Event('resize'));
    await nextTick();

    expect(popover.classes()).toContain('peaui-popover-button__content--placement-top');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('updates aria-expanded when popover state changes', async () => {
    const wrapper = mount(PopoverButtonComponent, {
      props: {
        ariaLabel: 'A11y label',
      },
      slots: { default: 'Trigger', content: 'Content' },
    });

    const trigger = wrapper.get('button');
    const popover = wrapper.get('[popover]');

    const openEvent = new Event('toggle') as Event & { newState?: 'open' | 'closed' };
    openEvent.newState = 'open';
    popover.element.dispatchEvent(openEvent);
    await nextTick();

    expect(trigger.attributes('aria-expanded')).toBe('true');

    const closeEvent = new Event('toggle') as Event & { newState?: 'open' | 'closed' };
    closeEvent.newState = 'closed';
    popover.element.dispatchEvent(closeEvent);
    await nextTick();

    expect(trigger.attributes('aria-expanded')).toBe('false');
  });
});
