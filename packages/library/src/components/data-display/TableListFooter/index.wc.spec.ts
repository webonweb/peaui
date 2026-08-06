import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import TableListFooterVueComponent from './index.ce.vue';
import { TableListFooterElement, defineTableListFooter } from './index.wc';

defineTableListFooter();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TableListFooter (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(TableListFooterElement.tagName)).toBe(TableListFooterElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      TableListFooterElement.tagName,
      createVueCustomElementStoryArgs(TableListFooterVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
