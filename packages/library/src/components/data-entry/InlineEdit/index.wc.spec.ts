import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineInlineEdit, InlineEditElement } from './index.wc';
import { inlineEditOptions } from './inline-edit.demo';

async function mountElement(options: Partial<InlineEditElement> = {}): Promise<InlineEditElement> {
  const element = document.createElement(InlineEditElement.tagName) as InlineEditElement;
  Object.assign(element, options);
  document.body.append(element);
  await nextTick();
  await Promise.resolve();
  return element;
}

afterEach(() => document.body.replaceChildren());

describe('InlineEdit Web Component', () => {
  it('registers and synchronizes value and editing properties', async () => {
    defineInlineEdit();
    expect(customElements.get(InlineEditElement.tagName)).toBe(InlineEditElement);
    const element = await mountElement({ value: 'Panel klienta' });
    const save = vi.fn();
    element.addEventListener('save', save);

    element.querySelector<HTMLButtonElement>('button')?.click();
    await nextTick();
    const input = element.querySelector<HTMLInputElement>('input');
    expect(input).not.toBeNull();
    expect(document.activeElement).toBe(input);
    if (!input) return;
    input.value = 'Panel partnera';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    element.querySelector<HTMLButtonElement>('.peaui-inline-edit__actions button')?.click();
    await nextTick();

    expect(element.value).toBe('Panel partnera');
    expect(element.editing).toBe(false);
    expect(save).toHaveBeenCalledOnce();
  });

  it('keeps async saves controlled and exposes busy semantics', async () => {
    const element = await mountElement({
      editing: true,
      editor: 'number',
      saveMode: 'async',
      value: 2,
    });
    const input = element.querySelector<HTMLInputElement>('input');
    if (!input) throw new Error('Missing number editor');
    input.value = '3';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    element.querySelector<HTMLButtonElement>('.peaui-inline-edit__actions button')?.click();
    await nextTick();

    expect(element.value).toBe(2);
    expect(element.editing).toBe(true);
    element.loading = true;
    await nextTick();
    expect(element.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Zapisywanie');
  });

  it('renders select labels and retains a visible button in double-click mode', async () => {
    const element = await mountElement({
      activation: 'dblclick',
      editor: 'select',
      editorProps: { options: inlineEditOptions, searchable: false },
      value: 'published',
    });
    expect(element.textContent).toContain('Opublikowane');
    expect(element.querySelector('button')?.getAttribute('aria-label')).toBe('Edytuj wartość');
    element
      .querySelector('.peaui-inline-edit__display')
      ?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await nextTick();
    expect(element.querySelector('[role="combobox"]')).not.toBeNull();
  });

  it('connects validation errors to the active control and cancels with Escape', async () => {
    const element = await mountElement({
      editing: true,
      validate: (value) => (String(value).trim() ? true : 'Wartość jest wymagana.'),
      value: 'Nazwa',
    });
    const input = element.querySelector<HTMLInputElement>('input');
    if (!input) throw new Error('Missing text editor');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    element.querySelector<HTMLButtonElement>('.peaui-inline-edit__actions button')?.click();
    await nextTick();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('-error');

    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await nextTick();
    expect(element.editing).toBe(false);
    expect(element.textContent).toContain('Nazwa');
  });
});
