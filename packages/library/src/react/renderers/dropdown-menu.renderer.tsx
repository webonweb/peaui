/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import {
  type RuntimeProps,
  useModel,
  bool,
  text,
  num,
  dataTest,
  callback,
  cx,
  hasVisibleReactText,
  node,
} from './runtime.shared';
import { iconArrowRight, iconCheck } from '../generated-static-icons';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type KeyboardEventHandler,
  useEffect,
  isValidElement,
  cloneElement,
} from 'react';
import { useNativePopover } from '.././popover-overlayer.shared';
import {
  type MenuNavigableItem,
  edgeEnabledMenuIndex,
  type MenuViewport,
  calculateRootMenuPosition,
  calculateSubmenuPosition,
  nextEnabledMenuIndex,
  typeaheadMenuIndex,
} from '../../components/navigation/DropdownMenu/menu.shared';
import { Svg } from './svg.renderer';

export type ReactDropdownMenuItem = {
  checked?: boolean;
  children?: ReactDropdownMenuItem[];
  closeOnSelect?: boolean;
  disabled?: boolean;
  group?: string;
  icon?: string;
  id: string | number;
  label?: string;
  metadata?: unknown;
  shortcut?: string;
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'group' | 'submenu';
  value?: unknown;
  variant?: 'default' | 'danger';
};

export function asDropdownMenuItems(value: unknown): ReactDropdownMenuItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry): ReactDropdownMenuItem[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const item = entry as ReactDropdownMenuItem;
    if (typeof item.id !== 'string' && typeof item.id !== 'number') return [];

    return Array.isArray(item.children)
      ? [{ ...item, children: asDropdownMenuItems(item.children) }]
      : [item];
  });
}

export function DropdownMenuRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const items = asDropdownMenuItems(props.items);
  const [open, setOpen] = useModel<boolean>(props, 'open', false);
  const disabled = bool(props, 'disabled');
  const placement = text(props, 'placement', 'bottom') as 'top' | 'right' | 'bottom' | 'left';
  const align = text(props, 'align', 'start');
  const offset = Math.max(0, num(props, 'offset', 8));
  const loop = bool(props, 'loop', true);
  const closeOnSelect = bool(props, 'closeOnSelect', true);
  const density = text(props, 'density', 'comfortable');
  const triggerLabel = text(props, 'triggerLabel', 'Otwórz menu');
  const ariaLabel = text(props, 'ariaLabel') || text(props, 'aria-label', 'Menu akcji');
  const baseTestId = dataTest(props);
  const generatedMenuId = `peaui-dropdown-menu-${useId().replace(/:/g, '')}`;
  const menuId = text(props, '__menuId') || generatedMenuId;
  const anchorVersion = num(props, '__anchorVersion');
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerHostRef = useRef<HTMLSpanElement | null>(null);
  const defaultTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useNativePopover(open);
  const pendingFocus = useRef<'first' | 'last'>('first');
  const typeaheadValue = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const submenuTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const positionFrame = useRef<number | undefined>(undefined);
  const [submenuKey, setSubmenuKey] = useState('');
  const [resolvedPlacement, setResolvedPlacement] = useState(placement);
  const [menuPosition, setMenuPosition] = useState<CSSProperties>({});
  const [submenuPosition, setSubmenuPosition] = useState<CSSProperties>({});
  const renderTrigger = props.renderTrigger as
    ((state: { open: boolean; disabled: boolean }) => ReactNode) | undefined;
  const renderItem = props.renderItem as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderItemIcon = props.renderItemIcon as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderItemShortcut = props.renderItemShortcut as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderGroupLabel = props.renderGroupLabel as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;

  const setRootRef = (element: HTMLSpanElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  const triggerElement = (): HTMLElement | null =>
    defaultTriggerRef.current ??
    triggerHostRef.current?.querySelector<HTMLElement>(
      'button, a[href], input:not([disabled]), [role="button"], [tabindex]:not([tabindex="-1"])',
    ) ??
    triggerHostRef.current;
  const itemType = (item: ReactDropdownMenuItem): NonNullable<ReactDropdownMenuItem['type']> =>
    item.type ?? (item.children?.length ? 'submenu' : 'item');
  const pathKey = (path: number[]): string => path.join('-');
  const navigationItems = (
    parentKey: string,
  ): Array<MenuNavigableItem & { button: HTMLButtonElement }> =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(`[data-menu-parent="${parentKey}"]`) ??
        [],
    ).map((button) => ({
      button,
      disabled: button.getAttribute('aria-disabled') === 'true',
      label: button.dataset.menuLabel,
    }));
  const focusEdge = (parentKey: string, edge: 'first' | 'last'): void => {
    const candidates = navigationItems(parentKey);
    const index = edgeEnabledMenuIndex(candidates, edge);
    if (index >= 0) candidates[index]?.button.focus();
    else menuRef.current?.focus();
  };
  const requestOpen = (value: boolean, focus: 'first' | 'last' = 'first'): void => {
    if (value && disabled) return;
    pendingFocus.current = focus;
    setOpen(value);
  };
  const closeMenu = (restoreFocus = false): void => {
    setSubmenuKey('');
    requestOpen(false);
    if (restoreFocus) queueMicrotask(() => triggerElement()?.focus());
  };
  const closeFromEscape = (): void => {
    closeMenu(true);
    callback(props, 'onEscape')?.();
  };
  const handleTriggerKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    if (disabled) return;
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      requestOpen(true, event.key === 'ArrowUp' ? 'last' : 'first');
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      closeFromEscape();
    } else if (event.key === 'Tab' && open) {
      closeMenu(false);
    }
  };
  const currentViewport = (): MenuViewport => ({
    height: window.visualViewport?.height ?? window.innerHeight,
    left: window.visualViewport?.offsetLeft ?? 0,
    top: window.visualViewport?.offsetTop ?? 0,
    width: window.visualViewport?.width ?? window.innerWidth,
  });
  const positionRootMenu = (): void => {
    const trigger = triggerElement();
    const surface = menuRef.current;
    if (!trigger || !surface || !open) return;
    const position = calculateRootMenuPosition({
      align: align as 'start' | 'center' | 'end',
      offset,
      placement,
      surface: surface.getBoundingClientRect(),
      trigger: trigger.getBoundingClientRect(),
      viewport: currentViewport(),
    });
    setResolvedPlacement(position.placement);
    setMenuPosition({
      left: `${position.left}px`,
      maxHeight: `${position.maxHeight}px`,
      maxWidth: `${position.maxWidth}px`,
      minWidth: `${position.minWidth}px`,
      top: `${position.top}px`,
    });
  };
  const positionSubmenu = (key: string): void => {
    const parent = menuRef.current?.querySelector<HTMLElement>(`[data-menu-path="${key}"]`);
    const surface = menuRef.current?.querySelector<HTMLElement>(`[data-submenu-for="${key}"]`);
    if (!parent || !surface) return;
    const position = calculateSubmenuPosition({
      parent: parent.getBoundingClientRect(),
      surface: surface.getBoundingClientRect(),
      viewport: currentViewport(),
    });
    setSubmenuPosition({
      left: `${position.left}px`,
      maxHeight: `${position.maxHeight}px`,
      maxWidth: `${position.maxWidth}px`,
      minWidth: `${position.minWidth}px`,
      top: `${position.top}px`,
    });
  };
  const schedulePosition = (): void => {
    if (positionFrame.current !== undefined) cancelAnimationFrame(positionFrame.current);
    positionFrame.current = requestAnimationFrame(() => {
      positionFrame.current = undefined;
      positionRootMenu();
      if (submenuKey) positionSubmenu(submenuKey);
    });
  };
  const openSubmenu = (item: ReactDropdownMenuItem, path: number[], focusFirst = false): void => {
    if (item.disabled || !item.children?.length || path.length > 2) return;
    const key = pathKey(path);
    setSubmenuKey(key);
    queueMicrotask(() => {
      positionSubmenu(key);
      if (focusFirst) focusEdge(key, 'first');
    });
  };
  const activateItem = (item: ReactDropdownMenuItem, path: number[]): void => {
    if (disabled || item.disabled) return;
    const type = itemType(item);
    if (type === 'submenu') {
      openSubmenu(item, path, true);
      return;
    }
    if (type === 'group' || type === 'separator') return;
    callback(props, 'onSelect')?.(item, path);
    if (type === 'checkbox') callback(props, 'onCheckedChange')?.(item, !item.checked, path);
    if (type === 'radio') callback(props, 'onCheckedChange')?.(item, true, path);
    if (item.value !== undefined) callback(props, 'onValueChange')?.(item, item.value, path);
    const shouldClose =
      item.closeOnSelect ?? (type === 'checkbox' || type === 'radio' ? false : closeOnSelect);
    if (shouldClose) closeMenu(true);
  };
  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    item: ReactDropdownMenuItem,
    path: number[],
    parentKey: string,
  ): void => {
    const candidates = navigationItems(parentKey);
    const currentIndex = candidates.findIndex(({ button }) => button === event.currentTarget);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const index = nextEnabledMenuIndex(
        candidates,
        currentIndex,
        event.key === 'ArrowDown' ? 1 : -1,
        loop,
      );
      if (index >= 0) candidates[index]?.button.focus();
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusEdge(parentKey, event.key === 'Home' ? 'first' : 'last');
      return;
    }
    if (event.key === 'ArrowRight' && itemType(item) === 'submenu') {
      event.preventDefault();
      openSubmenu(item, path, true);
      return;
    }
    if (event.key === 'ArrowLeft' && parentKey !== 'root') {
      event.preventDefault();
      setSubmenuKey('');
      menuRef.current?.querySelector<HTMLButtonElement>(`[data-menu-path="${parentKey}"]`)?.focus();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (parentKey !== 'root') {
        setSubmenuKey('');
        menuRef.current
          ?.querySelector<HTMLButtonElement>(`[data-menu-path="${parentKey}"]`)
          ?.focus();
      } else closeFromEscape();
      return;
    }
    if (event.key === 'Tab') {
      closeMenu(false);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateItem(item, path);
      return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    typeaheadValue.current += event.key;
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadTimer.current = setTimeout(() => (typeaheadValue.current = ''), 500);
    const index = typeaheadMenuIndex(candidates, typeaheadValue.current, currentIndex);
    if (index >= 0) {
      event.preventDefault();
      candidates[index]?.button.focus();
    }
  };

  const menuEffectState = useRef({
    closeMenu,
    focusEdge,
    menuRef,
    onOutsideClick: callback(props, 'onOutsideClick'),
    schedulePosition,
    triggerElement,
  });
  menuEffectState.current = {
    closeMenu,
    focusEdge,
    menuRef,
    onOutsideClick: callback(props, 'onOutsideClick'),
    schedulePosition,
    triggerElement,
  };

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open, setOpen]);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event: PointerEvent): void => {
      if (
        rootRef.current?.contains(event.target as Node) ||
        menuEffectState.current.menuRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      menuEffectState.current.closeMenu(false);
      menuEffectState.current.onOutsideClick?.();
    };
    const handlePosition = (): void => menuEffectState.current.schedulePosition();
    document.addEventListener('pointerdown', handleOutside, true);
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition, true);
    window.visualViewport?.addEventListener('resize', handlePosition);
    window.visualViewport?.addEventListener('scroll', handlePosition);
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(handlePosition);
    const trigger = menuEffectState.current.triggerElement();
    if (trigger) observer?.observe(trigger);
    const menuElement = menuEffectState.current.menuRef.current;
    if (menuElement) observer?.observe(menuElement);
    menuEffectState.current.schedulePosition();
    queueMicrotask(() => menuEffectState.current.focusEdge('root', pendingFocus.current));

    return () => {
      document.removeEventListener('pointerdown', handleOutside, true);
      window.removeEventListener('resize', handlePosition);
      window.removeEventListener('scroll', handlePosition, true);
      window.visualViewport?.removeEventListener('resize', handlePosition);
      window.visualViewport?.removeEventListener('scroll', handlePosition);
      observer?.disconnect();
      if (positionFrame.current !== undefined) cancelAnimationFrame(positionFrame.current);
    };
  }, [open, placement, align, offset, anchorVersion]);

  useEffect(
    () => () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
      if (submenuTimer.current) clearTimeout(submenuTimer.current);
    },
    [],
  );

  const renderRow = (
    item: ReactDropdownMenuItem,
    path: number[],
    parentKey: string,
    depth = 0,
  ): ReactNode => {
    const type = itemType(item);
    if (type === 'separator') {
      return <li className="peaui-dropdown-menu__separator" key={item.id} role="separator" />;
    }
    const key = pathKey(path);
    const hasSubmenu = type === 'submenu' && depth === 0 && Boolean(item.children?.length);
    const itemDisabled = disabled || item.disabled === true || (depth > 0 && type === 'submenu');
    const role =
      type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem';
    const isCheckable = type === 'checkbox' || type === 'radio';

    return (
      <li className="peaui-dropdown-menu__row" key={item.id} role="none">
        <button
          aria-checked={isCheckable ? Boolean(item.checked) : undefined}
          aria-controls={hasSubmenu ? `${menuId}-submenu-${key}` : undefined}
          aria-disabled={itemDisabled || undefined}
          aria-expanded={hasSubmenu ? submenuKey === key : undefined}
          aria-haspopup={hasSubmenu ? 'menu' : undefined}
          className={cx(
            'peaui-dropdown-menu__item',
            `peaui-dropdown-menu__item--${item.variant ?? 'default'}`,
            hasSubmenu && 'peaui-dropdown-menu__item--submenu',
          )}
          data-menu-label={item.label ?? ''}
          data-menu-parent={parentKey}
          data-menu-path={key}
          data-testid={baseTestId ? `${baseTestId}-item-${key}` : undefined}
          role={role}
          tabIndex={-1}
          type="button"
          onClick={() => activateItem(item, path)}
          onFocus={() => {
            if (
              submenuKey &&
              submenuKey !== key &&
              !key.startsWith(`${submenuKey}-`) &&
              type !== 'submenu'
            ) {
              setSubmenuKey('');
            }
          }}
          onKeyDown={(event) => handleItemKeyDown(event, item, path, parentKey)}
          onPointerEnter={() => {
            if (submenuTimer.current) clearTimeout(submenuTimer.current);
            if (!hasSubmenu || itemDisabled) return;
            submenuTimer.current = setTimeout(() => openSubmenu(item, path), 180);
          }}
          onPointerLeave={() => {
            if (submenuKey !== key && submenuTimer.current) clearTimeout(submenuTimer.current);
          }}
        >
          <span aria-hidden="true" className="peaui-dropdown-menu__indicator">
            {isCheckable && item.checked ? <Svg data={iconCheck} name="check" /> : null}
          </span>
          <span aria-hidden="true" className="peaui-dropdown-menu__icon">
            {renderItemIcon?.(item, path) ?? (item.icon ? <Svg name={item.icon} /> : null)}
          </span>
          <span className="peaui-dropdown-menu__label">
            {renderItem?.(item, path) ?? item.label}
          </span>
          {item.shortcut || renderItemShortcut ? (
            <span aria-hidden="true" className="peaui-dropdown-menu__shortcut">
              {renderItemShortcut?.(item, path) ?? item.shortcut}
            </span>
          ) : null}
          {hasSubmenu ? (
            <Svg
              data={iconArrowRight}
              aria-hidden="true"
              className="peaui-dropdown-menu__submenu-arrow"
              name="arrowRight"
            />
          ) : null}
        </button>
        {hasSubmenu ? (
          <div
            aria-label={item.label}
            className="peaui-dropdown-menu__surface peaui-dropdown-menu__submenu"
            data-submenu-for={key}
            hidden={submenuKey !== key}
            id={`${menuId}-submenu-${key}`}
            role="menu"
            style={submenuPosition}
          >
            <ul className="peaui-dropdown-menu__list" role="none">
              {item.children?.map((child, childIndex) =>
                renderRow(child, [...path, childIndex], key, depth + 1),
              )}
            </ul>
          </div>
        ) : null}
      </li>
    );
  };

  const customTrigger = renderTrigger?.({ disabled, open });
  const renderedTrigger = isValidElement(customTrigger)
    ? cloneElement(customTrigger as ReactElement<Record<string, unknown>>, {
        'aria-controls': menuId,
        'aria-disabled': disabled || undefined,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'aria-label':
          (customTrigger.props as Record<string, unknown>)['aria-label'] ??
          (hasVisibleReactText(customTrigger) ? undefined : triggerLabel),
        disabled:
          typeof customTrigger.type === 'string' && customTrigger.type === 'button'
            ? disabled
            : undefined,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          const original = (customTrigger.props as Record<string, unknown>).onClick;
          if (typeof original === 'function')
            (original as (event: React.MouseEvent) => void)(event);
          if (!event.defaultPrevented && !disabled) requestOpen(!open);
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          const original = (customTrigger.props as Record<string, unknown>).onKeyDown;
          if (typeof original === 'function')
            (original as (event: React.KeyboardEvent) => void)(event);
          if (!event.defaultPrevented) handleTriggerKeyDown(event);
        },
      })
    : null;

  return (
    <span
      className={cx(
        'peaui-dropdown-menu',
        `peaui-dropdown-menu--density-${density}`,
        disabled && 'peaui-dropdown-menu--disabled',
        open && 'peaui-dropdown-menu--open',
        props.className,
      )}
      data-testid={baseTestId}
      ref={setRootRef}
      style={props.style}
    >
      {renderedTrigger ? (
        <span className="peaui-dropdown-menu__trigger-host" ref={triggerHostRef}>
          {renderedTrigger}
        </span>
      ) : (
        <button
          aria-controls={menuId}
          aria-expanded={open}
          aria-haspopup="menu"
          className="peaui-dropdown-menu__trigger"
          disabled={disabled}
          ref={defaultTriggerRef}
          type="button"
          onClick={() => requestOpen(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          {triggerLabel}
        </button>
      )}
      <div
        aria-busy={bool(props, 'loading') || undefined}
        aria-label={ariaLabel}
        className="peaui-dropdown-menu__surface"
        data-align={align}
        data-placement={resolvedPlacement}
        data-testid={baseTestId ? `${baseTestId}-menu` : undefined}
        id={menuId}
        hidden={!open}
        popover="manual"
        ref={menuRef}
        role="menu"
        style={menuPosition}
        tabIndex={0}
      >
        {bool(props, 'loading') ? (
          <div
            aria-disabled="true"
            aria-live="polite"
            className="peaui-dropdown-menu__status"
            role="menuitem"
            tabIndex={-1}
          >
            {node(props, 'loadingContent') ?? 'Ładowanie menu…'}
          </div>
        ) : items.length === 0 ? (
          <div
            aria-disabled="true"
            className="peaui-dropdown-menu__status"
            role="menuitem"
            tabIndex={-1}
          >
            {node(props, 'empty') ?? 'Brak dostępnych akcji'}
          </div>
        ) : (
          <ul className="peaui-dropdown-menu__list" role="none">
            {items.map((item, index) => {
              if (itemType(item) !== 'group') return renderRow(item, [index], 'root');
              const groupId = `${menuId}-group-${index}`;
              return (
                <li className="peaui-dropdown-menu__group-row" key={item.id} role="none">
                  <div
                    aria-labelledby={groupId}
                    className="peaui-dropdown-menu__group"
                    role="group"
                  >
                    <div className="peaui-dropdown-menu__group-label" id={groupId}>
                      {renderGroupLabel?.(item, [index]) ?? item.label}
                    </div>
                    <ul className="peaui-dropdown-menu__list" role="none">
                      {item.children?.map((child, childIndex) =>
                        renderRow(child, [index, childIndex], 'root'),
                      )}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </span>
  );
}
