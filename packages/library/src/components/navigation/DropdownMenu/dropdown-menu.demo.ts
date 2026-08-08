export type DropdownMenuDemoItem = {
  checked?: boolean;
  children?: DropdownMenuDemoItem[];
  disabled?: boolean;
  icon?: string;
  id: string;
  label?: string;
  shortcut?: string;
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'group' | 'submenu';
  value?: unknown;
  variant?: 'default' | 'danger';
};

export const dropdownMenuDemoItems: DropdownMenuDemoItem[] = [
  { id: 'edit', label: 'Edytuj profil', icon: 'edit', shortcut: '⌘ E' },
  { id: 'duplicate', label: 'Duplikuj', icon: 'copy', shortcut: '⌘ D' },
  { id: 'separator-main', type: 'separator' },
  {
    id: 'preferences',
    type: 'group',
    label: 'Preferencje',
    children: [
      { id: 'notifications', type: 'checkbox', label: 'Powiadomienia', checked: true },
      { id: 'compact', type: 'radio', label: 'Widok kompaktowy', value: 'compact' },
      {
        id: 'comfortable',
        type: 'radio',
        label: 'Widok wygodny',
        value: 'comfortable',
        checked: true,
      },
    ],
  },
  {
    id: 'share',
    type: 'submenu',
    label: 'Udostępnij',
    icon: 'users',
    children: [
      { id: 'copy-link', label: 'Kopiuj link', icon: 'copy' },
      { id: 'email', label: 'Wyślij e-mailem', disabled: true },
    ],
  },
  { id: 'separator-danger', type: 'separator' },
  { id: 'delete', label: 'Usuń', icon: 'trash', variant: 'danger' },
];

export const dropdownMenuDemoProps = {
  ariaLabel: 'Akcje profilu',
  items: dropdownMenuDemoItems,
  triggerLabel: 'Opcje',
} as const;
