/** @jsxImportSource react */
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName, computeAccessibleDescription } from 'dom-accessibility-api';
import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';
import FormCheckbox from '../form/FormCheckbox';

afterEach(cleanup);
describe('shared form contracts: React', () => {
  for (const slot of ['description', 'error', 'success']) {
    it(`connects the real ${slot} message to its input`, () => {
      const { container } = render(
        <FormInput id="field" name="field" label="Field" {...{ [slot]: 'Supporting text' }} />,
      );
      expect(computeAccessibleDescription(container.querySelector('input')!)).toBe(
        'Supporting text',
      );
    });
  }
  it('respects an explicit accessible name in Select', () => {
    const { container } = render(
      <FormSelect id="select" name="machine" options={[]} aria-label="Choose a country" />,
    );
    expect(computeAccessibleName(container.querySelector('input')!)).toBe('Choose a country');
  });
  it('does not expose a destructive action for a readonly input', () => {
    const { container } = render(
      <FormInput id="field" name="field" defaultValue="Keep" readonly canErase />,
    );
    expect(container.querySelector('.peaui-form-field__erase-button')).toBeNull();
  });
  it('labels a checkbox without duplicate IDs and preserves disabled selection', () => {
    const { container } = render(
      <FormCheckbox id="choice" name="choice" defaultValue={true} disabled isValid={false}>
        Accept terms
      </FormCheckbox>,
    );
    const input = container.querySelector('input')!;
    expect(input.checked).toBe(true);
    expect(computeAccessibleName(input)).toBe('Accept terms');
    expect(container.querySelectorAll('[id="choice"]')).toHaveLength(1);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
  it('participates in native required validation for Select', () => {
    const { container } = render(<FormSelect id="select" name="choice" options={[]} required />);
    expect(container.querySelector('select')!.validity.valueMissing).toBe(true);
    expect(container.querySelector('input')!.getAttribute('aria-required')).toBe('true');
  });
});
