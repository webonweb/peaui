/** @jsxImportSource react */
import { ButtonActionRenderer } from './button-action.renderer';
import { type RuntimeProps, text, cx, bool, node, callback, common } from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId } from 'react';

export function FormContainerLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedContainerId = useId();
  const formLabelId = `peaui-form-container-label-${generatedContainerId.replaceAll(':', '')}`;
  const isLoading = bool(props, 'isLoading');
  const hasAdditionalBefore = Boolean(node(props, 'additionalBefore'));
  const hasAdditionalAfter = Boolean(node(props, 'additionalAfter'));
  return (
    <form
      {...common(props)}
      aria-busy={isLoading}
      aria-labelledby={
        text(props, 'label') && bool(props, 'useAriaLabelledby', true) ? formLabelId : undefined
      }
      className={cx(
        'peaui-form-container',
        `peaui-form-container--${text(props, 'actionsPosition', 'bottom-left')}`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLFormElement>}
      onSubmit={(event) => {
        event.preventDefault();
        if (bool(props, 'disabled') || isLoading) return;
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
            {hasAdditionalBefore ? (
              <div className="peaui-form-container__actions-additional">
                {node(props, 'additionalBefore')}
              </div>
            ) : null}
            <ButtonActionRenderer
              className="peaui-form-container__actions-button"
              size={text(props, 'sizeButton', 'xs')}
              variant="primary"
              disabled={bool(props, 'disabled') || isLoading}
              type="submit"
            >
              {text(props, 'submitButtonLabel', 'Zapisz')}
            </ButtonActionRenderer>
            {bool(props, 'showCancelButton', true) ? (
              <ButtonActionRenderer
                className="peaui-form-container__actions-button"
                size={text(props, 'sizeButton', 'xs')}
                variant="secondary"
                disabled={isLoading}
                type="button"
                onClick={() => callback(props, 'onCancel')?.()}
              >
                {text(props, 'cancelButtonLabel', 'Anuluj')}
              </ButtonActionRenderer>
            ) : null}
            {hasAdditionalAfter ? (
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
