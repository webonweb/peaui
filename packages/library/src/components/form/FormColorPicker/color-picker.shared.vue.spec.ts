import { describe, expect, it } from 'vitest';

import {
  colorToCss,
  colorsEqual,
  getIndicatorColor,
  hsvToHsl,
  hsvToRgb,
  normalizeSwatches,
  parseColor,
  serializeColor,
  type FormColorPickerFormat,
  type HsvaColor,
} from './color-picker.shared';

describe('FormColorPicker shared', () => {
  it.each<[string, HsvaColor]>([
    ['#FF0000', { h: 0, s: 100, v: 100, a: 1 }],
    ['#0F08', { h: 120, s: 100, v: 100, a: 0.5333 }],
    ['rgb(0, 0, 255)', { h: 240, s: 100, v: 100, a: 1 }],
    ['rgba(255, 255, 255, 25%)', { h: 0, s: 0, v: 100, a: 0.25 }],
    ['hsl(60, 100%, 50%)', { h: 60, s: 100, v: 100, a: 1 }],
  ])('parsuje %s do kanonicznego HSVA', (input, expected) => {
    expect(parseColor(input)).toEqual(expected);
  });

  it.each<FormColorPickerFormat>(['hex', 'rgb', 'hsl'])(
    'utrzymuje kolor po round-trip formatu %s',
    (format) => {
      const source = parseColor('rgba(24, 132, 219, 0.42)')!;
      const serialized = serializeColor(source, format, true);
      const parsed = parseColor(serialized)!;
      expect(colorsEqual(parsed, source)).toBe(true);
    },
  );

  it('serializuje alpha jawnie i usuwa je tylko po wyłączeniu opcji', () => {
    const color = parseColor('#33669980')!;
    expect(serializeColor(color, 'hex', true)).toBe('#33669980');
    expect(serializeColor(color, 'hex', false)).toBe('#336699');
    expect(serializeColor(color, 'rgb', true)).toBe('rgba(51, 102, 153, 0.502)');
  });

  it('odrzuca niepoprawne i wychodzące poza zakres wartości', () => {
    for (const input of [
      '',
      '#12',
      '#GGGGGG',
      'rgb(256, 0, 0)',
      'rgba(0,0,0,2)',
      'hsl(0, 120%, 50%)',
    ]) {
      expect(parseColor(input)).toBeUndefined();
    }
  });

  it('konwertuje kanały bez NaN na granicach czerni, bieli i szarości', () => {
    expect(hsvToRgb({ h: 0, s: 0, v: 0, a: 1 })).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(hsvToHsl({ h: 210, s: 0, v: 100, a: 1 })).toEqual({
      h: 210,
      s: 0,
      l: 100,
      a: 1,
    });
    expect(colorToCss({ h: 0, s: 0, v: 0, a: 0 })).toBe('rgba(0, 0, 0, 0)');
  });

  it('dobiera kontrast wskaźnika dla skrajnie jasnego i ciemnego koloru', () => {
    expect(getIndicatorColor({ h: 0, s: 0, v: 100, a: 1 })).toBe('#000000');
    expect(getIndicatorColor({ h: 0, s: 100, v: 20, a: 1 })).toBe('#ffffff');
  });

  it('pomija błędne próbki bez mutowania wejścia', () => {
    const input = [
      '#FF0000',
      { value: 'błąd', label: 'Błędny' },
      { value: '#00FF00', label: 'Zielony' },
    ];
    expect(normalizeSwatches(input)).toEqual([
      { value: '#FF0000' },
      { value: '#00FF00', label: 'Zielony' },
    ]);
    expect(input).toHaveLength(3);
  });
});
