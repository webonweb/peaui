import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import { FormCheckboxElement, defineFormCheckbox } from '@/components/form/FormCheckbox/index.wc';
import { FormInputElement, defineFormInput } from '@/components/form/FormInput/index.wc';
import { FormPasswordElement, defineFormPassword } from '@/components/form/FormPassword/index.wc';

defineFormCheckbox();
defineFormInput();
defineFormPassword();

async function flushCustomElements(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await nextTick();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Web Components native form integration', () => {
  it('synchronizes a Vue-backed checkbox property and restores it after reset', async () => {
    const form = document.createElement('form');
    const checkbox = new FormCheckboxElement();
    checkbox.value = true;
    checkbox.setAttribute('name', 'accepted');
    form.append(checkbox);
    document.body.append(form);
    await flushCustomElements();
    const control = checkbox.querySelector('input')!;
    control.checked = false;
    control.dispatchEvent(new Event('change', { bubbles: true }));
    await flushCustomElements();
    expect(checkbox.value).toBe(false);
    form.reset();
    await flushCustomElements();
    expect(checkbox.value).toBe(true);
    expect(control.checked).toBe(true);
    expect(new FormData(form).get('accepted')).toBe('on');
  });

  it('restores initial values on reset and respects canceled resets', async () => {
    const form = document.createElement('form');
    const input = new FormInputElement();
    input.name = 'name';
    input.value = 'Ada';
    form.append(input);
    document.body.append(form);
    await flushCustomElements();
    const control = input.querySelector('input')!;
    control.value = 'Grace';
    control.dispatchEvent(new Event('input', { bubbles: true }));
    form.reset();
    await flushCustomElements();
    expect(input.value).toBe('Ada');
    expect(control.value).toBe('Ada');
    input.value = 'Keep';
    form.addEventListener('reset', (event) => event.preventDefault(), { once: true });
    form.reset();
    await flushCustomElements();
    expect(input.value).toBe('Keep');
  });

  it('uses external forms, disabled fieldsets and native required validation', async () => {
    const form = document.createElement('form');
    form.id = 'external-form';
    const fieldset = document.createElement('fieldset');
    const input = new FormInputElement();
    input.name = 'name';
    input.required = true;
    input.setAttribute('form', form.id);
    fieldset.append(input);
    document.body.append(form, fieldset);
    await flushCustomElements();
    expect(form.checkValidity()).toBe(false);
    input.value = 'Ada';
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('name')).toBe('Ada');
    fieldset.disabled = true;
    expect(new FormData(form).has('name')).toBe(false);
  });
  it('submits current text, password and checked checkbox values through FormData', async () => {
    const form = document.createElement('form');
    const input = document.createElement(FormInputElement.tagName) as FormInputElement;
    const password = document.createElement(FormPasswordElement.tagName) as FormPasswordElement;
    const checkbox = document.createElement(FormCheckboxElement.tagName) as InstanceType<
      typeof FormCheckboxElement
    > & {
      value: boolean;
    };

    input.id = 'profile-name';
    input.name = 'profileName';
    input.value = 'Ada';
    password.id = 'account-password';
    password.name = 'password';
    password.value = 'correct horse';
    checkbox.id = 'terms';
    checkbox.setAttribute('name', 'terms');
    checkbox.value = true;

    form.append(input, password, checkbox);
    document.body.appendChild(form);
    await flushCustomElements();

    const data = new FormData(form);

    expect(data.get('profileName')).toBe('Ada');
    expect(data.get('password')).toBe('correct horse');
    expect(data.get('terms')).toBe('on');
  });

  it('tracks user edits and excludes disabled or unchecked controls', async () => {
    const form = document.createElement('form');
    const input = document.createElement(FormInputElement.tagName) as FormInputElement;
    const checkbox = document.createElement(FormCheckboxElement.tagName) as InstanceType<
      typeof FormCheckboxElement
    > & {
      disabled: boolean;
      value: boolean;
    };

    input.id = 'search';
    input.name = 'query';
    input.value = 'before';
    checkbox.id = 'newsletter';
    checkbox.setAttribute('name', 'newsletter');
    checkbox.value = true;

    form.append(input, checkbox);
    document.body.appendChild(form);
    await flushCustomElements();

    const nativeInput = input.querySelector<HTMLInputElement>('input');
    const nativeCheckbox = checkbox.querySelector<HTMLInputElement>('input[type="checkbox"]');

    expect(nativeInput).not.toBeNull();
    expect(nativeCheckbox).not.toBeNull();

    nativeInput!.value = 'after';
    nativeInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    nativeCheckbox!.checked = false;
    nativeCheckbox!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await flushCustomElements();

    let data = new FormData(form);

    expect(data.get('query')).toBe('after');
    expect(data.has('newsletter')).toBe(false);

    input.disabled = true;
    checkbox.disabled = true;
    await flushCustomElements();
    data = new FormData(form);

    expect(data.has('query')).toBe(false);
    expect(data.has('newsletter')).toBe(false);
  });
});
