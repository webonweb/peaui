import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import InlineEdit from './index.vue';
import { inlineEditOptions } from './inline-edit.demo';

afterEach(() => document.body.replaceChildren());

describe('InlineEdit Vue', () => {
  it('edits a local draft, emits events in order and saves through existing controls', async () => {
    const wrapper = mount(InlineEdit, {
      attachTo: document.body,
      props: { dataTestId: 'inline', value: 'Panel klienta' },
    });

    expect(wrapper.text()).toContain('Panel klienta');
    await wrapper.get('[data-testid="inline-edit"]').trigger('click');
    await nextTick();

    const input = wrapper.get<HTMLInputElement>('[data-testid="inline-editor-element"]');
    expect(document.activeElement).toBe(input.element);
    await input.setValue('Panel partnera');
    expect(wrapper.emitted('draftChange')?.at(-1)?.[0]).toBe('Panel partnera');
    await wrapper.get('[data-testid="inline-save"]').trigger('click');

    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({
      previousValue: 'Panel klienta',
      value: 'Panel partnera',
    });
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toBe('Panel partnera');
    expect(wrapper.emitted('update:editing')?.map((event) => event[0])).toEqual([true, false]);
    expect(document.activeElement).toBe(wrapper.get('[data-testid="inline-edit"]').element);
  });

  it('cancels with Escape without losing the committed value and restores focus', async () => {
    const wrapper = mount(InlineEdit, {
      attachTo: document.body,
      props: { value: 'Oryginał' },
    });
    const trigger = wrapper.get<HTMLButtonElement>('button');
    await trigger.trigger('click');
    const input = wrapper.get<HTMLInputElement>('input');
    await input.setValue('Szkic');
    await input.trigger('keydown', { key: 'Escape' });
    await nextTick();

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(wrapper.emitted('cancel')?.[0]?.[0]).toBe('Oryginał');
    expect(wrapper.text()).toContain('Oryginał');
    expect(document.activeElement).toBe(wrapper.get('button').element);
  });

  it('connects validation feedback and shortcut instructions through ARIA', async () => {
    const invalid = vi.fn();
    const wrapper = mount(InlineEdit, {
      props: {
        actions: 'both',
        value: 'Nazwa',
        validate: (value: unknown) => (String(value).trim() ? true : 'Nazwa jest wymagana.'),
        onInvalid: invalid,
      },
    });
    await wrapper.get('button').trigger('click');
    const input = wrapper.get<HTMLInputElement>('input');
    await input.setValue('');
    await wrapper.findAll('button')[0]!.trigger('click');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toContain('-instructions');
    expect(input.attributes('aria-describedby')).toContain('-error');
    expect(wrapper.get('[role="alert"]').text()).toBe('Nazwa jest wymagana.');
    expect(invalid).toHaveBeenCalledOnce();
  });

  it('uses Ctrl+Enter for textarea and leaves plain Enter for multiline content', async () => {
    const wrapper = mount(InlineEdit, {
      props: { actions: 'keyboard', editor: 'textarea', value: 'Opis' },
    });
    await wrapper.get('button').trigger('click');
    const textarea = wrapper.get('textarea');
    await textarea.setValue('Nowy opis');
    await textarea.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('save')).toBeUndefined();
    await textarea.trigger('keydown', { ctrlKey: true, key: 'Enter' });
    expect(wrapper.emitted('save')).toHaveLength(1);
  });

  it('keeps async saves controlled and exposes the busy state', async () => {
    const wrapper = mount(InlineEdit, {
      props: { dataTestId: 'async', saveMode: 'async', value: 2, editor: 'number' },
    });
    await wrapper.get('button').trigger('click');
    await wrapper.get('input').setValue('3');
    await wrapper.get('[data-testid="async-save"]').trigger('click');

    expect(wrapper.emitted('save')?.[0]?.[0]).toEqual({ previousValue: 2, value: 3 });
    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(wrapper.find('[data-state="editing-dirty"]').exists()).toBe(true);

    await wrapper.setProps({ loading: true });
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true);
    expect(wrapper.get('[role="status"]').text()).toContain('Zapisywanie');
  });

  it('renders select labels and keeps a visible button for double-click activation', async () => {
    const wrapper = mount(InlineEdit, {
      props: {
        activation: 'dblclick',
        editor: 'select',
        editorProps: { options: inlineEditOptions, searchable: false },
        value: 'review',
      },
    });
    expect(wrapper.text()).toContain('Do weryfikacji');
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edytuj wartość');
    await wrapper.get('.peaui-inline-edit__display').trigger('dblclick');
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true);
  });

  it('does not expose activation for readonly and blocks disabled editing', async () => {
    const readonlyWrapper = mount(InlineEdit, { props: { readonly: true, value: 'Stałe' } });
    expect(readonlyWrapper.find('button').exists()).toBe(false);

    const disabledWrapper = mount(InlineEdit, { props: { disabled: true, value: 'Wyłączone' } });
    await disabledWrapper.get('button').trigger('click');
    expect(disabledWrapper.find('input').exists()).toBe(false);
    expect(disabledWrapper.find('[aria-disabled="true"]').exists()).toBe(true);
  });
});
