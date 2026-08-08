export type InlineEditValue = unknown;
export type InlineEditEditor = 'text' | 'number' | 'select' | 'textarea' | 'custom';
export type InlineEditActivation = 'button' | 'click' | 'dblclick';
export type InlineEditActions = 'buttons' | 'keyboard' | 'both';
export type InlineEditDisplay = 'inline' | 'block';
export type InlineEditSaveMode = 'sync' | 'async';
export type InlineEditTabBehavior = 'commit' | 'cancel' | 'stay';

export type InlineEditOption = Readonly<{
  id?: string;
  label: string;
  value?: unknown;
  disabled?: boolean;
}>;

export type InlineEditValidationResult = boolean | string;
export type InlineEditValidate = (value: InlineEditValue) => InlineEditValidationResult;

export type InlineEditSaveDetail = {
  previousValue: InlineEditValue;
  value: InlineEditValue;
};

export type InlineEditInvalidDetail = InlineEditSaveDetail & {
  message: string;
};

export type InlineEditSlotState = {
  draft: InlineEditValue;
  error?: string;
  loading: boolean;
  updateDraft: (value: InlineEditValue) => void;
};

export const DEFAULT_INLINE_EDIT_VALIDATION_MESSAGE = 'Wprowadź poprawną wartość.';

export function isInlineEditValueEmpty(value: InlineEditValue): boolean {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim());
}

export function areInlineEditValuesEqual(first: InlineEditValue, second: InlineEditValue): boolean {
  return Object.is(first, second);
}

export function resolveInlineEditValidation(
  validate: InlineEditValidate | undefined,
  value: InlineEditValue,
): string | undefined {
  if (!validate) return undefined;

  const result = validate(value);
  if (result === true) return undefined;
  if (typeof result === 'string' && result.trim()) return result.trim();
  return DEFAULT_INLINE_EDIT_VALIDATION_MESSAGE;
}

export function resolveInlineEditDisplayValue(
  value: InlineEditValue,
  editor: InlineEditEditor,
  options: readonly InlineEditOption[],
): string {
  if (isInlineEditValueEmpty(value)) return '';

  if (editor === 'select') {
    const selected = options.find((option) => Object.is(option.value, value));
    if (selected) return selected.label;
  }

  return String(value);
}
