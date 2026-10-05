import { flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import TableList from '../data-display/TableList/index.wc';
import Avatar from '../data-display/Avatar/index.wc';
import AvatarGroup from '../data-display/AvatarGroup/index.wc';
import DisclosurePanel from '../data-display/DisclosurePanel/index.wc';
import NotificationCenter from '../feedback/NotificationCenter/index.wc';
import TagChip from '../data-display/TagChip/index.wc';
import CardCarousel from '../data-display/CardCarousel/index.wc';
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
const rows = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
];
const columns = [
  { key: 'name', label: 'Name', manage: { type: 'text' } },
  {
    key: 'actions',
    label: 'Actions',
    resolve: () => [{ key: 'edit', label: 'Edit', simple: true }],
  },
];
const settle = async () => {
  await nextTick();
  await flushPromises();
  await nextTick();
};
it('V-D01 retains editor identity and current submit index after reorder', async () => {
  const table = new TableList();
  Object.assign(table, {
    records: rows,
    columns,
    editable: true,
    canCreate: false,
    canSelectRows: false,
  });
  const submit = vi.fn();
  table.addEventListener('on:submit', submit);
  document.body.append(table);
  await settle();
  table.querySelector<HTMLButtonElement>('tbody tr button')!.click();
  await vi.waitFor(() => expect(table.querySelector('input[type=text]')).not.toBeNull());
  const input = table.querySelector<HTMLInputElement>('input[type=text]')!;
  input.value = 'Alice edited';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await settle();
  Object.assign(table, { records: [rows[1], rows[0]] });
  await settle();
  expect(table.querySelector<HTMLInputElement>('tbody tr[data-id="a"] input')?.value).toBe(
    'Alice edited',
  );
  table.querySelector<HTMLButtonElement>('[aria-label="Zapisz edytowany rekord"]')!.click();
  await settle();
  expect((submit.mock.calls[0]![0] as CustomEvent).detail).toEqual({ id: 1, name: 'Alice edited' });
});
it('V-D01 cancels removal of the edited record', async () => {
  const table = new TableList();
  Object.assign(table, {
    records: rows,
    columns,
    editable: true,
    canCreate: false,
    canSelectRows: false,
  });
  document.body.append(table);
  await settle();
  table.querySelector<HTMLButtonElement>('tbody tr button')!.click();
  await settle();
  Object.assign(table, { records: [rows[1]] });
  await settle();
  expect(table.querySelector('input[type=text]')).toBeNull();
});
it.each(['duplicate', 'page'] as const)(
  'V-D01 cancels editing on %s instead of reusing a draft',
  async (change) => {
    const table = new TableList();
    Object.assign(table, {
      records: rows,
      columns,
      editable: true,
      canCreate: false,
      canSelectRows: false,
      paginate: true,
      rowsPerPage: 1,
      page: 1,
    });
    const submit = vi.fn();
    const cancel = vi.fn();
    table.addEventListener('on:submit', submit);
    table.addEventListener('on:cancel', cancel);
    document.body.append(table);
    await settle();
    table.querySelector<HTMLButtonElement>('tbody tr button')!.click();
    await settle();
    Object.assign(
      table,
      change === 'duplicate' ? { records: [rows[0]!, { ...rows[1]!, id: 'a' }] } : { page: 2 },
    );
    await settle();
    expect(table.querySelector('input[type=text]')).toBeNull();
    expect(cancel).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  },
);
it('V-D02 uses string IDs for bulk selection and controlled check state', async () => {
  const table = new TableList();
  Object.assign(table, {
    records: [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ],
    columns: columns.slice(0, 1),
    selectedRows: ['1'],
  });
  const selected = vi.fn();
  table.addEventListener('on:select:row', selected);
  document.body.append(table);
  await settle();
  table.querySelector<HTMLInputElement>('thead input[type=checkbox]')!.click();
  await settle();
  expect((selected.mock.calls[0]![0] as CustomEvent).detail).toEqual(['1', '2']);
  Object.assign(table, { selectedRows: ['1', '2'] });
  await settle();
  expect(
    [...table.querySelectorAll<HTMLInputElement>('input[type=checkbox]')].every(
      (input) => input.checked,
    ),
  ).toBe(true);
});
it('V-D05 names an interactive avatar despite empty image alt', async () => {
  const avatar = new Avatar();
  Object.assign(avatar, { name: 'Alice Smith', alt: '', interactive: true });
  document.body.append(avatar);
  await settle();
  expect(computeAccessibleName(avatar.querySelector('button')!)).toBe('Alice Smith');
});
it('V-D06 updates accessible title when a named native slot is added and removed', async () => {
  const panel = new DisclosurePanel();
  Object.assign(panel, { open: true });
  document.body.append(panel);
  await settle();
  const title = document.createElement('span');
  title.slot = 'title';
  title.textContent = 'Account details';
  panel.append(title);
  await settle();
  expect(computeAccessibleName(panel.querySelector('summary')!)).toBe('Account details');
  title.remove();
  await settle();
  expect(computeAccessibleName(panel.querySelector('summary')!)).toBe('Sekcja rozwijana');
});
it('V-D07 gives each type group its own accessible name', async () => {
  const center = new NotificationCenter();
  Object.assign(center, {
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
  });
  document.body.append(center);
  await settle();
  expect(
    [...center.querySelectorAll('[role=group]')].map((group) => computeAccessibleName(group)),
  ).toEqual(['Account alerts', 'Shipping alerts']);
});
it('V-D08 retains usable keyboard focus when the focused popup item disappears', async () => {
  const items = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' },
    { id: 'c', name: 'Carol' },
  ];
  const group = new AvatarGroup();
  Object.assign(group, { items, maxVisible: 1, overflowMode: 'popover' });
  document.body.append(group);
  await settle();
  group.querySelector<HTMLButtonElement>('.peaui-avatar-group__overflow-button')!.click();
  await settle();
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Bob');
  Object.assign(group, { items: [items[0], items[2]] });
  await settle();
  expect(document.activeElement?.getAttribute('aria-label')).toBe('Carol');
  document.activeElement!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  );
  await settle();
  expect(
    group.querySelector('.peaui-avatar-group__overflow-button')?.getAttribute('aria-expanded'),
  ).toBe('false');
});
it('V-D10 distinguishes managed aria-pressed before connection and after reconnection', () => {
  const chip = new TagChip();
  chip.label = 'Active';
  chip.active = false;
  chip.addEventListener('click', () => undefined);
  document.body.append(chip);
  chip.active = true;
  expect(chip.getAttribute('aria-pressed')).toBe('true');
  chip.remove();
  document.body.append(chip);
  chip.active = false;
  expect(chip.getAttribute('aria-pressed')).toBe('false');
  chip.setAttribute('aria-pressed', 'mixed');
  chip.active = true;
  expect(chip.getAttribute('aria-pressed')).toBe('mixed');
});
it('V-D11 removes old native slides without resurrecting them and preserves surviving listeners', async () => {
  const carousel = new CardCarousel();
  carousel.defaultVisibleSlides = 1;
  const first = document.createElement('button');
  first.textContent = 'A';
  const second = document.createElement('button');
  second.textContent = 'B';
  const clicked = vi.fn();
  first.addEventListener('click', clicked);
  carousel.append(first, second);
  document.body.append(carousel);
  await settle();
  second.remove();
  const added = document.createElement('button');
  added.textContent = 'X';
  carousel.append(added);
  await settle();
  expect(
    [...carousel.querySelectorAll('.peaui-card-carousel__slide')].map((slide) => slide.textContent),
  ).toEqual(['A', 'X']);
  expect(carousel.contains(second)).toBe(false);
  expect(carousel.querySelector('button')).toBe(first);
  first.click();
  expect(clicked).toHaveBeenCalledOnce();
  first.remove();
  added.remove();
  await settle();
  expect(carousel.querySelectorAll('.peaui-card-carousel__slide')).toHaveLength(0);
});
