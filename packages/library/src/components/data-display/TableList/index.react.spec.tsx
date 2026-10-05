/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TableList from './index';

afterEach(cleanup);
const records = [{ id: 'record-1', user: { name: 'Ada' }, count: 3 }];
const columns: import('./table.types').TableColumn[] = [
  { key: 'user.name', label: 'Name', manage: { type: 'text', required: true } },
  { key: 'count', label: 'Count', manage: { type: 'number', integer: true, step: 0.1 } },
  { key: 'actions', label: 'Actions', resolve: () => [{ key: 'edit', label: 'Edit' }] },
];

it('formats calendar dates consistently with Vue regardless of the server or browser locale', () => {
  const localeDate = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('04/08/2026');
  try {
    const { container } = render(
      <TableList
        columns={[{ key: 'created', label: 'Created', type: 'date' }]}
        records={[{ id: 'date', created: '2026-08-04T12:00:00Z' }]}
      />,
    );
    expect(container.querySelector('time')).toHaveTextContent('2026-08-04');
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-08-04T12:00:00Z');
  } finally {
    localeDate.mockRestore();
  }
});

it('keeps the equivalent plain cell compact and updates replaced or mutated records', () => {
  let suffix = '';
  const plainColumns: import('./table.types').TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', template: (value) => String(value) + suffix },
  ];
  const rows = Array.from({ length: 50 }, (_, id) => ({ id: String(id), name: `Person ${id}` }));
  const { container, rerender } = render(
    <TableList records={rows} columns={plainColumns} canSelectRows={false} />,
  );
  expect(container.querySelectorAll('tbody td')).toHaveLength(50);
  expect(container.querySelector('tbody td')!.querySelectorAll('*').length).toBeLessThanOrEqual(1);
  rerender(
    <TableList
      records={rows.map((row, index) => (index === 0 ? { ...row, name: 'Updated' } : row))}
      columns={plainColumns}
      canSelectRows={false}
    />,
  );
  expect(container.querySelector('tbody td')).toHaveTextContent('Updated');
  rows[1]!.name = 'Mutated';
  rerender(<TableList records={[...rows]} columns={plainColumns} canSelectRows={false} />);
  expect(container.querySelectorAll('tbody td')[1]).toHaveTextContent('Mutated');
  suffix = ' formatted';
  rerender(<TableList records={[...rows]} columns={plainColumns} canSelectRows={false} />);
  expect(container.querySelectorAll('tbody td')[1]).toHaveTextContent('Mutated formatted');
});

it('renders nested column values and isolates radio groups between instances', () => {
  render(
    <>
      <TableList columns={columns} records={records} canCheckRows />
      <TableList columns={columns} records={records} canCheckRows />
    </>,
  );
  expect(screen.getAllByText('Ada')).toHaveLength(2);
  const radios = screen.getAllByRole('radio');
  expect(radios[0]!.getAttribute('name')).not.toBe(radios[1]!.getAttribute('name'));
});

it('refreshes nested mutable values after the records array changes', () => {
  const rows = [{ id: 'a', person: { name: 'Ada' } }];
  const nestedColumns: import('./table.types').TableColumn[] = [
    { key: 'person.name', label: 'Name', type: 'text' },
  ];
  const { container, rerender } = render(
    <TableList records={rows} columns={nestedColumns} canSelectRows={false} />,
  );
  expect(container.querySelector('tbody td')).toHaveTextContent('Ada');
  rows[0]!.person.name = 'Grace';
  rerender(<TableList records={[...rows]} columns={nestedColumns} canSelectRows={false} />);
  expect(container.querySelector('tbody td')).toHaveTextContent('Grace');
});

it('validates edits, submits nested values and cancels without mutating consumer records', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  const onAction = vi.fn();
  render(
    <TableList
      columns={columns}
      records={records}
      editable
      onSubmit={onSubmit}
      onCancel={onCancel}
      onAction={onAction}
    />,
  );
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^Edit:/ }));
  expect(onAction).toHaveBeenCalledWith(0, 'beforeEdit', records[0]);
  expect(screen.getAllByRole('cell')).toHaveLength(columns.length);
  const name = screen.getByRole('textbox', { name: 'Name' });
  fireEvent.change(name, { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true');
  fireEvent.change(name, { target: { value: 'Grace' } });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Count' }), { target: { value: '1.5' } });
  fireEvent.blur(screen.getByRole('spinbutton', { name: 'Count' }));
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
  expect(onSubmit).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Count' }), { target: { value: '4' } });
  fireEvent.blur(screen.getByRole('spinbutton', { name: 'Count' }));
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
  expect(onSubmit).toHaveBeenCalledWith({ id: 0, user: { name: 'Grace' }, count: 4 });
  expect(records[0]!.user.name).toBe('Ada');
  fireEvent.click(screen.getByRole('button', { name: /^Edit:/ }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Discard' } });
  fireEvent.click(screen.getByRole('button', { name: 'Anuluj edycje rekordu' }));
  expect(screen.getByText('Ada')).toBeInTheDocument();
  expect(onCancel).toHaveBeenCalled();
});

it('creates a record using defaults and submits without modifying the input records', () => {
  const onSubmit = vi.fn();
  render(<TableList columns={columns} records={[]} editable canCreate onSubmit={onSubmit} />);
  fireEvent.click(screen.getByRole('button', { name: 'Dodaj rekord' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'New' } });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Count' }), { target: { value: '2' } });
  fireEvent.blur(screen.getByRole('spinbutton', { name: 'Count' }));
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
  expect(onSubmit).toHaveBeenCalledWith({ user: { name: 'New' }, count: 2 });
});
