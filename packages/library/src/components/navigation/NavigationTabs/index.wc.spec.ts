import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationTabsVueComponent from './index.ce.vue';
import { NavigationTabsElement, defineNavigationTabs } from './index.wc';

defineNavigationTabs();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NavigationTabs (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(NavigationTabsElement.tagName)).toBe(NavigationTabsElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      NavigationTabsElement.tagName,
      createVueCustomElementStoryArgs(NavigationTabsVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
