import { useEffect, useRef, type RefObject } from 'react';

export type NativePopoverElement = HTMLDivElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

export function getNativePopoverValue(): 'auto' {
  // The server and the first client render must produce identical attributes.
  // Unsupported browsers ignore this attribute; the effect below uses hidden.
  return 'auto';
}

/** Keeps React overlay renderers on one native-popover lifecycle and fallback behavior. */
export function useNativePopover(open: boolean): RefObject<NativePopoverElement | null> {
  const popoverRef = useRef<NativePopoverElement | null>(null);
  const popoverMode = useRef('auto');

  useEffect(() => {
    const element = popoverRef.current;
    if (!element) return;
    popoverMode.current = element.getAttribute('popover') ?? popoverMode.current;

    const useVisibilityFallback = (): void => {
      // Some DOM implementations recognize popover CSS without exposing its API.
      // Remove the native hiding rule only after hydration has matched the markup.
      element.removeAttribute('popover');
      element.hidden = !open;
    };

    if (typeof element.showPopover !== 'function' || typeof element.hidePopover !== 'function') {
      useVisibilityFallback();
      return;
    }

    if (!element.hasAttribute('popover')) element.setAttribute('popover', popoverMode.current);
    element.hidden = false;

    try {
      const isOpen = element.matches(':popover-open');
      if (open && !isOpen) element.showPopover();
      if (!open && isOpen) element.hidePopover();
    } catch {
      useVisibilityFallback();
    }
  }, [open]);

  return popoverRef;
}
