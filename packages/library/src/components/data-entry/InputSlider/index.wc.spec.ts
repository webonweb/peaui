import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import InputSliderVueComponent from './index.ce.vue';
import { InputSliderElement, defineInputSlider } from './index.wc';

defineInputSlider();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('InputSlider (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(InputSliderElement.tagName)).toBe(InputSliderElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      InputSliderElement.tagName,
      createVueCustomElementStoryArgs(InputSliderVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
