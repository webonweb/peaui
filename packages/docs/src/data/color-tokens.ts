import globalStylesSource from '@/assets/global.scss?raw';

const paletteMetadata = [
  {
    key: 'primary',
    label: 'Primary',
    description: 'Akcje główne, CTA, linki, focus ringi i wyróżnienia marki PEAUI.',
  },
  {
    key: 'success',
    label: 'Success',
    description: 'Potwierdzenia, ukończone operacje i pozytywne statusy.',
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Stany wymagające uwagi, które nie są jeszcze błędem.',
  },
  {
    key: 'danger',
    label: 'Danger',
    description: 'Błędy, akcje destrukcyjne i komunikaty krytyczne.',
  },
  {
    key: 'violet',
    label: 'Violet',
    description: 'Dodatkowe wyróżnienia i wybrane warianty TagChip.',
  },
  {
    key: 'grey',
    label: 'Grey',
    description: 'Tekst, powierzchnie, obramowania, tła i neutralne stany interfejsu.',
  },
] as const;

export type ColorPaletteKey = (typeof paletteMetadata)[number]['key'];

export type ColorToken = {
  cssVariable: string;
  dark: string;
  level: string;
  light: string;
  palette: ColorPaletteKey;
};

const colorTokenPattern =
  /--peaui-color-([a-z]+)-(\d+):\s*light-dark\((#[\da-f]+),\s*(#[\da-f]+)\);/gi;

const colorTokens: ColorToken[] = [...globalStylesSource.matchAll(colorTokenPattern)].map(
  ([, palette, level, light, dark]) => ({
    cssVariable: `--peaui-color-${palette}-${level}`,
    dark,
    level,
    light,
    palette: palette as ColorPaletteKey,
  }),
);

if (colorTokens.length === 0) {
  throw new Error('Nie udało się odczytać tokenów kolorystycznych PEAUI z global.scss.');
}

export const colorPalettes = paletteMetadata.map((palette) => ({
  ...palette,
  tokens: colorTokens.filter((token) => token.palette === palette.key),
}));

export const colorTokenCount = colorTokens.length;

export const colorTokensCode = `:root {
${colorPalettes
  .map(
    (palette) => `  /* ${palette.label.toUpperCase()} */
${palette.tokens
  .map((token) => `  ${token.cssVariable}: light-dark(${token.light}, ${token.dark});`)
  .join('\n')}`,
  )
  .join('\n\n')}
}`;

export const explicitDarkModeTokensCode = `body.dark-mode {
${colorPalettes
  .map(
    (palette) => `  /* ${palette.label.toUpperCase()} */
${palette.tokens.map((token) => `  ${token.cssVariable}: ${token.dark};`).join('\n')}`,
  )
  .join('\n\n')}
}`;
