import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormCheckbox from '../form/FormCheckbox/index.wc';
import FormRadio from '../form/FormRadio/index.wc';
import FormButtonCheckbox from '../form/FormButtonCheckbox/index.wc';
import FormInput from '../form/FormInput/index.wc';
import FormPassword from '../form/FormPassword/index.wc';
import ModalDialog from '../overlayer/ModalDialog/index.wc';
import DrawerPanel from '../overlayer/DrawerPanel/index.wc';

afterEach(() => document.body.replaceChildren());

async function flush() {
  await nextTick();
  await nextTick();
  await nextTick();
}

describe('native element contracts', () => {
  for (const Element of [FormCheckbox, FormRadio, FormButtonCheckbox]) {
    it(`${Element.tagName} lets a controlled change restore its existing value`, async () => {
      const checkbox = new Element();
      Object.assign(checkbox, {
        id: 'accepted',
        name: 'accepted',
        value: true,
        optionValue: false,
      });
      document.body.append(checkbox);
      await flush();
      const listener = vi.fn(() => {
        checkbox.value = true;
      });
      checkbox.addEventListener('update:value', listener);
      const input = checkbox.querySelector('input')!;
      const initialChecked = input.checked;
      input.click();
      await flush();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(checkbox.value).toBe(true);
      expect(input.checked).toBe(initialChecked);
    });
  }

  for (const Element of [FormCheckbox, FormRadio, FormButtonCheckbox]) {
    it(`${Element.tagName} adds and removes an accessible label after connection`, async () => {
      const checkbox = new Element();
      Object.assign(checkbox, {
        id: 'accepted',
        name: 'accepted',
        value: false,
        optionValue: true,
      });
      document.body.append(checkbox);
      await flush();
      const label = document.createElement('span');
      label.textContent = 'Accept terms';
      checkbox.append(label);
      await flush();
      expect(checkbox.querySelector('label')?.contains(label)).toBe(true);
      expect(computeAccessibleName(checkbox.querySelector('input')!)).toBe('Accept terms');
      document.body.append(label);
      await flush();
      expect(checkbox.contains(label)).toBe(false);
      expect(computeAccessibleName(checkbox.querySelector('input')!)).toBe('accepted');
      checkbox.append(label);
      await flush();
      expect(checkbox.querySelector('label')?.contains(label)).toBe(true);
      expect(computeAccessibleName(checkbox.querySelector('input')!)).toBe('Accept terms');
      label.remove();
      await flush();
      expect(computeAccessibleName(checkbox.querySelector('input')!)).toBe('accepted');
    });
  }

  for (const Element of [ModalDialog, DrawerPanel]) {
    it(`${Element.tagName} updates its accessible name when a header is added, removed and restored`, async () => {
      const element = new Element();
      Object.assign(element, { open: false, ariaLabel: 'Fallback' });
      document.body.append(element);
      await flush();
      const dialog = element.querySelector('dialog')!;
      const header = document.createElement('span');
      header.slot = 'header';
      header.textContent = 'Confirm changes';
      element.append(header);
      await flush();
      expect(element.querySelector('header')?.contains(header)).toBe(true);
      expect(dialog.getAttribute('aria-labelledby')).toBe(element.querySelector('header')?.id);
      expect(dialog.hasAttribute('aria-label')).toBe(false);
      document.body.append(header);
      await flush();
      expect(element.querySelector('header')).toBeNull();
      expect(dialog.getAttribute('aria-label')).toBe('Fallback');
      expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
      element.append(header);
      await flush();
      expect(element.querySelector('header')?.contains(header)).toBe(true);
      header.remove();
      await flush();
      expect(element.querySelector('header')).toBeNull();
      expect(dialog.getAttribute('aria-label')).toBe('Fallback');
      expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
      element.append(header);
      await flush();
      expect(element.querySelector('header')?.contains(header)).toBe(true);
      expect(dialog.getAttribute('aria-labelledby')).toBe(element.querySelector('header')?.id);
    });
  }

  for (const Element of [FormInput, FormPassword]) {
    it(`${Element.tagName} forwards arbitrary native attribute additions, updates and removals`, async () => {
      const element = new Element();
      document.body.append(element);
      await flush();
      const input = element.querySelector('input')!;
      for (const name of ['aria-errormessage', 'data-native-test', 'autocomplete', 'pattern']) {
        for (const value of ['first', 'second', null]) {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
          await flush();
          expect(input.getAttribute(name), name).toBe(value);
        }
      }
      element.setAttribute('aria-invalid', 'true');
      await flush();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      element.removeAttribute('aria-invalid');
      await flush();
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });
  }

  it('applies changing numeric constraints to native form validity', async () => {
    const form = document.createElement('form');
    const element = new FormInput();
    element.setAttribute('type', 'number');
    element.setAttribute('max', '10');
    element.value = '8';
    form.append(element);
    document.body.append(form);
    await flush();
    const input = element.querySelector('input')!;
    expect(form.checkValidity()).toBe(true);
    element.setAttribute('max', '5');
    await flush();
    expect(input.validity.rangeOverflow).toBe(true);
    expect(form.checkValidity()).toBe(false);
    element.removeAttribute('max');
    element.setAttribute('min', '9');
    await flush();
    expect(input.validity.rangeUnderflow).toBe(true);
    element.setAttribute('min', '0');
    element.setAttribute('step', '3');
    await flush();
    expect(input.validity.stepMismatch).toBe(true);
    element.setAttribute('step', '2');
    await flush();
    expect(form.checkValidity()).toBe(true);
  });
});
