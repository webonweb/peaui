export const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export function collectFocusableElements(containers: Array<HTMLElement | null>): HTMLElement[] {
  const styles = new Map<HTMLElement, CSSStyleDeclaration>();
  const getStyle = (element: HTMLElement): CSSStyleDeclaration => {
    let style = styles.get(element);
    if (!style) {
      style = getComputedStyle(element);
      styles.set(element, style);
    }
    return style;
  };
  const elements = containers.flatMap((container) => {
    if (!container) return [];
    const descendants = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR),
    );
    return container.matches(FOCUSABLE_ELEMENT_SELECTOR)
      ? [container, ...descendants]
      : descendants;
  });

  return elements.filter(
    (element, index, list) =>
      list.indexOf(element) === index &&
      !element.hasAttribute('disabled') &&
      !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
      isRendered(element, getStyle),
  );
}

function isRendered(
  element: HTMLElement,
  getStyle: (element: HTMLElement) => CSSStyleDeclaration,
): boolean {
  if (['hidden', 'collapse'].includes(getStyle(element).visibility)) return false;
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (getStyle(ancestor).display === 'none') return false;
  }
  return true;
}

export function trapTabKey(
  event: KeyboardEvent,
  focusable: readonly HTMLElement[],
  fallback?: HTMLElement | null,
): void {
  if (event.key !== 'Tab') return;
  if (focusable.length === 0) {
    event.preventDefault();
    fallback?.focus();
    return;
  }

  const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
  if (event.shiftKey && currentIndex <= 0) {
    event.preventDefault();
    focusable.at(-1)?.focus();
  } else if (!event.shiftKey && (currentIndex === -1 || currentIndex === focusable.length - 1)) {
    event.preventDefault();
    focusable[0]?.focus();
  }
}

/** Escape belongs to a native child overlay; only modal dialogs also own the Tab trap. */
export function hasOpenDescendantOverlay(
  containers: Array<HTMLElement | null>,
  kind: 'any' | 'modal-dialog' = 'any',
): boolean {
  return containers.some((container) =>
    Array.from(container?.querySelectorAll<HTMLElement>('[popover], dialog[open]') ?? []).some(
      (element) => {
        if (kind === 'modal-dialog') {
          try {
            return element.matches('dialog:modal');
          } catch {
            return false;
          }
        }
        if (element.tagName === 'DIALOG' && element.hasAttribute('open')) return true;
        try {
          return element.matches(':popover-open');
        } catch {
          return false;
        }
      },
    ),
  );
}
