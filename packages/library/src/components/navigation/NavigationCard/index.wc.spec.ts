import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationCardVueComponent from './index.ce.vue';
import { NavigationCardElement, defineNavigationCard } from './index.wc';

defineNavigationCard();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NavigationCard (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(NavigationCardElement.tagName)).toBe(NavigationCardElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      NavigationCardElement.tagName,
      createVueCustomElementStoryArgs(NavigationCardVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
