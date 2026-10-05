/** Native validation for composite controls whose visible input is readonly, range, or buttons. */
export function getRequiredValueAttributes(
  hasValue: boolean,
  required: boolean | undefined,
  disabled: boolean | undefined,
  readonly: boolean | undefined,
  form?: string,
) {
  return {
    'aria-hidden': true as const,
    tabIndex: -1,
    type: 'text' as const,
    required: required === true && readonly !== true,
    disabled: disabled === true || readonly === true,
    form,
    value: hasValue ? 'selected' : '',
    // Same visually-hidden technique as sr-only, independent of the consumer's CSS entrypoint.
    style: {
      position: 'absolute' as const,
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap' as const,
      border: 0,
    },
  };
}

export function focusInvalidValue(event: Event, control: HTMLElement | null | undefined): void {
  event.preventDefault();
  control?.focus();
}
