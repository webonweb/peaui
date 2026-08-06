import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormButtonGroupVueComponent from './index.ce.vue';
import { FormButtonGroupElement, defineFormButtonGroup } from './index.wc';

defineFormButtonGroup();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormButtonGroup (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(FormButtonGroupElement.tagName)).toBe(FormButtonGroupElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormButtonGroupElement.tagName,
      createVueCustomElementStoryArgs(FormButtonGroupVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
