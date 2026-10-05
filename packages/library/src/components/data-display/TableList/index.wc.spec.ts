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
