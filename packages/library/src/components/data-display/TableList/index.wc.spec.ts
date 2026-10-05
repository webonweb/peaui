import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { waitForDomCondition } from '@/helpers/test-wc.helper';
import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import TableListVueComponent from './index.ce.vue';
import { TableListElement, defineTableList } from './index.wc';

defineTableList();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TableList (index.wc.ts)', () => {
  it('keeps column visibility available without a record-actions column', async () => {
    const element = new TableListElement();
    Object.assign(element, {
      canHideColumns: true,
      canSelectRows: false,
      columns: ['name', 'one', 'two', 'three'].map((key) => ({ key, label: key })),
      records: [{ id: '1', name: 'Ada' }],
    });
    document.body.append(element);
    await nextTick();
    const trigger = element.querySelector<HTMLElement>(
      '.peaui-table-list__head-actions-popover-trigger',
    )!;
    expect(trigger.closest('th')).toBe(element.querySelector('th:last-child'));
    expect(element.querySelector('.peaui-table-list__actions-cell')).toBeNull();
    trigger.click();
    await nextTick();
    element
      .querySelectorAll<HTMLInputElement>('.peaui-table-list__head-actions-checkbox')[1]!
      .click();
    await nextTick();
    expect(element.querySelectorAll('thead th')).toHaveLength(3);
    expect(element.querySelectorAll('tbody td')).toHaveLength(3);
  });

  it('opens the default empty-list editor and keeps the create and submit events', async () => {
    const element = new TableListElement();
    const onCreate = vi.fn();
    const onSubmit = vi.fn();
    Object.assign(element, {
      editable: true,
      canCreate: true,
      records: [],
      columns: [{ key: 'name', label: 'Name', manage: { type: 'text' } }],
    });
    element.addEventListener('on:createRecord', onCreate);
    element.addEventListener('on:submit', onSubmit);
    document.body.append(element);
    await nextTick();
    element.querySelector<HTMLButtonElement>('.peaui-empty-state button')!.click();
    await nextTick();
    expect(onCreate).toHaveBeenCalledOnce();
    await waitForDomCondition(element, () => Boolean(element.querySelector('input[type="text"]')), {
      errorMessage: 'The empty-list create action did not open the editor.',
    });
    const input = element.querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(input).not.toBeNull();
    input.value = 'New';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    element
      .querySelector<HTMLButtonElement>('button[aria-label="Zapisz edytowany rekord"]')!
      .click();
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect((onSubmit.mock.calls[0]![0] as CustomEvent).detail).toMatchObject({ name: 'New' });
  });

  it('offers copy controls for numeric zero and boolean false', async () => {
    const element = new TableListElement();
    Object.assign(element, {
      canSelectRows: false,
      columns: [{ key: 'value', label: 'Value', canCopy: true }],
      records: [0, false, '', null, undefined].map((value, id) => ({ id: String(id), value })),
    });
    document.body.append(element);
    await nextTick();
    expect(element.querySelectorAll('.peaui-table-list__copy-button')).toHaveLength(2);
  });
  it('keeps plain cells compact while preserving mutable rows and formatter state', async () => {
    let suffix = '';
    const template = vi.fn((value: unknown) => String(value) + suffix);
    const records = Array.from({ length: 50 }, (_, id) => ({
      id: String(id),
      name: `Person ${id}`,
    }));
    const element = new TableListElement();
    Object.assign(element, {
      records,
      columns: [{ key: 'name', label: 'Name', type: 'text', template }],
      canSelectRows: false,
    });
    document.body.append(element);
    await nextTick();
    await nextTick();
    expect(element.querySelectorAll('tbody td')).toHaveLength(50);
    expect(element.querySelector('tbody td')!.querySelectorAll('*').length).toBeLessThanOrEqual(1);
    const unchangedCell = element.querySelectorAll('tbody td')[1];
    Object.assign(element, {
      records: records.map((record, index) =>
        index === 0 ? { ...record, name: 'Updated' } : record,
      ),
    });
    await nextTick();
    expect(element.querySelector('tbody td')?.textContent).toBe('Updated');
    expect(element.querySelectorAll('tbody td')[1]).toBe(unchangedCell);
    records[1]!.name = 'Mutated';
    Object.assign(element, { records: [...records] });
    await nextTick();
    expect(element.querySelectorAll('tbody td')[1]?.textContent).toBe('Mutated');
    suffix = ' formatted';
    Object.assign(element, { records: [...records] });
    await nextTick();
    expect(element.querySelectorAll('tbody td')[1]?.textContent).toBe('Mutated formatted');
    const onDoubleClick = vi.fn();
    element.addEventListener('on:dblclick', onDoubleClick);
    element.querySelector('tbody td')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });
  it('registers the public custom element', () => {
    expect(customElements.get(TableListElement.tagName)).toBe(TableListElement);
  });

  it('refreshes nested mutable values after the records array changes', async () => {
    const records = [{ id: 'a', person: { name: 'Ada' } }];
    const element = new TableListElement();
    Object.assign(element, {
      records,
      columns: [{ key: 'person.name', label: 'Name', type: 'text' }],
      canSelectRows: false,
    });
    document.body.append(element);
    await nextTick();
    expect(element.querySelector('tbody td')?.textContent).toBe('Ada');
    records[0]!.person.name = 'Grace';
    Object.assign(element, { records: [...records] });
    await nextTick();
    expect(element.querySelector('tbody td')?.textContent).toBe('Grace');
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      TableListElement.tagName,
      createVueCustomElementStoryArgs(TableListVueComponent),
    );
    document.body.appendChild(element);
    await waitForDomCondition(element, () => element.childNodes.length > 0, {
      errorMessage: 'TableList Web Component did not render in time.',
      timeoutMs: 5000,
    });

    expect(element.childNodes.length).toBeGreaterThan(0);
    expect(element.getAttribute('role')).toBe('group');
  });

  it.each(['isDetails', 'isDetials'] as const)(
    'keeps compatibility with the %s property',
    async (propertyName) => {
      const element = document.createElement(TableListElement.tagName) as HTMLElement &
        Record<typeof propertyName, boolean> & {
          columns: Array<Record<string, unknown>>;
          records: Array<Record<string, unknown>>;
        };
      element.columns = [{ key: 'name', label: 'Name' }];
      element.records = [{ id: '1', name: 'Alpha' }];
      element[propertyName] = true;
      document.body.appendChild(element);
      await waitForDomCondition(
        element,
        () => element.querySelector('.peaui-table-list--details') !== null,
        {
          errorMessage: `TableList did not apply the ${propertyName} compatibility property in time.`,
          timeoutMs: 5000,
        },
      );

      expect(element.querySelector('.peaui-table-list')).toHaveClass('peaui-table-list--details');
    },
  );
});
