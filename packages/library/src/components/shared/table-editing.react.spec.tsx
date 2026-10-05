/** @jsxImportSource react */
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TableList from '../data-display/TableList';
import TableListHeader from '../data-display/TableListHeader';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe('regressions: React table contracts', () => {
  it('saves nested editable values without flattening keys or mutating the source record', () => {
    const onUpdate = vi.fn();
    const record = { id: 'a', user: { name: 'Ada', role: 'editor' } };
    const { getByRole } = render(
      <TableList
        columns={[
          { key: 'user.name', label: 'Name', type: 'editable', manage: { type: 'text', onUpdate } },
        ]}
        records={[record]}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Edytuj kolumne' }));
    fireEvent.change(getByRole('textbox'), { target: { value: 'Grace' } });
    expect(record.user.name).toBe('Ada');
    fireEvent.click(getByRole('button', { name: 'Zapisz zmiane w kolumnie' }));
    expect(onUpdate).toHaveBeenCalledExactlyOnceWith({
      id: 'a',
      user: { name: 'Grace', role: 'editor' },
    });
    expect(record.user.name).toBe('Ada');
  });
  it('validates and commits editable cells only after saving, and cancels drafts', () => {
    const onUpdate = vi.fn();
    const { getByRole, queryByRole, container } = render(
      <TableList
        columns={[
          {
            key: 'name',
            label: 'Name',
            type: () => 'editable',
            manage: { type: 'text', required: true, onUpdate },
          },
        ]}
        records={[{ id: 'a', name: 'Ada' }]}
      />,
    );
    fireEvent.click(getByRole('button', { name: 'Edytuj kolumne' }));
    fireEvent.change(getByRole('textbox'), { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: 'Zapisz zmiane w kolumnie' }));
    expect(onUpdate).not.toHaveBeenCalled();
    expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(getByRole('textbox'), { target: { value: 'Grace' } });
    fireEvent.click(getByRole('button', { name: 'Zapisz zmiane w kolumnie' }));
    expect(onUpdate).toHaveBeenCalledWith({ id: 'a', name: 'Grace' });
    expect(queryByRole('textbox')).toBeNull();
    expect(container.textContent).toContain('Grace');
    fireEvent.click(getByRole('button', { name: 'Edytuj kolumne' }));
    fireEvent.change(getByRole('textbox'), { target: { value: 'Uncommitted' } });
    fireEvent.click(getByRole('button', { name: 'Anuluj edycje kolumny' }));
    expect(container.textContent).toContain('Grace');
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
  it('keeps column hints focusable and executes only enabled step actions', () => {
    const redirect = vi.fn();
    const { container, getByRole } = render(
      <TableList
        columns={[
          { key: 'name', label: 'Name', hint: true, hintColumn: 'Column help' },
          {
            key: 'steps',
            label: 'Steps',
            type: 'stepper',
            steps: () => [
              { key: 'active', label: 'Continue', status: 'current', onRedirect: redirect },
              { key: 'blocked', label: 'Blocked', status: 'disabled', onRedirect: redirect },
            ],
          },
        ]}
        records={[{ id: 'a', name: 'Ada' }]}
      />,
    );
    expect(container.querySelectorAll('.peaui-info-tooltip[tabindex="0"]')).toHaveLength(2);
    fireEvent.click(getByRole('button', { name: /Continue/ }));
    fireEvent.click(getByRole('button', { name: /Blocked/ }));
    expect(redirect).toHaveBeenCalledTimes(1);
  });
  it('preserves falsy values in expandable and edit-action cells', () => {
    const { container } = render(
      <TableList
        columns={[
          {
            key: 'stats',
            subKey: 'expandable',
            label: 'Expand',
            type: 'expandable',
            deep: 'amount',
          },
          { key: 'stats', subKey: 'editAction', label: 'Edit', type: 'editAction', deep: 'amount' },
        ]}
        records={[0, false, '', null, undefined].map((amount, id) => ({
          id: String(id),
          stats: { amount },
        }))}
      />,
    );
    for (const type of ['expandable', 'edit-action']) {
      expect(
        [...container.querySelectorAll(`.peaui-table-list__${type}-value`)].map(
          (cell) => cell.textContent,
        ),
      ).toEqual(['0', 'false', '-/-', '-/-', '-/-']);
    }
  });
  it('resolves functional types, templates and nested falsy values', () => {
    const { container } = render(
      <TableList
        canSelectRows={false}
        columns={[
          {
            key: 'name',
            label: 'Name',
            type: () => 'tag',
            template: (value) => `Formatted ${String(value)}`,
          },
          { key: 'stats', label: 'Amount', deep: 'amount' },
        ]}
        records={[
          { id: 'a', name: 'Ada', stats: { amount: 0 } },
          { id: 'b', name: 'Bob', stats: { amount: false } },
        ]}
      />,
    );
    expect(container.querySelector('.peaui-tag-chip')?.textContent).toBe('Formatted Ada');
    const cells = [...container.querySelectorAll('tbody tr')].map(
      (row) => row.querySelectorAll('td')[1]?.textContent,
    );
    expect(cells).toEqual(['0', 'false']);
  });
  it('uses subKey for independent column sorting and honors action visibility', () => {
    const onSort = vi.fn();
    const onAction = vi.fn();
    const { getByRole, container } = render(
      <TableList
        onSort={onSort}
        onAction={onAction}
        columns={[
          { key: 'name', subKey: 'primary', label: 'First', canSort: true },
          { key: 'name', subKey: 'secondary', label: 'Second', canSort: true },
          {
            key: 'actions',
            label: 'Actions',
            visibleColumn: () => false,
            resolve: () => [{ label: 'Delete', actionName: 'delete' }],
          },
        ]}
        records={[{ id: 'a', name: 'Ada' }]}
      />,
    );
    fireEvent.click(getByRole('button', { name: /Second/ }));
    expect(onSort).toHaveBeenCalledWith('secondary');
    expect(container.textContent).not.toContain('Delete');
  });
  it('opens the filter drawer and schedules search with SearchInput', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const { getByRole, queryByRole } = render(
      <TableListHeader
        canFilter
        canSearch
        onSearch={onSearch}
        filtersDrawer={<button>Apply filters</button>}
      />,
    );
    expect(queryByRole('dialog')).toBeNull();
    fireEvent.click(getByRole('button', { name: /Filtr/ }));
    expect(getByRole('dialog').textContent).toContain('Apply filters');
    const search = getByRole('searchbox');
    fireEvent.change(search, { target: { value: 'A' } });
    fireEvent.change(search, { target: { value: 'Ada' } });
    expect(onSearch).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenLastCalledWith('Ada');
  });
  it('disables export for empty data and preserves the export format payload', () => {
    const onExport = vi.fn();
    const { getByRole, rerender } = render(
      <TableListHeader canExport totalRecords={0} forceExport onExport={onExport} />,
    );
    expect((getByRole('button', { name: /Eksport/ }) as HTMLButtonElement).disabled).toBe(true);
    rerender(<TableListHeader canExport totalRecords={1} forceExport onExport={onExport} />);
    fireEvent.click(getByRole('button', { name: /Eksport/ }));
    fireEvent.click(getByRole('menuitem', { name: /Do XLSX/ }));
    expect(onExport).toHaveBeenCalledWith('xlsx');
  });
});
