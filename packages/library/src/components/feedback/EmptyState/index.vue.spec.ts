import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}), { virtual: true });
vi.mock('./styles.scss', () => ({}), { virtual: true });

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');
  return {
    ...actual,
    useId: () => 'unit',
  };
});

describe('EmptyState (index.vue)', () => {
  it('renders root with base BEM class', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Brak danych' },
    });

    const root = wrapper.get('section');
    expect(root.classes()).toContain('peaui-empty-state');
  });

  it('sets data-testid when dataTestId is provided', () => {
    const wrapper = mount(EmptyState, {
      props: { dataTestId: 'empty-state' },
    });

    const root = wrapper.get('section');
    expect(root.attributes('data-testid')).toBe('empty-state');
  });

  it('renders svg as decorative (aria-hidden + focusable=false)', () => {
    const wrapper = mount(EmptyState);

    const svg = wrapper.get('svg');
    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('focusable')).toBe('false');

    expect(svg.classes()).toContain('peaui-empty-state__icon');
  });

  it('when no title and no description: sets aria-label fallback "Brak danych"', () => {
    const wrapper = mount(EmptyState);

    const root = wrapper.get('section');
    expect(root.attributes('aria-label')).toBe('Brak danych');
    expect(root.attributes('aria-labelledby')).toBeUndefined();
    expect(root.attributes('aria-describedby')).toBeUndefined();
  });

  it('when only description is provided: aria-label equals description and aria-describedby is set', () => {
    const wrapper = mount(EmptyState, {
      props: { description: 'Nie znaleziono wyników.' },
    });

    const root = wrapper.get('section');
    expect(root.attributes('aria-label')).toBe('Nie znaleziono wyników.');
    expect(root.attributes('aria-describedby')).toBe('empty-unit-desc');

    const p = wrapper.get('p');
    expect(p.attributes('id')).toBe('empty-unit-desc');
    expect(p.classes()).toContain('peaui-empty-state__description');
  });

  it('when title is provided: sets aria-labelledby and does NOT set aria-label', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Brak danych' },
    });

    const root = wrapper.get('section');
    expect(root.attributes('aria-labelledby')).toBe('empty-unit-title');
    expect(root.attributes('aria-label')).toBeUndefined();

    const h3 = wrapper.get('h3');
    expect(h3.text()).toBe('Brak danych');
    expect(h3.attributes('id')).toBe('empty-unit-title');
    expect(h3.classes()).toContain('peaui-empty-state__title');
  });

  it('when title and description are provided: sets aria-labelledby and aria-describedby', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Brak danych', description: 'Dodaj nowy wpis.' },
    });

    const root = wrapper.get('section');
    expect(root.attributes('aria-labelledby')).toBe('empty-unit-title');
    expect(root.attributes('aria-describedby')).toBe('empty-unit-desc');
    expect(root.attributes('aria-label')).toBeUndefined();

    expect(wrapper.get('h3').attributes('id')).toBe('empty-unit-title');
    expect(wrapper.get('p').attributes('id')).toBe('empty-unit-desc');
  });

  it('renders additional slot only when provided', () => {
    const wrapperWithoutSlot = mount(EmptyState, {
      props: { title: 'Brak danych' },
    });
    expect(wrapperWithoutSlot.find('.peaui-empty-state__additional').exists()).toBe(false);

    const wrapperWithSlot = mount(EmptyState, {
      props: { title: 'Brak danych' },
      slots: {
        additional: '<button type="button">Dodaj</button>',
      },
    });

    const additional = wrapperWithSlot.get('.peaui-empty-state__additional');
    expect(additional.exists()).toBe(true);
    expect(additional.text()).toContain('Dodaj');
  });

  it('passes arbitrary attrs to root via useAttrs()', () => {
    const wrapper = mount(EmptyState, {
      attrs: {
        id: 'empty-root',
        title: 'Tooltip title',
        'data-extra': 'x',
      },
    });

    const root = wrapper.get('section');
    expect(root.attributes('id')).toBe('empty-root');
    expect(root.attributes('data-extra')).toBe('x');
  });
});
