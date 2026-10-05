/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type ToggleGroupValue,
  isToggleGroupItemAvailable,
  findToggleGroupEdgeIndex,
  findToggleGroupReplacementIndex,
  findNextToggleGroupIndex,
} from '../../components/data-entry/ToggleGroup/toggle-group.shared';
import {
  type RuntimeProps,
  text,
  bool,
  useFormControlModel,
  dataTest,
  callback,
  cx,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  useEffect,
} from 'react';
import { Svg } from './svg.renderer';

export type ReactSegmentedControlItem = {
  value: ToggleGroupValue;
  label: string;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
  metadata?: unknown;
};

export function asSegmentedControlItems(value: unknown): ReactSegmentedControlItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ReactSegmentedControlItem[] => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.value !== 'string' && typeof item.value !== 'number') return [];
    if (typeof item.label !== 'string') return [];
    return [
      {
        value: item.value,
        label: item.label,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        ariaLabel: typeof item.ariaLabel === 'string' ? item.ariaLabel : undefined,
        disabled: item.disabled === true,
        metadata: item.metadata,
      },
    ];
  });
}

export function SegmentedControlRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-segmented-control-${generatedId}`;
  const items = useMemo(() => asSegmentedControlItems(props.items), [props.items]);
  const size = text(props, 'size', 'm');
  const distribution = text(props, 'distribution', 'equal');
  const content = text(props, 'content', 'text');
  const orientation = text(props, 'orientation', 'horizontal') as 'horizontal' | 'vertical';
  const activation = text(props, 'activation', 'automatic');
  const fullWidth = bool(props, 'fullWidth');
  const disabled = bool(props, 'disabled');
  const loop = props.loop !== false;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [modelValue, setModelValue] = useFormControlModel<unknown>(props, 'value', null, rootRef);
  const selectedIndex = items.findIndex((item) => Object.is(item.value, modelValue));
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastActiveIndex = useRef(0);
  const focusWithin = useRef(false);
  const frameId = useRef<number | undefined>(undefined);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const initialActiveValue = (): ToggleGroupValue | null => {
    const index =
      selectedIndex >= 0 && isToggleGroupItemAvailable(items[selectedIndex])
        ? selectedIndex
        : findToggleGroupEdgeIndex(items, 'first');
    return items[index]?.value ?? null;
  };
  const [activeValue, setActiveValue] = useState<ToggleGroupValue | null>(initialActiveValue);
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});
  const activeIndex = items.findIndex(
    (item) => Object.is(item.value, activeValue) && isToggleGroupItemAvailable(item),
  );
  const baseTestId = dataTest(props);
  const externalLabelledBy = text(props, 'aria-labelledby');
  const resolvedAriaLabel = text(props, 'aria-label') || text(props, 'ariaLabel', 'Wybór opcji');
  const renderItem = props.renderItem as
    | ((
        item: ReactSegmentedControlItem,
        state: { disabled: boolean; index: number; selected: boolean },
      ) => ReactNode)
    | undefined;
  const renderItemIcon = props.renderItemIcon as
    | ((item: ReactSegmentedControlItem, state: { index: number; selected: boolean }) => ReactNode)
    | undefined;
  const renderIndicator = props.renderIndicator as
    ((item: ReactSegmentedControlItem | null, index: number) => ReactNode) | undefined;
  const isAvailable = (index: number): boolean =>
    !disabled && isToggleGroupItemAvailable(items[index]);
  const isSelected = (index: number): boolean => index === selectedIndex;

  const updateIndicator = (): void => {
    const segment = buttonRefs.current[selectedIndexRef.current];
    if (!segment || !rootRef.current) {
      setIndicatorStyle({});
      setIndicatorReady(true);
      return;
    }
    setIndicatorStyle({
      '--peaui-segmented-control-indicator-x': `${segment.offsetLeft}px`,
      '--peaui-segmented-control-indicator-y': `${segment.offsetTop}px`,
      '--peaui-segmented-control-indicator-width': `${segment.offsetWidth}px`,
      '--peaui-segmented-control-indicator-height': `${segment.offsetHeight}px`,
    } as CSSProperties);
    setIndicatorReady(true);
  };
  const scheduleIndicatorUpdate = (): void => {
    if (typeof requestAnimationFrame === 'undefined') {
      updateIndicator();
      return;
    }
    if (frameId.current !== undefined) cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      frameId.current = undefined;
      updateIndicator();
    });
  };
  const ensureSelectedVisible = (): void => {
    const container = rootRef.current;
    const segment = buttonRefs.current[selectedIndex];
    if (!container || !segment || typeof container.scrollBy !== 'function') return;
    const containerRect = container.getBoundingClientRect();
    const segmentRect = segment.getBoundingClientRect();
    if (orientation === 'vertical') {
      const topDelta = segmentRect.top - containerRect.top;
      const bottomDelta = segmentRect.bottom - containerRect.bottom;
      if (topDelta < 0) container.scrollBy({ behavior: 'auto', top: topDelta });
      else if (bottomDelta > 0) container.scrollBy({ behavior: 'auto', top: bottomDelta });
      return;
    }
    const startDelta = segmentRect.left - containerRect.left;
    const endDelta = segmentRect.right - containerRect.right;
    if (startDelta < 0) container.scrollBy({ behavior: 'auto', left: startDelta });
    else if (endDelta > 0) container.scrollBy({ behavior: 'auto', left: endDelta });
  };
  const segmentedActionsRef = useRef({
    ensureSelectedVisible,
    isAvailable,
    items,
    scheduleIndicatorUpdate,
    updateIndicator,
  });
  segmentedActionsRef.current = {
    ensureSelectedVisible,
    isAvailable,
    items,
    scheduleIndicatorUpdate,
    updateIndicator,
  };

  useEffect(() => {
    if (activeIndex >= 0 && !disabled) {
      lastActiveIndex.current = activeIndex;
      return;
    }
    const replacementIndex = disabled
      ? -1
      : findToggleGroupReplacementIndex(items, lastActiveIndex.current);
    setActiveValue(items[replacementIndex]?.value ?? null);
    lastActiveIndex.current = Math.max(replacementIndex, 0);
    if (focusWithin.current && replacementIndex >= 0) {
      buttonRefs.current[replacementIndex]?.focus();
    }
  }, [activeIndex, disabled, items]);

  useEffect(() => {
    const actions = segmentedActionsRef.current;
    if (actions.isAvailable(selectedIndex)) {
      setActiveValue(actions.items[selectedIndex]?.value ?? null);
      lastActiveIndex.current = selectedIndex;
    }
    actions.updateIndicator();
    actions.ensureSelectedVisible();
  }, [distribution, fullWidth, orientation, selectedIndex]);

  useEffect(() => {
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => segmentedActionsRef.current.scheduleIndicatorUpdate());
    if (rootRef.current) observer?.observe(rootRef.current);
    const handleResize = (): void => segmentedActionsRef.current.scheduleIndicatorUpdate();
    if (!observer) window.addEventListener('resize', handleResize, { passive: true });
    const fontSet = Reflect.get(document, 'fonts') as FontFaceSet | undefined;
    if (fontSet) void fontSet.ready.then(handleResize);
    segmentedActionsRef.current.updateIndicator();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', handleResize);
      if (frameId.current !== undefined) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const focusItem = (index: number): void => {
    if (!isAvailable(index)) return;
    setActiveValue(items[index]?.value ?? null);
    lastActiveIndex.current = index;
    buttonRefs.current[index]?.focus();
  };
  const selectItem = (
    item: ReactSegmentedControlItem,
    index: number,
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ): void => {
    if (!isAvailable(index) || isSelected(index)) return;
    setModelValue(item.value);
    callback(props, 'onChange')?.(item.value, item, event);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    let nextIndex = -1;
    if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(items, 'first');
    else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(items, 'last');
    else if (orientation === 'horizontal' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
      const forward = event.key === 'ArrowRight' ? !rtl : rtl;
      nextIndex = findNextToggleGroupIndex(items, index, forward ? 1 : -1, loop);
    } else if (orientation === 'vertical' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      nextIndex = findNextToggleGroupIndex(items, index, event.key === 'ArrowDown' ? 1 : -1, loop);
    } else return;
    event.preventDefault();
    if (nextIndex < 0) return;
    focusItem(nextIndex);
    const item = items[nextIndex];
    if (item && activation === 'automatic') selectItem(item, nextIndex, event);
  };
  const setRootRef = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };

  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        aria-label={externalLabelledBy ? undefined : resolvedAriaLabel || 'Wybór opcji'}
        aria-labelledby={externalLabelledBy || undefined}
        aria-orientation={orientation}
        className={cx(
          'peaui-segmented-control',
          `peaui-segmented-control--size-${size}`,
          `peaui-segmented-control--distribution-${distribution}`,
          `peaui-segmented-control--content-${content}`,
          `peaui-segmented-control--${orientation}`,
          fullWidth && 'peaui-segmented-control--full-width',
          disabled && 'peaui-segmented-control--disabled',
          indicatorReady && 'peaui-segmented-control--indicator-ready',
          props.className,
        )}
        data-activation={activation}
        data-disabled={disabled || undefined}
        data-has-selection={selectedIndex >= 0 || undefined}
        data-testid={baseTestId}
        dir={text(props, 'dir') || undefined}
        id={id}
        ref={setRootRef}
        role="radiogroup"
        style={{ ...props.style, ...indicatorStyle }}
        onBlurCapture={() => {
          queueMicrotask(() => {
            focusWithin.current = Boolean(rootRef.current?.contains(document.activeElement));
          });
        }}
        onFocusCapture={() => {
          focusWithin.current = true;
        }}
      >
        <span
          aria-hidden="true"
          className="peaui-segmented-control__indicator"
          data-visible={selectedIndex >= 0 || undefined}
        >
          {renderIndicator?.(items[selectedIndex] ?? null, selectedIndex)}
        </span>
        {items.map((item, index) => {
          const selected = isSelected(index);
          const itemDisabled = disabled || item.disabled === true;
          const customContent = renderItem?.(item, { disabled: itemDisabled, index, selected });
          return (
            <button
              aria-checked={selected}
              aria-label={item.ariaLabel || item.label}
              className={cx(
                'peaui-segmented-control__item',
                selected && 'peaui-segmented-control__item--selected',
                itemDisabled && 'peaui-segmented-control__item--disabled',
              )}
              data-segmented-control-index={index}
              data-selected={selected || undefined}
              data-testid={baseTestId ? `${baseTestId}-item-${index}` : undefined}
              disabled={itemDisabled}
              id={`${id}-item-${index}`}
              key={`${typeof item.value}:${String(item.value)}:${index}`}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              role="radio"
              tabIndex={isAvailable(index) && activeIndex === index ? 0 : -1}
              type="button"
              onClick={(event) => selectItem(item, index, event)}
              onFocus={() => {
                setActiveValue(item.value);
                lastActiveIndex.current = index;
                callback(props, 'onFocusChange')?.(item, index);
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {customContent ?? (
                <>
                  {content !== 'text' && (item.icon || renderItemIcon) ? (
                    <span aria-hidden="true" className="peaui-segmented-control__icon">
                      {renderItemIcon?.(item, { index, selected }) ??
                        (item.icon ? <Svg name={item.icon} /> : null)}
                    </span>
                  ) : null}
                  {content !== 'icon' ? (
                    <span className="peaui-segmented-control__label">{item.label}</span>
                  ) : null}
                </>
              )}
            </button>
          );
        })}
      </div>
      {text(props, 'name') && selectedIndex >= 0 ? (
        <input
          disabled={disabled}
          name={text(props, 'name')}
          type="hidden"
          value={items[selectedIndex]?.value}
        />
      ) : null}
    </>
  );
}
