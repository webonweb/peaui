/** Shared hover/focus lifecycle: dismissible, hoverable and persistent (WCAG 1.4.13). */
export function bindTooltipVisibility(
  trigger: HTMLElement,
  content: HTMLElement,
  onChange: (visible: boolean) => void,
  focusTrigger: HTMLElement = trigger,
): () => void {
  let hovered = false;
  let focused = false;
  let dismissed = false;
  let visible = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  const ownerDocument = trigger.ownerDocument;
  const cancelClose = (): void => {
    clearTimeout(closeTimer);
  };
  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !visible) return;
    event.preventDefault();
    event.stopPropagation();
    dismissed = true;
    sync();
  };
  const sync = (): void => {
    const next = !dismissed && (hovered || focused);
    if (visible === next) return;
    visible = next;
    if (visible) ownerDocument.addEventListener('keydown', handleEscape, true);
    else ownerDocument.removeEventListener('keydown', handleEscape, true);
    onChange(visible);
  };
  const enter = (): void => {
    cancelClose();
    hovered = true;
    dismissed = false;
    sync();
  };
  const leave = (): void => {
    cancelClose();
    // Allows crossing the small positioning gap between trigger and tooltip.
    closeTimer = setTimeout(() => {
      hovered = false;
      sync();
    }, 100);
  };
  const focusIn = (): void => {
    focused = true;
    dismissed = false;
    sync();
  };
  const focusOut = (event: FocusEvent): void => {
    if (
      event.relatedTarget instanceof Node &&
      (focusTrigger.contains(event.relatedTarget) || content.contains(event.relatedTarget))
    )
      return;
    focused = false;
    sync();
  };
  for (const element of [trigger, content]) {
    element.addEventListener('mouseenter', enter);
    element.addEventListener('mouseleave', leave);
  }
  for (const element of [focusTrigger, content]) {
    element.addEventListener('focusin', focusIn);
    element.addEventListener('focusout', focusOut);
  }
  if (ownerDocument.activeElement && focusTrigger.contains(ownerDocument.activeElement)) focusIn();
  return () => {
    cancelClose();
    ownerDocument.removeEventListener('keydown', handleEscape, true);
    for (const element of [trigger, content]) {
      element.removeEventListener('mouseenter', enter);
      element.removeEventListener('mouseleave', leave);
    }
    for (const element of [focusTrigger, content]) {
      element.removeEventListener('focusin', focusIn);
      element.removeEventListener('focusout', focusOut);
    }
  };
}
