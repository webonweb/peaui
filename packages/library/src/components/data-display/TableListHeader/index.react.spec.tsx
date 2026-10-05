/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import TableListHeader from './index';

afterEach(cleanup);

it('groups search and filter controls using the shared small control primitives', () => {
  const { container } = render(
    <TableListHeader canSearch canFilter canCreate countFilters={2} totalRecords={18} />,
  );
  const searchArea = container.querySelector('.peaui-table-list-header__search-area');
  expect(searchArea).toContainElement(screen.getByRole('button', { name: /Filtruj/ }));
  expect(searchArea).toContainElement(screen.getByRole('button', { name: /Wycz/ }));
  expect(
    container.querySelector('.peaui-table-list-header__search > .peaui-search-input'),
  ).toBeInTheDocument();
  for (const name of [/Filtruj/, /Wycz/, /Dodaj rekord/]) {
    expect(screen.getByRole('button', { name })).toHaveClass('peaui-button-action--size-s');
  }
  expect(
    container.querySelector('.peaui-table-list-header__filter-button svg'),
  ).toBeInTheDocument();
  expect(screen.queryByText('18 rekordów')).not.toBeInTheDocument();
});

it('keeps consumer content and description after controls and omits unused control groups', () => {
  const { container } = render(
    <TableListHeader
      additionalContent={<p>Content</p>}
      additionalDescription={<p>Description</p>}
    />,
  );
  const root = container.querySelector('.peaui-table-list-header')!;
  expect([...root.children].map((element) => element.textContent)).toEqual([
    '',
    'Content',
    'Description',
  ]);
  expect(root.querySelector('.peaui-table-list-header__search-area')).not.toBeInTheDocument();
  expect(root.querySelector('.peaui-table-list-header__actions')).not.toBeInTheDocument();
});
