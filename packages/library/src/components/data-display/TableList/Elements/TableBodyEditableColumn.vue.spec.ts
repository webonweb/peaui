import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const multiselectStubState = {
  mountCount: 0,
  optionsRefs: [] as unknown[][],
  withSelectAllValues: [] as boolean[],
  reset() {
    this.mountCount = 0;
    this.optionsRefs = [];
    this.withSelectAllValues = [];
  },
};

vi.mock('@/components/form/FormMultiSelect/index.vue', async () => {
  const { defineComponent, h, onMounted, ref, watch } = await import('vue');
  const component = defineComponent({
    name: 'FormMultiSelect',
    props: {
      dataTestId: {
        type: String,
        default: undefined,
      },
      id: {
        type: String,
        default: undefined,
      },
      name: {
        type: String,
        default: undefined,
      },
      options: {
        type: Array,
        default: () => [],
      },
      withSelectAll: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(props, { emit, slots }) {
      const isOpen = ref(false);

      onMounted(() => {
        multiselectStubState.mountCount += 1;
      });

      watch(
        () => props.options,
        (options) => {
          multiselectStubState.optionsRefs.push(options as unknown[]);
        },
        { immediate: true },
      );

      watch(
        () => props.withSelectAll,
        (value) => {
          multiselectStubState.withSelectAllValues.push(value);
        },
        { immediate: true },
      );

      return () =>
        h(
          'div',
          {
            'data-field-id': props.id,
            'data-field-name': props.name,
          },
          [
            h(
              'button',
              {
                type: 'button',
                'data-testid': props.dataTestId
                  ? `${props.dataTestId}-element`
                  : 'multiselect-element',
                'aria-expanded': String(isOpen.value),
                onClick: () => {
                  isOpen.value = true;
                },
              },
              'open',
            ),
            isOpen.value
              ? h(
                  'button',
                  {
                    type: 'button',
                    'data-testid': props.dataTestId
                      ? `${props.dataTestId}-select`
                      : 'multiselect-select',
                    onClick: () => emit('update:value', ['Pomorskie']),
                  },
                  'select',
                )
              : null,
            slots.error?.(),
          ],
        );
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

vi.mock('@/components/form/FormInput/index.vue', async () => {
  const { defineComponent, h } = await import('vue');
  const component = defineComponent({
    name: 'FormInput',
    props: {
      dataTestId: {
        type: String,
        default: undefined,
      },
      id: {
        type: String,
        default: undefined,
      },
      name: {
        type: String,
        default: undefined,
      },
      value: {
        type: String,
        default: undefined,
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('input', {
          'data-testid': props.dataTestId,
          'data-type': 'input',
          id: props.id,
          name: props.name,
          value: props.value,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        });
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

vi.mock('@/components/form/FormSelect/index.vue', async () => {
  const { defineComponent, h } = await import('vue');
  const component = defineComponent({
    name: 'FormSelect',
    props: {
      dataTestId: {
        type: String,
        default: undefined,
      },
      id: {
        type: String,
        default: undefined,
      },
      name: {
        type: String,
        default: undefined,
      },
      options: {
        type: Array,
        default: () => [],
      },
      value: {
        type: [String, Number],
        default: undefined,
      },
    },
    emits: ['update:value'],
    setup(props, { emit, slots }) {
      return () =>
        h('div', { 'data-testid': props.dataTestId ? `${props.dataTestId}-element` : 'select' }, [
          h('input', {
            'data-options': JSON.stringify(props.options),
            'data-type': 'select',
            id: props.id,
            name: props.name,
            value: props.value,
            onInput: (event: Event) =>
              emit('update:value', (event.target as HTMLInputElement).value),
          }),
          slots.error?.(),
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

import TableBodyEditableColumn from './TableBodyEditableColumn.vue';

const createOptions = () => [
  { label: 'Pomorskie', value: 'pomorskie' },
  { label: 'Mazowieckie', value: 'mazowieckie' },
];

function mountComponent(
  props: Partial<InstanceType<typeof TableBodyEditableColumn>['$props']> = {},
) {
  return mount(TableBodyEditableColumn, {
    props: {
      columns: [
        {
          key: 'regions',
          label: 'Regiony',
          manage: {
            options: createOptions(),
            required: true,
            type: 'multiselect',
          },
        },
      ],
      formValues: {
        id: 'create',
        regions: [],
      },
      dataTestId: 'table-editable',
      ...props,
    },
  });
}

describe('TableBodyEditableColumn.vue', () => {
  beforeEach(() => {
    multiselectStubState.reset();
  });

  it('keeps multiselect mounted when validation error is cleared after selection', async () => {
    const wrapper = mountComponent({
      errors: {
        regions: 'Pole jest wymagane',
      },
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    const element = wrapper.get('[data-testid="table-editable-field-regions-element"]');
    await element.trigger('click');

    expect(element.attributes('aria-expanded')).toBe('true');
    expect(multiselectStubState.mountCount).toBe(1);

    await wrapper.get('[data-testid="table-editable-field-regions-select"]').trigger('click');
    expect(wrapper.emitted('on:update')?.[0]?.[0]).toEqual(['Pomorskie']);

    await wrapper.setProps({
      errors: {},
      formValues: {
        id: 'create',
        regions: ['Pomorskie'],
      },
    });
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(multiselectStubState.mountCount).toBe(1);
    expect(
      wrapper
        .get('[data-testid="table-editable-field-regions-element"]')
        .attributes('aria-expanded'),
    ).toBe('true');
  });

  it('reuses static multiselect options when form values change', async () => {
    const options = createOptions();
    const wrapper = mountComponent({
      columns: [
        {
          key: 'regions',
          label: 'Regiony',
          manage: {
            options,
            required: true,
            type: 'multiselect',
          },
        },
      ],
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(multiselectStubState.mountCount).toBe(1);
    expect(multiselectStubState.optionsRefs).toHaveLength(1);

    await wrapper.setProps({
      formValues: {
        id: 'create',
        regions: ['Pomorskie'],
      },
    });
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(multiselectStubState.mountCount).toBe(1);
    expect(multiselectStubState.optionsRefs).toHaveLength(1);
  });

  it('forwards withSelectAll config to multiselect field', async () => {
    mountComponent({
      columns: [
        {
          key: 'regions',
          label: 'Regiony',
          manage: {
            options: createOptions(),
            required: true,
            type: 'multiselect',
            withSelectAll: true,
          },
        },
      ],
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(multiselectStubState.withSelectAllValues).toContain(true);
  });

  it('resolves select options from function with current editable row values', async () => {
    const options = vi.fn((currentRecord: Record<string, unknown>) =>
      Number(currentRecord.limit) >= 10
        ? [
            { label: 'Formalny', value: 'formalny' },
            { label: 'Techniczny', value: 'techniczny' },
          ]
        : [{ label: 'Kontrola', value: 'kontrola' }],
    );
    const wrapper = mountComponent({
      columns: [
        {
          key: 'category',
          label: 'Kategoria',
          manage: {
            options,
            required: true,
            type: 'select',
          },
        },
      ],
      formValues: {
        category: 'formalny',
        id: 'create',
        limit: 12,
      },
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    expect(options).toHaveBeenCalledWith({
      category: 'formalny',
      id: 'create',
      limit: 12,
    });

    await wrapper.setProps({
      formValues: {
        category: 'kontrola',
        id: 'create',
        limit: 6,
      },
    });
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(options).toHaveBeenCalledWith({
      category: 'kontrola',
      id: 'create',
      limit: 6,
    });
  });

  it('applies sticky styles for locked editable columns', async () => {
    const wrapper = mountComponent({
      lockedColumns: {
        regions: {
          offset: 84,
          side: 'right',
        },
      },
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    const cell = wrapper.get('td');

    expect(cell.classes()).toContain('peaui-table-list__editable-cell--locked');
    expect(cell.classes()).toContain('peaui-table-list__editable-cell--locked-right');
    expect(cell.attributes('style')).toContain('right: 84px;');
  });

  it('applies semantic border classes for editable cells', async () => {
    const wrapper = mountComponent({
      columns: [
        {
          border: 'left',
          key: 'name',
          label: 'Nazwa',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          border: 'right',
          key: 'regions',
          label: 'Regiony',
          manage: {
            options: createOptions(),
            required: true,
            type: 'multiselect',
          },
        },
      ],
      formValues: {
        id: 'create',
        name: 'Alfa',
        regions: [],
      },
    });

    await vi.dynamicImportSettled();
    await flushPromises();

    const cells = wrapper.findAll('td');

    expect(cells[0]?.classes()).toContain('peaui-table-list__editable-cell--border-left');
    expect(cells[1]?.classes()).toContain('peaui-table-list__editable-cell--border-right');
  }, 15000);

  it('generates unique field id and name for each component instance', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const sharedColumns = [
            {
              key: 'name',
              label: 'Nazwa',
              manage: {
                required: true,
                type: 'text' as const,
              },
            },
          ];

          return () =>
            h('table', [
              h('tbody', [
                h('tr', [
                  h(TableBodyEditableColumn, {
                    key: 'first',
                    columns: sharedColumns,
                    formValues: {
                      id: 'create',
                      name: 'Alfa',
                    },
                    dataTestId: 'table-editable-first',
                  }),
                ]),
                h('tr', [
                  h(TableBodyEditableColumn, {
                    key: 'second',
                    columns: sharedColumns,
                    formValues: {
                      id: 'create',
                      name: 'Beta',
                    },
                    dataTestId: 'table-editable-second',
                  }),
                ]),
              ]),
            ]);
        },
      }),
    );

    await vi.dynamicImportSettled();
    await flushPromises();

    const fields = wrapper.findAll('input[data-type="input"]');

    expect(fields).toHaveLength(2);
    expect(fields[0]!.attributes('id')).not.toBe(fields[1]!.attributes('id'));
    expect(fields[0]!.attributes('name')).not.toBe(fields[1]!.attributes('name'));
  }, 15000);
});
