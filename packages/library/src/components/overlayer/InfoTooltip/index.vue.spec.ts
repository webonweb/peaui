import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import InfoTooltip from './index.vue';

describe('InfoTooltip (index.vue)', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  const cancelAnimationFrame = vi.fn();
  let animationFrameId = 0;
  let resizeObserverCallback: ResizeObserverCallback | null = null;
  let animationFrameCallbacks: Array<{ id: number; callback: FrameRequestCallback }> = [];

  const flushAnimationFrames = () => {
    const callbacks = [...animationFrameCallbacks];
    animationFrameCallbacks = [];

    callbacks.forEach(({ callback }) => {
      callback(performance.now());
    });
  };

  beforeEach(() => {
    observe.mockReset();
    disconnect.mockReset();
    cancelAnimationFrame.mockReset();
    animationFrameId = 0;
    animationFrameCallbacks = [];
    resizeObserverCallback = null;

    class ResizeObserverMock {
      observe = observe;
      disconnect = disconnect;

      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      animationFrameId += 1;
      animationFrameCallbacks.push({ id: animationFrameId, callback });
      return animationFrameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      cancelAnimationFrame(id);
      animationFrameCallbacks = animationFrameCallbacks.filter((entry) => entry.id !== id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders with default placement=top and required structure', () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: '<button type="button">Trigger</button>',
      },
    });

    const tooltip = wrapper.find('[role="tooltip"]');

    expect(tooltip.attributes('role')).toBe('tooltip');
    expect(tooltip.attributes('id')).toMatch(/^info-tooltip-/);

    expect(tooltip.classes()).toContain('peaui-info-tooltip__content');
    expect(tooltip.classes()).toContain('peaui-info-tooltip__content--placement-top');
    expect(tooltip.classes()).toContain('peaui-info-tooltip__content--variant-default');
  });

  it('applies placement class from prop', () => {
    const wrapper = mount(InfoTooltip, {
      props: { placement: 'bottom-right' },
      slots: {
        default: '<span>Trigger</span>',
      },
    });

    const tooltip = wrapper.find('[role="tooltip"]');
    expect(tooltip.classes()).toContain('peaui-info-tooltip__content--placement-bottom-right');
  });

  it('applies disabled variant class from prop', () => {
    const wrapper = mount(InfoTooltip, {
      props: { variant: 'disabled' },
      slots: {
        default: '<span>Trigger</span>',
        title: 'Title',
        description: 'Description',
      },
    });

    const tooltip = wrapper.find('[role="tooltip"]');

    expect(tooltip.classes()).toContain('peaui-info-tooltip__content--variant-disabled');
    expect(wrapper.get('strong').classes()).toContain('peaui-info-tooltip__title');
    expect(wrapper.get('p').classes()).toContain('peaui-info-tooltip__description');
  });

  it('does not open tooltip and removes generated accessibility bindings when disabled prop is true', async () => {
    const wrapper = mount(InfoTooltip, {
      props: { disabled: true },
      slots: {
        default: '<span>Trigger</span>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');

    expect(root.classes()).toContain('peaui-info-tooltip--disabled');
    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
    expect(tooltip.attributes('aria-hidden')).toBe('true');

    await root.trigger('mouseenter');
    expect(root.attributes('data-open')).toBeUndefined();

    await root.trigger('focusin');
    expect(root.attributes('data-open')).toBeUndefined();
  });

  it('adds data-testid suffixes when dataTestId is provided', () => {
    const wrapper = mount(InfoTooltip, {
      props: { dataTestId: 'info-tooltip' },
      slots: {
        default: '<span>Trigger</span>',
        title: 'Title',
        description: 'Description',
      },
    });

    const content = wrapper.find('[data-testid="info-tooltip-content"]');
    expect(content.exists()).toBe(true);

    const tooltip = wrapper.find('[data-testid="info-tooltip-tooltip"]');
    expect(tooltip.exists()).toBe(true);

    const title = wrapper.get('[data-testid="info-tooltip-title"]');
    expect(title.text()).toBe('Title');

    const description = wrapper.get('[data-testid="info-tooltip-description"]');
    expect(description.text()).toBe('Description');
  });

  it('does not render title/description blocks if slots are not provided', () => {
    const wrapper = mount(InfoTooltip, {
      props: { dataTestId: 'info-tooltip' },
      slots: {
        default: '<span>Trigger</span>',
      },
    });

    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true);

    expect(wrapper.find('[data-testid="info-tooltip-title"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="info-tooltip-description"]').exists()).toBe(false);

    expect(wrapper.find('strong').exists()).toBe(false);
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('keeps base container class on root wrapper', () => {
    const wrapper = mount(InfoTooltip, {
      slots: { default: 'Trigger' },
    });

    const root = wrapper.find('.peaui-info-tooltip');
    expect(root.exists()).toBe(true);
  });

  it('forwards custom attrs to trigger root without fragment warning', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(InfoTooltip, {
      attrs: {
        class: 'custom-tooltip-trigger',
        'data-testid': 'custom-trigger',
        title: 'Tooltip trigger',
      },
      slots: { default: 'Trigger' },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');

    expect(root.classes()).toContain('custom-tooltip-trigger');
    expect(root.attributes('data-testid')).toBe('custom-trigger');
    expect(root.attributes('title')).toBe('Tooltip trigger');
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Extraneous non-props attributes'),
    );
  });

  it('keeps wrapper focusable and described by tooltip when slot has no focusable trigger', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: '<span>Trigger</span>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');

    expect(root.attributes('tabindex')).toBe('0');
    expect(root.attributes('role')).toBe('button');
    expect(root.attributes('aria-label')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBe(tooltip.attributes('id'));
  });

  it('does not add extra wrapper tab stop when slot already contains focusable trigger', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: '<button type="button" aria-describedby="external-description">Trigger</button>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');
    const trigger = wrapper.get('button');
    const describedBy = trigger.attributes('aria-describedby')?.split(' ') ?? [];

    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
    expect(describedBy).toContain('external-description');
    expect(describedBy).toContain(tooltip.attributes('id'));
  });

  it('reuses interactive ancestor as described trigger instead of adding nested tab stop', async () => {
    const HostComponent = {
      components: { InfoTooltip },
      template: `
        <button type="button" aria-describedby="external-parent-description">
          <InfoTooltip>
            <span>Trigger</span>
            <template #description>Tooltip content</template>
          </InfoTooltip>
        </button>
      `,
    };

    const wrapper = mount(HostComponent);

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');
    const trigger = wrapper.get('button');
    const describedBy = trigger.attributes('aria-describedby')?.split(' ') ?? [];

    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
    expect(describedBy).toContain('external-parent-description');
    expect(describedBy).toContain(tooltip.attributes('id'));
  });

  it('reuses composite option ancestor as described trigger instead of adding nested tab stop', async () => {
    const HostComponent = {
      components: { InfoTooltip },
      template: `
        <ul>
          <li id="option-1" role="option">
            <InfoTooltip>
              <span>Trigger</span>
              <template #description>Tooltip content</template>
            </InfoTooltip>
          </li>
        </ul>
      `,
    };

    const wrapper = mount(HostComponent);

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');
    const option = wrapper.get('[role="option"]');
    const describedBy = option.attributes('aria-describedby')?.split(' ') ?? [];

    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
    expect(describedBy).toContain(tooltip.attributes('id'));
  });

  it('adds fallback accessible name when wrapper manages an icon-only trigger', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default:
          '<svg aria-hidden="true" focusable="false" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" /></svg>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');
    const describedBy = root.attributes('aria-describedby')?.split(' ') ?? [];

    expect(root.attributes('tabindex')).toBe('0');
    expect(root.attributes('role')).toBe('button');
    expect(root.attributes('aria-label')).toBe('Pokaz dodatkowe informacje');
    expect(describedBy).toContain(tooltip.attributes('id'));
  });

  it('preserves explicit wrapper name and merges explicit describedby with tooltip id', async () => {
    const wrapper = mount(InfoTooltip, {
      attrs: {
        'aria-label': 'Wlasna informacja',
        'aria-describedby': 'external-description',
      },
      slots: {
        default:
          '<svg aria-hidden="true" focusable="false" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" /></svg>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');
    const describedBy = root.attributes('aria-describedby')?.split(' ') ?? [];

    expect(root.attributes('role')).toBe('button');
    expect(root.attributes('aria-label')).toBe('Wlasna informacja');
    expect(describedBy).toContain('external-description');
    expect(describedBy).toContain(tooltip.attributes('id'));
  });

  it('opens on hint hover but not on managed ancestor hover', async () => {
    const HostComponent = {
      components: { InfoTooltip },
      template: `
        <button type="button">
          <InfoTooltip>
            <span>Trigger</span>
            <template #description>Tooltip content</template>
          </InfoTooltip>
        </button>
      `,
    };

    const wrapper = mount(HostComponent);

    await nextTick();

    const button = wrapper.get('button');
    const root = wrapper.find('.peaui-info-tooltip');

    await button.trigger('mouseenter');
    expect(root.attributes('data-open')).toBeUndefined();

    await root.trigger('mouseenter');
    expect(root.attributes('data-open')).toBe('true');

    await root.trigger('mouseleave');
    await vi.waitFor(() => expect(root.attributes('data-open')).toBeUndefined());

    await button.trigger('focusin');
    expect(root.attributes('data-open')).toBe('true');
  });

  it('closes visible tooltip after disabling component and removes describedby binding', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: '<span>Trigger</span>',
        description: 'Tooltip content',
      },
    });

    await nextTick();

    const root = wrapper.find('.peaui-info-tooltip');

    await root.trigger('mouseenter');
    expect(root.attributes('data-open')).toBe('true');
    expect(root.attributes('aria-describedby')).toBeTruthy();

    await wrapper.setProps({ disabled: true });
    await nextTick();

    expect(root.attributes('data-open')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('role')).toBeUndefined();
  });

  it('refreshes anchor layout token on window resize', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: 'Trigger',
      },
    });

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 0;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 0;');

    flushAnimationFrames();
    await nextTick();

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 1;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 1;');

    window.dispatchEvent(new Event('resize'));
    await nextTick();

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
  });

  it('refreshes anchor layout token when trigger or tooltip content resizes', async () => {
    const wrapper = mount(InfoTooltip, {
      slots: {
        default: 'Trigger',
        description: 'Tooltip content',
      },
    });

    const root = wrapper.find('.peaui-info-tooltip');
    const tooltip = wrapper.find('[role="tooltip"]');

    expect(observe).toHaveBeenCalledWith(root.element);
    expect(observe).toHaveBeenCalledWith(tooltip.element);
    expect(resizeObserverCallback).toBeTypeOf('function');

    flushAnimationFrames();
    await nextTick();

    resizeObserverCallback?.([], {} as ResizeObserver);
    await nextTick();

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
  });

  it('refreshes anchor layout after mounting through conditional render', async () => {
    const HostComponent = {
      components: { InfoTooltip },
      data() {
        return {
          isVisible: false,
        };
      },
      template: `
        <div>
          <InfoTooltip
            v-if="isVisible"
            data-test-id="info-tooltip"
          >
            Trigger
            <template #description>Tooltip content</template>
          </InfoTooltip>
        </div>
      `,
    };

    const wrapper = mount(HostComponent);

    expect(wrapper.find('[data-testid="info-tooltip-content"]').exists()).toBe(false);

    await wrapper.setData({ isVisible: true });
    await nextTick();

    const root = wrapper.find('[data-testid="info-tooltip-content"]');
    const tooltip = wrapper.find('[data-testid="info-tooltip-tooltip"]');

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 0;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 0;');

    flushAnimationFrames();
    await nextTick();

    expect(root.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 1;');
    expect(tooltip.attributes('style')).toContain('--peaui-info-tooltip-layout-version: 1;');
  });
});
