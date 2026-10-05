/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TableList from './index';

afterEach(cleanup);
afterEach(() => vi.unstubAllGlobals());

it('keeps column visibility available without adding record-action cells', () => {
  const { container } = render(
    <TableList
      canSelectRows={false}
      canHideColumns
      records={[{ id: '1', name: 'Ada' }]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' },
        { key: 'three', label: 'Three' },
      ]}
    />,
  );
  const manager = screen.getByRole('button', { name: 'Zarzadzaj widocznoscia kolumn' });
  expect(manager.closest('th')).toBe(container.querySelector('th:last-child'));
  expect(container.querySelector('.peaui-table-list__actions-cell')).not.toBeInTheDocument();
  fireEvent.click(manager);
  fireEvent.click(screen.getByRole('checkbox', { name: 'One' }));
  expect(container.querySelectorAll('thead th')).toHaveLength(3);
  expect(container.querySelectorAll('tbody td')).toHaveLength(3);
  expect(screen.getByRole('checkbox', { name: 'Two' })).toBeDisabled();
});

it('copies zero and false values while leaving empty cells without copy actions', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  const { container } = render(
    <TableList
      canSelectRows={false}
      columns={[{ key: 'value', label: 'Value', canCopy: true }]}
      records={[0, false, '', null, undefined].map((value, id) => ({ id: String(id), value }))}
    />,
  );
  const controls = container.querySelectorAll('.peaui-table-list__copy-button');
  expect(controls).toHaveLength(2);
  fireEvent.click(controls[0]!);
  fireEvent.click(controls[1]!);
  expect(writeText.mock.calls).toEqual([['0'], ['false']]);
});

it('expands the detail slot and exposes its state on the column control', () => {
  const onAction = vi.fn();
  render(
    <TableList
      records={[{ id: '1', name: 'Ada' }]}
      columns={[{ key: 'name', label: 'Name', type: 'expandable' }]}
      detailsRecord={<p>Record details</p>}
      onAction={onAction}
    />,
  );
  const control = screen.getByRole('button', { name: /Ada/ });
  expect(control).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(control);
  expect(control).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Record details').closest('td')).toHaveClass(
    'peaui-table-list__expanded-cell',
  );
  expect(onAction).toHaveBeenCalledWith('1', 'expand', { id: '1', name: 'Ada' });
  fireEvent.click(control);
  expect(screen.queryByText('Record details')).not.toBeInTheDocument();
});

it('uses the shared empty state and loading overlay, and keeps inline empty content in the table', () => {
  const { container, rerender } = render(<TableList columns={[]} records={[]} />);
  expect(container.querySelector('.peaui-empty-state')).toHaveTextContent('Lista jest pusta');
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  rerender(<TableList columns={[]} records={[]} isLoading />);
  expect(container.querySelector('.peaui-spinner-loader')).toBeInTheDocument();
  expect(container.querySelector('table')).toHaveAttribute('inert');
  rerender(
    <TableList
      columns={[{ key: 'name', label: 'Name' }]}
      records={[]}
      emptyDescription={false}
      emptyDescriptionInline="No matching rows"
    />,
  );
  expect(container.querySelector('tbody td.peaui-table-list__empty-inline-cell')).toHaveTextContent(
    'No matching rows',
  );
});

it('uses the shared typed cell layout and badge primitive', () => {
  const { container } = render(
    <TableList
      canSelectRows={false}
      columns={[
        { key: 'created', label: 'Created', type: 'date', width: 180 },
        { key: 'active', label: 'Active', type: 'status' },
      ]}
      records={[{ id: '1', created: '2026-08-04', active: true }]}
    />,
  );
  expect(container.querySelectorAll('.peaui-table-list__body-cell-content')).toHaveLength(2);
  expect(
    container.querySelector('.peaui-table-list__date-column > .peaui-table-list__date-value'),
  ).toHaveTextContent('2026-08-04');
  expect(container.querySelector('.peaui-tag-chip')).toHaveTextContent('TAK');
});

it('keeps row actions in the shared popover and supports keyboard navigation', () => {
  const onAction = vi.fn();
  const { container } = render(
    <TableList
      canSelectRows={false}
      columns={[
        { key: 'name', label: 'Name' },
        {
          key: 'actions',
          label: 'Actions',
          resolve: () => [
            { key: 'preview', label: 'Preview', icon: 'eye' },
            { key: 'copy', label: 'Copy', icon: 'copy' },
          ],
        },
      ]}
      records={[{ id: '1', name: 'Ada' }]}
      onAction={onAction}
    />,
  );
  expect(container.querySelector('.peaui-table-list__actions-cell')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^Preview:/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Pokaz akcje dla rekordu' }));
  const preview = screen.getByRole('button', { name: /^Preview:/ });
  fireEvent.keyDown(preview, { key: 'ArrowDown' });
  expect(screen.getByRole('button', { name: /^Copy:/ })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: /^Copy:/ }));
  expect(onAction).toHaveBeenCalledWith('1', 'copy', { id: '1', name: 'Ada' });
  expect(screen.getByRole('button', { name: 'Pokaz akcje dla rekordu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

it('offers locking explicitly instead of locking every eligible column on first render', () => {
  const { container } = render(
    <TableList
      canSelectRows={false}
      columns={[{ key: 'name', label: 'Name', withLock: true }]}
      records={[{ id: '1', name: 'Ada' }]}
    />,
  );
  expect(container.querySelector('.peaui-table-list__head-cell--locked')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Zablokuj kolumne' }));
  expect(screen.getByRole('button', { name: 'Odblokuj kolumne' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(container.querySelector('.peaui-table-list__head-cell--locked')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Odblokuj kolumne' }));
  expect(container.querySelector('.peaui-table-list__head-cell--locked')).not.toBeInTheDocument();
});

it('manages column visibility in the header and keeps locked columns visible', () => {
  const { container } = render(
    <TableList
      canSelectRows={false}
      canHideColumns
      records={[{ id: '1', name: 'Ada' }]}
      columns={[
        { key: 'name', label: 'Name', withLock: true },
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' },
        { key: 'three', label: 'Three' },
        { key: 'hidden', label: 'Hidden', visible: false },
        { key: 'actions', label: 'Actions', resolve: () => [{ key: 'preview', label: 'Preview' }] },
      ]}
    />,
  );
  expect(container.querySelector('details')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Zablokuj kolumne' }));
  fireEvent.click(screen.getByRole('button', { name: 'Zarzadzaj widocznoscia kolumn' }));
  expect(screen.getByRole('checkbox', { name: 'Name' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox', { name: 'One' }));
  expect(screen.getByRole('checkbox', { name: 'Two' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Hidden' }));
  expect(screen.getByRole('checkbox', { name: 'Two' })).not.toBeDisabled();
  expect(container.querySelector('thead')).toHaveTextContent('Hidden');
});
const records = [{ id: 'record-1', user: { name: 'Ada' }, count: 3 }];
const columns: import('./table.types').TableColumn[] = [
  { key: 'user.name', label: 'Name', manage: { type: 'text', required: true } },
  { key: 'count', label: 'Count', manage: { type: 'number', integer: true, step: 0.1 } },
  { key: 'actions', label: 'Actions', resolve: () => [{ key: 'edit', label: 'Edit' }] },
];

it('uses shared selection controls, column sizing and sort presentation', () => {
  const { container, rerender } = render(
    <TableList
      records={[{ id: '1', name: 'Ada' }]}
      columns={[{ key: 'name', label: 'Name', canSort: true }]}
    />,
  );
  expect(container.querySelectorAll('.peaui-form-field-checkbox')).toHaveLength(2);
  expect(container.querySelector('tbody .peaui-table-list__body-cell')).toHaveStyle({
    minWidth: '170px',
    width: '100%',
  });
  expect(
    container.querySelector(
      'thead .peaui-table-list__head-content > button > .peaui-table-list__head-label',
    ),
  ).toHaveTextContent('Name');
  expect(container.querySelector('.peaui-table-list__head-sort-icon')).not.toBeInTheDocument();
  rerender(
    <TableList
      records={[{ id: '1', name: 'Ada' }]}
      columns={[{ key: 'name', label: 'Name', canSort: true }]}
      sortColumn="name"
      sortType="asc"
    />,
  );
  expect(container.querySelector('.peaui-table-list__head-sort-icon')).toBeInTheDocument();
  expect(container.querySelector('.peaui-table-list__head-button')).toHaveClass(
    'peaui-table-list__head-button--active',
  );
});

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
  fireEvent.click(screen.getByRole('button', { name: 'Pokaz akcje dla rekordu' }));
  fireEvent.click(screen.getByRole('button', { name: /^Edit:/ }));
  expect(onAction).toHaveBeenCalledWith(0, 'beforeEdit', records[0]);
  expect(
    screen
      .getAllByRole('cell')
      .filter((cell) => cell.closest('tr')?.classList.contains('peaui-table-list__row--editing')),
  ).toHaveLength(columns.length);
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
  fireEvent.click(screen.getByRole('button', { name: 'Pokaz akcje dla rekordu' }));
  fireEvent.click(screen.getByRole('button', { name: /^Edit:/ }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Discard' } });
  fireEvent.click(screen.getByRole('button', { name: 'Anuluj edycje rekordu' }));
  expect(screen.getByText('Ada')).toBeInTheDocument();
  expect(onCancel).toHaveBeenCalled();
});

it.each([true, false])(
  'creates a record with emptyDescription=%s and submits without modifying the input records',
  (emptyDescription) => {
    const onSubmit = vi.fn();
    const onCreateRecord = vi.fn();
    render(
      <TableList
        columns={columns}
        records={[]}
        editable
        canCreate
        emptyDescription={emptyDescription}
        onSubmit={onSubmit}
        onCreateRecord={onCreateRecord}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: emptyDescription ? 'Dodaj nowy rekord' : 'Dodaj' }),
    );
    if (emptyDescription) expect(onCreateRecord).toHaveBeenCalledOnce();
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'New' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Count' }), { target: { value: '2' } });
    fireEvent.blur(screen.getByRole('spinbutton', { name: 'Count' }));
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz edytowany rekord' }));
    expect(onSubmit).toHaveBeenCalledWith({ user: { name: 'New' }, count: 2 });
  },
);
