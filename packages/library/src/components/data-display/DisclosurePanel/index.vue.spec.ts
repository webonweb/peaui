import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import DisclosurePanel from './index.vue';

describe('DisclosurePanel (index.vue)', () => {
  it('renders root with base class and passes attrs', () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title', dataTestId: 'disclosure' },
      attrs: { id: 'root', 'data-foo': 'bar' },
    });

    const root = wrapper.get('details');
    expect(root.classes()).toContain('peaui-disclosure-panel');
    expect(root.attributes('id')).toBe('root');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('data-testid')).toBe('disclosure');
  });

  it('connects summary and content with aria-labelledby', () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title' },
    });

    const summary = wrapper.get('summary');
    const content = wrapper.get('.peaui-disclosure-panel__content');

    expect(content.attributes('aria-labelledby')).toBe(summary.attributes('id'));
  });

  it('sets open attribute based on open model', async () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title', open: false },
    });

    expect(wrapper.get('details').attributes('open')).toBeUndefined();

    await wrapper.setProps({ open: true });
    expect(wrapper.get('details').attributes('open')).toBeDefined();
  });

  it.each(['alwaysOpen', 'allwaysOpen'] as const)(
    'keeps the panel open with the %s compatibility prop',
    async (propName) => {
      const wrapper = mount(DisclosurePanel, {
        props: { title: 'Title', [propName]: true },
      });

      expect(wrapper.get('details').attributes('open')).toBeDefined();
      expect(wrapper.find('.peaui-disclosure-panel__icon').exists()).toBe(false);

      await wrapper.get('summary').trigger('click');
      expect(wrapper.emitted('update:open')).toBeUndefined();
    },
  );

  it('renders title from slot when provided', () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Prop Title', dataTestId: 'disc' },
      slots: { title: '<span data-testid="slot-title">Slot Title</span>' },
    });

    const title = wrapper.get('[data-testid="slot-title"]');
    expect(title.text()).toBe('Slot Title');
    expect(wrapper.get('[data-testid="disc-title"]').exists()).toBe(true);
  });

  it('renders additional slot next to title', () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title', dataTestId: 'disc' },
      slots: { additional: '<span data-testid="slot-additional">Extra</span>' },
    });

    const additional = wrapper.get('[data-testid="slot-additional"]');
    expect(additional.text()).toBe('Extra');
    expect(wrapper.get('[data-testid="disc-additional"]').exists()).toBe(true);
  });

  it('uses aria-label only when title is missing', () => {
    const withTitle = mount(DisclosurePanel, {
      props: { title: 'Title', ariaLabel: 'Label' },
    });
    expect(withTitle.get('summary').attributes('aria-label')).toBeUndefined();
    expect(
      withTitle.get('.peaui-disclosure-panel__content').attributes('aria-label'),
    ).toBeUndefined();

    const withoutTitle = mount(DisclosurePanel, {
      props: { ariaLabel: 'Label' },
    });
    expect(withoutTitle.get('summary').attributes('aria-label')).toBe('Label');
    expect(withoutTitle.get('.peaui-disclosure-panel__content').attributes('aria-label')).toBe(
      'Label',
    );
    expect(withoutTitle.get('.peaui-disclosure-panel__content').attributes('aria-labelledby')).toBe(
      undefined,
    );
  });

  it('falls back to generic accessible name when both title and ariaLabel are missing', () => {
    const wrapper = mount(DisclosurePanel);

    expect(wrapper.get('summary').attributes('aria-label')).toBe('Sekcja rozwijana');
    expect(wrapper.get('.peaui-disclosure-panel__content').attributes('aria-label')).toBe(
      'Sekcja rozwijana',
    );
    expect(wrapper.get('.peaui-disclosure-panel__content').attributes('aria-labelledby')).toBe(
      undefined,
    );
  });

  it('emits update:open on toggle when enabled', async () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title', open: false },
    });

    const details = wrapper.get('details').element as HTMLDetailsElement;
    details.open = true;
    await wrapper.get('details').trigger('toggle');
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);
  });

  it('does not emit update:open when disabled', async () => {
    const wrapper = mount(DisclosurePanel, {
      props: { title: 'Title', disabled: true, open: false },
    });

    await wrapper.get('summary').trigger('click');
    expect(wrapper.emitted('update:open')).toBeUndefined();
  });
});
