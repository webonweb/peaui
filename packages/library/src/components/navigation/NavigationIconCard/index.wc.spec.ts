import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationIconCardVueComponent from './index.ce.vue';
import { NavigationIconCardElement, defineNavigationIconCard } from './index.wc';

defineNavigationIconCard();

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('NavigationIconCard (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(NavigationIconCardElement.tagName)).toBe(NavigationIconCardElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = renderVueCustomElementStory(
      NavigationIconCardElement.tagName,
      createVueCustomElementStoryArgs(NavigationIconCardVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
    expect(element.getAttribute('role')).toBe('group');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[NavigationIconCard] Missing path. Rendering a disabled card without navigation.',
    );
  });
});
