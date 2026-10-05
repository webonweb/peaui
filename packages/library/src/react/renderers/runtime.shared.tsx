/** @jsxImportSource react */
/* eslint-disable no-nested-ternary */
import {
  type ReactNode,
  type CSSProperties,
  type ComponentType,
  type ForwardedRef,
  type MouseEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
  isValidElement,
  Children,
  useState,
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from 'react';
import { observeControlReset } from '../../helpers/form-reset.helper';

export type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type RuntimeComponent = ComponentType<
  RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }
>;

export type Option = {
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  icon?: string;
  id?: string;
  isValid?: boolean;
  label: string;
  value?: unknown;
};

export const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

export const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

export const bool = (props: RuntimeProps, name: string, fallback = false): boolean => {
  const value = props[name];
  return typeof value === 'boolean' ? value : fallback;
};

export const num = (props: RuntimeProps, name: string, fallback = 0): number => {
  const value = props[name];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

export const node = (props: RuntimeProps, name: string): ReactNode => props[name] as ReactNode;

export const callback = (
  props: RuntimeProps,
  name: string,
): ((...values: unknown[]) => void) | undefined => {
  const value = props[name];
  return typeof value === 'function' ? (value as (...values: unknown[]) => void) : undefined;
};

export const dataTest = (props: RuntimeProps): string | undefined => {
  const direct = props['data-testid'];
  if (typeof direct === 'string') return direct;
  const camel = props.dataTestId;
  return typeof camel === 'string' ? camel : undefined;
};

export const ariaBoolean = (value: unknown): boolean | 'true' | 'false' | undefined => {
  if (value === true || value === false || value === 'true' || value === 'false') return value;
  return undefined;
};

export const nativeAttributes = (props: RuntimeProps): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(props).filter(
      ([key]) =>
        /^(?:aria-|data-)/.test(key) ||
        /^(?:id|title|lang|dir|hidden|accessKey|draggable|spellCheck|translate|name|value|form|formAction|formEncType|formMethod|formNoValidate|formTarget)$/.test(
          key,
        ) ||
        /^on(?:Focus|Blur|DoubleClick|MouseEnter|MouseLeave|MouseDown|MouseUp|PointerUp|PointerEnter|PointerLeave|KeyUp|TouchStart|TouchEnd)(?:Capture)?$/.test(
          key,
        ),
    ),
  );

/** Attributes specific to native anchors; keep them off non-link containers. */
export const anchorAttributes = (props: RuntimeProps): Record<string, unknown> => ({
  target: text(props, 'target') || undefined,
  rel: text(props, 'rel') || undefined,
  download: props.download,
  hrefLang: text(props, 'hrefLang') || undefined,
  referrerPolicy: text(props, 'referrerPolicy') || undefined,
  ping: text(props, 'ping') || undefined,
  type: text(props, 'type') || undefined,
});

export const common = (props: RuntimeProps) => ({
  ...nativeAttributes(props),
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

export function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest('a, button, input, select, textarea, [role="button"]'))
  );
}

export function hasVisibleReactText(value: ReactNode): boolean {
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

export function copyTextToClipboard(value: string): void {
  try {
    void navigator.clipboard.writeText(value).catch(() => undefined);
  } catch {
    // Clipboard API is unavailable in some browsers and non-secure contexts.
  }
}

export function asOptions(value: unknown): Option[] {
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

export function useModel<T>(
  props: RuntimeProps,
  name: string,
  fallback: T,
  controlledByPresence = false,
): readonly [T, (value: T) => void, (value: T) => void] {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const controlled = props[name] as T | undefined;
  const isControlled = controlledByPresence
    ? Object.prototype.hasOwnProperty.call(props, name)
    : controlled !== undefined;
  const defaultValue = props[`default${capitalized}`] as T | undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? fallback);
  const value = isControlled ? (controlled as T) : internal;
  const onChange = callback(props, `on${capitalized}Change`);
  const setValue = useCallback(
    (next: T): void => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue, setInternal] as const;
}

/** Adds native form reset only to adapters backed by a form control. */
export function useFormReset(control: RefObject<HTMLElement | null>, reset: () => void): void {
  const latestReset = useRef(reset);
  latestReset.current = reset;
  useEffect(() => {
    const element = control.current;
    if (element) return observeControlReset(element, () => latestReset.current());
    return undefined;
  }, [control]);
}

export function useFormControlModel<T>(
  props: RuntimeProps,
  name: string,
  fallback: T,
  control: RefObject<HTMLElement | null>,
  controlledByPresence = false,
  onReset?: (value: T) => void,
): readonly [T, (value: T) => void] {
  const [value, setValue, resetInternal] = useModel(props, name, fallback, controlledByPresence);
  const initial = useRef(
    (props[`default${name.charAt(0).toUpperCase()}${name.slice(1)}`] as T | undefined) ?? fallback,
  );
  const current = useRef(false);
  current.current = controlledByPresence
    ? Object.prototype.hasOwnProperty.call(props, name)
    : props[name] !== undefined;
  useFormReset(control, () => {
    if (!current.current) {
      const next = initial.current;
      resetInternal(Array.isArray(next) ? ([...next] as T) : next);
      onReset?.(next);
    } else {
      // The owner keeps the controlled model; drafts still return to its current value.
      onReset?.(value);
    }
  });
  return [value, setValue];
}
