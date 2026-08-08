/** @jsxImportSource react */
import type { CSSProperties, ReactElement, ReactNode, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';

import type {
  InlineEditActions,
  InlineEditActivation,
  InlineEditDisplay,
  InlineEditEditor,
  InlineEditInvalidDetail,
  InlineEditSaveDetail,
  InlineEditSaveMode,
  InlineEditSlotState,
  InlineEditTabBehavior,
  InlineEditValidate,
  InlineEditValue,
} from './inline-edit.shared';

export type InlineEditProps = {
  value?: InlineEditValue;
  defaultValue?: InlineEditValue;
  editing?: boolean;
  defaultEditing?: boolean;
  editor?: InlineEditEditor;
  editorProps?: Record<string, unknown>;
  activation?: InlineEditActivation;
  actions?: InlineEditActions;
  display?: InlineEditDisplay;
  tabBehavior?: InlineEditTabBehavior;
  saveMode?: InlineEditSaveMode;
  validate?: InlineEditValidate;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  emptyText?: string;
  editAriaLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  dataTestId?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  empty?: ReactNode;
  displayContent?: ReactNode;
  renderDisplay?: (value: InlineEditValue) => ReactNode;
  renderEditor?: (state: InlineEditSlotState) => ReactNode;
  renderActions?: (state: {
    cancel: () => void;
    dirty: boolean;
    loading: boolean;
    save: () => void;
  }) => ReactNode;
  renderError?: (message: string) => ReactNode;
  onValueChange?: (value: InlineEditValue) => void;
  onEditingChange?: (editing: boolean) => void;
  onEdit?: (value: InlineEditValue) => void;
  onSave?: (detail: InlineEditSaveDetail) => void;
  onCancel?: (value: InlineEditValue) => void;
  onInvalid?: (detail: InlineEditInvalidDetail) => void;
  onDraftChange?: (value: InlineEditValue) => void;
  'data-testid'?: string;
};

export type {
  InlineEditActions,
  InlineEditActivation,
  InlineEditDisplay,
  InlineEditEditor,
  InlineEditInvalidDetail,
  InlineEditOption,
  InlineEditSaveDetail,
  InlineEditSaveMode,
  InlineEditSlotState,
  InlineEditTabBehavior,
  InlineEditValidate,
  InlineEditValidationResult,
  InlineEditValue,
} from './inline-edit.shared';

const InlineEditBase = createPeauiReactComponent('InlineEdit');
const InlineEdit = InlineEditBase as unknown as (
  props: InlineEditProps & RefAttributes<HTMLElement>,
) => ReactElement | null;

export default InlineEdit;
