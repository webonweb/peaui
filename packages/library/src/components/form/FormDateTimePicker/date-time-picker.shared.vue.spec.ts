import { describe, expect, it } from 'vitest';

import {
  buildCalendarDays,
  compareLocalDateTime,
  formatDateTimeDisplay,
  parseDateTimeDisplay,
  parseModelDate,
  validateLocalDateTime,
  type DateTimeValidationOptions,
} from './date-time-picker.shared';

const options: DateTimeValidationOptions = {
  allowOffStep: false,
  format: '24h',
  hourStep: 1,
  locale: 'pl-PL',
  minuteStep: 5,
  secondStep: 5,
  showSeconds: false,
};

describe('FormDateTimePicker shared', () => {
  it('waliduje daty kalendarzowe bez akceptowania przepełnionych dni', () => {
    expect(parseModelDate('2024-02-29')).toEqual({ day: 29, month: 2, year: 2024 });
    expect(parseModelDate('2025-02-29')).toBeUndefined();
    expect(parseModelDate('2026-13-01')).toBeUndefined();
  });

  it('formatuje i parsuje locale bez zmiany jawnego modelu', () => {
    const value = { date: '2026-08-18', time: '09:30' };
    const display = formatDateTimeDisplay(value, {
      dateFormat: 'locale',
      format: '24h',
      locale: 'pl-PL',
      showSeconds: false,
    });
    expect(display).toBe('18.08.2026 09:30');
    expect(
      parseDateTimeDisplay(display, {
        dateFormat: 'locale',
        format: '24h',
        locale: 'pl-PL',
        showSeconds: false,
      }),
    ).toEqual(value);
  });

  it('rozróżnia wartość częściową, granice, krok i termin wyłączony', () => {
    expect(validateLocalDateTime({ date: '2026-08-18' }, options)).toBe('partial');
    expect(
      validateLocalDateTime(
        { date: '2026-08-18', time: '08:55' },
        { ...options, min: { date: '2026-08-18', time: '09:00' } },
      ),
    ).toBe('range');
    expect(validateLocalDateTime({ date: '2026-08-18', time: '09:32' }, options)).toBe('time');
    expect(
      validateLocalDateTime(
        { date: '2026-08-18', time: '09:30' },
        { ...options, isDateTimeDisabled: (value) => value.time === '09:30' },
      ),
    ).toBe('disabled');
  });

  it('nie wykonuje konwersji UTC ani DST podczas porównania', () => {
    expect(
      compareLocalDateTime(
        { date: '2026-03-29', time: '02:30' },
        { date: '2026-03-29', time: '03:00' },
      ),
    ).toBeLessThan(0);
    expect(
      formatDateTimeDisplay(
        { date: '2026-10-25', time: '02:30' },
        { dateFormat: 'iso', format: '24h', locale: 'pl-PL', showSeconds: false },
      ),
    ).toBe('2026-10-25 02:30');
  });

  it('buduje pełną siatkę 6×7 i pozostawia dzień graniczny dostępny do korekty czasu', () => {
    const days = buildCalendarDays(2026, 8, undefined, '08:00', {
      ...options,
      min: { date: '2026-08-18', time: '09:00' },
    });
    expect(days).toHaveLength(42);
    expect(days.find((day) => day.date === '2026-08-17')?.disabled).toBe(true);
    expect(days.find((day) => day.date === '2026-08-18')?.disabled).toBe(false);
  });
});
