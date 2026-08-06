import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./EditableInline.vue', async () => {
  const { defineComponent, h } = await import('vue');
  const component = defineComponent({
    name: 'EditableInline',
    props: {
      column: {
        type: Object,
        required: true,
      },
      manage: {
        type: Object,
        default: undefined,
      },
      value: {
        type: [String, Number],
        default: undefined,
      },
    },
    emits: ['on:update'],
    setup(props, { emit }) {
      return () =>
        h('div', { 'data-testid': 'editable-inline' }, [
          h('input', {
            'data-type': 'select',
            value: props.value,
          }),
          ...(
            ((props.manage as { options?: Array<{ label: string; value: string }> } | undefined)
              ?.options ?? []) as Array<{ label: string; value: string }>
          ).map((option) =>
            h(
              'button',
              {
                type: 'button',
                role: 'option',
                onMousedown: (event: Event) => event.preventDefault(),
                onClick: () =>
                  emit(
                    'on:update',
                    { [(props.column as { key: string }).key]: option.label },
                    props.column,
                  ),
              },
              option.label,
            ),
          ),
        ]);
    },
  });

  return {
    __esModule: true,
    __isKeepAlive: false,
    __isSuspense: false,
    __isTeleport: false,
    default: component,
  };
});

import TableBodyColumn from './TableBodyColumn.vue';

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
      InfoTooltip: true,
      PopoverOverlayer: PopoverOverlayerStub,
      SvgIcon: true,
    },
  };
}

describe('TableBodyColumn.vue', () => {
  const inlineSelectColumn = {
    inline: true,
    key: 'category',
    label: 'Kategoria',
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
    type: 'editable' as const,
    width: 240,
  };

  it('renders inline select field directly for editable inline select column', async () => {
    const wrapper = mount(TableBodyColumn, {
      props: {
        column: inlineSelectColumn,
        dataTestId: 'table-list-inline-select',
        record: {
          category: 'Formalny',
          id: '1',
        },
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.find('input[data-type="select"]').exists()).toBe(true);
    expect(wrapper.find('button[aria-label="Edytuj kolumne"]').exists()).toBe(false);
  }, 15000);

  it('emits selected option label from inline select field with source column', async () => {
    const wrapper = mount(TableBodyColumn, {
      props: {
        column: inlineSelectColumn,
        dataTestId: 'table-list-inline-select',
        record: {
          category: 'Formalny',
          id: '1',
        },
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    const options = wrapper.findAll('[role="option"]');

    await options[1]!.trigger('mousedown');
    await options[1]!.trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.emitted('on:update')?.at(-1)).toEqual([
      {
        category: 'Techniczny',
      },
      inlineSelectColumn,
    ]);
  }, 15000);

  it('passes the whole record as second argument to column template', async () => {
    const template = vi.fn((value: string, row?: Record<string, any>) => `${value} (${row?.id})`);
    const wrapper = mount(TableBodyColumn, {
      props: {
        column: {
          key: 'name',
          label: 'Nazwa',
          template,
          type: 'text',
        },
        dataTestId: 'table-list-template',
        record: {
          id: '42',
          name: 'Alfa',
          status: 'Aktywny',
        },
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(template).toHaveBeenCalledWith('Alfa', {
      id: '42',
      name: 'Alfa',
      status: 'Aktywny',
    });
    expect(wrapper.text()).toContain('Alfa (42)');
  }, 15000);

  it.each([
    ['left', 'peaui-table-list__body-cell--border-left'],
    ['right', 'peaui-table-list__body-cell--border-right'],
  ] as const)('applies %s border class on body cell', async (border, expectedClass) => {
    const wrapper = mount(TableBodyColumn, {
      props: {
        column: {
          border,
          key: 'name',
          label: 'Nazwa',
          type: 'text',
        },
        dataTestId: 'table-list-border',
        record: {
          id: '1',
          name: 'Alfa',
        },
      },
      global: getGlobal(),
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.get('td').classes()).toContain(expectedClass);
  });
});
