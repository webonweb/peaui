import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FormTagsInputTag } from './tags-input.shared';
import { defineFormTagsInput, FormTagsInputElement } from './index.wc';

type FormTagsInputTestElement = InstanceType<typeof FormTagsInputElement> & {
  id: string;
  label: string;
  name: string;
  max?: number;
  mode?: 'freeform' | 'suggestions-only';
  allowCreate?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  description?: string;
  error?: string;
  dataTestId?: string;
};

const connected: FormTagsInputTestElement[] = [];

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

async function createTags(
  properties: Partial<FormTagsInputTestElement> = {},
): Promise<FormTagsInputTestElement> {
  defineFormTagsInput();
  const element = document.createElement(FormTagsInputElement.tagName) as FormTagsInputTestElement;
  Object.assign(element, {
    id: 'skills-wc',
    label: 'Umiejętności',
    name: 'skills',
    dataTestId: 'tags-wc',
    value: [],
    inputValue: '',
    suggestions: [],
    ...properties,
  });
  document.body.append(element);
  connected.push(element);
  await flush();
  return element;
}

function input(element: FormTagsInputTestElement): HTMLInputElement {
  const control = element.querySelector<HTMLInputElement>('input[role="combobox"]');
  if (!control) throw new Error('Brak comboboxa FormTagsInput WC.');
  return control;
}

function type(control: HTMLInputElement, value: string): void {
  control.value = value;
  control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

afterEach(() => {
  connected.splice(0).forEach((element) => element.remove());
});

describe('FormTagsInput Web Component', () => {
  it('rejestruje light-DOM element z nazwanym comboboxem i opisami', async () => {
    const element = await createTags({ description: 'Dodaj tagi.', error: 'Nieprawidłowe tagi.' });
    const control = input(element);

    expect(element.shadowRoot).toBeNull();
    expect(control.getAttribute('aria-labelledby')).toBe('label-skills-wc-control-input');
    expect(element.querySelector('label')).toHaveClass('peaui-form-label');
    expect(control.getAttribute('aria-describedby')).toContain('skills-wc-control-description');
    expect(control.getAttribute('aria-describedby')).toContain('skills-wc-control-error');
    expect(element.querySelectorAll('[role="status"]')).toHaveLength(1);
  });

  it('renderuje wspólny PopoverOverlayer i osobną listę tagów', async () => {
    const element = await createTags({
      suggestions: ['Vue', 'React', 'TypeScript'],
      value: ['Vue', 'React'],
    });
    const control = input(element);
    const overlayer = element.querySelector('.peaui-form-tags-input__overlayer');

    expect(overlayer).toHaveClass('peaui-popover-overlayer');
    expect(overlayer).toHaveClass('peaui-popover-overlayer--match-trigger-width');
    expect(element.querySelector('.peaui-form-tags-input__tags')?.tagName).toBe('UL');
    expect(
      element.querySelectorAll('.peaui-form-tags-input__tags > .peaui-form-tags-input__tag'),
    ).toHaveLength(2);
    expect(control.getAttribute('aria-haspopup')).toBe('listbox');
    expect(
      element.querySelector('.peaui-form-tags-input__tag-main')?.hasAttribute('aria-controls'),
    ).toBe(false);
  });

  it('synchronizuje value i inputValue po dodaniu Enterem', async () => {
    const element = await createTags();
    const onAdd = vi.fn();
    const onValue = vi.fn();
    element.addEventListener('add', onAdd);
    element.addEventListener('update:value', onValue);
    const control = input(element);
    type(control, 'Vue');
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await flush();

    expect(element.value).toEqual(['Vue']);
    expect(element.inputValue).toBe('');
    expect((onValue.mock.calls.at(-1)?.[0] as CustomEvent).detail).toEqual(['Vue']);
    expect((onAdd.mock.calls[0]?.[0] as CustomEvent).detail).toEqual(['Vue', 0, expect.any(Event)]);
  });

  it('parsuje paste, waliduje i respektuje limit', async () => {
    const element = await createTags({ max: 2 });
    element.validateTag = (tag) => getLabel(tag).length >= 3 || 'Minimum 3 znaki.';
    const invalid = vi.fn();
    const maxReached = vi.fn();
    element.addEventListener('invalidTag', invalid);
    element.addEventListener('maxReached', maxReached);
    const control = input(element);
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', {
      value: { getData: () => 'Vue, UI, React, TypeScript' },
    });
    control.dispatchEvent(event);
    await flush();

    expect(element.value).toEqual(['Vue', 'React']);
    expect((invalid.mock.calls[0]?.[0] as CustomEvent).detail[0]).toMatchObject({
      reason: 'invalid',
    });
    expect((maxReached.mock.calls[0]?.[0] as CustomEvent).detail[0]).toBe(2);
  });

  it('obsługuje dwustopniowy Backspace i stabilny fokus', async () => {
    const element = await createTags({ value: ['Vue', 'React'] });
    const control = input(element);
    control.focus();
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace' }));
    await flush();
    expect(element.querySelectorAll('.peaui-form-tags-input__tag')[1]?.classList).toContain(
      'peaui-form-tags-input__tag--selected',
    );
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace' }));
    await flush();

    expect(element.value).toEqual(['Vue']);
    expect(document.activeElement).toBe(control);
  });

  it('wybiera obiektową sugestię z dostępnego listboxa', async () => {
    const suggestion = { id: 1, label: 'React', value: 'react' };
    const element = await createTags({
      allowCreate: false,
      mode: 'suggestions-only',
      suggestions: [suggestion],
    });
    const control = input(element);
    control.focus();
    type(control, 'rea');
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    await flush();

    expect(control.getAttribute('aria-activedescendant')).toBe('skills-wc-control-suggestion-0');
    const option = element.querySelector('[role="option"]');
    const overlay = option?.closest('.peaui-form-tags-input__popover-content');
    expect(option?.getAttribute('aria-selected')).toBe('true');
    expect(overlay?.classList.contains('peaui-popover-overlayer__content')).toBe(true);
    expect(
      overlay?.classList.contains('peaui-popover-overlayer__content--match-trigger-width'),
    ).toBe(true);
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await flush();
    expect(element.value).toEqual([suggestion]);
  });

  it('edytuje klawiaturą i emituje payload zgodny z Vue i React', async () => {
    const element = await createTags({ value: ['Vue'] });
    const edited = vi.fn();
    element.addEventListener('edit', edited);
    const tagButton = element.querySelector<HTMLButtonElement>('.peaui-form-tags-input__tag-main');
    tagButton?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'F2' }));
    await flush();
    const control = input(element);
    type(control, 'Vue 3');
    control.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await flush();

    expect(element.value).toEqual(['Vue 3']);
    expect((edited.mock.calls[0]?.[0] as CustomEvent).detail).toEqual([
      'Vue',
      'Vue 3',
      0,
      expect.any(Event),
    ]);
  });

  it('przekazuje funkcje przez właściwości DOM i anuluje starsze async query', async () => {
    const resolvers = new Map<string, (value: readonly FormTagsInputTag[]) => void>();
    const signals = new Map<string, AbortSignal>();
    const element = await createTags();
    element.suggestionProvider = (query, signal) =>
      new Promise((resolve) => {
        signals.set(query, signal);
        resolvers.set(query, resolve);
      });
    await flush();
    const control = input(element);
    control.focus();
    type(control, 'v');
    type(control, 'vu');
    await flush();
    expect(signals.get('v')?.aborted).toBe(true);
    resolvers.get('v')?.(['Nieaktualne']);
    resolvers.get('vu')?.(['Vue']);
    await flush();

    expect(element.textContent).toContain('Vue');
    expect(element.textContent).not.toContain('Nieaktualne');
  });

  it('chroni disabled/readonly i tworzy osobne pola natywnego formularza', async () => {
    const element = await createTags({ value: ['Vue', 'React'] });
    element.disabledTags = ['Vue'];
    element.serializeTag = (tag) => getLabel(tag).toLocaleLowerCase();
    await flush();

    expect(element.querySelector('[aria-label="Usuń tag Vue"]')).toBeNull();
    expect(
      [...element.querySelectorAll<HTMLInputElement>('input[type="hidden"]')].map(
        (field) => field.value,
      ),
    ).toEqual(['vue', 'react']);

    element.readonly = true;
    await flush();
    expect(input(element).readOnly).toBe(true);
    element.disabled = true;
    await flush();
    expect(input(element).disabled).toBe(true);
  });
});

function getLabel(tag: FormTagsInputTag): string {
  return typeof tag === 'string' ? tag : tag.label;
}
