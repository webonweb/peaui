import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import ModalDialogVueComponent from './index.ce.vue';
import { ModalDialogElement, defineModalDialog } from './index.wc';

defineModalDialog();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ModalDialog (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(ModalDialogElement.tagName)).toBe(ModalDialogElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      ModalDialogElement.tagName,
      createVueCustomElementStoryArgs(ModalDialogVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
