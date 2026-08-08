import type { LocalDateTimeValue } from './date-time-picker.shared';

export const formDateTimePickerDemoValue: LocalDateTimeValue = {
  date: '2026-08-18',
  time: '09:30',
};

export const formDateTimePickerDemoProps = {
  description: 'Wartość zachowuje lokalną datę i czas bez automatycznej konwersji strefy.',
  id: 'appointment-date-time',
  label: 'Termin spotkania',
  minuteStep: 5,
  name: 'appointmentDateTime',
  showTimeZone: true,
  value: formDateTimePickerDemoValue,
} as const;

export const formDateTimePickerLongLabel =
  'Planowany termin szczegółowego spotkania podsumowującego realizację projektu';
