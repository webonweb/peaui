import { useEffect, useRef, type RefObject } from 'react';

export type NativePopoverElement = HTMLDivElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

export function getNativePopoverValue(): 'auto' | undefined {
  return typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype.showPopover === 'function'
    ? 'auto'
    : undefined;
}

/** Keeps React overlay renderers on one native-popover lifecycle and fallback behavior. */
export function useNativePopover(open: boolean): RefObject<NativePopoverElement | null> {
  const popoverRef = useRef<NativePopoverElement | null>(null);

  useEffect(() => {
    const element = popoverRef.current;
    if (!element) return;

    if (typeof element.showPopover !== 'function' || typeof element.hidePopover !== 'function') {
      element.hidden = !open;
      return;
    }

    element.hidden = false;

    try {
      const isOpen = element.matches(':popover-open');
      if (open && !isOpen) element.showPopover();
      if (!open && isOpen) element.hidePopover();
    } catch {
      element.hidden = !open;
    }
  }, [open]);

  return popoverRef;
}
