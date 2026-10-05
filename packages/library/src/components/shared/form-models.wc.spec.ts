import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName, computeAccessibleDescription } from 'dom-accessibility-api';
import FormInput from '../form/FormInput/index.wc';
import FormSelect from '../form/FormSelect/index.wc';
import FormCheckbox from '../form/FormCheckbox/index.wc';
import FormTextarea from '../form/FormTextarea/index.wc';

afterEach(() => document.body.replaceChildren());
async function mount(
  Element: CustomElementConstructor,
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
) {
  const element = new Element();
  Object.assign(element, props);
  for (const [name, text] of Object.entries(slots)) {
    const span = document.createElement('span');
    if (name !== 'default') span.slot = name;
    span.textContent = text;
    element.append(span);
  }
  document.body.append(element);
  await nextTick();
  return element;
}
describe('shared form contracts: Web Components', () => {
  for (const [name, Element] of [
    ['Input', FormInput],
    ['Textarea', FormTextarea],
  ] as const) {
    for (const slot of ['description', 'error', 'success']) {
      it(`${name} connects the real ${slot} slot to its control`, async () => {
        const element = await mount(
          Element,
          { id: 'field', name: 'field', label: 'Field', value: '' },
          { [slot]: 'Supporting text' },
        );
        expect(computeAccessibleDescription(element.querySelector('input,textarea')!)).toBe(
          'Supporting text',
        );
      });
    }
  }
  it('respects an explicit accessible name in Select', async () => {
    const element = await mount(FormSelect, {
      id: 'select',
      name: 'machine',
      value: '',
      options: [],
    });
    element.setAttribute('aria-label', 'Choose a country');
    await nextTick();
    expect(computeAccessibleName(element.querySelector('input')!)).toBe('Choose a country');
  });
  it('does not expose a destructive action for a readonly input', async () => {
    const element = await mount(FormInput, {
      id: 'field',
      name: 'field',
      value: 'Keep',
      readonly: true,
      canErase: true,
    });
    expect(element.querySelector('.peaui-form-field__erase-button')).toBeNull();
  });
  it('labels the inner input while keeping every ID unique', async () => {
    const element = await mount(FormInput, {
      id: 'field',
      name: 'field',
      label: 'Field',
      value: '',
    });
    expect(computeAccessibleName(element.querySelector('input')!)).toContain('Field');
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('preserves checked state when disabled and enforces required when enabled', async () => {
    const element = await mount(
      FormCheckbox,
      { id: 'choice', name: 'choice', value: true, disabled: true, required: true },
      { default: 'Accept terms' },
    );
    const input = element.querySelector('input')!;
    expect(input.checked).toBe(true);
    Object.assign(element, { disabled: false, value: false });
    await nextTick();
    expect(input.validity.valueMissing).toBe(true);
  });
  it('projects named slots added and removed after mount, preserving their node identity', async () => {
    const element = await mount(FormTextarea, {
      id: 'field',
      name: 'field',
      label: 'Field',
      value: '',
    });
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Late description';
    element.append(description);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(element.contains(description)).toBe(true);
    expect(computeAccessibleDescription(element.querySelector('textarea')!)).toBe(
      'Late description',
    );
    description.remove();
    await nextTick();
    await nextTick();
    await nextTick();
    expect(computeAccessibleDescription(element.querySelector('textarea')!)).toBe('');
  });
});
