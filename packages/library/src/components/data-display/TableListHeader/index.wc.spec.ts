import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import TableListHeaderVueComponent from './index.ce.vue';
import { TableListHeaderElement, defineTableListHeader } from './index.wc';

defineTableListHeader();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TableListHeader (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(TableListHeaderElement.tagName)).toBe(TableListHeaderElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      TableListHeaderElement.tagName,
      createVueCustomElementStoryArgs(TableListHeaderVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
