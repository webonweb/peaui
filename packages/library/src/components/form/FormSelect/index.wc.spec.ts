import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
} from '@/helpers/vue-custom-element-story.helper';

import FormSelectVueComponent from './index.ce.vue';
import { FormSelectElement, defineFormSelect } from './index.wc';

defineFormSelect();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormSelect (index.wc.ts)', () => {
  it('mounts options on opening and emits values or migration labels', async () => {
    for (const valueMode of ['value', 'label'] as const) {
      const element = new FormSelectElement();
      Object.assign(element, {
        id: 'contract',
        name: 'contract',
        value: '',
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
      expect(received.at(-1)).toEqual(valueMode === 'label' ? 'Alpha' : 'a');
      element.remove();
    }
  });

  it('accepts localized labels through its typed public properties', async () => {
    const element = new FormSelectElement();
    element.labels = { searchPlaceholder: 'Search', empty: 'No matches' };
    element.options = [];
    document.body.append(element);
    await nextTick();
    const input = element.querySelector('input[role="combobox"]')!;
    const toggle = new Event('toggle');
    Object.defineProperty(toggle, 'newState', { value: 'open' });
    element.querySelector('[popover]')!.dispatchEvent(toggle);
    await nextTick();
    expect(input.getAttribute('placeholder')).toBe('Search');
    expect(element.textContent).toContain('No matches');
  });

  it('registers the public custom element', () => {
    expect(customElements.get(FormSelectElement.tagName)).toBe(FormSelectElement);
  });

  it('renders the original Vue implementation with its public props', async () => {
    const element = renderVueCustomElementStory(
      FormSelectElement.tagName,
      createVueCustomElementStoryArgs(FormSelectVueComponent),
    );
    document.body.appendChild(element);
    await nextTick();
    await Promise.resolve();

    expect(element.childNodes.length).toBeGreaterThan(0);
  });
});
