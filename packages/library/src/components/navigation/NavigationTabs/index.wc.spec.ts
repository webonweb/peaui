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
  it('projects before and after content into the matching tab', async () => {
    const element = new NavigationTabsElement();
    element.ariaLabel = 'Navigation';
    element.tabs = [{ key: 'inbox', label: 'Inbox' }];
    const before = document.createElement('span');
    before.slot = 'navigation-tabs-inbox-before';
    before.textContent = 'Before inbox';
    const after = document.createElement('span');
    after.slot = 'navigation-tabs-inbox-after';
    after.textContent = 'After inbox';
    element.append(before, after);
    document.body.append(element);
    await nextTick();
    await Promise.resolve();
    const tab = element.querySelector('button');
    expect(tab?.textContent).toBe('Before inboxInboxAfter inbox');
    expect(tab?.getAttribute('aria-label')).toBe('Inbox');
  });
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
