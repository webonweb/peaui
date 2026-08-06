import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import GridItem from './index.vue';

describe('GridItem (index.vue)', () => {
  it('renders root div with base BEM class', () => {
    const wrapper = mount(GridItem, {
      slots: { default: '<div>Content</div>' },
    });

    const root = wrapper.get('div');
    expect(root.classes()).toContain('peaui-grid-item');
  });

  it('adds --grid modifier class when grid=true (default)', () => {
    const wrapper = mount(GridItem, {
      slots: { default: '<div>Content</div>' },
    });

    expect(wrapper.get('div').classes()).toContain('peaui-grid-item--grid');
  });

  it('does not add --grid modifier class when grid=false', () => {
    const wrapper = mount(GridItem, {
      props: { grid: false },
      slots: { default: '<div>Content</div>' },
    });

    expect(wrapper.get('div').classes()).not.toContain('peaui-grid-item--grid');
  });

  it('clamps colspan to minimum 1', () => {
    const wrapper = mount(GridItem, {
      props: { colspan: 0 },
      slots: { default: '<div>Content</div>' },
    });

    const styleAttr = wrapper.get('div').attributes('style') ?? '';
    expect(styleAttr).toContain('--peaui-grid-item-colspan: 1');
  });

  it('sets --peaui-grid-item-columns from columns prop when provided', () => {
    const wrapper = mount(GridItem, {
      props: { columns: 3 },
      slots: { default: '<div>One</div><div>Two</div>' },
    });

    const styleAttr = wrapper.get('div').attributes('style') ?? '';
    expect(styleAttr).toContain('--peaui-grid-item-columns: 3');
  });

  it('sets --peaui-grid-item-gap from gap prop and keeps default spacing scale compatible', () => {
    const wrapper = mount(GridItem, {
      props: { gap: 8 },
      slots: { default: '<div>One</div><div>Two</div>' },
    });

    const styleAttr = wrapper.get('div').attributes('style') ?? '';
    expect(styleAttr).toContain('--peaui-grid-item-gap: 8');
  });

  it('passes through attrs to root element', () => {
    const wrapper = mount(GridItem, {
      attrs: {
        id: 'my-grid-item',
        'data-foo': 'bar',
        tabindex: '0',
      },
      slots: { default: '<div>Content</div>' },
    });

    const root = wrapper.get('div');
    expect(root.attributes('id')).toBe('my-grid-item');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('tabindex')).toBe('0');
  });

  it('renders default slot content', () => {
    const wrapper = mount(GridItem, {
      slots: { default: '<span data-testid="inner">Hello</span>' },
    });

    expect(wrapper.get('[data-testid="inner"]').text()).toBe('Hello');
  });
});
