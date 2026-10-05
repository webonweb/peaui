import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleDescription } from 'dom-accessibility-api';
import FormPinInput from '../form/FormPinInput/index.wc';
import FormRatingInput from '../form/FormRatingInput/index.wc';
import FormSwitchToggle from '../form/FormSwitchToggle/index.wc';
import FormTagsInput from '../form/FormTagsInput/index.wc';
import FormFileUploadSimple from '../form/FormFileUploadSimple/index.wc';
import FormDateRangePicker from '../form/FormDateRangePicker/index.wc';
import FormDatePicker from '../form/FormDatePicker/index.wc';
import FormYearPicker from '../form/FormYearPicker/index.wc';
import FormButtonGroup from '../form/FormButtonGroup/index.wc';
import ToggleGroup from '../data-entry/ToggleGroup/index.wc';
import SelectableCard from '../data-entry/SelectableCard/index.wc';

afterEach(() => document.body.replaceChildren());
const settle = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await nextTick();
  await nextTick();
  await nextTick();
};
async function mount(Element: CustomElementConstructor, props: Record<string, unknown>) {
  const form = document.createElement('form');
  const element = new Element();
  Object.assign(element, props);
  form.append(element);
  document.body.append(form);
  await settle();
  return { form, element };
}
describe('form accessibility regressions: Web Components', () => {
  for (const [name, Element, value] of [
    ['Pin', FormPinInput, '123456'],
    ['Rating', FormRatingInput, 2],
    ['Switch', FormSwitchToggle, false],
    ['Tags', FormTagsInput, []],
  ] as const) {
    it(`F01 updates ${name} accessibility after slots appear and disappear`, async () => {
      const { element } = await mount(Element, { id: 'field', name: 'field', value });
      const label = document.createElement('span');
      label.slot = 'label';
      label.textContent = 'Async label';
      const error = document.createElement('span');
      error.slot = 'error';
      error.textContent = 'Async error';
      element.append(label, error);
      await settle();
      const input = element.querySelector('input:not([type=hidden])')!;
      expect(computeAccessibleDescription(input)).toContain('Async error');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      error.remove();
      label.remove();
      await settle();
      expect(computeAccessibleDescription(input)).not.toContain('Async error');
    });
  }
  it('F03 omits disabled range values', async () => {
    const { form } = await mount(FormDateRangePicker, {
      name: 'dates',
      value: ['2026-10-02', '2026-10-05'],
      disabled: true,
    });
    expect([...new FormData(form)]).toEqual([]);
  });
  for (const variant of ['single-input', 'two-inputs'] as const) {
    it(`F03 submits only canonical date endpoints for ${variant}`, async () => {
      const { form } = await mount(FormDateRangePicker, {
        id: 'dates',
        name: 'dates',
        value: ['2026-10-02', '2026-10-05'],
        variant,
      });
      expect([...new FormData(form)]).toEqual([
        ['dates.start', '2026-10-02'],
        ['dates.end', '2026-10-05'],
      ]);
    });
  }
  it('F05 reflects external files replacement and clearing', async () => {
    const { element } = await mount(FormFileUploadSimple, { files: [] });
    Object.assign(element, {
      files: [new File(['test'], 'external.pdf', { type: 'application/pdf' })],
    });
    await settle();
    expect(element.textContent).toContain('external.pdf');
    Object.assign(element, { files: [] });
    await settle();
    expect(element.textContent).not.toContain('external.pdf');
  });
  it('F06 exposes active selection', async () => {
    const { element } = await mount(SelectableCard, { active: true });
    expect(element.querySelector('button')!.getAttribute('aria-pressed')).toBe('true');
    Object.assign(element, { active: false });
    await settle();
    expect(element.querySelector('button')!.getAttribute('aria-pressed')).toBe('false');
  });
  for (const [name, Element, value] of [
    ['Date', FormDatePicker, '2026-10-02'],
    ['Year', FormYearPicker, 2026],
    ['Rating', FormRatingInput, 2],
    ['ButtonGroup', FormButtonGroup, 'a'],
    ['ToggleGroup', ToggleGroup, 'a'],
  ] as const) {
    it(`F10 participates in required ${name} native validation`, async () => {
      const options = [{ key: 'a', value: 'a', label: 'Alpha' }];
      const { form, element } = await mount(Element, {
        id: 'field',
        name: 'field',
        required: true,
        options,
        items: options,
      });
      expect(form.checkValidity()).toBe(false);
      expect(document.activeElement).not.toBe(document.body);
      expect(document.activeElement?.getAttribute('aria-hidden')).not.toBe('true');
      Object.assign(element, { value });
      await settle();
      expect(form.checkValidity()).toBe(true);
      Object.assign(element, { value: undefined, disabled: true });
      await settle();
      expect(form.checkValidity()).toBe(true);
      Object.assign(element, { disabled: false, readonly: true });
      await settle();
      expect(form.checkValidity()).toBe(true);
    });
  }
  it('F12 resets an emptied group and respects canceled reset', async () => {
    const { form, element } = await mount(ToggleGroup, {
      name: 'choice',
      value: 'a',
      allowEmpty: true,
      items: [{ value: 'a', label: 'Alpha' }],
    });
    element.querySelector('button')!.click();
    await settle();
    expect([...new FormData(form)]).toEqual([]);
    const cancel = (event: Event) => event.preventDefault();
    form.addEventListener('reset', cancel);
    form.reset();
    await settle();
    expect([...new FormData(form)]).toEqual([]);
    form.removeEventListener('reset', cancel);
    form.reset();
    await settle();
    expect([...new FormData(form)]).toEqual([['choice', 'a']]);
  });
});
