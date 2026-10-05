/** @jsxImportSource react */
import {
  getRequiredValueAttributes,
  focusInvalidValue,
} from '../../helpers/form-validation.helper';
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string */
import {
  type RuntimeProps,
  text,
  useFormControlModel,
  asOptions,
  bool,
  cx,
  node,
} from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId, useRef } from 'react';
import { FormShell, getFormFieldAria } from './form-shell';
import {
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
} from '../../components/navigation/DropdownMenu/menu.shared';
import { InfoTooltipRenderer } from './info-tooltip.renderer';
import { feedbackHintIcon } from '../../components/feedback/feedback-icons.shared';
import { Svg } from './svg.renderer';

export function ButtonGroupRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const resetRef = useRef<HTMLInputElement>(null);
  const options = asOptions(props.options);
  const [value, setValue] = useFormControlModel<unknown>(
    props,
    'value',
    options.find((option) => option.active)?.value,
    resetRef,
    true,
  );
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const selectedOption = options.find((option) => Object.is(value, option.value));
  const selectedIndex = options.findIndex(
    (option) => Object.is(value, option.value) && !option.disabled,
  );
  const tabStop = selectedIndex >= 0 ? selectedIndex : edgeEnabledMenuIndex(options, 'first');
  const selectOption = (index: number, toggle = false): void => {
    const option = options[index];
    if (!option || option.disabled || bool(props, 'disabled') || bool(props, 'readonly')) return;
    if (Object.is(value, option.value)) {
      if (toggle && bool(props, 'isToggle') && !bool(props, 'required')) setValue(undefined);
      return;
    }
    setValue(option.value);
  };
  return (
    <FormShell props={{ ...props, id, value: selectedOption?.label ?? '' }}>
      <input
        ref={resetRef}
        disabled={bool(props, 'disabled')}
        name={text(props, 'name')}
        form={text(props, 'form') || undefined}
        type="hidden"
        value={String(value ?? '')}
      />
      <input
        {...getRequiredValueAttributes(
          value !== undefined && value !== null && value !== '',
          bool(props, 'required'),
          bool(props, 'disabled'),
          bool(props, 'readonly'),
          text(props, 'form') || undefined,
        )}
        onChange={() => undefined}
        onInvalid={(event) =>
          focusInvalidValue(
            event.nativeEvent,
            event.currentTarget.parentElement?.querySelector('[role=radio]:not(:disabled)'),
          )
        }
      />
      <div className="peaui-form-button-group__layout">
        <div
          {...getFormFieldAria(props, id)}
          aria-disabled={bool(props, 'disabled')}
          aria-labelledby={
            text(props, 'aria-labelledby') ||
            (text(props, 'label') && !text(props, 'aria-label') && !text(props, 'ariaLabel')
              ? `label-${id}`
              : undefined)
          }
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
                      (bool(props, 'disabled') || option.disabled) &&
                        'peaui-form-button-group__button--disabled',
                      bool(props, 'readonly') && 'peaui-form-button-group__button--readonly',
                    )}
                    disabled={bool(props, 'disabled') || option.disabled}
                    role="radio"
                    tabIndex={!bool(props, 'disabled') && index === tabStop ? 0 : -1}
                    title={option.hint}
                    type="button"
                    onClick={() => selectOption(index, true)}
                    onKeyDown={(event) => {
                      if (bool(props, 'disabled') || bool(props, 'readonly')) return;
                      let next = index;
                      if (event.key === 'Home') next = edgeEnabledMenuIndex(options, 'first');
                      else if (event.key === 'End') next = edgeEnabledMenuIndex(options, 'last');
                      else if (['ArrowRight', 'ArrowDown'].includes(event.key))
                        next = nextEnabledMenuIndex(options, index, 1);
                      else if (['ArrowLeft', 'ArrowUp'].includes(event.key))
                        next = nextEnabledMenuIndex(options, index, -1);
                      else return;
                      event.preventDefault();
                      selectOption(next);
                      event.currentTarget
                        .closest('[role="radiogroup"]')
                        ?.querySelectorAll<HTMLElement>('[role="radio"]')
                        [next]?.focus();
                    }}
                  >
                    <span className="peaui-form-button-group__button-label">{option.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {node(props, 'additionalHint') ? (
          <InfoTooltipRenderer
            description={node(props, 'additionalHint')}
            className="peaui-form-button-group__additional-hint"
          >
            <Svg
              className="peaui-form-button-group__additional-hint-icon"
              name="hint"
              data={feedbackHintIcon}
            />
          </InfoTooltipRenderer>
        ) : null}
      </div>
    </FormShell>
  );
}
