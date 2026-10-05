import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import TableList from './index.vue';
import type { TableColumn } from './table.types';

it('keeps plain text cells compact while preserving mutable rows and arbitrary formatters', async () => {
  let suffix = '';
  const template = vi.fn((value: unknown) => String(value) + suffix);
  const records = Array.from({ length: 50 }, (_, id) => ({ id: String(id), name: `Person ${id}` }));
  const columns: TableColumn[] = [{ key: 'name', label: 'Name', type: 'text', template }];
  const wrapper = mount(TableList, { props: { columns, records, canSelectRows: false } });
  expect(wrapper.findAll('tbody td')).toHaveLength(50);
  expect(wrapper.get('tbody td').element.querySelectorAll('*').length).toBeLessThanOrEqual(1);
  const unchangedCell = wrapper.findAll('tbody td')[1]!.element;
  await wrapper.setProps({
    records: records.map((record, index) =>
      index === 0 ? { ...record, name: 'Updated' } : record,
    ),
  });
  expect(wrapper.get('tbody td').text()).toBe('Updated');
  expect(wrapper.findAll('tbody td')[1]?.text()).toBe('Person 1');
  expect(wrapper.findAll('tbody td')[1]!.element).toBe(unchangedCell);
  records[1]!.name = 'Mutated';
  await wrapper.setProps({ records: [...records] });
  expect(wrapper.findAll('tbody td')[1]?.text()).toBe('Mutated');
  suffix = ' formatted';
  await wrapper.setProps({ records: [...records] });
  expect(wrapper.findAll('tbody td')[1]?.text()).toBe('Mutated formatted');
  columns[0]!.template = (value) => String(value).toUpperCase();
  await wrapper.setProps({ columns: [...columns] });
  expect(wrapper.findAll('tbody td')[1]?.text()).toBe('MUTATED');
  await wrapper.get('tbody td').trigger('dblclick');
  expect(wrapper.emitted('on:dblclick')).toHaveLength(1);
  wrapper.unmount();
});

it('refreshes nested mutable values after the records array changes', async () => {
  const records = [{ id: 'a', person: { name: 'Ada' } }];
  const wrapper = mount(TableList, {
    props: {
      records,
      columns: [{ key: 'person.name', label: 'Name', type: 'text' }],
      canSelectRows: false,
    },
  });
  expect(wrapper.get('tbody td').text()).toBe('Ada');
  records[0]!.person.name = 'Grace';
  await wrapper.setProps({ records: [...records] });
  expect(wrapper.get('tbody td').text()).toBe('Grace');
  wrapper.unmount();
});
