/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  type RuntimeProps,
  text,
  useFormControlModel,
  bool,
  node,
  cx,
  dataTest,
  callback,
  common,
  nativeAttributes,
} from './runtime.shared';
import { iconCopy, iconCross, iconEye, iconSearch } from '../generated-static-icons';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useState,
  useRef,
  useMemo,
  useEffect,
  type CSSProperties,
} from 'react';
import { createSearchScheduler } from '../../components/data-entry/SearchInput/search-scheduler.shared';
import {
  getFormFieldEraseOffset,
  getFormFieldPaddingRight,
} from '../../components/form/FormField/form-field-layout.shared';
import { Svg } from './svg.renderer';
import {
  evaluatePasswordStrength,
  PASSWORD_STRENGTH_SEGMENTS,
} from '../../components/form/FormPassword/strength.helper';
import { FormShell, getFormFieldAria } from './form-shell';
import { normalizeNumberInput, stepNumberInput } from '../../helpers/number.helper';
import { observeControlReset } from '../../helpers/form-reset.helper';
import { inputSliderPaths } from '../../components/data-entry/InputSlider/input-slider-icons.shared';
import { ButtonActionRenderer } from './button-action.renderer';

function useTextInput(
  props: RuntimeProps,
  forwardedRef: ForwardedRef<HTMLElement> | undefined,
  kind: string,
  searchScheduler?: ReturnType<typeof createSearchScheduler>,
) {
  const modelName = kind === 'InputSlider' ? 'value' : 'value';
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useFormControlModel<unknown>(
    props,
    modelName,
    kind === 'InputSlider' ? 0 : '',
    inputRef,
  );
  const [numberDraft, setNumberDraft] = useState<string | undefined>(undefined);
  useEffect(() => setNumberDraft(undefined), [value]);
  useEffect(() => {
    const control = inputRef.current;
    if (control) return observeControlReset(control, () => setNumberDraft(undefined));
  }, []);
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase') && !disabled && !readonly;
  const before = text(props, 'before');
  const after = text(props, 'after');
  const iconBefore = text(props, 'iconBefore');
  const iconAfter = text(props, 'iconAfter');
  let type = kind === 'FormInput' ? text(props, 'type', 'text') : 'text';
  if (kind === 'SearchInput') type = 'search';
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
    canErase: bool(props, 'canErase'),
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
      {...nativeAttributes(props)}
      role={text(props, 'role') || undefined}
      {...getFormFieldAria(props, id)}
      autoComplete={text(props, 'autoComplete') || text(props, 'autocomplete') || undefined}
      autoCapitalize={text(props, 'autoCapitalize') || undefined}
      inputMode={props.inputMode as React.InputHTMLAttributes<HTMLInputElement>['inputMode']}
      pattern={text(props, 'pattern') || undefined}
      minLength={typeof props.minLength === 'number' ? props.minLength : undefined}
      size={typeof props.size === 'number' ? props.size : undefined}
      multiple={bool(props, 'multiple') || undefined}
      aria-disabled={disabled}
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
          (!bool(props, 'isRangeVisible', true) || readonly || disabled) &&
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
      ref={(element) => {
        inputRef.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
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
          getFormFieldAria(props, id)['aria-describedby'],
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
      value={
        kind === 'FormNumber' && numberDraft !== undefined
          ? numberDraft
          : value === undefined || value === null
            ? ''
            : String(value)
      }
      onInput={(event) => callback(props, 'onInput')?.(event)}
      onBlur={(event) => {
        if (kind === 'FormNumber' && !disabled && !readonly) {
          setValue(
            normalizeNumberInput(event.currentTarget.value, {
              min: typeof props.min === 'number' ? props.min : undefined,
              max: typeof props.max === 'number' ? props.max : undefined,
              step: typeof props.step === 'number' ? props.step : undefined,
            }),
          );
          setNumberDraft(undefined);
        }
        callback(props, 'onBlur')?.(event);
      }}
      onChange={(event) => {
        if (disabled || readonly) return;
        if (kind === 'FormNumber') {
          setNumberDraft(event.target.value);
          callback(props, 'onChange')?.(event);
          return;
        }
        const next =
          type === 'number' || type === 'range'
            ? event.target.value === ''
              ? undefined
              : Number(event.target.value)
            : event.target.value;
        setValue(next);
        callback(props, 'onChange')?.(event);
        if (kind === 'SearchInput') searchScheduler?.schedule(event.target.value);
      }}
      onKeyDown={(event) => {
        callback(props, 'onKeyDown')?.(event);
        if (event.defaultPrevented) return;
        if (
          kind === 'FormNumber' &&
          !disabled &&
          !readonly &&
          ['ArrowUp', 'ArrowDown'].includes(event.key)
        ) {
          event.preventDefault();
          setValue(
            stepNumberInput(event.currentTarget.value, event.key === 'ArrowUp' ? 1 : -1, {
              min: typeof props.min === 'number' ? props.min : undefined,
              max: typeof props.max === 'number' ? props.max : undefined,
              step: typeof props.step === 'number' ? props.step : undefined,
            }),
          );
          setNumberDraft(undefined);
        }
        if (kind === 'SearchInput' && event.key === 'Enter') {
          event.preventDefault();
          searchScheduler?.search(event.currentTarget.value);
        }
      }}
    />
  );

  return {
    input,
    value,
    setValue,
    disabled,
    readonly,
    canErase,
    eraseButtonRight,
    id,
    visible,
    setVisible,
    canCopyPassword,
    canShowPassword,
    passwordActionsCount,
    copyStatus,
    setCopyStatus,
  };
}

export function TextInputRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'InputSlider')
    return <InputSliderLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'SearchInput')
    return <SearchInputLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'FormPassword')
    return <FormPasswordLeafRenderer {...props} forwardedRef={forwardedRef} />;
  return <TextFieldLeafRenderer {...props} forwardedRef={forwardedRef} />;
}

export function InputSliderLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const { input, value, setValue, disabled } = useTextInput(
    { ...props, min: props.min ?? 0, max: props.max ?? 1, step: props.step ?? 0.1 },
    forwardedRef,
    'InputSlider',
  );
  return (
    <div
      {...common({ ...props, id: undefined })}
      className={cx('peaui-input-slider', props.className)}
    >
      <ButtonActionRenderer
        aria-label={`Zmniejsz wartość. Obecna: ${String(value)}`}
        className="peaui-input-slider__button peaui-input-slider__button--decrement"
        size="xs"
        variant="ghost"
        disabled={disabled}
        type="button"
        onClick={() => setValue(Math.max(0, Number(value) - 0.1))}
      >
        <svg
          className="peaui-input-slider__button-icon"
          viewBox="0 0 25 24"
          fill="none"
          aria-hidden="true"
        >
          <path d={inputSliderPaths.decrement} />
        </svg>
      </ButtonActionRenderer>
      {input}
      <ButtonActionRenderer
        aria-label={`Zwiększ wartość. Obecna: ${String(value)}`}
        className="peaui-input-slider__button peaui-input-slider__button--increment"
        size="xs"
        variant="ghost"
        disabled={disabled}
        type="button"
        onClick={() => setValue(Math.min(1, Number(value) + 0.1))}
      >
        <svg
          className="peaui-input-slider__button-icon"
          viewBox="0 0 25 24"
          fill="none"
          aria-hidden="true"
        >
          <path d={inputSliderPaths.increment} />
        </svg>
      </ButtonActionRenderer>
    </div>
  );
}

export function SearchInputLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const latestProps = useRef(props);
  latestProps.current = props;
  const searchScheduler = useMemo(
    () =>
      createSearchScheduler(
        (phrase) => callback(latestProps.current, 'onSearch')?.(phrase),
        () =>
          typeof latestProps.current.debounceTime === 'number'
            ? latestProps.current.debounceTime
            : 1000,
        () => bool(latestProps.current, 'disabled') || bool(latestProps.current, 'readonly'),
      ),
    [],
  );
  useEffect(() => searchScheduler.cancel, [searchScheduler, props.debounceTime]);
  const searchBlocked = bool(props, 'disabled') || bool(props, 'readonly');
  useEffect(() => {
    if (searchBlocked) searchScheduler.cancel();
  }, [searchBlocked, searchScheduler]);
  const { input, value, setValue, disabled, readonly } = useTextInput(
    { ...props, ariaLabel: text(props, 'ariaLabel', 'Pole wyszukiwania') },
    forwardedRef,
    'SearchInput',
    searchScheduler,
  );
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Native child controls provide keyboard activation for this delegated listener.
    <div
      className={cx('peaui-search-input', props.className)}
      role="search"
      aria-label={text(props, 'ariaLabel', 'Pole wyszukiwania')}
      data-testid={dataTest(props)}
      style={props.style}
      onClick={(event) => callback(props, 'onClick')?.(event)}
    >
      <div className="peaui-search-input__field">
        <Svg data={iconSearch} className="peaui-search-input__field-icon" name="search" />
        {input}
        {value && !disabled && !readonly ? (
          <button
            aria-label="Wyczyść"
            className="peaui-search-input__erase-button"
            type="button"
            onClick={() => {
              setValue('');
              callback(props, 'onRemove')?.();
              searchScheduler.clear();
            }}
          >
            <Svg data={iconCross} className="peaui-search-input__erase-icon" name="cross" />
          </button>
        ) : null}
      </div>
      <button
        aria-label="Szukaj"
        className={cx(
          'peaui-search-input__button peaui-button-action peaui-button-action--size-m peaui-button-action--variant-primary',
          (disabled || readonly) && 'peaui-button-action--is-disabled',
        )}
        disabled={disabled || readonly}
        type="button"
        onClick={() => searchScheduler.search(String(value ?? ''))}
      >
        <Svg data={iconSearch} className="peaui-search-input__button-icon" name="search" />
      </button>
    </div>
  );
}

export function FormPasswordLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const {
    input,
    value,
    disabled,
    readonly,
    id,
    visible,
    setVisible,
    canCopyPassword,
    canShowPassword,
    passwordActionsCount,
    copyStatus,
    setCopyStatus,
  } = useTextInput(props, forwardedRef, 'FormPassword');
  const password = String(value ?? '');
  const passwordStrength = evaluatePasswordStrength(password);
  return (
    <div className="peaui-form-field-password__wrapper">
      <FormShell props={{ ...props, id, value }}>
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
                <Svg data={iconEye} className="peaui-form-field-password__icon" name="eye" />
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
                <Svg data={iconCopy} className="peaui-form-field-password__icon" name="copy" />
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

export function TextFieldLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const { input, id, value, setValue, disabled, canErase, eraseButtonRight } = useTextInput(
    props,
    forwardedRef,
    text(props, '__name', 'FormInput'),
  );

  return (
    <FormShell props={{ ...props, id, value }}>
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
          <Svg data={iconCross} className="peaui-form-field__erase-icon" name="cross" />
        </button>
      ) : null}
    </FormShell>
  );
}
