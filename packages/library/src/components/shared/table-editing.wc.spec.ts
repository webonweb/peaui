import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { waitForDomCondition } from '@/helpers/test-wc.helper';
import TableList from '../data-display/TableList/index.wc';

afterEach(() => document.body.replaceChildren());
describe('regressions: WC table contracts', () => {
  it('saves nested editable values without flattening keys or mutating the source record', async () => {
    const onUpdate = vi.fn();
    const record = { id: 'a', user: { name: 'Ada', role: 'editor' } };
    const table = new TableList();
    Object.assign(table, {
      columns: [
        { key: 'user.name', label: 'Name', type: 'editable', manage: { type: 'text', onUpdate } },
      ],
      records: [record],
    });
    document.body.append(table);
    await waitForDomCondition(
      table,
      () => Boolean(table.querySelector('[aria-label="Edytuj kolumne"]')),
      {
        errorMessage: 'The editable column did not finish loading.',
      },
    );
    expect(table.querySelector('[aria-label="Edytuj kolumne"]')).not.toBeNull();
    table.querySelector<HTMLButtonElement>('[aria-label="Edytuj kolumne"]')!.click();
    await waitForDomCondition(
      table,
      () => Boolean(table.querySelector('input[data-type="input"]')),
      {
        errorMessage: 'The editable column input did not finish loading.',
      },
    );
    expect(table.querySelector('input[data-type="input"]')).not.toBeNull();
    const input = table.querySelector<HTMLInputElement>('input[data-type="input"]')!;
    input.value = 'Grace';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flushPromises();
    expect(record.user.name).toBe('Ada');
    table.querySelector<HTMLButtonElement>('[aria-label="Zapisz zmiane w kolumnie"]')!.click();
    await flushPromises();
    expect(onUpdate).toHaveBeenCalledExactlyOnceWith({
      id: 'a',
      user: { name: 'Grace', role: 'editor' },
    });
    expect(record.user.name).toBe('Ada');
  });
  it('keeps column hints focusable and executes only enabled step actions', async () => {
    const redirect = vi.fn();
    const table = new TableList();
    Object.assign(table, {
      columns: [
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
      ],
      records: [{ id: 'a', name: 'Ada' }],
    });
    document.body.append(table);
    await waitForDomCondition(
      table,
      () => table.querySelectorAll('.peaui-table-list__stepper-button').length === 2,
      {
        errorMessage: 'The stepper column did not finish loading.',
      },
    );
    expect(table.querySelectorAll('.peaui-table-list__stepper-button')).toHaveLength(2);
    expect(table.querySelector('th .peaui-info-tooltip[tabindex="0"]')).not.toBeNull();
    expect(table.querySelector('td .peaui-info-tooltip[tabindex="0"]')).not.toBeNull();
    table.querySelector<HTMLButtonElement>('[aria-label^="Continue"]')!.click();
    table.querySelector<HTMLButtonElement>('[aria-label^="Blocked"]')!.click();
    expect(redirect).toHaveBeenCalledTimes(1);
  });
  it('validates and commits editable cells only after saving', async () => {
    const onUpdate = vi.fn();
    const table = new TableList();
    Object.assign(table, {
      columns: [
        {
          key: 'name',
          label: 'Name',
          type: () => 'editable',
          manage: { type: 'text', required: true, onUpdate },
        },
      ],
      records: [{ id: 'a', name: 'Ada' }],
    });
    document.body.append(table);
    await waitForDomCondition(
      table,
      () => Boolean(table.querySelector('[aria-label="Edytuj kolumne"]')),
      {
        errorMessage: 'The editable column did not finish loading.',
      },
    );
    expect(table.querySelector('[aria-label="Edytuj kolumne"]')).not.toBeNull();
    table.querySelector<HTMLButtonElement>('[aria-label="Edytuj kolumne"]')!.click();
    await waitForDomCondition(
      table,
      () => Boolean(table.querySelector('input[data-type="input"]')),
      {
        errorMessage: 'The editable column input did not finish loading.',
      },
    );
    expect(table.querySelector('input[data-type="input"]')).not.toBeNull();
    const change = async (value: string) => {
      const input = table.querySelector<HTMLInputElement>('input[data-type="input"]')!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await flushPromises();
    };
    await change('');
    table.querySelector<HTMLButtonElement>('[aria-label="Zapisz zmiane w kolumnie"]')!.click();
    await flushPromises();
    expect(onUpdate).not.toHaveBeenCalled();
    expect(
      table.querySelector('.peaui-message-text--variant-error')?.textContent?.trim(),
    ).toBeTruthy();
    await change('Grace');
    table.querySelector<HTMLButtonElement>('[aria-label="Zapisz zmiane w kolumnie"]')!.click();
    await flushPromises();
    expect(onUpdate).toHaveBeenCalledWith({ id: 'a', name: 'Grace' });
    expect(table.querySelector('input[data-type="input"]')).toBeNull();
    expect(table.textContent).toContain('Grace');
  });
  it('preserves nested falsy values in expandable and edit-action cells', async () => {
    const table = new TableList();
    Object.assign(table, {
      columns: ['expandable', 'editAction'].map((type) => ({
        key: 'stats',
        subKey: type,
        label: type,
        type,
        deep: 'amount',
      })),
      records: [0, false, '', null, undefined].map((amount, id) => ({
        id: String(id),
        stats: { amount },
      })),
    });
    document.body.append(table);
    for (const type of ['expandable', 'edit-action']) {
      await waitForDomCondition(
        table,
        () => table.querySelectorAll(`.peaui-table-list__${type}-value`).length === 5,
        {
          errorMessage: `The ${type} columns did not finish loading.`,
        },
      );
      expect(
        [...table.querySelectorAll(`.peaui-table-list__${type}-value`)].map(
          (cell) => cell.textContent,
        ),
      ).toEqual(['0', 'false', '-/-', '-/-', '-/-']);
    }
  });
  it('preserves nested zero/false and gives simultaneous tables distinct identifiers', async () => {
    const tables = [new TableList(), new TableList()];
    for (const table of tables) {
      Object.assign(table, {
        columns: [{ key: 'stats', label: 'Amount', deep: 'amount' }],
        records: [
          { id: 'a', stats: { amount: 0 } },
          { id: 'b', stats: { amount: false } },
        ],
      });
      document.body.append(table);
    }
    await flushPromises();
    await flushPromises();
    expect(
      [...tables[0]!.querySelectorAll('.peaui-table-list__text-value')].map(
        (cell) => cell.textContent,
      ),
    ).toEqual(['0', 'false']);
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});
