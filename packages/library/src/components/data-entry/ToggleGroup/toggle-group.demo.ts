export type ToggleGroupDemoItem = {
  value: string | number;
  label: string;
};

export const toggleGroupViewItems: ToggleGroupDemoItem[] = [
  { value: 'grid', label: 'Kafelki' },
  { value: 'list', label: 'Lista' },
  { value: 'compact', label: 'Kompaktowo' },
];

export const toggleGroupFormattingItems: ToggleGroupDemoItem[] = [
  { value: 'bold', label: 'Pogrubienie' },
  { value: 'italic', label: 'Kursywa' },
  { value: 'underline', label: 'Podkreślenie' },
];
