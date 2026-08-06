import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import ProgressIndicatorVueComponent from './index.ce.vue';
import { ProgressIndicatorElement, defineProgressIndicator } from './index.wc';

defineProgressIndicator();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ProgressIndicator (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(ProgressIndicatorElement.tagName)).toBe(ProgressIndicatorElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      ProgressIndicatorElement.tagName,
      createVueCustomElementStoryArgs(ProgressIndicatorVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
