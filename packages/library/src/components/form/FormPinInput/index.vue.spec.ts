import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import FormPinInput from './index.vue';

function mountControlled(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
): VueWrapper {
  let wrapper: VueWrapper;
  wrapper = mount(FormPinInput, {
    attachTo: document.body,
    props: {
      dataTestId: 'pin',
      value: '',
      ...props,
      'onUpdate:value': (next: string) => wrapper.setProps({ value: next }),
    },
    slots,
  });
  return wrapper;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FormPinInput Vue', () => {
  it('renderuje jedną nazwaną grupę i jednoznacznie opisane komórki', () => {
    const wrapper = mountControlled({
      description: 'Wpisz kod z wiadomości.',
      error: 'Kod jest niepoprawny.',
      label: 'Kod weryfikacyjny',
      required: true,
    });
    const group = wrapper.get('[role="group"]');
    const cells = wrapper.findAll('input.peaui-form-pin-input__cell');

    expect(group.attributes('aria-labelledby')).toBeTruthy();
    expect(group.attributes('aria-describedby')).toContain('-description');
    expect(group.attributes('aria-describedby')).toContain('-error');
    expect(group.attributes('aria-invalid')).toBe('true');
    expect(cells).toHaveLength(6);
    expect(cells[0]?.attributes('aria-label')).toBe('Cyfra 1 z 6');
    expect(cells[5]?.attributes('aria-label')).toBe('Cyfra 6 z 6');
    expect(cells.every((cell) => cell.attributes('aria-required') === 'true')).toBe(true);
  });

  it('zachowuje zera, aktualizuje model i automatycznie przesuwa fokus', async () => {
    const wrapper = mountControlled();
    const first = wrapper.get<HTMLInputElement>('[data-testid="pin-cell-0"]');

    await first.trigger('keydown', { key: '0' });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['0']);
    expect(document.activeElement).toBe(wrapper.get('[data-testid="pin-cell-1"]').element);

    await wrapper.get('[data-testid="pin-cell-1"]').trigger('keydown', { key: '0' });
    expect(wrapper.emitted('update:value')?.[1]).toEqual(['00']);
  });

  it('wkleja kod, filtruje znaki i zgłasza nadmiar bez przekroczenia długości', async () => {
    const wrapper = mountControlled();
    const clipboardData = { getData: () => '12a345678' };
    await wrapper.get('[data-testid="pin-cell-0"]').trigger('paste', { clipboardData });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:value')?.[0]).toEqual(['123456']);
    expect(wrapper.emitted('complete')?.[0]?.[0]).toBe('123456');
    expect(wrapper.emitted('invalidInput')?.[0]?.[0]).toMatchObject({
      input: '12a345678',
      rejected: 'a78',
    });
  });

  it('nie powiela complete bez realnej zmiany kompletnego kodu', async () => {
    const wrapper = mountControlled({ length: 2 });
    await wrapper.get('[data-testid="pin-cell-0"]').trigger('keydown', { key: '1' });
    await wrapper.vm.$nextTick();
    await wrapper.get('[data-testid="pin-cell-1"]').trigger('keydown', { key: '2' });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('complete')).toHaveLength(1);

    await wrapper.get('[data-testid="pin-cell-1"]').trigger('keydown', { key: '2' });
    expect(wrapper.emitted('complete')).toHaveLength(1);
    await wrapper.get('[data-testid="pin-cell-1"]').trigger('keydown', { key: '3' });
    expect(wrapper.emitted('complete')).toHaveLength(2);
  });

  it('usuwa znak ze środka bez gubienia pozostałej wartości', async () => {
    const wrapper = mountControlled({ value: '1234' });
    await wrapper.get('[data-testid="pin-cell-1"]').trigger('keydown', { key: 'Delete' });
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['134']);
  });

  it('cofa Backspace do poprzedniej pustej komórki', async () => {
    const wrapper = mountControlled({ value: '12' });
    const third = wrapper.get('[data-testid="pin-cell-2"]');
    await third.trigger('focus');
    await third.trigger('keydown', { key: 'Backspace' });
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['1']);
    expect(document.activeElement).toBe(wrapper.get('[data-testid="pin-cell-1"]').element);
  });

  it('obsługuje strzałki, Home i End w modelu roving tabindex', async () => {
    const wrapper = mountControlled();
    const first = wrapper.get<HTMLInputElement>('[data-testid="pin-cell-0"]');
    await first.trigger('focus');
    await first.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(wrapper.get('[data-testid="pin-cell-5"]').element);
    expect(wrapper.get('[data-testid="pin-cell-5"]').attributes('tabindex')).toBe('0');

    await wrapper.get('[data-testid="pin-cell-5"]').trigger('keydown', { key: 'Home' });
    expect(document.activeElement).toBe(first.element);
  });

  it('maskuje komórki bez zmiany wartości wysyłanej przez formularz', () => {
    const wrapper = mountControlled({ mask: true, name: 'otp', value: '0123' });
    expect(wrapper.get('[data-testid="pin-cell-0"]').attributes('type')).toBe('password');
    expect(wrapper.get('input[type="hidden"]').attributes('value')).toBe('0123');
    expect(wrapper.get('input[type="hidden"]').attributes('name')).toBe('otp');
  });

  it('renderuje grupowanie i niestandardowy separator jako dekoracyjne', () => {
    const wrapper = mountControlled(
      { length: 6, separatorEvery: 3 },
      { separator: '<strong data-separator>·</strong>' },
    );
    const separator = wrapper.get('.peaui-form-pin-input__separator');
    expect(separator.attributes('aria-hidden')).toBe('true');
    expect(wrapper.findAll('[data-separator]')).toHaveLength(1);
  });

  it.each(['disabled', 'readonly', 'loading'] as const)(
    'blokuje zmianę w stanie %s',
    async (state) => {
      const wrapper = mountControlled({ [state]: true });
      await wrapper.get('[data-testid="pin-cell-0"]').trigger('keydown', { key: '1' });
      expect(wrapper.emitted('update:value')).toBeUndefined();
      const group = wrapper.get('[role="group"]');
      if (state === 'readonly') {
        expect(group.attributes('aria-readonly')).toBeUndefined();
        expect(wrapper.get('[data-testid="pin-cell-0"]').attributes('aria-readonly')).toBe('true');
      } else {
        expect(group.attributes(`aria-${state === 'loading' ? 'busy' : state}`)).toBe('true');
      }
    },
  );

  it('emituje blur dopiero po opuszczeniu całej grupy', async () => {
    const wrapper = mountControlled();
    const first = wrapper.get('[data-testid="pin-cell-0"]');
    const second = wrapper.get('[data-testid="pin-cell-1"]');
    await first.trigger('focus');
    await first.trigger('focusout', { relatedTarget: second.element });
    expect(wrapper.emitted('blur')).toBeUndefined();
    await second.trigger('focusout', { relatedTarget: document.body });
    expect(wrapper.emitted('blur')).toHaveLength(1);
  });
});
