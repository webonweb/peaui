import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const FormFieldStub = defineComponent({
  name: 'FormField',
  props: {
    id: { type: String, required: false },
    name: { type: String, required: false },
    placeholder: { type: String, required: false },
    value: { type: [String, Number, Array, Object], required: false },
  },
  emits: ['on:remove'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { 'data-testid': 'form-field-stub' }, [
        slots.hint?.(),
        slots.default?.({
          props: {
            id: props.id,
            name: props.name,
            class: 'field-element',
            placeholder: props.placeholder,
            value: props.value,
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
        slots.description?.(),
        slots.error?.(),
        slots.success?.(),
      ]);
  },
});

import FormInput from './index.vue';

describe('FormInput (index.vue)', () => {
  it('renders text input and merges attrs with slot props', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'first-name',
        name: 'firstName',
        value: 'Jan',
        placeholder: 'Wpisz imie',
      },
      attrs: {
        title: 'Pole tekstowe',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('id')).toBe('first-name');
    expect(input.attributes('name')).toBe('firstName');
    expect(input.attributes('placeholder')).toBe('Wpisz imie');
    expect(input.attributes('title')).toBe('Pole tekstowe');
    expect(input.classes()).toContain('field-element');
    expect((input.element as HTMLInputElement).value).toBe('Jan');
  });

  it('emits update:value on input', async () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'first-name',
        name: 'firstName',
        value: 'Jan',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    await wrapper.get('input').setValue('Anna');

    expect(wrapper.emitted('update:value')).toEqual([['Anna']]);
  });

  it('clears value and emits on:remove when FormField emits remove', async () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'first-name',
        name: 'firstName',
        value: 'Jan',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('on:remove')).toEqual([[]]);
    expect(wrapper.emitted('update:value')).toEqual([['']]);
  });

  it('forwards hint, description, error and success slots', () => {
    const wrapper = mount(FormInput, {
      props: {
        id: 'first-name',
        name: 'firstName',
        value: 'Jan',
      },
      slots: {
        hint: 'Hint content',
        description: 'Description content',
        error: 'Error content',
        success: 'Success content',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    expect(wrapper.text()).toContain('Hint content');
    expect(wrapper.text()).toContain('Description content');
    expect(wrapper.text()).toContain('Error content');
    expect(wrapper.text()).toContain('Success content');
  });
});
