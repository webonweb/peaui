import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import GridSection from './index.vue';

describe('GridSection (index.vue)', () => {
  it('renderuje root z klasą bazową z UIKIT_NAME', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 4, gap: 6 },
    });

    const root = wrapper.get('div');
    expect(root.classes()).toContain('peaui-grid-section');
  });

  it('nie renderuje sekcji additional, gdy nie ma slota additional', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 4, gap: 6 },
    });

    expect(wrapper.find('.peaui-grid-section__additional').exists()).toBe(false);
  });

  it('renderuje sekcję additional, gdy slot additional jest podany', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 4, gap: 6 },
      slots: {
        additional: '<div data-testid="add">Additional</div>',
      },
    });

    const additional = wrapper.get('.peaui-grid-section__additional');
    expect(additional.get('[data-testid="add"]').text()).toBe('Additional');
  });

  it('dodaje modifier __content--multi gdy columns > 1', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 2, gap: 6 },
      slots: {
        default: '<div>Item</div>',
      },
    });

    const content = wrapper.get('.peaui-grid-section__content');
    expect(content.classes()).toContain('peaui-grid-section__content--multi');
  });

  it('nie dodaje modifiera __content--multi gdy columns <= 1', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 1, gap: 6 },
      slots: {
        default: '<div>Item</div>',
      },
    });

    const content = wrapper.get('.peaui-grid-section__content');
    expect(content.classes()).not.toContain('peaui-grid-section__content--multi');
  });

  it('ustawia CSS variables w style na content: gap, columns, columns-minus-one', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 4, gap: 6 },
      slots: {
        default: '<div>Item</div>',
      },
    });

    const content = wrapper.get('.peaui-grid-section__content');
    const styleAttr = content.attributes('style') ?? '';

    expect(styleAttr).toContain('--peaui-grid-gap-y: 6');
    expect(styleAttr).toContain('--columns: 4');
    expect(styleAttr).toContain('--columns-minus-one: 3');
  });

  it('clampuje columns-minus-one do minimum 1 (gdy columns=0 lub 1)', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 0, gap: 6 },
      slots: {
        default: '<div>Item</div>',
      },
    });

    const content = wrapper.get('.peaui-grid-section__content');
    const styleAttr = content.attributes('style') ?? '';

    expect(styleAttr).toContain('--columns: 0');
    expect(styleAttr).toContain('--columns-minus-one: 1');
  });

  it('przepuszcza attrs na root (v-bind="rootAttrs")', () => {
    const wrapper = mount(GridSection, {
      props: { columns: 4, gap: 6 },
      attrs: {
        id: 'grid-root',
        'data-foo': 'bar',
        tabindex: '0',
      },
    });

    const root = wrapper.get('div');
    expect(root.attributes('id')).toBe('grid-root');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('tabindex')).toBe('0');
  });
});
