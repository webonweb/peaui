export type SegmentedControlDemoItem = {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
};

export const segmentedControlViewItems: SegmentedControlDemoItem[] = [
  { value: 'list', label: 'Lista', icon: 'filters' },
  { value: 'grid', label: 'Kafelki', icon: 'screen' },
  { value: 'compact', label: 'Kompaktowo', icon: 'compressArrows' },
];

export const segmentedControlPeriodItems: SegmentedControlDemoItem[] = [
  { value: 7, label: '7 dni' },
  { value: 30, label: '30 dni' },
  { value: 90, label: '90 dni' },
  { value: 365, label: 'Rok' },
];
