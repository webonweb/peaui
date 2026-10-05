/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RuntimeProps, bool, useModel, common, cx, node, text } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';

export function Disclosure({
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
        aria-label={node(props, 'title') ? undefined : text(props, 'ariaLabel', 'Sekcja rozwijana')}
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
          {!alwaysOpen ? (
            <svg
              className="peaui-disclosure-panel__icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 6.5L8 10.5L12 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
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
