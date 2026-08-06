import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationDisclosureCardVueComponent from './index.ce.vue';
import { NavigationDisclosureCardElement, defineNavigationDisclosureCard } from './index.wc';

defineNavigationDisclosureCard();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NavigationDisclosureCard (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(NavigationDisclosureCardElement.tagName)).toBe(
      NavigationDisclosureCardElement,
    );
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      NavigationDisclosureCardElement.tagName,
      createVueCustomElementStoryArgs(NavigationDisclosureCardVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
