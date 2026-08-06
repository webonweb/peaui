import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormRadioVueComponent from './index.ce.vue';
import { FormRadioElement, defineFormRadio } from './index.wc';

defineFormRadio();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormRadio (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormRadioElement.tagName)).toBe(FormRadioElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormRadioElement.tagName,
      createVueCustomElementStoryArgs(FormRadioVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
