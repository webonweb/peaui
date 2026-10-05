import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import PopoverOverlayerComponent from './index.vue';

type PopoverElement = HTMLElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

describe('PopoverOverlayerComponent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches viewport listeners only while open and coalesces repeated events', async () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const frame = vi.spyOn(window, 'requestAnimationFrame');
    const wrapper = mount(PopoverOverlayerComponent, { slots: { default: 'Open' } });
    expect(add.mock.calls.filter(([name]) => name === 'scroll' || name === 'resize')).toHaveLength(
      0,
    );
    wrapper
      .get('[popover]')
      .element.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
    expect(add.mock.calls.filter(([name]) => name === 'scroll' || name === 'resize')).toHaveLength(
      2,
    );
    for (let index = 0; index < 10; index++) window.dispatchEvent(new Event('resize'));
    expect(frame).toHaveBeenCalledTimes(1);
    wrapper
      .get('[popover]')
      .element.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
    expect(
      remove.mock.calls.filter(([name]) => name === 'scroll' || name === 'resize'),
    ).toHaveLength(2);
    await nextTick();
    wrapper.unmount();
  });

  it('renders trigger slot and popover content with matching aria-controls / id', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz popover',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger content</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]');
    const popoverId = popover.attributes('id');

    expect(popoverId).toMatch(/^popover-overlayer-/);
    expect(trigger.attributes('aria-controls')).toBe(popoverId);
    expect(trigger.attributes('aria-haspopup')).toBeUndefined();
    expect(trigger.attributes('aria-label')).toBe('Otworz popover');
    expect(trigger.text()).toContain('Trigger content');
    expect(popover.text()).toContain('Popover content');
  });

  it('sets aria-haspopup from popupType prop', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz menu',
        dataTestId: 'popover-overlayer',
        popupType: 'menu',
      },
      slots: {
        default: '<span>Trigger content</span>',
        content: 'Popover content',
      },
    });

    expect(
      wrapper.get('[data-testid="popover-overlayer-trigger"]').attributes('aria-haspopup'),
    ).toBe('menu');
  });

  it('preserves explicit aria-haspopup attr passed on the component', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz listbox',
        dataTestId: 'popover-overlayer',
      },
      attrs: {
        'aria-haspopup': 'listbox',
      },
      slots: {
        default: '<span>Trigger content</span>',
        content: 'Popover content',
      },
    });

    expect(
      wrapper.get('[data-testid="popover-overlayer-trigger"]').attributes('aria-haspopup'),
    ).toBe('listbox');
  });

  it('adds default button semantics when custom trigger has no focusable descendants', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz popover',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger content</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');

    expect(trigger.attributes('role')).toBe('button');
    expect(trigger.attributes('tabindex')).toBe('0');
  });

  it('falls back to a generic accessible name when wrapper trigger is icon-only and unlabeled', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span aria-hidden="true" class="icon-only"></span>',
        content: 'Popover content',
      },
    });

    expect(wrapper.get('[data-testid="popover-overlayer-trigger"]').attributes('aria-label')).toBe(
      'Otworz popover',
    );
  });

  it('does not add extra trigger tab stop when slot already contains focusable element', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz popover',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<input type="text" aria-label="Pole triggera" />',
        content: 'Popover content',
      },
    });

    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');

    expect(trigger.attributes('role')).toBeUndefined();
    expect(trigger.attributes('tabindex')).toBeUndefined();
  });

  it('adds generic accessible name to icon-only native button trigger when no explicit label is provided', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        dataTestId: 'popover-overlayer',
        popupType: 'menu',
      },
      slots: {
        default:
          '<button type="button"><span aria-hidden="true" class="icon-only"></span></button>',
        content: 'Popover content',
      },
    });

    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const triggerButton = trigger.get('button');

    expect(trigger.attributes('aria-label')).toBeUndefined();
    expect(triggerButton.attributes('aria-label')).toBe('Otworz popover');
    expect(triggerButton.attributes('aria-haspopup')).toBe('menu');
  });

  it('moves explicit aria-labelledby from wrapper attrs to focusable trigger element', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        dataTestId: 'popover-overlayer',
      },
      attrs: {
        'aria-labelledby': 'popover-trigger-label',
      },
      slots: {
        default:
          '<button type="button"><span aria-hidden="true" class="icon-only"></span></button><span id="popover-trigger-label">Otworz menu</span>',
        content: 'Popover content',
      },
    });

    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const triggerButton = trigger.get('button');

    expect(trigger.attributes('aria-labelledby')).toBeUndefined();
    expect(triggerButton.attributes('aria-labelledby')).toBe('popover-trigger-label');
    expect(triggerButton.attributes('aria-label')).toBeUndefined();
  });

  it('does not add generic aria-label to input trigger that may be named by an external label', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<input type="text" />',
        content: 'Popover content',
      },
    });

    await nextTick();

    expect(
      wrapper
        .get('[data-testid="popover-overlayer-trigger"]')
        .get('input')
        .attributes('aria-label'),
    ).toBeUndefined();
  });

  it('moves popup semantics to focusable trigger element when slot contains a native button', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz menu',
        dataTestId: 'popover-overlayer',
        popupType: 'menu',
      },
      slots: {
        default: '<button type="button">Trigger button</button>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const triggerButton = trigger.get('button');
    const popover = wrapper.get('[popover]');
    const popoverElement = popover.element as PopoverElement;
    const popoverId = popover.attributes('id');

    await nextTick();

    expect(trigger.attributes('aria-controls')).toBeUndefined();
    expect(trigger.attributes('aria-expanded')).toBeUndefined();
    expect(trigger.attributes('aria-haspopup')).toBeUndefined();
    expect(trigger.attributes('aria-label')).toBeUndefined();

    expect(triggerButton.attributes('aria-controls')).toBe(popoverId);
    expect(triggerButton.attributes('aria-expanded')).toBe('false');
    expect(triggerButton.attributes('aria-haspopup')).toBe('menu');
    expect(triggerButton.attributes('aria-label')).toBe('Otworz menu');

    let isOpen = false;
    popoverElement.showPopover = vi.fn(() => {
      isOpen = true;
      popoverElement.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
    });
    vi.spyOn(popoverElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':popover-open') {
        return isOpen;
      }

      return false;
    });

    await triggerButton.trigger('click');

    expect(popoverElement.showPopover).toHaveBeenCalledTimes(1);
    expect(trigger.get('button').attributes('aria-expanded')).toBe('true');
  });

  it('opens popover on Enter when popup semantics are managed on a custom focusable trigger', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz menu',
        dataTestId: 'popover-overlayer',
        popupType: 'menu',
      },
      slots: {
        default: '<div tabindex="0"><span>Custom trigger</span></div>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const customTrigger = trigger.get('[tabindex="0"]');
    const popover = wrapper.get('[popover]');
    const popoverElement = popover.element as PopoverElement;
    const popoverId = popover.attributes('id');

    await nextTick();

    expect(trigger.attributes('aria-controls')).toBeUndefined();
    expect(trigger.attributes('aria-expanded')).toBeUndefined();
    expect(trigger.attributes('aria-haspopup')).toBeUndefined();
    expect(trigger.attributes('role')).toBeUndefined();
    expect(customTrigger.attributes('aria-controls')).toBe(popoverId);
    expect(customTrigger.attributes('aria-expanded')).toBe('false');
    expect(customTrigger.attributes('aria-haspopup')).toBe('menu');
    expect(customTrigger.attributes('role')).toBe('button');

    popoverElement.showPopover = vi.fn();
    vi.spyOn(popoverElement, 'matches').mockReturnValue(false);

    await customTrigger.trigger('keydown', { key: 'Enter' });

    expect(popoverElement.showPopover).toHaveBeenCalledTimes(1);
  });

  it('preserves explicit role passed on the component when popup semantics are managed on custom trigger', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz listbox',
        dataTestId: 'popover-overlayer',
        popupType: 'listbox',
      },
      attrs: {
        role: 'combobox',
      },
      slots: {
        default: '<div tabindex="0"><span>Custom trigger</span></div>',
        content: 'Popover content',
      },
    });

    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const customTrigger = trigger.get('[tabindex="0"]');

    expect(trigger.attributes('role')).toBeUndefined();
    expect(customTrigger.attributes('role')).toBe('combobox');
  });

  it('preserves descendant-defined popup semantics and removes duplicate wrapper semantics', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Otworz popover',
        dataTestId: 'popover-overlayer',
        popupType: 'dialog',
      },
      slots: {
        default:
          '<input type="text" aria-label="Wlasny trigger" aria-controls="custom-panel" aria-expanded="false" aria-haspopup="listbox" />',
        content: 'Popover content',
      },
    });

    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const triggerInput = trigger.get('input');

    expect(trigger.attributes('aria-controls')).toBeUndefined();
    expect(trigger.attributes('aria-expanded')).toBeUndefined();
    expect(trigger.attributes('aria-haspopup')).toBeUndefined();
    expect(trigger.attributes('aria-label')).toBeUndefined();

    expect(triggerInput.attributes('aria-controls')).toBe('custom-panel');
    expect(triggerInput.attributes('aria-expanded')).toBe('false');
    expect(triggerInput.attributes('aria-haspopup')).toBe('listbox');
    expect(triggerInput.attributes('aria-label')).toBe('Wlasny trigger');
  });

  it('opens popover on click and updates aria-expanded state', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]').element as PopoverElement;

    let isOpen = false;
    popover.showPopover = vi.fn(() => {
      isOpen = true;
      popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
    });
    popover.hidePopover = vi.fn(() => {
      isOpen = false;
      popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
    });

    vi.spyOn(popover, 'matches').mockImplementation((selector: string) => {
      if (selector === ':popover-open') {
        return isOpen;
      }

      return false;
    });

    await trigger.trigger('click');

    expect(popover.showPopover).toHaveBeenCalledTimes(1);
    expect(
      wrapper.get('[data-testid="popover-overlayer-trigger"]').attributes('aria-expanded'),
    ).toBe('true');

    await trigger.trigger('click');

    expect(popover.hidePopover).toHaveBeenCalledTimes(1);
    expect(
      wrapper.get('[data-testid="popover-overlayer-trigger"]').attributes('aria-expanded'),
    ).toBe('false');
  });

  it('opens popover on Enter keydown', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]').element as PopoverElement;

    popover.showPopover = vi.fn();
    vi.spyOn(popover, 'matches').mockReturnValue(false);

    await trigger.trigger('keydown', { key: 'Enter' });

    expect(popover.showPopover).toHaveBeenCalledTimes(1);
  });

  it('does not open popover when disabled', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        disabled: true,
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]').element as PopoverElement;

    popover.showPopover = vi.fn();
    vi.spyOn(popover, 'matches').mockReturnValue(false);

    await trigger.trigger('click');

    expect(popover.showPopover).not.toHaveBeenCalled();
    expect(trigger.attributes('aria-disabled')).toBe('true');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.attributes('role')).toBe('button');
    expect(trigger.attributes('tabindex')).toBe('-1');
  });

  it('can leave trigger semantics unmanaged for an inline composition', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        dataTestId: 'popover-overlayer',
        disabled: true,
        manageTriggerAccessibility: false,
      },
      slots: {
        default: '<input aria-label="Wartość koloru" />',
        content: 'Inline content',
      },
    });
    await nextTick();

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const input = trigger.get('input');
    expect(trigger.attributes('aria-expanded')).toBeUndefined();
    expect(trigger.attributes('role')).toBeUndefined();
    expect(input.attributes('aria-expanded')).toBeUndefined();
    expect(input.attributes('aria-controls')).toBeUndefined();
  });

  it('applies placement class from prop and test ids suffixes', () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        placement: 'bottom-right',
        dataTestId: 'popover-overlayer',
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    expect(wrapper.get('[data-testid="popover-overlayer-trigger"]')).toBeTruthy();
    expect(wrapper.get('[data-test-id="popover-overlayer-content"]')).toBeTruthy();
    expect(wrapper.get('[popover]').classes()).toContain(
      'peaui-popover-overlayer__content--placement-bottom-right',
    );
  });

  it('can match popover width to trigger width', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        dataTestId: 'popover-overlayer',
        matchTriggerWidth: true,
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]');
    const popoverElement = popover.element as PopoverElement;

    vi.spyOn(trigger.element, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 320,
      bottom: 40,
      left: 0,
      width: 320,
      height: 40,
      toJSON: () => ({}),
    });

    popoverElement.showPopover = vi.fn();
    vi.spyOn(popoverElement, 'matches').mockReturnValue(false);

    await trigger.trigger('click');

    expect(trigger.classes()).toContain('peaui-popover-overlayer--match-trigger-width');
    expect(popover.classes()).toContain('peaui-popover-overlayer__content--match-trigger-width');
    expect(popover.attributes('style')).toContain(
      '--peaui-popover-overlayer-trigger-width: 320px;',
    );
  });

  it('refreshes trigger width on window resize while popover is open', async () => {
    const wrapper = mount(PopoverOverlayerComponent, {
      props: {
        ariaLabel: 'Toggle popover',
        dataTestId: 'popover-overlayer',
        matchTriggerWidth: true,
      },
      slots: {
        default: '<span>Trigger</span>',
        content: 'Popover content',
      },
    });

    const trigger = wrapper.get('[data-testid="popover-overlayer-trigger"]');
    const popover = wrapper.get('[popover]');
    const popoverElement = popover.element as PopoverElement;

    let isOpen = false;
    popoverElement.showPopover = vi.fn(() => {
      isOpen = true;
      popoverElement.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
    });
    vi.spyOn(popoverElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':popover-open') {
        return isOpen;
      }

      return false;
    });

    const triggerRectSpy = vi.spyOn(trigger.element, 'getBoundingClientRect');
    triggerRectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 320,
      bottom: 40,
      left: 0,
      width: 320,
      height: 40,
      toJSON: () => ({}),
    });

    await trigger.trigger('click');

    expect(popover.attributes('style')).toContain(
      '--peaui-popover-overlayer-trigger-width: 320px;',
    );

    triggerRectSpy.mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 480,
      bottom: 40,
      left: 0,
      width: 480,
      height: 40,
      toJSON: () => ({}),
    });

    window.dispatchEvent(new Event('resize'));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await nextTick();

    expect(popover.attributes('style')).toContain(
      '--peaui-popover-overlayer-trigger-width: 480px;',
    );
  });
});
