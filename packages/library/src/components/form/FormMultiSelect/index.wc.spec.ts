import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormMultiSelectVueComponent from './index.ce.vue';
import { FormMultiSelectElement, defineFormMultiSelect } from './index.wc';

defineFormMultiSelect();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormMultiSelect (index.wc.ts)', () => {
  it('mounts options on opening and emits values or migration labels', async () => {
    for (const valueMode of ['value', 'label'] as const) {
      const element = new FormMultiSelectElement();
      Object.assign(element, {
        id: 'contract',
        name: 'contract',
        value: [],
        options: [{ label: 'Alpha', value: 'a' }],
        valueMode,
      });
      document.body.append(element);
      await nextTick();
      expect(element.querySelectorAll('[role="option"]')).toHaveLength(0);
      const toggle = new Event('toggle');
      Object.defineProperty(toggle, 'newState', { value: 'open' });
      element.querySelector('[popover]')!.dispatchEvent(toggle);
      await nextTick();
      const received: unknown[] = [];
      element.addEventListener('update:value', (event) =>
        received.push((event as CustomEvent<unknown>).detail),
      );
      (element.querySelector('[role="option"]') as HTMLElement).click();
      await nextTick();
      expect(received.at(-1)).toEqual(valueMode === 'label' ? ['Alpha'] : ['a']);
      element.remove();
    }
  });

  it('registers the public custom element', () => {
    expect(customElements.get(FormMultiSelectElement.tagName)).toBe(FormMultiSelectElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormMultiSelectElement.tagName,
      createVueCustomElementStoryArgs(FormMultiSelectVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
