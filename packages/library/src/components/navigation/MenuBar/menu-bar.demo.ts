import type { DropdownMenuDemoItem } from '../DropdownMenu/dropdown-menu.demo';

export type MenuBarDemoMenu = {
  disabled?: boolean;
  icon?: string;
  id: string | number;
  items: DropdownMenuDemoItem[];
  label: string;
};

export const menuBarDemoMenus: MenuBarDemoMenu[] = [
  {
    id: 'file',
    label: 'Plik',
    icon: 'file',
    items: [
      { id: 'new', label: 'Nowy dokument', shortcut: 'Ctrl+N' },
      { id: 'open', label: 'Otwórz…', shortcut: 'Ctrl+O' },
      { id: 'separator-file', type: 'separator' },
      { id: 'save', label: 'Zapisz', shortcut: 'Ctrl+S' },
      {
        id: 'export',
        type: 'submenu',
        label: 'Eksportuj',
        children: [
          { id: 'export-pdf', label: 'Dokument PDF' },
          { id: 'export-csv', label: 'Dane CSV' },
        ],
      },
    ],
  },
  {
    id: 'edit',
    label: 'Edycja',
    icon: 'edit',
    items: [
      { id: 'undo', label: 'Cofnij', shortcut: 'Ctrl+Z' },
      { id: 'redo', label: 'Ponów', shortcut: 'Ctrl+Shift+Z' },
      { id: 'separator-edit', type: 'separator' },
      { id: 'autosave', type: 'checkbox', label: 'Autozapis', checked: true },
    ],
  },
  {
    id: 'view',
    label: 'Widok',
    items: [
      {
        id: 'density-group',
        type: 'group',
        label: 'Gęstość',
        children: [
          { id: 'density-compact', type: 'radio', label: 'Kompaktowa', value: 'compact' },
          {
            id: 'density-comfortable',
            type: 'radio',
            label: 'Wygodna',
            value: 'comfortable',
            checked: true,
          },
        ],
      },
      { id: 'fullscreen', label: 'Pełny ekran', shortcut: 'F11' },
    ],
  },
  {
    id: 'tools',
    label: 'Narzędzia',
    items: [{ id: 'preferences', label: 'Preferencje' }],
  },
  {
    id: 'help',
    label: 'Pomoc i dokumentacja',
    icon: 'help',
    items: [
      { id: 'docs', label: 'Dokumentacja PeaUI' },
      { id: 'shortcuts', label: 'Skróty klawiaturowe' },
    ],
  },
];

export const menuBarDemoProps = {
  ariaLabel: 'Menu edytora',
  menus: menuBarDemoMenus,
} as const;
