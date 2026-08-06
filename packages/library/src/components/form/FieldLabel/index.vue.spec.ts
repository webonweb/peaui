import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import FormLabel from './index.vue';

const InfoTooltipStub = {
  name: 'InfoTooltip',
  inheritAttrs: false,
  props: {
    placement: { type: String, required: false },
  },
  template: `
    <div
      class="info-tooltip-stub"
      v-bind="$attrs"
      :data-placement="placement"
    >
      <slot />
      <div class="info-tooltip-stub__description">
        <slot name="description" />
      </div>
    </div>
  `,
};

describe('FormLabel (index.vue)', () => {
  it('renders a <label> with correct class, id and for', () => {
    const wrapper = mount(FormLabel, {
      props: {
        for: 'first-name',
        text: 'Imię',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    const label = wrapper.get('label');
    expect(label.classes()).toContain('peaui-form-label');
    expect(label.attributes('for')).toBe('first-name');
    expect(label.attributes('id')).toBe('label-first-name');
  });

  it('renders text using v-html and sets data-testid for text when dataTestId is provided', () => {
    const wrapper = mount(FormLabel, {
      props: {
        for: 'email',
        text: 'E-mail <strong>firmowy</strong>',
        dataTestId: 'my-label',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    const text = wrapper.get('[data-testid="my-label-text"]');
    expect(text.html()).toContain('<strong>firmowy</strong>');
    expect(text.classes()).toContain('peaui-form-label__text');
  });

  it('shows optional note only when required is false and readonly is false', () => {
    const wrapper = mount(FormLabel, {
      props: {
        for: 'middle-name',
        text: 'Drugie imię',
        required: false,
        readonly: false,
        dataTestId: 'label',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    const optional = wrapper.get('[data-testid="label-optional"]');
    expect(optional.text()).toBe('(pole niewymagane)');
    expect(optional.classes()).toContain('peaui-form-label__optional');
  });

  it('does not show optional note when required is true (or undefined)', () => {
    const wrapperRequiredTrue = mount(FormLabel, {
      props: {
        for: 'last-name',
        text: 'Nazwisko',
        required: true,
        readonly: false,
        dataTestId: 'label',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });
    expect(wrapperRequiredTrue.find('[data-testid="label-optional"]').exists()).toBe(false);
  });

  it('adds readonly modifier class to text when readonly is true', () => {
    const wrapper = mount(FormLabel, {
      props: {
        for: 'id',
        text: 'ID',
        readonly: true,
        dataTestId: 'label',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    const text = wrapper.get('[data-testid="label-text"]');
    expect(text.classes()).toContain('peaui-form-label__text--readonly');
    expect(
      mount(FormLabel, {
        props: {
          for: 'id2',
          text: 'ID',
          readonly: true,
          required: false,
          dataTestId: 'label',
        },
        global: {
          stubs: { InfoTooltip: InfoTooltipStub },
        },
      })
        .find('[data-testid="label-optional"]')
        .exists(),
    ).toBe(false);
  });

  it('renders InfoTooltip only when hint slot is provided and passes computed hint data-test-id', () => {
    const wrapperNoHint = mount(FormLabel, {
      props: {
        for: 'phone',
        text: 'Telefon',
        dataTestId: 'label',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    expect(wrapperNoHint.find('.info-tooltip-stub').exists()).toBe(false);

    const wrapperWithHint = mount(FormLabel, {
      props: {
        for: 'phone',
        text: 'Telefon',
        dataTestId: 'label',
      },
      slots: {
        hint: 'To pole jest opcjonalne.',
      },
      global: {
        stubs: { InfoTooltip: InfoTooltipStub },
      },
    });

    const tooltip = wrapperWithHint.get('.info-tooltip-stub');
    expect(tooltip.attributes('data-test-id')).toBe('label-hint');
    expect(tooltip.attributes('data-placement')).toBe('right');

    expect(wrapperWithHint.text()).toContain('To pole jest opcjonalne.');
  });
});
