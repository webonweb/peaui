import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import FormInput, { FormInputElement } from '../form/FormInput/index.wc';
import FormNumber from '../form/FormNumber/index.wc';
import FormSelect from '../form/FormSelect/index.wc';
import FormMultiSelect from '../form/FormMultiSelect/index.wc';

afterEach(() => document.body.replaceChildren());
describe('regressions: Web Component form contracts', () => {
  it('recovers properties assigned before custom element registration', async () => {
    const tag = 'test-late-form-input';
    const element = document.createElement(tag) as FormInputElement;
    element.value = 'Before';
    element.disabled = true;
    document.body.append(element);
    customElements.define(tag, class extends FormInputElement {});
    element.value = 'After';
    element.disabled = false;
    await nextTick();
    expect(element.querySelector('input')!.value).toBe('After');
    expect(element.querySelector('input')!.disabled).toBe(false);
  });
  it('updates native input attributes after connection', async () => {
    const form = document.createElement('form');
    form.id = 'external';
    document.body.append(form);
    const element = new FormInput();
    document.body.append(element);
    for (const [name, value] of Object.entries({
      type: 'email',
      autocomplete: 'email',
      pattern: '.+@example.com',
      form: 'external',
    }))
      element.setAttribute(name, value);
    await nextTick();
    const input = element.querySelector('input')!;
    expect(input.type).toBe('email');
    expect(input.autocomplete).toBe('email');
    expect(input.pattern).toBe('.+@example.com');
    expect(input.form).toBe(form);
    element.removeAttribute('pattern');
    await nextTick();
    expect(input.pattern).toBe('');
  });
  it('keeps zero number bounds and does not turn an empty value into zero', async () => {
    const element = new FormNumber();
    Object.assign(element, { id: 'number', name: 'number', value: 1, min: 0, max: 0 });
    document.body.append(element);
    await nextTick();
    const input = element.querySelector('input')!;
    expect(input.min).toBe('0');
    expect(input.max).toBe('0');
    input.value = '';
    input.dispatchEvent(new Event('blur'));
    await nextTick();
    expect(element.value).toBeUndefined();
  });
  it('normalizes disabled=false consistently for behavior and appearance', async () => {
    const element = new FormNumber();
    Object.assign(element, { id: 'number', name: 'number', value: 1 });
    element.setAttribute('disabled', 'false');
    document.body.append(element);
    await nextTick();
    const input = element.querySelector('input')!;
    expect(input.disabled).toBe(false);
    expect(input.classList.contains('peaui-form-field__element--disabled')).toBe(false);
  });
  for (const multi of [false, true]) {
    it(`serializes ${multi ? 'multiple' : 'single'} selected values`, async () => {
      const form = document.createElement('form');
      document.body.append(form);
      const element = multi ? new FormMultiSelect() : new FormSelect();
      Object.assign(element, {
        id: 'choice',
        name: 'choice',
        value: multi ? ['a', 'b'] : 'b',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ],
      });
      form.append(element);
      await nextTick();
      expect(new FormData(form).getAll('choice')).toEqual(multi ? ['a', 'b'] : ['b']);
    });
  }
  it('enforces select-only required validation with a focusable visible control', async () => {
    const form = document.createElement('form');
    document.body.append(form);
    const element = new FormSelect();
    Object.assign(element, {
      id: 'choice',
      name: 'choice',
      value: '',
      options: [],
      required: true,
      searchable: false,
    });
    form.append(element);
    await nextTick();
    expect(form.reportValidity()).toBe(false);
    expect(document.activeElement).toBe(element.querySelector('input[role="combobox"]'));
    Object.assign(element, { value: 'a', options: [{ value: 'a', label: 'Alpha' }] });
    await nextTick();
    expect(element.querySelector('input')?.getAttribute('aria-invalid')).not.toBe('true');
  });
});
