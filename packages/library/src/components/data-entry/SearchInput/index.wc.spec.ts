import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import SearchInputVueComponent from './index.ce.vue';
import { SearchInputElement, defineSearchInput } from './index.wc';

defineSearchInput();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SearchInput (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(SearchInputElement.tagName)).toBe(SearchInputElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      SearchInputElement.tagName,
      createVueCustomElementStoryArgs(SearchInputVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
