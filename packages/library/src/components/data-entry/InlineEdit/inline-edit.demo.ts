import type { InlineEditOption } from './inline-edit.shared';

export const inlineEditOptions: InlineEditOption[] = [
  { id: 'draft', label: 'Wersja robocza', value: 'draft' },
  { id: 'review', label: 'Do weryfikacji', value: 'review' },
  { id: 'published', label: 'Opublikowane', value: 'published' },
];

export const inlineEditDemoProps = {
  dataTestId: 'inline-edit-default',
  editAriaLabel: 'Edytuj nazwę projektu',
  value: 'Panel klienta',
};
