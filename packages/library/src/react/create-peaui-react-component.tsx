/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  Children,
  createElement,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { reactIconData } from './generated-icon-data';
import type { PeauiReactProps, ReactComponentName } from './generated-react-props';
import {
  evaluatePasswordStrength,
  PASSWORD_STRENGTH_SEGMENTS,
} from '../components/form/FormPassword/strength.helper';

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
  actionName?: string;
  align?: string;
  inline?: boolean;
  key: string;
  label?: string;
  name?: string;
  sortable?: boolean;
  type?: string;
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

const common = (props: RuntimeProps) => ({
  className: props.className,
  style: props.style,
  role: typeof props.role === 'string' ? props.role : undefined,
  tabIndex: typeof props.tabIndex === 'number' ? props.tabIndex : undefined,
  'data-testid': dataTest(props),
  'aria-label': text(props, 'ariaLabel') || text(props, 'aria-label') || undefined,
  'aria-describedby': text(props, 'aria-describedby') || undefined,
  'aria-labelledby': text(props, 'aria-labelledby') || undefined,
  onClick: typeof props.onClick === 'function' ? props.onClick : undefined,
  onKeyDown: typeof props.onKeyDown === 'function' ? props.onKeyDown : undefined,
  onPointerDown: typeof props.onPointerDown === 'function' ? props.onPointerDown : undefined,
});

type NativePopoverElement = HTMLDivElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

const nativePopoverValue = (): 'auto' | undefined =>
  typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'
    ? 'auto'
    : undefined;

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest('a, button, input, select, textarea, [role="button"]'))
  );
}

function useNativePopover(open: boolean): React.RefObject<NativePopoverElement | null> {
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

function Svg({
  name,
  className,
  label,
}: {
  name: string;
  className?: string;
  label?: string;
}): ReactElement {
  const icon = reactIconData[name] ?? reactIconData.info;
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cx('peaui-svg-icon', className)}
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      focusable="false"
      role={label ? 'img' : undefined}
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
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
          role="alert"
        >
          <Svg className="peaui-message-text__icon" name="hint" />
          <p className="peaui-message-text__content">{node(props, 'error')}</p>
        </div>
      ) : null}
      {hasSuccess && !hasError ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-success peaui-message-text--size-xs`}
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
        className={props.className}
        label={text(props, 'ariaLabel') || undefined}
        name={text(props, 'name', 'info')}
      />
    );
  if (kind === 'ImageView') {
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
  const [image, setImage] = useModel<unknown>(props, 'image', undefined);
  const source =
    typeof image === 'string' ? image : image instanceof Blob ? URL.createObjectURL(image) : '';
  return (
    <section
      {...common(props)}
      className={cx('peaui-photo-editior', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLElement>}
    >
      <div className="peaui-photo-editior__instruction peaui-message-text peaui-message-text--variant-info peaui-message-text--size-s">
        <p className="peaui-message-text__content">
          Użyj kontrolek, aby wykadrować, obrócić i dopasować zdjęcie.
        </p>
      </div>
      <div
        aria-label="Podgląd przycinania zdjęcia"
        className="peaui-photo-editior__workspace peaui-photo-editior__workspace--fixed-height"
        role="group"
        tabIndex={0}
      >
        {source ? (
          <img
            alt={text(props, 'ariaLabel', 'Edytowany obraz')}
            className="peaui-photo-editior__cropper"
            src={source}
          />
        ) : (
          <div className="peaui-photo-editior__cropper">Brak obrazu do edycji</div>
        )}
      </div>
      <div aria-label="Obrót zdjęcia" className="peaui-photo-editior__toolbar" role="group">
        <button
          className="peaui-photo-editior__toolbar-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
          type="button"
        >
          Obróć w prawo <Svg name="redo" />
        </button>
        <button
          className="peaui-photo-editior__toolbar-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
          type="button"
        >
          Obróć w lewo <Svg name="undo" />
        </button>
      </div>
      <div className="peaui-photo-editior__settings">
        {[
          ['Powiększ', 'scale'],
          ['Wyrównaj', 'align'],
        ].map(([label, name]) => (
          <div key={name} className="peaui-photo-editior__setting">
            <strong className="peaui-photo-editior__setting-heading">{label}</strong>
            <input aria-label={label} max="1" min="0" name={name} step="0.1" type="range" />
          </div>
        ))}
      </div>
      <div aria-label="Akcje edytora zdjęcia" className="peaui-photo-editior__actions" role="group">
        <button
          className="peaui-photo-editior__action-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary"
          type="button"
          onClick={() => setImage(image)}
        >
          Zapisz
        </button>
        <button
          className="peaui-photo-editior__action-button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
          type="button"
          onClick={() => callback(props, 'onCancel')?.()}
        >
          Odrzuć
        </button>
      </div>
    </section>
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
  let paddingRight = after
    ? `${after.length * 7.5 + 12 + (canErase ? 16 : 0) + (iconAfter ? 24 : 0)}px`
    : iconAfter
      ? '32px'
      : '12px';
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
        kind === 'FormPassword' && bool(props, 'enablePasswordStrengthMeter')
          ? `${id}-strength-status`
          : undefined
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
          style={{ '--right': `${iconAfter ? 30 : 12}px` } as CSSProperties}
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
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
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
                '--pr': '32px',
                [`--${root}-input-padding-right`]: '2.75rem',
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
          {bool(props, 'canErase') && selected.some(Boolean) && !disabled ? (
            <button
              aria-label="Wyczyść wybór"
              className="peaui-form-field__erase-button"
              style={{ '--right': '30px' } as CSSProperties}
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
        popover={nativePopoverValue()}
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
  const [value, setValue] = useModel<unknown>(props, 'value', range ? {} : undefined);
  const root = kind === 'FormYearPicker' ? 'peaui-form-year-picker' : 'peaui-form-date-picker';
  const [open, setOpen] = useState(false);
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
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
  const today = viewDate;
  const selectedRecord =
    typeof value === 'object' && value !== null ? (value as RuntimeProps) : undefined;
  const normalized =
    selectedRecord === undefined
      ? typeof value === 'string' || typeof value === 'number'
        ? String(value)
        : ''
      : [selectedRecord.from ?? selectedRecord.start, selectedRecord.to ?? selectedRecord.end]
          .filter((item) => item !== undefined)
          .join(' – ');
  const selectValue = (next: string | number): void => {
    if (!range) {
      setValue(next);
      setOpen(false);
      return;
    }
    const current = selectedRecord ?? {};
    if (current.from === undefined && current.start === undefined) setValue({ from: next });
    else {
      setValue({ from: current.from ?? current.start, to: next });
      setOpen(false);
    }
  };
  const currentYear = today.getFullYear();
  const firstDayOffset = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), index - firstDayOffset + 1);
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      day: date.getDate(),
      outsideMonth: date.getMonth() !== today.getMonth(),
    };
  });
  const popoverRef = useNativePopover(open);
  const overlayerRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const id = text(props, 'id') || useId();
  const anchorName = `--anchor-peaui-${id.replaceAll(':', '')}`;
  const setOpenWithLayout = (next: boolean): void => {
    if (next) setTriggerWidth(overlayerRef.current?.getBoundingClientRect().width ?? 0);
    setOpen(next);
  };
  const pickerButtonRoot = `${root}-button`;
  const navigationRoot = `${root}-navigation`;
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
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
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
            ref={forwardedRef as ForwardedRef<HTMLInputElement>}
            role="combobox"
            style={{ '--pl': '12px', '--pr': '32px' } as CSSProperties}
            type="text"
            value={normalized}
            onClick={() => !readonly && setOpenWithLayout(!open)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpenWithLayout(false);
              if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                if (!readonly) setOpenWithLayout(true);
              }
            }}
          />
          {bool(props, 'canErase') && value && !disabled ? (
            <button
              aria-label="Usuń wartość pola"
              className="peaui-form-field__erase-button"
              style={{ '--right': '30px' } as CSSProperties}
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
        popover={nativePopoverValue()}
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
          aria-labelledby={`${id}-dialog-label`}
          aria-modal="false"
          className={`${root}__panel`}
          id={`${id}-dialog`}
          role="dialog"
        >
          {kind === 'FormYearPicker' ? (
            <>
              <div className={`${root}__header`}>
                <p className={`${root}__range`}>
                  {currentYear - 5}–{currentYear + 6}
                </p>
                <div className={navigationRoot}>
                  <button
                    aria-label="Poprzednie 10 lat"
                    className={`${navigationRoot}__button`}
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
              <div className={`${root}__grid`} role="grid">
                {Array.from({ length: 4 }, (_, rowIndex) => (
                  <div className={`${root}__row`} key={rowIndex} role="row">
                    {Array.from(
                      { length: 3 },
                      (_, columnIndex) => currentYear - 5 + rowIndex * 3 + columnIndex,
                    ).map((year) => (
                      <div className={`${root}__cell`} key={year} role="gridcell">
                        <button
                          className={cx(
                            pickerButtonRoot,
                            `${pickerButtonRoot}--variant-${Number(value) === year ? 'primary' : 'ghost'}`,
                          )}
                          type="button"
                          onClick={() => selectValue(year)}
                        >
                          <span className={`${pickerButtonRoot}__label`}>{year}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`${root}__sr-only`} id={`${id}-dialog-label`}>
                Wybierz datę
              </p>
              <div className={`${root}__header`}>
                <div className={`${root}__heading`}>
                  <button className={`${root}__heading-trigger`} type="button">
                    {today.toLocaleString('pl-PL', { month: 'long' })}
                  </button>
                  <button className={`${root}__heading-trigger`} type="button">
                    {today.getFullYear()}
                  </button>
                </div>
                <div className={navigationRoot}>
                  <button
                    aria-label="Poprzedni miesiąc"
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                      )
                    }
                  >
                    <Svg
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--previous`}
                      name="arrow"
                    />
                  </button>
                  <button
                    aria-label="Następny miesiąc"
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
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
              <div className={`${root}__grid ${root}__grid--day`} role="grid">
                <div className={`${root}__weekday-row`} role="row">
                  {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((weekday) => (
                    <div className={`${root}__weekday`} key={weekday} role="columnheader">
                      {weekday}
                    </div>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, rowIndex) => (
                  <div
                    className={`${root}__row ${root}__row--day`}
                    key={`day-row-${rowIndex}`}
                    role="row"
                  >
                    {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((calendarDay) => (
                      <div className={`${root}__cell`} key={calendarDay.date} role="gridcell">
                        <button
                          className={cx(
                            pickerButtonRoot,
                            `${pickerButtonRoot}--variant-${String(value) === calendarDay.date ? 'primary' : 'ghost'}`,
                            calendarDay.outsideMonth && `${root}__picker-button--outside-month`,
                          )}
                          type="button"
                          onClick={() => selectValue(calendarDay.date)}
                        >
                          <span className={`${pickerButtonRoot}__label`}>{calendarDay.day}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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

function FormRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
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
                  ? `${text(props, 'before').length * 7.5 + 14 + (text(props, 'iconBefore') ? 24 : 0)}px`
                  : text(props, 'iconBefore')
                    ? '32px'
                    : '12px',
                '--pr': text(props, 'after')
                  ? `${text(props, 'after').length * 7.5 + 12 + (text(props, 'iconAfter') ? 24 : 0)}px`
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
  if (kind === 'FieldLabel')
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
    return (
      <FormShell props={props}>
        {props.children ?? (
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
            value={text(props, 'value')}
            onChange={() => undefined}
          />
        )}
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
  const [open, setOpen] = useModel<boolean>(props, 'open', bool(props, 'allwaysOpen'));
  return (
    <details
      {...common(props)}
      className={cx('peaui-disclosure-panel', props.className)}
      open={open || bool(props, 'allwaysOpen')}
      ref={forwardedRef as ForwardedRef<HTMLDetailsElement>}
    >
      <summary
        aria-disabled={bool(props, 'disabled')}
        className={cx(
          'peaui-disclosure-panel__summary',
          (open || bool(props, 'allwaysOpen')) && 'peaui-disclosure-panel__summary--open',
          bool(props, 'disabled') && 'peaui-disclosure-panel__summary--disabled',
        )}
        onClick={(event) => {
          event.preventDefault();
          if (!bool(props, 'disabled') && !bool(props, 'allwaysOpen')) setOpen(!open);
        }}
      >
        <span className="peaui-disclosure-panel__title">
          {node(props, 'title') ?? text(props, 'title')}
        </span>
        <span className="peaui-disclosure-panel__meta">
          {node(props, 'additional') ? (
            <span className="peaui-disclosure-panel__additional">{node(props, 'additional')}</span>
          ) : null}
          {!bool(props, 'allwaysOpen') ? (
            <Svg className="peaui-disclosure-panel__icon" name="arrow" />
          ) : null}
        </span>
      </summary>
      <div
        className={cx(
          'peaui-disclosure-panel__content',
          (open || bool(props, 'allwaysOpen')) && 'peaui-disclosure-panel__content--open',
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

function TableRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const [filtersOpen, setFiltersOpen] = useModel<boolean>(props, 'filtersOpen', false);
  if (kind === 'TableListHeader')
    return (
      <header
        className={cx(
          'peaui-table-list-header',
          Boolean(node(props, 'description')) && 'peaui-table-list-header--with-description',
          props.className,
        )}
      >
        {node(props, 'description')}
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
        {node(props, 'addtionalContent')}
      </header>
    );
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
        actionName: typeof record.actionName === 'string' ? record.actionName : undefined,
        inline: record.inline === true,
        key,
        label:
          typeof record.label === 'string'
            ? record.label
            : typeof record.title === 'string'
              ? record.title
              : key,
        sortable: record.sortable === true,
        type: typeof record.type === 'string' ? record.type : undefined,
      },
    ];
  });
  const records = Array.isArray(props.records) ? props.records : [];
  const selected = new Set(Array.isArray(props.selectedRows) ? props.selectedRows.map(String) : []);
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
        bool(props, 'isDetials') && 'peaui-table-list--details',
        bool(props, 'isLoading') && 'peaui-table-list--loading',
        bool(props, 'scroll') && 'peaui-table-list--scroll',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
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
            {columns.map((column) => (
              <th
                key={column.key}
                className={cx(
                  'peaui-table-list__head-cell',
                  column.sortable && 'peaui-table-list__head-cell--sortable',
                )}
                scope="col"
              >
                <button
                  className={cx(
                    'peaui-table-list__head-button',
                    column.sortable && 'peaui-table-list__head-button--sortable',
                  )}
                  disabled={!column.sortable}
                  type="button"
                  onClick={() => callback(props, 'onSort')?.(column.key)}
                >
                  <span className="peaui-table-list__head-content">{column.label}</span>
                  {column.sortable ? (
                    <Svg className="peaui-table-list__sort-icon" name="sort" />
                  ) : null}
                </button>
              </th>
            ))}
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
                {columns.map((column) => (
                  <td key={column.key} className="peaui-table-list__body-cell">
                    {renderCell ? (
                      renderCell(column.key, record, rowIndex)
                    ) : column.inline ? (
                      <input
                        aria-label={`Edytuj ${column.label ?? column.key}`}
                        defaultValue={String(record[column.key] ?? '')}
                        onChange={(event) =>
                          callback(props, 'onChangeValue')?.(record.id, event.target.value)
                        }
                      />
                    ) : column.type === 'action' || column.type === 'editAction' ? (
                      <button
                        aria-label={`${column.label ?? column.key}: ${String(record[column.key] ?? '')}`}
                        type="button"
                        onClick={() =>
                          callback(props, 'onAction')?.(
                            record.id,
                            column.actionName ??
                              (column.type === 'editAction' ? 'edit-inline' : 'edit'),
                            record,
                          )
                        }
                      >
                        {String(record[column.key] ?? column.label ?? column.key)}
                      </button>
                    ) : (
                      String(record[column.key] ?? '—')
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
    return (
      <>
        <div
          {...common(props)}
          className={cx(
            'peaui-info-tooltip',
            bool(props, 'disabled') && 'peaui-info-tooltip--disabled',
            props.className,
          )}
          ref={forwardedRef as ForwardedRef<HTMLDivElement>}
          tabIndex={bool(props, 'disabled') ? -1 : 0}
        >
          {props.children ?? <Svg name="info" />}
        </div>
        <div
          className={cx(
            'peaui-info-tooltip__content',
            `peaui-info-tooltip__content--variant-${text(props, 'variant', 'default')}`,
            `peaui-info-tooltip__content--placement-${text(props, 'placement', 'top')}`,
          )}
          role="tooltip"
        >
          {node(props, 'title') ? (
            <strong className="peaui-info-tooltip__title">{node(props, 'title')}</strong>
          ) : null}
          {node(props, 'description') ? (
            <p className="peaui-info-tooltip__description">{node(props, 'description')}</p>
          ) : null}
        </div>
      </>
    );
  return <Popover props={props} kind={kind} forwardedRef={forwardedRef} />;
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
          `peaui-${button ? 'popover-button' : 'popover-overlayer'}__content--placement-${text(props, 'placement', 'bottom')}`,
          bool(props, 'matchTriggerWidth') && `${root}__content--match-trigger-width`,
          text(props, 'contentClass'),
        )}
        id={popoverId}
        popover={nativePopoverValue()}
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

const groupByName: Record<ReactComponentName, RuntimeComponent> = {
  ImageView: BasicRenderer,
  PhotoEditor: BasicRenderer,
  SvgIcon: BasicRenderer,
  CalculationResults: DisplayRenderer,
  CardCarousel: DisplayRenderer,
  CounterBadge: DisplayRenderer,
  DescriptionField: DisplayRenderer,
  DisclosurePanel: DisplayRenderer,
  SectionHeading: DisplayRenderer,
  TableList: DisplayRenderer,
  TableListFooter: DisplayRenderer,
  TableListHeader: DisplayRenderer,
  TagChip: DisplayRenderer,
  TreeList: DisplayRenderer,
  ButtonAction: ButtonRenderer,
  ButtonExport: ButtonRenderer,
  InputSlider: FormRenderer,
  SearchInput: FormRenderer,
  SelectableCard: ButtonRenderer,
  EmptyState: FeedbackRenderer,
  MessageText: FeedbackRenderer,
  ProgressIndicator: FeedbackRenderer,
  SkeletonLoading: FeedbackRenderer,
  SpinnerLoader: FeedbackRenderer,
  ToastAlert: FeedbackRenderer,
  FieldLabel: FormRenderer,
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
  CardPanel: LayoutRenderer,
  FullscreenContainer: LayoutRenderer,
  GridItem: LayoutRenderer,
  GridSection: LayoutRenderer,
  PageLayout: LayoutRenderer,
  SectionDivider: LayoutRenderer,
  Breadcrumbs: NavigationRenderer,
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
  const Renderer: RuntimeComponent = groupByName[name];
  const Component = forwardRef<HTMLElement, RuntimeProps>((props, ref) =>
    createElement(Renderer, { ...props, __name: name, forwardedRef: ref }),
  );
  Component.displayName = name;
  return Component as unknown as ComponentType<PeauiReactProps<Name>>;
}
