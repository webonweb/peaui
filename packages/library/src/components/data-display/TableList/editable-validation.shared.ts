import { getDeepValue, isSafeObjectPath, setDeepValue } from '../../../helpers/object.helper';

export type EditableManageRules = {
  integer?: boolean;
  mask?: string;
  regex?: RegExp;
  required?: boolean;
  type?: 'select' | 'number' | 'text' | 'multiselect';
};

export type EditableValidationMessages = {
  integer: string;
  required: string;
};

export function validateEditableValue(
  value: unknown,
  manage: EditableManageRules | undefined,
  messages: EditableValidationMessages,
): string | undefined {
  if (!manage) return undefined;

  if (manage.type === 'number') {
    const numericValue = typeof value === 'number' ? value : Number(value);

    if (
      manage.required === true &&
      (value === '' || value === null || value === undefined || Number.isNaN(numericValue))
    ) {
      return messages.required;
    }

    if (
      manage.integer === true &&
      value !== '' &&
      value !== null &&
      value !== undefined &&
      !Number.isInteger(numericValue)
    ) {
      return messages.integer;
    }

    return undefined;
  }

  if (manage.type === 'multiselect') {
    return manage.required === true && (!Array.isArray(value) || value.length === 0)
      ? messages.required
      : undefined;
  }

  const stringValue =
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      ? String(value)
      : '';

  if (manage.mask !== undefined && manage.regex !== undefined) {
    return new RegExp(manage.regex.source, manage.regex.flags).test(stringValue)
      ? undefined
      : messages.required;
  }

  return manage.required === true && stringValue.trim() === '' ? messages.required : undefined;
}

export function setDeepEditableValue(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  setDeepValue(target, path, value);
}

export function getDeepEditableValue(target: Record<string, unknown>, path: string): unknown {
  return getDeepValue(target, path);
}

export function replaceEditableValues(
  target: Record<string, unknown>,
  values: Record<string, unknown>,
): void {
  Object.keys(target).forEach((key) => delete target[key]);
  for (const [key, value] of Object.entries(values)) {
    if (isSafeObjectPath(key)) target[key] = value;
  }
}
