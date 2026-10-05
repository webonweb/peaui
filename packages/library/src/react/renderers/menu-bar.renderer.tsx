/** @jsxImportSource react */

import { type ReactDropdownMenuItem, DropdownMenuRenderer } from './dropdown-menu.renderer';
import { type RuntimeProps, bool, text, dataTest, useModel, cx, callback } from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useState,
  useRef,
  type ReactNode,
  useEffect,
} from 'react';
import {
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
  typeaheadMenuIndex,
} from '../../components/navigation/DropdownMenu/menu.shared';
import { Svg } from './svg.renderer';

export type ReactMenuBarMenu = {
  disabled?: boolean;
  icon?: string;
  id: string | number;
  items: ReactDropdownMenuItem[];
  label: string;
};

export function asMenuBarMenus(value: unknown): ReactMenuBarMenu[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry): ReactMenuBarMenu[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const menu = entry as Record<string, unknown>;
    if (
      (typeof menu.id !== 'string' && typeof menu.id !== 'number') ||
      typeof menu.label !== 'string'
    ) {
      return [];
    }

    return [entry as ReactMenuBarMenu];
  });
}

export function MenuBarRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const menus = asMenuBarMenus(props.menus);
  const disabled = bool(props, 'disabled');
  const loop = bool(props, 'loop', true);
  const variant = text(props, 'variant', 'default');
  const baseTestId = dataTest(props);
  const [openMenu, setOpenMenu] = useModel<string | number | null>(props, 'openMenu', null);
  const navigationMenus = menus.map((menu) => ({
    disabled: disabled || menu.disabled,
    label: menu.label,
  }));
  const firstIndex = edgeEnabledMenuIndex(navigationMenus, 'first');
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(
    firstIndex >= 0 ? (menus[firstIndex]?.id ?? null) : null,
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const typeaheadValue = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const renderMenuTrigger = props.renderMenuTrigger as
    | ((menu: ReactMenuBarMenu, state: { disabled: boolean; open: boolean }) => ReactNode)
    | undefined;
  const renderItem = props.renderItem as
    | ((item: ReactDropdownMenuItem, path: number[], menu: ReactMenuBarMenu) => ReactNode)
    | undefined;
  const renderGroupLabel = props.renderGroupLabel as
    | ((item: ReactDropdownMenuItem, path: number[], menu: ReactMenuBarMenu) => ReactNode)
    | undefined;
  const renderShortcut = props.renderShortcut as
    | ((item: ReactDropdownMenuItem, path: number[], menu: ReactMenuBarMenu) => ReactNode)
    | undefined;

  const setRootRef = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  const menuDisabled = (menu: ReactMenuBarMenu): boolean => disabled || menu.disabled === true;
  const triggerAt = (index: number): HTMLButtonElement | null =>
    rootRef.current?.querySelector<HTMLButtonElement>(`[data-menubar-index="${index}"]`) ?? null;
  const keepTriggerVisible = (trigger: HTMLElement): void => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.scrollWidth <= viewport.clientWidth) return;
    if (typeof trigger.scrollIntoView === 'function') {
      trigger.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };
  const focusMenu = (index: number, preserveMenuMode = false): void => {
    const menu = menus[index];
    if (!menu || menuDisabled(menu)) return;
    const trigger = triggerAt(index);
    trigger?.focus({ preventScroll: true });
    if (trigger) keepTriggerVisible(trigger);
    if (preserveMenuMode) setOpenMenu(menu.id);
  };
  const focusRelative = (index: number, direction: 1 | -1, preserveMenuMode: boolean): void => {
    const nextIndex = nextEnabledMenuIndex(navigationMenus, index, direction, loop);
    if (nextIndex >= 0) focusMenu(nextIndex, preserveMenuMode);
  };
  const focusEdge = (edge: 'first' | 'last', preserveMenuMode: boolean): void => {
    const index = edgeEnabledMenuIndex(navigationMenus, edge);
    if (index >= 0) focusMenu(index, preserveMenuMode);
  };
  const handleTypeahead = (event: React.KeyboardEvent<HTMLElement>, currentIndex: number): void => {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    typeaheadValue.current += event.key;
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadTimer.current = setTimeout(() => (typeaheadValue.current = ''), 500);
    const index = typeaheadMenuIndex(navigationMenus, typeaheadValue.current, currentIndex);
    if (index >= 0) {
      event.preventDefault();
      focusMenu(index, openMenu !== null);
    }
  };
  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const target = event.target as HTMLElement;
    const trigger = target.closest<HTMLElement>('[data-menubar-index]');
    const rootItem = target.closest<HTMLElement>('[data-menu-parent="root"]');
    const nestedItem = target.closest<HTMLElement>(
      '[data-menu-parent]:not([data-menu-parent="root"])',
    );
    const menuIndexValue = trigger?.dataset.menubarIndex;
    const activeIndex = menus.findIndex((menu) => menu.id === activeMenuId);
    const menuIndex = menuIndexValue === undefined ? activeIndex : Number(menuIndexValue);
    const preserveMenuMode = openMenu !== null;

    if (trigger) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        focusRelative(menuIndex, event.key === 'ArrowRight' ? 1 : -1, preserveMenuMode);
        return;
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        event.stopPropagation();
        focusEdge(event.key === 'Home' ? 'first' : 'last', preserveMenuMode);
        return;
      }
      handleTypeahead(event, menuIndex);
      return;
    }

    if (!rootItem || nestedItem) return;
    if (event.key === 'ArrowRight' && rootItem.getAttribute('aria-haspopup') === 'menu') return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    event.stopPropagation();
    focusRelative(activeIndex, event.key === 'ArrowRight' ? 1 : -1, true);
  };

  const navigationValidationRef = useRef({
    activeMenuId,
    menuDisabled,
    menus,
    navigationMenus,
    setActiveMenuId,
    setOpenMenu,
  });
  navigationValidationRef.current = {
    activeMenuId,
    menuDisabled,
    menus,
    navigationMenus,
    setActiveMenuId,
    setOpenMenu,
  };

  useEffect(() => {
    const state = navigationValidationRef.current;
    const activeIndex = state.menus.findIndex(
      (menu) => menu.id === state.activeMenuId && !state.menuDisabled(menu),
    );
    if (activeIndex < 0) {
      const nextIndex = edgeEnabledMenuIndex(state.navigationMenus, 'first');
      state.setActiveMenuId(nextIndex >= 0 ? (state.menus[nextIndex]?.id ?? null) : null);
    }
    if (
      openMenu !== null &&
      !state.menus.some((menu) => menu.id === openMenu && !state.menuDisabled(menu))
    ) {
      state.setOpenMenu(null);
    }
  }, [props.menus, disabled, openMenu]);

  useEffect(
    () => () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    },
    [],
  );

  return (
    <div
      aria-label={text(props, 'ariaLabel') || text(props, 'aria-label', 'Menu aplikacji')}
      aria-orientation="horizontal"
      className={cx(
        'peaui-menu-bar',
        `peaui-menu-bar--${variant}`,
        disabled && 'peaui-menu-bar--disabled',
        openMenu !== null && 'peaui-menu-bar--open',
        props.className,
      )}
      data-testid={baseTestId}
      ref={setRootRef}
      role="menubar"
      style={props.style}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <div className="peaui-menu-bar__viewport" ref={viewportRef}>
        <div className="peaui-menu-bar__list">
          {menus.map((menu, index) => {
            const isDisabled = menuDisabled(menu);
            const isOpen = !isDisabled && openMenu === menu.id;
            return (
              <DropdownMenuRenderer
                __name="DropdownMenu"
                align="start"
                ariaLabel={menu.label}
                closeOnSelect
                dataTestId={baseTestId ? `${baseTestId}-menu-${menu.id}` : undefined}
                density={variant === 'compact' ? 'compact' : 'comfortable'}
                disabled={isDisabled}
                items={menu.items}
                key={menu.id}
                loop={loop}
                offset={4}
                open={isOpen}
                placement="bottom"
                renderGroupLabel={(item: ReactDropdownMenuItem, path: number[]) =>
                  renderGroupLabel?.(item, path, menu) ?? item.label
                }
                renderItem={(item: ReactDropdownMenuItem, path: number[]) =>
                  renderItem?.(item, path, menu) ?? item.label
                }
                renderItemShortcut={(item: ReactDropdownMenuItem, path: number[]) =>
                  renderShortcut?.(item, path, menu) ?? item.shortcut
                }
                renderTrigger={({ open }: { disabled: boolean; open: boolean }) => (
                  <button
                    aria-disabled={isDisabled || undefined}
                    className="peaui-menu-bar__trigger"
                    data-menubar-id={String(menu.id)}
                    data-menubar-index={index}
                    disabled={isDisabled}
                    role="menuitem"
                    tabIndex={!isDisabled && activeMenuId === menu.id ? 0 : -1}
                    type="button"
                    onFocus={() => {
                      const changed = activeMenuId !== menu.id;
                      setActiveMenuId(menu.id);
                      const trigger = triggerAt(index);
                      if (trigger) keepTriggerVisible(trigger);
                      if (changed) callback(props, 'onFocusChange')?.(menu, index);
                    }}
                    onPointerEnter={() => {
                      if (openMenu !== null && openMenu !== menu.id && !isDisabled) {
                        setOpenMenu(menu.id);
                      }
                    }}
                  >
                    {renderMenuTrigger?.(menu, { disabled: isDisabled, open }) ?? (
                      <>
                        {menu.icon ? (
                          <Svg className="peaui-menu-bar__trigger-icon" name={menu.icon} />
                        ) : null}
                        <span className="peaui-menu-bar__trigger-label">{menu.label}</span>
                      </>
                    )}
                  </button>
                )}
                onCheckedChange={(item: ReactDropdownMenuItem, checked: boolean, path: number[]) =>
                  callback(props, 'onCheckedChange')?.(item, checked, path, menu)
                }
                onOpenChange={(value: boolean) => {
                  if (value && !isDisabled) {
                    setActiveMenuId(menu.id);
                    setOpenMenu(menu.id);
                  } else if (!value && openMenu === menu.id) setOpenMenu(null);
                }}
                onSelect={(item: ReactDropdownMenuItem, path: number[]) =>
                  callback(props, 'onSelect')?.(item, path, menu)
                }
                onValueChange={(item: ReactDropdownMenuItem, value: unknown, path: number[]) =>
                  callback(props, 'onValueChange')?.(item, value, path, menu)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
