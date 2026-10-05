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
    id: { type: String, required: false },
    name: { type: String, required: false },
    value: { type: [String, Number], required: false },
  },
  emits: ['on:remove'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { 'data-testid': 'form-field-stub' }, [
        slots.default?.({
          props: {
            id: props.id,
            name: props.name,
            value: props.value,
            class: 'field-element',
          },
        }),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'remove-button',
            onClick: () => emit('on:remove'),
          },
          'remove',
        ),
      ]);
  },
});

import FormNumber from './index.vue';

const mountComponent = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(FormNumber, {
    props: {
      id: 'building-count',
      name: 'buildingCount',
      value: 1,
      'onUpdate:value': async (value: number | string | undefined) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    global: {
      stubs: {
        FormField: FormFieldStub,
      },
    },
  });

  return wrapper;
};

describe('FormNumber (index.vue)', () => {
  it('renders numeric input with spinbutton attrs and derived data-testid', () => {
    const wrapper = mountComponent({
      min: 1,
      max: 10,
      step: 0.5,
      dataTestId: 'form-number',
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('number');
    expect(input.attributes('role')).toBe('spinbutton');
    expect(input.attributes('inputmode')).toBe('numeric');
    expect(input.attributes('min')).toBe('1');
    expect(input.attributes('max')).toBe('10');
    expect(input.attributes('step')).toBe('0.5');
    expect(input.attributes('data-testid')).toBe('form-number-element');
  });

  it('clamps value to min on blur', async () => {
    const wrapper = mountComponent({
      value: 0,
      min: 1,
      max: 10,
    });

    const input = wrapper.get('input');
    (input.element as HTMLInputElement).value = '0';
    await input.trigger('blur');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([1]);
  });

  it('clamps value to max on blur', async () => {
    const wrapper = mountComponent({
      value: 15,
      min: 1,
      max: 10,
    });

    const input = wrapper.get('input');
    (input.element as HTMLInputElement).value = '15';
    await input.trigger('blur');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([10]);
  });

  it('rounds value to step precision on blur', async () => {
    const wrapper = mountComponent({
      value: 1.236,
      step: 0.01,
    });

    const input = wrapper.get('input');
    (input.element as HTMLInputElement).value = '1.236';
    await input.trigger('blur');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([1.24]);
  });

  it('increments and decrements value with arrow keys', async () => {
    const wrapper = mountComponent({
      value: 1,
      step: 0.1,
    });

    const input = wrapper.get('input');

    await input.trigger('keydown.up');
    await input.trigger('keydown.down');

    expect(wrapper.emitted('update:value')?.[0]).toEqual([1.1]);
    expect(wrapper.emitted('update:value')?.[1]).toEqual([1]);
  });

  it('clears value when FormField emits remove', async () => {
    const wrapper = mountComponent({
      value: 5,
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['']);
  });
});
