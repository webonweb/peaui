export type FormColorPickerFormat = 'hex' | 'rgb' | 'hsl';
export type FormColorPickerVariant = 'popover' | 'inline';
export type FormColorPickerDensity = 'compact' | 'full';
export type FormColorPickerPlacement = 'top' | 'bottom';
export type FormColorPickerInvalidReason = 'empty' | 'format';

export type HsvaColor = {
  h: number;
  s: number;
  v: number;
  a: number;
};

export type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type HslaColor = {
  h: number;
  s: number;
  l: number;
  a: number;
};

export type FormColorPickerSwatch = {
  label?: string;
  value: string;
};

export type FormColorPickerInvalidDetail = {
  input: string;
  reason: FormColorPickerInvalidReason;
};

export type FormColorPickerEyedropperErrorDetail = {
  error?: unknown;
  reason: 'cancelled' | 'failed' | 'unavailable';
};

const HEX_COLOR = /^#?([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;

export const DEFAULT_COLOR: HsvaColor = { h: 96, s: 94, v: 57, a: 1 };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHue(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function normalizeHsva(value: HsvaColor): HsvaColor {
  return {
    h: round(normalizeHue(value.h), 4),
    s: round(clamp(value.s, 0, 100), 4),
    v: round(clamp(value.v, 0, 100), 4),
    a: round(clamp(value.a, 0, 1), 4),
  };
}

export function hsvToRgb(value: HsvaColor): RgbaColor {
  const { h, s, v, a } = normalizeHsva(value);
  const saturation = s / 100;
  const brightness = v / 100;
  const chroma = brightness * saturation;
  const section = h / 60;
  const intermediate = chroma * (1 - Math.abs((section % 2) - 1));
  const offset = brightness - chroma;
  let channels: [number, number, number];

  if (section < 1) channels = [chroma, intermediate, 0];
  else if (section < 2) channels = [intermediate, chroma, 0];
  else if (section < 3) channels = [0, chroma, intermediate];
  else if (section < 4) channels = [0, intermediate, chroma];
  else if (section < 5) channels = [intermediate, 0, chroma];
  else channels = [chroma, 0, intermediate];

  return {
    r: Math.round((channels[0] + offset) * 255),
    g: Math.round((channels[1] + offset) * 255),
    b: Math.round((channels[2] + offset) * 255),
    a,
  };
}

export function rgbToHsv(value: RgbaColor): HsvaColor {
  const red = clamp(value.r, 0, 255) / 255;
  const green = clamp(value.g, 0, 255) / 255;
  const blue = clamp(value.b, 0, 255) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;

  if (delta !== 0) {
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }

  return normalizeHsva({
    h: hue,
    s: maximum === 0 ? 0 : (delta / maximum) * 100,
    v: maximum * 100,
    a: value.a,
  });
}

export function hsvToHsl(value: HsvaColor): HslaColor {
  const normalized = normalizeHsva(value);
  const saturation = normalized.s / 100;
  const brightness = normalized.v / 100;
  const lightness = brightness * (1 - saturation / 2);
  const hslSaturation =
    lightness === 0 || lightness === 1
      ? 0
      : (brightness - lightness) / Math.min(lightness, 1 - lightness);
  return {
    h: normalized.h,
    s: round(hslSaturation * 100, 4),
    l: round(lightness * 100, 4),
    a: normalized.a,
  };
}

export function hslToHsv(value: HslaColor): HsvaColor {
  const lightness = clamp(value.l, 0, 100) / 100;
  const saturation = clamp(value.s, 0, 100) / 100;
  const brightness = lightness + saturation * Math.min(lightness, 1 - lightness);
  const hsvSaturation = brightness === 0 ? 0 : 2 * (1 - lightness / brightness);
  return normalizeHsva({
    h: value.h,
    s: hsvSaturation * 100,
    v: brightness * 100,
    a: value.a,
  });
}

export function parseColor(input: unknown): HsvaColor | undefined {
  if (typeof input !== 'string') return undefined;
  const source = input.trim();
  if (!source) return undefined;
  return parseHex(source) ?? parseRgb(source) ?? parseHsl(source);
}

export function serializeColor(
  value: HsvaColor,
  format: FormColorPickerFormat,
  alpha: boolean,
): string {
  const normalized = normalizeHsva({ ...value, a: alpha ? value.a : 1 });
  if (format === 'hex') return serializeHex(normalized, alpha);
  if (format === 'rgb') return serializeRgb(normalized, alpha);
  return serializeHsl(normalized, alpha);
}

export function colorToCss(value: HsvaColor): string {
  const rgba = hsvToRgb(value);
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${formatDecimal(rgba.a)})`;
}

export function opaqueHueToCss(hue: number): string {
  return colorToCss({ h: hue, s: 100, v: 100, a: 1 });
}

export function getIndicatorColor(value: HsvaColor): '#000000' | '#ffffff' {
  const { r, g, b } = hsvToRgb({ ...value, a: 1 });
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  return luminance > 0.42 ? '#000000' : '#ffffff';
}

export function normalizeSwatches(
  values: ReadonlyArray<string | FormColorPickerSwatch> | undefined,
): FormColorPickerSwatch[] {
  if (!values) return [];
  return values.flatMap((item) => {
    const swatch = typeof item === 'string' ? { value: item } : item;
    return parseColor(swatch.value) ? [{ label: swatch.label, value: swatch.value }] : [];
  });
}

export function colorsEqual(first: HsvaColor, second: HsvaColor): boolean {
  const a = hsvToRgb(first);
  const b = hsvToRgb(second);
  return (
    Math.abs(a.r - b.r) <= 1 &&
    Math.abs(a.g - b.g) <= 1 &&
    Math.abs(a.b - b.b) <= 1 &&
    Math.abs(a.a - b.a) <= 1 / 255
  );
}

function parseHex(source: string): HsvaColor | undefined {
  const match = HEX_COLOR.exec(source);
  if (!match) return undefined;
  let value = match[1]!;
  if (value.length <= 4) value = [...value].map((character) => character.repeat(2)).join('');
  const rgba: RgbaColor = {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    a: value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1,
  };
  return rgbToHsv(rgba);
}

function parseRgb(source: string): HsvaColor | undefined {
  const match = /^rgba?\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,)]+)(?:\s*,\s*([^,)]+))?\s*\)$/i.exec(
    source,
  );
  if (!match) return undefined;
  const channels = match.slice(1, 4).map(parseRgbChannel);
  const alpha = parseAlpha(match[4]);
  if (channels.some((channel) => channel === undefined) || alpha === undefined) return undefined;
  return rgbToHsv({
    r: channels[0]!,
    g: channels[1]!,
    b: channels[2]!,
    a: alpha,
  });
}

function parseHsl(source: string): HsvaColor | undefined {
  const match = /^hsla?\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,)]+)(?:\s*,\s*([^,)]+))?\s*\)$/i.exec(
    source,
  );
  if (!match) return undefined;
  const hue = parseFinite(match[1]!.replace(/deg$/i, '').trim());
  const saturation = parsePercentage(match[2]);
  const lightness = parsePercentage(match[3]);
  const alpha = parseAlpha(match[4]);
  if (
    hue === undefined ||
    saturation === undefined ||
    lightness === undefined ||
    alpha === undefined
  )
    return undefined;
  return hslToHsv({ h: hue, s: saturation, l: lightness, a: alpha });
}

function serializeHex(value: HsvaColor, alpha: boolean): string {
  const rgba = hsvToRgb(value);
  const channels = [rgba.r, rgba.g, rgba.b].map((channel) =>
    Math.round(channel).toString(16).padStart(2, '0').toUpperCase(),
  );
  if (alpha)
    channels.push(
      Math.round(rgba.a * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase(),
    );
  return `#${channels.join('')}`;
}

function serializeRgb(value: HsvaColor, alpha: boolean): string {
  const rgba = hsvToRgb(value);
  return alpha
    ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${formatDecimal(rgba.a)})`
    : `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
}

function serializeHsl(value: HsvaColor, alpha: boolean): string {
  const hsla = hsvToHsl(value);
  const core = `${Math.round(hsla.h)}, ${Math.round(hsla.s)}%, ${Math.round(hsla.l)}%`;
  return alpha ? `hsla(${core}, ${formatDecimal(hsla.a)})` : `hsl(${core})`;
}

function parseRgbChannel(value: string): number | undefined {
  const source = value.trim();
  if (source.endsWith('%')) {
    const percentage = parseFinite(source.slice(0, -1));
    return percentage === undefined || percentage < 0 || percentage > 100
      ? undefined
      : (percentage / 100) * 255;
  }
  const channel = parseFinite(source);
  return channel === undefined || channel < 0 || channel > 255 ? undefined : channel;
}

function parsePercentage(value: string | undefined): number | undefined {
  if (value === undefined || !value.trim().endsWith('%')) return undefined;
  const percentage = parseFinite(value.trim().slice(0, -1));
  return percentage === undefined || percentage < 0 || percentage > 100 ? undefined : percentage;
}

function parseAlpha(value: string | undefined): number | undefined {
  if (value === undefined) return 1;
  const source = value.trim();
  if (source.endsWith('%')) {
    const percentage = parseFinite(source.slice(0, -1));
    return percentage === undefined || percentage < 0 || percentage > 100
      ? undefined
      : percentage / 100;
  }
  const alpha = parseFinite(source);
  return alpha === undefined || alpha < 0 || alpha > 1 ? undefined : alpha;
}

function parseFinite(value: string): number | undefined {
  if (!value || !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDecimal(value: number): string {
  return String(round(value, 3));
}

function round(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}
