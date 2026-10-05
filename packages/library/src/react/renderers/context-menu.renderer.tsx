/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type RuntimeProps,
  bool,
  text,
  num,
  dataTest,
  useModel,
  callback,
  common,
  cx,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useRef,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { DropdownMenuRenderer, type ReactDropdownMenuItem } from './dropdown-menu.renderer';

export type ReactContextMenuHandle = HTMLElement & {
  close(): void;
  openAt(point: { context?: unknown; x: number; y: number }): boolean;
};

export type ReactContextAnchor = {
  align: 'start' | 'end';
  placement: 'top' | 'bottom';
  rect: DOMRect;
  target: HTMLElement | null;
  version: number;
};

export function contextPointRect(x: number, y: number): DOMRect {
  return {
    bottom: y,
    height: 0,
    left: x,
    right: x,
    top: y,
    width: 0,
    x,
    y,
    toJSON: () => ({ bottom: y, height: 0, left: x, right: x, top: y, width: 0, x, y }),
  };
}

export function ContextMenuRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const disabled = bool(props, 'disabled');
  const pointerEnabled = ['pointer', 'both'].includes(text(props, 'trigger', 'both'));
  const keyboardEnabled = ['keyboard', 'both'].includes(text(props, 'trigger', 'both'));
  const position = text(props, 'position', 'cursor');
  const longPress = bool(props, 'longPress', true);
  const longPressDelay = Math.min(1500, Math.max(300, num(props, 'longPressDelay', 550)));
  const longPressMoveThreshold = Math.max(4, num(props, 'longPressMoveThreshold', 10));
  const closeOnScroll = bool(props, 'closeOnScroll', true);
  const baseTestId = dataTest(props);
  const menuId = `peaui-context-menu-${useId().replace(/:/g, '')}-menu`;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const [open, setOpen] = useModel<boolean>(props, 'open', false);
  const [activeContext, setActiveContext] = useState(props.context);
  const [targetHasFocusableChild, setTargetHasFocusableChild] = useState(false);
  const [anchor, setAnchor] = useState<ReactContextAnchor>(() => ({
    align: 'start',
    placement: 'bottom',
    rect: contextPointRect(0, 0),
    target: null,
    version: 0,
  }));
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const targetHostRef = useRef<HTMLSpanElement | null>(null);
  const managedTargetRef = useRef<HTMLElement | null>(null);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const virtualTriggerRef = useRef<HTMLButtonElement | null>(null);
  const longPressState = useRef<
    | {
        pointerId: number;
        startX: number;
        startY: number;
        target: HTMLElement;
      }
    | undefined
  >(undefined);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingCloseReason = useRef('dismiss');
  const renderTarget = props.renderTarget as
    ((state: { context: unknown; disabled: boolean; open: boolean }) => ReactNode) | undefined;

  const setContext = (nextContext: unknown): void => {
    if (Object.is(activeContext, nextContext)) return;
    setActiveContext(nextContext);
    callback(props, 'onContextChange')?.(nextContext);
  };
  const cancelLongPress = (reason: string, notify = true): void => {
    if (!longPressState.current && !longPressTimer.current) return;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = undefined;
    longPressState.current = undefined;
    if (notify) callback(props, 'onLongPressCancel')?.(reason);
  };
  const close = (reason = 'programmatic'): void => {
    cancelLongPress(reason === 'disabled' ? 'disabled' : 'release', false);
    if (!open) return;
    pendingCloseReason.current = reason;
    setOpen(false);
    callback(props, 'onClose')?.(reason);
  };
  const requestOpenAt = (
    rect: DOMRect,
    target: HTMLElement | null,
    source: 'pointer' | 'keyboard' | 'long-press' | 'programmatic',
    nextContext: unknown,
  ): boolean => {
    if (disabledRef.current) return false;
    const resolvedTarget = target?.isConnected ? target : managedTargetRef.current;
    const viewportLeft = window.visualViewport?.offsetLeft ?? 0;
    const viewportTop = window.visualViewport?.offsetTop ?? 0;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    activeTargetRef.current = resolvedTarget;
    setContext(nextContext);
    pendingCloseReason.current = 'dismiss';
    setAnchor((current) => ({
      align: centerX > viewportLeft + viewportWidth / 2 ? 'end' : 'start',
      placement: centerY > viewportTop + viewportHeight / 2 ? 'top' : 'bottom',
      rect,
      target: resolvedTarget,
      version: current.version + 1,
    }));
    setOpen(true);
    callback(
      props,
      'onOpen',
    )?.({
      context: nextContext,
      source,
      x: rect.left,
      y: rect.top,
    });
    return true;
  };
  const openAt = (point: { context?: unknown; x: number; y: number }): boolean => {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
    const nextContext = Object.prototype.hasOwnProperty.call(point, 'context')
      ? point.context
      : props.context;
    return requestOpenAt(
      contextPointRect(point.x, point.y),
      managedTargetRef.current,
      'programmatic',
      nextContext,
    );
  };
  const setRootRef = (element: HTMLSpanElement | null): void => {
    rootRef.current = element;
    if (element) {
      const handle = element as ReactContextMenuHandle;
      handle.openAt = openAt;
      handle.close = () => close();
    }
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  const resolveEventTarget = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof HTMLElement) || !targetHostRef.current?.contains(target)) {
      return managedTargetRef.current;
    }
    return (
      target.closest<HTMLElement>(
        'button, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
      ) ??
      managedTargetRef.current ??
      target
    );
  };
  const openForTarget = (target: HTMLElement | null, source: 'pointer' | 'keyboard'): boolean => {
    const resolvedTarget = target?.isConnected ? target : managedTargetRef.current;
    if (!resolvedTarget) return false;
    return requestOpenAt(
      resolvedTarget.getBoundingClientRect(),
      resolvedTarget,
      source,
      props.context,
    );
  };
  const contextMenuActionsRef = useRef({ cancelLongPress, close });
  contextMenuActionsRef.current = { cancelLongPress, close };

  useEffect(() => setActiveContext(props.context), [props.context]);

  useEffect(() => {
    const host = targetHostRef.current;
    if (!host) return undefined;
    let currentTarget: HTMLElement | null = null;
    let originals: Map<string, string | null> | undefined;
    const restore = (): void => {
      if (!currentTarget || currentTarget === host || !originals) return;
      for (const [name, value] of originals) {
        if (value === null) currentTarget.removeAttribute(name);
        else currentTarget.setAttribute(name, value);
      }
    };
    const sync = (): void => {
      const nextTarget =
        host.querySelector<HTMLElement>(
          'button, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
        ) ?? host;
      if (currentTarget !== nextTarget) {
        restore();
        currentTarget = nextTarget;
        originals =
          nextTarget === host
            ? undefined
            : new Map(
                ['aria-haspopup', 'aria-expanded', 'aria-controls'].map((name) => [
                  name,
                  nextTarget.getAttribute(name),
                ]),
              );
      }
      managedTargetRef.current = nextTarget;
      setTargetHasFocusableChild(nextTarget !== host);
      if (disabled) {
        nextTarget.removeAttribute('aria-haspopup');
        nextTarget.removeAttribute('aria-expanded');
        nextTarget.removeAttribute('aria-controls');
      } else {
        nextTarget.setAttribute('aria-haspopup', 'menu');
        nextTarget.setAttribute('aria-expanded', String(open));
        nextTarget.setAttribute('aria-controls', menuId);
      }
      if (activeTargetRef.current && !activeTargetRef.current.isConnected) {
        contextMenuActionsRef.current.cancelLongPress('target-removed');
        contextMenuActionsRef.current.close('target-removed');
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(host, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      restore();
      if (managedTargetRef.current === currentTarget) managedTargetRef.current = null;
    };
  }, [disabled, menuId, open, props.children]);

  useEffect(() => {
    const trigger = virtualTriggerRef.current;
    if (!trigger) return;
    trigger.getBoundingClientRect = () => anchor.rect;
    trigger.focus = (options?: FocusOptions) => {
      const target = activeTargetRef.current?.isConnected
        ? activeTargetRef.current
        : managedTargetRef.current;
      target?.focus(options);
    };
  }, [anchor]);

  useEffect(() => {
    if (!disabled) return;
    contextMenuActionsRef.current.cancelLongPress('disabled');
    contextMenuActionsRef.current.close('disabled');
  }, [disabled]);

  useEffect(() => {
    if (!open || !closeOnScroll) return undefined;
    const handleScroll = (event: Event): void => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      contextMenuActionsRef.current.close('scroll');
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open, closeOnScroll]);

  useEffect(
    () => () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    },
    [],
  );

  const targetContent = renderTarget?.({ context: activeContext, disabled, open }) ??
    props.children ?? (
      <span className="peaui-context-menu__placeholder">
        Kliknij prawym przyciskiem lub naciśnij Shift+F10
      </span>
    );

  return (
    <span
      {...common(props)}
      aria-label={undefined}
      className={cx(
        'peaui-context-menu',
        disabled && 'peaui-context-menu--disabled',
        open && 'peaui-context-menu--open',
        props.className,
      )}
      data-testid={baseTestId}
      ref={setRootRef}
    >
      <span
        aria-controls={!disabled && !targetHasFocusableChild ? menuId : undefined}
        aria-expanded={!disabled && !targetHasFocusableChild ? open : undefined}
        aria-haspopup={!disabled && !targetHasFocusableChild ? 'menu' : undefined}
        className="peaui-context-menu__target"
        ref={targetHostRef}
        tabIndex={!targetHasFocusableChild && !disabled ? 0 : undefined}
        onContextMenu={(event) => {
          if (!pointerEnabled || disabled || event.defaultPrevented) return;
          const target = resolveEventTarget(event.target);
          const activated =
            position === 'target'
              ? openForTarget(target, 'pointer')
              : requestOpenAt(
                  contextPointRect(event.clientX, event.clientY),
                  target,
                  'pointer',
                  props.context,
                );
          if (activated) event.preventDefault();
        }}
        onKeyDown={(event) => {
          if (!keyboardEnabled || disabled) return;
          if (!(
            event.key === 'ContextMenu' ||
            event.key === 'Apps' ||
            (event.shiftKey && event.key === 'F10')
          ))
            return;
          if (openForTarget(resolveEventTarget(event.target), 'keyboard')) event.preventDefault();
        }}
        onPointerCancel={(event) => {
          if (longPressState.current?.pointerId === event.pointerId)
            cancelLongPress('pointer-cancel');
        }}
        onPointerDown={(event) => {
          if (
            !longPress ||
            !pointerEnabled ||
            disabled ||
            event.pointerType !== 'touch' ||
            !event.isPrimary ||
            event.button !== 0
          )
            return;
          cancelLongPress('pointer-cancel', false);
          const target = resolveEventTarget(event.target);
          if (!target) return;
          longPressState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            target,
          };
          longPressTimer.current = setTimeout(() => {
            const state = longPressState.current;
            longPressState.current = undefined;
            longPressTimer.current = undefined;
            if (!state?.target.isConnected || disabledRef.current) return;
            requestOpenAt(
              contextPointRect(state.startX, state.startY),
              state.target,
              'long-press',
              props.context,
            );
          }, longPressDelay);
        }}
        onPointerMove={(event) => {
          const state = longPressState.current;
          if (!state || state.pointerId !== event.pointerId) return;
          const distance = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
          if (distance > longPressMoveThreshold) cancelLongPress('move');
        }}
        onPointerUp={(event) => {
          if (longPressState.current?.pointerId === event.pointerId) cancelLongPress('release');
        }}
      >
        {targetContent}
      </span>

      <DropdownMenuRenderer
        {...props}
        __anchorVersion={anchor.version}
        __menuId={menuId}
        ariaLabel={text(props, 'ariaLabel') || text(props, 'aria-label', 'Menu kontekstowe')}
        children={undefined}
        className="peaui-context-menu__menu"
        dataTestId={baseTestId ? `${baseTestId}-dropdown` : undefined}
        density={text(props, 'density', 'comfortable')}
        offset={Math.max(0, num(props, 'offset', 4))}
        open={open}
        align={anchor.align}
        placement={anchor.placement}
        renderTrigger={() => (
          <button
            aria-hidden="true"
            className="peaui-context-menu__virtual-trigger"
            inert
            ref={virtualTriggerRef}
            tabIndex={-1}
            type="button"
          />
        )}
        onCheckedChange={(item: ReactDropdownMenuItem, checked: boolean, path: number[]) =>
          callback(props, 'onCheckedChange')?.(item, checked, path, activeContext)
        }
        onOpenChange={(value: boolean) => {
          if (value) setOpen(true);
          else if (open) close(pendingCloseReason.current);
        }}
        onSelect={(item: ReactDropdownMenuItem, path: number[]) => {
          pendingCloseReason.current = 'select';
          callback(props, 'onSelect')?.(item, path, activeContext);
        }}
        onValueChange={(item: ReactDropdownMenuItem, value: unknown, path: number[]) =>
          callback(props, 'onValueChange')?.(item, value, path, activeContext)
        }
      />
    </span>
  );
}
