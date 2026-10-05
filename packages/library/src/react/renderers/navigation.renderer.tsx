/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  type RuntimeProps,
  text,
  num,
  asOptions,
  common,
  anchorAttributes,
  cx,
  callback,
  bool,
  node,
} from './runtime.shared';
import { iconArrow, iconCheck, iconLock, iconProgressFinish } from '../generated-static-icons';
import {
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Pagination } from './pagination';
import { ListLimitControlRenderer } from './list-limit-control.renderer';
import { Svg } from './svg.renderer';
import { NavigationDisclosureCardRenderer } from './navigation-disclosure-card.renderer';
import { Popover } from './popover';
import {
  getStepperScrollPosition,
  scrollStepper,
} from '../../components/navigation/NavigationStepper/navigation-stepper.shared';
import {
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
} from '../../components/navigation/DropdownMenu/menu.shared';

function onNavigationKeydown(event: KeyboardEvent<HTMLButtonElement>, selector: string): void {
  const buttons = Array.from(
    event.currentTarget.closest('nav')?.querySelectorAll<HTMLButtonElement>(selector) ?? [],
  );
  const index = buttons.indexOf(event.currentTarget);
  let next: number;
  if (event.key === 'Home') next = edgeEnabledMenuIndex(buttons, 'first');
  else if (event.key === 'End') next = edgeEnabledMenuIndex(buttons, 'last');
  else if (event.key === 'ArrowRight') next = nextEnabledMenuIndex(buttons, index, 1);
  else if (event.key === 'ArrowLeft') next = nextEnabledMenuIndex(buttons, index, -1);
  else return;
  event.preventDefault();
  const target = buttons[next];
  target?.focus();
  if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

export function NavigationRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'PaginationControl')
    return <PaginationControlLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'ListLimitControl') {
    return <ListLimitControlRenderer {...props} forwardedRef={forwardedRef} />;
  }
  if (kind === 'Breadcrumbs')
    return <BreadcrumbsLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'NavigationTabs')
    return <NavigationTabsLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'NavigationStepper')
    return <NavigationStepperLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'NavigationDisclosureCard') {
    return <NavigationDisclosureCardRenderer {...props} forwardedRef={forwardedRef} />;
  }
  if (kind === 'NavigationLink')
    return <NavigationLinkLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'NavigationIconCard')
    return <NavigationIconCardLeafRenderer {...props} forwardedRef={forwardedRef} />;
  return <NavigationCardLeafRenderer {...props} forwardedRef={forwardedRef} />;
}

export function PaginationControlLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Pagination props={props} forwardedRef={forwardedRef} />;
}

export function BreadcrumbsLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const items = Array.isArray(props.items) ? (props.items as RuntimeProps[]) : [];
  const options = items.map((item) => {
    const location = typeof window === 'undefined' ? undefined : window.location;
    const label =
      typeof item.label === 'function'
        ? (item.label as (route: Record<string, unknown>) => unknown)({
            fullPath: location ? `${location.pathname}${location.search}${location.hash}` : '',
            path: location?.pathname ?? '',
            hash: location?.hash ?? '',
            meta: {},
            params: {},
            query: {},
          })
        : item.label;
    return { original: item, label: String(label ?? ''), path: text(item, 'path') };
  });
  const renderItem = (item: (typeof options)[number], index: number): ReactElement => {
    if (index === options.length - 1)
      return (
        <span aria-current="page" className="peaui-breadcrumbs__current">
          {item.label}
        </span>
      );
    const attributes = {
      className: 'peaui-breadcrumbs__button',
      'aria-label': `Przejdź do podstrony: ${item.label}`,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        callback(props, 'onNavigate')?.(item.original, event);
      },
    };
    return item.path.trim() ? (
      <a {...attributes} href={item.path}>
        {item.label}
      </a>
    ) : (
      <button {...attributes} type="button">
        {item.label}
      </button>
    );
  };
  return (
    <nav {...common(props)} className={cx('peaui-breadcrumbs', props.className)} ref={forwardedRef}>
      <div className="peaui-breadcrumbs__mobile">
        <Popover
          kind="PopoverButton"
          props={{
            className: 'peaui-breadcrumbs__popover',
            placement: 'bottom-right',
            variant: 'ghost',
            size: 'xs',
            ariaLabel: 'Pokaż menu ścieżki nawigacji',
            children: (
              <svg
                className="peaui-breadcrumbs__icon"
                viewBox="0 0 34 34"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="7.08333" cy="17" r="2.83333" />
                <circle cx="17" cy="17" r="2.83333" />
                <circle cx="26.9167" cy="17" r="2.83333" />
              </svg>
            ),
            content: (
              <ul className="peaui-breadcrumbs__menu" aria-label="Menu ścieżki nawigacji">
                {options.map((item, index) => (
                  <li key={text(item.original, 'key', String(index))}>{renderItem(item, index)}</li>
                ))}
              </ul>
            ),
          }}
        />
        <span aria-hidden="true" className="peaui-breadcrumbs__separator">
          {text(props, 'separator', '/')}
        </span>
        <span aria-current="page" className="peaui-breadcrumbs__current">
          {options.at(-1)?.label}
        </span>
      </div>
      <ol className="peaui-breadcrumbs__content">
        {options.map((item, index) => (
          <li key={text(item.original, 'key', String(index))} className="peaui-breadcrumbs__item">
            {index ? (
              <span aria-hidden="true" className="peaui-breadcrumbs__separator">
                {text(props, 'separator', '/')}
              </span>
            ) : null}
            {renderItem(item, index)}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function NavigationTabsLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const options = asOptions(props.tabs);
  return (
    <nav
      {...common(props)}
      className={cx(
        'peaui-navigation-tabs',
        !bool(props, 'withBackround', true) && 'peaui-navigation-tabs--without-background',
        props.className,
      )}
      ref={forwardedRef}
    >
      {options.map((item, index) => (
        <button
          key={item.id ?? String(item.value ?? index)}
          aria-pressed={Boolean(item.active)}
          className={cx(
            'peaui-navigation-tabs__button',
            item.active && 'peaui-navigation-tabs__button--active',
            item.disabled && 'peaui-navigation-tabs__button--disabled',
            item.isValid === false && 'peaui-navigation-tabs__button--invalid',
          )}
          disabled={item.disabled}
          type="button"
          onClick={() =>
            callback(props, 'onSelect')?.(Array.isArray(props.tabs) ? props.tabs[index] : item)
          }
          onKeyDown={(event) => onNavigationKeydown(event, '.peaui-navigation-tabs__button')}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function NavigationStepperLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const viewportRef = useRef<HTMLElement | null>(null);
  const viewportId = `peaui-navigation-stepper-viewport-${useId().replaceAll(':', '')}`;
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const syncScrollState = useCallback(() => {
    const viewport = viewportRef.current;
    const state = viewport ? getStepperScrollPosition(viewport) : undefined;
    setCanScrollPrev(Boolean(state && state.position > 0));
    setCanScrollNext(Boolean(state && state.position < state.max - 1));
  }, []);
  useEffect(() => {
    syncScrollState();
    window.addEventListener('resize', syncScrollState);
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(syncScrollState);
    if (viewportRef.current) {
      observer?.observe(viewportRef.current);
      if (viewportRef.current.firstElementChild)
        observer?.observe(viewportRef.current.firstElementChild);
    }
    return () => {
      window.removeEventListener('resize', syncScrollState);
      observer?.disconnect();
    };
  }, [syncScrollState]);
  useEffect(syncScrollState, [props.options, syncScrollState]);
  const scrollSteps = (direction: -1 | 1): void => {
    scrollStepper(viewportRef.current, direction);
  };
  const records = Array.isArray(props.options)
    ? props.options.filter(
        (entry): entry is RuntimeProps => typeof entry === 'object' && entry !== null,
      )
    : [];
  return (
    <div
      {...common(props)}
      className={cx('peaui-navigation-stepper', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <button
        aria-label="Przewiń do poprzednich kroków"
        className="peaui-navigation-stepper__control peaui-navigation-stepper__control--prev peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
        aria-controls={viewportId}
        disabled={!canScrollPrev}
        type="button"
        onClick={() => scrollSteps(-1)}
      >
        <Svg
          data={iconArrow}
          className="peaui-navigation-stepper__control-icon peaui-navigation-stepper__control-icon--prev"
          name="arrow"
        />
      </button>
      <nav
        id={viewportId}
        ref={viewportRef}
        onScroll={syncScrollState}
        className="peaui-navigation-stepper__viewport"
        aria-label={text(props, 'ariaLabel', 'Nawigacja kroków')}
      >
        <ol className="peaui-navigation-stepper__list">
          {records.map((item, index) => {
            const status = text(item, 'status', item.active === true ? 'during' : 'default');
            const selectable = status === 'during' || status === 'complete';
            return (
              <li key={text(item, 'key', String(index))} className="peaui-navigation-stepper__item">
                <button
                  aria-current={item.active === true || status === 'during' ? 'step' : undefined}
                  className={cx(
                    'peaui-navigation-stepper__step',
                    `peaui-navigation-stepper__step--status-${status}`,
                    (item.active === true || status === 'during') &&
                      'peaui-navigation-stepper__step--current',
                    !selectable && 'peaui-navigation-stepper__step--disabled',
                  )}
                  disabled={!selectable}
                  type="button"
                  onClick={() => callback(props, 'onSelect')?.(item)}
                  onKeyDown={(event) =>
                    onNavigationKeydown(event, '.peaui-navigation-stepper__step')
                  }
                >
                  <span className="peaui-navigation-stepper__status">
                    {status === 'complete' ? (
                      <Svg
                        data={iconCheck}
                        className="peaui-navigation-stepper__status-icon"
                        name="check"
                      />
                    ) : (
                      text(item, 'number', String(index + 1))
                    )}
                  </span>
                  <span
                    className={cx(
                      'peaui-navigation-stepper__label',
                      `peaui-navigation-stepper__label--status-${status}`,
                    )}
                  >
                    {text(item, 'label')}
                  </span>
                  <span
                    className={cx(
                      'peaui-navigation-stepper__status-label',
                      `peaui-navigation-stepper__status-label--status-${status}`,
                    )}
                  >
                    {status === 'complete'
                      ? 'Gotowe'
                      : status === 'during'
                        ? 'W trakcie'
                        : status === 'disabled'
                          ? 'Zablokowane'
                          : 'Do zrobienia'}
                  </span>
                  {node(item, 'additional') ? (
                    <span className="peaui-navigation-stepper__additional">
                      {node(item, 'additional')}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <button
        aria-label="Przewiń do następnych kroków"
        className="peaui-navigation-stepper__control peaui-navigation-stepper__control--next peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-secondary"
        aria-controls={viewportId}
        disabled={!canScrollNext}
        type="button"
        onClick={() => scrollSteps(1)}
      >
        <Svg
          data={iconArrow}
          className="peaui-navigation-stepper__control-icon peaui-navigation-stepper__control-icon--next"
          name="arrow"
        />
      </button>
    </div>
  );
}

export function NavigationLinkLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <a
      {...common(props)}
      {...anchorAttributes(props)}
      className={cx(
        'peaui-navigation-link',
        `peaui-navigation-link--size-${text(props, 'size', 's')}`,
        `peaui-navigation-link--variant-${text(props, 'variant', 'default')}`,
        props.className,
      )}
      href={text(props, 'path')}
      ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
    >
      {props.children}
    </a>
  );
}

export function NavigationIconCardLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const path = text(props, 'path').trim();
  return (
    <a
      {...common(props)}
      {...anchorAttributes(props)}
      className={cx('peaui-navigation-icon-card', props.className)}
      role={path ? text(props, 'role') || undefined : 'link'}
      aria-disabled={path ? undefined : true}
      tabIndex={path ? num(props, 'tabIndex', 0) : -1}
      href={path || undefined}
      ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
    >
      <Svg className="peaui-navigation-icon-card__icon" name={text(props, 'icon', 'arrowRight')} />
      <strong className="peaui-navigation-icon-card__text">{text(props, 'text')}</strong>
    </a>
  );
}

export function NavigationCardLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const variant = text(props, 'variant', 'default');
  const locked = variant === 'disabled' || variant === 'hidden';
  const path = text(props, 'path');
  const cardContent = (
    <>
      <div className="peaui-navigation-card__content">
        <h4
          className={cx(
            'peaui-navigation-card__title',
            `peaui-navigation-card__title--size-${text(props, 'size', 's')}`,
            locked && 'peaui-navigation-card__title--locked',
          )}
        >
          {text(props, 'title')}
        </h4>
        <p
          className={cx(
            'peaui-navigation-card__description',
            locked && 'peaui-navigation-card__description--locked',
          )}
        >
          {text(props, 'description')}
        </p>
      </div>
      <div
        aria-hidden="true"
        className={cx(
          'peaui-navigation-card__icon',
          `peaui-navigation-card__icon--variant-${variant}`,
        )}
      >
        <Svg
          data={variant === 'complete' ? iconProgressFinish : locked ? iconLock : iconArrow}
          className={cx(
            'peaui-navigation-card__icon-symbol',
            !locked && variant !== 'complete' && 'peaui-navigation-card__icon-symbol--arrow',
          )}
          name={variant === 'complete' ? 'progressFinish' : locked ? 'lock' : 'arrow'}
        />
      </div>
    </>
  );
  const cardClasses = cx(
    'peaui-navigation-card',
    `peaui-navigation-card--variant-${variant}`,
    path && !locked ? 'peaui-navigation-card--interactive' : 'peaui-navigation-card--static',
    props.className,
  );
  return path && !locked ? (
    <a
      {...common(props)}
      {...anchorAttributes(props)}
      className={cardClasses}
      href={path}
      ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
    >
      {cardContent}
    </a>
  ) : (
    <div
      {...common(props)}
      className={cardClasses}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      {cardContent}
    </div>
  );
}
