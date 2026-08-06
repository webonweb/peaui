import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import SelectableCardVueComponent from './index.ce.vue';
import { SelectableCardElement, defineSelectableCard } from './index.wc';

defineSelectableCard();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SelectableCard (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(SelectableCardElement.tagName)).toBe(SelectableCardElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      SelectableCardElement.tagName,
      createVueCustomElementStoryArgs(SelectableCardVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
