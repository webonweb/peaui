import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import { defineKeyboardKey, KeyboardKeyElement } from './index.wc';

async function flush(): Promise<void> {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

async function mountElement(options: Partial<KeyboardKeyElement>): Promise<KeyboardKeyElement> {
  const element = document.createElement(KeyboardKeyElement.tagName) as KeyboardKeyElement;
  Object.assign(element, options);
  document.body.append(element);
  await flush();
  return element;
}

afterEach(() => document.body.replaceChildren());

describe('KeyboardKey Web Component', () => {
  it('registers the public element', () => {
    defineKeyboardKey();
    expect(customElements.get(KeyboardKeyElement.tagName)).toBe(KeyboardKeyElement);
  });

  it('renders the same semantic mac combination as Vue and React', async () => {
    const element = await mountElement({ keys: ['Mod', 'Shift', 'K'], platform: 'mac' });
    expect([...element.querySelectorAll('kbd')].map((key) => key.textContent)).toEqual([
      '⌘',
      '⇧',
      'K',
    ]);
    expect(element.querySelector('.peaui-keyboard-key__accessible')).toHaveTextContent(
      'Command plus Shift plus K',
    );
  });

  it('updates public properties while preserving the complete accessible name', async () => {
    const element = await mountElement({ keys: 'Mod + Enter', platform: 'windows' });
    element.platform = 'mac';
    element.format = 'text';
    element.keys = ['Alt', 'ArrowLeft'];
    await flush();

    expect([...element.querySelectorAll('kbd')].map((key) => key.textContent)).toEqual([
      'Option',
      'Left',
    ]);
    expect(element.querySelector('.peaui-keyboard-key__accessible')).toHaveTextContent(
      'Option plus Left Arrow',
    );
  });

  it('never enters the tab order or exposes aria-keyshortcuts', async () => {
    const element = await mountElement({ keys: 'Ctrl + K', platform: 'windows' });
    const root = element.querySelector('.peaui-keyboard-key');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('aria-keyshortcuts');
    expect(element.querySelectorAll('button')).toHaveLength(0);
  });
});
