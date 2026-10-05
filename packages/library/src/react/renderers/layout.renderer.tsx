/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type RuntimeProps,
  text,
  common,
  anchorAttributes,
  cx,
  bool,
  num,
  node,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  type CSSProperties,
  type ElementType,
  createElement,
  Children,
} from 'react';
import { Fullscreen } from './fullscreen';

export function LayoutRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'SectionDivider')
    return <SectionDividerLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'GridItem') return <GridItemLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'GridSection')
    return <GridSectionLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'CardPanel') return <CardPanelLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'PageLayout')
    return <PageLayoutLeafRenderer {...props} forwardedRef={forwardedRef} />;
  return <FullscreenContainerLeafRenderer {...props} forwardedRef={forwardedRef} />;
}

export function SectionDividerLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const vertical = text(props, 'direction', 'horizontal') === 'vertical';
  const Tag = vertical ? 'div' : 'hr';
  return (
    <Tag
      {...common(props)}
      role={vertical ? 'separator' : undefined}
      aria-orientation={vertical ? 'vertical' : undefined}
      className={cx(
        'peaui-section-divider',
        `peaui-section-divider--${text(props, 'direction', 'horizontal')}`,
        `peaui-section-divider--size-${text(props, 'size', 's')}`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLHRElement>}
    />
  );
}

export function GridItemLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const requestedColumns = num(props, 'columns', 2);
  const columns = Math.max(
    requestedColumns > 0 ? requestedColumns : Children.count(props.children),
    1,
  );
  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-grid-item',
        bool(props, 'grid', true) && 'peaui-grid-item--grid',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      style={
        {
          ...props.style,
          '--peaui-grid-item-colspan': String(Math.max(1, num(props, 'colspan', 1))),
          '--peaui-grid-item-columns': String(columns),
          '--peaui-grid-item-gap': String(num(props, 'gap', 6)),
        } as CSSProperties
      }
    >
      {props.children}
    </div>
  );
}

export function GridSectionLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <div
      {...common(props)}
      className={cx('peaui-grid-section', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      {node(props, 'additional') ? (
        <div className="peaui-grid-section__additional">{node(props, 'additional')}</div>
      ) : null}
      <div
        className={cx(
          'peaui-grid-section__content',
          num(props, 'columns', 4) > 1 && 'peaui-grid-section__content--multi',
        )}
        style={
          {
            '--peaui-grid-gap-y': String(num(props, 'gap', 6)),
            '--columns-minus-one': String(Math.max(1, num(props, 'columns', 4) - 1)),
            '--columns': String(num(props, 'columns', 4)),
          } as CSSProperties
        }
      >
        {props.children}
      </div>
    </div>
  );
}

export function CardPanelLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const Tag = text(props, 'as', 'div') as ElementType;
  return createElement(
    Tag,
    {
      ...common(props),
      ...(Tag === 'a'
        ? {
            href: text(props, 'href') || undefined,
            ...anchorAttributes(props),
          }
        : {}),
      className: cx(
        'peaui-card-panel',
        Boolean(node(props, 'header')) && 'peaui-card-panel--with-header',
        bool(props, 'isShadowEnabled') && 'peaui-card-panel--shadow-enabled',
        bool(props, 'isHoverEnabled', true) &&
          !bool(props, 'isShadowEnabled') &&
          'peaui-card-panel--hover-enabled',
        `peaui-card-panel--background-${text(props, 'backgroundColor', 'default')}`,
        `peaui-card-panel--border-${text(props, 'borderColor', 'default')}`,
        `peaui-card-panel--size-${text(props, 'size', 'm')}`,
        props.className,
      ),
      ref: forwardedRef,
      style: props.style,
    },
    <>
      {node(props, 'header') ? (
        <div className="peaui-card-panel__header">{node(props, 'header')}</div>
      ) : null}
      <div
        className={cx(
          'peaui-card-panel__content',
          Boolean(node(props, 'header')) && 'peaui-card-panel__content--with-header',
        )}
      >
        {props.children}
      </div>
    </>,
  );
}

export function PageLayoutLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <div
      {...common({ ...props, ariaLabel: undefined })}
      className={cx('peaui-page-layout', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      {node(props, 'top') ? (
        <header
          aria-label={text(props, 'ariaLabel') || undefined}
          className={cx(
            'peaui-page-layout__top',
            bool(props, 'isHeaderSticky') && 'peaui-page-layout__top--sticky',
          )}
        >
          {node(props, 'top')}
        </header>
      ) : null}
      <main className="peaui-page-layout__content">
        {node(props, 'additional') ? (
          <div className="peaui-page-layout__additional">{node(props, 'additional')}</div>
        ) : null}
        <div className="peaui-page-layout__body">{props.children}</div>
      </main>
      {node(props, 'footer') ? (
        <footer className="peaui-page-layout__footer">{node(props, 'footer')}</footer>
      ) : null}
    </div>
  );
}

export function FullscreenContainerLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Fullscreen props={props} forwardedRef={forwardedRef} />;
}
