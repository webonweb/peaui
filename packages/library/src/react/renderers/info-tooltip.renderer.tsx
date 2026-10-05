/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import {
  type RuntimeProps,
  bool,
  common,
  text,
  hasVisibleReactText,
  cx,
  dataTest,
  node,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useRef,
  useState,
  type CSSProperties,
  useEffect,
} from 'react';
import { bindTooltipVisibility } from '../../components/overlayer/InfoTooltip/tooltip-visibility.shared';

export const INFO_TOOLTIP_FOCUSABLE_TRIGGER_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export const INFO_TOOLTIP_MANAGED_TRIGGER_ANCESTOR_SELECTOR =
  'button, a[href], summary, [role="button"], [role="link"], [role="option"], [role="radio"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"]';

export const INFO_TOOLTIP_DEFAULT_ARIA_LABEL = 'Pokaz dodatkowe informacje';

export function addDescriptionId(element: HTMLElement, id: string): void {
  const ids = new Set(
    (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
  );
  ids.add(id);
  element.setAttribute('aria-describedby', [...ids].join(' '));
}

export function removeDescriptionId(element: HTMLElement, id: string): void {
  const ids = (element.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((entry) => entry !== id);

  if (ids.length > 0) element.setAttribute('aria-describedby', ids.join(' '));
  else element.removeAttribute('aria-describedby');
}

export function InfoTooltipRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const disabled = bool(props, 'disabled');
  const tooltipId = `info-tooltip-react-${useId().replaceAll(':', '')}`;
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [triggerMode, setTriggerMode] = useState<'own' | 'descendant' | 'ancestor'>('own');
  const [open, setOpen] = useState(false);
  const triggerContent = props.children;
  const commonProps = common(props);
  const baseTestId = text(props, 'dataTestId');
  const sharedStyles = { '--unique-anchor': `--anchor-${tooltipId}` } as CSSProperties;
  const managesOwnTrigger = !disabled && triggerMode === 'own';
  const describedByIds = new Set(
    (commonProps['aria-describedby'] ?? '').split(/\s+/).filter(Boolean),
  );

  if (managesOwnTrigger) describedByIds.add(tooltipId);

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger || disabled) {
      setOpen(false);
      return;
    }

    const focusableDescendants = Array.from(
      trigger.querySelectorAll<HTMLElement>(INFO_TOOLTIP_FOCUSABLE_TRIGGER_SELECTOR),
    );
    let managedAncestor: HTMLElement | null = null;

    if (focusableDescendants.length === 0) {
      let currentElement = trigger.parentElement;

      while (currentElement) {
        if (currentElement.matches(INFO_TOOLTIP_MANAGED_TRIGGER_ANCESTOR_SELECTOR)) {
          managedAncestor = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }
    }

    const describedTriggers =
      focusableDescendants.length > 0
        ? focusableDescendants
        : managedAncestor
          ? [managedAncestor]
          : [];
    const nextMode =
      focusableDescendants.length > 0 ? 'descendant' : managedAncestor ? 'ancestor' : 'own';

    setTriggerMode(nextMode);
    describedTriggers.forEach((element) => addDescriptionId(element, tooltipId));

    const stopVisibility = contentRef.current
      ? bindTooltipVisibility(trigger, contentRef.current, setOpen, managedAncestor ?? trigger)
      : undefined;

    return () => {
      describedTriggers.forEach((element) => removeDescriptionId(element, tooltipId));
      stopVisibility?.();
    };
  }, [disabled, props.children, tooltipId]);

  return (
    <>
      <div
        {...commonProps}
        aria-describedby={describedByIds.size > 0 ? [...describedByIds].join(' ') : undefined}
        aria-label={
          commonProps['aria-label'] ??
          (managesOwnTrigger &&
          !commonProps['aria-labelledby'] &&
          !hasVisibleReactText(triggerContent)
            ? INFO_TOOLTIP_DEFAULT_ARIA_LABEL
            : undefined)
        }
        className={cx(
          'peaui-info-tooltip',
          disabled && 'peaui-info-tooltip--disabled',
          props.className,
        )}
        data-open={open && !disabled ? 'true' : undefined}
        data-testid={baseTestId ? `${baseTestId}-content` : dataTest(props)}
        ref={(element) => {
          triggerRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        role={commonProps.role ?? (managesOwnTrigger ? 'button' : undefined)}
        style={{ ...props.style, ...sharedStyles }}
        tabIndex={commonProps.tabIndex ?? (managesOwnTrigger ? 0 : undefined)}
      >
        {triggerContent}
      </div>
      <div
        aria-hidden={disabled ? 'true' : undefined}
        className={cx(
          'peaui-info-tooltip__content',
          `peaui-info-tooltip__content--variant-${text(props, 'variant', 'default')}`,
          `peaui-info-tooltip__content--placement-${text(props, 'placement', 'top')}`,
        )}
        data-testid={baseTestId ? `${baseTestId}-tooltip` : undefined}
        id={tooltipId}
        ref={contentRef}
        role="tooltip"
        style={sharedStyles}
      >
        {node(props, 'title') ? (
          <strong
            className="peaui-info-tooltip__title"
            data-testid={baseTestId ? `${baseTestId}-title` : undefined}
          >
            {node(props, 'title')}
          </strong>
        ) : null}
        {node(props, 'description') ? (
          <p
            className="peaui-info-tooltip__description"
            data-testid={baseTestId ? `${baseTestId}-description` : undefined}
          >
            {node(props, 'description')}
          </p>
        ) : null}
      </div>
    </>
  );
}
