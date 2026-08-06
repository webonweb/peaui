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
    placeholder: { type: String, required: false },
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

import FormTextarea from './index.vue';

describe('FormTextarea (index.vue)', () => {
  it('renders textarea with rows and data-testid derived from dataTestId', () => {
    const wrapper = mount(FormTextarea, {
      props: {
        id: 'description',
        name: 'description',
        value: 'Lorem ipsum',
        rows: 7,
        dataTestId: 'form-textarea',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('id')).toBe('description');
    expect(textarea.attributes('name')).toBe('description');
    expect(textarea.attributes('rows')).toBe('7');
    expect(textarea.attributes('data-testid')).toBe('form-textarea-element');
    expect(textarea.classes()).toContain('peaui-form-field-textarea');
  });

  it('emits update:value on input', async () => {
    const wrapper = mount(FormTextarea, {
      props: {
        id: 'description',
        name: 'description',
        value: 'Lorem ipsum',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    await wrapper.get('textarea').setValue('Nowy opis');

    expect(wrapper.emitted('update:value')).toEqual([['Nowy opis']]);
  });

  it('clears value when FormField emits remove', async () => {
    const wrapper = mount(FormTextarea, {
      props: {
        id: 'description',
        name: 'description',
        value: 'Lorem ipsum',
      },
      global: {
        stubs: {
          FormField: FormFieldStub,
        },
      },
    });

    await wrapper.get('[data-testid="remove-button"]').trigger('click');

    expect(wrapper.emitted('update:value')).toEqual([['']]);
  });

  it('forwards helper slots to FormField', () => {
    const wrapper = mount(FormTextarea, {
      props: {
        id: 'description',
        name: 'description',
        value: 'Lorem ipsum',
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
