import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormSelect from './index.wc';
import FormMultiSelect from '../FormMultiSelect/index.wc';

afterEach(() => document.body.replaceChildren());

async function open(element: HTMLElement): Promise<void> {
  const toggle = new Event('toggle');
  Object.defineProperty(toggle, 'newState', { value: 'open' });
  element.querySelector('[popover]')!.dispatchEvent(toggle);
  await nextTick();
}

describe('Select native form regressions: Web Components', () => {
  for (const multi of [false, true]) {
    it(`validates ${multi ? 'multiple' : 'single'} selected values while search is open`, async () => {
      const form = document.createElement('form');
      const element = new (multi ? FormMultiSelect : FormSelect)();
      Object.assign(element, {
        id: 'choice',
        name: 'choice',
        required: true,
        value: multi ? ['a'] : 'a',
        options: [{ value: 'a', label: 'Alpha' }],
      });
      form.append(element);
      document.body.append(form);
      await nextTick();
      expect(form.checkValidity()).toBe(true);
      await open(element);
      const input = element.querySelector<HTMLInputElement>('input[role="combobox"]')!;
      expect(input.value).toBe('');
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(form.checkValidity()).toBe(true);
      input.value = 'No match';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await nextTick();
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll('choice')).toEqual(['a']);
      Object.assign(element, { value: multi ? [] : '' });
      await nextTick();
      expect(form.reportValidity()).toBe(false);
      expect(document.activeElement).toBe(input);
    });
  }

  it('preserves and submits writable values after Tab and reopening', async () => {
    const form = document.createElement('form');
    const element = new FormSelect();
    Object.assign(element, {
      id: 'choice',
      name: 'choice',
      canWrite: true,
      required: true,
      value: '',
      options: [],
    });
    const change = vi.fn();
    element.addEventListener('update:value', change);
    form.append(element);
    document.body.append(form);
    await nextTick();
    await open(element);
    const input = element.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    input.value = 'Custom choice';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    expect(change.mock.calls.at(-1)?.[0].detail).toBe('Custom choice');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await nextTick();
    expect(input.value).toBe('Custom choice');
    expect(new FormData(form).get('choice')).toBe('Custom choice');
    await open(element);
    expect(input.value).toBe('Custom choice');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    expect(form.checkValidity()).toBe(false);
  });
});
