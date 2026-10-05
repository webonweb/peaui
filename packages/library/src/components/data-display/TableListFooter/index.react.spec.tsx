/** @jsxImportSource react */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TableListFooter from './index';

describe('TableListFooter React parity', () => {
  it('derives available pages and the live range from the record count', () => {
    const onChangePage = vi.fn();
    render(
      <TableListFooter
        rowsNumber={90}
        rowsPerPage={10}
        total={9}
        page={1}
        onChangePage={onChangePage}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('1-10 / 90');
    const pagination = screen.getByRole('navigation');
    expect(pagination).toHaveAttribute('data-total-pages', '9');
    const next = pagination.querySelector('.peaui-pagination-control__controls--end button')!;
    expect(next).not.toBeDisabled();
    fireEvent.click(next);
    expect(onChangePage).toHaveBeenCalledWith(2);
  });

  it('reuses the common page-size choices and emits the numeric limit', () => {
    const onChangeLimit = vi.fn();
    render(
      <TableListFooter
        rowsNumber={90}
        rowsPerPage={10}
        total={9}
        page={1}
        onChangeLimit={onChangeLimit}
      />,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'Pokaż na stronie' }));
    expect(screen.getAllByRole('option').map((option) => option.textContent?.trim())).toEqual([
      '5',
      '10',
      '25',
      '50',
    ]);
    fireEvent.click(screen.getByRole('option', { name: '25' }));
    expect(onChangeLimit).toHaveBeenCalledWith(25);
  });

  it('omits the footer for an empty collection and pagination when total is zero', () => {
    const { container, rerender } = render(
      <TableListFooter rowsNumber={0} rowsPerPage={10} total={0} page={1} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<TableListFooter rowsNumber={90} rowsPerPage={10} total={0} page={1} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
