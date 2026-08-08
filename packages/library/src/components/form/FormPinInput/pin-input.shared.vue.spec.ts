import { describe, expect, it, vi } from 'vitest';

import {
  applyPinInput,
  getPinCellLabel,
  normalizePinCharacters,
  normalizePinLength,
  normalizePinValue,
  removePinCharacter,
} from './pin-input.shared';

const numeric = { length: 6, type: 'numeric' as const };

describe('FormPinInput shared', () => {
  it('ogranicza długość do bezpiecznego zakresu', () => {
    expect(normalizePinLength(0)).toBe(1);
    expect(normalizePinLength(6.9)).toBe(6);
    expect(normalizePinLength(100)).toBe(32);
    expect(normalizePinLength(Number.NaN)).toBe(6);
  });

  it('zachowuje zera początkowe', () => {
    expect(normalizePinValue('001204', numeric)).toBe('001204');
  });

  it('odrzuca znaki spoza wariantu numeric', () => {
    expect(normalizePinCharacters('12a-3', numeric)).toEqual({
      accepted: '123',
      invalid: { index: 0, input: '12a-3', reason: 'character', rejected: 'a-' },
    });
  });

  it('obsługuje alphanumeric i transformację uppercase', () => {
    expect(
      normalizePinValue('a1b2', { length: 4, transform: 'uppercase', type: 'alphanumeric' }),
    ).toBe('A1B2');
  });

  it('stosuje dodatkowy pattern do pojedynczego znaku', () => {
    expect(normalizePinCharacters('1234', { ...numeric, pattern: '[02468]' })).toEqual({
      accepted: '24',
      invalid: { index: 0, input: '1234', reason: 'pattern', rejected: '13' },
    });
  });

  it('odrzuca niejednoznaczny wynik transformacji', () => {
    const transform = vi.fn(() => 'AB');
    expect(
      normalizePinCharacters('a', { length: 4, transform, type: 'alphanumeric' }).invalid,
    ).toMatchObject({ reason: 'transform', rejected: 'a' });
  });

  it('wkleja od aktywnej komórki bez gubienia prefiksu', () => {
    expect(applyPinInput('123456', 2, '90', numeric)).toMatchObject({
      accepted: '90',
      nextIndex: 4,
      value: '129056',
    });
  });

  it('zgłasza nadmiar bez wykraczania poza długość', () => {
    expect(applyPinInput('12', 2, '3456789', numeric)).toEqual({
      accepted: '3456',
      invalid: { index: 2, input: '3456789', reason: 'overflow', rejected: '789' },
      nextIndex: 5,
      value: '123456',
    });
  });

  it('usuwa znak ze środka i przesuwa dalszą część', () => {
    expect(removePinCharacter('123456', 2)).toBe('12456');
  });

  it('tworzy jednoznaczne etykiety komórek', () => {
    expect(getPinCellLabel('numeric', 1, 6)).toBe('Cyfra 2 z 6');
    expect(getPinCellLabel('alphanumeric', 3, 4)).toBe('Znak 4 z 4');
  });
});
