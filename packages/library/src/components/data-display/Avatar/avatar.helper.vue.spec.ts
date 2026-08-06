import { describe, expect, it } from 'vitest';

import { getAvatarInitials, normalizeAvatarInitials } from './avatar.helper';

describe('Avatar helpers', () => {
  it('uses the first and last word for multi-word names', () => {
    expect(getAvatarInitials('  Anna Maria Kowalska ')).toBe('AK');
  });

  it('uses two Unicode code points for a single-word name', () => {
    expect(getAvatarInitials('Łukasz')).toBe('ŁU');
    expect(getAvatarInitials('')).toBe('');
  });

  it('normalizes explicit initials and caps them at three characters', () => {
    expect(normalizeAvatarInitials(' a k z x ')).toBe('AKZ');
  });
});
