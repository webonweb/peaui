/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TableList from '../data-display/TableList';
import type { TableColumn } from '../data-display/TableList/table.types';
import Avatar from '../data-display/Avatar';
import AvatarGroup from '../data-display/AvatarGroup';
import NotificationCenter from '../feedback/NotificationCenter';
import CardCarousel from '../data-display/CardCarousel';
afterEach(cleanup);
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
it('V-D01 retains the edited identity and submits its current index after reorder', () => {
  const onSubmit = vi.fn();
  const props = {
    records: rows,
    columns,
    editable: true,
    canCreate: false,
    canSelectRows: false,
    onSubmit,
  };
  const { container, rerender } = render(<TableList {...props} />);
  fireEvent.click(screen.getAllByRole('button', { name: /^Edit:/ })[0]!);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Alice edited' } });
  rerender(<TableList {...props} records={[rows[1]!, rows[0]!]} />);
  expect(container.querySelectorAll('tbody tr')[1]!.querySelector('input')).toHaveValue(
    'Alice edited',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
  expect(onSubmit).toHaveBeenCalledWith({ id: 1, name: 'Alice edited' });
  expect(rows[0]!.name).toBe('Alice');
});
it('V-D01 discards the editor when its record is removed', () => {
  const onSubmit = vi.fn();
  const props = {
    records: rows,
    columns,
    editable: true,
    canCreate: false,
    canSelectRows: false,
    onSubmit,
  };
  const { rerender } = render(<TableList {...props} />);
  fireEvent.click(screen.getAllByRole('button', { name: /^Edit:/ })[0]!);
  rerender(<TableList {...props} records={[rows[1]!]} />);
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});
it.each(['duplicate', 'page'] as const)(
  'V-D01 cancels editing on %s instead of reusing a draft',
  (change) => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const props = {
      records: rows,
      columns,
      editable: true,
      canCreate: false,
      canSelectRows: false,
      paginate: true,
      rowsPerPage: 1,
      page: 1,
      onSubmit,
      onCancel,
    };
    const { rerender } = render(<TableList {...props} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Edit:/ })[0]!);
    rerender(
      <TableList
        {...props}
        {...(change === 'duplicate'
          ? { records: [rows[0]!, { ...rows[1]!, id: 'a' }] }
          : { page: 2 })}
      />,
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  },
);
it('V-D02/03 supplies default bulk selection with normalized numeric IDs and partial state', () => {
  const onSelectRow = vi.fn();
  const props = {
    records: [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
    ],
    columns: columns.slice(0, 1),
    selectedRows: ['1'],
    onSelectRow,
  };
  const { container, rerender } = render(<TableList {...props} />);
  expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  const bulk = container.querySelector('thead input') as HTMLInputElement;
  expect(bulk.indeterminate).toBe(true);
  fireEvent.click(bulk);
  expect(onSelectRow).toHaveBeenLastCalledWith(['1', '2']);
  rerender(<TableList {...props} selectedRows={['1', '2']} />);
  expect(
    screen.getAllByRole('checkbox').every((input) => (input as HTMLInputElement).checked),
  ).toBe(true);
  fireEvent.click(bulk);
  expect(onSelectRow).toHaveBeenLastCalledWith([]);
});
it('V-D05 names an interactive avatar with an empty image alt', () => {
  render(<Avatar name="Alice Smith" alt="" interactive />);
  expect(screen.getByRole('button')).toHaveAccessibleName('Alice Smith');
});
it('V-D07 gives colliding type slugs distinct heading relationships', () => {
  render(
    <NotificationCenter
      groupBy="type"
      items={[
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
      ]}
    />,
  );
  expect(screen.getAllByRole('group')).toEqual([
    screen.getByRole('group', { name: 'Account alerts' }),
    screen.getByRole('group', { name: 'Shipping alerts' }),
  ]);
});
it('V-D08 focuses a remaining popup action after removal without stealing outside focus', () => {
  const items = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' },
    { id: 'c', name: 'Carol' },
  ];
  const { container, rerender } = render(
    <AvatarGroup items={items} maxVisible={1} overflowMode="popover" />,
  );
  fireEvent.click(container.querySelector('.peaui-avatar-group__overflow-button')!);
  expect(screen.getByRole('button', { name: 'Bob' })).toHaveFocus();
  rerender(<AvatarGroup items={[items[0]!, items[2]!]} maxVisible={1} overflowMode="popover" />);
  expect(screen.getByRole('button', { name: 'Carol' })).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(container.querySelector('.peaui-avatar-group__overflow-button')!);
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  rerender(<AvatarGroup items={items} maxVisible={1} overflowMode="popover" />);
  expect(outside).toHaveFocus();
  outside.remove();
});
it('V-D11 replaces keyed slides and retains surviving node identity', () => {
  const cards = (keys: string[]) => keys.map((key) => <button key={key}>{key}</button>);
  const { container, rerender } = render(
    <CardCarousel defaultVisibleSlides={1}>{cards(['A', 'B', 'C'])}</CardCarousel>,
  );
  const retained = screen.getByRole('button', { name: 'A' });
  rerender(<CardCarousel defaultVisibleSlides={1}>{cards(['X', 'A'])}</CardCarousel>);
  expect(
    [...container.querySelectorAll('.peaui-card-carousel__slide')].map(
      (slide) => slide.textContent,
    ),
  ).toEqual(['X', 'A']);
  expect(screen.getByRole('button', { name: 'A' })).toBe(retained);
});
