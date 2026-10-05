/** @jsxImportSource react */
/* eslint-disable no-nested-ternary */
import { type RuntimeProps, bool, text, dataTest, callback, cx, node } from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useState,
  useId,
  type ElementType,
  type SyntheticEvent,
  type MouseEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
} from 'react';
import {
  normalizeAvatarInitials,
  getAvatarInitials,
} from '../../components/data-display/Avatar/avatar.helper';
import { Svg } from './svg.renderer';

export type AvatarImageState = 'idle' | 'loading' | 'loaded' | 'error';

export const AVATAR_STATUS_LABELS: Readonly<Record<string, string>> = {
  away: 'Zaraz wracam',
  busy: 'Zajęty',
  offline: 'Niedostępny',
  online: 'Dostępny',
};

export function normalizeAvatarText(value: unknown): string | undefined {
  const normalized = typeof value === 'string' ? value.trim() : '';

  return normalized || undefined;
}

export function mergeAvatarIds(...values: Array<string | undefined>): string | undefined {
  const ids = new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));

  return ids.size > 0 ? [...ids].join(' ') : undefined;
}

export function AvatarRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const source = normalizeAvatarText(props.src);
  const normalizedAlt = typeof props.alt === 'string' ? props.alt.trim() : undefined;
  const normalizedName = normalizeAvatarText(props.name);
  const resolvedInitials =
    normalizeAvatarInitials(normalizeAvatarText(props.initials)) ||
    getAvatarInitials(normalizedName);
  const interactive = bool(props, 'interactive');
  const externalAriaLabel =
    normalizeAvatarText(props.ariaLabel) ?? normalizeAvatarText(props['aria-label']);
  const externalAriaLabelledBy = normalizeAvatarText(props['aria-labelledby']);
  const externalAriaDescribedBy = normalizeAvatarText(props['aria-describedby']);
  const [storedImageState, setStoredImageState] = useState<{
    source?: string;
    state: AvatarImageState;
  }>(() => ({ source, state: source ? 'loading' : 'idle' }));
  const imageState: AvatarImageState =
    storedImageState.source === source ? storedImageState.state : source ? 'loading' : 'idle';
  const status = text(props, 'status', 'none');
  const resolvedStatusLabel =
    status === 'none'
      ? undefined
      : (normalizeAvatarText(props.statusLabel) ?? AVATAR_STATUS_LABELS[status]);
  const statusId = `peaui-avatar-status-${useId().replace(/:/g, '')}`;
  const isDecorative =
    !interactive && normalizedAlt === '' && !externalAriaLabel && !externalAriaLabelledBy;
  const hasImage = Boolean(source) && imageState !== 'error';
  const isImageVisible = hasImage && imageState === 'loaded';
  const hasSemanticImage =
    isImageVisible &&
    !interactive &&
    Boolean(normalizedAlt) &&
    !externalAriaLabel &&
    !externalAriaLabelledBy;
  const usesRootSemantics = interactive || (!isDecorative && !hasSemanticImage);
  const accessibleName =
    externalAriaLabel ??
    (normalizedAlt || undefined) ??
    normalizedName ??
    (resolvedInitials || 'Awatar użytkownika');
  const statusDescriptionId = resolvedStatusLabel ? statusId : undefined;
  const rootAriaDescribedBy =
    usesRootSemantics && !isDecorative
      ? mergeAvatarIds(externalAriaDescribedBy, statusDescriptionId)
      : undefined;
  const imageAriaDescribedBy = hasSemanticImage
    ? mergeAvatarIds(externalAriaDescribedBy, statusDescriptionId)
    : undefined;
  const size = text(props, 'size', 'm');
  const shape = text(props, 'shape', 'circle');
  const baseTestId = dataTest(props);
  const Root = (interactive ? 'button' : 'span') as ElementType;
  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
    setStoredImageState({ source, state: 'loaded' });
    callback(props, 'onLoad')?.(event);
  };
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>): void => {
    setStoredImageState({ source, state: 'error' });
    callback(props, 'onError')?.(event);
  };

  return (
    <Root
      aria-describedby={rootAriaDescribedBy}
      aria-label={
        usesRootSemantics && !isDecorative && !externalAriaLabelledBy ? accessibleName : undefined
      }
      aria-labelledby={usesRootSemantics && !isDecorative ? externalAriaLabelledBy : undefined}
      className={cx(
        'peaui-avatar',
        `peaui-avatar--size-${size}`,
        `peaui-avatar--shape-${shape}`,
        `peaui-avatar--state-${imageState}`,
        interactive && 'peaui-avatar--interactive',
        interactive && bool(props, 'disabled') && 'peaui-avatar--disabled',
        props.className,
      )}
      data-state={imageState}
      data-testid={baseTestId}
      disabled={interactive ? bool(props, 'disabled') : undefined}
      onClick={
        interactive && typeof props.onClick === 'function'
          ? (props.onClick as MouseEventHandler<HTMLElement>)
          : undefined
      }
      onKeyDown={
        typeof props.onKeyDown === 'function'
          ? (props.onKeyDown as KeyboardEventHandler<HTMLElement>)
          : undefined
      }
      onPointerDown={
        typeof props.onPointerDown === 'function'
          ? (props.onPointerDown as PointerEventHandler<HTMLElement>)
          : undefined
      }
      ref={forwardedRef}
      role={
        interactive || !usesRootSemantics ? undefined : (normalizeAvatarText(props.role) ?? 'img')
      }
      style={props.style}
      type={interactive ? 'button' : undefined}
    >
      <span className="peaui-avatar__media">
        {hasImage ? (
          <img
            alt={hasSemanticImage ? normalizedAlt : ''}
            aria-describedby={imageAriaDescribedBy}
            aria-hidden={hasSemanticImage ? undefined : true}
            className={cx('peaui-avatar__image', isImageVisible && 'peaui-avatar__image--visible')}
            data-testid={baseTestId ? `${baseTestId}-image` : undefined}
            decoding="async"
            key={source}
            loading={text(props, 'loading', 'lazy') as 'eager' | 'lazy'}
            role={hasSemanticImage ? undefined : 'presentation'}
            src={source}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : null}
        {!isImageVisible ? (
          <span
            aria-hidden="true"
            className="peaui-avatar__fallback"
            data-testid={baseTestId ? `${baseTestId}-fallback` : undefined}
          >
            {props.children !== undefined && props.children !== null ? (
              props.children
            ) : resolvedInitials ? (
              <span
                className="peaui-avatar__initials"
                data-testid={baseTestId ? `${baseTestId}-initials` : undefined}
              >
                {resolvedInitials}
              </span>
            ) : (
              <Svg
                className="peaui-avatar__icon"
                dataTestId={baseTestId ? `${baseTestId}-icon` : undefined}
                name={text(props, 'fallbackIcon', 'users')}
              />
            )}
          </span>
        ) : null}
      </span>
      {status !== 'none' && resolvedStatusLabel ? (
        <span
          aria-hidden="true"
          className={cx('peaui-avatar__status', `peaui-avatar__status--${status}`)}
          data-testid={baseTestId ? `${baseTestId}-status` : undefined}
        >
          {node(props, 'statusContent')}
        </span>
      ) : null}
      {resolvedStatusLabel ? (
        <span className="peaui-avatar__status-label" id={statusId}>
          {resolvedStatusLabel}
        </span>
      ) : null}
    </Root>
  );
}
