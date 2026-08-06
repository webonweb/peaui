import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import DrawerPanelVueComponent from './index.ce.vue';
import { DrawerPanelElement, defineDrawerPanel } from './index.wc';

defineDrawerPanel();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DrawerPanel (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(DrawerPanelElement.tagName)).toBe(DrawerPanelElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      DrawerPanelElement.tagName,
      createVueCustomElementStoryArgs(DrawerPanelVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
