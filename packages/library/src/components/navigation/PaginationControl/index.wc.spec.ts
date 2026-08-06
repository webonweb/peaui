import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import PaginationControlVueComponent from './index.ce.vue';
import { PaginationControlElement, definePaginationControl } from './index.wc';

definePaginationControl();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PaginationControl (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(PaginationControlElement.tagName)).toBe(PaginationControlElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      PaginationControlElement.tagName,
      createVueCustomElementStoryArgs(PaginationControlVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
