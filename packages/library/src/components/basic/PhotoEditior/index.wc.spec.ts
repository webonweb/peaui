import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import PhotoEditorVueComponent from './index.ce.vue';
import { PhotoEditorElement, definePhotoEditor } from './index.wc';

definePhotoEditor();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PhotoEditor (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(PhotoEditorElement.tagName)).toBe(PhotoEditorElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      PhotoEditorElement.tagName,
      createVueCustomElementStoryArgs(PhotoEditorVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
