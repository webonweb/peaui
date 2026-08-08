/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  Children,
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ElementType,
  type FocusEvent as ReactFocusEvent,
  type FocusEventHandler,
  type ForwardedRef,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEventHandler,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import {
  getAvatarInitials,
  normalizeAvatarInitials,
} from '../components/data-display/Avatar/avatar.helper';
import {
  findNextToggleGroupIndex,
  findToggleGroupEdgeIndex,
  findToggleGroupReplacementIndex,
  isToggleGroupItemAvailable,
  normalizeToggleGroupSelection,
  type ToggleGroupValue,
} from '../components/data-entry/ToggleGroup/toggle-group.shared';
import {
  calculateRootMenuPosition,
  calculateSubmenuPosition,
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
  typeaheadMenuIndex,
  type MenuViewport,
  type MenuNavigableItem,
} from '../components/navigation/DropdownMenu/menu.shared';
import { essentialReactIconData } from './generated-essential-icon-data';
import type { ReactIconData } from './generated-icon-data';
import type { PeauiReactProps, ReactComponentName } from './generated-react-props';
import {
  evaluatePasswordStrength,
  PASSWORD_STRENGTH_SEGMENTS,
} from '../components/form/FormPassword/strength.helper';
import {
  getFormFieldEraseOffset,
  getFormFieldPaddingRight,
} from '../components/form/FormField/form-field-layout.shared';
import legacyIconBucketLoaders, {
  iconNames as legacyIconNames,
} from '../assets/icons/runtime/bucket-loaders';
import { InlineEditRenderer, type InlineEditRuntimeProps } from './inline-edit.renderer';
import { CopyButtonRenderer, type CopyButtonRuntimeProps } from './copy-button.renderer';
import { getNativePopoverValue, useNativePopover } from './popover-overlayer.shared';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type RuntimeComponent = ComponentType<RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }>;
type Option = {
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  icon?: string;
  id?: string;
  isValid?: boolean;
  label: string;
  value?: unknown;
};
type TableColumn = {
  actionLabel?: string;
  actionName?: string;
  align?: string;
  border?: 'left' | 'right';
  canCopy?: boolean;
  canSort?: boolean;
  hintColumn?: string;
  inline?: boolean;
  key: string;
  label?: string;
  manage?: Record<string, unknown>;
  name?: string;
  resolve?: (record: Record<string, unknown>) => unknown;
  sortable?: boolean;
  statusDictionary?: Record<string, string>;
  steps?: (record: Record<string, unknown>) => Array<Record<string, unknown>>;
  type?: string;
  visible?: boolean;
  withLock?: boolean;
  width?: string | number;
};

const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const bool = (props: RuntimeProps, name: string, fallback = false): boolean => {
  const value = props[name];
  return typeof value === 'boolean' ? value : fallback;
};

const num = (props: RuntimeProps, name: string, fallback = 0): number => {
  const value = props[name];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const node = (props: RuntimeProps, name: string): ReactNode => props[name] as ReactNode;

const callback = (
  props: RuntimeProps,
  name: string,
): ((...values: unknown[]) => void) | undefined => {
  const value = props[name];
  return typeof value === 'function' ? (value as (...values: unknown[]) => void) : undefined;
};

const dataTest = (props: RuntimeProps): string | undefined => {
  const direct = props['data-testid'];
  if (typeof direct === 'string') return direct;
  const camel = props.dataTestId;
  return typeof camel === 'string' ? camel : undefined;
};

const ariaBoolean = (value: unknown): boolean | 'true' | 'false' | undefined => {
  if (value === true || value === false || value === 'true' || value === 'false') return value;
  return undefined;
};

const common = (props: RuntimeProps) => ({
  className: props.className,
  style: props.style,
  role: typeof props.role === 'string' ? props.role : undefined,
  tabIndex: typeof props.tabIndex === 'number' ? props.tabIndex : undefined,
  'data-testid': dataTest(props),
  'aria-label': text(props, 'ariaLabel') || text(props, 'aria-label') || undefined,
  'aria-describedby': text(props, 'aria-describedby') || undefined,
  'aria-labelledby': text(props, 'aria-labelledby') || undefined,
  'aria-busy': ariaBoolean(props['aria-busy']),
  'aria-disabled': ariaBoolean(props['aria-disabled']),
  onClick:
    typeof props.onClick === 'function'
      ? (props.onClick as MouseEventHandler<HTMLElement>)
      : undefined,
  onKeyDown:
    typeof props.onKeyDown === 'function'
      ? (props.onKeyDown as KeyboardEventHandler<HTMLElement>)
      : undefined,
  onPointerDown:
    typeof props.onPointerDown === 'function'
      ? (props.onPointerDown as PointerEventHandler<HTMLElement>)
      : undefined,
});

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest('a, button, input, select, textarea, [role="button"]'))
  );
}

const INFO_TOOLTIP_FOCUSABLE_TRIGGER_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const INFO_TOOLTIP_MANAGED_TRIGGER_ANCESTOR_SELECTOR =
  'button, a[href], summary, [role="button"], [role="link"], [role="option"], [role="radio"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"]';
const INFO_TOOLTIP_DEFAULT_ARIA_LABEL = 'Pokaz dodatkowe informacje';

function hasVisibleReactText(value: ReactNode): boolean {
  if (typeof value === 'string' || typeof value === 'number')
    return String(value).trim().length > 0;
  if (!isValidElement(value)) {
    return Children.toArray(value).some((entry) => {
      if (typeof entry === 'string' || typeof entry === 'number') {
        return String(entry).trim().length > 0;
      }

      return (
        isValidElement(entry) &&
        hasVisibleReactText((entry.props as { children?: ReactNode }).children)
      );
    });
  }

  return hasVisibleReactText((value.props as { children?: ReactNode }).children);
}

function addDescriptionId(element: HTMLElement, id: string): void {
  const ids = new Set(
    (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
  );
  ids.add(id);
  element.setAttribute('aria-describedby', [...ids].join(' '));
}

function removeDescriptionId(element: HTMLElement, id: string): void {
  const ids = (element.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((entry) => entry !== id);

  if (ids.length > 0) element.setAttribute('aria-describedby', ids.join(' '));
  else element.removeAttribute('aria-describedby');
}

function copyTextToClipboard(value: string): void {
  try {
    void navigator.clipboard.writeText(value).catch(() => undefined);
  } catch {
    // Clipboard API is unavailable in some browsers and non-secure contexts.
  }
}

type ReactTableSortDescriptor = {
  direction: 'asc' | 'desc';
  key: string;
};

function normalizeReactTableSortDescriptors(value: unknown): ReactTableSortDescriptor[] {
  if (!Array.isArray(value)) return [];

  return value
    .flatMap((entry): ReactTableSortDescriptor[] => {
      if (typeof entry !== 'object' || entry === null) return [];

      const record = entry as Record<string, unknown>;
      const descriptorKey = typeof record.key === 'string' ? record.key : undefined;
      const legacyEntry = Object.entries(record).find(
        ([key, direction]) =>
          key !== 'key' &&
          key !== 'direction' &&
          typeof direction === 'string' &&
          ['asc', 'desc'].includes(direction.toLowerCase()),
      );
      const key = descriptorKey ?? legacyEntry?.[0];
      const rawDirection = descriptorKey ? record.direction : legacyEntry?.[1];

      if (!key || typeof rawDirection !== 'string') return [];

      return [
        {
          direction: rawDirection.toLowerCase() === 'desc' ? 'desc' : 'asc',
          key,
        },
      ];
    })
    .slice(0, 2);
}

function getNextReactTableSortDescriptors(
  current: ReactTableSortDescriptor[],
  key: string,
): ReactTableSortDescriptor[] {
  const currentIndex = current.findIndex((entry) => entry.key === key);

  if (currentIndex === 0) {
    return [
      { key, direction: current[0]?.direction === 'asc' ? 'desc' : 'asc' },
      ...current.slice(1),
    ];
  }

  if (currentIndex > 0) {
    const selected = current[currentIndex];
    return selected ? [selected, ...current.filter((_, index) => index !== currentIndex)] : current;
  }

  const next: ReactTableSortDescriptor[] = [{ key, direction: 'asc' }, ...current];

  return next.slice(0, 2);
}

function asOptions(value: unknown): Option[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): Option[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const record = entry as Record<string, unknown>;
    const labelValue = record.label ?? record.text ?? record.title ?? record.value;
    if (typeof labelValue !== 'string' && typeof labelValue !== 'number') return [];
    return [
      {
        active: record.active === true,
        disabled: record.disabled === true,
        hint: typeof record.hint === 'string' ? record.hint : undefined,
        icon: typeof record.icon === 'string' ? record.icon : undefined,
        isValid: typeof record.isValid === 'boolean' ? record.isValid : undefined,
        id:
          typeof record.id === 'string'
            ? record.id
            : typeof record.key === 'string'
              ? record.key
              : undefined,
        label: String(labelValue),
        value: record.value ?? record.path ?? record.id ?? record.key ?? labelValue,
      },
    ];
  });
}

function useModel<T>(
  props: RuntimeProps,
  name: string,
  fallback: T,
): readonly [T, (value: T) => void] {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const controlled = props[name] as T | undefined;
  const defaultValue = props[`default${capitalized}`] as T | undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? fallback);
  const value = controlled === undefined ? internal : controlled;
  const setValue = (next: T): void => {
    if (controlled === undefined) setInternal(next);
    callback(props, `on${capitalized}Change`)?.(next);
  };
  return [value, setValue] as const;
}

const CATALOG_ICON_NAME_PATTERN = /^[a-z][a-z0-9-]*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reactCatalogIconCache = new Map<string, ReactIconData>();
const reactCatalogIconRequests = new Map<string, Promise<ReactIconData | undefined>>();
const reactCatalogIconMisses = new Set<string>();

function parseLegacySvgIcon(source: string | undefined): ReactIconData | undefined {
  if (!source) return undefined;

  const root = source.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const readAttribute = (attribute: string): string | undefined =>
    root.match(new RegExp(`(?:^|\\s)${attribute}=["']([^"']+)["']`, 'i'))?.[1];
  const body = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim();

  if (!body) return undefined;

  return {
    body,
    fill: readAttribute('fill'),
    stroke: readAttribute('stroke'),
    strokeLinecap: readAttribute('stroke-linecap') as ReactIconData['strokeLinecap'],
    strokeLinejoin: readAttribute('stroke-linejoin') as ReactIconData['strokeLinejoin'],
    strokeWidth: readAttribute('stroke-width'),
    viewBox: readAttribute('viewBox') ?? '0 0 24 24',
  };
}

function loadReactIcon(name: string): Promise<ReactIconData | undefined> {
  const cached = reactCatalogIconCache.get(name);

  if (cached) return Promise.resolve(cached);
  if (reactCatalogIconMisses.has(name)) return Promise.resolve(undefined);

  const activeRequest = reactCatalogIconRequests.get(name);

  if (activeRequest) return activeRequest;

  // Both bucket maps stay behind dynamic imports. A component downloads only
  // the two-letter icon bucket needed by the requested public name.
  const loader = CATALOG_ICON_NAME_PATTERN.test(name)
    ? import('../assets/icons/runtime/catalog/load-icon').then(({ loadCatalogIcon }) =>
        loadCatalogIcon(name),
      )
    : Promise.resolve().then(async () => {
        if (!legacyIconNames.has(name)) return undefined;
        const bucketName = name
          .replace(/[^a-z0-9]/gi, '')
          .slice(0, 2)
          .toLowerCase();
        const bucket = await legacyIconBucketLoaders[bucketName]?.();
        return parseLegacySvgIcon(bucket?.[name]);
      });
  const request = loader
    .then((icon) => {
      if (icon) reactCatalogIconCache.set(name, icon);
      else reactCatalogIconMisses.add(name);

      return icon;
    })
    .catch(() => undefined)
    .finally(() => {
      reactCatalogIconRequests.delete(name);
    });

  reactCatalogIconRequests.set(name, request);

  return request;
}

function useReactIcon(name: string): {
  icon?: ReactIconData;
  supported: boolean;
} {
  const bundledIcon = essentialReactIconData[name];
  const isLoadableIcon = CATALOG_ICON_NAME_PATTERN.test(name) || legacyIconNames.has(name);
  const cachedIcon = reactCatalogIconCache.get(name);
  const knownMissing = reactCatalogIconMisses.has(name);
  const [loadedIcon, setLoadedIcon] = useState<{
    icon?: ReactIconData;
    name: string;
    settled: boolean;
  }>(() => ({ icon: cachedIcon, name, settled: cachedIcon !== undefined }));

  useEffect(() => {
    if (bundledIcon || !isLoadableIcon || cachedIcon || knownMissing) return;

    let active = true;

    void loadReactIcon(name).then((icon) => {
      if (active) setLoadedIcon({ icon, name, settled: true });
    });

    return () => {
      active = false;
    };
  }, [bundledIcon, cachedIcon, isLoadableIcon, knownMissing, name]);

  const resolvedLoadedIcon = loadedIcon.name === name ? loadedIcon.icon : undefined;
  const settledWithoutIcon =
    loadedIcon.name === name && loadedIcon.settled && loadedIcon.icon === undefined;

  return {
    icon: bundledIcon ?? cachedIcon ?? resolvedLoadedIcon,
    supported: Boolean(bundledIcon || (isLoadableIcon && !knownMissing && !settledWithoutIcon)),
  };
}

function Svg({
  name,
  className,
  dataTestId,
  label,
  labelledBy,
  describedBy,
  ariaHidden,
  role,
  style,
  tabIndex,
}: {
  name: string;
  className?: string;
  dataTestId?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  ariaHidden?: boolean | 'false' | 'true';
  role?: string;
  style?: CSSProperties;
  tabIndex?: number;
}): ReactElement | null {
  const { icon, supported } = useReactIcon(name);

  if (!supported) return null;

  const hasAccessibleName = Boolean(label || labelledBy);
  const isExplicitlyHidden = ariaHidden === true || ariaHidden === 'true';

  return (
    <svg
      aria-describedby={describedBy}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={cx('peaui-svg-icon', className)}
      data-testid={dataTestId}
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      fill={icon?.fill}
      focusable="false"
      role={role ?? (hasAccessibleName && !isExplicitlyHidden ? 'img' : undefined)}
      stroke={icon?.stroke}
      strokeLinecap={icon?.strokeLinecap}
      strokeLinejoin={icon?.strokeLinejoin}
      strokeWidth={icon?.strokeWidth}
      style={style}
      tabIndex={tabIndex}
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
  );
}

type AvatarImageState = 'idle' | 'loading' | 'loaded' | 'error';

const AVATAR_STATUS_LABELS: Readonly<Record<string, string>> = {
  away: 'Zaraz wracam',
  busy: 'Zajęty',
  offline: 'Niedostępny',
  online: 'Dostępny',
};

function normalizeAvatarText(value: unknown): string | undefined {
  const normalized = typeof value === 'string' ? value.trim() : '';

  return normalized || undefined;
}

function mergeAvatarIds(...values: Array<string | undefined>): string | undefined {
  const ids = new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));

  return ids.size > 0 ? [...ids].join(' ') : undefined;
}

function AvatarRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const source = normalizeAvatarText(props.src);
  const normalizedAlt = typeof props.alt === 'string' ? props.alt.trim() : undefined;
  const normalizedName = normalizeAvatarText(props.name);
  const resolvedInitials =
    normalizeAvatarInitials(normalizeAvatarText(props.initials)) ||
    getAvatarInitials(normalizedName);
  const interactive = bool(props, 'interactive');
  const externalAriaLabel =
    normalizeAvatarText(props.ariaLabel) ?? normalizeAvatarText(props['aria-label']);
  const externalAriaLabelledBy = normalizeAvatarText(props['aria-labelledby']);
  const externalAriaDescribedBy = normalizeAvatarText(props['aria-describedby']);
  const [storedImageState, setStoredImageState] = useState<{
    source?: string;
    state: AvatarImageState;
  }>(() => ({ source, state: source ? 'loading' : 'idle' }));
  const imageState: AvatarImageState =
    storedImageState.source === source ? storedImageState.state : source ? 'loading' : 'idle';
  const status = text(props, 'status', 'none');
  const resolvedStatusLabel =
    status === 'none'
      ? undefined
      : (normalizeAvatarText(props.statusLabel) ?? AVATAR_STATUS_LABELS[status]);
  const statusId = `peaui-avatar-status-${useId().replace(/:/g, '')}`;
  const isDecorative =
    !interactive && normalizedAlt === '' && !externalAriaLabel && !externalAriaLabelledBy;
  const hasImage = Boolean(source) && imageState !== 'error';
  const isImageVisible = hasImage && imageState === 'loaded';
  const hasSemanticImage =
    isImageVisible &&
    !interactive &&
    Boolean(normalizedAlt) &&
    !externalAriaLabel &&
    !externalAriaLabelledBy;
  const usesRootSemantics = interactive || (!isDecorative && !hasSemanticImage);
  const accessibleName =
    externalAriaLabel ??
    normalizedAlt ??
    normalizedName ??
    (resolvedInitials || 'Awatar użytkownika');
  const statusDescriptionId = resolvedStatusLabel ? statusId : undefined;
  const rootAriaDescribedBy =
    usesRootSemantics && !isDecorative
      ? mergeAvatarIds(externalAriaDescribedBy, statusDescriptionId)
      : undefined;
  const imageAriaDescribedBy = hasSemanticImage
    ? mergeAvatarIds(externalAriaDescribedBy, statusDescriptionId)
    : undefined;
  const size = text(props, 'size', 'm');
  const shape = text(props, 'shape', 'circle');
  const baseTestId = dataTest(props);
  const Root = (interactive ? 'button' : 'span') as ElementType;
  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
    setStoredImageState({ source, state: 'loaded' });
    callback(props, 'onLoad')?.(event);
  };
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
    setStoredImageState({ source, state: 'error' });
    callback(props, 'onError')?.(event);
  };

  return (
    <Root
      aria-describedby={rootAriaDescribedBy}
      aria-label={
        usesRootSemantics && !isDecorative && !externalAriaLabelledBy ? accessibleName : undefined
      }
      aria-labelledby={usesRootSemantics && !isDecorative ? externalAriaLabelledBy : undefined}
      className={cx(
        'peaui-avatar',
        `peaui-avatar--size-${size}`,
        `peaui-avatar--shape-${shape}`,
        `peaui-avatar--state-${imageState}`,
        interactive && 'peaui-avatar--interactive',
        interactive && bool(props, 'disabled') && 'peaui-avatar--disabled',
        props.className,
      )}
      data-state={imageState}
      data-testid={baseTestId}
      disabled={interactive ? bool(props, 'disabled') : undefined}
      onClick={
        interactive && typeof props.onClick === 'function'
          ? (props.onClick as MouseEventHandler<HTMLElement>)
          : undefined
      }
      onKeyDown={
        typeof props.onKeyDown === 'function'
          ? (props.onKeyDown as KeyboardEventHandler<HTMLElement>)
          : undefined
      }
      onPointerDown={
        typeof props.onPointerDown === 'function'
          ? (props.onPointerDown as PointerEventHandler<HTMLElement>)
          : undefined
      }
      ref={forwardedRef}
      role={
        interactive || !usesRootSemantics ? undefined : (normalizeAvatarText(props.role) ?? 'img')
      }
      style={props.style}
      type={interactive ? 'button' : undefined}
    >
      <span className="peaui-avatar__media">
        {hasImage ? (
          <img
            alt={hasSemanticImage ? normalizedAlt : ''}
            aria-describedby={imageAriaDescribedBy}
            aria-hidden={hasSemanticImage ? undefined : true}
            className={cx('peaui-avatar__image', isImageVisible && 'peaui-avatar__image--visible')}
            data-testid={baseTestId ? `${baseTestId}-image` : undefined}
            decoding="async"
            key={source}
            loading={text(props, 'loading', 'lazy') as 'eager' | 'lazy'}
            role={hasSemanticImage ? undefined : 'presentation'}
            src={source}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : null}
        {!isImageVisible ? (
          <span
            aria-hidden="true"
            className="peaui-avatar__fallback"
            data-testid={baseTestId ? `${baseTestId}-fallback` : undefined}
          >
            {props.children !== undefined && props.children !== null ? (
              props.children
            ) : resolvedInitials ? (
              <span
                className="peaui-avatar__initials"
                data-testid={baseTestId ? `${baseTestId}-initials` : undefined}
              >
                {resolvedInitials}
              </span>
            ) : (
              <Svg
                className="peaui-avatar__icon"
                dataTestId={baseTestId ? `${baseTestId}-icon` : undefined}
                name={text(props, 'fallbackIcon', 'users')}
              />
            )}
          </span>
        ) : null}
      </span>
      {status !== 'none' && resolvedStatusLabel ? (
        <span
          aria-hidden="true"
          className={cx('peaui-avatar__status', `peaui-avatar__status--${status}`)}
          data-testid={baseTestId ? `${baseTestId}-status` : undefined}
        >
          {node(props, 'statusContent')}
        </span>
      ) : null}
      {resolvedStatusLabel ? (
        <span className="peaui-avatar__status-label" id={statusId}>
          {resolvedStatusLabel}
        </span>
      ) : null}
    </Root>
  );
}

type ReactDropdownMenuItem = {
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

function asDropdownMenuItems(value: unknown): ReactDropdownMenuItem[] {
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

function DropdownMenuRenderer({
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
    | ((state: { open: boolean; disabled: boolean }) => ReactNode)
    | undefined;
  const renderItem = props.renderItem as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderItemIcon = props.renderItemIcon as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderItemShortcut = props.renderItemShortcut as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderGroupLabel = props.renderGroupLabel as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;

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

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event: PointerEvent): void => {
      if (
        rootRef.current?.contains(event.target as Node) ||
        menuRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      closeMenu(false);
      callback(props, 'onOutsideClick')?.();
    };
    const handlePosition = (): void => schedulePosition();
    document.addEventListener('pointerdown', handleOutside, true);
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition, true);
    window.visualViewport?.addEventListener('resize', handlePosition);
    window.visualViewport?.addEventListener('scroll', handlePosition);
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(handlePosition);
    const trigger = triggerElement();
    if (trigger) observer?.observe(trigger);
    if (menuRef.current) observer?.observe(menuRef.current);
    schedulePosition();
    queueMicrotask(() => focusEdge('root', pendingFocus.current));

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
            {isCheckable && item.checked ? <Svg name="check" /> : null}
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
        popover={getNativePopoverValue()}
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

function SplitButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const root = 'peaui-split-button';
  const label = text(props, 'label', 'Akcja');
  const variant = text(props, 'variant', 'primary');
  const size = text(props, 'size', 'm');
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const menuLoading = bool(props, 'menuLoading');
  const primaryBlocked = disabled || bool(props, 'primaryDisabled') || loading;
  const menuBlocked = disabled || bool(props, 'menuDisabled');
  const menuAriaLabel = text(props, 'menuAriaLabel') || `Więcej opcji: ${label}`;
  const baseTestId = dataTest(props);
  const renderLabel = node(props, 'labelContent') ?? props.children ?? label;
  const renderIcon = node(props, 'iconContent');
  const renderMenuTriggerIcon = node(props, 'menuTriggerIconContent');
  const renderMenuItem = props.renderMenuItem as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderMenuItemIcon = props.renderMenuItemIcon as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderMenuItemShortcut = props.renderMenuItemShortcut as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderGroupLabel = props.renderGroupLabel as
    | ((item: ReactDropdownMenuItem, path: number[]) => ReactNode)
    | undefined;
  const renderTrigger = (): ReactElement => (
    <button
      aria-busy={menuLoading || undefined}
      aria-label={menuAriaLabel}
      className={cx(
        'peaui-button-action',
        'peaui-split-button__trigger',
        `peaui-button-action--size-${size}`,
        `peaui-button-action--variant-${variant}`,
        menuBlocked && 'peaui-button-action--is-disabled',
      )}
      data-testid={baseTestId ? `${baseTestId}-trigger` : undefined}
      disabled={menuBlocked}
      type="button"
    >
      <span aria-hidden="true" className="peaui-split-button__trigger-icon">
        {renderMenuTriggerIcon ?? <Svg name="arrowRounded" />}
      </span>
    </button>
  );

  return (
    <div
      aria-label={text(props, 'ariaLabel') || label}
      className={cx(
        root,
        `${root}--variant-${variant}`,
        `${root}--size-${size}`,
        disabled && `${root}--disabled`,
        primaryBlocked && `${root}--primary-disabled`,
        menuBlocked && `${root}--menu-disabled`,
        loading && `${root}--loading`,
        menuLoading && `${root}--menu-loading`,
        props.open === true && `${root}--open`,
        props.className,
      )}
      data-testid={baseTestId}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="group"
      style={props.style}
    >
      <button
        aria-busy={loading || undefined}
        aria-label={label}
        className={cx(
          'peaui-button-action',
          'peaui-split-button__primary',
          `peaui-button-action--size-${size}`,
          `peaui-button-action--variant-${variant}`,
          primaryBlocked && 'peaui-button-action--is-disabled',
        )}
        data-testid={baseTestId ? `${baseTestId}-primary` : undefined}
        disabled={primaryBlocked}
        type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
        onClick={(event) => callback(props, 'onPrimaryClick')?.(event)}
      >
        {loading ? (
          <span aria-hidden="true" className="peaui-split-button__spinner" />
        ) : (
          (renderIcon ??
          (text(props, 'icon') ? (
            <Svg className="peaui-split-button__primary-icon" name={text(props, 'icon')} />
          ) : null))
        )}
        <span className="peaui-split-button__label">{renderLabel}</span>
      </button>
      {loading ? (
        <span className="peaui-split-button__status" role="status">
          {text(props, 'loadingLabel', 'Trwa wykonywanie głównej akcji')}
        </span>
      ) : null}
      <DropdownMenuRenderer
        align={text(props, 'menuAlign', 'end')}
        ariaLabel={menuAriaLabel}
        className="peaui-split-button__menu"
        closeOnSelect={props.closeOnSelect}
        dataTestId={baseTestId ? `${baseTestId}-dropdown` : undefined}
        defaultOpen={props.defaultOpen}
        disabled={menuBlocked}
        empty={node(props, 'emptyContent') ?? text(props, 'emptyLabel', 'Brak dostępnych akcji')}
        items={props.items}
        loading={menuLoading}
        loadingContent={
          node(props, 'menuLoadingContent') ?? text(props, 'menuLoadingLabel', 'Ładowanie menu…')
        }
        loop={props.loop}
        open={props.open}
        placement="bottom"
        renderGroupLabel={renderGroupLabel}
        renderItem={renderMenuItem}
        renderItemIcon={renderMenuItemIcon}
        renderItemShortcut={renderMenuItemShortcut}
        renderTrigger={renderTrigger}
        onOpenChange={(value: boolean) => callback(props, 'onOpenChange')?.(value)}
        onSelect={(item: ReactDropdownMenuItem, path: number[]) =>
          callback(props, 'onSelect')?.(item, path)
        }
      />
    </div>
  );
}

type ReactMenuBarMenu = {
  disabled?: boolean;
  icon?: string;
  id: string | number;
  items: ReactDropdownMenuItem[];
  label: string;
};

function asMenuBarMenus(value: unknown): ReactMenuBarMenu[] {
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

function MenuBarRenderer({
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

  useEffect(() => {
    const activeIndex = menus.findIndex((menu) => menu.id === activeMenuId && !menuDisabled(menu));
    if (activeIndex < 0) {
      const nextIndex = edgeEnabledMenuIndex(navigationMenus, 'first');
      setActiveMenuId(nextIndex >= 0 ? (menus[nextIndex]?.id ?? null) : null);
    }
    if (openMenu !== null && !menus.some((menu) => menu.id === openMenu && !menuDisabled(menu))) {
      setOpenMenu(null);
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

type ReactContextMenuHandle = HTMLElement & {
  close(): void;
  openAt(point: { context?: unknown; x: number; y: number }): boolean;
};

type ReactContextAnchor = {
  align: 'start' | 'end';
  placement: 'top' | 'bottom';
  rect: DOMRect;
  target: HTMLElement | null;
  version: number;
};

function contextPointRect(x: number, y: number): DOMRect {
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
  } as DOMRect;
}

function ContextMenuRenderer({
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
    | ((state: { context: unknown; disabled: boolean; open: boolean }) => ReactNode)
    | undefined;

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
        cancelLongPress('target-removed');
        close('target-removed');
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
    cancelLongPress('disabled');
    close('disabled');
  }, [disabled]);

  useEffect(() => {
    if (!open || !closeOnScroll) return undefined;
    const handleScroll = (event: Event): void => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      close('scroll');
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
          if (
            !(
              event.key === 'ContextMenu' ||
              event.key === 'Apps' ||
              (event.shiftKey && event.key === 'F10')
            )
          )
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

type ReactAvatarGroupItem = {
  alt?: string;
  disabled?: boolean;
  id: string | number;
  initials?: string;
  metadata?: unknown;
  name?: string;
  src?: string;
  status?: string;
};

function asAvatarGroupItems(value: unknown): ReactAvatarGroupItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (entry): entry is ReactAvatarGroupItem =>
      typeof entry === 'object' &&
      entry !== null &&
      (typeof (entry as ReactAvatarGroupItem).id === 'string' ||
        typeof (entry as ReactAvatarGroupItem).id === 'number'),
  );
}

function AvatarGroupRenderer({
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
  const showsPopover = overflowMode === 'popover' && hasOverflow && open;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const overflowButtonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocus = useRef(false);
  const popoverId = `peaui-avatar-group-popover-${useId().replace(/:/g, '')}`;
  const size = text(props, 'size', 'm');
  const shape = text(props, 'shape', 'circle');
  const direction = text(props, 'direction', 'end');
  const overlap = bool(props, 'overlap', true);
  const disabled = bool(props, 'disabled');
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

  useEffect(() => {
    if (showsPopover) {
      const firstAction =
        popoverRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
      (firstAction ?? popoverRef.current)?.focus();
      return;
    }
    if (!shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    overflowButtonRef.current?.focus();
  }, [showsPopover]);

  useEffect(() => {
    if (!showsPopover) return undefined;
    const handlePointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) closePopover(false);
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
        >
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
                  <li className="peaui-avatar-group__popover-item" key={resolveKey(item, index)}>
                    <button
                      aria-label={resolveLabel(item, index)}
                      className="peaui-avatar-group__popover-button"
                      disabled={disabled || item.disabled}
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
        </section>
      ) : null}
    </div>
  );
}

function FormShell({
  props,
  children,
  shellClass,
}: {
  props: RuntimeProps;
  children: ReactNode;
  shellClass?: string;
}): ReactElement {
  const id = text(props, 'id') || useId();
  const label = text(props, 'label');
  const className = 'peaui-form-field';
  const maxLength = num(props, 'maxLength');
  const valueLength = typeof props.value === 'string' ? props.value.length : 0;
  const hasError = Boolean(node(props, 'error'));
  const hasSuccess = Boolean(node(props, 'success'));
  return (
    <div
      className={cx(
        className,
        shellClass,
        bool(props, 'disabled') && `${className}--disabled`,
        props.className,
      )}
      data-testid={dataTest(props)}
      style={props.style}
    >
      {label ? (
        <label className="peaui-form-label" htmlFor={id} id={`label-${id}`}>
          <span className="peaui-form-label__content">
            <span className="peaui-form-label__text">{label}</span>
            {!bool(props, 'required') ? (
              <span className="peaui-form-label__optional">(pole niewymagane)</span>
            ) : null}
          </span>
          {node(props, 'hint') ? (
            <>
              <span className="peaui-info-tooltip" tabIndex={0}>
                <Svg className="peaui-form-label__hint-icon" name="info" />
              </span>
              <span
                className="peaui-info-tooltip__content peaui-info-tooltip__content--placement-right"
                role="tooltip"
              >
                <span className="peaui-info-tooltip__description">{node(props, 'hint')}</span>
              </span>
            </>
          ) : null}
        </label>
      ) : null}
      <div className={`${className}__content`}>
        {text(props, 'iconBefore') ? (
          <Svg
            className={`${className}__icon ${className}__icon--before`}
            name={text(props, 'iconBefore')}
          />
        ) : null}
        {children}
        {text(props, 'iconAfter') ? (
          <Svg
            className={`${className}__icon ${className}__icon--after`}
            name={text(props, 'iconAfter')}
          />
        ) : null}
        {text(props, 'before') ? (
          <span
            className={`${className}__additional ${className}__additional--before`}
            data-before={text(props, 'before')}
          />
        ) : null}
        {text(props, 'after') ? (
          <span
            className={`${className}__additional ${className}__additional--after`}
            data-after={text(props, 'after')}
          />
        ) : null}
      </div>
      {node(props, 'description') && !hasError && !hasSuccess && !maxLength ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-default peaui-message-text--size-xs`}
          id={`${id}-description`}
        >
          <p className="peaui-message-text__content">{node(props, 'description')}</p>
        </div>
      ) : null}
      {!hasError && !hasSuccess && maxLength ? (
        <div
          className={cx(
            `${className}__message`,
            'peaui-message-text',
            `peaui-message-text--variant-${maxLength === valueLength ? 'info' : 'default'}`,
            'peaui-message-text--size-xs',
          )}
          id={`${id}-help-max-length-description`}
        >
          <p className="peaui-message-text__content">
            Długość tekstu: {valueLength} / {maxLength} znaków
          </p>
        </div>
      ) : null}
      {hasError && !hasSuccess ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-error peaui-message-text--size-xs`}
          id={`${id}-error`}
          role="alert"
        >
          <Svg className="peaui-message-text__icon" name="hint" />
          <p className="peaui-message-text__content">{node(props, 'error')}</p>
        </div>
      ) : null}
      {hasSuccess && !hasError ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-success peaui-message-text--size-xs`}
          id={`${id}-success`}
        >
          <Svg className="peaui-message-text__icon" name="checkCircle" />
          <p className="peaui-message-text__content">{node(props, 'success')}</p>
        </div>
      ) : null}
    </div>
  );
}

function BasicRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'SvgIcon')
    return (
      <Svg
        ariaHidden={
          typeof props['aria-hidden'] === 'boolean' ||
          props['aria-hidden'] === 'false' ||
          props['aria-hidden'] === 'true'
            ? props['aria-hidden']
            : undefined
        }
        className={props.className}
        dataTestId={dataTest(props)}
        describedBy={text(props, 'aria-describedby') || undefined}
        label={text(props, 'ariaLabel') || text(props, 'aria-label') || undefined}
        labelledBy={text(props, 'aria-labelledby') || undefined}
        name={text(props, 'name', 'info')}
        role={text(props, 'role') || undefined}
        style={props.style}
        tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : undefined}
      />
    );
  const size = text(props, 'size', 'auto');
  return (
    <span
      {...common(props)}
      className={cx('peaui-image-view', `peaui-image-view--size-${size}`, props.className)}
      ref={forwardedRef as ForwardedRef<HTMLSpanElement>}
    >
      <img
        alt={text(props, 'alt')}
        className="peaui-image-view__image"
        src={text(props, 'src')}
        style={{ maxWidth: text(props, 'max') || undefined }}
      />
    </span>
  );
}

function ButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const [exportOpen, setExportOpen] = useState(false);
  if (kind === 'ButtonAction') {
    const root = 'peaui-button-action';
    const disabled = bool(props, 'disabled');
    return (
      <button
        {...common(props)}
        className={cx(
          root,
          `${root}--size-${text(props, 'size', 'm')}`,
          `${root}--variant-${text(props, 'variant', 'primary')}`,
          disabled && `${root}--is-disabled`,
          props.className,
        )}
        disabled={disabled}
        ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
        type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
        onClick={(event) => callback(props, 'onClick')?.(event)}
      >
        {props.children ?? 'Akcja'}
      </button>
    );
  }
  if (kind === 'ButtonExport') {
    const size = text(props, 'size', 'm');
    const variant = text(props, 'variant', 'secondary');
    const disabled = bool(props, 'disabled');
    return (
      <>
        <button
          {...common(props)}
          aria-expanded={exportOpen}
          aria-haspopup="menu"
          className={cx(
            'peaui-button-export',
            'peaui-popover-button',
            'peaui-button-action',
            `peaui-button-action--size-${size}`,
            `peaui-button-action--variant-${variant}`,
            disabled && 'peaui-button-action--is-disabled',
            props.className,
          )}
          disabled={disabled}
          ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
          type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
          onClick={() => setExportOpen((current) => !current)}
        >
          <Svg className="peaui-button-export__icon" name="download" />
          {props.children ?? 'Eksportuj'}
          {num(props, 'selectedItemsCount') > 0 ? (
            <span className="peaui-counter-badge peaui-counter-badge--variant-info peaui-counter-badge--size-m">
              {num(props, 'selectedItemsCount')}
            </span>
          ) : null}
          <Svg className="peaui-button-export__arrow" name="arrow" />
        </button>
        {exportOpen ? (
          <div
            className={cx(
              'peaui-popover-button__content',
              'peaui-popover-button__content--match-trigger-width',
              `peaui-popover-button__content--placement-${text(props, 'placement', 'bottom')}`,
            )}
            role="menu"
          >
            <div className="peaui-button-export__content">
              <h3 className="peaui-button-export__content-sr-only">Akcje eksportu</h3>
              <ul className="peaui-button-export__content-list">
                {[
                  ['csv', 'Do CSV'],
                  ['xlsx', 'Do XLSX'],
                  ['pdf', 'Do PDF'],
                ].map(([format, label]) => (
                  <li key={format} className="peaui-button-export__content-item">
                    <button
                      className="peaui-button-export__content-button"
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        callback(props, 'onExport')?.(format);
                        setExportOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </>
    );
  }
  if (kind === 'SelectableCard') {
    const disabled = bool(props, 'disabled');
    const readonly = bool(props, 'readonly');
    return (
      <div className="peaui-selectable-card__wrapper">
        <button
          {...common(props)}
          aria-pressed={bool(props, 'active')}
          className={cx(
            'peaui-selectable-card',
            bool(props, 'active') && 'peaui-selectable-card--is-active',
            disabled && 'peaui-selectable-card--is-disabled',
            readonly && 'peaui-selectable-card--is-readonly',
            Boolean(node(props, 'hint')) && 'peaui-selectable-card--with-hint',
            props.className,
          )}
          disabled={disabled}
          ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
          type="button"
          onClick={() => !readonly && callback(props, 'onClick')?.()}
        >
          <div className="peaui-selectable-card__content">
            {node(props, 'title') ? (
              <strong className="peaui-selectable-card__content__title">
                {node(props, 'title')}
              </strong>
            ) : null}
            {node(props, 'description') ? (
              <p className="peaui-selectable-card__content__description">
                {node(props, 'description')}
              </p>
            ) : null}
          </div>
          <div className="peaui-selectable-card__additional">{node(props, 'additional')}</div>
        </button>
        {node(props, 'hint') ? (
          <span className="peaui-selectable-card__hint" title={text(props, 'hint')}>
            <Svg className="peaui-selectable-card__hint-icon" name="info" />
          </span>
        ) : null}
      </div>
    );
  }
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  return (
    <button
      {...common(props)}
      aria-pressed={bool(props, 'active')}
      className={cx(
        `peaui-${kind.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '')}`,
        bool(props, 'active') && 'is-active',
        props.className,
      )}
      disabled={disabled || readonly}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      type="button"
      onClick={() => callback(props, 'onClick')?.()}
    >
      {node(props, 'title') ? <strong>{node(props, 'title')}</strong> : null}
      {node(props, 'description') ? <span>{node(props, 'description')}</span> : null}
      {props.children}
      {node(props, 'additional')}
    </button>
  );
}

function TextInputRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const modelName = kind === 'InputSlider' ? 'value' : 'value';
  const [value, setValue] = useModel<unknown>(props, modelName, kind === 'InputSlider' ? 0 : '');
  const id = text(props, 'id') || useId();
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase');
  const before = text(props, 'before');
  const after = text(props, 'after');
  const iconBefore = text(props, 'iconBefore');
  const iconAfter = text(props, 'iconAfter');
  let type: 'text' | 'number' | 'range' | 'password' = 'text';
  if (kind === 'FormNumber') type = 'number';
  if (kind === 'InputSlider') type = 'range';
  if (kind === 'FormPassword') type = 'password';
  const [visible, setVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  if (kind === 'FormPassword' && visible) type = 'text';
  const formInputClass =
    kind === 'FormNumber'
      ? 'peaui-form-field-number'
      : kind === 'FormPassword'
        ? 'peaui-form-field-password'
        : 'peaui-form-field-input';
  const canCopyPassword = kind === 'FormPassword' && bool(props, 'canCopy', true);
  const canShowPassword = kind === 'FormPassword' && bool(props, 'canVisible', true);
  const passwordActionsCount = Number(canCopyPassword) + Number(canShowPassword);
  const trailingControlWidth =
    kind === 'FormNumber' && bool(props, 'isRangeVisible', true) && !readonly && !disabled ? 20 : 0;
  const eraseButtonRight = getFormFieldEraseOffset({
    after,
    iconAfter,
    trailingControlWidth,
  });
  let paddingRight = `${getFormFieldPaddingRight({
    after,
    canErase,
    iconAfter,
    minimumEraseOffset: eraseButtonRight,
  })}px`;
  if (kind === 'FormPassword' && passwordActionsCount > 0) {
    paddingRight = passwordActionsCount === 2 ? '5.75rem' : '2.875rem';
  }
  const paddingLeft = before
    ? `${before.length * 7.5 + 14 + (iconBefore ? 24 : 0)}px`
    : iconBefore
      ? '32px'
      : '12px';
  const input = (
    <input
      aria-disabled={disabled}
      aria-invalid={Boolean(node(props, 'error')) || text(props, 'aria-invalid') === 'true'}
      aria-label={
        text(props, 'ariaLabel') || text(props, 'label') || text(props, 'name') || undefined
      }
      className={cx(
        kind === 'InputSlider' && 'peaui-input-slider__slider',
        kind === 'SearchInput' &&
          'peaui-search-input__input peaui-search-input__input--interactive',
        !['InputSlider', 'SearchInput'].includes(kind) &&
          `peaui-form-field__element ${formInputClass}`,
        !['InputSlider', 'SearchInput'].includes(kind) &&
          (value !== ''
            ? 'peaui-form-field__element--medium'
            : 'peaui-form-field__element--normal'),
        !['InputSlider', 'SearchInput'].includes(kind) &&
          disabled &&
          'peaui-form-field__element--disabled',
        !['InputSlider', 'SearchInput'].includes(kind) &&
          readonly &&
          'peaui-form-field__element--readonly',
        !['InputSlider', 'SearchInput'].includes(kind) &&
          !readonly &&
          'peaui-form-field__element--basic',
        kind === 'FormNumber' &&
          (!bool(props, 'isRangeVisible') || readonly || disabled) &&
          'peaui-form-field-number--appearance-none',
        node(props, 'error') ? 'peaui-form-field__element--error' : undefined,
        node(props, 'success') ? 'peaui-form-field__element--success' : undefined,
      )}
      data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
      disabled={disabled}
      id={id}
      max={typeof props.max === 'number' || typeof props.max === 'string' ? props.max : undefined}
      maxLength={typeof props.maxLength === 'number' ? props.maxLength : undefined}
      min={typeof props.min === 'number' || typeof props.min === 'string' ? props.min : undefined}
      name={text(props, 'name') || undefined}
      placeholder={
        text(props, 'placeholder') ||
        (kind === 'SearchInput' ? 'Szukaj' : kind === 'FormPassword' ? 'wpisz' : undefined)
      }
      readOnly={readonly}
      ref={forwardedRef as ForwardedRef<HTMLInputElement>}
      required={bool(props, 'required')}
      step={typeof props.step === 'number' ? props.step : undefined}
      style={
        {
          '--pl': paddingLeft,
          '--pr': paddingRight,
        } as CSSProperties
      }
      aria-describedby={
        [
          text(props, 'aria-describedby'),
          node(props, 'error') ? `${id}-error` : undefined,
          kind === 'FormPassword' && bool(props, 'enablePasswordStrengthMeter')
            ? `${id}-strength-status`
            : undefined,
        ]
          .filter(Boolean)
          .join(' ') || undefined
      }
      data-type={
        kind === 'FormNumber'
          ? 'number'
          : kind === 'FormPassword'
            ? 'password'
            : kind === 'FormInput'
              ? 'input'
              : undefined
      }
      type={type}
      value={value === undefined || value === null ? '' : String(value)}
      onChange={(event) => {
        const next =
          type === 'number' || type === 'range'
            ? event.target.value === ''
              ? undefined
              : Number(event.target.value)
            : event.target.value;
        setValue(next);
        if (kind === 'SearchInput') callback(props, 'onSearch')?.(next);
      }}
    />
  );
  if (kind === 'InputSlider')
    return (
      <div {...common(props)} className={cx('peaui-input-slider', props.className)}>
        <button
          aria-label={`Zmniejsz wartość. Obecna: ${String(value)}`}
          className="peaui-input-slider__button peaui-input-slider__button--decrement peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-ghost"
          disabled={disabled}
          type="button"
          onClick={() => setValue(Math.max(0, Number(value) - 0.1))}
        >
          <span className="peaui-input-slider__button-icon">−</span>
        </button>
        {input}
        <button
          aria-label={`Zwiększ wartość. Obecna: ${String(value)}`}
          className="peaui-input-slider__button peaui-input-slider__button--increment peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-ghost"
          disabled={disabled}
          type="button"
          onClick={() => setValue(Math.min(1, Number(value) + 0.1))}
        >
          <span className="peaui-input-slider__button-icon">+</span>
        </button>
      </div>
    );
  if (kind === 'SearchInput')
    return (
      <div {...common(props)} className={cx('peaui-search-input', props.className)} role="search">
        <div className="peaui-search-input__field">
          <Svg className="peaui-search-input__field-icon" name="search" />
          {input}
          {value ? (
            <button
              aria-label="Wyczyść"
              className="peaui-search-input__erase-button"
              type="button"
              onClick={() => {
                setValue('');
                callback(props, 'onRemove')?.();
                callback(props, 'onSearch')?.('');
              }}
            >
              <Svg className="peaui-search-input__erase-icon" name="cross" />
            </button>
          ) : null}
        </div>
        <button
          aria-label="Szukaj"
          className="peaui-search-input__button peaui-button-action peaui-button-action--variant-primary"
          disabled={disabled || readonly}
          type="button"
          onClick={() => callback(props, 'onSearch')?.(value)}
        >
          <Svg className="peaui-search-input__button-icon" name="search" />
        </button>
      </div>
    );
  if (kind === 'FormPassword') {
    const password = String(value ?? '');
    const passwordStrength = evaluatePasswordStrength(password);
    return (
      <div className="peaui-form-field-password__wrapper">
        <FormShell props={{ ...props, value }}>
          {passwordActionsCount > 0 ? (
            <div
              className="peaui-form-field-password__actions"
              data-disabled={disabled || undefined}
              data-readonly={readonly || undefined}
            >
              {canShowPassword ? (
                <button
                  aria-label={
                    visible
                      ? text(props, 'hidePasswordAriaLabel', 'Ukryj hasło')
                      : text(props, 'showPasswordAriaLabel', 'Pokaż hasło')
                  }
                  aria-pressed={visible}
                  className={cx(
                    'peaui-form-field-password__button',
                    'peaui-form-field-password__button--toggle',
                    visible && 'peaui-form-field-password__button--active',
                  )}
                  disabled={disabled}
                  type="button"
                  onClick={() => setVisible((current) => !current)}
                >
                  <Svg className="peaui-form-field-password__icon" name="eye" />
                </button>
              ) : null}
              {canCopyPassword ? (
                <button
                  aria-label={text(props, 'copyPasswordAriaLabel', 'Kopiuj hasło')}
                  className="peaui-form-field-password__button"
                  disabled={disabled || !password}
                  type="button"
                  onClick={() => {
                    try {
                      void navigator.clipboard
                        .writeText(password)
                        .then(() =>
                          setCopyStatus(
                            text(props, 'copySuccessMessage', 'Haslo skopiowano do schowka.'),
                          ),
                        )
                        .catch(() =>
                          setCopyStatus(
                            text(props, 'copyErrorMessage', 'Nie udalo sie skopiowac hasla.'),
                          ),
                        );
                    } catch {
                      setCopyStatus(
                        text(props, 'copyErrorMessage', 'Nie udalo sie skopiowac hasla.'),
                      );
                    }
                  }}
                >
                  <Svg className="peaui-form-field-password__icon" name="copy" />
                </button>
              ) : null}
              {canCopyPassword ? (
                <span
                  aria-atomic="true"
                  aria-live="polite"
                  className="peaui-form-field-password__status"
                  role="status"
                >
                  {copyStatus}
                </span>
              ) : null}
            </div>
          ) : null}
          {input}
        </FormShell>
        {bool(props, 'enablePasswordStrengthMeter') ? (
          <div
            className="peaui-form-field-password__strength"
            data-has-supporting-message={
              Boolean(
                node(props, 'description') ||
                node(props, 'error') ||
                node(props, 'success') ||
                props.maxLength,
              ) || undefined
            }
            data-tone={passwordStrength.tone}
          >
            <span aria-hidden="true" className="peaui-form-field-password__strength-bar">
              {Array.from({ length: PASSWORD_STRENGTH_SEGMENTS }, (_, index) => index + 1).map(
                (segment) => (
                  <span
                    key={segment}
                    className="peaui-form-field-password__strength-segment"
                    data-active={segment <= passwordStrength.activeSegments || undefined}
                  />
                ),
              )}
            </span>
            <span className="peaui-form-field-password__strength-label">
              {passwordStrength.label}
            </span>
            <span
              aria-atomic="true"
              aria-live="polite"
              className="peaui-form-field-password__status"
              id={`${id}-strength-status`}
              role="status"
            >
              {passwordStrength.assistiveText}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <FormShell props={{ ...props, value }}>
      {input}
      {canErase && value !== undefined && value !== '' && !disabled ? (
        <button
          aria-label="Wyczyść pole"
          className="peaui-form-field__erase-button"
          style={{ '--right': `${eraseButtonRight}px` } as CSSProperties}
          type="button"
          onClick={() => {
            setValue(undefined);
            callback(props, 'onRemove')?.();
          }}
        >
          <Svg className="peaui-form-field__erase-icon" name="cross" />
        </button>
      ) : null}
    </FormShell>
  );
}

function ChoiceRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const [value, setValue] = useModel<unknown>(
    props,
    'value',
    kind === 'FormButtonCheckbox' || kind === 'FormCheckbox' ? false : undefined,
  );
  const id = text(props, 'id') || useId();
  if (kind === 'FormButtonGroup') {
    const options = asOptions(props.options);
    const selectedOption = options.find((option) => Object.is(value, option.value));
    return (
      <FormShell props={{ ...props, value: selectedOption?.label ?? '' }}>
        <input
          disabled={bool(props, 'disabled')}
          name={text(props, 'name')}
          type="hidden"
          value={String(value ?? '')}
        />
        <div className="peaui-form-button-group__layout">
          <div
            aria-disabled={bool(props, 'disabled')}
            aria-label={
              !text(props, 'label') ? text(props, 'ariaLabel') || text(props, 'name') : undefined
            }
            aria-labelledby={text(props, 'label') ? `label-${id}` : undefined}
            aria-orientation="horizontal"
            aria-readonly={bool(props, 'readonly') || undefined}
            className={cx(
              'peaui-form-field__element',
              'peaui-form-field__element--medium',
              bool(props, 'disabled') && 'peaui-form-field__element--disabled',
              bool(props, 'readonly') && 'peaui-form-field__element--readonly',
              !bool(props, 'readonly') && 'peaui-form-field__element--basic',
              'peaui-form-button-group',
              'peaui-form-button-group__group',
              bool(props, 'disabled') && 'peaui-form-button-group__group--disabled',
              bool(props, 'readonly') && 'peaui-form-button-group__group--readonly',
            )}
            ref={forwardedRef as ForwardedRef<HTMLDivElement>}
            role="radiogroup"
          >
            <div className="peaui-form-button-group__buttons">
              {options.map((option, index) => {
                const selected = Object.is(value, option.value);
                return (
                  <div key={String(option.value)} className="peaui-form-button-group__button-item">
                    <button
                      aria-checked={selected}
                      className={cx(
                        'peaui-form-button-group__button',
                        `peaui-form-button-group__button--size-${text(props, 'size', 'm')}`,
                        index === 0
                          ? 'peaui-form-button-group__button--first'
                          : 'peaui-form-button-group__button--not-first',
                        index === options.length - 1
                          ? 'peaui-form-button-group__button--last'
                          : undefined,
                        index > 0 &&
                          index < options.length - 1 &&
                          'peaui-form-button-group__button--middle',
                        selected && 'peaui-form-button-group__button--selected',
                        option.disabled && 'peaui-form-button-group__button--disabled',
                        bool(props, 'readonly') && 'peaui-form-button-group__button--readonly',
                      )}
                      disabled={bool(props, 'disabled') || option.disabled}
                      role="radio"
                      title={option.hint}
                      type="button"
                      onClick={() => !bool(props, 'readonly') && setValue(option.value)}
                    >
                      <span className="peaui-form-button-group__button-label">{option.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          {node(props, 'additionalHint') ? (
            <span className="peaui-form-button-group__additional-hint">
              <Svg className="peaui-form-button-group__additional-hint-icon" name="info" />
            </span>
          ) : null}
        </div>
      </FormShell>
    );
  }
  const radio = kind === 'FormRadio';
  const optionValue = props.optionValue;
  const checked = radio ? Object.is(value, optionValue) : value === true;
  const root =
    kind === 'FormButtonCheckbox'
      ? 'peaui-form-button-checkbox'
      : radio
        ? 'peaui-form-field-radio'
        : 'peaui-form-field-checkbox';
  const invalid = props.isValid === false;
  if (kind === 'FormButtonCheckbox') {
    const size = text(props, 'size', 'm');
    return (
      <div
        {...common(props)}
        className={cx(
          root,
          `${root}--size-${size}`,
          checked && `${root}--checked`,
          bool(props, 'disabled') && `${root}--disabled`,
          invalid && `${root}--invalid`,
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <input
          checked={checked}
          className={`${root}__element`}
          disabled={bool(props, 'disabled')}
          id={id}
          name={text(props, 'name')}
          type="checkbox"
          onChange={(event) => setValue(event.target.checked)}
        />
        <label
          className={cx(
            `${root}__label`,
            checked && `${root}__label--checked`,
            bool(props, 'disabled') && `${root}__label--disabled`,
            invalid && `${root}__label--invalid`,
          )}
          htmlFor={id}
        >
          <span
            aria-hidden="true"
            className={cx(
              `${root}__marker`,
              checked && `${root}__marker--checked`,
              bool(props, 'disabled') && `${root}__marker--disabled`,
              invalid && `${root}__marker--invalid`,
            )}
          />
          {props.children ? (
            <span className={cx(`${root}__text`, checked && `${root}__text--checked`)}>
              {props.children}
            </span>
          ) : null}
        </label>
      </div>
    );
  }
  return (
    <div
      {...common(props)}
      className={cx(
        root,
        props.children ? `${root}--with-slot` : `${root}--without-slot`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <input
        className={cx(
          `${root}__element`,
          checked && `${root}__element--checked`,
          bool(props, 'disabled') && `${root}__element--disabled`,
          invalid && `${root}__element--${radio ? 'invalid' : 'in-valid'}`,
        )}
        checked={checked}
        disabled={bool(props, 'disabled')}
        id={id}
        name={text(props, 'name')}
        required={bool(props, 'required')}
        type={radio ? 'radio' : 'checkbox'}
        value={radio ? String(optionValue ?? '') : undefined}
        onChange={(event) => setValue(radio ? optionValue : event.target.checked)}
      />
      {props.children ? (
        <label
          className={cx(
            `${root}__label`,
            checked && `${root}__label--checked`,
            !checked && `${root}__label--normal`,
            !radio && checked && `${root}__label--medium`,
            bool(props, 'disabled') && `${root}__label--disabled`,
            invalid && `${root}__label--${radio ? 'invalid' : 'in-valid'}`,
          )}
          htmlFor={id}
        >
          {props.children}
        </label>
      ) : null}
    </div>
  );
}

function SelectRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const multi = kind === 'FormMultiSelect';
  const [value, setValue] = useModel<unknown>(props, 'value', multi ? [] : '');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const options = asOptions(props.options);
  const selected = Array.isArray(value) ? value.map(String) : [String(value ?? '')];
  const id = text(props, 'id') || useId();
  const root = multi ? 'peaui-form-multiselect' : 'peaui-form-select';
  const searchable = bool(props, 'searchable');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase');
  const selectedOptions = options.filter((option) => selected.includes(String(option.value)));
  const filteredOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const displayValue = multi
    ? selectedOptions.map((option) => option.label).join(', ')
    : (selectedOptions[0]?.label ?? (typeof value === 'string' ? value : ''));
  const popoverRef = useNativePopover(open);
  const overlayerRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const anchorName = `--anchor-peaui-${id.replaceAll(':', '')}`;
  const setOpenWithLayout = (next: boolean): void => {
    if (next) setTriggerWidth(overlayerRef.current?.getBoundingClientRect().width ?? 0);
    setOpen(next);
  };
  const choose = (option: Option): void => {
    if (option.disabled || disabled || readonly) return;
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.some((item) => String(item) === String(option.value));
      setValue(
        exists
          ? current.filter((item) => String(item) !== String(option.value))
          : [...current, option.value],
      );
      return;
    }
    setValue(option.value);
    setOpenWithLayout(false);
    setQuery('');
  };
  const inputClasses = cx(
    'peaui-form-field__element',
    `${root}__input`,
    searchable ? `${root}__input--searchable` : `${root}__input--select-only`,
    displayValue ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
    disabled
      ? 'peaui-form-field__element--disabled'
      : readonly
        ? 'peaui-form-field__element--readonly'
        : 'peaui-form-field__element--basic',
    Boolean(node(props, 'error')) && 'peaui-form-field__element--error',
    Boolean(node(props, 'success')) && 'peaui-form-field__element--success',
  );
  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          !multi && `${root}--size-${text(props, 'size', 'm')}`,
          `${root}__overlayer`,
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          props.className,
        )}
        ref={overlayerRef}
        style={
          {
            ...props.style,
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
      >
        <FormShell
          props={{ ...props, className: undefined, iconAfter: 'arrow', style: undefined, value }}
        >
          <input
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-describedby={
              [text(props, 'aria-describedby'), node(props, 'error') ? `${id}-error` : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={Boolean(node(props, 'error')) || text(props, 'aria-invalid') === 'true'}
            aria-label={
              !text(props, 'label') ? text(props, 'ariaLabel') || text(props, 'name') : undefined
            }
            autoCapitalize="off"
            autoComplete="off"
            className={inputClasses}
            data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
            data-type={multi ? 'multiselect' : 'select'}
            disabled={disabled}
            id={id}
            name={text(props, 'name')}
            placeholder={text(props, 'placeholder', 'wybierz/wyszukaj')}
            readOnly={readonly || !searchable}
            ref={forwardedRef as ForwardedRef<HTMLInputElement>}
            role="combobox"
            spellCheck={false}
            style={
              {
                '--pl': '12px',
                '--pr': `${getFormFieldPaddingRight({ canErase, iconAfter: 'arrow' })}px`,
                [`--${root}-input-padding-right`]: `${getFormFieldPaddingRight({
                  canErase,
                  iconAfter: 'arrow',
                })}px`,
              } as CSSProperties
            }
            value={open && searchable ? query : displayValue}
            onChange={(event) => {
              if (!searchable) return;
              setQuery(event.target.value);
              setOpenWithLayout(true);
            }}
            onClick={() => !readonly && setOpenWithLayout(searchable ? true : !open)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpenWithLayout(false);
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (!readonly) setOpenWithLayout(true);
              }
            }}
          />
          {canErase && selected.some(Boolean) && !disabled ? (
            <button
              aria-label="Wyczyść wybór"
              className="peaui-form-field__erase-button"
              style={{ '--right': '44px' } as CSSProperties}
              type="button"
              onClick={() => {
                setValue(multi ? [] : undefined);
                setQuery('');
                callback(props, 'onRemove')?.();
              }}
            >
              <Svg className="peaui-form-field__erase-icon" name="cross" />
            </button>
          ) : null}
        </FormShell>
      </div>
      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${text(props, 'placement', 'bottom')}`,
          `${root}__popover-content`,
          'peaui-popover-overlayer__content--match-trigger-width',
        )}
        id={`popover-${id}`}
        popover={getNativePopoverValue()}
        ref={popoverRef}
        style={
          {
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && open) setOpen(false);
        }}
      >
        <div className={`${root}__panel`}>
          {multi && bool(props, 'withSelectAll') ? (
            <button
              aria-pressed={selected.length === options.length}
              className={`${root}__action`}
              type="button"
              onClick={() =>
                setValue(
                  selected.length === options.length
                    ? []
                    : options.filter((option) => !option.disabled).map((option) => option.value),
                )
              }
            >
              {selected.length === options.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
            </button>
          ) : null}
          <ul
            aria-labelledby={text(props, 'label') ? `label-${id}` : undefined}
            aria-multiselectable={multi || undefined}
            className={`${root}__listbox`}
            id={`${id}-listbox`}
            role="listbox"
            tabIndex={-1}
          >
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(String(option.value));
              return (
                <li
                  key={option.id ?? String(option.value)}
                  aria-disabled={option.disabled || undefined}
                  aria-selected={isSelected}
                  className={cx(
                    `${root}__option`,
                    option.icon && `${root}__option--with-icon`,
                    option.hint && `${root}__option--with-hint`,
                    option.disabled && `${root}__option--disabled`,
                    isSelected && `${root}__option--selected`,
                  )}
                  role="option"
                  onClick={() => choose(option)}
                >
                  {multi ? <span aria-hidden="true" className={`${root}__option-marker`} /> : null}
                  {option.icon ? (
                    <Svg className={`${root}__option-icon`} name={option.icon} />
                  ) : null}
                  <span className={`${root}__option-label`}>{option.label}</span>
                  {option.hint ? (
                    <span className={`${root}__option-hint`} title={option.hint}>
                      <i aria-hidden="true" className={`${root}__option-hint-trigger`}>
                        i
                      </i>
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {filteredOptions.length === 0 ? (
            <p className={`${root}__empty`} role="status">
              Brak pasujących opcji
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function DateRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const range = bool(props, 'range');
  const [value, setValue] = useModel<unknown>(props, 'value', undefined);
  const root = kind === 'FormYearPicker' ? 'peaui-form-year-picker' : 'peaui-form-date-picker';
  const [open, setOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'day' | 'month' | 'year'>('day');
  const [pendingRangeStart, setPendingRangeStart] = useState<string | number>();
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase', true);
  const [viewDate, setViewDate] = useState(() => {
    if (kind === 'FormYearPicker' && typeof props.value === 'number') {
      return new Date(props.value, 0, 1);
    }
    if (typeof props.value === 'string') {
      const parsed = new Date(props.value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });
  const selectedRecord =
    !Array.isArray(value) && typeof value === 'object' && value !== null
      ? (value as RuntimeProps)
      : undefined;
  const selectedRange = Array.isArray(value)
    ? value.slice(0, 2).filter((item) => typeof item === 'string' || typeof item === 'number')
    : [
        selectedRecord?.from ?? selectedRecord?.start,
        selectedRecord?.to ?? selectedRecord?.end,
      ].filter((item) => typeof item === 'string' || typeof item === 'number');
  const normalized = range
    ? pendingRangeStart !== undefined && open
      ? `${pendingRangeStart} - `
      : selectedRange.join(' - ')
    : typeof value === 'string' || typeof value === 'number'
      ? String(value)
      : '';
  const selectValue = (next: string | number): void => {
    if (!range) {
      setValue(next);
      setOpen(false);
      return;
    }
    if (pendingRangeStart === undefined) {
      setPendingRangeStart(next);
      return;
    }
    const ordered = [pendingRangeStart, next].sort((left, right) =>
      String(left).localeCompare(String(right)),
    );
    setValue(ordered);
    setPendingRangeStart(undefined);
    setOpen(false);
  };
  const currentYear = viewDate.getFullYear();
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const firstDayOffset = (new Date(currentYear, viewDate.getMonth(), 1).getDay() + 6) % 7;
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(currentYear, viewDate.getMonth(), index - firstDayOffset + 1);
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`,
      day: date.getDate(),
      outsideMonth: date.getMonth() !== viewDate.getMonth(),
    };
  });
  const popoverRef = useNativePopover(open);
  const overlayerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusPanelOnOpen = useRef(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const id = text(props, 'id') || useId();
  const anchorName = `--anchor-peaui-${id.replaceAll(':', '')}`;
  const minYear = Number.isFinite(Number(props.minYear)) ? Number(props.minYear) : undefined;
  const maxYear = Number.isFinite(Number(props.maxYear)) ? Number(props.maxYear) : undefined;
  const rawMinDate = text(props, 'minDate') || text(props, 'min');
  const rawMaxDate = text(props, 'maxDate') || text(props, 'max');
  const minDate = rawMinDate && /^\d{4}-\d{2}-\d{2}$/.test(rawMinDate) ? rawMinDate : undefined;
  const maxDate = rawMaxDate && /^\d{4}-\d{2}-\d{2}$/.test(rawMaxDate) ? rawMaxDate : undefined;
  const isOptionDisabled = (next: string | number): boolean => {
    if (kind === 'FormYearPicker') {
      const year = Number(next);
      return (minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear);
    }
    const date = String(next);
    return (minDate !== undefined && date < minDate) || (maxDate !== undefined && date > maxDate);
  };
  const isRangeEndpoint = (next: string | number): boolean =>
    pendingRangeStart === next || selectedRange.some((entry) => String(entry) === String(next));
  const isInSelectedRange = (next: string | number): boolean => {
    const bounds =
      pendingRangeStart !== undefined
        ? [pendingRangeStart, next]
        : selectedRange.length === 2
          ? selectedRange
          : [];
    if (bounds.length !== 2) return false;
    const ordered = bounds.map(String).sort((left, right) => left.localeCompare(right));
    const comparable = String(next);
    return comparable >= (ordered[0] ?? '') && comparable <= (ordered[1] ?? '');
  };
  const isToday = (date: string): boolean => {
    const now = new Date();
    return (
      date ===
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
      ).padStart(2, '0')}`
    );
  };
  const setOpenWithLayout = (next: boolean, focusPanel = false): void => {
    if (next) setTriggerWidth(overlayerRef.current?.getBoundingClientRect().width ?? 0);
    focusPanelOnOpen.current = next && focusPanel;
    if (!next) setPendingRangeStart(undefined);
    setOpen(next);
  };
  const handleGridKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    columns: number,
  ): void => {
    const buttons = Array.from(
      popoverRef.current?.querySelectorAll<HTMLButtonElement>('[data-picker-option]') ?? [],
    );
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex += 1;
    else if (event.key === 'ArrowLeft') nextIndex -= 1;
    else if (event.key === 'ArrowDown') nextIndex += columns;
    else if (event.key === 'ArrowUp') nextIndex -= columns;
    else if (event.key === 'Home') nextIndex -= currentIndex % columns;
    else if (event.key === 'End') nextIndex += columns - 1 - (currentIndex % columns);
    else if (event.key === 'Escape') {
      event.preventDefault();
      setOpenWithLayout(false);
      inputRef.current?.focus();
      return;
    } else return;
    event.preventDefault();
    const direction = nextIndex >= currentIndex ? 1 : -1;
    nextIndex = Math.max(0, Math.min(buttons.length - 1, nextIndex));
    while (buttons[nextIndex]?.disabled && nextIndex >= 0 && nextIndex < buttons.length) {
      nextIndex += direction;
    }
    buttons[Math.max(0, Math.min(buttons.length - 1, nextIndex))]?.focus();
  };
  useEffect(() => {
    if (!open || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    const options = Array.from(
      popoverRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-picker-option]:not(:disabled)',
      ) ?? [],
    );
    const selected = options.find((option) => option.dataset.selected === 'true');
    (selected ?? options[0])?.focus();
  }, [calendarView, open, popoverRef]);
  const pickerButtonRoot = `${root}-button`;
  const navigationRoot = `${root}-navigation`;
  const monthLabels = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
  ];
  const monthAriaLabels = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];
  const panelLabel =
    calendarView === 'month'
      ? `Wybierz miesiąc dla roku ${currentYear}`
      : calendarView === 'year'
        ? `Wybierz rok z zakresu ${decadeStart} - ${decadeStart + 9}`
        : `Wybierz datę w miesiącu ${monthAriaLabels[viewDate.getMonth()]} ${currentYear}`;
  const navigatePicker = (direction: -1 | 1): void => {
    setViewDate((current) => {
      if (calendarView === 'year') {
        return new Date(current.getFullYear() + direction * 10, current.getMonth(), 1);
      }
      if (calendarView === 'month') {
        return new Date(current.getFullYear() + direction, current.getMonth(), 1);
      }
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  };
  const showCalendarView = (view: 'day' | 'month' | 'year'): void => {
    focusPanelOnOpen.current = true;
    setCalendarView(view);
  };
  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          range && `${root}--range`,
          `${root}__overlayer`,
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          props.className,
        )}
        ref={overlayerRef}
        style={
          {
            ...props.style,
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
      >
        <FormShell
          props={{
            ...props,
            className: undefined,
            iconAfter: 'calendar',
            id,
            style: undefined,
            value,
          }}
        >
          <input
            aria-autocomplete="none"
            aria-controls={`${id}-dialog`}
            aria-describedby={
              node(props, 'error')
                ? `${id}-error`
                : node(props, 'success')
                  ? `${id}-success`
                  : node(props, 'description')
                    ? `${id}-description`
                    : text(props, 'aria-describedby') || undefined
            }
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={Boolean(node(props, 'error')) || undefined}
            aria-label={
              text(props, 'ariaLabel') ||
              text(props, 'aria-label') ||
              (!text(props, 'label') ? text(props, 'name') : undefined)
            }
            aria-labelledby={
              text(props, 'aria-labelledby') || (text(props, 'label') ? `label-${id}` : undefined)
            }
            aria-readonly="true"
            className={cx(
              'peaui-form-field__element',
              normalized
                ? 'peaui-form-field__element--medium'
                : 'peaui-form-field__element--normal',
              disabled && 'peaui-form-field__element--disabled',
              readonly && 'peaui-form-field__element--readonly',
              !readonly && 'peaui-form-field__element--basic',
              `${root}__input`,
              !disabled && !readonly && `${root}__input--interactive`,
            )}
            data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
            data-type={kind === 'FormYearPicker' ? 'year-picker' : 'date-picker'}
            disabled={disabled}
            id={id}
            inputMode="none"
            name={text(props, 'name')}
            placeholder={text(
              props,
              'placeholder',
              kind === 'FormYearPicker' ? 'wybierz rok' : 'wybierz date',
            )}
            readOnly
            ref={(element) => {
              inputRef.current = element;
              if (typeof forwardedRef === 'function') forwardedRef(element);
              else if (forwardedRef) forwardedRef.current = element;
            }}
            role="combobox"
            style={
              {
                '--pl': '12px',
                '--pr': `${getFormFieldPaddingRight({ canErase, iconAfter: 'calendar' })}px`,
              } as CSSProperties
            }
            type="text"
            value={normalized}
            onClick={() => {
              if (readonly) return;
              setCalendarView('day');
              setOpenWithLayout(!open);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpenWithLayout(false);
                inputRef.current?.focus();
              }
              if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                if (!readonly) {
                  setCalendarView('day');
                  setOpenWithLayout(true, true);
                }
              }
            }}
          />
          {canErase && value && !disabled ? (
            <button
              aria-label="Usuń wartość pola"
              className="peaui-form-field__erase-button"
              style={{ '--right': '44px' } as CSSProperties}
              type="button"
              onClick={() => {
                setValue(undefined);
                callback(props, 'onRemove')?.();
              }}
            >
              <Svg className="peaui-form-field__erase-icon" name="cross" />
            </button>
          ) : null}
        </FormShell>
      </div>
      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${text(props, 'placement', 'bottom')}`,
          `${root}__popover-content`,
          'peaui-popover-overlayer__content--match-trigger-width',
        )}
        id={`popover-${id}`}
        popover={getNativePopoverValue()}
        ref={popoverRef}
        style={
          {
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && open) setOpen(false);
        }}
      >
        <div
          aria-labelledby={kind === 'FormYearPicker' ? `${id}-range-label` : `${id}-dialog-label`}
          aria-modal="false"
          className={`${root}__panel`}
          id={`${id}-dialog`}
          role="dialog"
        >
          {kind === 'FormYearPicker' ? (
            <>
              <div className={`${root}__header`}>
                <p aria-live="polite" className={`${root}__range`} id={`${id}-range-label`}>
                  {decadeStart} - {decadeStart + 9}
                </p>
                <div className={navigationRoot}>
                  <button
                    aria-label="Poprzednie 10 lat"
                    className={`${navigationRoot}__button`}
                    disabled={minYear !== undefined && decadeStart <= Math.floor(minYear / 10) * 10}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear() - 10, current.getMonth(), 1),
                      )
                    }
                  >
                    <Svg
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--previous`}
                      name="arrow"
                    />
                  </button>
                  <button
                    aria-label="Następne 10 lat"
                    className={`${navigationRoot}__button`}
                    disabled={maxYear !== undefined && decadeStart + 9 >= maxYear}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear() + 10, current.getMonth(), 1),
                      )
                    }
                  >
                    <Svg
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--next`}
                      name="arrow"
                    />
                  </button>
                </div>
              </div>
              <div
                aria-labelledby={`${id}-range-label`}
                className={`${root}__grid`}
                id={`${id}-grid`}
                role="grid"
              >
                {Array.from({ length: 4 }, (_, rowIndex) => (
                  <div className={`${root}__row`} key={rowIndex} role="row">
                    {Array.from({ length: 10 }, (_, index) => decadeStart + index)
                      .slice(rowIndex * 3, rowIndex * 3 + 3)
                      .map((year) => {
                        const optionDisabled = isOptionDisabled(year);
                        const endpoint = isRangeEndpoint(year);
                        const inRange = range && isInSelectedRange(year);
                        const selected = range ? endpoint || inRange : Number(value) === year;
                        const variant =
                          endpoint || (!range && selected)
                            ? 'primary'
                            : inRange || year === new Date().getFullYear()
                              ? 'outline'
                              : 'ghost';
                        return (
                          <div
                            aria-disabled={optionDisabled || undefined}
                            aria-selected={selected}
                            className={`${root}__cell`}
                            key={year}
                            role="gridcell"
                          >
                            <button
                              aria-current={year === new Date().getFullYear() ? 'date' : undefined}
                              aria-label={`Wybierz rok ${year}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${variant}`,
                                optionDisabled && `${pickerButtonRoot}--disabled`,
                              )}
                              data-picker-option=""
                              data-selected={selected ? 'true' : undefined}
                              data-testid={
                                dataTest(props) ? `${dataTest(props)}-year-${year}` : undefined
                              }
                              disabled={optionDisabled}
                              id={`${id}-year-${year}`}
                              tabIndex={selected || (!value && year === currentYear) ? 0 : -1}
                              type="button"
                              onClick={() => selectValue(year)}
                              onKeyDown={(event) => handleGridKeyDown(event, 3)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>{year}</span>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`${root}__sr-only`} id={`${id}-dialog-label`}>
                {panelLabel}
              </p>
              <div className={`${root}__header`}>
                <div className={`${root}__heading`}>
                  {calendarView === 'day' ? (
                    <>
                      <button
                        aria-label={`Wybierz miesiąc, obecnie ${monthLabels[viewDate.getMonth()]}`}
                        className={`${root}__heading-trigger`}
                        type="button"
                        onClick={() => showCalendarView('month')}
                      >
                        {monthLabels[viewDate.getMonth()]}
                      </button>
                      <button
                        aria-label={`Wybierz rok, obecnie ${currentYear}`}
                        className={`${root}__heading-trigger`}
                        type="button"
                        onClick={() => showCalendarView('year')}
                      >
                        {currentYear}
                      </button>
                    </>
                  ) : calendarView === 'month' ? (
                    <button
                      aria-label={`Wybierz rok, obecnie ${currentYear}`}
                      className={`${root}__heading-trigger`}
                      type="button"
                      onClick={() => showCalendarView('year')}
                    >
                      {currentYear}
                    </button>
                  ) : (
                    <p className={`${root}__heading-label`}>
                      {decadeStart} - {decadeStart + 9}
                    </p>
                  )}
                </div>
                <div className={navigationRoot}>
                  <button
                    aria-label={
                      calendarView === 'year'
                        ? 'Poprzednie 10 lat'
                        : calendarView === 'month'
                          ? 'Poprzedni rok'
                          : 'Poprzedni miesiąc'
                    }
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() => navigatePicker(-1)}
                  >
                    <Svg
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--previous`}
                      name="arrow"
                    />
                  </button>
                  <button
                    aria-label={
                      calendarView === 'year'
                        ? 'Następne 10 lat'
                        : calendarView === 'month'
                          ? 'Następny rok'
                          : 'Następny miesiąc'
                    }
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() => navigatePicker(1)}
                  >
                    <Svg
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--next`}
                      name="arrow"
                    />
                  </button>
                </div>
              </div>
              {calendarView === 'day' ? (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--day`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  <div className={`${root}__weekday-row`} role="row">
                    {[
                      ['Pon', 'Poniedziałek'],
                      ['Wt', 'Wtorek'],
                      ['Śr', 'Środa'],
                      ['Czw', 'Czwartek'],
                      ['Pt', 'Piątek'],
                      ['Sob', 'Sobota'],
                      ['Nd', 'Niedziela'],
                    ].map(([short, full]) => (
                      <div
                        aria-label={full}
                        className={`${root}__weekday`}
                        key={short}
                        role="columnheader"
                      >
                        {short}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 6 }, (_, rowIndex) => (
                    <div
                      className={`${root}__row ${root}__row--day`}
                      key={`day-row-${rowIndex}`}
                      role="row"
                    >
                      {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((calendarDay) => {
                        const optionDisabled = isOptionDisabled(calendarDay.date);
                        const endpoint = isRangeEndpoint(calendarDay.date);
                        const inRange = range && isInSelectedRange(calendarDay.date);
                        const selected = range
                          ? endpoint || inRange
                          : String(value) === calendarDay.date;
                        const current = isToday(calendarDay.date);
                        const variant =
                          endpoint || (!range && selected)
                            ? 'primary'
                            : inRange || current
                              ? 'outline'
                              : 'ghost';
                        return (
                          <div
                            aria-disabled={optionDisabled || undefined}
                            aria-selected={selected}
                            className={`${root}__cell`}
                            key={calendarDay.date}
                            role="gridcell"
                          >
                            <button
                              aria-current={current ? 'date' : undefined}
                              aria-label={`Wybierz date ${calendarDay.day} ${
                                monthAriaLabels[Number(calendarDay.date.slice(5, 7)) - 1]
                              } ${calendarDay.date.slice(0, 4)}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${variant}`,
                                optionDisabled && `${pickerButtonRoot}--disabled`,
                                calendarDay.outsideMonth && `${root}__picker-button--outside-month`,
                              )}
                              data-picker-option=""
                              data-selected={endpoint || (!range && selected) ? 'true' : undefined}
                              data-testid={
                                dataTest(props)
                                  ? `${dataTest(props)}-day-${calendarDay.date}`
                                  : undefined
                              }
                              disabled={optionDisabled}
                              id={`${id}-day-${calendarDay.date}`}
                              tabIndex={
                                endpoint ||
                                (!range && selected) ||
                                (!value && !calendarDay.outsideMonth && calendarDay.day === 1)
                                  ? 0
                                  : -1
                              }
                              type="button"
                              onClick={() => selectValue(calendarDay.date)}
                              onKeyDown={(event) => handleGridKeyDown(event, 7)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>
                                {calendarDay.day}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : calendarView === 'month' ? (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--period`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  {Array.from({ length: 4 }, (_, rowIndex) => (
                    <div className={`${root}__row ${root}__row--period`} key={rowIndex} role="row">
                      {monthLabels.slice(rowIndex * 3, rowIndex * 3 + 3).map((month, index) => {
                        const monthIndex = rowIndex * 3 + index;
                        const active = monthIndex === viewDate.getMonth();
                        return (
                          <div
                            aria-selected={active}
                            className={`${root}__cell`}
                            key={month}
                            role="gridcell"
                          >
                            <button
                              aria-label={`Wybierz miesiąc ${month}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${active ? 'primary' : 'ghost'}`,
                              )}
                              data-picker-option=""
                              data-selected={active ? 'true' : undefined}
                              tabIndex={active ? 0 : -1}
                              type="button"
                              onClick={() => {
                                setViewDate(new Date(currentYear, monthIndex, 1));
                                showCalendarView('day');
                              }}
                              onKeyDown={(event) => handleGridKeyDown(event, 3)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>{month}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--period`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  {Array.from({ length: 4 }, (_, rowIndex) => (
                    <div className={`${root}__row ${root}__row--period`} key={rowIndex} role="row">
                      {Array.from({ length: 10 }, (_, index) => decadeStart + index)
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((year) => {
                          const active = year === currentYear;
                          return (
                            <div
                              aria-selected={active}
                              className={`${root}__cell`}
                              key={year}
                              role="gridcell"
                            >
                              <button
                                aria-label={`Wybierz rok ${year}`}
                                className={cx(
                                  pickerButtonRoot,
                                  `${pickerButtonRoot}--variant-${active ? 'primary' : 'ghost'}`,
                                )}
                                data-picker-option=""
                                data-selected={active ? 'true' : undefined}
                                tabIndex={active ? 0 : -1}
                                type="button"
                                onClick={() => {
                                  setViewDate(new Date(year, viewDate.getMonth(), 1));
                                  showCalendarView('month');
                                }}
                                onKeyDown={(event) => handleGridKeyDown(event, 3)}
                              >
                                <span className={`${pickerButtonRoot}__label`}>{year}</span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FileRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const simple = text(props, '__name') === 'FormFileUploadSimple';
  const modelName = simple ? 'files' : 'file';
  const [value, setValue] = useModel<unknown>(props, modelName, simple ? [] : undefined);
  const files = Array.isArray(value)
    ? value.filter((entry): entry is File => entry instanceof File)
    : value instanceof File
      ? [value]
      : [];
  const defaultTypes = simple
    ? [
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ]
    : ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedTypes = Array.isArray(props.allowedTypes) ? props.allowedTypes : defaultTypes;
  const accept = allowedTypes.join(',');
  const maxFileSize = num(props, 'maxFileSize', 5 * 1024 * 1024);
  const maxFiles = num(props, 'maxFiles', 4);
  const selectedFile = files[0];
  const [previewUrl, setPreviewUrl] = useState('');
  useEffect(() => {
    if (!selectedFile || typeof URL.createObjectURL !== 'function') {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);
  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const amount = bytes / 1024 ** index;
    const fractionDigits = simple ? (index > 0 ? 2 : 0) : amount >= 10 || index === 0 ? 0 : 1;
    return `${amount.toFixed(fractionDigits)} ${units[index]}`;
  };
  const typeLabels: Record<string, string> = {
    'application/msword': 'DOC',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
  };
  const updateFiles = (next: File[]): void => {
    const valid = next.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxFileSize,
    );
    setValue(simple ? [...files, ...valid].slice(0, maxFiles) : valid[0]);
  };
  if (simple)
    return (
      <div
        {...common(props)}
        aria-live="polite"
        className={cx('peaui-form-file-upload-simple', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <div className="peaui-form-file-upload-simple__upload">
          <input
            accept={accept}
            aria-label="Wgraj pliki"
            className="peaui-form-file-upload-simple__input"
            disabled={bool(props, 'disabled')}
            multiple
            type="file"
            onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
          />
          <Svg className="peaui-form-file-upload-simple__icon" name="download" />
          <div className="peaui-form-file-upload-simple__content">
            <p className="peaui-form-file-upload-simple__title">
              Przeciagnij i upusc plik tutaj lub przeslij
            </p>
            <p className="peaui-form-file-upload-simple__description">
              Format pliku:{' '}
              {allowedTypes.map((type, index) => (
                <span key={type} className="peaui-form-file-upload-simple__type">
                  {typeLabels[type] ?? type}
                  {index < allowedTypes.length - 1 ? ',' : ''}
                </span>
              ))}
              <br />
              Rozmiar pliku: maksimum {formatBytes(maxFileSize)}
            </p>
          </div>
          <button
            aria-hidden="true"
            className="peaui-form-file-upload-simple__button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary"
            disabled={bool(props, 'disabled')}
            tabIndex={-1}
            type="button"
          >
            Wgraj
          </button>
        </div>
        {files.map((file) => (
          <div
            key={`${file.name}-${file.lastModified}`}
            aria-atomic="true"
            className="peaui-form-file-upload-simple__item"
            role="status"
          >
            <Svg className="peaui-form-file-upload-simple__item-icon" name="file" />
            <div className="peaui-form-file-upload-simple__item-body">
              <div className="peaui-form-file-upload-simple__item-text">
                <span className="peaui-form-file-upload-simple__item-name">{file.name}</span>
                <br />
                {formatBytes(file.size)}
              </div>
              <div>
                <button
                  aria-label={`Usuń ${file.name}`}
                  className="peaui-form-file-upload-simple__remove"
                  type="button"
                  onClick={() => {
                    const next = files.filter((item) => item !== file);
                    setValue(next);
                    callback(props, 'onRemove')?.(file);
                  }}
                >
                  <Svg className="peaui-form-file-upload-simple__remove-icon" name="trash" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  const variant = text(props, 'variant', 'primary');
  return (
    <div
      {...common(props)}
      className={cx('peaui-form-file-upload', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <div
        className={cx(
          'peaui-form-file-upload__surface',
          `peaui-form-file-upload__surface--${variant}`,
        )}
      >
        {!selectedFile ? (
          <div className="peaui-form-file-upload__dropzone" role="group">
            <Svg
              className={cx(
                'peaui-form-file-upload__dropzone-icon',
                `peaui-form-file-upload__dropzone-icon--${variant}`,
              )}
              name={variant === 'primary' ? 'imageUpload' : 'help'}
            />
            {variant === 'danger' ? (
              <p className="peaui-form-file-upload__message" role="status">
                To pole jest wymagane
              </p>
            ) : null}
            <div className="peaui-form-file-upload__actions">
              <button
                aria-hidden="true"
                className="peaui-form-file-upload__button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary"
                disabled={bool(props, 'disabled')}
                tabIndex={-1}
                type="button"
              >
                Wybierz zdjecie z dysku
              </button>
              <p className="peaui-form-file-upload__actions-text">lub przeciagnij i upusc tutaj</p>
            </div>
            <p className="peaui-form-file-upload__description">
              <span className="peaui-form-file-upload__description-line">
                Format zdjecia: JPEG, JPG lub PNG
              </span>
              <span className="peaui-form-file-upload__description-line">
                Rozmiar zdjecia: maksimum {formatBytes(maxFileSize)}
              </span>
            </p>
            {!bool(props, 'disabled') ? (
              <input
                accept={accept}
                aria-label="Wybierz zdjecie z dysku"
                className="peaui-form-file-upload__input"
                type="file"
                onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
              />
            ) : null}
          </div>
        ) : (
          <div className="peaui-form-file-upload__preview">
            {previewUrl ? (
              <img
                alt={selectedFile.name}
                className="peaui-form-file-upload__image"
                src={previewUrl}
              />
            ) : null}
          </div>
        )}
      </div>
      {selectedFile ? (
        <div className="peaui-form-file-upload__details">
          <div className="peaui-form-file-upload__details-main">
            <Svg className="peaui-form-file-upload__details-icon" name="picture" />
            <div className="peaui-form-file-upload__details-text">
              <p className="peaui-form-file-upload__details-name">{selectedFile.name}</p>
              <p className="peaui-form-file-upload__details-size">
                {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>
          {!bool(props, 'disabled') ? (
            <button
              aria-label={`Usuń ${selectedFile.name}`}
              className="peaui-form-file-upload__remove"
              type="button"
              onClick={() => {
                setValue(undefined);
                callback(props, 'onRemove')?.(selectedFile);
              }}
            >
              <Svg className="peaui-form-file-upload__remove-icon" name="trash" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function serializeSwitchFormValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (['number', 'boolean', 'bigint'].includes(typeof value)) return String(value);

  try {
    const serialized: unknown = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : String(value);
  } catch {
    return String(value);
  }
}

function ToggleButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-toggle-button-${generatedId}`;
  const [pressed, setPressed] = useModel<boolean>(props, 'value', false);
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const readonly = bool(props, 'readonly');
  const nativelyDisabled = disabled || loading;
  const blocked = nativelyDisabled || readonly;
  const content = text(props, 'content', 'icon-text');
  const label = text(props, 'label', 'Przełącz');
  const pressedLabel = text(props, 'pressedLabel');
  const visibleLabel = pressed && pressedLabel ? pressedLabel : label;
  const icon = text(props, 'icon');
  const pressedIcon = text(props, 'pressedIcon');
  const resolvedIcon = pressed && pressedIcon ? pressedIcon : icon;
  const iconContent = pressed
    ? (node(props, 'pressedIconContent') ?? node(props, 'iconContent'))
    : node(props, 'iconContent');
  const showsText = content !== 'icon';
  const showsIcon = content !== 'text';
  const externalAriaLabel = text(props, 'aria-label');
  const externalAriaLabelledBy = text(props, 'aria-labelledby');
  const canUseVisibleChildrenName =
    content !== 'icon' && !pressedLabel && !label && hasVisibleReactText(props.children);
  const loadingId = `${id}-loading`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (loading) describedBy.add(loadingId);
  const dataTestId = dataTest(props);

  return (
    <button
      aria-busy={loading || undefined}
      aria-describedby={describedBy.size > 0 ? [...describedBy].join(' ') : undefined}
      aria-disabled={blocked || undefined}
      aria-label={
        externalAriaLabelledBy
          ? undefined
          : externalAriaLabel ||
            text(props, 'ariaLabel') ||
            label ||
            (canUseVisibleChildrenName ? undefined : 'Przełącznik')
      }
      aria-labelledby={externalAriaLabelledBy || undefined}
      aria-pressed={pressed}
      className={cx(
        'peaui-toggle-button',
        `peaui-toggle-button--content-${content}`,
        `peaui-toggle-button--size-${text(props, 'size', 'm')}`,
        `peaui-toggle-button--variant-${text(props, 'variant', 'default')}`,
        pressed && 'peaui-toggle-button--pressed',
        bool(props, 'allowWrap') && 'peaui-toggle-button--wrap',
        disabled && 'peaui-toggle-button--disabled',
        readonly && 'peaui-toggle-button--readonly',
        loading && 'peaui-toggle-button--loading',
        props.className,
      )}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-pressed={pressed}
      data-readonly={readonly || undefined}
      data-testid={dataTestId}
      disabled={nativelyDisabled}
      id={id}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      style={props.style}
      tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : undefined}
      type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }

        const nextValue = !pressed;
        setPressed(nextValue);
        callback(props, 'onChange')?.(nextValue, event);
        callback(props, 'onClick')?.(event);
      }}
      onKeyDown={
        typeof props.onKeyDown === 'function'
          ? (props.onKeyDown as KeyboardEventHandler<HTMLButtonElement>)
          : undefined
      }
      onFocus={
        typeof props.onFocus === 'function'
          ? (props.onFocus as FocusEventHandler<HTMLButtonElement>)
          : undefined
      }
      onBlur={
        typeof props.onBlur === 'function'
          ? (props.onBlur as FocusEventHandler<HTMLButtonElement>)
          : undefined
      }
      onPointerDown={
        typeof props.onPointerDown === 'function'
          ? (props.onPointerDown as PointerEventHandler<HTMLButtonElement>)
          : undefined
      }
    >
      {loading ? (
        <span aria-hidden="true" className="peaui-toggle-button__spinner" />
      ) : showsIcon ? (
        <span aria-hidden="true" className="peaui-toggle-button__icon">
          {iconContent ?? (resolvedIcon ? <Svg name={resolvedIcon} /> : null)}
        </span>
      ) : null}
      {showsText ? (
        <span className="peaui-toggle-button__label">{props.children ?? visibleLabel}</span>
      ) : null}
      {loading ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="peaui-toggle-button__loading-status"
          id={loadingId}
          role="status"
        >
          {text(props, 'loadingLabel', 'Trwa aktualizowanie ustawienia')}
        </span>
      ) : null}
    </button>
  );
}

type ReactToggleGroupItem = {
  value: ToggleGroupValue;
  label: string;
  ariaLabel?: string;
  pressedLabel?: string;
  icon?: string;
  pressedIcon?: string;
  content?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  metadata?: unknown;
};

function asToggleGroupItems(value: unknown): ReactToggleGroupItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ReactToggleGroupItem[] => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.value !== 'string' && typeof item.value !== 'number') return [];
    if (typeof item.label !== 'string') return [];
    return [
      {
        value: item.value,
        label: item.label,
        ariaLabel: typeof item.ariaLabel === 'string' ? item.ariaLabel : undefined,
        pressedLabel: typeof item.pressedLabel === 'string' ? item.pressedLabel : undefined,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        pressedIcon: typeof item.pressedIcon === 'string' ? item.pressedIcon : undefined,
        content: typeof item.content === 'string' ? item.content : undefined,
        disabled: item.disabled === true,
        readonly: item.readonly === true,
        loading: item.loading === true,
        metadata: item.metadata,
      },
    ];
  });
}

function ToggleGroupRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-toggle-group-${generatedId}`;
  const items = useMemo(() => asToggleGroupItems(props.items), [props.items]);
  const type = text(props, 'type', 'single') as 'single' | 'multiple';
  const orientation = text(props, 'orientation', 'horizontal') as 'horizontal' | 'vertical';
  const appearance = text(props, 'appearance', 'separate');
  const size = text(props, 'size', 'm');
  const variant = text(props, 'variant', 'outline');
  const overflow = text(props, 'overflow', 'wrap');
  const semanticRole = text(props, 'semanticRole', 'toolbar') as 'toolbar' | 'group';
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const required = bool(props, 'required');
  const allowEmpty = props.allowEmpty !== false;
  const loop = props.loop !== false;
  const [modelValue, setModelValue] = useModel<unknown>(
    props,
    'value',
    type === 'multiple' ? [] : null,
  );
  const selectedValues = normalizeToggleGroupSelection(type, modelValue);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLElement | null>>([]);
  const lastActiveIndex = useRef(0);
  const focusWithin = useRef(false);
  const initialActiveValue = (): ToggleGroupValue | null => {
    const selectedIndex = items.findIndex(
      (item) =>
        selectedValues.some((value) => Object.is(value, item.value)) &&
        isToggleGroupItemAvailable(item),
    );
    const index = selectedIndex >= 0 ? selectedIndex : findToggleGroupEdgeIndex(items, 'first');
    return items[index]?.value ?? null;
  };
  const [activeValue, setActiveValue] = useState<ToggleGroupValue | null>(initialActiveValue);
  const activeIndex = items.findIndex(
    (item) => Object.is(item.value, activeValue) && isToggleGroupItemAvailable(item),
  );
  const validationMessage =
    text(props, 'error') ||
    (required && selectedValues.length === 0
      ? text(props, 'requiredMessage', 'Wybierz co najmniej jedną opcję.')
      : '');
  const label = text(props, 'label');
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (validationMessage) describedBy.add(errorId);
  const externalLabelledBy = text(props, 'aria-labelledby');
  const resolvedAriaLabel = text(props, 'aria-label') || text(props, 'ariaLabel');
  const resolvedLabelledBy = externalLabelledBy || (!resolvedAriaLabel && label ? labelId : '');
  const renderItem = props.renderItem as
    | ((
        item: ReactToggleGroupItem,
        state: { pressed: boolean; disabled: boolean; index: number },
      ) => ReactNode)
    | undefined;

  useEffect(() => {
    if (activeIndex >= 0 && !disabled) {
      lastActiveIndex.current = activeIndex;
      return;
    }
    const replacementIndex = disabled
      ? -1
      : findToggleGroupReplacementIndex(items, lastActiveIndex.current);
    setActiveValue(items[replacementIndex]?.value ?? null);
    lastActiveIndex.current = Math.max(replacementIndex, 0);
    if (focusWithin.current && replacementIndex >= 0) {
      buttonRefs.current[replacementIndex]?.focus();
    }
  }, [activeIndex, disabled, items]);

  const isPressed = (item: ReactToggleGroupItem): boolean =>
    selectedValues.some((value) => Object.is(value, item.value));
  const isAvailable = (index: number): boolean =>
    !disabled && isToggleGroupItemAvailable(items[index]);
  const focusItem = (index: number): void => {
    if (!isAvailable(index)) return;
    setActiveValue(items[index]?.value ?? null);
    lastActiveIndex.current = index;
    buttonRefs.current[index]?.focus();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    let nextIndex = -1;
    if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(items, 'first');
    else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(items, 'last');
    else if (orientation === 'horizontal' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
      const forward = event.key === 'ArrowRight' ? !rtl : rtl;
      nextIndex = findNextToggleGroupIndex(items, index, forward ? 1 : -1, loop);
    } else if (orientation === 'vertical' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      nextIndex = findNextToggleGroupIndex(items, index, event.key === 'ArrowDown' ? 1 : -1, loop);
    } else return;

    event.preventDefault();
    if (nextIndex >= 0) focusItem(nextIndex);
  };
  const handleChange = (
    item: ReactToggleGroupItem,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    if (disabled || readonly || item.disabled || item.readonly || item.loading) return;
    const pressed = isPressed(item);
    let nextValue: ToggleGroupValue | ToggleGroupValue[] | null;
    if (type === 'single') {
      if (pressed && (!allowEmpty || required)) return;
      nextValue = pressed ? null : item.value;
    } else if (pressed) {
      if (selectedValues.length === 1 && (!allowEmpty || required)) return;
      nextValue = selectedValues.filter((value) => !Object.is(value, item.value));
    } else nextValue = [...selectedValues, item.value];

    setModelValue(nextValue);
    callback(props, 'onChange')?.(nextValue, item, event);
  };

  const setRootRef = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };

  return (
    <div className="peaui-toggle-group__field">
      {label || node(props, 'labelContent') ? (
        <div className="peaui-toggle-group__label" id={labelId}>
          {node(props, 'labelContent') ?? label}
          {required ? (
            <span aria-hidden="true" className="peaui-toggle-group__required">
              *
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        aria-describedby={describedBy.size ? [...describedBy].join(' ') : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={validationMessage ? true : undefined}
        aria-label={
          resolvedLabelledBy
            ? undefined
            : resolvedAriaLabel || (!label ? 'Grupa przełączników' : undefined)
        }
        aria-labelledby={resolvedLabelledBy || undefined}
        aria-orientation={semanticRole === 'toolbar' ? orientation : undefined}
        className={cx(
          'peaui-toggle-group',
          `peaui-toggle-group--${orientation}`,
          `peaui-toggle-group--${appearance}`,
          `peaui-toggle-group--size-${size}`,
          `peaui-toggle-group--overflow-${overflow}`,
          disabled && 'peaui-toggle-group--disabled',
          readonly && 'peaui-toggle-group--readonly',
          validationMessage && 'peaui-toggle-group--invalid',
          props.className,
        )}
        data-disabled={disabled || undefined}
        data-readonly={readonly || undefined}
        data-required={required || undefined}
        data-testid={dataTest(props)}
        dir={text(props, 'dir') || undefined}
        id={id}
        ref={setRootRef}
        role={semanticRole}
        style={props.style}
        onBlurCapture={() => {
          queueMicrotask(() => {
            focusWithin.current = Boolean(rootRef.current?.contains(document.activeElement));
          });
        }}
        onFocusCapture={() => {
          focusWithin.current = true;
        }}
      >
        {items.map((item, index) => {
          const pressed = isPressed(item);
          const itemDisabled = disabled || item.disabled === true;
          return (
            <ToggleButtonRenderer
              ariaLabel={item.ariaLabel || item.label}
              className="peaui-toggle-group__item"
              content={
                item.content ??
                (item.icon?.trim() || item.pressedIcon?.trim() ? 'icon-text' : 'text')
              }
              dataTestId={dataTest(props) ? `${dataTest(props)}-item-${index}` : undefined}
              disabled={itemDisabled}
              forwardedRef={(element) => {
                buttonRefs.current[index] = element;
              }}
              icon={item.icon}
              key={`${typeof item.value}:${String(item.value)}:${index}`}
              loading={item.loading}
              pressedIcon={item.pressedIcon}
              pressedLabel={item.pressedLabel}
              readonly={readonly || item.readonly}
              size={size}
              tabIndex={isAvailable(index) && activeIndex === index ? 0 : -1}
              value={pressed}
              variant={variant}
              onChange={(_next: boolean, event: React.MouseEvent<HTMLButtonElement>) =>
                handleChange(item, event)
              }
              onFocus={() => {
                setActiveValue(item.value);
                lastActiveIndex.current = index;
                callback(props, 'onFocusChange')?.(item, index);
              }}
              onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) =>
                handleKeyDown(event, index)
              }
            >
              {renderItem?.(item, { pressed, disabled: itemDisabled, index })}
            </ToggleButtonRenderer>
          );
        })}
      </div>
      {text(props, 'name')
        ? selectedValues.map((value) => (
            <input
              disabled={disabled}
              key={`${typeof value}:${String(value)}`}
              name={text(props, 'name')}
              type="hidden"
              value={value}
            />
          ))
        : null}
      {validationMessage ? (
        <div className="peaui-toggle-group__error" id={errorId} role="alert">
          {node(props, 'errorContent') ?? validationMessage}
        </div>
      ) : null}
    </div>
  );
}

type ReactSegmentedControlItem = {
  value: ToggleGroupValue;
  label: string;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
  metadata?: unknown;
};

function asSegmentedControlItems(value: unknown): ReactSegmentedControlItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ReactSegmentedControlItem[] => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.value !== 'string' && typeof item.value !== 'number') return [];
    if (typeof item.label !== 'string') return [];
    return [
      {
        value: item.value,
        label: item.label,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        ariaLabel: typeof item.ariaLabel === 'string' ? item.ariaLabel : undefined,
        disabled: item.disabled === true,
        metadata: item.metadata,
      },
    ];
  });
}

function SegmentedControlRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-segmented-control-${generatedId}`;
  const items = useMemo(() => asSegmentedControlItems(props.items), [props.items]);
  const size = text(props, 'size', 'm');
  const distribution = text(props, 'distribution', 'equal');
  const content = text(props, 'content', 'text');
  const orientation = text(props, 'orientation', 'horizontal') as 'horizontal' | 'vertical';
  const activation = text(props, 'activation', 'automatic');
  const fullWidth = bool(props, 'fullWidth');
  const disabled = bool(props, 'disabled');
  const loop = props.loop !== false;
  const [modelValue, setModelValue] = useModel<unknown>(props, 'value', null);
  const selectedIndex = items.findIndex((item) => Object.is(item.value, modelValue));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastActiveIndex = useRef(0);
  const focusWithin = useRef(false);
  const frameId = useRef<number | undefined>(undefined);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const initialActiveValue = (): ToggleGroupValue | null => {
    const index =
      selectedIndex >= 0 && isToggleGroupItemAvailable(items[selectedIndex])
        ? selectedIndex
        : findToggleGroupEdgeIndex(items, 'first');
    return items[index]?.value ?? null;
  };
  const [activeValue, setActiveValue] = useState<ToggleGroupValue | null>(initialActiveValue);
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});
  const activeIndex = items.findIndex(
    (item) => Object.is(item.value, activeValue) && isToggleGroupItemAvailable(item),
  );
  const baseTestId = dataTest(props);
  const externalLabelledBy = text(props, 'aria-labelledby');
  const resolvedAriaLabel = text(props, 'aria-label') || text(props, 'ariaLabel', 'Wybór opcji');
  const renderItem = props.renderItem as
    | ((
        item: ReactSegmentedControlItem,
        state: { disabled: boolean; index: number; selected: boolean },
      ) => ReactNode)
    | undefined;
  const renderItemIcon = props.renderItemIcon as
    | ((item: ReactSegmentedControlItem, state: { index: number; selected: boolean }) => ReactNode)
    | undefined;
  const renderIndicator = props.renderIndicator as
    | ((item: ReactSegmentedControlItem | null, index: number) => ReactNode)
    | undefined;
  const isAvailable = (index: number): boolean =>
    !disabled && isToggleGroupItemAvailable(items[index]);
  const isSelected = (index: number): boolean => index === selectedIndex;

  const updateIndicator = (): void => {
    const segment = buttonRefs.current[selectedIndexRef.current];
    if (!segment || !rootRef.current) {
      setIndicatorStyle({});
      setIndicatorReady(true);
      return;
    }
    setIndicatorStyle({
      '--peaui-segmented-control-indicator-x': `${segment.offsetLeft}px`,
      '--peaui-segmented-control-indicator-y': `${segment.offsetTop}px`,
      '--peaui-segmented-control-indicator-width': `${segment.offsetWidth}px`,
      '--peaui-segmented-control-indicator-height': `${segment.offsetHeight}px`,
    } as CSSProperties);
    setIndicatorReady(true);
  };
  const scheduleIndicatorUpdate = (): void => {
    if (typeof requestAnimationFrame === 'undefined') {
      updateIndicator();
      return;
    }
    if (frameId.current !== undefined) cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      frameId.current = undefined;
      updateIndicator();
    });
  };
  const ensureSelectedVisible = (): void => {
    const container = rootRef.current;
    const segment = buttonRefs.current[selectedIndex];
    if (!container || !segment || typeof container.scrollBy !== 'function') return;
    const containerRect = container.getBoundingClientRect();
    const segmentRect = segment.getBoundingClientRect();
    if (orientation === 'vertical') {
      const topDelta = segmentRect.top - containerRect.top;
      const bottomDelta = segmentRect.bottom - containerRect.bottom;
      if (topDelta < 0) container.scrollBy({ behavior: 'auto', top: topDelta });
      else if (bottomDelta > 0) container.scrollBy({ behavior: 'auto', top: bottomDelta });
      return;
    }
    const startDelta = segmentRect.left - containerRect.left;
    const endDelta = segmentRect.right - containerRect.right;
    if (startDelta < 0) container.scrollBy({ behavior: 'auto', left: startDelta });
    else if (endDelta > 0) container.scrollBy({ behavior: 'auto', left: endDelta });
  };

  useEffect(() => {
    if (activeIndex >= 0 && !disabled) {
      lastActiveIndex.current = activeIndex;
      return;
    }
    const replacementIndex = disabled
      ? -1
      : findToggleGroupReplacementIndex(items, lastActiveIndex.current);
    setActiveValue(items[replacementIndex]?.value ?? null);
    lastActiveIndex.current = Math.max(replacementIndex, 0);
    if (focusWithin.current && replacementIndex >= 0) {
      buttonRefs.current[replacementIndex]?.focus();
    }
  }, [activeIndex, disabled, items]);

  useEffect(() => {
    if (isAvailable(selectedIndex)) {
      setActiveValue(items[selectedIndex]?.value ?? null);
      lastActiveIndex.current = selectedIndex;
    }
    updateIndicator();
    ensureSelectedVisible();
  }, [distribution, fullWidth, orientation, selectedIndex]);

  useEffect(() => {
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(scheduleIndicatorUpdate);
    if (rootRef.current) observer?.observe(rootRef.current);
    if (!observer) window.addEventListener('resize', scheduleIndicatorUpdate, { passive: true });
    const fontSet = Reflect.get(document, 'fonts') as FontFaceSet | undefined;
    if (fontSet) void fontSet.ready.then(scheduleIndicatorUpdate);
    updateIndicator();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', scheduleIndicatorUpdate);
      if (frameId.current !== undefined) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const focusItem = (index: number): void => {
    if (!isAvailable(index)) return;
    setActiveValue(items[index]?.value ?? null);
    lastActiveIndex.current = index;
    buttonRefs.current[index]?.focus();
  };
  const selectItem = (
    item: ReactSegmentedControlItem,
    index: number,
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ): void => {
    if (!isAvailable(index) || isSelected(index)) return;
    setModelValue(item.value);
    callback(props, 'onChange')?.(item.value, item, event);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    let nextIndex = -1;
    if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(items, 'first');
    else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(items, 'last');
    else if (orientation === 'horizontal' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
      const forward = event.key === 'ArrowRight' ? !rtl : rtl;
      nextIndex = findNextToggleGroupIndex(items, index, forward ? 1 : -1, loop);
    } else if (orientation === 'vertical' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      nextIndex = findNextToggleGroupIndex(items, index, event.key === 'ArrowDown' ? 1 : -1, loop);
    } else return;
    event.preventDefault();
    if (nextIndex < 0) return;
    focusItem(nextIndex);
    const item = items[nextIndex];
    if (item && activation === 'automatic') selectItem(item, nextIndex, event);
  };
  const setRootRef = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };

  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        aria-label={externalLabelledBy ? undefined : resolvedAriaLabel || 'Wybór opcji'}
        aria-labelledby={externalLabelledBy || undefined}
        aria-orientation={orientation}
        className={cx(
          'peaui-segmented-control',
          `peaui-segmented-control--size-${size}`,
          `peaui-segmented-control--distribution-${distribution}`,
          `peaui-segmented-control--content-${content}`,
          `peaui-segmented-control--${orientation}`,
          fullWidth && 'peaui-segmented-control--full-width',
          disabled && 'peaui-segmented-control--disabled',
          indicatorReady && 'peaui-segmented-control--indicator-ready',
          props.className,
        )}
        data-activation={activation}
        data-disabled={disabled || undefined}
        data-has-selection={selectedIndex >= 0 || undefined}
        data-testid={baseTestId}
        dir={text(props, 'dir') || undefined}
        id={id}
        ref={setRootRef}
        role="radiogroup"
        style={{ ...props.style, ...indicatorStyle }}
        onBlurCapture={() => {
          queueMicrotask(() => {
            focusWithin.current = Boolean(rootRef.current?.contains(document.activeElement));
          });
        }}
        onFocusCapture={() => {
          focusWithin.current = true;
        }}
      >
        <span
          aria-hidden="true"
          className="peaui-segmented-control__indicator"
          data-visible={selectedIndex >= 0 || undefined}
        >
          {renderIndicator?.(items[selectedIndex] ?? null, selectedIndex)}
        </span>
        {items.map((item, index) => {
          const selected = isSelected(index);
          const itemDisabled = disabled || item.disabled === true;
          const customContent = renderItem?.(item, { disabled: itemDisabled, index, selected });
          return (
            <button
              aria-checked={selected}
              aria-label={item.ariaLabel || item.label}
              className={cx(
                'peaui-segmented-control__item',
                selected && 'peaui-segmented-control__item--selected',
                itemDisabled && 'peaui-segmented-control__item--disabled',
              )}
              data-segmented-control-index={index}
              data-selected={selected || undefined}
              data-testid={baseTestId ? `${baseTestId}-item-${index}` : undefined}
              disabled={itemDisabled}
              id={`${id}-item-${index}`}
              key={`${typeof item.value}:${String(item.value)}:${index}`}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              role="radio"
              tabIndex={isAvailable(index) && activeIndex === index ? 0 : -1}
              type="button"
              onClick={(event) => selectItem(item, index, event)}
              onFocus={() => {
                setActiveValue(item.value);
                lastActiveIndex.current = index;
                callback(props, 'onFocusChange')?.(item, index);
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {customContent ?? (
                <>
                  {content !== 'text' && (item.icon || renderItemIcon) ? (
                    <span aria-hidden="true" className="peaui-segmented-control__icon">
                      {renderItemIcon?.(item, { index, selected }) ??
                        (item.icon ? <Svg name={item.icon} /> : null)}
                    </span>
                  ) : null}
                  {content !== 'icon' ? (
                    <span className="peaui-segmented-control__label">{item.label}</span>
                  ) : null}
                </>
              )}
            </button>
          );
        })}
      </div>
      {text(props, 'name') && selectedIndex >= 0 ? (
        <input
          disabled={disabled}
          name={text(props, 'name')}
          type="hidden"
          value={items[selectedIndex]?.value}
        />
      ) : null}
    </>
  );
}

function FormSwitchToggleRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-form-switch-toggle-${generatedId}`;
  const trueValue = props.trueValue === undefined ? true : props.trueValue;
  const falseValue = props.falseValue === undefined ? false : props.falseValue;
  const [value, setValue] = useModel<unknown>(props, 'value', falseValue);
  const checked = Object.is(value, trueValue);
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const readonly = bool(props, 'readonly');
  const blocked = disabled || loading;
  const required = bool(props, 'required');
  const descriptionContent = node(props, 'descriptionContent') ?? text(props, 'description');
  const errorContent = node(props, 'errorContent') ?? text(props, 'error');
  const labelContent = node(props, 'labelContent') ?? text(props, 'label');
  const hasLabel = hasVisibleReactText(labelContent);
  const hasDescription = hasVisibleReactText(descriptionContent);
  const hasError = hasVisibleReactText(errorContent);
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-loading`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription) describedBy.add(descriptionId);
  if (hasError) describedBy.add(errorId);
  if (loading) describedBy.add(loadingId);
  const dataTestId = dataTest(props);
  const size = text(props, 'size', 'm');
  const labelPosition = text(props, 'labelPosition', 'end');
  const showStateLabel = bool(props, 'showStateLabel');
  const externalLabelledBy = text(props, 'aria-labelledby');
  const explicitAriaLabel = text(props, 'aria-label');
  const labelledBy = externalLabelledBy || (hasLabel && !explicitAriaLabel ? labelId : undefined);
  const renderThumb =
    typeof props.renderThumb === 'function'
      ? (props.renderThumb as (state: { checked: boolean; loading: boolean }) => ReactNode)
      : undefined;
  const labelNode = hasLabel ? (
    <span className="peaui-form-switch-toggle__label" id={labelId}>
      {labelContent}
      {required ? (
        <span aria-hidden="true" className="peaui-form-switch-toggle__required">
          *
        </span>
      ) : null}
    </span>
  ) : null;
  const stateContent = checked
    ? (node(props, 'onLabelContent') ?? text(props, 'onLabel', 'Włączone'))
    : (node(props, 'offLabelContent') ?? text(props, 'offLabel', 'Wyłączone'));

  return (
    <div
      className={cx(
        'peaui-form-switch-toggle',
        `peaui-form-switch-toggle--size-${size}`,
        `peaui-form-switch-toggle--label-${labelPosition}`,
        checked && 'peaui-form-switch-toggle--checked',
        disabled && 'peaui-form-switch-toggle--disabled',
        readonly && 'peaui-form-switch-toggle--readonly',
        loading && 'peaui-form-switch-toggle--loading',
        hasError && 'peaui-form-switch-toggle--invalid',
        props.className,
      )}
      data-checked={checked}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      data-loading={loading || undefined}
      data-readonly={readonly || undefined}
      data-testid={dataTestId}
      style={props.style}
    >
      <label
        className="peaui-form-switch-toggle__interaction"
        data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        htmlFor={id}
      >
        {labelPosition === 'start' ? labelNode : null}
        <span className="peaui-form-switch-toggle__control">
          <input
            aria-busy={loading || undefined}
            aria-checked={checked}
            aria-describedby={describedBy.size > 0 ? [...describedBy].join(' ') : undefined}
            aria-disabled={blocked || undefined}
            aria-invalid={hasError || undefined}
            aria-label={
              labelledBy
                ? undefined
                : explicitAriaLabel ||
                  (hasLabel
                    ? undefined
                    : text(props, 'ariaLabel') || text(props, 'name') || 'Przełącznik')
            }
            aria-labelledby={labelledBy}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            checked={checked}
            className="peaui-form-switch-toggle__input"
            data-testid={dataTestId ? `${dataTestId}-element` : undefined}
            disabled={blocked}
            form={text(props, 'form') || undefined}
            id={id}
            name={text(props, 'name') || undefined}
            ref={forwardedRef as ForwardedRef<HTMLInputElement>}
            required={required}
            role="switch"
            type="checkbox"
            value={serializeSwitchFormValue(trueValue)}
            onBlur={(event) => callback(props, 'onBlur')?.(event)}
            onChange={(event) => {
              if (readonly || blocked) {
                event.preventDefault();
                event.currentTarget.checked = checked;
                return;
              }
              const nextValue = event.currentTarget.checked ? trueValue : falseValue;
              setValue(nextValue);
              callback(props, 'onChange')?.(nextValue, event);
            }}
            onClick={(event) => {
              if (readonly) {
                event.preventDefault();
                const input = event.currentTarget;
                queueMicrotask(() => {
                  input.checked = checked;
                });
              }
              if (typeof props.onClick === 'function') {
                (props.onClick as MouseEventHandler<HTMLInputElement>)(event);
              }
            }}
            onFocus={(event) => callback(props, 'onFocus')?.(event)}
            onKeyDown={
              typeof props.onKeyDown === 'function'
                ? (props.onKeyDown as KeyboardEventHandler<HTMLInputElement>)
                : undefined
            }
            onPointerDown={
              typeof props.onPointerDown === 'function'
                ? (props.onPointerDown as PointerEventHandler<HTMLInputElement>)
                : undefined
            }
          />
          <span aria-hidden="true" className="peaui-form-switch-toggle__track">
            <span className="peaui-form-switch-toggle__thumb">
              {renderThumb?.({ checked, loading }) ??
                (loading ? <span className="peaui-form-switch-toggle__spinner" /> : null)}
            </span>
          </span>
        </span>
        {labelPosition === 'end' ? labelNode : null}
        {showStateLabel ? (
          <span aria-hidden="true" className="peaui-form-switch-toggle__state">
            {stateContent}
          </span>
        ) : null}
      </label>
      {hasDescription ? (
        <p className="peaui-form-switch-toggle__description" id={descriptionId}>
          {descriptionContent}
        </p>
      ) : null}
      {hasError ? (
        <p aria-live="polite" className="peaui-form-switch-toggle__error" id={errorId}>
          {errorContent}
        </p>
      ) : null}
      {loading ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="peaui-form-switch-toggle__loading-status"
          id={loadingId}
          role="status"
        >
          {text(props, 'loadingLabel', 'Trwa aktualizowanie ustawienia')}
        </span>
      ) : null}
    </div>
  );
}

function FormRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'FormSwitchToggle') {
    return <FormSwitchToggleRenderer {...props} forwardedRef={forwardedRef} />;
  }
  if (
    [
      'FormInput',
      'FormNumber',
      'FormPassword',
      'FormTextarea',
      'SearchInput',
      'InputSlider',
    ].includes(kind)
  ) {
    if (kind === 'FormTextarea') {
      const [value, setValue] = useModel<unknown>(props, 'value', '');
      const id = text(props, 'id') || useId();
      return (
        <FormShell props={{ ...props, id, value }}>
          <textarea
            aria-disabled={bool(props, 'disabled')}
            aria-describedby={
              [text(props, 'aria-describedby'), node(props, 'error') ? `${id}-error` : undefined]
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-invalid={Boolean(node(props, 'error')) || text(props, 'aria-invalid') === 'true'}
            aria-label={
              text(props, 'ariaLabel') || text(props, 'label') || text(props, 'name') || undefined
            }
            className={cx(
              'peaui-form-field__element',
              'peaui-form-field-textarea',
              value !== ''
                ? 'peaui-form-field__element--medium'
                : 'peaui-form-field__element--normal',
              bool(props, 'disabled') && 'peaui-form-field__element--disabled',
              bool(props, 'readonly') && 'peaui-form-field__element--readonly',
              !bool(props, 'readonly') && 'peaui-form-field__element--basic',
              Boolean(node(props, 'error')) && 'peaui-form-field__element--error',
              Boolean(node(props, 'success')) && 'peaui-form-field__element--success',
            )}
            data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
            disabled={bool(props, 'disabled')}
            id={id}
            maxLength={num(props, 'maxLength') || undefined}
            name={text(props, 'name')}
            placeholder={text(props, 'placeholder')}
            readOnly={bool(props, 'readonly')}
            ref={forwardedRef as ForwardedRef<HTMLTextAreaElement>}
            required={bool(props, 'required')}
            rows={num(props, 'rows', 4)}
            style={
              {
                '--pl': text(props, 'before')
                  ? `${
                      text(props, 'before').length * 7.5 + 14 + (text(props, 'iconBefore') ? 24 : 0)
                    }px`
                  : text(props, 'iconBefore')
                    ? '32px'
                    : '12px',
                '--pr': text(props, 'after')
                  ? `${
                      text(props, 'after').length * 7.5 + 12 + (text(props, 'iconAfter') ? 24 : 0)
                    }px`
                  : text(props, 'iconAfter')
                    ? '32px'
                    : '12px',
              } as CSSProperties
            }
            value={String(value ?? '')}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormShell>
      );
    }
    return <TextInputRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  }
  if (['FormCheckbox', 'FormRadio', 'FormButtonCheckbox', 'FormButtonGroup'].includes(kind))
    return <ChoiceRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  if (kind === 'FormSelect' || kind === 'FormMultiSelect')
    return <SelectRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  if (kind === 'FormDatePicker' || kind === 'FormYearPicker')
    return <DateRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  if (kind === 'FormFileUpload' || kind === 'FormFileUploadSimple')
    return <FileRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  if (kind === 'FormFieldLabel')
    return (
      <label
        className={cx('peaui-form-label', props.className)}
        data-testid={dataTest(props)}
        htmlFor={text(props, 'for')}
        ref={forwardedRef as ForwardedRef<HTMLLabelElement>}
      >
        <span className="peaui-form-label__content">
          <span
            className={cx(
              'peaui-form-label__text',
              bool(props, 'readonly') && 'peaui-form-label__text--readonly',
            )}
          >
            {text(props, 'text')}
          </span>
          {!bool(props, 'readonly') && !bool(props, 'required') ? (
            <span className="peaui-form-label__optional">(pole niewymagane)</span>
          ) : null}
        </span>
        {node(props, 'hint') ? (
          <>
            <span className="peaui-info-tooltip" tabIndex={0}>
              <Svg className="peaui-form-label__hint-icon" name="info" />
            </span>
            <span
              className="peaui-info-tooltip__content peaui-info-tooltip__content--placement-right"
              role="tooltip"
            >
              <span className="peaui-info-tooltip__description">{node(props, 'hint')}</span>
            </span>
          </>
        ) : null}
      </label>
    );
  if (kind === 'FormField') {
    const before = text(props, 'before');
    const after = text(props, 'after');
    const iconBefore = text(props, 'iconBefore');
    const iconAfter = text(props, 'iconAfter');
    const canErase = bool(props, 'canErase');
    const eraseButtonRight = getFormFieldEraseOffset({
      after,
      hasAdditional: Boolean(node(props, 'additional')),
      iconAfter,
      minimumEraseOffset:
        typeof props.rightErasePosition === 'number' ? props.rightErasePosition : undefined,
    });
    const fieldStyle = {
      '--pl': before
        ? `${before.length * 7.5 + 14 + (iconBefore ? 24 : 0)}px`
        : iconBefore
          ? '32px'
          : '12px',
      '--pr': `${getFormFieldPaddingRight({
        after,
        canErase,
        hasAdditional: Boolean(node(props, 'additional')),
        iconAfter,
        minimumEraseOffset: eraseButtonRight,
      })}px`,
    } as CSSProperties;
    const fieldControl = isValidElement<{ className?: string; style?: CSSProperties }>(
      props.children,
    )
      ? cloneElement(props.children, {
          className: cx('peaui-form-field__element', props.children.props.className),
          style: { ...fieldStyle, ...props.children.props.style },
        })
      : (props.children ?? (
          <input
            className={cx(
              'peaui-form-field__element',
              props.value !== ''
                ? 'peaui-form-field__element--medium'
                : 'peaui-form-field__element--normal',
              bool(props, 'disabled') && 'peaui-form-field__element--disabled',
              bool(props, 'readonly') && 'peaui-form-field__element--readonly',
              !bool(props, 'readonly') && 'peaui-form-field__element--basic',
            )}
            disabled={bool(props, 'disabled')}
            id={text(props, 'id')}
            name={text(props, 'name')}
            placeholder={text(props, 'placeholder')}
            readOnly={bool(props, 'readonly')}
            style={fieldStyle}
            value={text(props, 'value')}
            onChange={() => undefined}
          />
        ));

    return (
      <FormShell props={props}>
        {fieldControl}
        {canErase && props.value !== undefined && props.value !== '' && !bool(props, 'disabled') ? (
          <button
            aria-label="Usuń wartość pola"
            className="peaui-form-field__erase-button"
            style={{ '--right': `${eraseButtonRight}px` } as CSSProperties}
            type="button"
            onClick={() => callback(props, 'onRemove')?.()}
          >
            <Svg className="peaui-form-field__erase-icon" name="cross" />
          </button>
        ) : null}
      </FormShell>
    );
  }
  const formLabelId = `peaui-form-container-label-${useId().replaceAll(':', '')}`;
  const isLoading = bool(props, 'isLoading');
  return (
    <form
      {...common(props)}
      aria-busy={isLoading}
      aria-labelledby={
        text(props, 'label') && bool(props, 'useAriaLabelledby', true) ? formLabelId : undefined
      }
      className={cx(
        'peaui-form-container',
        `peaui-form-container--${text(props, 'actionsPosition', 'right')}`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLFormElement>}
      onSubmit={(event) => {
        event.preventDefault();
        callback(props, 'onSubmit')?.(event);
      }}
    >
      {isLoading ? (
        <div className="peaui-spinner-loader peaui-spinner-loader--fullscreen" aria-busy="true">
          <div className="peaui-spinner-loader__spinner" />
        </div>
      ) : null}
      <div className="peaui-form-container__body" inert={isLoading}>
        {text(props, 'label') ? (
          <span className="peaui-form-container__label" id={formLabelId}>
            {text(props, 'label')}
          </span>
        ) : null}
        {props.children}
        {bool(props, 'showActions', true) ? (
          <div className="peaui-form-container__actions">
            {node(props, 'additionalBefore') ? (
              <div className="peaui-form-container__actions-additional">
                {node(props, 'additionalBefore')}
              </div>
            ) : null}
            <button
              className="peaui-form-container__actions-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary"
              disabled={bool(props, 'disabled') || isLoading}
              type="submit"
            >
              {bool(props, 'isLoading')
                ? 'Zapisywanie…'
                : text(props, 'submitButtonLabel', 'Zapisz')}
            </button>
            {bool(props, 'showCancelButton') ? (
              <button
                className="peaui-form-container__actions-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
                disabled={bool(props, 'disabled') || isLoading}
                type="button"
                onClick={() => callback(props, 'onCancel')?.()}
              >
                {text(props, 'cancelButtonLabel', 'Anuluj')}
              </button>
            ) : null}
            {node(props, 'additionalAfter') ? (
              <div className="peaui-form-container__actions-additional">
                {node(props, 'additionalAfter')}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}

function InlineEditRuntimeRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <InlineEditRenderer
      {...(props as InlineEditRuntimeProps)}
      __renderButton={(buttonProps, children) => (
        <ButtonRenderer {...buttonProps} __name="ButtonAction">
          {children}
        </ButtonRenderer>
      )}
      __renderField={(name, fieldProps) => <FormRenderer {...fieldProps} __name={name} />}
      forwardedRef={forwardedRef}
    />
  );
}

function CopyButtonRuntimeRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <CopyButtonRenderer
      {...(props as CopyButtonRuntimeProps)}
      __renderButton={(buttonProps, children) => (
        <ButtonRenderer {...buttonProps} __name="ButtonAction">
          {children}
        </ButtonRenderer>
      )}
      __renderIcon={(iconProps) => <BasicRenderer {...iconProps} __name="SvgIcon" />}
      forwardedRef={forwardedRef}
    />
  );
}

function FeedbackRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const feedbackId = useId();
  if (kind === 'SpinnerLoader')
    return (
      <div
        {...common(props)}
        aria-busy="true"
        className={cx('peaui-spinner-loader', 'peaui-spinner-loader--fullscreen', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <div
          aria-atomic="true"
          aria-live="polite"
          className="peaui-spinner-loader__text"
          role="status"
        >
          Ładowanie... Proszę czekać.
        </div>
        <div aria-hidden="true" className="peaui-spinner-loader__spinner" />
      </div>
    );
  if (kind === 'SkeletonLoading')
    return (
      <div
        {...common(props)}
        aria-atomic="true"
        aria-busy="true"
        aria-live="polite"
        className={cx(
          'peaui-skeleton-loading',
          `peaui-skeleton-loading--size-${text(props, 'size', 'm')}`,
          bool(props, 'rounded') && 'peaui-skeleton-loading--rounded',
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        role="status"
      >
        <span className="peaui-skeleton-loading__text">
          {text(props, 'ariaLabel', 'Ładowanie zawartości')}
        </span>
        <span aria-hidden="true" className="peaui-skeleton-loading__bar" />
      </div>
    );
  if (kind === 'ProgressIndicator') {
    const steps = Math.max(0, num(props, 'steps', 3));
    const active = Math.min(steps, Math.max(0, num(props, 'active', 1)));
    const size = num(props, 'size', 100);
    const strokeWidth = num(props, 'strokeWidth', 10);
    const center = size / 2;
    const radius = Math.max(center - strokeWidth / 2, 0);
    const circumference = 2 * Math.PI * radius;
    const removeActive = bool(props, 'removeActive');
    const progress = steps > 0 ? active / steps : 0;
    return (
      <div
        {...common(props)}
        aria-label={
          text(props, 'ariaLabel') ||
          (steps <= 0
            ? 'Postęp: brak zdefiniowanych kroków.'
            : removeActive
              ? `Postęp: ${steps} kroków.`
              : `Postęp: krok ${active} z ${steps}.`)
        }
        aria-valuemax={steps}
        aria-valuemin={0}
        aria-valuenow={active}
        className={cx('peaui-progress-indicator', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        role="progressbar"
        style={{ ...props.style, height: size, width: size }}
      >
        <svg
          aria-hidden="true"
          className="peaui-progress-indicator__svg"
          focusable="false"
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          width={size}
        >
          <circle
            className={cx(
              'peaui-progress-indicator__track',
              removeActive
                ? 'peaui-progress-indicator__track--inactive'
                : 'peaui-progress-indicator__track--active',
            )}
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className={cx(
              'peaui-progress-indicator__progress',
              removeActive && 'peaui-progress-indicator__progress--hidden',
            )}
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        <span
          aria-hidden="true"
          className="peaui-progress-indicator__text"
          style={{ fontSize: Math.round(Math.min(Math.max(size * 0.28, 10), size * 0.45)) }}
        >
          {removeActive ? steps : `${active}/${steps}`}
        </span>
      </div>
    );
  }
  if (kind === 'MessageText') {
    const variant = text(props, 'variant', 'default');
    const ownIcon = text(props, 'ownIcon');
    const showVariantIcon = bool(props, 'withIcon', true) && variant !== 'default';
    return (
      <div
        {...common(props)}
        className={cx(
          'peaui-message-text',
          `peaui-message-text--variant-${variant}`,
          `peaui-message-text--size-${text(props, 'size', 'm')}`,
          props.className,
        )}
        id={text(props, 'id')}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        role={variant === 'error' ? 'alert' : 'status'}
      >
        {ownIcon ? (
          <Svg
            className={cx(
              'peaui-message-text__icon-own',
              `peaui-message-text__icon-own--variant-${variant}`,
            )}
            name={ownIcon}
          />
        ) : null}
        {!ownIcon && showVariantIcon ? (
          <Svg
            className="peaui-message-text__icon"
            name={variant === 'success' ? 'checkCircle' : variant === 'error' ? 'hint' : 'info'}
          />
        ) : null}
        <p className="peaui-message-text__content">{props.children}</p>
      </div>
    );
  }
  if (kind === 'ToastAlert') {
    const variant = text(props, 'variant', 'info');
    const size = text(props, 'size', 'm');
    return (
      <div
        {...common(props)}
        className={cx(
          'peaui-toast-alert',
          `peaui-toast-alert--variant-${variant}`,
          `peaui-toast-alert--size-${size}`,
          bool(props, 'withBorder', true) && 'peaui-toast-alert--border',
          bool(props, 'withShadow', true) && 'peaui-toast-alert--shadow',
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        role={variant === 'error' || variant === 'danger' ? 'alert' : 'status'}
      >
        <Svg
          className="peaui-toast-alert__icon"
          name={
            variant === 'success'
              ? 'checkCircle'
              : variant === 'error' || variant === 'danger'
                ? 'error'
                : 'info'
          }
        />
        <div className="peaui-toast-alert__content">
          {text(props, 'title') ? (
            <strong
              className={cx('peaui-toast-alert__title', `peaui-toast-alert__title--size-${size}`)}
            >
              {text(props, 'title')}
            </strong>
          ) : null}
          {text(props, 'description') ? (
            <p
              className={cx(
                'peaui-toast-alert__description',
                `peaui-toast-alert__description--size-${size}`,
              )}
            >
              {text(props, 'description')}
            </p>
          ) : null}
        </div>
        {bool(props, 'canClose') ? (
          <button
            aria-label="Zamknij komunikat"
            className="peaui-toast-alert__close-button"
            type="button"
            onClick={() => callback(props, 'onClose')?.()}
          >
            <Svg className="peaui-toast-alert__close-icon" name="close" />
          </button>
        ) : null}
      </div>
    );
  }
  return (
    <section
      {...common(props)}
      aria-describedby={text(props, 'description') ? `${feedbackId}-description` : undefined}
      aria-label={text(props, 'title') ? undefined : text(props, 'description', 'Brak danych')}
      aria-labelledby={text(props, 'title') ? `${feedbackId}-title` : undefined}
      className={cx('peaui-empty-state', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLElement>}
    >
      <svg
        aria-hidden="true"
        className="peaui-empty-state__icon"
        focusable="false"
        viewBox="0 0 64 41"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd" transform="translate(0 1)">
          <ellipse className="peaui-empty-state__icon-shadow" cx="32" cy="33" rx="32" ry="7" />
          <g className="peaui-empty-state__icon-outline" fillRule="nonzero">
            <path d="M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24Z" />
            <path
              className="peaui-empty-state__icon-line"
              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007Z"
            />
          </g>
        </g>
      </svg>
      <div className="peaui-empty-state__content">
        {text(props, 'title') ? (
          <h3 className="peaui-empty-state__title" id={`${feedbackId}-title`}>
            {text(props, 'title')}
          </h3>
        ) : null}
        {text(props, 'description') ? (
          <p className="peaui-empty-state__description" id={`${feedbackId}-description`}>
            {text(props, 'description')}
          </p>
        ) : null}
        {node(props, 'additional') ? (
          <div className="peaui-empty-state__additional">{node(props, 'additional')}</div>
        ) : null}
      </div>
    </section>
  );
}

function DisplayRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'Avatar') return <AvatarRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'CounterBadge')
    return (
      <span
        {...common(props)}
        className={cx(
          'peaui-counter-badge',
          `peaui-counter-badge--variant-${text(props, 'variant', 'info')}`,
          `peaui-counter-badge--size-${text(props, 'size', 'm')}`,
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLSpanElement>}
      >
        {text(props, 'value', '0')}
      </span>
    );
  if (kind === 'TagChip') {
    const Tag = text(props, 'as', 'span') as ElementType;
    return createElement(
      Tag,
      {
        ...common(props),
        className: cx(
          'peaui-tag-chip',
          `peaui-tag-chip--variant-${text(props, 'variant', 'primary')}`,
          `peaui-tag-chip--size-${text(props, 'size', 'm')}`,
          props.className,
        ),
        ref: forwardedRef,
      },
      text(props, 'label'),
    );
  }
  if (kind === 'DescriptionField')
    return (
      <dl
        {...common(props)}
        className={cx('peaui-description-field', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDListElement>}
      >
        <dd className="peaui-description-field__addon peaui-description-field__addon--before">
          {node(props, 'additionalBefore')}
        </dd>
        <dt className="peaui-description-field__label">
          {text(props, 'label')}
          {node(props, 'hint') ? (
            <span className="peaui-description-field__hint-icon" title={text(props, 'hint')}>
              i
            </span>
          ) : null}
        </dt>
        <dd className="peaui-description-field__value">{props.children}</dd>
        <dd className="peaui-description-field__addon peaui-description-field__addon--after">
          {node(props, 'additionalAfter')}
        </dd>
      </dl>
    );
  if (kind === 'DisclosurePanel') return <Disclosure props={props} forwardedRef={forwardedRef} />;
  if (kind === 'SectionHeading') {
    const Tag = text(props, 'as', 'section') as ElementType;
    const size = text(props, 'size', 'heading-m');
    const variant = text(props, 'variant', 'default');
    const sizeName: Record<string, string> = {
      'heading-l': 'heading-large',
      'heading-m': 'heading-medium',
      'heading-s': 'heading-small',
      'heading-xs': 'heading-extra-small',
      l: 'large',
      xl: 'extra-large',
      s: 'small',
    };
    const titleSize = sizeName[size];
    const descriptionSize =
      size === 'heading-m' ? 'large' : size === 'heading-l' ? 'heading-large' : sizeName[size];
    return createElement(
      Tag,
      {
        ...common(props),
        className: cx('peaui-section-heading', props.className),
        ref: forwardedRef,
      },
      <>
        {node(props, 'title') ? (
          <h2
            className={cx(
              'peaui-section-heading__title',
              titleSize && `peaui-section-heading__title--${titleSize}`,
              `peaui-section-heading__title--variant-${variant}`,
            )}
          >
            {node(props, 'title')}
            {node(props, 'hint') ? (
              <span className="peaui-section-heading__hint-icon" title={text(props, 'hint')}>
                i
              </span>
            ) : null}
          </h2>
        ) : null}
        {node(props, 'description') ? (
          <p
            className={cx(
              'peaui-section-heading__description',
              descriptionSize && `peaui-section-heading__description--${descriptionSize}`,
              `peaui-section-heading__description--variant-${variant}`,
            )}
          >
            {node(props, 'description')}
          </p>
        ) : null}
      </>,
    );
  }
  if (kind === 'CalculationResults')
    return (
      <section
        {...common(props)}
        className={cx(
          'peaui-calculation-results',
          bool(props, 'isSimple') && 'peaui-calculation-results--simple',
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLElement>}
      >
        <div
          className={cx(
            'peaui-calculation-results__content',
            bool(props, 'isSimple') && 'peaui-calculation-results__content--simple',
          )}
        >
          <label
            className={cx(
              'peaui-calculation-results__content-label',
              bool(props, 'isSimple') && 'peaui-calculation-results__content-label--simple',
            )}
          >
            <span>{text(props, 'label')}</span>
            {node(props, 'additional')}
            {node(props, 'hint') ? (
              <span className="peaui-calculation-results__hint-icon" title={text(props, 'hint')}>
                i
              </span>
            ) : null}
          </label>
          {!bool(props, 'isSimple') ? (
            <output className="peaui-calculation-results__content-output">
              {bool(props, 'isLoading') ? (
                <span className="peaui-calculation-results__content-loading">Trwa obliczanie…</span>
              ) : (
                text(props, 'result', '—')
              )}
            </output>
          ) : null}
        </div>
        {bool(props, 'isSimple') ? (
          <output className="peaui-calculation-results__content-output peaui-calculation-results__content-output--simple">
            {bool(props, 'isLoading') ? (
              <span className="peaui-calculation-results__content-loading">Trwa obliczanie…</span>
            ) : (
              text(props, 'result', '—')
            )}
          </output>
        ) : null}
        {bool(props, 'showCalculateButton') && !bool(props, 'isSimple') ? (
          <button
            className="peaui-calculation-results__content-button peaui-button-action peaui-button-action--size-s peaui-button-action--variant-primary"
            disabled={bool(props, 'disabled')}
            type="button"
            onClick={() => callback(props, 'onSimulate')?.()}
          >
            Oblicz
          </button>
        ) : null}
      </section>
    );
  if (kind === 'CardCarousel') return <Carousel props={props} forwardedRef={forwardedRef} />;
  if (kind === 'TreeList') return <Tree props={props} />;
  if (kind.startsWith('TableList'))
    return <TableRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  return (
    <div {...common(props)} ref={forwardedRef as ForwardedRef<HTMLDivElement>}>
      {props.children}
    </div>
  );
}

function Disclosure({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const alwaysOpen = bool(props, 'alwaysOpen') || bool(props, 'allwaysOpen');
  const [open, setOpen] = useModel<boolean>(props, 'open', alwaysOpen);
  return (
    <details
      {...common(props)}
      className={cx('peaui-disclosure-panel', props.className)}
      open={open || alwaysOpen}
      ref={forwardedRef as ForwardedRef<HTMLDetailsElement>}
    >
      <summary
        aria-disabled={bool(props, 'disabled')}
        className={cx(
          'peaui-disclosure-panel__summary',
          (open || alwaysOpen) && 'peaui-disclosure-panel__summary--open',
          bool(props, 'disabled') && 'peaui-disclosure-panel__summary--disabled',
        )}
        onClick={(event) => {
          event.preventDefault();
          if (!bool(props, 'disabled') && !alwaysOpen) setOpen(!open);
        }}
      >
        <span className="peaui-disclosure-panel__title">
          {node(props, 'title') ?? text(props, 'title')}
        </span>
        <span className="peaui-disclosure-panel__meta">
          {node(props, 'additional') ? (
            <span className="peaui-disclosure-panel__additional">{node(props, 'additional')}</span>
          ) : null}
          {!alwaysOpen ? <Svg className="peaui-disclosure-panel__icon" name="arrow" /> : null}
        </span>
      </summary>
      <div
        className={cx(
          'peaui-disclosure-panel__content',
          (open || alwaysOpen) && 'peaui-disclosure-panel__content--open',
        )}
        role="region"
      >
        <div className="peaui-disclosure-panel__content-inner">{props.children}</div>
      </div>
    </details>
  );
}

function Carousel({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const slides = Children.toArray(props.children);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!bool(props, 'withAnimation') || slides.length < 2) return undefined;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      num(props, 'animationDelay', 5000),
    );
    return () => window.clearInterval(timer);
  }, [props.animationDelay, props.withAnimation, slides.length]);
  const move = (delta: number): void =>
    setActive(
      (current) => (current + delta + Math.max(slides.length, 1)) % Math.max(slides.length, 1),
    );
  return (
    <div
      {...common(props)}
      aria-roledescription="carousel"
      className={cx(
        'peaui-card-carousel',
        slides.length === 1 && 'peaui-card-carousel--single-slide',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="region"
      style={
        {
          ...props.style,
          '--peaui-card-carousel-visible-slides': String(
            num(props, 'defaultVisibleSlides', num(props, 'defualtVisibleSlides', 1)),
          ),
        } as CSSProperties
      }
    >
      <div
        aria-label={`${text(props, 'ariaLabel', 'Karuzela kart')} - obszar przewijania`}
        className="peaui-card-carousel__viewport"
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            aria-label={`Slajd ${index + 1} z ${slides.length}`}
            aria-roledescription="slide"
            className="peaui-card-carousel__slide"
            role="group"
          >
            {slide}
          </div>
        ))}
      </div>
      {(bool(props, 'isNavigationVisible', true) || bool(props, 'isNavigationDotsVisible', true)) &&
      slides.length > 1 ? (
        <div
          className={cx(
            'peaui-card-carousel__controls',
            !bool(props, 'isNavigationDotsVisible', true) &&
              'peaui-card-carousel__controls--navigation-only',
          )}
        >
          {bool(props, 'isNavigationVisible', true) ? (
            <button
              aria-label="Pokaż poprzednie karty"
              className="peaui-card-carousel__navigation peaui-card-carousel__navigation--previous"
              disabled={active === 0}
              type="button"
              onClick={() => move(-1)}
            >
              <Svg className="peaui-card-carousel__navigation-icon" name="arrow" />
            </button>
          ) : null}
          {bool(props, 'isNavigationDotsVisible', true) ? (
            <div
              aria-label="Pozycje karuzeli"
              className="peaui-card-carousel__pagination"
              role="group"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  aria-current={index === active || undefined}
                  aria-label={`Pokaż slajd ${index + 1}`}
                  className={cx(
                    'peaui-card-carousel__dot',
                    index === active && 'peaui-card-carousel__dot--active',
                  )}
                  type="button"
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          ) : null}
          {bool(props, 'isNavigationVisible', true) ? (
            <button
              aria-label="Pokaż następne karty"
              className="peaui-card-carousel__navigation peaui-card-carousel__navigation--next"
              disabled={active === slides.length - 1}
              type="button"
              onClick={() => move(1)}
            >
              <Svg className="peaui-card-carousel__navigation-icon" name="arrow" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Tree({ props }: { props: RuntimeProps }): ReactElement {
  const [tree, setTree] = useModel<unknown>(props, 'tree', []);
  const items = Array.isArray(tree) ? tree : [tree];
  return (
    <div {...common(props)} className={cx('peaui-tree-list-catalog', props.className)}>
      {items.map((entry, index) => {
        const record = typeof entry === 'object' && entry !== null ? (entry as RuntimeProps) : {};
        return (
          <TreeNode
            key={text(record, 'id', String(index))}
            canRemove={bool(props, 'canRemove')}
            disabled={bool(props, 'disabled') || bool(record, 'disabled')}
            isLast={index === items.length - 1}
            level={num(props, 'level', 1)}
            record={record}
            onRemove={() => {
              const next = items.filter((_, itemIndex) => itemIndex !== index);
              setTree(next);
              callback(props, 'onRemove')?.(record.id ?? index);
            }}
          />
        );
      })}
      {props.children}
    </div>
  );
}

function TreeNode({
  record,
  level,
  isLast,
  disabled,
  canRemove,
  onRemove,
}: {
  record: RuntimeProps;
  level: number;
  isLast: boolean;
  disabled: boolean;
  canRemove: boolean;
  onRemove: () => void;
}): ReactElement {
  const rawChildren = record.children;
  const children = Array.isArray(rawChildren)
    ? rawChildren
    : typeof rawChildren === 'object' && rawChildren !== null
      ? Object.values(rawChildren)
      : [];
  const hasChildren = children.length > 0;
  const [open, setOpen] = useState(true);
  const label = text(record, 'label') || text(record, 'name', 'Element');
  const root = 'peaui-tree-list';
  return (
    <div
      className={cx(
        root,
        `${root}--level-${level}`,
        hasChildren ? `${root}--branch` : `${root}--leaf`,
        disabled && `${root}--disabled`,
      )}
    >
      <div
        className={cx(
          `${root}__row`,
          `${root}__row--level-${level}`,
          disabled && `${root}__row--disabled`,
        )}
      >
        {level === 2 ? (
          <Svg
            className={`${root}__connector ${root}__connector--level-two`}
            name={isLast ? 'trialCurve' : 'trial'}
          />
        ) : null}
        {level === 3 ? (
          <Svg
            className={`${root}__connector ${root}__connector--level-three`}
            name={isLast ? 'trialCurve' : 'trial'}
          />
        ) : null}
        {hasChildren ? (
          <button
            aria-expanded={open}
            className={cx(`${root}__toggle`, disabled && `${root}__toggle--disabled`)}
            disabled={disabled}
            type="button"
            onClick={() => setOpen((current) => !current)}
          >
            <Svg
              className={cx(
                `${root}__toggle-icon`,
                open ? `${root}__toggle-icon--open` : `${root}__toggle-icon--closed`,
              )}
              name="arrow"
            />
            <span className={cx(`${root}__label`, level === 1 && `${root}__label--emphasized`)}>
              {label}
            </span>
          </button>
        ) : (
          <div className={`${root}__leaf-content`}>
            <span className={`${root}__label`}>{label}</span>
            <span className={`${root}__leaf-meta`} />
          </div>
        )}
        {canRemove ? (
          <button
            aria-label={`Usuń ${label}`}
            className={`${root}__remove`}
            type="button"
            onClick={onRemove}
          >
            <Svg className={`${root}__remove-icon`} name="close" />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div className={`${root}__content`}>
          {level === 1 ? <span aria-hidden="true" className={`${root}__branch-line`} /> : null}
          <ul className={`${root}__children`}>
            {children.map((child, index) => {
              const childRecord =
                typeof child === 'object' && child !== null ? (child as RuntimeProps) : {};
              return (
                <li key={text(childRecord, 'id', String(index))} className={`${root}__child`}>
                  <TreeNode
                    canRemove={canRemove}
                    disabled={disabled || bool(childRecord, 'disabled')}
                    isLast={index === children.length - 1}
                    level={level + 1}
                    record={childRecord}
                    onRemove={() => callback(record, 'onRemove')?.(childRecord.id ?? index)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function tableCellValue(record: Record<string, unknown>, column: TableColumn): unknown {
  const value = record[column.key];
  if (!column.name || typeof value !== 'object' || value === null) return value;
  return (value as Record<string, unknown>)[column.name];
}

function resolveTableActions(
  column: TableColumn,
  record: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const resolved = column.resolve?.(record);
  return Array.isArray(resolved)
    ? resolved.filter(
        (entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null,
      )
    : [];
}

function TableCellContent({
  column,
  props,
  record,
  rowIndex,
}: {
  column: TableColumn;
  props: RuntimeProps;
  record: Record<string, unknown>;
  rowIndex: number;
}): ReactNode {
  const value = tableCellValue(record, column);
  const display = value === undefined || value === null || value === '' ? '-/-' : String(value);
  const type = column.type ?? 'text';

  if (type === 'index')
    return <span className="peaui-table-list__index-column">{rowIndex + 1}</span>;
  if (type === 'empty') return <span className="peaui-table-list__empty-column">-/-</span>;
  if (type === 'array')
    return (
      <span className="peaui-table-list__array-column">
        {Array.isArray(value) && value.length ? value.join(', ') : '-/-'}
      </span>
    );
  if (type === 'date') {
    const date =
      typeof value === 'string' || typeof value === 'number' ? new Date(value) : undefined;
    const formatted = date && !Number.isNaN(date.valueOf()) ? date.toLocaleDateString() : display;
    return <time dateTime={typeof value === 'string' ? value : undefined}>{formatted}</time>;
  }
  if (type === 'status' || type === 'tag') {
    const label = type === 'status' ? (value ? 'TAK' : 'NIE') : display;
    const variant =
      type === 'status'
        ? value
          ? 'green'
          : 'red'
        : (column.statusDictionary?.[display] ?? 'green');
    return (
      <span
        className={cx(
          'peaui-tag-chip',
          'peaui-tag-chip--size-xs',
          `peaui-tag-chip--variant-${variant}`,
        )}
      >
        {label}
      </span>
    );
  }
  if (type === 'link') {
    const href = /^(https?:\/\/|\/|#|mailto:|tel:|\.\/|\.\.\/)/.test(display) ? display : undefined;
    const label = `Otwórz powiązanie ${display}`;
    return href ? (
      <a aria-label={label} className="peaui-table-list__link-column" href={href}>
        {display}
      </a>
    ) : (
      <button
        aria-label={label}
        className="peaui-table-list__link-column"
        type="button"
        onClick={() =>
          callback(props, 'onAction')?.(record.id, column.actionName ?? 'link', record)
        }
      >
        {display}
      </button>
    );
  }
  if (type === 'action' || type === 'editAction' || type === 'EditActionColumn') {
    const label = column.actionLabel ?? (type === 'action' ? 'Akcja' : 'Edytuj');
    return (
      <button
        aria-label={`${label}: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
        className={cx(
          'peaui-button-action',
          'peaui-button-action--size-xs',
          'peaui-button-action--variant-secondary',
          type === 'action'
            ? 'peaui-table-list__actions-simple-button'
            : 'peaui-table-list__edit-action-button',
        )}
        type="button"
        onClick={() =>
          callback(props, 'onAction')?.(
            record.id,
            column.actionName ?? (type === 'action' ? 'action' : 'edit-inline'),
            record,
          )
        }
      >
        {label}
      </button>
    );
  }
  if (type === 'stepper' && column.steps) {
    const steps = column.steps(record);
    return (
      <ol
        aria-label={`Etapy dla ${String(record.name ?? `wiersza ${rowIndex + 1}`)}`}
        className="peaui-table-list__stepper-list"
      >
        {steps.map((step, index) => (
          <li
            className={cx(
              'peaui-table-list__stepper-button',
              `peaui-table-list__stepper-button--status-${String(step.status ?? 'default')}`,
            )}
            key={String(step.key ?? index)}
          >
            {String(step.label ?? step.key ?? index + 1)}
          </li>
        ))}
      </ol>
    );
  }
  if (type === 'expandable') {
    return (
      <button
        aria-label={`Pokaż szczegóły: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
        className="peaui-table-list__expandable-button"
        type="button"
        onClick={() => callback(props, 'onAction')?.(record.id, 'expand', record)}
      >
        <span className="peaui-table-list__expandable-value">{display}</span>
        <span aria-hidden="true">›</span>
      </button>
    );
  }

  const content = <span className="peaui-table-list__text-value">{display}</span>;
  if (!column.canCopy) return content;
  return (
    <span className="peaui-table-list__body-cell-content peaui-table-list__body-cell-content--copyable">
      {content}
      <button
        aria-label={`Kopiuj ${column.label ?? column.key}: ${display}`}
        className="peaui-table-list__copy-button"
        type="button"
        onClick={() => copyTextToClipboard(display)}
      >
        <Svg className="peaui-table-list__copy-icon" name="copy" />
      </button>
    </span>
  );
}

function TableRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(new Set());
  useEffect(() => setHiddenColumnKeys(new Set()), [props.columns]);

  const [filtersOpen, setFiltersOpen] = useModel<boolean>(props, 'filtersOpen', false);
  if (kind === 'TableListHeader') {
    const additionalDescription =
      node(props, 'additionalDescription') ??
      node(props, 'addtionalDescription') ??
      node(props, 'description');
    const additionalContent = node(props, 'additionalContent') ?? node(props, 'addtionalContent');

    return (
      <header
        className={cx(
          'peaui-table-list-header',
          Boolean(additionalDescription) && 'peaui-table-list-header--with-description',
          props.className,
        )}
      >
        {additionalDescription}
        <div className="peaui-table-list-header__controls">
          <div className="peaui-table-list-header__search-area">
            <strong>{num(props, 'totalRecords')} rekordów</strong>
            {num(props, 'countSelectedRecords') ? (
              <span>{num(props, 'countSelectedRecords')} zaznaczonych</span>
            ) : null}
            {bool(props, 'canSearch') ? (
              <input
                aria-label="Szukaj w tabeli"
                className="peaui-table-list-header__search peaui-search-input__input"
                placeholder={text(props, 'searchPlaceholder', 'Szukaj')}
                onChange={(event) => callback(props, 'onSearch')?.(event.target.value)}
              />
            ) : null}
          </div>
          <div className="peaui-table-list-header__actions">
            {bool(props, 'canFilter') ? (
              <button
                className="peaui-table-list-header__filter-button peaui-button-action peaui-button-action--variant-secondary"
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <span className="peaui-table-list-header__filter-button-label">Filtry</span>
                {num(props, 'countFilters') ? (
                  <span className="peaui-table-list-header__filter-badge peaui-counter-badge peaui-counter-badge--variant-info">
                    {num(props, 'countFilters')}
                  </span>
                ) : null}
              </button>
            ) : null}
            {bool(props, 'canFilter') && num(props, 'countFilters') > 0 ? (
              <button
                aria-label="Wyczyść filtry"
                className="peaui-table-list-header__filter-reset peaui-button-action peaui-button-action--variant-ghost"
                type="button"
                onClick={() => callback(props, 'onResetFilters')?.()}
              >
                <Svg className="peaui-table-list-header__filter-reset-icon" name="close" />
                <span className="peaui-table-list-header__filter-reset-label">Wyczyść filtry</span>
              </button>
            ) : null}
            {bool(props, 'canCreate') ? (
              <button
                aria-label={text(props, 'buttonCreateLabel', 'Dodaj')}
                className="peaui-table-list-header__create-button peaui-button-action peaui-button-action--variant-primary"
                type="button"
                onClick={() => callback(props, 'onCreate')?.()}
              >
                <Svg className="peaui-table-list-header__create-icon" name="plus" />
                <span className="peaui-table-list-header__create-label">
                  {text(props, 'buttonCreateLabel', 'Dodaj')}
                </span>
              </button>
            ) : null}
            {bool(props, 'canExport') ? (
              <button
                className="peaui-table-list-header__export-button peaui-button-action peaui-button-action--variant-secondary"
                type="button"
                onClick={() => callback(props, 'onExport')?.()}
              >
                Eksportuj
              </button>
            ) : null}
            {node(props, 'additionalButtons')}
          </div>
        </div>
        {node(props, 'filtersDrawer')}
        {additionalContent}
      </header>
    );
  }
  if (kind === 'TableListFooter')
    return (
      <footer
        className={cx(
          'peaui-table-list-footer',
          bool(props, 'isFlex') && 'peaui-table-list-footer--flex',
          props.className,
        )}
      >
        <span className="peaui-table-list-footer__summary">
          Wyświetlono {num(props, 'rowsNumber')} z {num(props, 'total')}
        </span>
        <div
          className={cx(
            'peaui-table-list-footer__pagination',
            bool(props, 'under') && 'peaui-table-list-footer__pagination--under',
          )}
        >
          <Pagination
            props={{
              ariaLabel: 'Paginacja tabeli',
              page: num(props, 'page', 1),
              totalPages: Math.max(
                1,
                Math.ceil(num(props, 'total') / Math.max(1, num(props, 'rowsPerPage', 10))),
              ),
              onPageChange: (next: number) => callback(props, 'onChangePage')?.(next),
            }}
          />
        </div>
        <label className="peaui-table-list-footer__limit">
          Na stronie
          <select
            aria-label="Liczba rekordów na stronie"
            value={num(props, 'rowsPerPage')}
            onChange={(event) => callback(props, 'onChangeLimit')?.(Number(event.target.value))}
          >
            {[10, 20, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>
      </footer>
    );
  const columnsRaw = Array.isArray(props.columns) ? props.columns : [];
  const columns: TableColumn[] = columnsRaw.flatMap((entry, index): TableColumn[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const record = entry as Record<string, unknown>;
    const key =
      typeof record.key === 'string'
        ? record.key
        : typeof record.name === 'string'
          ? record.name
          : String(index);
    return [
      {
        actionLabel: typeof record.actionLabel === 'string' ? record.actionLabel : undefined,
        actionName: typeof record.actionName === 'string' ? record.actionName : undefined,
        border: record.border === 'left' || record.border === 'right' ? record.border : undefined,
        canCopy: record.canCopy === true,
        canSort: record.canSort === true,
        hintColumn: typeof record.hintColumn === 'string' ? record.hintColumn : undefined,
        inline: record.inline === true,
        key,
        label:
          typeof record.label === 'string'
            ? record.label
            : typeof record.title === 'string'
              ? record.title
              : key,
        manage:
          typeof record.manage === 'object' && record.manage !== null
            ? (record.manage as Record<string, unknown>)
            : undefined,
        resolve:
          typeof record.resolve === 'function'
            ? (record.resolve as (row: Record<string, unknown>) => unknown)
            : undefined,
        sortable: record.canSort === true || record.sortable === true,
        statusDictionary:
          typeof record.statusDictionary === 'object' && record.statusDictionary !== null
            ? (record.statusDictionary as Record<string, string>)
            : undefined,
        steps:
          typeof record.steps === 'function'
            ? (record.steps as (row: Record<string, unknown>) => Array<Record<string, unknown>>)
            : undefined,
        type: typeof record.type === 'string' ? record.type : undefined,
        visible: record.visible !== false,
        width:
          typeof record.width === 'string' || typeof record.width === 'number'
            ? record.width
            : undefined,
        withLock: record.withLock === true,
      },
    ];
  });
  const visibleColumns = columns.filter(
    (column) => column.visible !== false && !hiddenColumnKeys.has(column.key),
  );
  const records = Array.isArray(props.records) ? props.records : [];
  const selected = new Set(Array.isArray(props.selectedRows) ? props.selectedRows.map(String) : []);
  const currentCheckedRow = String(props.currentCheckedRow ?? '');
  const activeSortColumns = bool(props, 'canMultiSort')
    ? normalizeReactTableSortDescriptors(props.sortColumns)
    : [];
  const renderCell =
    typeof props.renderCell === 'function'
      ? (props.renderCell as (
          columnKey: string,
          record: Record<string, unknown>,
          rowIndex: number,
        ) => ReactNode)
      : undefined;
  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-table-list',
        (bool(props, 'isDetails') || bool(props, 'isDetials')) && 'peaui-table-list--details',
        bool(props, 'isLoading') && 'peaui-table-list--loading',
        bool(props, 'scroll') && 'peaui-table-list--scroll',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      aria-busy={bool(props, 'isLoading') || undefined}
    >
      {bool(props, 'canHideColumns') ? (
        <details className="peaui-table-list__head-actions-popover">
          <summary className="peaui-table-list__head-actions-trigger">Widoczność kolumn</summary>
          <fieldset className="peaui-table-list__head-actions-menu">
            <legend className="peaui-table-list__head-actions-title">Widoczne kolumny</legend>
            {columns.map((column) => (
              <label className="peaui-table-list__head-actions-option" key={column.key}>
                <input
                  checked={!hiddenColumnKeys.has(column.key)}
                  disabled={
                    column.withLock ||
                    (!hiddenColumnKeys.has(column.key) && visibleColumns.length <= 3)
                  }
                  type="checkbox"
                  onChange={(event) => {
                    setHiddenColumnKeys((current) => {
                      const next = new Set(current);
                      if (event.target.checked) next.delete(column.key);
                      else if (columns.length - next.size > 3) next.add(column.key);
                      return next;
                    });
                  }}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </fieldset>
        </details>
      ) : null}
      {bool(props, 'canCreate') ? (
        <button
          className="peaui-table-list__create"
          type="button"
          onClick={() => callback(props, 'onCreateRecord')?.()}
        >
          {text(props, 'buttonEditableCreateText', 'Dodaj rekord')}
        </button>
      ) : null}
      <table
        className="peaui-table-list__table"
        aria-label={text(props, 'ariaLabel', 'Tabela danych')}
      >
        <thead
          className={cx(
            'peaui-table-list__head',
            bool(props, 'scroll') && 'peaui-table-list__head--sticky',
          )}
        >
          <tr className="peaui-table-list__head-row">
            {bool(props, 'canSelectRows') ? (
              <th className="peaui-table-list__select-head-cell" scope="col">
                <span className="peaui-table-list__sr-only">Wybór</span>
              </th>
            ) : null}
            {bool(props, 'canCheckRows') ? (
              <th className="peaui-table-list__check-head-cell" scope="col">
                <span className="peaui-table-list__sr-only">Wybór pojedynczy</span>
              </th>
            ) : null}
            {visibleColumns.map((column) => {
              const activeMultiSort = activeSortColumns.find((entry) => entry.key === column.key);
              const activeSortDirection = bool(props, 'canMultiSort')
                ? activeMultiSort?.direction
                : text(props, 'sortColumn') === column.key
                  ? text(props, 'sortType', 'desc').toLowerCase() === 'asc'
                    ? 'asc'
                    : 'desc'
                  : undefined;

              return (
                <th
                  key={column.key}
                  className={cx(
                    'peaui-table-list__head-cell',
                    column.sortable && 'peaui-table-list__head-cell--sortable',
                    column.border === 'left' && 'peaui-table-list__head-cell--border-left',
                    column.border === 'right' && 'peaui-table-list__head-cell--border-right',
                    column.withLock && 'peaui-table-list__head-cell--locked',
                  )}
                  scope="col"
                  style={{ width: column.width }}
                  aria-sort={
                    activeSortDirection === 'asc'
                      ? 'ascending'
                      : activeSortDirection === 'desc'
                        ? 'descending'
                        : undefined
                  }
                  data-sort-priority={
                    activeMultiSort ? activeSortColumns.indexOf(activeMultiSort) + 1 : undefined
                  }
                >
                  <button
                    className={cx(
                      'peaui-table-list__head-button',
                      column.sortable && 'peaui-table-list__head-button--sortable',
                    )}
                    aria-disabled={!column.sortable || undefined}
                    type="button"
                    onClick={() => {
                      if (!column.sortable) return;

                      callback(
                        props,
                        'onSort',
                      )?.(
                        bool(props, 'canMultiSort')
                          ? getNextReactTableSortDescriptors(activeSortColumns, column.key)
                          : column.key,
                      );
                    }}
                  >
                    <span className="peaui-table-list__head-content" title={column.hintColumn}>
                      {column.label}
                    </span>
                    {column.sortable ? (
                      <Svg className="peaui-table-list__sort-icon" name="sort" />
                    ) : null}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="peaui-table-list__body">
          {records.map((entry, rowIndex) => {
            const record: Record<string, unknown> =
              typeof entry === 'object' && entry !== null
                ? (entry as Record<string, unknown>)
                : { value: entry };
            const id = String(record.id ?? rowIndex);
            return (
              <tr
                key={id}
                className={cx(
                  'peaui-table-list__row',
                  selected.has(id) && 'peaui-table-list__row--selected',
                  (callback(props, 'onRowDoubleClick') || callback(props, 'onDbclick')) &&
                    'peaui-table-list__row--interactive',
                )}
                tabIndex={bool(props, 'canCheckRows') ? 0 : undefined}
                onClick={(event) => {
                  if (bool(props, 'canCheckRows') && !isInteractiveTarget(event.target)) {
                    callback(props, 'onCheckRow')?.(record);
                  }
                }}
                onDoubleClick={() => {
                  callback(props, 'onRowDoubleClick')?.(record.id, record);
                  callback(props, 'onDbclick')?.(record.id, record);
                }}
                onKeyDown={(event) => {
                  if (
                    bool(props, 'canCheckRows') &&
                    ['Enter', ' ', 'Spacebar'].includes(event.key) &&
                    !isInteractiveTarget(event.target)
                  ) {
                    event.preventDefault();
                    callback(props, 'onCheckRow')?.(record);
                  }
                }}
              >
                {bool(props, 'canSelectRows') ? (
                  <td className="peaui-table-list__select-cell">
                    <input
                      aria-label={`Zaznacz wiersz ${rowIndex + 1}`}
                      checked={selected.has(id)}
                      type="checkbox"
                      onChange={(event) => {
                        const nextSelectedRows = event.target.checked
                          ? [...selected, id]
                          : [...selected].filter((selectedId) => selectedId !== id);
                        callback(props, 'onSelectRow')?.(nextSelectedRows);
                      }}
                    />
                  </td>
                ) : null}
                {bool(props, 'canCheckRows') ? (
                  <td className="peaui-table-list__check-cell">
                    <input
                      aria-label={`Wybierz wiersz ${rowIndex + 1}`}
                      checked={currentCheckedRow === id}
                      name={`${text(props, 'id', 'table')}-checked-row`}
                      type="radio"
                      onChange={() => callback(props, 'onCheckRow')?.(record)}
                    />
                  </td>
                ) : null}
                {visibleColumns.map((column) => (
                  <td
                    key={column.key}
                    className={cx(
                      'peaui-table-list__body-cell',
                      column.border === 'left' && 'peaui-table-list__body-cell--border-left',
                      column.border === 'right' && 'peaui-table-list__body-cell--border-right',
                      column.withLock && 'peaui-table-list__body-cell--locked',
                    )}
                    style={{ width: column.width }}
                  >
                    {renderCell ? (
                      renderCell(column.key, record, rowIndex)
                    ) : column.resolve ? (
                      <div className="peaui-table-list__actions-simple">
                        {resolveTableActions(column, record).map((action, actionIndex) => {
                          const item = action;
                          const actionKey = String(item.key ?? actionIndex);
                          return (
                            <button
                              aria-label={`${String(item.label ?? actionKey)}: ${String(
                                record.name ?? `wiersz ${rowIndex + 1}`,
                              )}`}
                              className="peaui-table-list__actions-simple-button"
                              key={actionKey}
                              type="button"
                              onClick={() =>
                                callback(props, 'onAction')?.(record.id, actionKey, record)
                              }
                            >
                              {String(item.label ?? actionKey)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (column.inline || (bool(props, 'editable') && column.manage)) &&
                      String(column.manage?.type ?? 'text') === 'select' ? (
                      <select
                        aria-label={`${column.label ?? column.key}, wiersz ${rowIndex + 1}`}
                        defaultValue={String(record[column.key] ?? '')}
                        onChange={(event) =>
                          callback(props, 'onChangeValue')?.(record.id, event.target.value)
                        }
                      >
                        {(Array.isArray(column.manage?.options) ? column.manage.options : []).map(
                          (option, optionIndex) => {
                            const item = option as Record<string, unknown>;
                            return (
                              <option
                                key={String(item.value ?? optionIndex)}
                                value={String(item.value ?? '')}
                              >
                                {String(item.label ?? item.value ?? '')}
                              </option>
                            );
                          },
                        )}
                      </select>
                    ) : column.inline || (bool(props, 'editable') && column.manage) ? (
                      <input
                        aria-label={`${column.label ?? column.key}, wiersz ${rowIndex + 1}`}
                        defaultValue={String(record[column.key] ?? '')}
                        max={typeof column.manage?.max === 'number' ? column.manage.max : undefined}
                        maxLength={
                          typeof column.manage?.maxLength === 'number'
                            ? column.manage.maxLength
                            : undefined
                        }
                        min={typeof column.manage?.min === 'number' ? column.manage.min : undefined}
                        required={column.manage?.required === true}
                        step={
                          typeof column.manage?.step === 'number' ? column.manage.step : undefined
                        }
                        type={column.manage?.type === 'number' ? 'number' : 'text'}
                        onChange={(event) =>
                          callback(props, 'onChangeValue')?.(
                            record.id,
                            column.manage?.type === 'number'
                              ? Number(event.target.value)
                              : event.target.value,
                          )
                        }
                      />
                    ) : (
                      TableCellContent({ column, props, record, rowIndex })
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!bool(props, 'isLoading') && records.length === 0 ? (
        <div className="peaui-table-list__empty-inline-cell">
          {text(props, 'emptyDescriptionInline', 'Brak danych')}
        </div>
      ) : null}
      {bool(props, 'isLoading') ? (
        <div className="peaui-table-list__loading" role="status">
          Ładowanie…
        </div>
      ) : null}
      {node(props, 'additionalRow')}
    </div>
  );
}

function LayoutRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'SectionDivider')
    return (
      <hr
        {...common(props)}
        className={cx(
          'peaui-section-divider',
          `peaui-section-divider--${text(props, 'direction', 'horizontal')}`,
          `peaui-section-divider--size-${text(props, 'size', 'm')}`,
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLHRElement>}
      />
    );
  if (kind === 'GridItem')
    return (
      <div
        {...common(props)}
        className={cx(
          'peaui-grid-item',
          bool(props, 'grid') && 'peaui-grid-item--grid',
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        style={
          {
            ...props.style,
            '--peaui-grid-item-colspan': String(Math.max(1, num(props, 'colspan', 1))),
            '--peaui-grid-item-columns': String(Math.max(1, num(props, 'columns', 1))),
            '--peaui-grid-item-gap': text(props, 'gap', '1rem'),
          } as CSSProperties
        }
      >
        {props.children}
      </div>
    );
  if (kind === 'GridSection')
    return (
      <div
        {...common(props)}
        className={cx('peaui-grid-section', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        {node(props, 'additional') ? (
          <div className="peaui-grid-section__additional">{node(props, 'additional')}</div>
        ) : null}
        <div
          className={cx(
            'peaui-grid-section__content',
            num(props, 'columns', 1) > 1 && 'peaui-grid-section__content--multi',
          )}
          style={
            {
              '--peaui-grid-gap-y': text(props, 'gap', '1rem'),
              '--columns-minus-one': String(Math.max(0, num(props, 'columns', 1) - 1)),
              '--columns': String(num(props, 'columns', 1)),
            } as CSSProperties
          }
        >
          {props.children}
        </div>
      </div>
    );
  if (kind === 'CardPanel') {
    const Tag = text(props, 'as', 'section') as ElementType;
    return createElement(
      Tag,
      {
        ...common(props),
        className: cx(
          'peaui-card-panel',
          Boolean(node(props, 'header')) && 'peaui-card-panel--with-header',
          bool(props, 'isShadowEnabled', true) && 'peaui-card-panel--shadow-enabled',
          bool(props, 'isHoverEnabled') &&
            !bool(props, 'isShadowEnabled', true) &&
            'peaui-card-panel--hover-enabled',
          `peaui-card-panel--background-${text(props, 'backgroundColor', 'default')}`,
          `peaui-card-panel--border-${text(props, 'borderColor', 'default')}`,
          `peaui-card-panel--size-${text(props, 'size', 'm')}`,
          props.className,
        ),
        ref: forwardedRef,
        style: props.style,
      },
      <>
        {node(props, 'header') ? (
          <header className="peaui-card-panel__header">{node(props, 'header')}</header>
        ) : null}
        <div
          className={cx(
            'peaui-card-panel__content',
            Boolean(node(props, 'header')) && 'peaui-card-panel__content--with-header',
          )}
        >
          {props.children}
        </div>
      </>,
    );
  }
  if (kind === 'PageLayout')
    return (
      <div
        {...common(props)}
        className={cx('peaui-page-layout', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        {node(props, 'top') ? (
          <header
            className={cx(
              'peaui-page-layout__top',
              bool(props, 'isHeaderSticky') && 'peaui-page-layout__top--sticky',
            )}
          >
            {node(props, 'top')}
          </header>
        ) : null}
        <main className="peaui-page-layout__content">
          {node(props, 'additional') ? (
            <div className="peaui-page-layout__additional">{node(props, 'additional')}</div>
          ) : null}
          <div className="peaui-page-layout__body">{props.children}</div>
        </main>
        {node(props, 'footer') ? (
          <footer className="peaui-page-layout__footer">{node(props, 'footer')}</footer>
        ) : null}
      </div>
    );
  return <Fullscreen props={props} forwardedRef={forwardedRef} />;
}

function Fullscreen({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const root = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const listener = (): void => setActive(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', listener);
    return () => document.removeEventListener('fullscreenchange', listener);
  }, []);
  const toggle = (): void => {
    if (active) void document.exitFullscreen();
    else if (root.current) void root.current.requestFullscreen();
  };
  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-fullscreen-container',
        active && 'peaui-fullscreen-container--fullscreen',
        props.className,
      )}
      ref={(element) => {
        root.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
    >
      <div className="peaui-fullscreen-container__content">
        <div className="peaui-fullscreen-container__content-inner">{props.children}</div>
      </div>
      <div className="peaui-fullscreen-container__actions">
        <button
          aria-label={
            active
              ? text(props, 'closeLabel', 'Zamknij pełny ekran')
              : text(props, 'openLabel', 'Otwórz pełny ekran')
          }
          aria-pressed={active}
          className="peaui-fullscreen-container__toggle"
          type="button"
          onClick={toggle}
        >
          <Svg
            className="peaui-fullscreen-container__toggle-icon"
            name={active ? 'compressArrows' : 'expandArrows'}
          />
          <span className="peaui-fullscreen-container__toggle-label">
            {active ? 'Zamknij pełny ekran' : 'Otwórz pełny ekran'}
          </span>
        </button>
      </div>
    </div>
  );
}

function NavigationRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'PaginationControl') return <Pagination props={props} forwardedRef={forwardedRef} />;
  if (kind === 'ListLimitControl') {
    const [limit, setLimit] = useModel<number>(props, 'limit', 10);
    const list = Array.isArray(props.limitList)
      ? props.limitList.filter((item): item is number => typeof item === 'number')
      : [5, 10, 25, 50];
    const position = text(props, 'position', 'bottom');
    const id = text(props, 'id') || useId();
    return (
      <div
        {...common(props)}
        className={cx(
          'peaui-list-limit-control',
          `peaui-list-limit-control--position-${position}`,
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        role="group"
      >
        <label className="peaui-list-limit-control__label" htmlFor={`page-size-${id}`}>
          {text(props, 'label')}
        </label>
        <SelectRenderer
          __name="FormSelect"
          className={cx(
            'peaui-list-limit-control__select',
            `peaui-list-limit-control__select--position-${position}`,
          )}
          id={`page-size-${id}`}
          name={`page-size-${id}`}
          options={list.map((item) => ({ label: String(item), value: item }))}
          placement={position}
          searchable={false}
          size="xs"
          value={String(limit)}
          onValueChange={(next: unknown) => setLimit(Number(next))}
        />
      </div>
    );
  }
  if (kind === 'Breadcrumbs') {
    const options = asOptions(props.items);
    return (
      <nav
        {...common(props)}
        className={cx('peaui-breadcrumbs', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLElement>}
      >
        <div className="peaui-breadcrumbs__mobile">
          <span className="peaui-breadcrumbs__popover">•••</span>
          <span aria-hidden="true" className="peaui-breadcrumbs__separator">
            {text(props, 'separator', '/')}
          </span>
          <span aria-current="page" className="peaui-breadcrumbs__current">
            {options.at(-1)?.label}
          </span>
        </div>
        <ol className="peaui-breadcrumbs__content">
          {options.map((item, index) => (
            <li key={item.id ?? String(index)} className="peaui-breadcrumbs__item">
              {index ? (
                <span aria-hidden="true" className="peaui-breadcrumbs__separator">
                  {text(props, 'separator', '/')}
                </span>
              ) : null}
              {index === options.length - 1 ? (
                <span aria-current="page" className="peaui-breadcrumbs__current">
                  {item.label}
                </span>
              ) : (
                <a
                  className="peaui-breadcrumbs__button"
                  href={typeof item.value === 'string' ? item.value : '#'}
                  onClick={(event) => callback(props, 'onNavigate')?.(item, event)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
  if (kind === 'NavigationTabs') {
    const options = asOptions(props.tabs);
    return (
      <nav
        {...common(props)}
        className={cx(
          'peaui-navigation-tabs',
          !bool(props, 'withBackround', true) && 'peaui-navigation-tabs--without-background',
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLElement>}
      >
        {options.map((item, index) => (
          <button
            key={item.id ?? String(item.value ?? index)}
            aria-pressed={item.active}
            className={cx(
              'peaui-navigation-tabs__button',
              item.active && 'peaui-navigation-tabs__button--active',
              item.disabled && 'peaui-navigation-tabs__button--disabled',
              item.isValid === false && 'peaui-navigation-tabs__button--invalid',
            )}
            disabled={item.disabled}
            type="button"
            onClick={() => callback(props, 'onSelect')?.(item)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    );
  }
  if (kind === 'NavigationStepper') {
    const records = Array.isArray(props.options)
      ? props.options.filter(
          (entry): entry is RuntimeProps => typeof entry === 'object' && entry !== null,
        )
      : [];
    return (
      <div
        {...common(props)}
        className={cx('peaui-navigation-stepper', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <button
          aria-label="Przewiń do poprzednich kroków"
          className="peaui-navigation-stepper__control peaui-navigation-stepper__control--prev peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
          disabled
          type="button"
        >
          <Svg
            className="peaui-navigation-stepper__control-icon peaui-navigation-stepper__control-icon--prev"
            name="arrow"
          />
        </button>
        <nav
          className="peaui-navigation-stepper__viewport"
          aria-label={text(props, 'ariaLabel', 'Nawigacja kroków')}
        >
          <ol className="peaui-navigation-stepper__list">
            {records.map((item, index) => {
              const status = text(item, 'status', item.active === true ? 'during' : 'default');
              const selectable =
                status === 'during' || status === 'complete' || item.active === true;
              return (
                <li
                  key={text(item, 'key', String(index))}
                  className="peaui-navigation-stepper__item"
                >
                  <button
                    aria-current={item.active === true || status === 'during' ? 'step' : undefined}
                    className={cx(
                      'peaui-navigation-stepper__step',
                      `peaui-navigation-stepper__step--status-${status}`,
                      (item.active === true || status === 'during') &&
                        'peaui-navigation-stepper__step--current',
                      !selectable && 'peaui-navigation-stepper__step--disabled',
                    )}
                    disabled={!selectable}
                    type="button"
                    onClick={() => callback(props, 'onSelect')?.(item)}
                  >
                    <span className="peaui-navigation-stepper__status">
                      {status === 'complete' ? (
                        <Svg className="peaui-navigation-stepper__status-icon" name="check" />
                      ) : (
                        text(item, 'number', String(index + 1))
                      )}
                    </span>
                    <span
                      className={cx(
                        'peaui-navigation-stepper__label',
                        `peaui-navigation-stepper__label--status-${status}`,
                      )}
                    >
                      {text(item, 'label')}
                    </span>
                    <span
                      className={cx(
                        'peaui-navigation-stepper__status-label',
                        `peaui-navigation-stepper__status-label--status-${status}`,
                      )}
                    >
                      {status === 'complete'
                        ? 'Gotowe'
                        : status === 'during'
                          ? 'W trakcie'
                          : status === 'disabled'
                            ? 'Zablokowane'
                            : 'Do zrobienia'}
                    </span>
                    {node(item, 'additional') ? (
                      <span className="peaui-navigation-stepper__additional">
                        {node(item, 'additional')}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <button
          aria-label="Przewiń do następnych kroków"
          className="peaui-navigation-stepper__control peaui-navigation-stepper__control--next peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
          disabled
          type="button"
        >
          <Svg
            className="peaui-navigation-stepper__control-icon peaui-navigation-stepper__control-icon--next"
            name="arrow"
          />
        </button>
      </div>
    );
  }
  if (kind === 'NavigationDisclosureCard') {
    const [open, setOpen] = useState(bool(props, 'open'));
    const path = text(props, 'path');
    const root = 'peaui-navigation-disclosure-card';
    const inner = (
      <div className={`${root}__summary-inner`}>
        <div className={`${root}__summary-content`}>
          <div className={`${root}__header`}>
            <div className={`${root}__title-group`}>
              <h3 className={`${root}__title`}>{text(props, 'title')}</h3>
              {node(props, 'titleAdditional')}
            </div>
            <div className={`${root}__description-additional`}>
              {node(props, 'descriptionAdditional')}
            </div>
          </div>
          <div className={`${root}__description-row`}>
            <p className={`${root}__description`}>{text(props, 'description')}</p>
            <span
              aria-hidden="true"
              className={cx(
                `${root}__action`,
                path ? `${root}__action--link` : `${root}__action--disclosure`,
              )}
            >
              <Svg
                className={cx(
                  `${root}__icon`,
                  path && `${root}__icon--link`,
                  !path && open && `${root}__icon--open`,
                )}
                name={path ? 'arrowRight' : 'arrow'}
              />
            </span>
          </div>
        </div>
      </div>
    );
    if (path)
      return (
        <div
          {...common(props)}
          className={cx(root, `${root}--link`, props.className)}
          ref={forwardedRef as ForwardedRef<HTMLDivElement>}
        >
          <a className={`${root}__summary ${root}__summary--link`} href={path}>
            {inner}
          </a>
          {bool(props, 'open') && props.children ? (
            <div className={`${root}__content`} role="region">
              {props.children}
            </div>
          ) : null}
        </div>
      );
    return (
      <details
        {...common(props)}
        className={cx(root, `${root}--disclosure`, open && `${root}--open`, props.className)}
        open={open}
        ref={forwardedRef as ForwardedRef<HTMLDetailsElement>}
      >
        <summary
          aria-expanded={open}
          className={`${root}__summary ${root}__summary--disclosure`}
          onClick={(event) => {
            event.preventDefault();
            setOpen((current) => !current);
          }}
        >
          {inner}
        </summary>
        {open && props.children ? (
          <div className={`${root}__content`} role="region">
            {props.children}
          </div>
        ) : null}
      </details>
    );
  }
  if (kind === 'NavigationLink')
    return (
      <a
        {...common(props)}
        className={cx(
          'peaui-navigation-link',
          `peaui-navigation-link--size-${text(props, 'size', 'm')}`,
          `peaui-navigation-link--variant-${text(props, 'variant', 'default')}`,
          props.className,
        )}
        href={text(props, 'path')}
        ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
      >
        {props.children}
      </a>
    );
  if (kind === 'NavigationIconCard')
    return (
      <a
        {...common(props)}
        className={cx('peaui-navigation-icon-card', props.className)}
        href={text(props, 'path') || undefined}
        ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
      >
        <Svg
          className="peaui-navigation-icon-card__icon"
          name={text(props, 'icon', 'arrowRight')}
        />
        <strong className="peaui-navigation-icon-card__text">{text(props, 'text')}</strong>
      </a>
    );
  const variant = text(props, 'variant', 'default');
  const locked = variant === 'disabled' || variant === 'hidden';
  const path = text(props, 'path');
  const cardContent = (
    <>
      <div className="peaui-navigation-card__content">
        <h4
          className={cx(
            'peaui-navigation-card__title',
            `peaui-navigation-card__title--size-${text(props, 'size', 'm')}`,
            locked && 'peaui-navigation-card__title--locked',
          )}
        >
          {text(props, 'title')}
        </h4>
        <p
          className={cx(
            'peaui-navigation-card__description',
            locked && 'peaui-navigation-card__description--locked',
          )}
        >
          {text(props, 'description')}
        </p>
      </div>
      <div
        aria-hidden="true"
        className={cx(
          'peaui-navigation-card__icon',
          `peaui-navigation-card__icon--variant-${variant}`,
        )}
      >
        <Svg
          className={cx(
            'peaui-navigation-card__icon-symbol',
            !locked && variant !== 'complete' && 'peaui-navigation-card__icon-symbol--arrow',
          )}
          name={variant === 'complete' ? 'progressFinish' : locked ? 'lock' : 'arrow'}
        />
      </div>
    </>
  );
  const cardClasses = cx(
    'peaui-navigation-card',
    `peaui-navigation-card--variant-${variant}`,
    path && !locked ? 'peaui-navigation-card--interactive' : 'peaui-navigation-card--static',
    props.className,
  );
  return path && !locked ? (
    <a
      {...common(props)}
      className={cardClasses}
      href={path}
      ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
    >
      {cardContent}
    </a>
  ) : (
    <div
      {...common(props)}
      className={cardClasses}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      {cardContent}
    </div>
  );
}

function Pagination({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const total = Math.max(1, num(props, 'totalPages', 1));
  const [page, setPage] = useModel<number>(props, 'page', 1);
  const current = Math.min(total, Math.max(1, page));
  const pages = useMemo(() => {
    const start = current <= 2 ? 1 : current >= total - 1 ? Math.max(1, total - 3) : current - 1;
    return Array.from({ length: Math.min(total, 4) }, (_, index) => start + index);
  }, [current, total]);
  const showLeading = total > 5 && total - current < 5;
  const showTrailing = total - current >= 5;
  const pageButton = (item: number): ReactElement => (
    <button
      key={item}
      aria-current={item === current ? 'page' : undefined}
      className={cx(
        'peaui-pagination-control__button',
        'peaui-pagination-control__button--page',
        item === current && 'peaui-pagination-control__button--current',
      )}
      disabled={item === current}
      type="button"
      onClick={() => setPage(item)}
    >
      {item}
    </button>
  );
  return (
    <nav
      {...common(props)}
      aria-label={text(props, 'ariaLabel', 'Paginacja')}
      className={cx('peaui-pagination-control', props.className)}
      data-current-page={current}
      data-total-pages={total}
      ref={forwardedRef as ForwardedRef<HTMLElement>}
    >
      <div className="peaui-pagination-control__controls peaui-pagination-control__controls--start">
        <button
          aria-label="Przejdź do pierwszej strony"
          className="peaui-pagination-control__button"
          disabled={current === 1}
          type="button"
          onClick={() => setPage(1)}
        >
          <Svg
            className="peaui-pagination-control__icon peaui-pagination-control__icon--first"
            name="doubleArrowRounded"
          />
        </button>
        <button
          aria-label="Przejdź do poprzedniej strony"
          className="peaui-pagination-control__button"
          disabled={current === 1}
          type="button"
          onClick={() => setPage(current - 1)}
        >
          <Svg
            className="peaui-pagination-control__icon peaui-pagination-control__icon--previous"
            name="arrowRounded"
          />
        </button>
      </div>
      <div className="peaui-pagination-control__pages">
        {showLeading ? pageButton(1) : null}
        {showLeading ? (
          <div aria-hidden="true" className="peaui-pagination-control__ellipsis">
            ...
          </div>
        ) : null}
        {pages.map(pageButton)}
        {showTrailing ? (
          <div aria-hidden="true" className="peaui-pagination-control__ellipsis">
            ...
          </div>
        ) : null}
        {showTrailing ? pageButton(total) : null}
      </div>
      <div className="peaui-pagination-control__controls peaui-pagination-control__controls--end">
        <button
          aria-label="Przejdź do kolejnej strony"
          className="peaui-pagination-control__button"
          disabled={current === total}
          type="button"
          onClick={() => setPage(current + 1)}
        >
          <Svg
            className="peaui-pagination-control__icon peaui-pagination-control__icon--next"
            name="arrowRounded"
          />
        </button>
        <button
          aria-label="Przejdź do ostatniej strony"
          className="peaui-pagination-control__button"
          disabled={current === total}
          type="button"
          onClick={() => setPage(total)}
        >
          <Svg
            className="peaui-pagination-control__icon peaui-pagination-control__icon--last"
            name="doubleArrowRounded"
          />
        </button>
      </div>
    </nav>
  );
}

function OverlayRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'ModalDialog' || kind === 'DrawerPanel')
    return <Dialog props={props} kind={kind} forwardedRef={forwardedRef} />;
  if (kind === 'InfoTooltip')
    return <InfoTooltipRenderer props={props} forwardedRef={forwardedRef} />;
  return <Popover props={props} kind={kind} forwardedRef={forwardedRef} />;
}

function InfoTooltipRenderer({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const disabled = bool(props, 'disabled');
  const tooltipId = `info-tooltip-react-${useId().replaceAll(':', '')}`;
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [triggerMode, setTriggerMode] = useState<'own' | 'descendant' | 'ancestor'>('own');
  const [open, setOpen] = useState(false);
  const triggerContent = props.children ?? <Svg name="info" />;
  const commonProps = common(props);
  const baseTestId = text(props, 'dataTestId');
  const sharedStyles = { '--unique-anchor': `--anchor-${tooltipId}` } as CSSProperties;
  const managesOwnTrigger = !disabled && triggerMode === 'own';
  const describedByIds = new Set(
    (commonProps['aria-describedby'] ?? '').split(/\s+/).filter(Boolean),
  );

  if (managesOwnTrigger) describedByIds.add(tooltipId);

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger || disabled) {
      setOpen(false);
      return;
    }

    const focusableDescendants = Array.from(
      trigger.querySelectorAll<HTMLElement>(INFO_TOOLTIP_FOCUSABLE_TRIGGER_SELECTOR),
    );
    let managedAncestor: HTMLElement | null = null;

    if (focusableDescendants.length === 0) {
      let currentElement = trigger.parentElement;

      while (currentElement) {
        if (currentElement.matches(INFO_TOOLTIP_MANAGED_TRIGGER_ANCESTOR_SELECTOR)) {
          managedAncestor = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
    }

    const describedTriggers =
      focusableDescendants.length > 0
        ? focusableDescendants
        : managedAncestor
          ? [managedAncestor]
          : [];
    const nextMode =
      focusableDescendants.length > 0 ? 'descendant' : managedAncestor ? 'ancestor' : 'own';

    setTriggerMode(nextMode);
    describedTriggers.forEach((element) => addDescriptionId(element, tooltipId));

    const handleAncestorFocusIn = (): void => setOpen(true);
    const handleAncestorFocusOut = (event: FocusEvent): void => {
      const relatedTarget = event.relatedTarget;
      if (relatedTarget instanceof Node && managedAncestor?.contains(relatedTarget)) return;
      setOpen(false);
    };

    if (managedAncestor) {
      managedAncestor.addEventListener('focusin', handleAncestorFocusIn);
      managedAncestor.addEventListener('focusout', handleAncestorFocusOut);
    }

    return () => {
      describedTriggers.forEach((element) => removeDescriptionId(element, tooltipId));
      managedAncestor?.removeEventListener('focusin', handleAncestorFocusIn);
      managedAncestor?.removeEventListener('focusout', handleAncestorFocusOut);
    };
  }, [disabled, props.children, tooltipId]);

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <div
        {...commonProps}
        aria-describedby={describedByIds.size > 0 ? [...describedByIds].join(' ') : undefined}
        aria-label={
          commonProps['aria-label'] ??
          (managesOwnTrigger &&
          !commonProps['aria-labelledby'] &&
          !hasVisibleReactText(triggerContent)
            ? INFO_TOOLTIP_DEFAULT_ARIA_LABEL
            : undefined)
        }
        className={cx(
          'peaui-info-tooltip',
          disabled && 'peaui-info-tooltip--disabled',
          props.className,
        )}
        data-open={open && !disabled ? 'true' : undefined}
        data-testid={baseTestId ? `${baseTestId}-content` : dataTest(props)}
        ref={(element) => {
          triggerRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        role={commonProps.role ?? (managesOwnTrigger ? 'button' : undefined)}
        style={{ ...props.style, ...sharedStyles }}
        tabIndex={commonProps.tabIndex ?? (managesOwnTrigger ? 0 : undefined)}
        onBlur={handleBlur}
        onFocus={() => !disabled && setOpen(true)}
        onMouseEnter={() => !disabled && setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {triggerContent}
      </div>
      <div
        aria-hidden={disabled ? 'true' : undefined}
        className={cx(
          'peaui-info-tooltip__content',
          `peaui-info-tooltip__content--variant-${text(props, 'variant', 'default')}`,
          `peaui-info-tooltip__content--placement-${text(props, 'placement', 'top')}`,
        )}
        data-testid={baseTestId ? `${baseTestId}-tooltip` : undefined}
        id={tooltipId}
        role="tooltip"
        style={sharedStyles}
      >
        {node(props, 'title') ? (
          <strong
            className="peaui-info-tooltip__title"
            data-testid={baseTestId ? `${baseTestId}-title` : undefined}
          >
            {node(props, 'title')}
          </strong>
        ) : null}
        {node(props, 'description') ? (
          <p
            className="peaui-info-tooltip__description"
            data-testid={baseTestId ? `${baseTestId}-description` : undefined}
          >
            {node(props, 'description')}
          </p>
        ) : null}
      </div>
    </>
  );
}

function Dialog({
  props,
  kind,
  forwardedRef,
}: {
  props: RuntimeProps;
  kind: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const [open, setOpen] = useModel<boolean>(props, 'open', false);
  const dialog = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  const root = kind === 'DrawerPanel' ? 'peaui-drawer-panel' : 'peaui-modal-dialog';
  return (
    <dialog
      {...common(props)}
      aria-label={text(props, 'ariaLabel')}
      className={cx(root, props.className)}
      ref={(element) => {
        dialog.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
      onCancel={(event) => {
        event.preventDefault();
        setOpen(false);
      }}
      onClose={() => setOpen(false)}
    >
      <div className={`${root}__inner`}>
        {node(props, 'header') ? (
          <header className={`${root}__header`}>{node(props, 'header')}</header>
        ) : null}
        {props.children}
      </div>
    </dialog>
  );
}

function Popover({
  props,
  kind,
  forwardedRef,
}: {
  props: RuntimeProps;
  kind: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const popoverRef = useNativePopover(open);
  const root = kind === 'PopoverButton' ? 'peaui-popover-button' : 'peaui-popover-overlayer';
  const popoverId = `peaui-popover-${useId().replaceAll(':', '')}`;
  const sharedStyles = { '--unique-anchor': `--anchor-${popoverId}` } as CSSProperties;
  const toggle = (): void => {
    if (bool(props, 'disabled')) return;
    const next = !open;
    setOpen(next);
    callback(props, 'onOpenChange')?.(next);
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
          aria-controls={popoverId}
          aria-expanded={open}
          aria-haspopup={text(props, 'popupType', 'dialog') as 'dialog'}
          className={rootClasses}
          disabled={bool(props, 'disabled')}
          ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
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
          aria-controls={popoverId}
          aria-disabled={bool(props, 'disabled') || undefined}
          aria-expanded={open}
          aria-haspopup={text(props, 'popupType', 'dialog') as 'dialog'}
          className={rootClasses}
          ref={forwardedRef as ForwardedRef<HTMLDivElement>}
          role="button"
          style={{ ...props.style, ...sharedStyles }}
          tabIndex={bool(props, 'disabled') ? -1 : 0}
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
        popover={getNativePopoverValue()}
        ref={popoverRef}
        role={text(props, 'popupType', 'dialog')}
        style={sharedStyles}
        onToggle={(event) => {
          if (event.nativeEvent.newState !== 'closed' || !open) return;
          setOpen(false);
          callback(props, 'onOpenChange')?.(false);
        }}
      >
        {node(props, 'content')}
      </div>
    </>
  );
}

const groupByName: Partial<Record<ReactComponentName, RuntimeComponent>> = {
  ImageView: BasicRenderer,
  SvgIcon: BasicRenderer,
  Avatar: DisplayRenderer,
  AvatarGroup: AvatarGroupRenderer,
  CalculationResults: DisplayRenderer,
  CardCarousel: DisplayRenderer,
  CounterBadge: DisplayRenderer,
  DescriptionField: DisplayRenderer,
  DisclosurePanel: DisplayRenderer,
  KeyboardKey: DisplayRenderer,
  SectionHeading: DisplayRenderer,
  TableList: DisplayRenderer,
  TableListFooter: DisplayRenderer,
  TableListHeader: DisplayRenderer,
  TagChip: DisplayRenderer,
  TreeList: DisplayRenderer,
  ButtonAction: ButtonRenderer,
  ButtonExport: ButtonRenderer,
  InputSlider: FormRenderer,
  InlineEdit: InlineEditRuntimeRenderer,
  CopyButton: CopyButtonRuntimeRenderer,
  SearchInput: FormRenderer,
  SelectableCard: ButtonRenderer,
  ToggleButton: ToggleButtonRenderer,
  ToggleGroup: ToggleGroupRenderer,
  SegmentedControl: SegmentedControlRenderer,
  SplitButton: SplitButtonRenderer,
  EmptyState: FeedbackRenderer,
  MessageText: FeedbackRenderer,
  ProgressIndicator: FeedbackRenderer,
  SkeletonLoading: FeedbackRenderer,
  SpinnerLoader: FeedbackRenderer,
  ToastAlert: FeedbackRenderer,
  FormFieldLabel: FormRenderer,
  FormButtonCheckbox: FormRenderer,
  FormButtonGroup: FormRenderer,
  FormCheckbox: FormRenderer,
  FormContainer: FormRenderer,
  FormDatePicker: FormRenderer,
  FormField: FormRenderer,
  FormFileUpload: FormRenderer,
  FormFileUploadSimple: FormRenderer,
  FormInput: FormRenderer,
  FormMultiSelect: FormRenderer,
  FormNumber: FormRenderer,
  FormPassword: FormRenderer,
  FormRadio: FormRenderer,
  FormSelect: FormRenderer,
  FormTextarea: FormRenderer,
  FormYearPicker: FormRenderer,
  FormSwitchToggle: FormRenderer,
  CardPanel: LayoutRenderer,
  FullscreenContainer: LayoutRenderer,
  GridItem: LayoutRenderer,
  GridSection: LayoutRenderer,
  PageLayout: LayoutRenderer,
  SectionDivider: LayoutRenderer,
  Breadcrumbs: NavigationRenderer,
  ContextMenu: ContextMenuRenderer,
  DropdownMenu: DropdownMenuRenderer,
  MenuBar: MenuBarRenderer,
  ListLimitControl: NavigationRenderer,
  NavigationCard: NavigationRenderer,
  NavigationDisclosureCard: NavigationRenderer,
  NavigationIconCard: NavigationRenderer,
  NavigationLink: NavigationRenderer,
  NavigationStepper: NavigationRenderer,
  NavigationTabs: NavigationRenderer,
  PaginationControl: NavigationRenderer,
  DrawerPanel: OverlayRenderer,
  InfoTooltip: OverlayRenderer,
  ModalDialog: OverlayRenderer,
  PopoverButton: OverlayRenderer,
  PopoverOverlayer: OverlayRenderer,
};

export function createPeauiReactComponent<Name extends ReactComponentName>(
  name: Name,
): ComponentType<PeauiReactProps<Name>> {
  const Renderer = groupByName[name];
  if (!Renderer) {
    throw new Error(`[PeaUI React] Missing renderer for ${name}.`);
  }
  const Component = forwardRef<HTMLElement, RuntimeProps>((props, ref) =>
    createElement(Renderer, { ...props, __name: name, forwardedRef: ref }),
  );
  Component.displayName = name;
  return Component as unknown as ComponentType<PeauiReactProps<Name>>;
}
