/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import { type RuntimeProps, text, common, cx, node, bool, callback } from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  type ElementType,
  createElement,
  useId,
} from 'react';
import { AvatarRenderer } from './avatar.renderer';
import { Disclosure } from './disclosure';
import { Carousel } from './carousel';
import { Tree } from './tree.renderer';
import {
  TableRenderer,
  TableListHeaderLeafRenderer,
  TableListFooterLeafRenderer,
} from './table.renderer';
import { InfoTooltipRenderer } from './info-tooltip.renderer';
import { renderSvgMarkup as StaticSvg } from './svg-markup.renderer';
import { feedbackHintIcon } from '../../components/feedback/feedback-icons.shared';
import { SECTION_HEADING_TAGS } from '../../components/data-display/SectionHeading/section-heading.shared';

export function DisplayRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'Avatar') return <AvatarRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'CounterBadge')
    return <CounterBadgeLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'TagChip') return <TagChipLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'DescriptionField')
    return <DescriptionFieldLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'DisclosurePanel')
    return <DisclosurePanelLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'SectionHeading')
    return <SectionHeadingLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'CalculationResults')
    return <CalculationResultsLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'CardCarousel')
    return <CardCarouselLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'TreeList') return <TreeListLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'TableListHeader')
    return <TableListHeaderLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'TableListFooter')
    return <TableListFooterLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'TableList')
    return <TableRenderer {...props} __name={kind} forwardedRef={forwardedRef} />;
  return (
    <div {...common(props)} ref={forwardedRef as ForwardedRef<HTMLDivElement>}>
      {props.children}
    </div>
  );
}

export function CounterBadgeLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <span
      {...common(props)}
      className={cx(
        'peaui-counter-badge',
        `peaui-counter-badge--variant-${text(props, 'variant', 'info')}`,
        `peaui-counter-badge--size-${text(props, 'size', 's')}`,
        props.className,
      )}
      ref={forwardedRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {text(props, 'value', '0')}
    </span>
  );
}

export function TagChipLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const Tag = text(props, 'as', 'button') as ElementType;
  const interactive = Object.keys(props).some(
    (key) => /^on(?:Click|Key|Mouse|Pointer|Touch)/.test(key) && typeof props[key] === 'function',
  );
  return createElement(
    Tag,
    {
      ...common(props),
      className: cx(
        'peaui-tag-chip',
        `peaui-tag-chip--variant-${text(props, 'variant', 'outline')}${bool(props, 'active') ? '-active' : ''}`,
        `peaui-tag-chip--size-${text(props, 'size', 'xs')}`,
        props.className,
      ),
      ref: forwardedRef,
      type: Tag === 'button' ? 'button' : undefined,
      disabled: Tag === 'button' ? bool(props, 'disabled') : undefined,
      'aria-pressed':
        Tag === 'button'
          ? (props['aria-pressed'] ??
            (interactive && 'active' in props ? bool(props, 'active') : undefined))
          : undefined,
    },
    text(props, 'label'),
  );
}

export function DescriptionFieldLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <dl
      {...common(props)}
      className={cx('peaui-description-field', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDListElement>}
    >
      <dd className="peaui-description-field__addon peaui-description-field__addon--before">
        {node(props, 'additionalBefore')}
      </dd>
      <dt className="peaui-description-field__label">
        {text(props, 'label')}
        {node(props, 'hint') ? (
          <InfoTooltipRenderer description={node(props, 'hint')} placement="right">
            <StaticSvg data={feedbackHintIcon} className="peaui-description-field__hint-icon" />
          </InfoTooltipRenderer>
        ) : null}
      </dt>
      <dd className="peaui-description-field__value">{props.children}</dd>
      <dd className="peaui-description-field__addon peaui-description-field__addon--after">
        {node(props, 'additionalAfter')}
      </dd>
    </dl>
  );
}

export function DisclosurePanelLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Disclosure props={props} forwardedRef={forwardedRef} />;
}

export function SectionHeadingLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const Tag = text(props, 'as', 'div') as ElementType;
  const size = text(props, 'size', 'l');
  const Title = ((SECTION_HEADING_TAGS as Readonly<Record<string, string>>)[size] ??
    'h3') as ElementType;
  const variant = text(props, 'variant', 'default');
  const sizeName: Record<string, string> = {
    'heading-l': 'heading-large',
    'heading-m': 'heading-medium',
    'heading-s': 'heading-small',
    'heading-xs': 'heading-extra-small',
    l: 'large',
    xl: 'extra-large',
    s: 'small',
  };
  const titleSize = sizeName[size];
  const descriptionSize =
    size === 'heading-m' ? 'large' : size === 'heading-l' ? 'heading-large' : sizeName[size];
  return createElement(
    Tag,
    {
      ...common(props),
      className: cx('peaui-section-heading', props.className),
      ref: forwardedRef,
    },
    <>
      {node(props, 'title') ? (
        <Title
          className={cx(
            'peaui-section-heading__title',
            titleSize && `peaui-section-heading__title--${titleSize}`,
            `peaui-section-heading__title--variant-${variant}`,
          )}
        >
          {node(props, 'title')}
          {node(props, 'hint') ? (
            <InfoTooltipRenderer description={node(props, 'hint')} placement="right">
              <StaticSvg data={feedbackHintIcon} className="peaui-section-heading__hint-icon" />
            </InfoTooltipRenderer>
          ) : null}
        </Title>
      ) : null}
      {node(props, 'description') ? (
        <p
          className={cx(
            'peaui-section-heading__description',
            descriptionSize && `peaui-section-heading__description--${descriptionSize}`,
            `peaui-section-heading__description--variant-${variant}`,
          )}
        >
          {node(props, 'description')}
        </p>
      ) : null}
    </>,
  );
}

export function CalculationResultsLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const outputId = `calculation-output-${useId()}`;
  const outputBindings = {
    id: outputId,
    role: 'status',
    'aria-live': 'polite' as const,
    'aria-atomic': true,
  };
  return (
    <div
      {...common(props)}
      aria-busy={bool(props, 'isLoading')}
      className={cx(
        'peaui-calculation-results',
        bool(props, 'isSimple') && 'peaui-calculation-results--simple',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <div
        className={cx(
          'peaui-calculation-results__content',
          bool(props, 'isSimple') && 'peaui-calculation-results__content--simple',
        )}
      >
        <label
          htmlFor={outputId}
          className={cx(
            'peaui-calculation-results__content-label',
            bool(props, 'isSimple') && 'peaui-calculation-results__content-label--simple',
          )}
        >
          <span>{text(props, 'label')}</span>
          {node(props, 'additional')}
          {node(props, 'hint') ? (
            <InfoTooltipRenderer description={node(props, 'hint')} placement="right">
              <StaticSvg data={feedbackHintIcon} className="peaui-calculation-results__hint-icon" />
            </InfoTooltipRenderer>
          ) : null}
        </label>
        {!bool(props, 'isSimple') ? (
          <output {...outputBindings} className="peaui-calculation-results__content-output">
            {bool(props, 'isLoading') ? (
              <span className="peaui-calculation-results__content-loading">Trwa obliczanie…</span>
            ) : (
              text(props, 'result', '-/-')
            )}
          </output>
        ) : null}
      </div>
      {bool(props, 'isSimple') ? (
        <output
          {...outputBindings}
          className="peaui-calculation-results__content-output peaui-calculation-results__content-output--simple"
        >
          {bool(props, 'isLoading') ? (
            <span className="peaui-calculation-results__content-loading">Trwa obliczanie…</span>
          ) : (
            text(props, 'result', '-/-')
          )}
        </output>
      ) : null}
      {bool(props, 'showCalculateButton', true) && !bool(props, 'isSimple') ? (
        <button
          aria-label="Oblicz wynik"
          aria-controls={outputId}
          className={cx(
            'peaui-calculation-results__content-button peaui-button-action peaui-button-action--size-s peaui-button-action--variant-primary',
            (bool(props, 'disabled') || bool(props, 'isLoading')) &&
              'peaui-button-action--is-disabled',
          )}
          disabled={bool(props, 'disabled') || bool(props, 'isLoading')}
          type="button"
          onClick={() => callback(props, 'onSimulate')?.()}
        >
          Oblicz
        </button>
      ) : null}
    </div>
  );
}

export function CardCarouselLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Carousel props={props} forwardedRef={forwardedRef} />;
}

export function TreeListLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Tree props={props} forwardedRef={forwardedRef} />;
}
