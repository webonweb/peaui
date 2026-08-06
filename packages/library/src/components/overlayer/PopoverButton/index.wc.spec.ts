import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import PopoverButtonVueComponent from './index.ce.vue';
import { PopoverButtonElement, definePopoverButton } from './index.wc';

definePopoverButton();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PopoverButton (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(PopoverButtonElement.tagName)).toBe(PopoverButtonElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      PopoverButtonElement.tagName,
      createVueCustomElementStoryArgs(PopoverButtonVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
