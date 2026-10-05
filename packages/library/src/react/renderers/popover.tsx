/** @jsxImportSource react */

import {
  type RuntimeProps,
  bool,
  callback,
  cx,
  text,
  common,
  node,
  useModel,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useRef,
  useEffect,
  useLayoutEffect,
  useId,
  useState,
  type CSSProperties,
} from 'react';
import { useNativePopover, getNativePopoverValue } from '.././popover-overlayer.shared';
import { collectFocusableElements } from '../../helpers/focus.helper';

export function Popover({
  props,
  kind,
  forwardedRef,
}: {
  props: RuntimeProps;
  kind: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const [open, setOpen] = useModel(props, 'open', false);
  const popoverRef = useNativePopover(open);
  const triggerRef = useRef<HTMLElement | null>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);
  const [hasNativeTrigger, setHasNativeTrigger] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number>();
  const matchTriggerWidth = bool(props, 'matchTriggerWidth');
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!matchTriggerWidth || !trigger) return undefined;
    const measure = (): void => setTriggerWidth(trigger.getBoundingClientRect().width);
    measure();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(trigger);
    return () => observer?.disconnect();
  }, [matchTriggerWidth]);
  const focusOnOpen = useRef(false);
  useEffect(() => {
    if (open && focusOnOpen.current) {
      collectFocusableElements([popoverRef.current])[0]?.focus();
      focusOnOpen.current = false;
    }
  }, [open, popoverRef]);
  const setTriggerRef = (element: HTMLElement | null): void => {
    triggerRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  const root = kind === 'PopoverButton' ? 'peaui-popover-button' : 'peaui-popover-overlayer';
  const popoverId = `peaui-popover-${useId().replaceAll(':', '')}`;
  const triggerId = text(props, 'id') || `${popoverId}-trigger`;
  const manageTriggerAccessibility = bool(props, 'manageTriggerAccessibility', true);
  const nativeTriggerLabel = common(props)['aria-label'];
  const disabled = bool(props, 'disabled');
  const popupType = text(props, 'popupType', 'dialog');
  useLayoutEffect(() => {
    const wrapper = triggerRef.current;
    const child =
      kind === 'PopoverOverlayer' && manageTriggerAccessibility
        ? wrapper?.querySelector<HTMLElement>(
            '[data-peaui-popover-trigger], button, a[href], input, select, textarea, [tabindex]',
          )
        : null;
    activeTriggerRef.current = child ?? wrapper;
    setHasNativeTrigger(Boolean(child));
    if (!child) return undefined;
    const previous = new Map<string, string | null>();
    const assign = (name: string, value: string) => {
      if (child.hasAttribute(name)) return;
      previous.set(name, null);
      child.setAttribute(name, value);
    };
    assign('aria-controls', popoverId);
    assign('aria-expanded', String(open));
    assign('aria-haspopup', popupType);
    if (disabled) assign('aria-disabled', 'true');
    if (!child.hasAttribute('aria-labelledby') && nativeTriggerLabel) {
      assign('aria-label', nativeTriggerLabel);
    }
    return () => {
      for (const [name, value] of previous) {
        if (value === null) child.removeAttribute(name);
        else child.setAttribute(name, value);
      }
    };
  }, [
    kind,
    manageTriggerAccessibility,
    open,
    popoverId,
    props.children,
    disabled,
    nativeTriggerLabel,
    popupType,
  ]);
  const triggerTabIndex = disabled ? -1 : 0;
  const wrapperTabIndex =
    hasNativeTrigger || !manageTriggerAccessibility ? undefined : triggerTabIndex;
  const sharedStyles = {
    '--unique-anchor': `--anchor-${popoverId}`,
    [`--${root}-trigger-width`]:
      matchTriggerWidth && triggerWidth !== undefined ? `${triggerWidth}px` : undefined,
  } as CSSProperties;
  const toggle = (): void => {
    if (bool(props, 'disabled')) return;
    const next = !open;
    setOpen(next);
  };
  const button = kind === 'PopoverButton';
  const rootClasses = cx(
    root,
    button && 'peaui-button-action',
    button && `peaui-button-action--size-${text(props, 'size', 'm')}`,
    button && `peaui-button-action--variant-${text(props, 'variant', 'primary')}`,
    !button && bool(props, 'matchTriggerWidth') && `${root}--match-trigger-width`,
    props.className,
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    callback(props, 'onKeyDown')?.(event);
    if (!open && ['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      focusOnOpen.current = true;
      toggle();
    }
    if (open && event.key === 'Escape') {
      event.preventDefault();
      toggle();
    }
  };
  return (
    <>
      {button ? (
        <button
          {...common(props)}
          id={triggerId}
          aria-controls={popoverId}
          aria-expanded={open}
          aria-haspopup={text(props, 'popupType', 'dialog') as 'dialog'}
          className={rootClasses}
          disabled={bool(props, 'disabled')}
          ref={setTriggerRef}
          style={{ ...props.style, ...sharedStyles }}
          type="button"
          onClick={toggle}
          onKeyDown={handleKeyDown}
          onPointerDown={(event) => callback(props, 'onPointerDown')?.(event)}
        >
          {props.children ?? 'Otwórz'}
        </button>
      ) : (
        <div
          {...common(props)}
          id={triggerId}
          aria-controls={hasNativeTrigger || !manageTriggerAccessibility ? undefined : popoverId}
          aria-label={hasNativeTrigger ? undefined : common(props)['aria-label']}
          aria-disabled={hasNativeTrigger ? undefined : bool(props, 'disabled') || undefined}
          aria-expanded={hasNativeTrigger || !manageTriggerAccessibility ? undefined : open}
          aria-haspopup={
            hasNativeTrigger || !manageTriggerAccessibility
              ? undefined
              : (text(props, 'popupType', 'dialog') as 'dialog')
          }
          className={rootClasses}
          ref={setTriggerRef}
          role={hasNativeTrigger || !manageTriggerAccessibility ? undefined : 'button'}
          style={{ ...props.style, ...sharedStyles }}
          tabIndex={wrapperTabIndex}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          {props.children ?? 'Otwórz'}
        </div>
      )}
      <div
        className={cx(
          `${root}__content`,
          `peaui-${button ? 'popover-button' : 'popover-overlayer'}__content--placement-${text(
            props,
            'placement',
            'bottom',
          )}`,
          bool(props, 'matchTriggerWidth') && `${root}__content--match-trigger-width`,
          text(props, 'contentClass'),
        )}
        id={popoverId}
        aria-labelledby={triggerId}
        popover={getNativePopoverValue()}
        ref={popoverRef}
        role={text(props, 'popupType', 'dialog')}
        style={sharedStyles}
        onToggle={(event) => {
          if (event.nativeEvent.newState !== 'closed' || !open) return;
          setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            activeTriggerRef.current?.focus();
            return;
          }
          if (text(props, 'popupType') !== 'menu') return;
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not(:disabled):not([aria-disabled="true"])',
            ),
          );
          const index = items.indexOf(document.activeElement as HTMLElement);
          let next: number;
          if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = items.length - 1;
          else if (event.key === 'ArrowDown') next = (index + 1) % items.length;
          else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
          else return;
          event.preventDefault();
          items[next]?.focus();
        }}
      >
        {node(props, 'content')}
      </div>
    </>
  );
}
