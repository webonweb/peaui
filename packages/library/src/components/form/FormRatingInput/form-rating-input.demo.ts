import type { RatingLabels } from './rating-input.shared';

export const formRatingInputLabels: RatingLabels = {
  '0.5': 'Bardzo słaba',
  '1': 'Słaba',
  '1.5': 'Poniżej oczekiwań',
  '2': 'Przeciętna',
  '2.5': 'W porządku',
  '3': 'Dobra',
  '3.5': 'Bardzo dobra',
  '4': 'Świetna',
  '4.5': 'Znakomita',
  '5': 'Wyjątkowa',
};

export const formRatingInputDemoProps = {
  description: 'Oceń jakość obsługi w skali od 1 do 5.',
  id: 'service-rating',
  label: 'Ocena obsługi',
  labels: formRatingInputLabels,
  max: 5,
  name: 'serviceRating',
  value: 3.5,
} as const;

export const formRatingInputLongLabel =
  'Ogólna ocena jakości, dostępności i kompletności świadczonej usługi';
