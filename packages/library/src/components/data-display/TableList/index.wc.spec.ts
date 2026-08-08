import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

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
  it('registers the public custom element', () => {
    expect(customElements.get(TableListElement.tagName)).toBe(TableListElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      TableListElement.tagName,
      createVueCustomElementStoryArgs(TableListVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

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
      await nextTick();
      await Promise.resolve();

      expect(element.querySelector('.peaui-table-list')).toHaveClass('peaui-table-list--details');
    },
  );
});
