import type { DropdownMenuDemoItem } from '../../navigation/DropdownMenu/dropdown-menu.demo';

export const splitButtonDemoItems: DropdownMenuDemoItem[] = [
  {
    id: 'export-group',
    type: 'group',
    label: 'Inne formaty',
    children: [
      { id: 'pdf', label: 'Eksportuj jako PDF', icon: 'fileDownload', value: 'pdf' },
      { id: 'csv', label: 'Eksportuj jako CSV', icon: 'fileDownload', value: 'csv' },
    ],
  },
  { id: 'separator', type: 'separator' },
  { id: 'settings', label: 'Ustawienia eksportu', icon: 'cogs', value: 'settings' },
];

export const splitButtonDemoProps = {
  ariaLabel: 'Akcje eksportu',
  icon: 'download',
  items: splitButtonDemoItems,
  label: 'Eksportuj',
  menuAriaLabel: 'Więcej opcji eksportu',
  variant: 'primary' as const,
};
