import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import TableList from '../data-display/TableList/index.vue';
it('renders only one page and preserves selections from other pages', async () => {
  const wrapper = mount(TableList, {
    props: {
      columns: [{ key: 'name', label: 'Name' }],
      records: Array.from({ length: 5000 }, (_, index) => ({
        id: String(index),
        name: `Record ${index}`,
      })),
      paginate: true,
      rowsPerPage: 20,
      selectedRows: ['0'],
    },
  });
  try {
    expect(wrapper.findAll('tbody > tr')).toHaveLength(20);
    await wrapper.get('button[aria-label="Przejdz do kolejnej strony"]').trigger('click');
    expect(wrapper.text()).toContain('Record 20');
    expect(wrapper.text()).not.toContain('Record 0');
    await wrapper.get('tbody input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('on:select:row')?.at(-1)).toEqual([['0', '20']]);
  } finally {
    wrapper.unmount();
  }
});
