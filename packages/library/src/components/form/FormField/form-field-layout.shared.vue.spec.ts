import { describe, expect, it } from 'vitest';

import {
  FORM_FIELD_ERASE_ACTION_SIZE_PX,
  getFormFieldEraseOffset,
  getFormFieldPaddingRight,
} from './form-field-layout.shared';

describe('FormField trailing action layout', () => {
  it('reserves the complete erase target instead of only the cross icon', () => {
    expect(FORM_FIELD_ERASE_ACTION_SIZE_PX).toBeGreaterThanOrEqual(24);
    expect(getFormFieldEraseOffset({})).toBe(12);
    expect(getFormFieldPaddingRight({ canErase: true })).toBe(48);
  });

  it('keeps erase clear of a trailing field icon', () => {
    expect(getFormFieldEraseOffset({ iconAfter: 'calendar' })).toBe(44);
    expect(getFormFieldPaddingRight({ canErase: true, iconAfter: 'calendar' })).toBe(80);
    expect(getFormFieldPaddingRight({ canErase: false, iconAfter: 'calendar' })).toBe(32);
  });

  it('accounts for suffixes, custom actions and native number controls', () => {
    expect(getFormFieldPaddingRight({ after: 'kg', canErase: true })).toBe(67);
    expect(getFormFieldPaddingRight({ canErase: true, hasAdditional: true })).toBe(80);
    expect(
      getFormFieldPaddingRight({
        canErase: true,
        minimumEraseOffset: getFormFieldEraseOffset({ trailingControlWidth: 20 }),
      }),
    ).toBe(68);
  });
});
