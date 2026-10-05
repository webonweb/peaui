import { describe, expect, it } from 'vitest';

import {
  buildRangeCalendarDays,
  formatDateRange,
  getPreviewBounds,
  normalizeManualRange,
  parseDateRange,
  selectRangeDate,
  validateDateRange,
} from './date-range-picker.shared';

describe('FormDateRangePicker shared model', () => {
  it('obsługuje wszystkie polityki odwróconej kolejności', () => {
    expect(selectRangeDate(['2026-08-18', undefined], '2026-08-10', 'swap').value).toEqual([
      '2026-08-10',
      '2026-08-18',
    ]);
    expect(selectRangeDate(['2026-08-18', undefined], '2026-08-10', 'resetEnd').value).toEqual([
      '2026-08-10',
      undefined,
    ]);
    expect(selectRangeDate(['2026-08-18', undefined], '2026-08-10', 'reject')).toEqual({
      invalid: 'order',
      value: ['2026-08-18', undefined],
    });
    expect(normalizeManualRange(['2026-08-18', '2026-08-10'], 'swap').value).toEqual([
      '2026-08-10',
      '2026-08-18',
    ]);
  });

  it('parsuje i formatuje zakres bez konwersji strefy czasowej', () => {
    const value = parseDateRange('2026-10-25 – 2026-10-31', {
      dateFormat: 'iso',
      locale: 'pl-PL',
    });
    expect(value).toEqual(['2026-10-25', '2026-10-31']);
    expect(formatDateRange(value, { dateFormat: 'iso', locale: 'pl-PL' })).toBe(
      '2026-10-25 – 2026-10-31',
    );
  });

  it('respektuje kolejność dat właściwą dla locale pl-PL i en-US', () => {
    const value: [string, string] = ['2026-08-10', '2026-08-18'];
    const polish = formatDateRange(value, { dateFormat: 'locale', locale: 'pl-PL' });
    const english = formatDateRange(value, { dateFormat: 'locale', locale: 'en-US' });

    expect(polish).toBe('10.08.2026 – 18.08.2026');
    expect(english).toBe('08/10/2026 – 08/18/2026');
    expect(parseDateRange(polish, { dateFormat: 'locale', locale: 'pl-PL' })).toEqual(value);
    expect(parseDateRange(english, { dateFormat: 'locale', locale: 'en-US' })).toEqual(value);
  });

  it('oddziela podgląd hover od zatwierdzonego zakresu', () => {
    expect(getPreviewBounds(['2026-08-18', undefined], '2026-08-14')).toEqual([
      '2026-08-14',
      '2026-08-18',
    ]);
    const days = buildRangeCalendarDays(2026, 8, ['2026-08-18', undefined], '2026-08-20', {});
    expect(days.find((day) => day.date === '2026-08-19')).toMatchObject({
      inPreview: true,
      inRange: false,
    });
  });

  it('waliduje min, max, dni wyłączone, kompletność i kolejność', () => {
    const options = {
      minDate: '2026-08-01',
      maxDate: '2026-08-31',
      isDateDisabled: (date: string) => date === '2026-08-16',
    };
    expect(validateDateRange(undefined, options, true)).toBe('empty');
    expect(validateDateRange(['2026-08-10', undefined], options)).toBe('partial');
    expect(validateDateRange(['2026-08-20', '2026-08-10'], options)).toBe('order');
    expect(validateDateRange(['2026-07-31', '2026-08-10'], options)).toBe('range');
    expect(validateDateRange(['2026-08-16', '2026-08-20'], options)).toBe('disabled');
    expect(validateDateRange(['2026-08-10', '2026-08-20'], options)).toBeUndefined();
  });
});
