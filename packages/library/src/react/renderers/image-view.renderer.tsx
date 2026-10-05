/** @jsxImportSource react */
import type { ForwardedRef, ImgHTMLAttributes, ReactElement } from 'react';
import { getHumanizedSourceText } from '../../components/basic/ImageView/image-view.shared';
import { common, cx, dataTest, text, type RuntimeProps } from './runtime.shared';

const imageAttributeNames = new Set([
  'aria-label',
  'aria-labelledby',
  'crossOrigin',
  'decoding',
  'fetchPriority',
  'height',
  'loading',
  'referrerPolicy',
  'sizes',
  'srcSet',
  'title',
  'useMap',
  'width',
  'onLoad',
  'onError',
]);

export function ImageViewRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & {
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const imageAttributes: ImgHTMLAttributes<HTMLImageElement> = Object.fromEntries(
    Object.entries(props).filter(([name]) => imageAttributeNames.has(name)),
  );
  const src = text(props, 'src').trim();
  const label = text(props, 'aria-label') || text(props, 'ariaLabel');
  const labelledBy = text(props, 'aria-labelledby');
  const alt =
    props.alt !== undefined
      ? text(props, 'alt').trim()
      : label || text(props, 'title') || getHumanizedSourceText(src) || 'Obraz';
  const decorative = !alt && !label && !labelledBy;
  const rootProps = Object.fromEntries(
    Object.entries(props).filter(
      ([name]) =>
        !imageAttributeNames.has(name) &&
        name !== 'ariaLabel' &&
        name !== 'data-testid' &&
        name !== 'dataTestId',
    ),
  );
  return (
    <span
      {...common(rootProps)}
      className={cx(
        'peaui-image-view',
        `peaui-image-view--size-${text(props, 'size', 'auto')}`,
        props.className,
      )}
      ref={forwardedRef}
      style={{ ...props.style, ...(text(props, 'max') ? { maxWidth: text(props, 'max') } : {}) }}
    >
      {src ? (
        <img
          {...imageAttributes}
          alt={alt}
          aria-hidden={decorative || undefined}
          aria-label={label || undefined}
          className="peaui-image-view__image"
          data-testid={dataTest(props)}
          role={decorative ? 'presentation' : undefined}
          src={src}
        />
      ) : null}
    </span>
  );
}
