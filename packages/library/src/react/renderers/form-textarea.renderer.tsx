/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  type RuntimeProps,
  useFormControlModel,
  text,
  bool,
  node,
  cx,
  dataTest,
  num,
  common,
  callback,
} from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId, useRef, type CSSProperties } from 'react';
import { FormShell, getFormFieldAria } from './form-shell';

export function FormTextareaRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useFormControlModel<unknown>(props, 'value', '', inputRef);
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;

  return (
    <FormShell props={{ ...props, id, value }}>
      <textarea
        {...common(props)}
        {...Object.fromEntries(
          Object.entries(props).filter(([key]) => /^on[A-Z]/.test(key) && key !== 'onValueChange'),
        )}
        {...getFormFieldAria(props, id)}
        autoComplete={text(props, 'autoComplete') || undefined}
        autoFocus={bool(props, 'autoFocus')}
        autoCapitalize={text(props, 'autoCapitalize') || undefined}
        inputMode={props.inputMode as React.HTMLAttributes<HTMLTextAreaElement>['inputMode']}
        cols={typeof props.cols === 'number' ? props.cols : undefined}
        {...{ dirname: text(props, 'dirName') || undefined }}
        minLength={typeof props.minLength === 'number' ? props.minLength : undefined}
        wrap={text(props, 'wrap') || undefined}
        aria-disabled={bool(props, 'disabled')}
        className={cx(
          'peaui-form-field__element',
          'peaui-form-field-textarea',
          value !== '' ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
          bool(props, 'disabled') && 'peaui-form-field__element--disabled',
          bool(props, 'readonly') && 'peaui-form-field__element--readonly',
          !bool(props, 'readonly') && 'peaui-form-field__element--basic',
          Boolean(node(props, 'error')) && 'peaui-form-field__element--error',
          Boolean(node(props, 'success')) && 'peaui-form-field__element--success',
          props.className,
        )}
        data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
        disabled={bool(props, 'disabled')}
        id={id}
        maxLength={typeof props.maxLength === 'number' ? props.maxLength : undefined}
        name={text(props, 'name')}
        placeholder={text(props, 'placeholder')}
        readOnly={bool(props, 'readonly') || bool(props, 'readOnly')}
        ref={(element) => {
          inputRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        required={bool(props, 'required')}
        rows={num(props, 'rows', 5)}
        style={
          {
            ...props.style,
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
        onChange={(event) => {
          setValue(event.target.value);
          callback(props, 'onChange')?.(event);
        }}
        onInput={(event) => callback(props, 'onInput')?.(event)}
        onInvalid={(event) => callback(props, 'onInvalid')?.(event)}
      />
    </FormShell>
  );
}
