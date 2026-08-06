import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import SkeletonLoadingVueComponent from './index.ce.vue';
import { SkeletonLoadingElement, defineSkeletonLoading } from './index.wc';

defineSkeletonLoading();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SkeletonLoading (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(SkeletonLoadingElement.tagName)).toBe(SkeletonLoadingElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      SkeletonLoadingElement.tagName,
      createVueCustomElementStoryArgs(SkeletonLoadingVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
