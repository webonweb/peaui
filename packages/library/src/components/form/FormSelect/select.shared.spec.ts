import { describe, expect, it } from 'vitest';
import {
  createSelectValueIndex,
  getSelectOptionValue,
  isSelectOptionSelected,
  toggleSelectValues,
} from './select.shared';

describe('Shared Select model contract', () => {
  const options = [
    { label: 'Alpha', value: 'a' },
    { label: 'Beta', value: 'b' },
    { label: 'Blocked', value: 'c', disabled: true },
  ];
  it('uses explicit values without conflating types, and supports label migration', () => {
    expect(getSelectOptionValue(options[0]!, 'value')).toBe('a');
    expect(getSelectOptionValue(options[0]!, 'label')).toBe('Alpha');
    expect(getSelectOptionValue({ label: 'Label only' }, 'value')).toBe('Label only');
    const selected = createSelectValueIndex([1, 'Alpha'], 'value');
    expect(isSelectOptionSelected({ label: 'One', value: 1 }, selected, 'value')).toBe(true);
    expect(isSelectOptionSelected({ label: 'One', value: '1' }, selected, 'value')).toBe(false);
    expect(isSelectOptionSelected(options[0]!, selected, 'value')).toBe(false);
    expect(
      isSelectOptionSelected(options[0]!, createSelectValueIndex([' alpha '], 'label'), 'label'),
    ).toBe(true);
  });
  it('preserves unknown and filtered-out values, excludes disabled options and toggles all', () => {
    expect(toggleSelectValues(['unknown', 'b'], [options[0]!], 'value')).toEqual([
      'unknown',
      'b',
      'a',
    ]);
    expect(toggleSelectValues(['unknown', 'a', 'b'], options, 'value')).toEqual(['unknown']);
    expect(toggleSelectValues([], options, 'value')).toEqual(['a', 'b']);
    expect(toggleSelectValues(['unknown'], [options[2]!], 'value')).toEqual(['unknown']);
  });
  it('deselects normalized label-only options in migration mode', () => {
    expect(
      toggleSelectValues([' ALPHA ', 'unknown', undefined], [{ label: 'Alpha' }], 'label'),
    ).toEqual(['unknown', undefined]);
  });
});
