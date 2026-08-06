import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import PopoverOverlayerVueComponent from './index.ce.vue';
import { PopoverOverlayerElement, definePopoverOverlayer } from './index.wc';

definePopoverOverlayer();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PopoverOverlayer (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(PopoverOverlayerElement.tagName)).toBe(PopoverOverlayerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      PopoverOverlayerElement.tagName,
      createVueCustomElementStoryArgs(PopoverOverlayerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
