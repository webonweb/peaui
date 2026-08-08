import type { DateRangePreset, DateRangeValue } from './date-range-picker.shared';

export const formDateRangePickerDemoValue: DateRangeValue = ['2026-08-10', '2026-08-18'];

export const formDateRangePickerDemoPresets: DateRangePreset[] = [
  { id: 'this-week', label: 'Ten tydzień', value: ['2026-08-10', '2026-08-16'] },
  { id: 'next-week', label: 'Następny tydzień', value: ['2026-08-17', '2026-08-23'] },
  { id: 'month', label: 'Cały miesiąc', value: ['2026-08-01', '2026-08-31'] },
];

export const formDateRangePickerDemoProps = {
  description: 'Wybierz początek i koniec okresu albo skorzystaj z gotowego zakresu.',
  id: 'reporting-range',
  label: 'Zakres raportu',
  name: 'reportingRange',
  presets: formDateRangePickerDemoPresets,
  value: formDateRangePickerDemoValue,
} as const;

export const formDateRangePickerLongLabel =
  'Zakres obowiązywania szczegółowego raportu realizacji całego programu';
