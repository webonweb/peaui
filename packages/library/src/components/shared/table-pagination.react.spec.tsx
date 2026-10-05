/** @jsxImportSource react */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TableList from '../data-display/TableList';
afterEach(cleanup);
it('renders one page of a large table and preserves absolute row indexes and selection', () => {
  const onSelectRow = vi.fn();
  const records = Array.from({ length: 5000 }, (_, index) => ({
    id: String(index),
    name: `Record ${index}`,
  }));
  const view = render(
    <TableList
      columns={[{ key: 'name', label: 'Name' }]}
      records={records}
      paginate
      rowsPerPage={20}
      canSelectRows
      selectedRows={['0']}
      onSelectRow={onSelectRow}
    />,
  );
  expect(view.container.querySelectorAll('tbody tr')).toHaveLength(20);
  fireEvent.click(screen.getByRole('button', { name: /kolejnej strony/ }));
  expect(screen.getByText('Record 20')).toBeTruthy();
  expect(screen.queryByText('Record 0')).toBeNull();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Zaznacz wiersz 21' }));
  expect(onSelectRow).toHaveBeenCalledWith(['0', '20']);
});
