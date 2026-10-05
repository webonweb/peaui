import { nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { defineTableList, TableListElement } from '../data-display/TableList/index.wc';
defineTableList();
afterEach(() => document.body.replaceChildren());
it('renders one page and emits the page model through the WC adapter', async () => {
  const table = document.createElement(TableListElement.tagName);
  Object.assign(table, {
    columns: [{ key: 'name', label: 'Name' }],
    records: Array.from({ length: 5000 }, (_, index) => ({
      id: String(index),
      name: `Record ${index}`,
    })),
    paginate: true,
    rowsPerPage: 20,
  });
  const onPage = vi.fn();
  table.addEventListener('update:page', onPage);
  document.body.append(table);
  await nextTick();
  expect(table.querySelectorAll('tbody > tr')).toHaveLength(20);
  table
    .querySelector<HTMLButtonElement>('button[aria-label="Przejdz do kolejnej strony"]')!
    .click();
  await nextTick();
  await nextTick();
  expect(onPage).toHaveBeenCalled();
  expect(table.textContent).toContain('Record 20');
  expect(table.textContent).not.toContain('Record 0');
});
