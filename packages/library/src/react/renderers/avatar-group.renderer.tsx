/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type RuntimeProps,
  text,
  useModel,
  bool,
  dataTest,
  callback,
  cx,
  node,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useRef,
  useId,
  useEffect,
  useLayoutEffect,
  type KeyboardEventHandler,
  type CSSProperties,
} from 'react';
import { normalizeAvatarText, AvatarRenderer } from './avatar.renderer';
import { observeAvatarGroupPopover } from '../../components/data-display/AvatarGroup/avatar-group.shared';

export type ReactAvatarGroupItem = {
  alt?: string;
  disabled?: boolean;
  id: string | number;
  initials?: string;
  metadata?: unknown;
  name?: string;
  src?: string;
  status?: string;
};

export function asAvatarGroupItems(value: unknown): ReactAvatarGroupItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (entry): entry is ReactAvatarGroupItem =>
      typeof entry === 'object' &&
      entry !== null &&
      (typeof (entry as ReactAvatarGroupItem).id === 'string' ||
        typeof (entry as ReactAvatarGroupItem).id === 'number'),
  );
}

export function AvatarGroupRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const items = asAvatarGroupItems(props.items);
  const rawLimit = typeof props.maxVisible === 'number' ? props.maxVisible : 3;
  const limit = Number.isFinite(rawLimit) ? Math.max(0, Math.floor(rawLimit)) : items.length;
  const visibleItems = items.slice(0, limit);
  const hiddenItems = items.slice(limit);
  const overflowMode = text(props, 'overflowMode', 'count');
  const hasOverflow = overflowMode !== 'none' && hiddenItems.length > 0;
  const [open, setOpen] = useModel<boolean>(props, 'open', false);
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const showsPopover = overflowMode === 'popover' && hasOverflow && open && !disabled;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const overflowButtonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocus = useRef(false);
  const popoverHadFocus = useRef(false);
  const lastPopoverFocus = useRef<{ element: HTMLElement; index: number } | null>(null);
  const previousLoading = useRef(loading);
  const popoverId = `peaui-avatar-group-popover-${useId().replace(/:/g, '')}`;
  const size = text(props, 'size', 'm');
  const shape = text(props, 'shape', 'circle');
  const direction = text(props, 'direction', 'end');
  const overlap = bool(props, 'overlap', true);
  const baseTestId = dataTest(props);
  const statusLabels: Readonly<Record<string, string>> = {
    away: 'Zaraz wracam',
    busy: 'Zajęty',
    offline: 'Niedostępny',
    online: 'Dostępny',
  };
  const renderItem = callback(props, 'renderItem');
  const renderOverflow = callback(props, 'renderOverflow');
  const renderPopoverItem = callback(props, 'renderPopoverItem');
  const resolveName = (item: ReactAvatarGroupItem, index: number): string =>
    normalizeAvatarText(item.name) ??
    normalizeAvatarText(item.alt) ??
    normalizeAvatarText(item.initials) ??
    `Użytkownik ${index + 1}`;
  const resolveLabel = (item: ReactAvatarGroupItem, index: number): string => {
    const status = item.status && item.status !== 'none' ? statusLabels[item.status] : undefined;
    const name = resolveName(item, index);

    return status ? `${name}, ${status}` : name;
  };
  const resolveKey = (item: ReactAvatarGroupItem, index: number): string | number => {
    if (typeof props.itemKey === 'function') {
      return (props.itemKey as (entry: ReactAvatarGroupItem, itemIndex: number) => string | number)(
        item,
        index,
      );
    }
    const keyName = typeof props.itemKey === 'string' ? props.itemKey : 'id';
    const value = item[keyName as keyof ReactAvatarGroupItem];

    return typeof value === 'string' || typeof value === 'number' ? value : item.id;
  };
  const setRefs = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  const closePopover = (restoreFocus = false): void => {
    if (!open) return;
    shouldRestoreFocus.current = restoreFocus;
    setOpen(false);
  };
  const avatarGroupActionsRef = useRef({ closePopover });
  avatarGroupActionsRef.current = { closePopover };

  useLayoutEffect(() => {
    if (!showsPopover || !rootRef.current || !popoverRef.current) return undefined;
    return observeAvatarGroupPopover(
      rootRef.current,
      popoverRef.current,
      direction === 'start' ? 'start' : 'end',
    );
  }, [showsPopover, direction]);

  useLayoutEffect(() => {
    if (disabled && open) {
      setOpen(false);
      if (popoverHadFocus.current || rootRef.current?.contains(document.activeElement))
        rootRef.current?.focus();
      popoverHadFocus.current = false;
    }
  }, [disabled, open, setOpen]);

  useLayoutEffect(() => {
    if (showsPopover && previousLoading.current !== loading && popoverHadFocus.current) {
      const firstAction =
        popoverRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
      (firstAction ?? popoverRef.current)?.focus();
    }
    previousLoading.current = loading;
  }, [loading, showsPopover]);

  useEffect(() => {
    if (showsPopover) {
      const firstAction =
        popoverRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
      (firstAction ?? popoverRef.current)?.focus();
      return;
    }
    popoverHadFocus.current = false;
    if (!shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    const target = overflowButtonRef.current;
    (target && !target.disabled ? target : rootRef.current)?.focus();
  }, [showsPopover]);

  useLayoutEffect(() => {
    const previous = lastPopoverFocus.current;
    if (!previous || previous.element.isConnected) return;
    lastPopoverFocus.current = null;
    if (document.activeElement !== document.body && document.activeElement !== previous.element)
      return;
    const actions = showsPopover
      ? popoverRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
      : undefined;
    const next = actions?.[Math.min(Math.max(previous.index, 0), actions.length - 1)];
    (
      next ??
      (showsPopover ? popoverRef.current : overflowButtonRef.current) ??
      rootRef.current
    )?.focus();
  });

  useEffect(() => {
    if (!showsPopover) return undefined;
    const handlePointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        avatarGroupActionsRef.current.closePopover(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showsPopover]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape' && showsPopover) {
      event.preventDefault();
      event.stopPropagation();
      closePopover(true);
    }
    if (typeof props.onKeyDown === 'function') {
      (props.onKeyDown as KeyboardEventHandler<HTMLElement>)(event);
    }
  };
  const selectItem = (item: ReactAvatarGroupItem, index: number, fromPopover = false): void => {
    if (disabled || item.disabled) return;
    callback(props, 'onSelect')?.(item, index);
    if (fromPopover) closePopover(true);
  };
  const activateOverflow = (): void => {
    if (disabled) return;
    callback(props, 'onOverflowClick')?.(hiddenItems);
    if (overflowMode === 'popover') setOpen(!open);
  };

  return (
    <div
      className={cx(
        'peaui-avatar-group',
        `peaui-avatar-group--size-${size}`,
        `peaui-avatar-group--shape-${shape}`,
        `peaui-avatar-group--direction-${direction}`,
        overlap ? 'peaui-avatar-group--overlap' : 'peaui-avatar-group--spaced',
        disabled && 'peaui-avatar-group--disabled',
        showsPopover && 'peaui-avatar-group--open',
        props.className,
      )}
      data-testid={baseTestId}
      ref={setRefs}
      style={props.style}
      tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : -1}
      onKeyDown={handleKeyDown}
    >
      <ul
        aria-label={text(props, 'ariaLabel') || text(props, 'aria-label', 'Członkowie grupy')}
        className="peaui-avatar-group__list"
        role="list"
      >
        {visibleItems.map((item, index) => (
          <li
            className="peaui-avatar-group__item"
            data-testid={baseTestId ? `${baseTestId}-item-${index}` : undefined}
            key={resolveKey(item, index)}
            style={
              {
                '--peaui-avatar-group-index': index,
                '--peaui-avatar-group-reverse-index': Math.max(0, visibleItems.length - index),
              } as CSSProperties
            }
          >
            <button
              aria-label={resolveLabel(item, index)}
              className="peaui-avatar-group__avatar-button"
              disabled={disabled || item.disabled}
              type="button"
              onClick={() => selectItem(item, index)}
            >
              <span aria-hidden="true" className="peaui-avatar-group__visual">
                {renderItem?.(item, index) ?? (
                  <AvatarRenderer
                    alt=""
                    aria-hidden="true"
                    initials={item.initials}
                    name={item.name}
                    shape={shape}
                    size={size}
                    src={item.src}
                    status={item.status ?? 'none'}
                  />
                )}
              </span>
            </button>
          </li>
        ))}
        {hasOverflow ? (
          <li className="peaui-avatar-group__item peaui-avatar-group__overflow-item">
            <button
              aria-controls={overflowMode === 'popover' ? popoverId : undefined}
              aria-expanded={overflowMode === 'popover' ? showsPopover : undefined}
              aria-haspopup={overflowMode === 'popover' ? 'dialog' : undefined}
              aria-label={`Pokaż ${hiddenItems.length} pozostałych użytkowników`}
              className="peaui-avatar-group__overflow-button"
              data-testid={baseTestId ? `${baseTestId}-overflow` : undefined}
              disabled={disabled}
              ref={overflowButtonRef}
              type="button"
              onClick={activateOverflow}
            >
              <span aria-hidden="true">
                {renderOverflow?.(hiddenItems.length, hiddenItems) ?? `+${hiddenItems.length}`}
              </span>
            </button>
          </li>
        ) : null}
        {items.length === 0 ? (
          <li className="peaui-avatar-group__empty">
            {node(props, 'empty') ?? 'Brak użytkowników'}
          </li>
        ) : null}
      </ul>
      {overflowMode === 'popover' && hasOverflow ? (
        <section
          aria-busy={bool(props, 'loading') || undefined}
          aria-label={`Pozostali użytkownicy (${hiddenItems.length})`}
          className="peaui-avatar-group__popover"
          data-testid={baseTestId ? `${baseTestId}-popover` : undefined}
          hidden={!showsPopover}
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          tabIndex={-1}
          onFocusCapture={(event) => {
            popoverHadFocus.current = true;
            const element = event.target;
            lastPopoverFocus.current = {
              element,
              index: Array.from(
                event.currentTarget.querySelectorAll('button:not(:disabled)'),
              ).indexOf(element),
            };
          }}
          onBlurCapture={(event) => {
            if (event.relatedTarget && !popoverRef.current?.contains(event.relatedTarget)) {
              popoverHadFocus.current = false;
              lastPopoverFocus.current = null;
            }
          }}
        >
          {showsPopover ? (
            <>
              <div className="peaui-avatar-group__popover-header">
                {node(props, 'popoverHeader') ?? 'Pozostali użytkownicy'}
              </div>
              {bool(props, 'loading') ? (
                <p className="peaui-avatar-group__loading" role="status">
                  Ładowanie użytkowników…
                </p>
              ) : (
                <ul className="peaui-avatar-group__popover-list" role="list">
                  {hiddenItems.map((item, hiddenIndex) => {
                    const index = limit + hiddenIndex;

                    return (
                      <li
                        className="peaui-avatar-group__popover-item"
                        key={resolveKey(item, index)}
                      >
                        <button
                          aria-label={resolveLabel(item, index)}
                          className="peaui-avatar-group__popover-button"
                          disabled={item.disabled}
                          type="button"
                          onClick={() => selectItem(item, index, true)}
                        >
                          <span aria-hidden="true" className="peaui-avatar-group__popover-visual">
                            {renderPopoverItem?.(item, index) ?? (
                              <>
                                <AvatarRenderer
                                  alt=""
                                  aria-hidden="true"
                                  initials={item.initials}
                                  name={item.name}
                                  shape={shape}
                                  size="s"
                                  src={item.src}
                                  status={item.status ?? 'none'}
                                />
                                <span className="peaui-avatar-group__popover-name">
                                  {resolveName(item, index)}
                                </span>
                              </>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
