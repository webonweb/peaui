import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SkeletonLoading from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}), { virtual: true });
vi.mock('./styles.scss', () => ({}), { virtual: true });

describe('SkeletonLoading (index.vue)', () => {
  it('renders base class and medium size by default', () => {
    const wrapper = mount(SkeletonLoading, {
      props: { dataTestId: 'skeleton-loading' },
    });

    const root = wrapper.get('[data-testid="skeleton-loading"]');

    expect(root.classes()).toContain('peaui-skeleton-loading');
    expect(root.classes()).toContain('peaui-skeleton-loading--size-m');
  });

  it('applies size and rounded modifiers from props', () => {
    const wrapper = mount(SkeletonLoading, {
      props: {
        size: 'l',
        rounded: true,
      },
    });

    const root = wrapper.get('.peaui-skeleton-loading');

    expect(root.classes()).toContain('peaui-skeleton-loading--size-l');
    expect(root.classes()).toContain('peaui-skeleton-loading--rounded');
  });

  it('renders status semantics required for loading state', () => {
    const wrapper = mount(SkeletonLoading);

    const root = wrapper.get('.peaui-skeleton-loading');

    expect(root.attributes('role')).toBe('status');
    expect(root.attributes('aria-live')).toBe('polite');
    expect(root.attributes('aria-atomic')).toBe('true');
    expect(root.attributes('aria-busy')).toBe('true');
  });

  it('renders screen-reader text and visual bar with derived test ids', () => {
    const wrapper = mount(SkeletonLoading, {
      props: {
        ariaLabel: 'Ladowanie danych.',
        dataTestId: 'skeleton',
      },
    });

    const text = wrapper.get('[data-testid="skeleton-text"]');
    const bar = wrapper.get('[data-testid="skeleton-bar"]');

    expect(text.text()).toBe('Ladowanie danych.');
    expect(bar.attributes('aria-hidden')).toBe('true');
  });

  it('passes through attrs to the root element', () => {
    const wrapper = mount(SkeletonLoading, {
      attrs: {
        id: 'building-skeleton',
        title: 'Ladowanie',
        'data-extra': 'example',
      },
    });

    const root = wrapper.get('.peaui-skeleton-loading');

    expect(root.attributes('id')).toBe('building-skeleton');
    expect(root.attributes('title')).toBe('Ladowanie');
    expect(root.attributes('data-extra')).toBe('example');
  });
});
