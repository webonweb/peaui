import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const FormFieldStub = defineComponent({
  name: 'FormField',
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: false },
    required: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    dataTestId: { type: String, required: false },
    value: { type: [String, Number], required: false },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'form-field-stub' }, [
        props.label
          ? h(
              'label',
              {
                id: `label-${props.id}`,
                for: props.id,
                'data-testid': props.dataTestId ? `${props.dataTestId}-label` : undefined,
              },
              props.label,
            )
          : null,
        slots.hint?.(),
        slots.default?.({
          props: {
            id: props.id,
            name: props.name,
            value: props.value,
            class: 'field-element',
            'aria-disabled': props.disabled || undefined,
            'aria-required': props.required || false,
          },
        }),
        slots.description?.(),
        slots.error?.(),
        slots.success?.(),
      ]);
  },
});

const InfoTooltipStub = defineComponent({
  name: 'InfoTooltip',
  inheritAttrs: false,
  props: {
    placement: { type: String, required: false },
    variant: { type: String, required: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: 'info-tooltip-stub',
          'data-placement': props.placement,
          'data-variant': props.variant,
        },
        [
          slots.default?.(),
          h('div', { class: 'info-tooltip-stub__description' }, slots.description?.()),
        ],
      );
  },
});

import FormButtonGroup from './index.vue';

const defaultOptions = [
  { label: 'Tak', key: 'yes' },
  { label: 'Nie', key: 'no' },
  { label: 'Moze', key: 'maybe' },
];

const mountComponent = (
  props: Record<string, unknown> = {},
  slots: Record<string, string | (() => import('vue').VNode[])> = {},
  attrs: Record<string, unknown> = {},
) => {
  const wrapper = mount(FormButtonGroup, {
    props: {
      id: 'decision',
      name: 'decision',
      value: undefined,
      options: defaultOptions,
      dataTestId: 'form-button-group',
      'onUpdate:value': async (value: string | number | undefined) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    attrs,
    slots,
    global: {
      stubs: {
        FormField: FormFieldStub,
        InfoTooltip: InfoTooltipStub,
      },
    },
  });

  return wrapper;
};

describe('FormButtonGroup (index.vue)', () => {
  it('renders radiogroup with derived aria and test ids', () => {
    const wrapper = mountComponent({
      label: 'Decyzja',
    });

    const group = wrapper.get('[data-testid="form-button-group-group"]');
    const buttons = wrapper.findAll('[role="radio"]');

    expect(group.attributes('role')).toBe('radiogroup');
    expect(group.attributes('aria-orientation')).toBe('horizontal');
    expect(group.attributes('aria-labelledby')).toBe('label-decision');
    expect(group.classes()).toContain('field-element');
    expect(group.classes()).toContain('peaui-form-button-group');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]!.attributes('data-testid')).toBe('form-button-group-option-0');
    expect(buttons[0]!.attributes('aria-checked')).toBe('false');
  });

  it('falls back to aria-label from name when visible label is missing', () => {
    const wrapper = mountComponent({
      label: undefined,
      name: 'decision-choice',
    });

    const group = wrapper.get('[data-testid="form-button-group-group"]');

    expect(group.attributes('aria-labelledby')).toBeUndefined();
    expect(group.attributes('aria-label')).toBe('decision-choice');
  });

  it('preserves explicit aria-label when visible label is missing', () => {
    const wrapper = mountComponent(
      {
        label: undefined,
      },
      {},
      {
        'aria-label': 'Wybierz decyzje',
      },
    );

    const group = wrapper.get('[data-testid="form-button-group-group"]');

    expect(group.attributes('aria-labelledby')).toBeUndefined();
    expect(group.attributes('aria-label')).toBe('Wybierz decyzje');
  });

  it('merges class passed through attrs with internal and field classes', () => {
    const wrapper = mountComponent(
      {
        label: 'Decyzja',
      },
      {},
      {
        class: 'custom-group-class',
      },
    );

    const group = wrapper.get('[data-testid="form-button-group-group"]');

    expect(group.classes()).toContain('custom-group-class');
    expect(group.classes()).toContain('field-element');
    expect(group.classes()).toContain('peaui-form-button-group');
  });

  it('renders additional hint tooltip on the right side only when slot is provided', () => {
    const withoutHint = mountComponent();

    expect(withoutHint.find('.info-tooltip-stub').exists()).toBe(false);

    const wrapper = mountComponent(
      {},
      {
        additionalHint: 'Opcjonalne',
      },
    );

    const hint = wrapper.get('.info-tooltip-stub');
    const group = wrapper.get('[data-testid="form-button-group-group"]');

    expect(hint.attributes('data-test-id')).toBe('form-button-group-additional-hint');
    expect(hint.attributes('data-placement')).toBe('right');
    expect(hint.find('.peaui-form-button-group__additional-hint-icon').exists()).toBe(true);
    expect(group.find('.info-tooltip-stub').exists()).toBe(false);
    expect(hint.text()).toContain('Opcjonalne');
  });

  it('renders tooltips only for options with hint and applies the correct variant', () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Tak', key: 'yes', hint: 'Mozesz wybrac te opcje od razu.' },
        { label: 'Nie', key: 'no' },
        { label: 'Moze', key: 'maybe', disabled: true, hint: 'Ta opcja jest zablokowana.' },
      ],
    });

    const tooltips = wrapper.findAll('.info-tooltip-stub');

    expect(tooltips).toHaveLength(2);
    expect(tooltips[0]!.attributes('data-test-id')).toBe('form-button-group-option-0-hint');
    expect(tooltips[0]!.attributes('data-placement')).toBe('right');
    expect(tooltips[0]!.attributes('data-variant')).toBe('default');
    expect(tooltips[0]!.attributes('tabindex')).toBe('-1');
    expect(tooltips[0]!.find('[data-testid="form-button-group-option-0"]').exists()).toBe(true);
    expect(tooltips[0]!.text()).toContain('Mozesz wybrac te opcje od razu.');

    expect(tooltips[1]!.attributes('data-test-id')).toBe('form-button-group-option-2-hint');
    expect(tooltips[1]!.attributes('data-placement')).toBe('right');
    expect(tooltips[1]!.attributes('data-variant')).toBe('disabled');
    expect(
      tooltips[1]!.find('[data-testid="form-button-group-option-2"]').attributes(),
    ).toHaveProperty('disabled');
    expect(tooltips[1]!.text()).toContain('Ta opcja jest zablokowana.');
  });

  it('renders a uniform flex item wrapper for every option', () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Tak', key: 'yes', hint: 'Mozesz wybrac te opcje od razu.' },
        { label: 'Nie', key: 'no' },
        { label: 'Moze', key: 'maybe', disabled: true, hint: 'Ta opcja jest zablokowana.' },
      ],
    });

    const items = wrapper.findAll('.peaui-form-button-group__button-item');

    expect(items).toHaveLength(3);
    expect(items[0]!.find('.info-tooltip-stub').exists()).toBe(true);
    expect(items[0]!.find('[data-testid="form-button-group-option-0"]').exists()).toBe(true);
    expect(items[1]!.find('.info-tooltip-stub').exists()).toBe(false);
    expect(items[1]!.find('[data-testid="form-button-group-option-1"]').exists()).toBe(true);
  });

  it('updates model on button click', async () => {
    const wrapper = mountComponent();

    await wrapper.get('[data-testid="form-button-group-option-1"]').trigger('click');

    expect(wrapper.emitted('update:value')).toEqual([['no']]);
  });

  it('updates model on hinted button click', async () => {
    const wrapper = mountComponent({
      options: [
        { label: 'Tak', key: 'yes', hint: 'Mozesz wybrac te opcje od razu.' },
        { label: 'Nie', key: 'no' },
      ],
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('click');

    expect(wrapper.emitted('update:value')).toEqual([['yes']]);
  });

  it('applies size class from props to buttons', () => {
    const wrapper = mountComponent({
      size: 'l',
    });

    expect(
      wrapper
        .get('[data-testid="form-button-group-group"]')
        .find('.peaui-form-button-group__buttons')
        .exists(),
    ).toBe(true);
    expect(wrapper.get('[data-testid="form-button-group-option-0"]').classes()).toContain(
      'peaui-form-button-group__button--size-l',
    );
  });

  it('keeps selected value when clicking active option and isToggle=false', async () => {
    const wrapper = mountComponent({
      value: 'yes',
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('click');

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(
      wrapper.get('[data-testid="form-button-group-option-0"]').attributes('aria-checked'),
    ).toBe('true');
  });

  it('keeps selected value when clicking active option and field is required', async () => {
    const wrapper = mountComponent({
      value: 'yes',
      required: true,
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('click');

    expect(
      wrapper.get('[data-testid="form-button-group-option-0"]').attributes('aria-checked'),
    ).toBe('true');
  });

  it('clears selected value when clicking active option and isToggle=true', async () => {
    const wrapper = mountComponent({
      value: 'yes',
      isToggle: true,
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]?.[0]).toBeUndefined();
  });

  it('supports arrow navigation and skips disabled options', async () => {
    const wrapper = mountComponent({
      value: 'yes',
      options: [
        { label: 'Tak', key: 'yes' },
        { label: 'Nie', key: 'no', disabled: true },
        { label: 'Moze', key: 'maybe' },
      ],
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('keydown', {
      key: 'ArrowRight',
    });

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['maybe']);
  });

  it('sets readonly aria state and prevents updates when readonly', async () => {
    const wrapper = mountComponent({
      label: 'Decyzja',
      readonly: true,
    });

    const group = wrapper.get('[data-testid="form-button-group-group"]');
    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('click');

    expect(group.attributes('aria-readonly')).toBe('true');
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('clears selected value on keyboard toggle when isToggle=true', async () => {
    const wrapper = mountComponent({
      value: 'yes',
      isToggle: true,
    });

    await wrapper.get('[data-testid="form-button-group-option-0"]').trigger('keydown', {
      key: 'Enter',
    });

    expect(wrapper.emitted('update:value')?.[0]?.[0]).toBeUndefined();
  });

  it('disables buttons and hidden input when disabled', () => {
    const wrapper = mountComponent({
      disabled: true,
    });

    expect(
      wrapper.get('[data-testid="form-button-group-hidden-input"]').attributes(),
    ).toHaveProperty('disabled');
    expect(wrapper.get('[data-testid="form-button-group-option-0"]').attributes()).toHaveProperty(
      'disabled',
    );
  });
});
