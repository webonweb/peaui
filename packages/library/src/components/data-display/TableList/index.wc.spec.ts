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
  });
});
