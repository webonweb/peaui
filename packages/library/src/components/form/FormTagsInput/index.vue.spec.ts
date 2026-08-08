import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FormTagsInput from './index.vue';

const mounted: Array<ReturnType<typeof mount>> = [];

function createTags(props: Record<string, unknown> = {}) {
  const wrapper = mount(FormTagsInput, {
    attachTo: document.body,
    props: {
      id: 'skills',
      label: 'Umiejętności',
      name: 'skills',
      dataTestId: 'tags',
      ...props,
    },
  });
  mounted.push(wrapper);
  return wrapper;
}

async function enterTag(wrapper: ReturnType<typeof mount>, tag: string): Promise<void> {
  const input = wrapper.get('input[role="combobox"]');
  await input.setValue(tag);
  await input.trigger('keydown', { key: 'Enter' });
}

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
});

describe('FormTagsInput Vue', () => {
  it('renderuje nazwany combobox, opis, błąd i jeden live region', () => {
    const wrapper = createTags({
      description: 'Dodaj słowa kluczowe.',
      error: 'Wymagany jest co najmniej jeden tag.',
      required: true,
    });
    const input = wrapper.get('input[role="combobox"]');

    expect(input.attributes('aria-labelledby')).toBe('label-skills-input');
    expect(wrapper.get('label').classes()).toContain('peaui-form-label');
    expect(input.attributes('aria-describedby')).toContain('skills-description');
    expect(input.attributes('aria-describedby')).toContain('skills-error');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('required')).toBeDefined();
    expect(wrapper.findAll('[role="status"]')).toHaveLength(1);
  });

  it('składa kontrolkę ze wspólnego PopoverOverlayer i osobnej listy tagów', async () => {
    const wrapper = createTags({ suggestions: ['Vue', 'React'], value: ['Vue', 'React'] });
    const input = wrapper.get('input[role="combobox"]');

    expect(wrapper.get('.peaui-form-tags-input__overlayer').classes()).toEqual(
      expect.arrayContaining([
        'peaui-popover-overlayer',
        'peaui-popover-overlayer--match-trigger-width',
      ]),
    );
    expect(wrapper.get('.peaui-form-tags-input__tags').element.tagName).toBe('UL');
    expect(
      wrapper.findAll('.peaui-form-tags-input__tags > .peaui-form-tags-input__tag'),
    ).toHaveLength(2);

    await input.trigger('focus');
    expect(input.attributes('aria-haspopup')).toBe('listbox');
    expect(
      wrapper.get('.peaui-form-tags-input__tag-main').attributes('aria-controls'),
    ).toBeUndefined();
    expect(wrapper.get('.peaui-form-tags-input__popover-content').attributes('popover')).toBe(
      'auto',
    );
  });

  it('dodaje tag Enterem i separatorem oraz czyści edytor', async () => {
    const wrapper = createTags();
    const input = wrapper.get('input[role="combobox"]');

    await enterTag(wrapper, 'Vue');
    await input.setValue('React');
    await input.trigger('keydown', { key: ',' });

    expect(wrapper.findAll('.peaui-form-tags-input__tag')).toHaveLength(2);
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual(['Vue', 'React']);
    expect(wrapper.emitted('add')).toHaveLength(2);
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('odrzuca duplikat po normalizacji bez zmiany modelu', async () => {
    const wrapper = createTags({ normalizeTag: (input: string) => input.toLocaleLowerCase() });
    await enterTag(wrapper, 'Vue');
    await enterTag(wrapper, ' VUE ');

    expect(wrapper.findAll('.peaui-form-tags-input__tag')).toHaveLength(1);
    expect(wrapper.emitted('invalidTag')?.at(-1)?.[0]).toMatchObject({ reason: 'duplicate' });
    expect(wrapper.get('[role="status"]').text()).toContain('już dodany');
  });

  it('waliduje każdy element paste i emituje jeden spójny model', async () => {
    const wrapper = createTags({
      max: 3,
      validateTag: (tag: string) => tag.length >= 3 || 'Minimum 3 znaki.',
    });
    const input = wrapper.get('input[role="combobox"]');

    await input.trigger('paste', {
      clipboardData: { getData: () => 'Vue, UI; React, Web Components' },
    });

    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual([
      'Vue',
      'React',
      'Web Components',
    ]);
    expect(wrapper.emitted('invalidTag')?.map((entry) => entry[0])).toEqual([
      expect.objectContaining({ reason: 'invalid' }),
    ]);
    expect(wrapper.emitted('maxReached')).toBeUndefined();
  });

  it('Backspace najpierw zaznacza ostatni tag, a dopiero potem go usuwa', async () => {
    const wrapper = createTags();
    await enterTag(wrapper, 'Vue');
    await enterTag(wrapper, 'React');
    const input = wrapper.get('input[role="combobox"]');

    await input.trigger('keydown', { key: 'Backspace' });
    expect(wrapper.findAll('.peaui-form-tags-input__tag')[1]?.classes()).toContain(
      'peaui-form-tags-input__tag--selected',
    );
    expect(wrapper.findAll('.peaui-form-tags-input__tag')).toHaveLength(2);

    await input.trigger('keydown', { key: 'Backspace' });
    expect(wrapper.findAll('.peaui-form-tags-input__tag')).toHaveLength(1);
    expect(wrapper.emitted('remove')?.at(-1)?.[0]).toBe('React');
  });

  it('edytuje tag w jawnym trybie F2 i pozwala anulować Escape', async () => {
    const wrapper = createTags();
    await enterTag(wrapper, 'Vue');
    const input = wrapper.get('input[role="combobox"]');
    await input.trigger('keydown', { key: 'ArrowLeft' });
    const tagButton = wrapper.get('.peaui-form-tags-input__tag-main');

    await tagButton.trigger('keydown', { key: 'F2' });
    expect((input.element as HTMLInputElement).value).toBe('Vue');
    expect(wrapper.get('.peaui-form-tags-input__tag').classes()).toContain(
      'peaui-form-tags-input__tag--editing',
    );
    await input.setValue('Vue 3');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('edit')?.at(-1)?.slice(0, 3)).toEqual(['Vue', 'Vue 3', 0]);

    await wrapper.get('.peaui-form-tags-input__tag-main').trigger('keydown', { key: 'F2' });
    await input.setValue('Anulowane');
    await input.trigger('keydown', { key: 'Escape' });
    expect(wrapper.text()).toContain('Vue 3');
    expect(wrapper.text()).not.toContain('Anulowane');
  });

  it('obsługuje listbox sugestii, aria-activedescendant i wybór klawiaturą', async () => {
    const wrapper = createTags({ suggestions: ['Vue', 'React', 'Web Components'] });
    const input = wrapper.get('input[role="combobox"]');
    await input.trigger('focus');
    await input.setValue('rea');
    await input.trigger('keydown', { key: 'ArrowDown' });

    expect(input.attributes('aria-expanded')).toBe('true');
    expect(input.attributes('aria-activedescendant')).toBe('skills-suggestion-0');
    const overlay = wrapper.get('.peaui-form-tags-input__popover-content');
    expect(overlay.classes()).toContain('peaui-popover-overlayer__content');
    expect(overlay.classes()).toContain('peaui-popover-overlayer__content--match-trigger-width');
    expect(wrapper.get('[role="option"]').text()).toBe('React');
    await input.trigger('keydown', { key: 'Enter' });
    expect(wrapper.get('.peaui-form-tags-input__tag-label').text()).toBe('React');
    expect(input.attributes('aria-expanded')).toBe('false');
  });

  it('w trybie suggestions-only nie pozwala ominąć listy przez Enter', async () => {
    const wrapper = createTags({
      allowCreate: false,
      mode: 'suggestions-only',
      suggestions: [{ id: 1, label: 'Vue', value: 'vue' }],
    });
    await enterTag(wrapper, 'Inny');

    expect(wrapper.findAll('.peaui-form-tags-input__tag')).toHaveLength(0);
    expect(wrapper.emitted('invalidTag')?.at(-1)?.[0]).toMatchObject({
      reason: 'suggestion-only',
    });
  });

  it('chroni disabled tag oraz cały komponent disabled/readonly', async () => {
    const wrapper = createTags({ disabledTags: ['Vue'] });
    await enterTag(wrapper, 'Vue');
    expect(wrapper.find('.peaui-form-tags-input__remove').exists()).toBe(false);
    expect(wrapper.get('.peaui-form-tags-input__tag-main').attributes('aria-disabled')).toBe(
      'true',
    );

    await wrapper.setProps({ disabled: true });
    expect(wrapper.get('input[role="combobox"]').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, readonly: true });
    expect(wrapper.get('input[role="combobox"]').attributes('readonly')).toBeDefined();
  });

  it('tworzy osobne natywne wartości formularza i używa serializera', async () => {
    const wrapper = createTags({ serializeTag: (tag: string) => tag.toLocaleLowerCase() });
    await enterTag(wrapper, 'Vue');
    await enterTag(wrapper, 'React');

    const fields = wrapper.findAll('input[type="hidden"]');
    expect(fields).toHaveLength(2);
    expect(fields.map((field) => field.attributes('value'))).toEqual(['vue', 'react']);
    expect(fields.every((field) => field.attributes('name') === 'skills')).toBe(true);
  });

  it('anuluje starsze zapytanie asynchroniczne i zachowuje najnowszy wynik', async () => {
    const resolvers = new Map<string, (value: readonly string[]) => void>();
    const aborted: string[] = [];
    const provider = vi.fn(
      (query: string, signal: AbortSignal) =>
        new Promise<readonly string[]>((resolve) => {
          resolvers.set(query, resolve);
          signal.addEventListener('abort', () => aborted.push(query));
        }),
    );
    const wrapper = createTags({ suggestionProvider: provider });
    const input = wrapper.get('input[role="combobox"]');
    await input.trigger('focus');
    await Promise.resolve();
    await input.setValue('v');
    await Promise.resolve();
    await input.setValue('vu');
    await Promise.resolve();

    expect(provider).toHaveBeenCalledWith('vu', expect.any(AbortSignal));
    expect(aborted.length).toBeGreaterThan(0);
    resolvers.get('v')?.(['Nieaktualne']);
    resolvers.get('vu')?.(['Vue']);
    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.text()).toContain('Vue');
    expect(wrapper.text()).not.toContain('Nieaktualne');
  });
});
