import {
  dropdownMenuDemoItems,
  type DropdownMenuDemoItem,
} from '../DropdownMenu/dropdown-menu.demo';

export const contextMenuDemoItems: DropdownMenuDemoItem[] = dropdownMenuDemoItems;

export const contextMenuDemoProps = {
  ariaLabel: 'Akcje elementu',
  context: { id: 'report-q3', type: 'document' },
  items: contextMenuDemoItems,
  position: 'cursor' as const,
};
