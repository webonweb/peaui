import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import MessageText from './index.vue';

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    dataTestId: { type: String, required: false },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        'data-icon': props.name,
        'data-testid': props.dataTestId,
      });
  },
});

const mountMessageText = (options: {
  props: Record<string, unknown>;
  slots?: Record<string, unknown>;
}) =>
  mount(MessageText, {
    ...options,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
      },
    },
  });

describe('MessageText (index.vue)', () => {
  it('renders root div with correct id `${id}-${variant}`', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'info',
      },
      slots: {
        default: 'Hello',
      },
    });

    const root = wrapper.get('div');
    expect(root.attributes('id')).toBe('msg-info');
  });

  it('sets data-testid on root when provided', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        dataTestId: 'message-text',
      },
      slots: {
        default: 'Hello',
      },
    });

    expect(wrapper.get('div').attributes('data-testid')).toBe('message-text');
  });

  it('adds BEM-like modifier classes for size and variant', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'success',
        size: 'm',
      },
      slots: {
        default: 'Hello',
      },
    });

    const root = wrapper.get('div');
    const cls = root.attributes('class') ?? '';

    expect(cls).toContain('peaui-message-text');
    expect(cls).toContain('peaui-message-text--size-m');
    expect(cls).toContain('peaui-message-text--variant-success');
  });

  it('applies white variant classes and does not render a built-in status icon', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'white',
      },
      slots: {
        default: 'Hello',
      },
    });

    const root = wrapper.get('div');
    const cls = root.attributes('class') ?? '';

    expect(root.attributes('id')).toBe('msg-white');
    expect(cls).toContain('peaui-message-text--variant-white');
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.findAll('path')).toHaveLength(0);
  });

  it('renders icon svg when variant is not default', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'error',
        dataTestId: 'message-text',
      },
      slots: {
        default: 'Hello',
      },
    });

    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);

    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('focusable')).toBe('false');

    expect(svg.attributes('data-testid')).toBe('message-text-icon');

    const svgClass = svg.attributes('class') ?? '';
    expect(svgClass).toContain('peaui-message-text__icon');
  });

  it('renders the variant icon path by default when withIcon is not provided', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'info',
      },
      slots: {
        default: 'Hello',
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.findAll('path')).toHaveLength(1);
  });

  it('does not render variant icon when withIcon is false', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'danger',
        withIcon: false,
      },
      slots: {
        default: 'Hello',
      },
    });

    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.findAll('path')).toHaveLength(0);
  });

  it('renders custom icon when ownIcon is provided', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'default',
        ownIcon: 'plus',
        dataTestId: 'message-text',
      },
      slots: {
        default: 'Hello',
      },
    });

    const icon = wrapper.get('[data-testid="message-text-icon"]');

    expect(icon.attributes('data-icon')).toBe('plus');
    expect(icon.attributes('class')).toContain('peaui-message-text__icon');
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('adds white variant class to custom icon when ownIcon is provided', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        variant: 'white',
        ownIcon: 'plus',
        dataTestId: 'message-text',
      },
      slots: {
        default: 'Hello',
      },
    });

    const icon = wrapper.get('[data-testid="message-text-icon"]');

    expect(icon.attributes('class')).toContain('peaui-message-text__icon-own--variant-white');
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('does not render icon svg when variant is default (or omitted)', () => {
    const wrapperDefault = mountMessageText({
      props: {
        id: 'msg',
        variant: 'default',
      },
      slots: {
        default: 'Hello',
      },
    });

    expect(wrapperDefault.find('svg').exists()).toBe(false);

    const wrapperOmitted = mountMessageText({
      props: {
        id: 'msg',
      },
      slots: {
        default: 'Hello',
      },
    });

    expect(wrapperOmitted.find('svg').exists()).toBe(false);
  });

  it('renders message content in <p> with correct class and optional data-testid', () => {
    const wrapper = mountMessageText({
      props: {
        id: 'msg',
        dataTestId: 'message-text',
      },
      slots: {
        default: '<span data-testid="inner">Hi</span>',
      },
    });

    const p = wrapper.get('p');
    expect(p.attributes('class')).toContain('peaui-message-text__content');
    expect(p.attributes('data-testid')).toBe('message-text-title');
    expect(wrapper.get('[data-testid="inner"]').text()).toBe('Hi');
  });

  it('uses default props: variant=default and size=s when not provided', () => {
    const wrapper = mountMessageText({
      props: { id: 'msg' },
      slots: { default: 'Hello' },
    });

    const cls = wrapper.get('div').attributes('class') ?? '';
    expect(cls).toContain('peaui-message-text--size-s');
    expect(cls).toContain('peaui-message-text--variant-default');
  });

  it('renders the correct root id for each variant', () => {
    const wrapper = mountMessageText({
      props: { id: 'msg', variant: 'danger' },
      slots: { default: 'Hello' },
    });

    expect(wrapper.get('div').attributes('id')).toBe('msg-danger');
  });
});
