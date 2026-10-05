/** @jsxImportSource react */
import {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  createScrollAreaController,
  type ScrollAreaController,
  type ScrollAreaEventName,
} from '../components/layout/ScrollArea/scroll-area.controller';
import {
  getScrollAreaPosition,
  normalizeScrollAreaAutoHideDelay,
  normalizeScrollAreaScrollbarSize,
  type ScrollAreaEdgeDetail,
  type ScrollAreaHandle,
  type ScrollAreaOrientation,
  type ScrollAreaPosition,
  type ScrollAreaResizeDetail,
  type ScrollAreaScrollbarSlotState,
  type ScrollAreaScrollbarVisibility,
  type ScrollAreaType,
} from '../components/layout/ScrollArea/scroll-area.shared';

type ScrollAreaRuntimeProps = Record<string, unknown> & {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
  ariaLabel?: string;
  autoHideDelay?: number;
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
  endIndicator?: ReactNode;
  forwardedRef?: ForwardedRef<ScrollAreaHandle>;
  id?: string;
  onReachEnd?: (detail: ScrollAreaEdgeDetail) => void;
  onReachStart?: (detail: ScrollAreaEdgeDetail) => void;
  onResize?: (detail: ScrollAreaResizeDetail) => void;
  onScroll?: (detail: ScrollAreaPosition) => void;
  onScrollEnd?: (detail: ScrollAreaPosition) => void;
  onScrollStart?: (detail: ScrollAreaPosition) => void;
  orientation?: ScrollAreaOrientation;
  renderScrollbar?: (state: ScrollAreaScrollbarSlotState) => ReactNode;
  restorePosition?: boolean;
  scrollbarSize?: number;
  scrollbarVisibility?: ScrollAreaScrollbarVisibility;
  startIndicator?: ReactNode;
  style?: CSSProperties;
  tabIndex?: number;
  tabindex?: number;
  type?: ScrollAreaType;
};

const EMPTY_POSITION: ScrollAreaPosition = {
  x: 0,
  y: 0,
  maxX: 0,
  maxY: 0,
  overflowX: false,
  overflowY: false,
  atStartX: true,
  atEndX: true,
  atStartY: true,
  atEndY: true,
};

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function ScrollAreaRenderer({
  forwardedRef,
  ...props
}: ScrollAreaRuntimeProps): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const resolvedId = props.id?.trim() || `peaui-scroll-area-${generatedId}`;
  const viewportId = `${resolvedId}-viewport`;
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const horizontalBarRef = useRef<HTMLDivElement>(null);
  const horizontalThumbRef = useRef<HTMLDivElement>(null);
  const verticalBarRef = useRef<HTMLDivElement>(null);
  const verticalThumbRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ScrollAreaController | undefined>(undefined);
  const propsRef = useRef(props);
  propsRef.current = props;

  const type = props.type ?? 'styled';
  const orientation = props.orientation ?? 'vertical';
  const visibility = props.scrollbarVisibility ?? 'auto';
  const disabled = props.disabled ?? false;
  const restorePosition = props.restorePosition ?? false;
  const tabIndex = props.tabIndex ?? props.tabindex ?? (type === 'native' ? 0 : undefined);
  const externalLabel = props['aria-label']?.trim();
  const labelledBy = props['aria-labelledby']?.trim();
  const resolvedLabel =
    props.ariaLabel?.trim() ||
    externalLabel ||
    (tabIndex !== undefined ? 'Obszar przewijania' : undefined);
  const dataTestId = props.dataTestId || props['data-testid'];

  const dispatch = (
    name: ScrollAreaEventName,
    detail: ScrollAreaPosition | ScrollAreaResizeDetail | ScrollAreaEdgeDetail,
  ): void => {
    const current = propsRef.current;
    if (name === 'scroll') current.onScroll?.(detail as ScrollAreaPosition);
    else if (name === 'scrollStart') current.onScrollStart?.(detail as ScrollAreaPosition);
    else if (name === 'scrollEnd') current.onScrollEnd?.(detail as ScrollAreaPosition);
    else if (name === 'reachStart') current.onReachStart?.(detail as ScrollAreaEdgeDetail);
    else if (name === 'reachEnd') current.onReachEnd?.(detail as ScrollAreaEdgeDetail);
    else current.onResize?.(detail as ScrollAreaResizeDetail);
  };

  const options = useMemo(
    () => ({
      autoHideDelay: normalizeScrollAreaAutoHideDelay(props.autoHideDelay ?? 700),
      disabled,
      orientation,
      restoreKey: restorePosition && props.id?.trim() ? props.id.trim() : undefined,
      restorePosition,
      styled: type === 'styled',
      onEvent: dispatch,
    }),
    [disabled, orientation, props.autoHideDelay, props.id, restorePosition, type],
  );
  const initialOptionsRef = useRef(options);

  useEffect(() => {
    if (!rootRef.current || !viewportRef.current || !contentRef.current) return;
    controllerRef.current = createScrollAreaController(
      {
        root: rootRef.current,
        viewport: viewportRef.current,
        content: contentRef.current,
        horizontalBar: horizontalBarRef.current,
        horizontalThumb: horizontalThumbRef.current,
        verticalBar: verticalBarRef.current,
        verticalThumb: verticalThumbRef.current,
      },
      initialOptionsRef.current,
    );
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.update(options, true);
  }, [options]);

  useImperativeHandle(
    forwardedRef,
    (): ScrollAreaHandle => ({
      get viewport() {
        return controllerRef.current?.viewport ?? viewportRef.current;
      },
      scrollTo(scrollOptions) {
        controllerRef.current?.scrollTo(scrollOptions);
      },
      scrollBy(scrollOptions) {
        controllerRef.current?.scrollBy(scrollOptions);
      },
      scrollIntoView(target, scrollOptions) {
        return controllerRef.current?.scrollIntoView(target, scrollOptions) ?? false;
      },
      getPosition() {
        return (
          controllerRef.current?.getPosition() ??
          (viewportRef.current ? getScrollAreaPosition(viewportRef.current) : EMPTY_POSITION)
        );
      },
    }),
    [],
  );

  const rootStyle = {
    ...props.style,
    '--peaui-scroll-area-scrollbar-size': `${normalizeScrollAreaScrollbarSize(
      props.scrollbarSize ?? 10,
    )}px`,
  } as CSSProperties;
  const className = cx(
    'peaui-scroll-area',
    `peaui-scroll-area--${type}`,
    `peaui-scroll-area--${orientation}`,
    `peaui-scroll-area--visibility-${visibility}`,
    disabled && 'peaui-scroll-area--disabled',
    props.className,
  );
  const scrollbarContent = (axis: ScrollAreaScrollbarSlotState['orientation']): ReactNode =>
    props.renderScrollbar?.({ orientation: axis });

  return (
    <div
      className={className}
      data-testid={dataTestId}
      id={resolvedId}
      ref={rootRef}
      style={rootStyle}
    >
      <div
        aria-label={labelledBy ? undefined : resolvedLabel}
        aria-labelledby={labelledBy}
        className="peaui-scroll-area__viewport"
        data-testid={dataTestId ? `${dataTestId}-viewport` : undefined}
        id={viewportId}
        ref={viewportRef}
        role={resolvedLabel || labelledBy ? 'region' : undefined}
        tabIndex={tabIndex}
      >
        <div className="peaui-scroll-area__content" ref={contentRef}>
          {props.children}
        </div>
      </div>

      <div
        aria-controls={viewportId}
        aria-label={`${resolvedLabel || 'Obszar przewijania'}: przewijanie poziome`}
        aria-orientation="horizontal"
        aria-valuemax={0}
        aria-valuemin={0}
        aria-valuenow={0}
        className="peaui-scroll-area__scrollbar peaui-scroll-area__scrollbar--horizontal"
        ref={horizontalBarRef}
        role="scrollbar"
      >
        <div className="peaui-scroll-area__thumb" ref={horizontalThumbRef}>
          {scrollbarContent('horizontal')}
        </div>
      </div>

      <div
        aria-controls={viewportId}
        aria-label={`${resolvedLabel || 'Obszar przewijania'}: przewijanie pionowe`}
        aria-orientation="vertical"
        aria-valuemax={0}
        aria-valuemin={0}
        aria-valuenow={0}
        className="peaui-scroll-area__scrollbar peaui-scroll-area__scrollbar--vertical"
        ref={verticalBarRef}
        role="scrollbar"
      >
        <div className="peaui-scroll-area__thumb" ref={verticalThumbRef}>
          {scrollbarContent('vertical')}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="peaui-scroll-area__indicator peaui-scroll-area__indicator--start"
      >
        {props.startIndicator}
      </div>
      <div
        aria-hidden="true"
        className="peaui-scroll-area__indicator peaui-scroll-area__indicator--end"
      >
        {props.endIndicator}
      </div>
    </div>
  );
}
