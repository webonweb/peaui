import type { FormColorPickerSwatch } from './color-picker.shared';

export const formColorPickerSavedColors: readonly FormColorPickerSwatch[] = [
  { label: 'Zieleń marki', value: '#4C9A2A' },
  { label: 'Granat marki', value: '#17324D' },
  { label: 'Błękit informacyjny', value: '#287BB5' },
  { label: 'Czerwony alarmowy', value: '#C73E3A' },
];

export const formColorPickerRecentColors: readonly FormColorPickerSwatch[] = [
  { label: 'Fioletowy', value: '#7651A8' },
  { label: 'Pomarańczowy', value: '#D26A22' },
];

export const formColorPickerDemoProps = {
  alpha: true,
  description: 'Wybierz z palety lub wpisz kolor w formacie HEX.',
  id: 'brand-color',
  label: 'Kolor marki',
  name: 'brandColor',
  recentColors: formColorPickerRecentColors,
  savedColors: formColorPickerSavedColors,
  value: '#4C9A2AE6',
} as const;

export const formColorPickerLongLabel =
  'Kolor wyróżniający dla szczegółowej prezentacji projektu i komunikacji marketingowej';
