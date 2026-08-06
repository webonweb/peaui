import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const FormCheckboxStub = defineComponent({
  name: 'FormCheckbox',
  props: {
    ariaLabel: { type: String, required: false },
    dataTestId: { type: String, required: false },
    id: { type: String, required: false },
    name: { type: String, required: false },
    value: { type: Boolean, required: false },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'aria-label': props.ariaLabel,
        'data-testid': props.dataTestId,
        checked: props.value,
        id: props.id,
        name: props.name,
        type: 'checkbox',
        onChange: () => emit('update:value', !props.value),
      });
  },
});

import TableBodySelectColumn from './TableBodySelectColumn.vue';

describe('TableBodySelectColumn (index.vue)', () => {
  it('scopes checkbox ids and names by table instance', () => {
    const Parent = defineComponent({
      components: {
        TableBodySelectColumn,
      },
      template: `
        <table>
          <tbody>
            <tr>
              <TableBodySelectColumn id="1" :selectedRows="[]" tableScopeId="table-a" />
              <TableBodySelectColumn id="2" :selectedRows="[]" tableScopeId="table-a" />
            </tr>
            <tr>
              <TableBodySelectColumn id="1" :selectedRows="[]" tableScopeId="table-b" />
            </tr>
          </tbody>
        </table>
      `,
    });

    const wrapper = mount(Parent, {
      global: {
        stubs: {
          FormCheckbox: FormCheckboxStub,
        },
      },
    });

    const inputs = wrapper.findAll('input[type="checkbox"]');

    expect(inputs).toHaveLength(3);

    const ids = inputs.map((input) => input.attributes('id'));
    const names = inputs.map((input) => input.attributes('name'));

    expect(new Set(ids).size).toBe(3);
    expect(new Set(names).size).toBe(3);
    expect(names[0]).toContain('table-a');
    expect(names[2]).toContain('table-b');
  });

  it('emits toggled selected rows on checkbox update', async () => {
    const wrapper = mount(TableBodySelectColumn, {
      props: {
        id: '42',
        selectedRows: [],
        tableScopeId: 'table-a',
      },
      global: {
        stubs: {
          FormCheckbox: FormCheckboxStub,
        },
      },
    });

    await wrapper.get('input').trigger('change');

    expect(wrapper.emitted('on:select:row')).toEqual([[['42']]]);
  });
});
