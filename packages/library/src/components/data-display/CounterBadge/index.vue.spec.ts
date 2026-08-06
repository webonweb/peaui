import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    useId: () => 'unit-test-id',
  };
});

import CounterBadge from './index.vue';

describe('CounterBadge', () => {
  it('renders a status badge with required aria attributes', () => {
    const wrapper = mount(CounterBadge, {
      props: {
        value: 3,
      },
    });

    const badge = wrapper.get('span');
    expect(badge.attributes('role')).toBe('status');
    expect(badge.attributes('aria-live')).toBe('polite');
    expect(badge.attributes('aria-atomic')).toBe('true');
  });

  it('renders deterministic id based on useId()', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 1 },
    });

    expect(wrapper.get('span').attributes('id')).toBe('counter-badge-unit-test-id');
  });

  it('renders value', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 42 },
    });

    expect(wrapper.get('span').text()).toBe('42');
  });

  it('applies default variant class (info)', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 7 },
    });

    const badge = wrapper.get('span');
    expect(badge.classes()).toContain('peaui-counter-badge');
    expect(badge.classes()).toContain('peaui-counter-badge--variant-info');
    expect(badge.classes()).toContain('peaui-counter-badge--size-s');
  });

  it('applies variant modifier class when variant prop is provided', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 7, variant: 'success' },
    });

    const badge = wrapper.get('span');
    expect(badge.classes()).toContain('peaui-counter-badge--variant-success');
  });

  it('applies size modifier class when size prop is provided', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 7, size: 'l' },
    });

    const badge = wrapper.get('span');
    expect(badge.classes()).toContain('peaui-counter-badge--size-l');
    expect(badge.classes()).not.toContain('peaui-counter-badge--size-s');
  });

  it('passes data-testid through when provided', () => {
    const wrapper = mount(CounterBadge, {
      props: { value: 5, dataTestId: 'counter-badge' },
    });

    expect(wrapper.get('span').attributes('data-testid')).toBe('counter-badge');
  });
});
