import { describe, expect, it } from 'vitest';
import { getDeepValue, unflatten } from '@/helpers/object.helper';
import {
  getDeepEditableValue,
  replaceEditableValues,
  setDeepEditableValue,
} from '../data-display/TableList/editable-validation.shared';

describe('nested data paths', () => {
  it('never traverses prototypes when expanding or editing paths', () => {
    for (const path of [
      '__proto__.peauiPolluted',
      'constructor.prototype.peauiPolluted',
      'safe.__proto__.peauiPolluted',
    ]) {
      const target: Record<string, unknown> = {};
      try {
        expect(unflatten({ [path]: true })).toEqual({});
        setDeepEditableValue(target, path, true);
        expect(target).toEqual({});
        expect(Object.hasOwn(Object.prototype, 'peauiPolluted')).toBe(false);
      } finally {
        Reflect.deleteProperty(Object.prototype, 'peauiPolluted');
      }
    }
  });

  it('reads only own fields and preserves valid nested paths', () => {
    const value = Object.create({ hidden: { value: 1 } }) as Record<string, unknown>;
    value.person = { name: 'Ada' };
    for (const read of [getDeepValue, getDeepEditableValue]) {
      expect(read(value, 'hidden.value')).toBeUndefined();
      expect(read(value, 'person.name')).toBe('Ada');
    }
    expect(unflatten({ 'person.name': 'Ada', active: true })).toEqual({
      person: { name: 'Ada' },
      active: true,
    });
  });

  it('replaces state without invoking the prototype setter', () => {
    const target: Record<string, unknown> = { stale: true };
    replaceEditableValues(
      target,
      JSON.parse('{"__proto__":{"peauiPolluted":true},"name":"Ada"}') as Record<string, unknown>,
    );
    expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
    expect(target.name).toBe('Ada');
    expect(target.peauiPolluted).toBeUndefined();
  });
});
