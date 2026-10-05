import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { waitForDomCondition } from '@/helpers/test-wc.helper';

import { CommandPaletteElement, defineCommandPalette } from './index.wc';

async function mountElement(
  options: Partial<CommandPaletteElement>,
): Promise<CommandPaletteElement> {
  const element = document.createElement(CommandPaletteElement.tagName) as CommandPaletteElement;
  Object.assign(element, options);
  document.body.append(element);
  await waitForDomCondition(element, () => element.querySelector('[role="combobox"]') !== null, {
    errorMessage: 'CommandPalette Web Component did not render in time.',
    timeoutMs: 5000,
  });
  await nextTick();
  return element;
}

afterEach(() => document.body.replaceChildren());

describe('CommandPalette Web Component', () => {
  it('registers the public custom element', () => {
    defineCommandPalette();
    expect(customElements.get(CommandPaletteElement.tagName)).toBe(CommandPaletteElement);
  });

  it('renders property commands with the same combobox and listbox semantics', async () => {
    const element = await mountElement({
      commands: [{ id: 'open', label: 'Open dashboard' }],
      mode: 'embedded',
      open: true,
      registerShortcut: false,
    });
    expect(element).toHaveAttribute('role', 'group');
    expect(element.querySelector('[role="combobox"]')).toHaveAttribute('aria-controls');
    expect(element.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(element.querySelector('[role="listbox"]')).toBeInTheDocument();
    expect(element.querySelector('[role="option"]')).toHaveTextContent('Open dashboard');
  });

  it('syncs query and emits selection and execution events', async () => {
    const execute = vi.fn();
    const element = await mountElement({
      commands: [{ id: 'settings', label: 'Open settings', keywords: ['preferences'], execute }],
      closeOnExecute: false,
      mode: 'embedded',
      open: true,
      registerShortcut: false,
    });
    const selected = vi.fn();
    element.addEventListener('select', selected);
    const input = element.querySelector<HTMLInputElement>('[role="combobox"]')!;
    input.value = 'pref';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await waitForDomCondition(element, () => execute.mock.calls.length === 1, {
      errorMessage: 'CommandPalette WC did not execute the active command.',
      timeoutMs: 5000,
    });
    expect(element.query).toBe('pref');
    expect(selected).toHaveBeenCalledTimes(1);
  });

  it('exposes imperative open, close and focus methods', async () => {
    const element = await mountElement({
      commands: [{ id: 'open', label: 'Open dashboard' }],
      mode: 'embedded',
      open: true,
    });
    element.focusSearch();
    expect(document.activeElement).toBe(element.querySelector('[role="combobox"]'));
    element.closePalette();
    expect(element.open).toBe(false);
    element.openPalette();
    expect(element.open).toBe(true);
  });
});
