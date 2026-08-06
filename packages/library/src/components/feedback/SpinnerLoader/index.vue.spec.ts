import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SpinnerLoader from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

describe('SpinnerLoader (fullscreen)', () => {
  it('renders overlay root with BEM base class', () => {
    const wrapper = mount(SpinnerLoader, {
      props: { dataTestId: 'loader' },
    });

    const root = wrapper.get('[data-testid="loader"]');
    expect(root.classes()).toContain('peaui-spinner-loader');
  });

  it('marks root as busy without exposing dialog semantics', () => {
    const wrapper = mount(SpinnerLoader);

    const root = wrapper.get('.peaui-spinner-loader');
    expect(root.attributes('aria-busy')).toBe('true');
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-modal')).toBeUndefined();
    expect(root.attributes('aria-label')).toBeUndefined();
    expect(root.attributes('tabindex')).toBeUndefined();
  });

  it('renders screen-reader only status message', () => {
    const wrapper = mount(SpinnerLoader);

    const sr = wrapper.get('.peaui-spinner-loader__text');
    expect(sr.attributes('role')).toBe('status');
    expect(sr.attributes('aria-live')).toBe('polite');
    expect(sr.attributes('aria-atomic')).toBe('true');

    expect(sr.text().toLowerCase()).toContain('adow');
  });

  it('renders visual spinner element as aria-hidden', () => {
    const wrapper = mount(SpinnerLoader);

    const spinner = wrapper.get('.peaui-spinner-loader__spinner');
    expect(spinner.attributes('aria-hidden')).toBe('true');
  });

  it('passes through attrs to root via useAttrs()', () => {
    const wrapper = mount(SpinnerLoader, {
      attrs: {
        id: 'fullscreen-loader',
        title: 'Ladowanie',
        'data-extra': 'x',
      },
    });

    const root = wrapper.get('.peaui-spinner-loader');
    expect(root.attributes('id')).toBe('fullscreen-loader');
    expect(root.attributes('title')).toBe('Ladowanie');
    expect(root.attributes('data-extra')).toBe('x');
  });

  it('applies data-testid when dataTestId prop is provided', () => {
    const wrapper = mount(SpinnerLoader, {
      props: { dataTestId: 'fullscreen-loader' },
    });

    const root = wrapper.get('[data-testid="fullscreen-loader"]');
    expect(root.classes()).toContain('peaui-spinner-loader');
  });
});
