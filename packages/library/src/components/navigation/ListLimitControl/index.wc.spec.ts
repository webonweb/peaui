import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import ListLimitControlVueComponent from './index.ce.vue';
import { ListLimitControlElement, defineListLimitControl } from './index.wc';

defineListLimitControl();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ListLimitControl (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(ListLimitControlElement.tagName)).toBe(ListLimitControlElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      ListLimitControlElement.tagName,
      createVueCustomElementStoryArgs(ListLimitControlVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
