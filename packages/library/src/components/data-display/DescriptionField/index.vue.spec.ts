import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

describe('DescriptionField (index.vue)', () => {
  it('renders <dl> with UIKIT-based class and displays the label', () => {
    const wrapper = mount(Component, {
      props: { label: 'My label' },
      slots: { default: 'My value' },
    });

    const dl = wrapper.get('dl');
    expect(dl.classes()).toContain('uikit-description-field');

    const dt = wrapper.get('dt');
    expect(dt.text()).toBe('My label');

    const value = wrapper.get('dd.uikit-description-field__value');
    expect(value.text()).toBe('My value');
  });

  it('connects value dd with dt using aria-labelledby and dt id', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label' },
      slots: { default: 'Value' },
    });

    const dt = wrapper.get('dt');
    const valueDd = wrapper.get('dd.uikit-description-field__value');

    const dtId = dt.attributes('id');
    expect(dtId).toBeTruthy();

    expect(valueDd.attributes('aria-labelledby')).toBe(dtId);
  });

  it('renders additional-before and additional-after slots', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label' },
      slots: {
        default: '<span data-testid="value-slot">V</span>',
        'additional-before': '<span data-testid="before-slot">B</span>',
        'additional-after': '<span data-testid="after-slot">A</span>',
      },
    });

    expect(wrapper.get('[data-testid="before-slot"]').text()).toBe('B');
    expect(wrapper.get('[data-testid="value-slot"]').text()).toBe('V');
    expect(wrapper.get('[data-testid="after-slot"]').text()).toBe('A');
  });

  it('sets data-testid attributes when dataTestId prop is provided', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label', dataTestId: 'desc' },
      slots: { default: 'Value' },
    });

    expect(wrapper.find('dl[data-testid="desc"]').exists()).toBe(true);

    expect(wrapper.find('dt[data-testid="desc-label"]').exists()).toBe(true);
    expect(wrapper.find('dd[data-testid="desc-value"]').exists()).toBe(true);

    expect(wrapper.find('dd[data-testid="desc-addon-before"]').exists()).toBe(true);
    expect(wrapper.find('dd[data-testid="desc-addon-after"]').exists()).toBe(true);
  });

  it('does not render data-testid attributes when dataTestId prop is not provided', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label' },
      slots: { default: 'Value' },
    });

    const dl = wrapper.get('dl');
    expect(dl.attributes('data-testid')).toBeUndefined();

    const dt = wrapper.get('dt');
    expect(dt.attributes('data-testid')).toBeUndefined();

    const valueDd = wrapper.get('dd.uikit-description-field__value');
    expect(valueDd.attributes('data-testid')).toBeUndefined();

    const addonBefore = wrapper.get('dd.uikit-description-field__addon--before');
    const addonAfter = wrapper.get('dd.uikit-description-field__addon--after');

    expect(addonBefore.attributes('data-testid')).toBeUndefined();
    expect(addonAfter.attributes('data-testid')).toBeUndefined();
  });

  it('renders addon containers even if addon slots are empty', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label' },
      slots: { default: 'Value' },
    });

    expect(wrapper.find('dd.uikit-description-field__addon--before').exists()).toBe(true);
    expect(wrapper.find('dd.uikit-description-field__addon--after').exists()).toBe(true);
  });

  it('renders hint tooltip only when hint slot is provided', () => {
    const wrapper = mount(Component, {
      props: { label: 'Label', dataTestId: 'desc' },
      slots: {
        default: 'Value',
        hint: 'Hint content',
      },
    });

    expect(wrapper.find('[data-testid="desc-tooltip-tooltip"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="desc-tooltip-description"]').text()).toBe('Hint content');
  });
});
