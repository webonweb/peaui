import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormTextareaVueComponent from './index.ce.vue';
import { FormTextareaElement, defineFormTextarea } from './index.wc';

defineFormTextarea();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormTextarea (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormTextareaElement.tagName)).toBe(FormTextareaElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormTextareaElement.tagName,
      createVueCustomElementStoryArgs(FormTextareaVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
