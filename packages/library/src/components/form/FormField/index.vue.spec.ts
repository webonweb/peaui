import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const FieldLabelStub = defineComponent({
  name: 'FieldLabel',
  props: {
    for: { type: String, required: false },
    text: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'label',
        {
          ...attrs,
          for: props.for,
        },
        [h('span', props.text), slots.hint?.()],
      );
  },
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: false },
  },
  setup(props, { attrs }) {
    return () =>
      h('svg', {
        ...attrs,
        'data-icon': props.name,
        class: ['svg-icon-stub', attrs.class],
      });
  },
});

const MessageTextStub = defineComponent({
  name: 'MessageText',
  props: {
    id: { type: String, required: false },
    variant: { type: String, required: false },
    dataTestId: { type: String, required: false },
    size: { type: String, required: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          id: props.id,
          'data-testid': props.dataTestId,
          'data-variant': props.variant,
          'data-size': props.size,
        },
        slots.default?.(),
      );
  },
});

import FormField from './index.vue';

const mountComponent = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) =>
  mount(FormField, {
    props: {
      id: 'first-name',
      name: 'firstName',
      ...props,
    },
    attrs,
    slots: {
      default: ({ props }: { props: Record<string, unknown> }) =>
        h('input', {
          ...props,
          'data-testid': 'field-element',
        }),
      ...slots,
    },
    global: {
      stubs: {
        FieldLabel: FieldLabelStub,
        SvgIcon: SvgIconStub,
        MessageText: MessageTextStub,
      },
    },
  });

describe('FormField (index.vue)', () => {
  it('renders label and hint slot when label is provided', () => {
    const wrapper = mountComponent(
      {
        label: 'Imie',
      },
      {
        hint: 'Podpowiedz',
      },
    );

    const label = wrapper.get('label');

    expect(label.attributes('for')).toBe('first-name');
    expect(label.text()).toContain('Imie');
    expect(label.text()).toContain('Podpowiedz');
  });

  it('passes bindings to field element and renders before/after text with icons', () => {
    const wrapper = mountComponent({
      value: 'Jan',
      placeholder: 'Wpisz imie',
      maxLength: 20,
      required: true,
      readonly: true,
      disabled: true,
      before: 'PL',
      after: 'kg',
      iconBefore: 'cross',
      iconAfter: 'plus',
    });

    const input = wrapper.get('[data-testid="field-element"]');

    expect(input.attributes('id')).toBe('first-name');
    expect(input.attributes('name')).toBe('firstName');
    expect(input.attributes('placeholder')).toBe('Wpisz imie');
    expect(input.attributes('aria-placeholder')).toBeUndefined();
    expect(input.attributes('maxlength')).toBe('20');
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('aria-disabled')).toBe('true');
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes()).toHaveProperty('readonly');
    expect(input.attributes()).toHaveProperty('disabled');
    expect(input.classes()).toContain('peaui-form-field__element');
    expect(input.classes()).toContain('peaui-form-field__element--medium');
    expect(input.classes()).toContain('peaui-form-field__element--disabled');
    expect(input.classes()).toContain('peaui-form-field__element--readonly');

    expect(wrapper.get('[data-before="PL"]')).toBeTruthy();
    expect(wrapper.get('[data-after="kg"]')).toBeTruthy();
    expect(wrapper.findAll('.svg-icon-stub').map((icon) => icon.attributes('data-icon'))).toEqual([
      'cross',
      'plus',
    ]);
  });

  it('falls back to name for accessible name only when label and explicit aria attrs are missing', () => {
    const wrapperWithoutLabel = mountComponent();

    expect(wrapperWithoutLabel.get('[data-testid="field-element"]').attributes('aria-label')).toBe(
      'firstName',
    );
    expect(
      wrapperWithoutLabel.get('[data-testid="field-element"]').attributes('aria-labelledby'),
    ).toBeUndefined();

    const wrapperWithExplicitLabel = mountComponent({}, {}, { 'aria-label': 'Imie' });

    expect(
      wrapperWithExplicitLabel.get('[data-testid="field-element"]').attributes('aria-label'),
    ).toBe('Imie');

    const wrapperWithExplicitLabelledBy = mountComponent(
      {},
      {},
      { 'aria-labelledby': 'name-label' },
    );

    expect(
      wrapperWithExplicitLabelledBy.get('[data-testid="field-element"]').attributes('aria-label'),
    ).toBeUndefined();
    expect(
      wrapperWithExplicitLabelledBy
        .get('[data-testid="field-element"]')
        .attributes('aria-labelledby'),
    ).toBe('name-label');
  });

  it('renders erase button and emits on:remove for filled values', async () => {
    const wrapper = mountComponent({
      value: 'Jan',
      canErase: true,
      dataTestId: 'form-field',
      rightErasePosition: 44,
      after: 'kg',
    });

    const button = wrapper.get('[data-testid="form-field-erase-button"]');

    expect(button.attributes('style')).toContain('--right: 44px');

    await button.trigger('click');

    expect(wrapper.emitted('on:remove')).toEqual([[]]);
  });

  it('does not emit on:remove on manual Enter keypress for native erase button', async () => {
    const wrapper = mountComponent({
      value: 'Jan',
      canErase: true,
      dataTestId: 'form-field',
    });

    const button = wrapper.get('[data-testid="form-field-erase-button"]');

    await button.trigger('keypress', { key: 'Enter' });

    expect(wrapper.emitted('on:remove')).toBeUndefined();
  });

  it('renders description message and sets aria-describedby when description slot exists', () => {
    const wrapper = mountComponent(
      {
        dataTestId: 'form-field',
      },
      {
        description: 'Opis pola',
      },
    );

    expect(wrapper.get('[data-testid="form-field-help-description"]').text()).toContain(
      'Opis pola',
    );
    expect(wrapper.get('[data-testid="field-element"]').attributes('aria-describedby')).toBe(
      'first-name-help-description',
    );
  });

  it('renders error message, marks field as invalid and hides description', () => {
    const wrapper = mountComponent(
      {
        dataTestId: 'form-field',
      },
      {
        error: 'Pole jest niepoprawne',
      },
    );

    const input = wrapper.get('[data-testid="field-element"]');

    expect(wrapper.get('[data-testid="form-field-error"]').text()).toContain(
      'Pole jest niepoprawne',
    );
    expect(wrapper.find('[data-testid="form-field-help-description"]').exists()).toBe(false);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('first-name-error');
    expect(input.classes()).toContain('peaui-form-field__element--error');
  });

  it('renders max length message with info variant when value reaches limit', () => {
    const wrapper = mountComponent({
      value: 'abcd',
      maxLength: 4,
      dataTestId: 'form-field',
    });

    const message = wrapper.get('[data-testid="form-field-help-max-length-description"]');

    expect(message.text()).toContain('4 / 4');
    expect(message.attributes('data-variant')).toBe('info');
    expect(wrapper.get('[data-testid="field-element"]').attributes('aria-describedby')).toBe(
      'first-name-help-max-length-description',
    );
  });
});
