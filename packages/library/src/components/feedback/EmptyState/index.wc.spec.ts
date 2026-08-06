import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import EmptyStateVueComponent from './index.ce.vue';
import { EmptyStateElement, defineEmptyState } from './index.wc';

defineEmptyState();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('EmptyState (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(EmptyStateElement.tagName)).toBe(EmptyStateElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      EmptyStateElement.tagName,
      createVueCustomElementStoryArgs(EmptyStateVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
