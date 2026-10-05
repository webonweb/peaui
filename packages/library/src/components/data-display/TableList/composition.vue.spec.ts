import { flushPromises, mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import TableList from './index.vue';

const { copy } = vi.hoisted(() => ({ copy: vi.fn().mockResolvedValue('api') }));
vi.mock('@/helpers/functions.helper', async (original) => ({
  ...(await original<Record<string, unknown>>()),
  copyToClipboard: copy,
}));
vi.mock('@/helpers/notifications.helper', () => ({ notificationSuccess: vi.fn() }));

it('keeps column visibility in the last data header when there are no record actions', async () => {
  const wrapper = mount(TableList, {
    props: {
      canHideColumns: true,
      canSelectRows: false,
      columns: ['name', 'one', 'two', 'three'].map((key) => ({ key, label: key })),
      records: [{ id: '1', name: 'Ada' }],
    },
  });
  const trigger = wrapper.get('.peaui-table-list__head-actions-popover-trigger');
  expect(trigger.element.closest('th')).toBe(wrapper.get('th:last-child').element);
  expect(wrapper.find('.peaui-table-list__actions-cell').exists()).toBe(false);
  await trigger.trigger('click');
  const options = wrapper.findAll('.peaui-table-list__head-actions-checkbox');
  await options[1]!.setValue(false);
  expect(wrapper.findAll('thead th')).toHaveLength(3);
  expect(wrapper.findAll('tbody td')).toHaveLength(3);
  expect(
    wrapper.findAll('.peaui-table-list__head-actions-checkbox')[2]!.attributes('disabled'),
  ).toBeDefined();
  wrapper.unmount();
});

it('opens and submits the editor from the default empty state while preserving create events', async () => {
  const wrapper = mount(TableList, {
    props: {
      columns: [{ key: 'name', label: 'Name', manage: { type: 'text' } }],
      records: [],
      editable: true,
      canCreate: true,
    },
  });
  await wrapper.get('.peaui-empty-state button').trigger('click');
  expect(wrapper.emitted('on:createRecord')).toHaveLength(1);
  expect(wrapper.find('.peaui-empty-state').exists()).toBe(false);
  await vi.waitFor(() => expect(wrapper.find('input[type="text"]').exists()).toBe(true));
  await wrapper.get('input[type="text"]').setValue('New');
  await wrapper.get('button[aria-label="Zapisz edytowany rekord"]').trigger('click');
  await flushPromises();
  expect(wrapper.emitted('on:submit')?.[0]?.[0]).toMatchObject({ name: 'New' });
  wrapper.unmount();
});

it('copies zero and false while omitting copy controls for empty cells', async () => {
  const wrapper = mount(TableList, {
    props: {
      columns: [{ key: 'value', label: 'Value', canCopy: true }],
      canSelectRows: false,
      records: [0, false, '', null, undefined].map((value, id) => ({ id: String(id), value })),
    },
  });
  const controls = wrapper.findAll('.peaui-table-list__copy-button');
  expect(controls).toHaveLength(2);
  await controls[0]!.trigger('click');
  await controls[1]!.trigger('click');
  expect(copy.mock.calls).toEqual([['0'], ['false']]);
  wrapper.unmount();
});
