export const FORM_FIELD_ERASE_ACTION_SIZE_PX = 32;
export const FORM_FIELD_ERASE_ACTION_RESERVE_PX = 36;

type FormFieldTrailingLayoutOptions = {
  after?: string;
  canErase?: boolean;
  hasAdditional?: boolean;
  iconAfter?: string;
  minimumEraseOffset?: number;
  trailingControlWidth?: number;
};

function normalizePixels(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getAffixWidth(after: string, hasIconAfter: boolean): number {
  return after.length * 7.5 + 12 + (hasIconAfter ? 24 : 0);
}

/**
 * Returns the safe inset for the erase action, measured from the field's inline end.
 * The value keeps the action clear of suffixes, trailing icons and component-owned controls.
 */
export function getFormFieldEraseOffset({
  after,
  hasAdditional = false,
  iconAfter,
  minimumEraseOffset,
  trailingControlWidth,
}: FormFieldTrailingLayoutOptions): number {
  const normalizedAfter = after?.trim() ?? '';
  let baseOffset = 12;

  if (normalizedAfter) {
    baseOffset = getAffixWidth(normalizedAfter, Boolean(iconAfter)) + 4;
  } else if (Boolean(iconAfter) || hasAdditional) {
    baseOffset = 44;
  }

  return Math.max(
    baseOffset + normalizePixels(trailingControlWidth),
    normalizePixels(minimumEraseOffset),
  );
}

/** Reserves enough input space for all trailing content and the complete erase target. */
export function getFormFieldPaddingRight(options: FormFieldTrailingLayoutOptions): number {
  const normalizedAfter = options.after?.trim() ?? '';

  if (options.canErase !== true) {
    if (normalizedAfter) {
      return getAffixWidth(normalizedAfter, Boolean(options.iconAfter));
    }

    if (options.iconAfter) return 32;
    if (options.hasAdditional === true) return 44 + normalizePixels(options.trailingControlWidth);
    return 12;
  }

  return getFormFieldEraseOffset(options) + FORM_FIELD_ERASE_ACTION_RESERVE_PX;
}
