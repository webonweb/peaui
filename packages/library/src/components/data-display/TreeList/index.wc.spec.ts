import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import TreeListVueComponent from './index.ce.vue';
import { TreeListElement, defineTreeList } from './index.wc';

defineTreeList();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TreeList (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(TreeListElement.tagName)).toBe(TreeListElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      TreeListElement.tagName,
      createVueCustomElementStoryArgs(TreeListVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
