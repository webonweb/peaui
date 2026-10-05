/** @jsxImportSource react */
import { useModel, useFormControlModel } from './renderers/runtime.shared';
import { getNativePopoverValue, useNativePopover } from './popover-overlayer.shared';
import { InfoTooltipRenderer } from './renderers/info-tooltip.renderer';
import { renderSvgMarkup } from './renderers/svg-markup.renderer';
import { feedbackHintIcon, feedbackErrorIcon } from '../components/feedback/feedback-icons.shared';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  DEFAULT_COLOR,
  colorToCss,
  getIndicatorColor,
  normalizeHsva,
  normalizeSwatches,
  opaqueHueToCss,
  parseColor,
  serializeColor,
  type FormColorPickerDensity,
  type FormColorPickerEyedropperErrorDetail,
  type FormColorPickerFormat,
  type FormColorPickerInvalidDetail,
  type FormColorPickerPlacement,
  type FormColorPickerSwatch,
  type FormColorPickerVariant,
  type HsvaColor,
} from '../components/form/FormColorPicker/color-picker.shared';
import { iconArrow, iconCross } from './generated-static-icons';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type EyeDropperInstance = { open: () => Promise<{ sRGBHex: string }> };
type EyeDropperWindow = Window & { EyeDropper?: new () => EyeDropperInstance };

const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

const arrowIcon = iconArrow;

const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const bool = (props: RuntimeProps, name: string, fallback = false): boolean => {
  const value = props[name];
  return typeof value === 'boolean' ? value : fallback;
};

const call = (props: RuntimeProps, name: string, ...args: unknown[]): void => {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
};

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

function defaultPlaceholder(format: FormColorPickerFormat, alpha: boolean): string {
  if (format === 'rgb') return alpha ? 'rgba(76, 154, 42, 1)' : 'rgb(76, 154, 42)';
  if (format === 'hsl') return alpha ? 'hsla(101, 57%, 38%, 1)' : 'hsl(101, 57%, 38%)';
  return alpha ? '#4C9A2AFF' : '#4C9A2A';
}

function resolveInvalidMessage(
  externalError: ReactNode,
  reason: FormColorPickerInvalidDetail['reason'] | undefined,
): ReactNode {
  if (externalError !== null && externalError !== undefined) return externalError;
  if (reason === 'empty') return 'Wybierz kolor.';
  if (reason === 'format') return 'Wpisz poprawny kolor HEX, RGB lub HSL.';
  return null;
}

export function FormColorPickerRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-color-${generatedId}`);
  const name = text(props, 'name', id);
  const label = text(props, 'label');
  const format = text(props, 'format', 'hex') as FormColorPickerFormat;
  const variant = text(props, 'variant', 'popover') as FormColorPickerVariant;
  const density = text(props, 'density', 'full') as FormColorPickerDensity;
  const placement = text(props, 'placement', 'bottom') as FormColorPickerPlacement;
  const alpha = bool(props, 'alpha');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const loading = bool(props, 'loading');
  const required = bool(props, 'required');
  const canErase = bool(props, 'canErase', true);
  const showEyedropper = bool(props, 'showEyedropper');
  const blocked = disabled || readonly || loading;
  const root = 'peaui-form-color-picker';
  const panelId = `${id}-panel`;
  const descriptionId = `${id}-help-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-color-loading`;
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const externalError = (props.errorContent ?? props.error) as ReactNode;
  const hintContent = props.hintContent as ReactNode;
  const placeholder = text(props, 'placeholder') || defaultPlaceholder(format, alpha);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [modelValue, setModelValue] = useFormControlModel<string>(
    props,
    'value',
    '#4C9A2A',
    rootRef,
    true,
    (next) => {
      setReason(undefined);
      const parsed = parseColor(next);
      if (parsed) {
        const normalized = normalizeHsva({ ...parsed, a: alpha ? parsed.a : 1 });
        setColor(normalized);
        setInputText(serializeColor(normalized, format, alpha));
      } else setInputText(next);
    },
  );
  const [open, setOpen] = useModel<boolean>(props, 'open', false, true);
  const initialColor = parseColor(modelValue) ?? DEFAULT_COLOR;
  const [color, setColor] = useState<HsvaColor>(
    normalizeHsva({ ...initialColor, a: alpha ? initialColor.a : 1 }),
  );
  const [inputText, setInputText] = useState(
    modelValue || serializeColor(initialColor, format, alpha),
  );
  const [reason, setReason] = useState<FormColorPickerInvalidDetail['reason']>();
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState(placement);
  const [availablePanelHeight, setAvailablePanelHeight] = useState(580);
  const [triggerWidth, setTriggerWidth] = useState(400);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const saturationRef = useRef<HTMLDivElement | null>(null);
  const activePointerElementRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | undefined>(undefined);
  const publishedValues = useRef(new Set<string>());
  const popoverRef = useNativePopover(open && variant === 'popover');
  const normalizedSavedColors = useMemo(
    () =>
      normalizeSwatches(
        props.savedColors as ReadonlyArray<string | FormColorPickerSwatch> | undefined,
      ),
    [props.savedColors],
  );
  const normalizedRecentColors = useMemo(
    () =>
      normalizeSwatches(
        props.recentColors as ReadonlyArray<string | FormColorPickerSwatch> | undefined,
      ),
    [props.recentColors],
  );
  const hasError = hasContent(externalError) || Boolean(reason);
  const displayValue = serializeColor(color, format, alpha);
  const colorCss = colorToCss(color);
  const eyedropperAvailable =
    typeof window !== 'undefined' &&
    window.isSecureContext === true &&
    typeof (window as EyeDropperWindow).EyeDropper === 'function';
  const describedBy =
    [
      text(props, 'aria-describedby') || undefined,
      hasContent(description) && !hasError ? descriptionId : undefined,
      hasError ? errorId : undefined,
      loading ? loadingId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  const synchronizationRef = useRef({ color, modelValue, open, updateModel, updateOpen });
  synchronizationRef.current = { color, modelValue, open, updateModel, updateOpen };

  useEffect(() => {
    if (publishedValues.current.delete(modelValue)) return;
    const parsed = parseColor(modelValue);
    if (parsed) {
      const normalized = normalizeHsva({ ...parsed, a: alpha ? parsed.a : 1 });
      setColor(normalized);
      setInputText(serializeColor(normalized, format, alpha));
    } else setInputText(modelValue);
  }, [alpha, format, modelValue]);

  useEffect(() => {
    const {
      color: currentColor,
      modelValue: currentModelValue,
      updateModel: publishModel,
    } = synchronizationRef.current;
    const nextColor = normalizeHsva({ ...currentColor, a: alpha ? currentColor.a : 1 });
    setColor(nextColor);
    const next = serializeColor(nextColor, format, alpha);
    setInputText(next);
    if (currentModelValue !== '' && currentModelValue !== next) publishModel(next);
  }, [alpha, format]);

  useEffect(() => {
    const state = synchronizationRef.current;
    if (variant === 'inline' && state.open) state.updateOpen(false);
  }, [variant]);

  useEffect(
    () => () => {
      const pointerId = pointerIdRef.current;
      const element = activePointerElementRef.current;
      if (
        pointerId !== undefined &&
        element !== null &&
        typeof element.hasPointerCapture === 'function' &&
        element.hasPointerCapture(pointerId)
      ) {
        element.releasePointerCapture(pointerId);
      }
      pointerIdRef.current = undefined;
      activePointerElementRef.current = null;
    },
    [],
  );

  function updateModel(next: string): void {
    publishedValues.current.add(next);
    if (publishedValues.current.size > 64) {
      const oldest = publishedValues.current.values().next().value;
      if (oldest !== undefined) publishedValues.current.delete(oldest);
    }
    setModelValue(next);
  }

  const publishColor = (nextColor: HsvaColor, commit = false): void => {
    if (blocked) return;
    const normalized = normalizeHsva({ ...nextColor, a: alpha ? nextColor.a : 1 });
    const next = serializeColor(normalized, format, alpha);
    setColor(normalized);
    setInputText(next);
    setReason(undefined);
    updateModel(next);
    call(props, 'onChange', next);
    if (commit) call(props, 'onCommit', next);
  };

  const commitPanelColor = (nextColor: HsvaColor): void => {
    const normalized = normalizeHsva({ ...nextColor, a: alpha ? nextColor.a : 1 });
    const next = serializeColor(normalized, format, alpha);
    setColor(normalized);
    setInputText(next);
    if (modelValue !== next) updateModel(next);
    call(props, 'onCommit', next);
  };

  const reportInvalid = (
    nextReason: FormColorPickerInvalidDetail['reason'],
    input: string,
  ): void => {
    setReason(nextReason);
    call(props, 'onInvalid', { input, reason: nextReason } satisfies FormColorPickerInvalidDetail);
  };

  const commitTextInput = (): void => {
    if (blocked) return;
    const source = inputText.trim();
    if (!source) {
      if (required) reportInvalid('empty', inputText);
      else {
        if (modelValue === '' && inputText === '' && !reason) return;
        updateModel('');
        call(props, 'onChange', '');
        call(props, 'onCommit', '');
      }
      return;
    }
    const parsed = parseColor(source);
    if (!parsed) reportInvalid('format', inputText);
    else {
      const next = serializeColor(parsed, format, alpha);
      if (inputText === next && modelValue === next && !reason) return;
      publishColor(parsed, true);
    }
  };

  const updatePanelGeometry = (): void => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.width > 0) setTriggerWidth(rect.width);
    const above = rect.top;
    const below = window.innerHeight - rect.bottom;
    const preferred = placement === 'bottom' ? below : above;
    const fallback = placement === 'bottom' ? 'top' : 'bottom';
    const fallbackSpace = fallback === 'bottom' ? below : above;
    const nextPlacement = preferred >= 540 || preferred >= fallbackSpace ? placement : fallback;
    setPopoverPlacement(nextPlacement);
    setAvailablePanelHeight(Math.max(240, (nextPlacement === 'bottom' ? below : above) - 10));
  };

  function updateOpen(next: boolean, restoreFocus = false): void {
    if (next && (blocked || variant !== 'popover')) return;
    if (next) {
      updatePanelGeometry();
      setReason(undefined);
      call(props, 'onOpen');
    } else if (open) call(props, 'onClose');
    setOpen(next);
    if (!next && restoreFocus) requestAnimationFrame(() => inputRef.current?.focus());
  }

  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>): HsvaColor => {
    const rect = saturationRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return color;
    return normalizeHsva({
      ...color,
      s: ((event.clientX - rect.left) / rect.width) * 100,
      v: 100 - ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSaturationKeydown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (blocked) return;
    const step = event.shiftKey ? 10 : 1;
    let next: HsvaColor | undefined;
    if (event.key === 'ArrowLeft') next = { ...color, s: color.s - step };
    else if (event.key === 'ArrowRight') next = { ...color, s: color.s + step };
    else if (event.key === 'ArrowUp') next = { ...color, v: color.v + step };
    else if (event.key === 'ArrowDown') next = { ...color, v: color.v - step };
    else if (event.key === 'PageUp') next = { ...color, v: color.v + 10 };
    else if (event.key === 'PageDown') next = { ...color, v: color.v - 10 };
    else if (event.key === 'Home') next = { ...color, s: 0 };
    else if (event.key === 'End') next = { ...color, s: 100 };
    if (!next) return;
    event.preventDefault();
    publishColor(next, true);
  };

  const startEyedropper = async (): Promise<void> => {
    if (!eyedropperAvailable) {
      call(props, 'onEyedropperError', {
        reason: 'unavailable',
      } satisfies FormColorPickerEyedropperErrorDetail);
      return;
    }
    const EyeDropper = (window as EyeDropperWindow).EyeDropper;
    if (!EyeDropper) return;
    setEyedropperActive(true);
    call(props, 'onEyedropperStart');
    try {
      const result = await new EyeDropper().open();
      const parsed = parseColor(result.sRGBHex);
      if (!parsed) throw new TypeError('EyeDropper returned an invalid color.');
      publishColor(parsed, true);
    } catch (error) {
      call(props, 'onEyedropperError', {
        error,
        reason:
          error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed',
      } satisfies FormColorPickerEyedropperErrorDetail);
    } finally {
      setEyedropperActive(false);
    }
  };

  const renderTrigger = props.renderTrigger as
    ((state: { color: string; open: boolean; toggle: () => void }) => ReactNode) | undefined;
  const renderSwatch = props.renderSwatch as ((state: { color: string }) => ReactNode) | undefined;
  const renderSavedColor = props.renderSavedColor as
    ((state: { color: FormColorPickerSwatch; index: number }) => ReactNode) | undefined;
  const renderRecentColor = props.renderRecentColor as
    ((state: { color: FormColorPickerSwatch; index: number }) => ReactNode) | undefined;
  const renderFooter = props.renderFooter as ((state: { color: string }) => ReactNode) | undefined;

  const swatchLabel = (swatch: FormColorPickerSwatch): string =>
    swatch.label?.trim() || `Wybierz kolor ${swatch.value}`;

  const panel = (panelVariant: 'dialog' | 'group'): ReactElement => (
    <section
      aria-label={text(props, 'panelAriaLabel', 'Wybierz kolor')}
      className={cx(
        `${root}__panel`,
        `${root}__panel--${density}`,
        `${root}__panel--${panelVariant}`,
      )}
      id={panelId}
      role={panelVariant}
      style={
        panelVariant === 'dialog'
          ? ({
              '--peaui-form-color-picker-available-height': `${availablePanelHeight}px`,
            } as CSSProperties)
          : undefined
      }
      onKeyDown={(event) => {
        if (panelVariant === 'dialog' && event.key === 'Escape') {
          event.preventDefault();
          updateOpen(false, true);
        }
      }}
    >
      <div className={`${root}__preview-row`}>
        <span
          aria-hidden="true"
          className={`${root}__preview`}
          style={{ '--peaui-form-color-picker-color': colorCss } as CSSProperties}
        />
        <div>
          <p className={`${root}__current-label`}>Wybrany kolor</p>
          <output className={`${root}__current-value`}>{displayValue}</output>
        </div>
      </div>
      <div
        aria-describedby={`${id}-saturation-instructions`}
        aria-label="Nasycenie i jasność koloru"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(color.s)}
        aria-valuetext={`Nasycenie ${Math.round(color.s)}%, jasność ${Math.round(color.v)}%`}
        className={`${root}__saturation`}
        ref={saturationRef}
        role="slider"
        style={{ '--peaui-form-color-picker-hue': opaqueHueToCss(color.h) } as CSSProperties}
        tabIndex={blocked ? -1 : 0}
        onKeyDown={handleSaturationKeydown}
        onPointerCancel={(event) => {
          if (pointerIdRef.current !== event.pointerId) return;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerIdRef.current = undefined;
          activePointerElementRef.current = null;
        }}
        onPointerDown={(event) => {
          if (blocked) return;
          pointerIdRef.current = event.pointerId;
          activePointerElementRef.current = event.currentTarget;
          event.currentTarget.setPointerCapture(event.pointerId);
          publishColor(updateFromPointer(event));
        }}
        onPointerMove={(event) => {
          if (pointerIdRef.current === event.pointerId) publishColor(updateFromPointer(event));
        }}
        onPointerUp={(event) => {
          if (pointerIdRef.current !== event.pointerId) return;
          const next = updateFromPointer(event);
          publishColor(next);
          commitPanelColor(next);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerIdRef.current = undefined;
          activePointerElementRef.current = null;
        }}
      >
        <span
          aria-hidden="true"
          className={`${root}__saturation-indicator`}
          style={
            {
              '--peaui-form-color-picker-indicator': getIndicatorColor(color),
              left: `${color.s}%`,
              top: `${100 - color.v}%`,
            } as CSSProperties
          }
        />
      </div>
      <p className={`${root}__sr-only`} id={`${id}-saturation-instructions`}>
        Strzałki lewo i prawo zmieniają nasycenie, a góra i dół jasność. Shift zwiększa krok.
      </p>
      <div className={`${root}__sliders`}>
        <label className={`${root}__slider-row`}>
          <span>Odcień</span>
          <input
            aria-label="Odcień"
            aria-valuetext={`${Math.round(color.h)} stopni`}
            className={`${root}__range ${root}__range--hue`}
            disabled={blocked}
            id={`${id}-hue`}
            max={359}
            min={0}
            type="range"
            value={color.h}
            onChange={(event) => publishColor({ ...color, h: Number(event.target.value) })}
            onPointerUp={() => commitPanelColor(color)}
            onKeyUp={() => commitPanelColor(color)}
          />
          <output htmlFor={`${id}-hue`}>{Math.round(color.h)}°</output>
        </label>
        {alpha ? (
          <label className={`${root}__slider-row`}>
            <span>Krycie</span>
            <input
              aria-label="Krycie"
              aria-valuetext={`${Math.round(color.a * 100)}%`}
              className={`${root}__range ${root}__range--alpha`}
              disabled={blocked}
              id={`${id}-alpha`}
              max={100}
              min={0}
              type="range"
              value={color.a * 100}
              style={
                {
                  '--peaui-form-color-picker-opaque': colorToCss({ ...color, a: 1 }),
                } as CSSProperties
              }
              onChange={(event) => publishColor({ ...color, a: Number(event.target.value) / 100 })}
              onPointerUp={() => commitPanelColor(color)}
              onKeyUp={() => commitPanelColor(color)}
            />
            <output htmlFor={`${id}-alpha`}>{Math.round(color.a * 100)}%</output>
          </label>
        ) : null}
      </div>
      {normalizedSavedColors.length ? (
        <section aria-labelledby={`${id}-saved-heading`} className={`${root}__palette-section`}>
          <h3 id={`${id}-saved-heading`}>Zapisane kolory</h3>
          <div className={`${root}__swatches`}>
            {normalizedSavedColors.map((swatch, index) => (
              <button
                aria-label={swatchLabel(swatch)}
                className={`${root}__swatch`}
                disabled={blocked}
                key={`${swatch.value}-${index}`}
                style={
                  {
                    '--peaui-form-color-picker-swatch': colorToCss(parseColor(swatch.value)!),
                  } as CSSProperties
                }
                type="button"
                onClick={() => publishColor(parseColor(swatch.value)!, true)}
              >
                {renderSavedColor?.({ color: swatch, index })}
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {normalizedRecentColors.length ? (
        <section aria-labelledby={`${id}-recent-heading`} className={`${root}__palette-section`}>
          <h3 id={`${id}-recent-heading`}>Ostatnie kolory</h3>
          <div className={`${root}__swatches`}>
            {normalizedRecentColors.map((swatch, index) => (
              <button
                aria-label={swatchLabel(swatch)}
                className={`${root}__swatch`}
                disabled={blocked}
                key={`${swatch.value}-${index}`}
                style={
                  {
                    '--peaui-form-color-picker-swatch': colorToCss(parseColor(swatch.value)!),
                  } as CSSProperties
                }
                type="button"
                onClick={() => publishColor(parseColor(swatch.value)!, true)}
              >
                {renderRecentColor?.({ color: swatch, index })}
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {showEyedropper || renderFooter || hasContent(props.footerContent) ? (
        <div className={`${root}__panel-footer`}>
          {showEyedropper ? (
            <button
              aria-describedby={!eyedropperAvailable ? `${id}-eyedropper-unavailable` : undefined}
              className={`${root}__eyedropper`}
              disabled={blocked || !eyedropperAvailable || eyedropperActive}
              type="button"
              onClick={() => void startEyedropper()}
            >
              {eyedropperActive ? 'Pobieranie koloru…' : 'Pobierz kolor z ekranu'}
            </button>
          ) : null}
          {showEyedropper && !eyedropperAvailable ? (
            <span className={`${root}__unavailable`} id={`${id}-eyedropper-unavailable`}>
              EyeDropper jest niedostępny w tej przeglądarce lub poza bezpiecznym kontekstem.
            </span>
          ) : null}
          {renderFooter?.({ color: displayValue }) ?? (props.footerContent as ReactNode)}
        </div>
      ) : null}
    </section>
  );

  const invalidMessage = resolveInvalidMessage(externalError, reason);
  const fieldClass = cx(
    'peaui-form-field__element',
    inputText ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
    (disabled || loading) && 'peaui-form-field__element--disabled',
    readonly && 'peaui-form-field__element--readonly',
    !readonly && 'peaui-form-field__element--basic',
    hasError && 'peaui-form-field__element--error',
  );
  const defaultTrigger = (
    <div className="peaui-form-field" data-testid={baseTestId}>
      {label ? (
        <label className="peaui-form-label" htmlFor={id} id={`label-${id}`}>
          <span className="peaui-form-label__content">
            <span
              className={cx(
                'peaui-form-label__text',
                readonly && 'peaui-form-label__text--readonly',
              )}
            >
              {label}
            </span>
            {!required && !readonly ? (
              <span className="peaui-form-label__optional">(pole niewymagane)</span>
            ) : null}
          </span>
          {hasContent(hintContent) ? (
            <InfoTooltipRenderer
              description={hintContent}
              placement="right"
              ariaLabel="Dodatkowa informacja"
            >
              {renderSvgMarkup({
                className: 'peaui-form-label__hint-icon',
                data: feedbackHintIcon,
              })}
            </InfoTooltipRenderer>
          ) : null}
        </label>
      ) : null}
      <div className="peaui-form-field__content">
        <div className={`${root}__field-shell`}>
          {renderSwatch?.({ color: displayValue }) ?? (
            <span
              aria-hidden="true"
              className={`${root}__field-swatch`}
              style={{ '--peaui-form-color-picker-color': colorCss } as CSSProperties}
            />
          )}
          <input
            aria-busy={loading || undefined}
            aria-controls={variant === 'popover' ? panelId : undefined}
            aria-describedby={describedBy}
            aria-expanded={variant === 'popover' ? open : undefined}
            aria-haspopup={variant === 'popover' ? 'dialog' : undefined}
            aria-invalid={hasError || undefined}
            aria-label={
              text(props, 'aria-label') || text(props, 'ariaLabel') || (!label ? name : undefined)
            }
            aria-labelledby={label ? `label-${id}` : undefined}
            aria-readonly={readonly || undefined}
            autoComplete="off"
            className={cx(fieldClass, `${root}__input`)}
            data-testid={baseTestId ? `${baseTestId}-input` : undefined}
            disabled={disabled || loading}
            id={id}
            name={name}
            placeholder={placeholder}
            readOnly={readonly}
            ref={(element) => {
              inputRef.current = element;
              assignRef(forwardedRef, element);
            }}
            required={required}
            role={variant === 'popover' ? 'combobox' : undefined}
            type="text"
            value={inputText}
            onBlur={commitTextInput}
            onChange={(event) => {
              setInputText(event.target.value);
              setReason(undefined);
            }}
            onClick={() => updateOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && variant === 'popover') {
                event.preventDefault();
                updateOpen(true);
              } else if (event.key === 'Enter') {
                event.preventDefault();
                commitTextInput();
              } else if (event.key === 'Escape') updateOpen(false, true);
            }}
          />
          {variant === 'popover' ? (
            <button
              aria-controls={panelId}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={open ? 'Zamknij wybór koloru' : 'Otwórz wybór koloru'}
              className={`${root}__toggle`}
              disabled={blocked}
              type="button"
              onClick={() => updateOpen(!open, open)}
            >
              <svg
                aria-hidden="true"
                className={cx('peaui-svg-icon', `${root}__toggle-icon`)}
                dangerouslySetInnerHTML={{ __html: arrowIcon.body }}
                focusable="false"
                viewBox={arrowIcon.viewBox}
              />
            </button>
          ) : null}
          {canErase && inputText && !blocked ? (
            <button
              aria-label="Usuń wartość pola"
              className="peaui-form-field__erase-button"
              style={{ '--right': variant === 'popover' ? '48px' : '12px' } as CSSProperties}
              type="button"
              onClick={() => {
                setInputText('');
                if (required) reportInvalid('empty', '');
                else {
                  updateModel('');
                  call(props, 'onChange', '');
                  call(props, 'onCommit', '');
                  updateOpen(false, true);
                }
              }}
            >
              {renderSvgMarkup({ className: 'peaui-form-field__erase-icon', data: iconCross })}
            </button>
          ) : null}
        </div>
      </div>
      {hasContent(description) && !hasError ? (
        <div
          className="peaui-form-field__message peaui-message-text peaui-message-text--variant-default peaui-message-text--size-xs"
          id={descriptionId}
        >
          <p className="peaui-message-text__content">{description}</p>
        </div>
      ) : null}
      {hasError ? (
        <div
          className="peaui-form-field__message peaui-message-text peaui-message-text--variant-error peaui-message-text--size-xs"
          id={errorId}
        >
          {renderSvgMarkup({ className: 'peaui-message-text__icon', data: feedbackErrorIcon })}
          <p className="peaui-message-text__content">{invalidMessage}</p>
        </div>
      ) : null}
    </div>
  );

  const trigger = renderTrigger
    ? renderTrigger({ color: displayValue, open, toggle: () => updateOpen(!open, open) })
    : defaultTrigger;
  const anchorName = `--peaui-color-picker-${generatedId}`;

  return (
    <>
      <div
        aria-disabled={(variant === 'popover' && (disabled || loading)) || undefined}
        className={cx(
          root,
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          `${root}--${variant}`,
          `${root}--${density}`,
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          loading && `${root}--loading`,
          hasError && `${root}--error`,
          props.className,
        )}
        ref={rootRef}
        style={{ ...props.style, '--unique-anchor': anchorName } as CSSProperties}
      >
        <div className={`${root}__trigger-host`} ref={triggerRef}>
          {trigger}
          {loading ? (
            <span className={`${root}__loading-status`} id={loadingId} role="status">
              <span aria-hidden="true" className={`${root}__spinner`} />
              {text(props, 'loadingLabel', 'Ładowanie wyboru koloru')}
            </span>
          ) : null}
        </div>
        {variant === 'inline' ? panel('group') : null}
      </div>
      {variant === 'popover' ? (
        <div
          className={cx(
            'peaui-popover-overlayer__content',
            'peaui-popover-overlayer__content--match-trigger-width',
            `peaui-popover-overlayer__content--placement-${popoverPlacement}`,
            `${root}__popover-content`,
          )}
          hidden={!open}
          data-testid={baseTestId ? `${baseTestId}-popover-content` : undefined}
          popover={getNativePopoverValue()}
          ref={popoverRef}
          style={
            {
              '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
              '--unique-anchor': anchorName,
            } as CSSProperties
          }
          onToggle={(event) => {
            if (event.nativeEvent.newState === 'closed' && open) updateOpen(false);
          }}
        >
          {panel('dialog')}
        </div>
      ) : null}
    </>
  );
}

export default FormColorPickerRenderer;
