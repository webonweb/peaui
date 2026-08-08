import { describe, expect, it } from 'vitest';

import {
  getRatingDescription,
  getRatingItemFill,
  getRatingKeyboardValue,
  getRatingPointerValue,
  normalizeRatingMax,
  normalizeRatingValue,
} from './rating-input.shared';

describe('FormRatingInput shared model', () => {
  it('normalizuje max oraz wartość początkową bez błędów zmiennoprzecinkowych', () => {
    expect(normalizeRatingMax(undefined)).toBe(5);
    expect(normalizeRatingMax(0)).toBe(1);
    expect(normalizeRatingMax(500)).toBe(100);
    expect(normalizeRatingValue(3.499999, 5, 0.5)).toBe(3.5);
    expect(normalizeRatingValue(8, 5, 1)).toBe(5);
    expect(normalizeRatingValue(0, 5, 1)).toBeNull();
  });

  it('oblicza pełne i połówkowe wypełnienie ikon', () => {
    expect([0, 1, 2, 3, 4].map((index) => getRatingItemFill(3.5, index))).toEqual([
      100, 100, 100, 50, 0,
    ]);
  });

  it('mapuje obie połowy ikony również w kierunku RTL', () => {
    expect(getRatingPointerValue(2, 0.2, 5, 0.5)).toBe(2.5);
    expect(getRatingPointerValue(2, 0.8, 5, 0.5)).toBe(3);
    expect(getRatingPointerValue(2, 0.2, 5, 0.5, true)).toBe(3);
    expect(getRatingPointerValue(2, 0.8, 5, 0.5, true)).toBe(2.5);
  });

  it('obsługuje granice, Home, End i jawne czyszczenie', () => {
    const options = { allowClear: true, max: 5, step: 0.5 as const };
    expect(getRatingKeyboardValue(null, 'increment', options)).toBe(0.5);
    expect(getRatingKeyboardValue(0.5, 'decrement', options)).toBeNull();
    expect(getRatingKeyboardValue(3, 'minimum', options)).toBe(0.5);
    expect(getRatingKeyboardValue(3, 'maximum', options)).toBe(5);
    expect(getRatingKeyboardValue(3, 'clear', options)).toBeNull();
  });

  it('tworzy lokalizowany aria-valuetext z etykietą tekstową', () => {
    expect(
      getRatingDescription(3.5, 5, {
        labels: { '3.5': 'Bardzo dobra' },
        locale: 'pl-PL',
      }),
    ).toBe('3,5 z 5 — Bardzo dobra');
    expect(getRatingDescription(null, 5, { emptyLabel: 'Brak wyboru' })).toBe('Brak wyboru');
  });
});
