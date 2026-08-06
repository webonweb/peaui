import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FullscreenContainerVueComponent from './index.ce.vue';
import { FullscreenContainerElement, defineFullscreenContainer } from './index.wc';

defineFullscreenContainer();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FullscreenContainer (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FullscreenContainerElement.tagName)).toBe(FullscreenContainerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FullscreenContainerElement.tagName,
      createVueCustomElementStoryArgs(FullscreenContainerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
