import { describe, expect, it } from 'vitest';

import {
  getDeepEditableValue,
  replaceEditableValues,
  setDeepEditableValue,
  validateEditableValue,
} from './editable-validation.shared';

const messages = { integer: 'integer', required: 'required' };

describe('TableList editable validation', () => {
  it('validates required, integer, multiselect and masked values without runtime schema packages', () => {
    expect(validateEditableValue('', { required: true, type: 'text' }, messages)).toBe('required');
    expect(validateEditableValue(0, { required: true, type: 'number' }, messages)).toBeUndefined();
    expect(validateEditableValue(1.5, { integer: true, type: 'number' }, messages)).toBe('integer');
    expect(validateEditableValue([], { required: true, type: 'multiselect' }, messages)).toBe(
      'required',
    );
    expect(
      validateEditableValue(
        '12-345',
        { mask: '00-000', regex: /^\d{2}-\d{3}$/, required: true, type: 'text' },
        messages,
      ),
    ).toBeUndefined();
  });

  it('updates nested paths and replaces form state in place', () => {
    const values: Record<string, unknown> = { stale: true };
    setDeepEditableValue(values, 'person.address.city', 'Warszawa');
    expect(values).toEqual({ stale: true, person: { address: { city: 'Warszawa' } } });
    expect(getDeepEditableValue(values, 'person.address.city')).toBe('Warszawa');

    replaceEditableValues(values, { fresh: 1 });
    expect(values).toEqual({ fresh: 1 });
  });
});
