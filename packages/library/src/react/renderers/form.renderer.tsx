/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import { type RuntimeProps, text, cx, dataTest, bool, node, callback } from './runtime.shared';
import { iconCross } from '../generated-static-icons';
import { feedbackHintIcon } from '../../components/feedback/feedback-icons.shared';
import { InfoTooltipRenderer } from './info-tooltip.renderer';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  type CSSProperties,
  type InputHTMLAttributes,
  isValidElement,
  cloneElement,
} from 'react';
import { FormSwitchToggleRenderer } from './form-switch-toggle.renderer';
import { FormTextareaRenderer } from './form-textarea.renderer';
import { TextInputRenderer } from './text-input.renderer';
import { ChoiceRenderer } from './choice.renderer';
import { SelectRenderer } from './select.renderer';
import { DateRenderer } from './date.renderer';
import { FileRenderer } from './file.renderer';
import { Svg } from './svg.renderer';
import { renderSvgMarkup as StaticSvg } from './svg-markup.renderer';
import {
  getFormFieldEraseOffset,
  getFormFieldPaddingRight,
} from '../../components/form/FormField/form-field-layout.shared';
import { FormContainerLeafRenderer } from './form-container.renderer';
export { FormContainerLeafRenderer } from './form-container.renderer';
import { FormShell, getFormFieldAria } from './form-shell';

export function FormRenderer({
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
      return <FormTextareaRenderer {...props} forwardedRef={forwardedRef} />;
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
    return <FormFieldLabelLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'FormField') return <FormFieldLeafRenderer {...props} forwardedRef={forwardedRef} />;
  return <FormContainerLeafRenderer {...props} forwardedRef={forwardedRef} />;
}

export function FormFieldLabelLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
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
          {props.children ?? text(props, 'text')}
        </span>
        {!bool(props, 'readonly') && props.required === false ? (
          <span className="peaui-form-label__optional">(pole niewymagane)</span>
        ) : null}
      </span>
      {node(props, 'hint') ? (
        <InfoTooltipRenderer description={node(props, 'hint')} placement="right">
          <StaticSvg data={feedbackHintIcon} className="peaui-form-label__hint-icon" />
        </InfoTooltipRenderer>
      ) : null}
    </label>
  );
}

export function FormFieldLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const before = text(props, 'before');
  const after = text(props, 'after');
  const iconBefore = text(props, 'iconBefore');
  const iconAfter = text(props, 'iconAfter');
  const generatedId = useId();
  const child = isValidElement<InputHTMLAttributes<HTMLInputElement>>(props.children)
    ? props.children
    : undefined;
  const id = child?.props.id || text(props, 'id') || generatedId;
  const canErase = bool(props, 'canErase') && !bool(props, 'readonly') && !bool(props, 'disabled');
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
      canErase: bool(props, 'canErase'),
      hasAdditional: Boolean(node(props, 'additional')),
      iconAfter,
      minimumEraseOffset: eraseButtonRight,
    })}px`,
  } as CSSProperties;
  const controlProps = {
    ...getFormFieldAria(props, id),
    'aria-disabled': bool(props, 'disabled'),
    'data-disabled': bool(props, 'disabled'),
    disabled: bool(props, 'disabled'),
    id,
    maxLength: typeof props.maxLength === 'number' ? props.maxLength : undefined,
    name: text(props, 'name'),
    placeholder: text(props, 'placeholder'),
    readOnly: bool(props, 'readonly'),
    required: bool(props, 'required'),
    value:
      child?.props.defaultValue !== undefined
        ? undefined
        : ((props.value ?? '') as InputHTMLAttributes<HTMLInputElement>['value']),
    onChange: () => undefined,
    ...child?.props,
  };
  const fieldBindings = {
    ...controlProps,
    className: cx(
      'peaui-form-field__element',
      (child?.props.value ?? child?.props.defaultValue ?? props.value) !== ''
        ? 'peaui-form-field__element--medium'
        : 'peaui-form-field__element--normal',
      controlProps.disabled && 'peaui-form-field__element--disabled',
      controlProps.readOnly && 'peaui-form-field__element--readonly',
      !controlProps.readOnly && 'peaui-form-field__element--basic',
      (controlProps['aria-invalid'] === true || controlProps['aria-invalid'] === 'true') &&
        'peaui-form-field__element--error',
      Boolean(node(props, 'success')) && 'peaui-form-field__element--success',
      child?.props.className,
    ),
    style: { ...fieldStyle, ...child?.props.style },
  };
  const fieldControl = child
    ? cloneElement(child, fieldBindings)
    : (props.children ?? <input {...fieldBindings} />);
  return (
    <FormShell props={{ ...props, id }} forwardedRef={forwardedRef}>
      {fieldControl}
      {canErase && props.value !== undefined && props.value !== '' && !bool(props, 'disabled') ? (
        <button
          aria-label={text(props, 'clearLabel', 'Usuń wartość pola')}
          className="peaui-form-field__erase-button"
          style={{ '--right': `${eraseButtonRight}px` } as CSSProperties}
          type="button"
          onClick={() => callback(props, 'onRemove')?.()}
        >
          <Svg data={iconCross} className="peaui-form-field__erase-icon" name="cross" />
        </button>
      ) : null}
    </FormShell>
  );
}
