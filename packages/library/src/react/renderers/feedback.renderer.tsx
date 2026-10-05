/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import { type RuntimeProps, text, common, cx, bool, num, callback, node } from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId } from 'react';
import { Svg } from './svg.renderer';
import {
  feedbackIconPaths,
  isFeedbackIconVariant,
} from '../../components/feedback/feedback-icons.shared';

function FeedbackIcon({
  variant,
  className,
}: {
  variant: string;
  className: string;
}): ReactElement {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      {isFeedbackIconVariant(variant) ? (
        <path d={feedbackIconPaths[variant]} fill={variant === 'success' ? '#10893C' : undefined} />
      ) : null}
    </svg>
  );
}

export function FeedbackRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');

  if (kind === 'SpinnerLoader')
    return <SpinnerLoaderLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'SkeletonLoading')
    return <SkeletonLoadingLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'ProgressIndicator')
    return <ProgressIndicatorLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'MessageText')
    return <MessageTextLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'ToastAlert')
    return <ToastAlertLeafRenderer {...props} forwardedRef={forwardedRef} />;
  return <EmptyStateLeafRenderer {...props} forwardedRef={forwardedRef} />;
}

export function SpinnerLoaderLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
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
}

export function SkeletonLoadingLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
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
}

export function ProgressIndicatorLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const steps = Math.max(0, num(props, 'steps', 0));
  const active = Math.min(steps, Math.max(0, num(props, 'active', 0)));
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
        {steps <= 0 ? '0/0' : removeActive ? steps : `${active}/${steps}`}
      </span>
    </div>
  );
}

export function MessageTextLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const variant = text(props, 'variant', 'default');
  const ownIcon = text(props, 'ownIcon');
  const showVariantIcon = bool(props, 'withIcon', true) && isFeedbackIconVariant(variant);
  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-message-text',
        `peaui-message-text--variant-${variant}`,
        `peaui-message-text--size-${text(props, 'size', 's')}`,
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
        <FeedbackIcon className="peaui-message-text__icon" variant={variant} />
      ) : null}
      <p className="peaui-message-text__content">{props.children}</p>
    </div>
  );
}

export function ToastAlertLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const variant = text(props, 'variant', 'info');
  const size = text(props, 'size', 'm');
  const uid = `toast-${useId()}`;
  const title = text(props, 'title');
  const description = text(props, 'description');
  const regionId = text(props, 'id') || `${uid}-region`;
  const assertive = variant === 'error' || variant === 'danger';
  return (
    <div
      {...common({ ...props, title: undefined })}
      id={regionId}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-labelledby={title ? `${uid}-title` : undefined}
      aria-describedby={description ? `${uid}-description` : undefined}
      aria-label={title ? undefined : description || 'Powiadomienie'}
      className={cx(
        'peaui-toast-alert',
        `peaui-toast-alert--variant-${variant}`,
        `peaui-toast-alert--size-${size}`,
        bool(props, 'withBorder') && 'peaui-toast-alert--border',
        bool(props, 'withShadow') && 'peaui-toast-alert--shadow',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role={assertive ? 'alert' : 'status'}
    >
      <FeedbackIcon className="peaui-toast-alert__icon" variant={variant} />
      <div className="peaui-toast-alert__content">
        {text(props, 'title') ? (
          <strong
            id={`${uid}-title`}
            className={cx('peaui-toast-alert__title', `peaui-toast-alert__title--size-${size}`)}
          >
            {text(props, 'title')}
          </strong>
        ) : null}
        {text(props, 'description') ? (
          <p
            id={`${uid}-description`}
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
          aria-label={title ? `Zamknij powiadomienie: ${title}` : 'Zamknij powiadomienie'}
          aria-controls={regionId}
          className="peaui-toast-alert__close-button"
          type="button"
          onClick={() => callback(props, 'onClose')?.()}
        >
          <svg
            className="peaui-toast-alert__close-icon"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1.75732 1.75732L10.2426 10.2426M10.2426 1.75732L1.75732 10.2426"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export function EmptyStateLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const feedbackId = useId();
  return (
    <section
      {...common(props)}
      aria-describedby={text(props, 'description') ? `${feedbackId}-description` : undefined}
      aria-label={text(props, 'title') ? undefined : text(props, 'description', 'Brak danych')}
      aria-labelledby={text(props, 'title') ? `${feedbackId}-title` : undefined}
      className={cx('peaui-empty-state', props.className)}
      ref={forwardedRef}
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
