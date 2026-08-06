import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TableHeadSelectColumn from './TableHeadSelectColumn.vue';

const FormCheckboxStub = defineComponent({
  name: 'FormCheckbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    disabled: Boolean,
    value: Boolean,
    dataTestId: String,
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        id: props.id,
        name: props.name,
        type: 'checkbox',
        disabled: props.disabled,
        checked: props.value,
        'data-testid': props.dataTestId,
        onChange: () => emit('update:value'),
      });
  },
});

function factory(props?: Partial<InstanceType<typeof TableHeadSelectColumn>['$props']>) {
  return mount(TableHeadSelectColumn, {
    props: {
      isAllSelected: false,
      dataTestId: 'head-select',
      ...props,
    } as never,
    global: {
      stubs: {
        FormCheckbox: FormCheckboxStub,
      },
    },
  });
}

describe('TableHeadSelectColumn.vue', () => {
  it('passes unique checkbox ids for multiple instances', () => {
    const HostComponent = defineComponent({
      components: { TableHeadSelectColumn },
      template: `
        <table>
          <thead>
            <tr>
              <TableHeadSelectColumn dataTestId="first" :isAllSelected="false" />
              <TableHeadSelectColumn dataTestId="second" :isAllSelected="false" />
            </tr>
          </thead>
        </table>
      `,
    });

    const wrapper = mount(HostComponent, {
      global: {
        stubs: {
          FormCheckbox: FormCheckboxStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="first-checkbox"]').attributes('id')).not.toBe(
      wrapper.get('[data-testid="second-checkbox"]').attributes('id'),
    );
  });

  it('emits row toggle event when checkbox state changes', async () => {
    const wrapper = factory({ isAllSelected: true });

    await wrapper.get('[data-testid="head-select-checkbox"]').trigger('change');

    expect(wrapper.emitted('on:toggle:select:row')).toEqual([[]]);
  });
});
