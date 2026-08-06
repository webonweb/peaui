import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import EditableColumn from './EditableColumn.vue';
import EditableInline from './EditableInline.vue';

vi.mock('@/assets/global.scss', () => ({}));

const FormContainerStub = defineComponent({
  name: 'FormContainer',
  props: {
    useAriaLabelledby: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'form',
        {
          'data-use-aria-labelledby': String(props.useAriaLabelledby),
          onSubmit: (event: Event) => emit('submit', event),
        },
        slots.default?.(),
      );
  },
});

const GridSectionStub = defineComponent({
  name: 'GridSection',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const GridItemStub = defineComponent({
  name: 'GridItem',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const PopoverOverlayerStub = defineComponent({
  name: 'PopoverOverlayer',
  emits: ['update:open'],
  setup(_, { emit, expose, slots }) {
    const hidePopover = vi.fn(() => emit('update:open', false));
    const showPopover = vi.fn(() => emit('update:open', true));
    const togglePopover = vi.fn();
    const refreshPopoverPosition = vi.fn();

    expose({
      hidePopover,
      refreshPopoverPosition,
      showPopover,
      togglePopover,
    });

    return () => h('div', [slots.default?.(), slots.content?.()]);
  },
});

const FieldLabelStub = defineComponent({
  name: 'FieldLabel',
  props: {
    for: {
      type: String,
      default: undefined,
    },
    text: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => h('label', { for: props.for }, [props.text, slots.hint?.()]);
  },
});

function getGlobal() {
  return {
    stubs: {
      FieldLabel: FieldLabelStub,
      FormContainer: FormContainerStub,
      GridItem: GridItemStub,
      GridSection: GridSectionStub,
      PopoverOverlayer: PopoverOverlayerStub,
      SvgIcon: true,
    },
  };
}

describe('EditableColumn.vue', () => {
  it('does not submit invalid required value', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(EditableColumn, {
      props: {
        column: {
          key: 'name',
          label: 'Nazwa',
          type: 'editable',
          manage: {
            required: true,
            type: 'text',
          },
        },
        manage: {
          onUpdate,
          required: true,
          type: 'text',
        },
        value: 'Alfa',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('button[aria-label="Edytuj kolumne"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('input[data-type="input"]').setValue('');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('button[aria-label="Zapisz zmiane w kolumnie"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(onUpdate).not.toHaveBeenCalled();
    expect((wrapper.vm as any).$?.setupState?.isEditActive).toBe(true);
    expect(wrapper.text()).not.toContain('Pole jest wymagane');
  }, 15000);

  it('renders select field for editable select column', async () => {
    const wrapper = mount(EditableColumn, {
      props: {
        column: {
          key: 'category',
          label: 'Kategoria',
          type: 'editable',
          manage: {
            options: [
              { label: 'Formalny', value: 'formalny' },
              { label: 'Techniczny', value: 'techniczny' },
            ],
            placement: 'bottom',
            placeholder: 'Wybierz kategorie',
            required: true,
            type: 'select',
          },
        },
        manage: {
          options: [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ],
          placement: 'bottom',
          placeholder: 'Wybierz kategorie',
          required: true,
          type: 'select',
        },
        value: 'formalny',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('button[aria-label="Edytuj kolumne"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.get('form').attributes('data-use-aria-labelledby')).toBe('false');
    expect(wrapper.find('input[data-type="select"]').exists()).toBe(true);
  }, 15000);

  it('resolves select options from function with current row record', async () => {
    const options = vi.fn((currentRecord: Record<string, any>) =>
      Number(currentRecord.limit) >= 10
        ? [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ]
        : [{ label: 'Kontrola', value: 'kontrola' }],
    );
    const wrapper = mount(EditableColumn, {
      props: {
        column: {
          key: 'category',
          label: 'Kategoria',
          type: 'editable',
          manage: {
            options,
            placement: 'bottom',
            placeholder: 'Wybierz kategorie',
            required: true,
            type: 'select',
          },
        },
        manage: {
          options,
          placement: 'bottom',
          placeholder: 'Wybierz kategorie',
          required: true,
          type: 'select',
        },
        record: {
          category: 'formalny',
          id: '1',
          limit: 12,
        },
        value: 'formalny',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('button[aria-label="Edytuj kolumne"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(options).toHaveBeenCalledWith({
      category: 'formalny',
      id: '1',
      limit: 12,
    });
    expect(wrapper.findAll('[role="option"]')).toHaveLength(2);
    expect(wrapper.text()).toContain('Formalny');
    expect(wrapper.text()).toContain('Techniczny');
  });

  it('generates unique field id and name for multiple editable column instances', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const sharedColumn = {
            key: 'name',
            label: 'Nazwa',
            type: 'editable' as const,
            manage: {
              required: true,
              type: 'text' as const,
            },
          };

          const sharedManage = {
            required: true,
            type: 'text' as const,
          };

          return () =>
            h('div', [
              h(EditableColumn, {
                key: 'first',
                column: sharedColumn,
                manage: sharedManage,
                value: 'Alfa',
              }),
              h(EditableColumn, {
                key: 'second',
                column: sharedColumn,
                manage: sharedManage,
                value: 'Beta',
              }),
            ]);
        },
      }),
      {
        global: getGlobal(),
      },
    );

    await vi.dynamicImportSettled();
    await flushPromises();

    const editButtons = wrapper.findAll('button[aria-label="Edytuj kolumne"]');
    expect(editButtons.length).toBe(2);

    await editButtons[0]!.trigger('click');
    await editButtons[1]!.trigger('click');

    await vi.dynamicImportSettled();
    await flushPromises();

    const inputs = wrapper.findAll('input[data-type="input"]');
    expect(inputs.length).toBe(2);

    const firstInput = inputs[0]!;
    const secondInput = inputs[1]!;

    expect(firstInput.attributes('id')).toBeDefined();
    expect(secondInput.attributes('id')).toBeDefined();
    expect(firstInput.attributes('id')).not.toBe(secondInput.attributes('id'));
    expect(firstInput.attributes('name')).toBe(firstInput.attributes('id'));
    expect(secondInput.attributes('name')).toBe(secondInput.attributes('id'));
  });
});

describe('EditableInline.vue', () => {
  it('emits inline update without validation for empty required field', async () => {
    const wrapper = mount(EditableInline, {
      props: {
        column: {
          key: 'name',
          label: 'Nazwa',
          type: 'editable',
          manage: {
            required: true,
            type: 'text',
          },
        },
        manage: {
          required: true,
          type: 'text',
        },
        value: 'Alfa',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('input[data-type="input"]').setValue('');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.get('form').attributes('data-use-aria-labelledby')).toBe('false');
    expect(wrapper.emitted('on:update')).toEqual([
      [
        {
          name: '',
        },
        {
          key: 'name',
          label: 'Nazwa',
          type: 'editable',
          manage: {
            required: true,
            type: 'text',
          },
        },
      ],
    ]);
    expect(wrapper.text()).not.toContain('Pole jest wymagane');
  });

  it('renders select field for inline editable select column and emits selected option label', async () => {
    const wrapper = mount(EditableInline, {
      props: {
        column: {
          key: 'category',
          label: 'Kategoria',
          type: 'editable',
          manage: {
            options: [
              { label: 'Formalny', value: 'formalny' },
              { label: 'Techniczny', value: 'techniczny' },
            ],
            placement: 'bottom',
            placeholder: 'Wybierz kategorie',
            required: true,
            type: 'select',
          },
        },
        manage: {
          options: [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ],
          placement: 'bottom',
          placeholder: 'Wybierz kategorie',
          required: true,
          type: 'select',
        },
        value: 'formalny',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.find('input[data-type="select"]').exists()).toBe(true);

    const options = wrapper.findAll('[role="option"]');

    await options[1]!.trigger('mousedown');
    await options[1]!.trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.emitted('on:update')?.at(-1)).toEqual([
      {
        category: 'Techniczny',
      },
      {
        key: 'category',
        label: 'Kategoria',
        type: 'editable',
        manage: {
          options: [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ],
          placement: 'bottom',
          placeholder: 'Wybierz kategorie',
          required: true,
          type: 'select',
        },
      },
    ]);
  });

  it('resolves inline select options from function with current row record', async () => {
    const options = vi.fn((currentRecord: Record<string, any>) =>
      Number(currentRecord.limit) >= 10
        ? [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ]
        : [{ label: 'Kontrola', value: 'kontrola' }],
    );
    const wrapper = mount(EditableInline, {
      props: {
        column: {
          key: 'category',
          label: 'Kategoria',
          type: 'editable',
          manage: {
            options,
            placement: 'bottom',
            placeholder: 'Wybierz kategorie',
            required: true,
            type: 'select',
          },
        },
        manage: {
          options,
          placement: 'bottom',
          placeholder: 'Wybierz kategorie',
          required: true,
          type: 'select',
        },
        record: {
          category: 'formalny',
          id: '1',
          limit: 12,
        },
        value: 'formalny',
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(options).toHaveBeenCalledWith({
      category: 'formalny',
      id: '1',
      limit: 12,
    });
    expect(wrapper.findAll('[role="option"]')).toHaveLength(2);
    expect(wrapper.text()).toContain('Formalny');
    expect(wrapper.text()).toContain('Techniczny');
  });

  it('generates unique field id and name for multiple inline editable instances', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const sharedColumn = {
            key: 'name',
            label: 'Nazwa',
            type: 'editable' as const,
            manage: {
              required: true,
              type: 'text' as const,
            },
          };

          const sharedManage = {
            required: true,
            type: 'text' as const,
          };

          return () =>
            h('div', [
              h(EditableInline, {
                key: 'first',
                column: sharedColumn,
                manage: sharedManage,
                value: 'Alfa',
              }),
              h(EditableInline, {
                key: 'second',
                column: sharedColumn,
                manage: sharedManage,
                value: 'Beta',
              }),
            ]);
        },
      }),
      {
        global: getGlobal(),
      },
    );

    await vi.dynamicImportSettled();
    await flushPromises();

    const inputs = wrapper.findAll('input[data-type="input"]');
    expect(inputs.length).toBe(2);

    const firstInput = inputs[0]!;
    const secondInput = inputs[1]!;

    expect(firstInput.attributes('id')).toBeDefined();
    expect(secondInput.attributes('id')).toBeDefined();
    expect(firstInput.attributes('id')).not.toBe(secondInput.attributes('id'));
    expect(firstInput.attributes('name')).toBe(firstInput.attributes('id'));
    expect(secondInput.attributes('name')).toBe(secondInput.attributes('id'));
  });
});
