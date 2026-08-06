import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import SectionDivider from './index.vue';

describe('SectionDivider (index.vue)', () => {
  it('renders semantic horizontal hr root with base classes from UIKIT_NAME', () => {
    const wrapper = mount(SectionDivider);

    const root = wrapper.get('hr');

    expect(root.element.tagName.toLowerCase()).toBe('hr');
    expect(root.classes()).toContain('peaui-section-divider');
    expect(root.classes()).toContain('peaui-section-divider--horizontal');
    expect(root.classes()).toContain('peaui-section-divider--size-s');
    expect(root.attributes('role')).toBeUndefined();
    expect(root.attributes('aria-orientation')).toBeUndefined();
  });

  it('sets data-testid from dataTestId prop', () => {
    const wrapper = mount(SectionDivider, {
      props: { dataTestId: 'section-divider' },
    });

    expect(wrapper.get('hr').attributes('data-testid')).toBe('section-divider');
  });

  it('forwards attrs to root element and merges custom class', () => {
    const wrapper = mount(SectionDivider, {
      attrs: {
        id: 'divider-root',
        class: 'custom-divider',
        'data-foo': 'bar',
        'aria-label': 'Separator sekcji',
        'aria-hidden': 'true',
      },
    });

    const root = wrapper.get('hr');

    expect(root.attributes('id')).toBe('divider-root');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('aria-label')).toBe('Separator sekcji');
    expect(root.attributes('aria-hidden')).toBe('true');
    expect(root.classes()).toContain('peaui-section-divider');
    expect(root.classes()).toContain('custom-divider');
  });

  it('renders vertical variant as separator with explicit orientation', () => {
    const wrapper = mount(SectionDivider, {
      props: { direction: 'vertical', size: 'xl', dataTestId: 'section-divider-vertical' },
    });

    const root = wrapper.get('[data-testid="section-divider-vertical"]');

    expect(root.element.tagName.toLowerCase()).toBe('div');
    expect(root.classes()).toContain('peaui-section-divider');
    expect(root.classes()).toContain('peaui-section-divider--vertical');
    expect(root.classes()).toContain('peaui-section-divider--size-xl');
    expect(root.attributes('role')).toBe('separator');
    expect(root.attributes('aria-orientation')).toBe('vertical');
  });

  it('overrides conflicting separator attrs when direction is vertical', () => {
    const wrapper = mount(SectionDivider, {
      props: { direction: 'vertical' },
      attrs: {
        role: 'presentation',
        'aria-orientation': 'horizontal',
      },
    });

    const root = wrapper.get('div');

    expect(root.attributes('role')).toBe('separator');
    expect(root.attributes('aria-orientation')).toBe('vertical');
  });

  it('prefers dataTestId prop over data-testid attr', () => {
    const wrapper = mount(SectionDivider, {
      props: { dataTestId: 'from-prop' },
      attrs: { 'data-testid': 'from-attr' },
    });

    expect(wrapper.get('hr').attributes('data-testid')).toBe('from-prop');
  });

  it('applies explicit size modifier class when size prop is provided', () => {
    const wrapper = mount(SectionDivider, {
      props: { size: 'l' },
    });

    const root = wrapper.get('hr');

    expect(root.classes()).toContain('peaui-section-divider--size-l');
    expect(root.classes()).not.toContain('peaui-section-divider--size-s');
  });
});
