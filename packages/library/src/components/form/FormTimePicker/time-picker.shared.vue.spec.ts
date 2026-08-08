import { describe, expect, it } from 'vitest';

import {
  buildSegmentOptions,
  formatDisplayTime,
  formatModelTime,
  getAdjacentSegmentValue,
  getFirstValidTime,
  parseDisplayTime,
  parseModelTime,
  validateTimeParts,
  type TimePickerValidationOptions,
} from './time-picker.shared';

const options: TimePickerValidationOptions = {
  allowOffStep: false,
  format: '24h',
  hourStep: 1,
  locale: 'pl-PL',
  minuteStep: 5,
  secondStep: 5,
  showSeconds: false,
};

describe('FormTimePicker shared model', () => {
  it('parsuje wyłącznie jednoznaczny model 24h', () => {
    expect(parseModelTime('09:05')).toEqual({ hour: 9, minute: 5, second: 0 });
    expect(parseModelTime('23:59:58')).toEqual({ hour: 23, minute: 59, second: 58 });
    expect(parseModelTime('9:05')).toBeUndefined();
    expect(parseModelTime('24:00')).toBeUndefined();
  });

  it('wykonuje round-trip 12h bez zależności modelu od locale', () => {
    const parts = parseDisplayTime('12:07 AM', '12h', false);
    expect(parts).toEqual({ hour: 0, minute: 7, second: 0 });
    expect(formatModelTime(parts!, false)).toBe('00:07');
    expect(
      formatDisplayTime(
        { hour: 15, minute: 4, second: 3 },
        {
          format: '12h',
          locale: 'en-US',
          showSeconds: true,
        },
      ),
    ).toBe('03:04:03 PM');
  });

  it('rozróżnia błędy zakresu i kroku', () => {
    const constrained = { ...options, min: '08:30', max: '17:00' };
    expect(validateTimeParts({ hour: 8, minute: 25, second: 0 }, constrained)).toBe('range');
    expect(validateTimeParts({ hour: 8, minute: 32, second: 0 }, constrained)).toBe('step');
    expect(validateTimeParts({ hour: 8, minute: 35, second: 0 }, constrained)).toBeUndefined();
  });

  it('allowOffStep dotyczy walidacji ręcznej, a propozycje nadal zachowują interwał', () => {
    const offStep = { ...options, allowOffStep: true, minuteStep: 15 };
    expect(validateTimeParts({ hour: 9, minute: 7, second: 0 }, offStep)).toBeUndefined();
    const values = buildSegmentOptions('minute', { hour: 9, minute: 7, second: 0 }, offStep).map(
      (option) => option.value,
    );
    expect(values).toEqual([0, 7, 15, 30, 45]);
  });

  it('wyznacza pierwszą poprawną wartość i nie zamienia błędnych granic', () => {
    expect(getFirstValidTime({ ...options, min: '08:30', max: '09:00' })).toEqual({
      hour: 8,
      minute: 30,
      second: 0,
    });
    expect(getFirstValidTime({ ...options, min: '18:00', max: '08:00' })).toBeUndefined();
  });

  it('zmiana segmentu nie powoduje niejawnego rollover daty', () => {
    expect(getAdjacentSegmentValue('hour', { hour: 23, minute: 0, second: 0 }, 1, options)).toEqual(
      { hour: 0, minute: 0, second: 0 },
    );
    expect(
      getAdjacentSegmentValue('minute', { hour: 23, minute: 55, second: 0 }, 1, options),
    ).toEqual({ hour: 23, minute: 0, second: 0 });
  });
});
