import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import PageLayout from './index.vue';

describe('PageLayout (index.vue)', () => {
  it('renders root with base class and passes attrs', () => {
    const wrapper = mount(PageLayout, {
      attrs: {
        id: 'page-root',
        'data-foo': 'bar',
      },
    });

    const root = wrapper.get('div');
    expect(root.classes()).toContain('peaui-page-layout');
    expect(root.attributes('id')).toBe('page-root');
    expect(root.attributes('data-foo')).toBe('bar');
  });

  it('does not render header when top slot is missing', () => {
    const wrapper = mount(PageLayout);
    expect(wrapper.find('header').exists()).toBe(false);
  });

  it('renders header with top slot and aria-label', () => {
    const wrapper = mount(PageLayout, {
      props: { ariaLabel: 'Header label' },
      slots: {
        top: '<div data-testid="top-slot">Top</div>',
      },
    });

    const header = wrapper.get('header');
    expect(header.classes()).toContain('peaui-page-layout__top');
    expect(header.attributes('aria-label')).toBe('Header label');
    expect(header.get('[data-testid="top-slot"]').text()).toBe('Top');
  });

  it('adds sticky class when isHeaderSticky=true', () => {
    const wrapper = mount(PageLayout, {
      props: { isHeaderSticky: true },
      slots: { top: 'Top' },
    });

    const header = wrapper.get('header');
    expect(header.classes()).toContain('peaui-page-layout__top--sticky');
  });

  it('renders main with content class and data-testid', () => {
    const wrapper = mount(PageLayout, {
      props: { dataTestId: 'page' },
      slots: { top: 'Top' },
    });

    const main = wrapper.get('main');
    expect(main.classes()).toContain('peaui-page-layout__content');
    expect(main.attributes('data-testid')).toBe('page-content');

    const header = wrapper.get('header');
    expect(header.attributes('data-testid')).toBe('page-top');
  });

  it('renders additional slot only when provided', () => {
    const wrapper = mount(PageLayout, {
      slots: {
        additional: '<span data-testid="extra">Extra</span>',
      },
    });

    const additional = wrapper.get('.peaui-page-layout__additional');
    expect(additional.get('[data-testid="extra"]').text()).toBe('Extra');
  });

  it('does not render additional container when slot is missing', () => {
    const wrapper = mount(PageLayout);
    expect(wrapper.find('.peaui-page-layout__additional').exists()).toBe(false);
  });

  it('wraps default slot in body element', () => {
    const wrapper = mount(PageLayout, {
      slots: {
        default: '<div>Body</div>',
      },
    });

    const body = wrapper.get('.peaui-page-layout__body');
    expect(body.text()).toContain('Body');
  });
});
