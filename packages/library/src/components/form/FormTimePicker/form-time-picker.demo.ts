export const formTimePickerDemoProps = {
  description: 'Wartość jest zapisywana jako lokalny czas w formacie 24-godzinnym.',
  id: 'appointment-time',
  label: 'Godzina spotkania',
  max: '18:00',
  min: '08:00',
  minuteStep: 5,
  name: 'appointmentTime',
  value: '09:30',
} as const;

export const formTimePickerLongLabel =
  'Preferowana godzina rozpoczęcia szczegółowego spotkania podsumowującego projekt';
