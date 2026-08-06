import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import TableBodyCheckColumn from './TableBodyCheckColumn.vue';

describe('TableBodyCheckColumn (index.vue)', () => {
  it('scopes radio ids and group name by table instance', () => {
    const Parent = defineComponent({
      components: {
        TableBodyCheckColumn,
      },
      template: `
        <table>
          <tbody>
            <tr>
              <TableBodyCheckColumn id="1" tableScopeId="table-a" />
              <TableBodyCheckColumn id="2" tableScopeId="table-a" />
            </tr>
            <tr>
              <TableBodyCheckColumn id="1" tableScopeId="table-b" />
            </tr>
          </tbody>
        </table>
      `,
    });

    const wrapper = mount(Parent);
    const inputs = wrapper.findAll('input[type="radio"]');

    expect(inputs).toHaveLength(3);

    const ids = inputs.map((input) => input.attributes('id'));
    const names = inputs.map((input) => input.attributes('name'));

    expect(new Set(ids).size).toBe(3);
    expect(names[0]).toBe(names[1]);
    expect(names[0]).not.toBe(names[2]);
    expect(names[0]).toContain('table-a');
    expect(names[2]).toContain('table-b');
  });

  it('emits checked row id on change', async () => {
    const wrapper = mount(TableBodyCheckColumn, {
      props: {
        id: '42',
        row: '42',
        tableScopeId: 'table-a',
      },
    });

    await wrapper.get('input').trigger('change');

    expect(wrapper.emitted('on:check:row')).toEqual([['42']]);
  });
});
