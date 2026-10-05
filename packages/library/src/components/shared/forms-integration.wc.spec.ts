import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FormButtonCheckbox from '../form/FormButtonCheckbox/index.wc';
import FormTimePicker from '../form/FormTimePicker/index.wc';
import FormDateTimePicker from '../form/FormDateTimePicker/index.wc';
import FormColorPicker from '../form/FormColorPicker/index.wc';
import FormDateRangePicker from '../form/FormDateRangePicker/index.wc';
import FormPinInput from '../form/FormPinInput/index.wc';
import FormTagsInput from '../form/FormTagsInput/index.wc';
import FormRatingInput from '../form/FormRatingInput/index.wc';
import FormButtonGroup from '../form/FormButtonGroup/index.wc';
import InputSlider from '../data-entry/InputSlider/index.wc';
import ButtonAction from '../data-entry/ButtonAction/index.wc';
import FormFieldLabel from '../form/FormFieldLabel/index.wc';

afterEach(() => document.body.replaceChildren());
const settle = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await nextTick();
  await nextTick();
  await nextTick();
};
async function fixture(
  Element: CustomElementConstructor,
  props: Record<string, unknown>,
  external = false,
) {
  props = { id: 'field', text: 'Field', ...props };
  const form = document.createElement('form');
  form.id = 'owner';
  const element = new Element();
  for (const [key, value] of Object.entries(props)) {
    if (key === 'form' || key === 'id' || key === 'name') element.setAttribute(key, String(value));
    else Object.assign(element, { [key]: value });
  }
  if (external) document.body.append(form, element);
  else {
    form.append(element);
    document.body.append(form);
  }
  await settle();
  return { element, form };
}
describe('form integration: Web Components', () => {
  for (const [name, component, value] of [
    ['Color', FormColorPicker, '#4C9A2A'],
    ['Time', FormTimePicker, '10:30'],
    ['DateTime', FormDateTimePicker, { date: '2026-10-02', time: '10:30' }],
    ['DateRange', FormDateRangePicker, ['2026-10-02', '2026-10-05']],
  ] as const) {
    it(`V-F01 resets invalid ${name} text and error when the public value is unchanged`, async () => {
      const { element, form } = await fixture(component, { value, name: 'field' });
      const input = element.querySelector<HTMLInputElement>(
        'input:not([type=hidden]):not([aria-hidden=true])',
      )!;
      const before = input.value;
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('blur'));
      await settle();
      expect(input.value).not.toBe(before);
      form.reset();
      await settle();
      expect(input.value).toBe(before);
      expect(input.getAttribute('aria-invalid')).not.toBe('true');
    });
  }
  it('V-F02 uses native required validation for button checkbox', async () => {
    const { element, form } = await fixture(FormButtonCheckbox, { name: 'agree', required: true });
    expect(form.checkValidity()).toBe(false);
    element.querySelector('input')!.click();
    await settle();
    expect(form.checkValidity()).toBe(true);
  });
  it('V-F03 validates empty segmented time', async () => {
    const { form } = await fixture(FormTimePicker, {
      name: 'time',
      variant: 'segmented',
      required: true,
    });
    expect(form.checkValidity()).toBe(false);
  });
  it('V-F03 omits disabled segmented time', async () => {
    const { form } = await fixture(FormTimePicker, {
      name: 'time',
      variant: 'segmented',
      value: '10:30',
      disabled: true,
    });
    expect([...new FormData(form)]).toEqual([]);
  });
  it('V-F04 preserves split date-time serialization', async () => {
    const { form } = await fixture(FormDateTimePicker, {
      name: 'when',
      variant: 'split-input',
      value: { date: '2026-10-02', time: '10:30' },
      required: true,
    });
    expect([...new FormData(form)]).toEqual([
      ['when', '02.10.2026'],
      ['when', '10:30'],
    ]);
  });
  for (const [name, component, selector] of [
    ['Pin', FormPinInput, 'input:not([type=hidden])'],
    ['Tags', FormTagsInput, 'input:not([type=hidden])'],
    ['Rating', FormRatingInput, 'input[type=range]'],
  ] as const) {
    it(`V-F05 associates ${name} visible control with external form`, async () => {
      const { element, form } = await fixture(
        component,
        { name: 'field', form: 'owner', required: true },
        true,
      );
      expect(element.querySelector<HTMLInputElement>(selector)!.form).toBe(form);
      expect(form.checkValidity()).toBe(false);
    });
  }
  it('V-F06 associates slider with external form', async () => {
    const { element, form } = await fixture(
      InputSlider,
      { id: 'volume', name: 'volume', form: 'owner', value: 0.5 },
      true,
    );
    expect(element.querySelector('input')!.form).toBe(form);
    expect([...new FormData(form)]).toEqual([['volume', '0.5']]);
  });
  it('V-F09 uses one active fallback for required selection and submission', async () => {
    const { element, form } = await fixture(FormButtonGroup, {
      name: 'choice',
      required: true,
      options: [
        { key: 'a', label: 'Alpha', active: true },
        { key: 'b', label: 'Beta', active: true },
      ],
    });
    expect(element.querySelectorAll('[role=radio][aria-checked=true]')).toHaveLength(1);
    expect(form.checkValidity()).toBe(true);
    expect([...new FormData(form)]).toEqual([['choice', 'a']]);
  });
  it('V-F09 permits toggling active default off, reset, and explicit clearing', async () => {
    const { element, form } = await fixture(FormButtonGroup, {
      name: 'choice',
      isToggle: true,
      options: [{ key: 'a', label: 'Alpha', active: true }],
    });
    element.querySelector<HTMLButtonElement>('[role=radio]')!.click();
    await settle();
    expect(element.querySelector('[role=radio]')!.getAttribute('aria-checked')).toBe('false');
    form.reset();
    await settle();
    expect(element.querySelector('[role=radio]')!.getAttribute('aria-checked')).toBe('true');
    Object.assign(element, { value: undefined });
    await settle();
    expect(element.querySelector('[role=radio]')!.getAttribute('aria-checked')).toBe('false');
  });
  for (const [name, Element, selector] of [
    ['Button', ButtonAction, 'button'],
    ['FieldLabel', FormFieldLabel, 'label'],
  ] as const) {
    it(`V-F14 keeps ${name} host and native ids unique`, async () => {
      const { element } = await fixture(Element, { id: 'field', for: 'target' });
      expect(document.querySelectorAll('#field')).toHaveLength(1);
      expect(element.querySelector(selector)!.id).not.toBe('field');
      element.id = 'updated';
      await settle();
      expect(element.querySelector(selector)!.id).toBe('updated-control');
      element.removeAttribute('id');
      await settle();
      expect(element.querySelector(selector)!.id).toBe(name === 'Button' ? '' : 'label-target');
    });
  }
  it('V-F13 filters suggestions with linear identity reads', async () => {
    const tags = Array.from({ length: 200 }, (_, i) => ({ id: i, label: `Tag ${i}` }));
    const suggestions = Array.from({ length: 200 }, (_, i) => ({
      id: i + 200,
      label: `Next ${i}`,
    }));
    const getTagKey = vi.fn((tag: { id: number }) => tag.id);
    const { element } = await fixture(FormTagsInput, {
      name: 'tags',
      value: tags,
      suggestions,
      getTagKey,
    });
    element.querySelector<HTMLInputElement>('input:not([type=hidden])')!.focus();
    await settle();
    expect(getTagKey.mock.calls.length).toBeLessThan(tags.length * 50);
  });
});
