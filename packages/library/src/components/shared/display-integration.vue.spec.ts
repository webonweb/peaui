import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import TableList from '../data-display/TableList/index.vue';
import type { TableColumn } from '../data-display/TableList/table.types';
import Avatar from '../data-display/Avatar/index.vue';
import AvatarGroup from '../data-display/AvatarGroup/index.vue';
import DisclosurePanel from '../data-display/DisclosurePanel/index.vue';
import NotificationCenter from '../feedback/NotificationCenter/index.vue';
import CardCarousel from '../data-display/CardCarousel/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
const rows = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
];
const columns: TableColumn[] = [
  { key: 'name', label: 'Name', manage: { type: 'text' } },
  {
    key: 'actions',
    label: 'Actions',
    resolve: () => [{ key: 'edit', label: 'Edit', simple: true }],
  },
];

it('V-D01 keeps the edited record after reorder and emits its current compatible index', async () => {
  const wrapper = mount(TableList, {
    props: { records: rows, columns, editable: true, canCreate: false, canSelectRows: false },
  });
  cleanups.push(() => wrapper.unmount());
  await vi.waitFor(() => expect(wrapper.find('tbody tr button').exists()).toBe(true));
  await wrapper.get('tbody tr button').trigger('click');
  await vi.waitFor(() => expect(wrapper.find('input[type=text]').exists()).toBe(true));
  await wrapper.get('input[type=text]').setValue('Alice edited');
  await wrapper.setProps({ records: [rows[1]!, rows[0]!] });
  expect(wrapper.get('tbody tr[data-id="a"] input').element).toHaveProperty(
    'value',
    'Alice edited',
  );
  await wrapper.get('[aria-label="Zapisz edytowany rekord"]').trigger('click');
  expect(wrapper.emitted('on:submit')?.at(-1)?.[0]).toEqual({ id: 1, name: 'Alice edited' });
  expect(rows[0]!.name).toBe('Alice');
});
it('V-D01 cancels editing if its record is removed instead of submitting another row', async () => {
  const wrapper = mount(TableList, {
    props: { records: rows, columns, editable: true, canCreate: false, canSelectRows: false },
  });
  cleanups.push(() => wrapper.unmount());
  await wrapper.get('tbody tr button').trigger('click');
  await flushPromises();
  await wrapper.setProps({ records: [rows[1]!] });
  expect(wrapper.find('input[type=text]').exists()).toBe(false);
  expect(wrapper.emitted('on:submit')).toBeUndefined();
});
it.each(['duplicate', 'page'] as const)(
  'V-D01 cancels editing on %s instead of reusing a draft',
  async (change) => {
    const wrapper = mount(TableList, {
      props: {
        records: rows,
        columns,
        editable: true,
        canCreate: false,
        canSelectRows: false,
        paginate: true,
        rowsPerPage: 1,
        page: 1,
      },
    });
    cleanups.push(() => wrapper.unmount());
    await wrapper.get('tbody tr button').trigger('click');
    await flushPromises();
    await wrapper.setProps(
      change === 'duplicate' ? { records: [rows[0]!, { ...rows[1]!, id: 'a' }] } : { page: 2 },
    );
    expect(wrapper.find('input[type=text]').exists()).toBe(false);
    expect(wrapper.emitted('on:cancel')).toHaveLength(1);
    expect(wrapper.emitted('on:submit')).toBeUndefined();
  },
);
it('V-D02 normalizes bulk numeric keys and reflects the controlled selected rows', async () => {
  const wrapper = mount(TableList, {
    props: {
      records: [
        { id: 1, name: 'One' },
        { id: 2, name: 'Two' },
      ],
      columns: columns.slice(0, 1),
      selectedRows: ['1'],
    },
  });
  cleanups.push(() => wrapper.unmount());
  await wrapper.get('thead input[type=checkbox]').setValue(true);
  expect(wrapper.emitted('on:select:row')?.at(-1)?.[0]).toEqual(['1', '2']);
  await wrapper.setProps({ selectedRows: ['1', '2'] });
  expect(
    wrapper
      .findAll('input[type=checkbox]')
      .every((input) => (input.element as HTMLInputElement).checked),
  ).toBe(true);
  await wrapper.get('thead input[type=checkbox]').setValue(false);
  expect(wrapper.emitted('on:select:row')?.at(-1)?.[0]).toEqual([]);
});
it('V-D05 names an interactive avatar even when its image alt is decorative', () => {
  const wrapper = mount(Avatar, { props: { name: 'Alice Smith', alt: '', interactive: true } });
  cleanups.push(() => wrapper.unmount());
  expect(computeAccessibleName(wrapper.get('button').element)).toBe('Alice Smith');
});
it('V-D06 follows added and removed title slots', async () => {
  const title = ref(false);
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          DisclosurePanel,
          { open: true },
          title.value
            ? { title: () => 'Account details', default: () => 'Body' }
            : { default: () => 'Body' },
        ),
    }),
  );
  cleanups.push(() => wrapper.unmount());
  title.value = true;
  await nextTick();
  expect(computeAccessibleName(wrapper.get('summary').element)).toBe('Account details');
  title.value = false;
  await nextTick();
  expect(computeAccessibleName(wrapper.get('summary').element)).toBe('Sekcja rozwijana');
});
it('V-D07 labels colliding type slugs by their own heading', () => {
  const wrapper = mount(NotificationCenter, {
    attachTo: document.body,
    props: {
      groupBy: 'type',
      items: [
        {
          id: 1,
          title: 'Invoice',
          read: false,
          createdAt: '2026-10-02',
          type: 'account alerts',
          typeLabel: 'Account alerts',
        },
        {
          id: 2,
          title: 'Shipping',
          read: false,
          createdAt: '2026-10-02',
          type: 'account-alerts',
          typeLabel: 'Shipping alerts',
        },
      ],
    },
  });
  cleanups.push(() => wrapper.unmount());
  expect(
    wrapper.findAll('[role=group]').map((group) => computeAccessibleName(group.element)),
  ).toEqual(['Account alerts', 'Shipping alerts']);
});
it('V-D08 repairs focused removal and preserves Escape without stealing outside focus', async () => {
  const items = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' },
    { id: 'c', name: 'Carol' },
  ];
  const wrapper = mount(AvatarGroup, {
    attachTo: document.body,
    props: { items, maxVisible: 1, overflowMode: 'popover' },
  });
  cleanups.push(() => wrapper.unmount());
  await wrapper.get('.peaui-avatar-group__overflow-button').trigger('click');
  await nextTick();
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Bob');
  await wrapper.setProps({ items: [items[0]!, items[2]!] });
  await nextTick();
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Carol');
  await wrapper.get('[aria-label=Carol]').trigger('keydown', { key: 'Escape' });
  await nextTick();
  expect(wrapper.get('.peaui-avatar-group__overflow-button').attributes('aria-expanded')).toBe(
    'false',
  );
  await wrapper.get('.peaui-avatar-group__overflow-button').trigger('click');
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  await wrapper.setProps({ items: [...items] });
  await nextTick();
  expect(document.activeElement).toBe(outside);
});
it('V-D11 renders the current keyed slot children after replacement', async () => {
  const cards = ref(['A', 'B', 'C']);
  const wrapper = mount(
    defineComponent({
      setup: () => () => {
        const children = cards.value.map((key) => h('button', { key }, key));
        return h(CardCarousel, { defaultVisibleSlides: 1 }, { default: () => children });
      },
    }),
  );
  cleanups.push(() => wrapper.unmount());
  const retained = wrapper.get('.peaui-card-carousel__slide button').element;
  cards.value = ['X', 'A'];
  await nextTick();
  await nextTick();
  expect(wrapper.findAll('.peaui-card-carousel__slide').map((slide) => slide.text())).toEqual([
    'X',
    'A',
  ]);
  expect(wrapper.findAll('.peaui-card-carousel__slide button')[1]!.element).toBe(retained);
});
