import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TableList from '../data-display/TableList/index.vue';
import TextColumn from '../data-display/TableList/Elements/TextColumn.vue';
import ExpandableColumn from '../data-display/TableList/Elements/ExpandableColumn.vue';
import EditActionColumn from '../data-display/TableList/Elements/EditActionColumn.vue';
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((fn) => fn()));
describe('regressions: Vue table contracts', () => {
  it('saves nested editable values without flattening keys or mutating the source record', async () => {
    const onUpdate = vi.fn();
    const record = { id: 'a', user: { name: 'Ada', role: 'editor' } };
    const wrapper = mount(TableList, {
      props: {
        columns: [
          { key: 'user.name', label: 'Name', type: 'editable', manage: { type: 'text', onUpdate } },
        ],
        records: [record],
      },
    });
    cleanups.push(() => wrapper.unmount());
    await vi.waitFor(() =>
      expect(wrapper.find('[aria-label="Edytuj kolumne"]').exists()).toBe(true),
    );
    await wrapper.get('[aria-label="Edytuj kolumne"]').trigger('click');
    await vi.waitFor(() => expect(wrapper.find('input[data-type="input"]').exists()).toBe(true));
    await wrapper.get('input[data-type="input"]').setValue('Grace');
    expect(record.user.name).toBe('Ada');
    await wrapper.get('[aria-label="Zapisz zmiane w kolumnie"]').trigger('click');
    expect(onUpdate).toHaveBeenCalledExactlyOnceWith({
      id: 'a',
      user: { name: 'Grace', role: 'editor' },
    });
    expect(record.user.name).toBe('Ada');
  });
  it.each([ExpandableColumn, EditActionColumn])(
    'preserves falsy values in interactive cells',
    (component) => {
      for (const value of [0, false, '', null, undefined]) {
        const wrapper = mount(component, {
          props: {
            value: { amount: value },
            deep: 'amount',
            column: { key: 'stats', label: 'Amount' },
          },
        });
        cleanups.push(() => wrapper.unmount());
        expect(wrapper.get('[class$="-value"]').text()).toBe(
          value === '' || value === null || value === undefined ? '-/-' : String(value),
        );
      }
    },
  );
  it.each([0, false, '', null, undefined])('distinguishes missing values from %s', (value) => {
    const wrapper = mount(TextColumn, {
      props: {
        value: { amount: value },
        deep: 'amount',
        column: { key: 'stats', label: 'Amount' },
      },
    });
    cleanups.push(() => wrapper.unmount());
    expect(wrapper.get('.peaui-table-list__text-value').text()).toBe(
      value === '' || value === null || value === undefined ? '-/-' : String(value),
    );
  });
  it('assigns a unique default identifier to each table', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(TableList, { columns: [], records: [{ id: 'a' }] }),
            h(TableList, { columns: [], records: [{ id: 'b' }] }),
          ]),
      }),
    );
    cleanups.push(() => wrapper.unmount());
    await flushPromises();
    const tables = wrapper.findAll('table');
    expect(tables[0]!.attributes('id')).toBeTruthy();
    expect(tables[0]!.attributes('id')).not.toBe(tables[1]!.attributes('id'));
  });
});
