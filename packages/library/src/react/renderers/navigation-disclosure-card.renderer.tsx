/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RuntimeProps, bool, text, node, cx, common } from './runtime.shared';
import { iconArrow, iconArrowRight } from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, useId, useState } from 'react';
import { Svg } from './svg.renderer';

export function NavigationDisclosureCardRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const [open, setOpen] = useState(bool(props, 'open'));
  const path = text(props, 'path');
  const root = 'peaui-navigation-disclosure-card';
  const uid = `${root}-${useId()}`;
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const labelledBy = text(props, 'title').trim()
    ? titleId
    : text(props, 'aria-labelledby') || undefined;
  const describedBy = text(props, 'description').trim()
    ? descriptionId
    : text(props, 'aria-describedby') || undefined;
  const inner = (
    <div className={`${root}__summary-inner`}>
      <div className={`${root}__summary-content`}>
        <div className={`${root}__header`}>
          <div className={`${root}__title-group`}>
            <h3 id={titleId} className={`${root}__title`}>
              {text(props, 'title')}
            </h3>
            {node(props, 'titleAdditional')}
          </div>
          <div className={`${root}__description-additional`}>
            {node(props, 'descriptionAdditional')}
          </div>
        </div>
        <div className={`${root}__description-row`}>
          <p id={descriptionId} className={`${root}__description`}>
            {text(props, 'description')}
          </p>
          <span
            aria-hidden="true"
            className={cx(
              `${root}__action`,
              path ? `${root}__action--link` : `${root}__action--disclosure`,
            )}
          >
            <Svg
              data={path ? iconArrowRight : iconArrow}
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

  if (path) {
    return (
      <div
        {...common(props)}
        aria-label={undefined}
        aria-labelledby={undefined}
        aria-describedby={undefined}
        className={cx(root, `${root}--link`, props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <a
          className={`${root}__summary ${root}__summary--link`}
          href={path}
          aria-label={
            labelledBy
              ? undefined
              : text(props, 'ariaLabel') || text(props, 'aria-label') || undefined
          }
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
        >
          {inner}
        </a>
        {bool(props, 'open') && props.children ? (
          <div className={`${root}__content`} role="region">
            {props.children}
          </div>
        ) : null}
      </div>
    );
  }

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
