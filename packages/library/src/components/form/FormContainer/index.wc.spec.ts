import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormContainerVueComponent from './index.ce.vue';
import { FormContainerElement, defineFormContainer } from './index.wc';

defineFormContainer();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormContainer (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormContainerElement.tagName)).toBe(FormContainerElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormContainerElement.tagName,
      createVueCustomElementStoryArgs(FormContainerVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
