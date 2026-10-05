/** @jsxImportSource react */

import { type RuntimeProps, bool, num, common, cx, text } from './runtime.shared';
import { iconArrow } from '../generated-static-icons';
import {
  type ForwardedRef,
  type ReactElement,
  Children,
  isValidElement,
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  type CSSProperties,
} from 'react';
import { prefersReducedMotion } from '../../helpers/browser.helper';
import {
  getCarouselMetrics,
  createCarouselRotationToggle,
  CAROUSEL_DEFAULT_VISIBLE_SLIDES,
  CAROUSEL_DEFAULT_DELAY,
  CAROUSEL_PAUSE_LABEL,
  CAROUSEL_RESUME_LABEL,
} from '../../components/data-display/CardCarousel/carousel.shared';
import { Svg } from './svg.renderer';

export function Carousel({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const slides = Children.toArray(props.children);
  const [active, setActive] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const viewportId = `peaui-carousel-${useId()}-viewport`;
  const [paused, setPaused] = useState(false);
  const [rotationToggle] = useState(createCarouselRotationToggle);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pointer = useRef<{ x: number; left: number } | null>(null);
  const requested = Math.max(
    1,
    Math.floor(
      num(
        props,
        'defaultVisibleSlides',
        num(props, 'defualtVisibleSlides', CAROUSEL_DEFAULT_VISIBLE_SLIDES),
      ),
    ),
  );
  const [metrics, setMetrics] = useState({ step: 0, visible: requested });
  const maxIndex = Math.max(0, slides.length - metrics.visible);
  const withAnimation = bool(props, 'withAnimation');
  const delay = num(props, 'animationDelay', CAROUSEL_DEFAULT_DELAY);
  const animationDelay = delay > 0 ? delay : CAROUSEL_DEFAULT_DELAY;
  const scrollToIndex = useCallback(
    (index: number): void => {
      const element = viewport.current;
      if (!element) return;
      const next = Math.max(0, Math.min(maxIndex, index));
      setActive(next);
      element.scrollTo({
        left: next * (metrics.step || element.clientWidth),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [maxIndex, metrics.step],
  );
  useEffect(() => {
    const element = viewport.current;
    if (!element) return undefined;
    const measure = (): void => {
      const next = getCarouselMetrics(element, slides.length, requested);
      setMetrics((current) =>
        current.step === next.step && current.visible === next.visible ? current : next,
      );
      const index = Math.min(activeRef.current, Math.max(0, slides.length - next.visible));
      if (index !== activeRef.current) element.scrollLeft = index * next.step;
      setActive(index);
    };
    measure();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [requested, slides.length]);
  useEffect(() => {
    const media =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : undefined;
    const update = (): void => {
      if (media?.matches === true) setPaused(true);
    };
    update();
    media?.addEventListener('change', update);
    return () => media?.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!withAnimation || maxIndex === 0 || paused || hovering || dragging) return undefined;
    const timer = window.setInterval(
      () => scrollToIndex(activeRef.current >= maxIndex ? 0 : activeRef.current + 1),
      animationDelay,
    );
    return () => window.clearInterval(timer);
  }, [animationDelay, maxIndex, withAnimation, paused, hovering, dragging, scrollToIndex]);
  const move = (delta: number): void => scrollToIndex(active + delta);
  return (
    <div
      {...common(props)}
      aria-roledescription="carousel"
      aria-label={
        text(props, 'aria-labelledby')
          ? undefined
          : text(props, 'aria-label', text(props, 'ariaLabel', 'Karuzela kart'))
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(true);
      }}
      onKeyDown={(event) => {
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          (event.target instanceof Element && event.target.closest('.peaui-card-carousel__slide'))
        )
          return;
        const targets: Record<string, number> = {
          ArrowLeft: active - 1,
          ArrowRight: active + 1,
          Home: 0,
          End: maxIndex,
        };
        const next = targets[event.key];
        if (next !== undefined) {
          event.preventDefault();
          scrollToIndex(next);
        }
      }}
      className={cx(
        'peaui-card-carousel',
        slides.length === 1 && 'peaui-card-carousel--single-slide',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="region"
      style={
        {
          ...props.style,
          '--peaui-card-carousel-visible-slides': String(requested),
        } as CSSProperties
      }
    >
      {withAnimation && maxIndex > 0 ? (
        <button
          type="button"
          className="peaui-card-carousel__rotation"
          aria-controls={viewportId}
          onPointerDown={() => rotationToggle.capturePointerState(paused)}
          onClick={(event) => setPaused(rotationToggle.toggle(paused, event))}
        >
          {paused
            ? text(props, 'resumeLabel', CAROUSEL_RESUME_LABEL)
            : text(props, 'pauseLabel', CAROUSEL_PAUSE_LABEL)}
        </button>
      ) : null}
      <div
        ref={viewport}
        id={viewportId}
        onScroll={(event) => {
          if (metrics.step > 0)
            setActive(
              Math.max(
                0,
                Math.min(maxIndex, Math.round(event.currentTarget.scrollLeft / metrics.step)),
              ),
            );
        }}
        onPointerDown={(event) => {
          if (
            (event.pointerType === 'mouse' && event.button !== 0) ||
            (event.target instanceof Element &&
              event.target.closest(
                'a,button,input,textarea,select,[role="button"],[contenteditable="true"]',
              ))
          )
            return;
          pointer.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
          setDragging(true);
          if (typeof event.currentTarget.setPointerCapture === 'function')
            event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (pointer.current)
            event.currentTarget.scrollLeft =
              pointer.current.left - (event.clientX - pointer.current.x);
        }}
        onPointerUp={(event) => {
          pointer.current = null;
          setDragging(false);
          if (
            typeof event.currentTarget.hasPointerCapture === 'function' &&
            event.currentTarget.hasPointerCapture(event.pointerId)
          )
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          pointer.current = null;
          setDragging(false);
        }}
        aria-label={`${text(props, 'ariaLabel', 'Karuzela kart')} - obszar przewijania`}
        className="peaui-card-carousel__viewport"
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <div
            key={isValidElement(slide) ? (slide.key ?? index) : index}
            aria-label={`Slajd ${index + 1} z ${slides.length}`}
            aria-roledescription="slide"
            className="peaui-card-carousel__slide"
            role="group"
          >
            {slide}
          </div>
        ))}
      </div>
      {(bool(props, 'isNavigationVisible', true) || bool(props, 'isNavigationDotsVisible', true)) &&
      maxIndex > 0 ? (
        <div
          className={cx(
            'peaui-card-carousel__controls',
            !bool(props, 'isNavigationDotsVisible', true) &&
              'peaui-card-carousel__controls--navigation-only',
          )}
        >
          {bool(props, 'isNavigationVisible', true) ? (
            <button
              aria-label="Pokaż poprzednie karty"
              className="peaui-card-carousel__navigation peaui-card-carousel__navigation--previous"
              aria-controls={viewportId}
              disabled={active === 0}
              type="button"
              onClick={() => move(-1)}
            >
              <Svg data={iconArrow} className="peaui-card-carousel__navigation-icon" name="arrow" />
            </button>
          ) : null}
          {bool(props, 'isNavigationDotsVisible', true) ? (
            <div
              aria-label="Pozycje karuzeli"
              className="peaui-card-carousel__pagination"
              role="group"
            >
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  aria-current={index === active || undefined}
                  aria-disabled={index === active || undefined}
                  aria-controls={viewportId}
                  aria-label={`Pokaż slajd ${index + 1}`}
                  className={cx(
                    'peaui-card-carousel__dot',
                    index === active && 'peaui-card-carousel__dot--active',
                  )}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
          ) : null}
          {bool(props, 'isNavigationVisible', true) ? (
            <button
              aria-label="Pokaż następne karty"
              className="peaui-card-carousel__navigation peaui-card-carousel__navigation--next"
              aria-controls={viewportId}
              disabled={active === maxIndex}
              type="button"
              onClick={() => move(1)}
            >
              <Svg data={iconArrow} className="peaui-card-carousel__navigation-icon" name="arrow" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
