import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import SpinnerLoaderVueComponent from './index.ce.vue';
import { SpinnerLoaderElement, defineSpinnerLoader } from './index.wc';

defineSpinnerLoader();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SpinnerLoader (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(SpinnerLoaderElement.tagName)).toBe(SpinnerLoaderElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      SpinnerLoaderElement.tagName,
      createVueCustomElementStoryArgs(SpinnerLoaderVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
