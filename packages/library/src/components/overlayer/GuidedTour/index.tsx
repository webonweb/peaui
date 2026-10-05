/** @jsxImportSource react */
import ButtonAction from '@/components/data-entry/ButtonAction/index.tsx';
import ProgressIndicator from '@/components/feedback/ProgressIndicator/index.tsx';
import { prefersReducedMotion } from '@/helpers/browser.helper';
import {
  collectFocusableElements,
  hasOpenDescendantOverlay,
  trapTabKey,
} from '@/helpers/focus.helper';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import {
  calculateGuidedTourPosition,
  expandGuidedTourRect,
  resolveGuidedTourTarget,
  type GuidedTourErrorPayload,
  type GuidedTourLabels,
  type GuidedTourLifecycleContext,
  type GuidedTourPersistState,
  type GuidedTourProps as GuidedTourBaseProps,
  type GuidedTourRect,
  type GuidedTourStep,
  type GuidedTourStepPayload,
  type GuidedTourTransitionReason,
} from './guided-tour.shared';

const componentClass = 'peaui-guided-tour';
const defaultLabels: GuidedTourLabels = {
  back: 'Back',
  next: 'Next',
  skip: 'Skip tour',
  complete: 'Complete',
  close: 'Close tour',
  pending: 'Please wait',
  resolving: 'Preparing this step...',
  missingTarget: 'The element for this step is not available.',
  blocked: 'Complete the required action before continuing.',
  step: (current, total) => `Step ${current} of ${total}`,
};

export type GuidedTourRenderContext = {
  step: GuidedTourStep;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  pending: boolean;
  back: () => Promise<void>;
  next: () => Promise<void>;
  skip: () => Promise<void>;
};

export type GuidedTourProps = GuidedTourBaseProps & {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode | ((context: GuidedTourRenderContext) => ReactNode);
  renderTitle?: (context: GuidedTourRenderContext) => ReactNode;
  renderDescription?: (context: GuidedTourRenderContext) => ReactNode;
  renderProgress?: (context: GuidedTourRenderContext) => ReactNode;
  renderActions?: (context: GuidedTourRenderContext) => ReactNode;
  renderMissingTarget?: (context: GuidedTourRenderContext) => ReactNode;
  onOpenChange?: (value: boolean) => void;
  onStepChange?: (value: number) => void;
  onStart?: (payload: GuidedTourStepPayload) => void;
  onStepEnter?: (payload: GuidedTourStepPayload) => void;
  onStepLeave?: (payload: GuidedTourStepPayload) => void;
  onNext?: (payload: GuidedTourStepPayload) => void;
  onBack?: (payload: GuidedTourStepPayload) => void;
  onSkip?: (payload: GuidedTourStepPayload) => void;
  onComplete?: (payload: GuidedTourStepPayload) => void;
  onTargetMissing?: (payload: { step: GuidedTourStep; index: number }) => void;
  onError?: (payload: GuidedTourErrorPayload) => void;
};

export type GuidedTourHandle = {
  back: () => Promise<void>;
  next: () => Promise<void>;
  refreshTarget: () => void;
  skip: () => Promise<void>;
};

type CardPosition = {
  top: number;
  left: number;
  placement: 'top' | 'right' | 'bottom' | 'left';
};

function getMaskStyle(
  side: 'top' | 'right' | 'bottom' | 'left',
  rect: GuidedTourRect,
): CSSProperties {
  if (side === 'top') return { top: 0, left: 0, right: 0, height: rect.top };
  if (side === 'bottom') return { top: rect.bottom, left: 0, right: 0, bottom: 0 };
  if (side === 'left') {
    return { top: rect.top, left: 0, width: rect.left, height: rect.height };
  }
  return { top: rect.top, left: rect.right, right: 0, height: rect.height };
}

const GuidedTour = forwardRef<GuidedTourHandle, GuidedTourProps>(function GuidedTour(
  {
    steps,
    open = false,
    step = 0,
    mode = 'spotlight',
    cardVariant = 'card',
    showMask = true,
    allowSkip = true,
    closeOnEscape = true,
    scrollBehavior = 'smooth',
    targetTimeout = 2000,
    missingTargetStrategy = 'block',
    spotlightPadding = 8,
    pending = false,
    labels: labelOverrides,
    persist,
    ariaLabel = 'Guided tour',
    dataTestId,
    className,
    style,
    children,
    renderTitle,
    renderDescription,
    renderProgress,
    renderActions,
    renderMissingTarget,
    onOpenChange,
    onStepChange,
    onStart,
    onStepEnter,
    onStepLeave,
    onNext,
    onBack,
    onSkip,
    onComplete,
    onTargetMissing,
    onError,
  },
  forwardedRef,
) {
  const uid = useId().replaceAll(':', '');
  const titleId = `${componentClass}-${uid}-title`;
  const descriptionId = `${componentClass}-${uid}-description`;
  const cardRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousIndexRef = useRef<number | null>(null);
  const activationTokenRef = useRef(0);
  const [targetRect, setTargetRect] = useState<GuidedTourRect | null>(null);
  const [cardPosition, setCardPosition] = useState<CardPosition>({
    top: 16,
    left: 16,
    placement: 'bottom',
  });
  const [resolving, setResolving] = useState(false);
  const [missingTarget, setMissingTarget] = useState(false);
  const [lifecyclePending, setLifecyclePending] = useState(false);
  const [advanceBlocked, setAdvanceBlocked] = useState(false);
  const [activationRevision, setActivationRevision] = useState(0);

  const safeIndex = steps.length ? Math.min(Math.max(Math.trunc(step), 0), steps.length - 1) : 0;
  const currentStep = steps[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex >= steps.length - 1;
  const busy = pending || resolving || lifecyclePending;
  const labels = useMemo(() => ({ ...defaultLabels, ...labelOverrides }), [labelOverrides]);

  const emitError = useCallback(
    (error: unknown, phase: GuidedTourErrorPayload['phase'], index = safeIndex) => {
      onError?.({ error, phase, step: steps[index], index });
    },
    [onError, safeIndex, steps],
  );

  const persistState = useCallback(
    async (nextOpen: boolean, nextStep: number, reason: GuidedTourTransitionReason) => {
      if (!persist) return;
      const state: GuidedTourPersistState = {
        open: nextOpen,
        step: nextStep,
        stepId: steps[nextStep]?.id,
        reason,
      };
      try {
        await persist(state);
      } catch (error) {
        emitError(error, 'persist', nextStep);
      }
    },
    [emitError, persist, steps],
  );

  const contextFor = useCallback(
    (index = safeIndex): GuidedTourLifecycleContext | null => {
      const stepItem = steps[index];
      return stepItem ? { step: stepItem, index, target: targetRef.current } : null;
    },
    [safeIndex, steps],
  );

  const payloadFor = useCallback(
    (reason: GuidedTourTransitionReason, index = safeIndex): GuidedTourStepPayload | null => {
      const context = contextFor(index);
      return context ? { ...context, reason } : null;
    },
    [contextFor, safeIndex],
  );

  const leaveStep = useCallback(
    async (index: number, reason: GuidedTourTransitionReason) => {
      const context = contextFor(index);
      if (!context) return;
      setLifecyclePending(true);
      try {
        await context.step.afterLeave?.(context);
      } catch (error) {
        emitError(error, 'afterLeave', index);
      } finally {
        setLifecyclePending(false);
      }
      onStepLeave?.({ ...context, reason });
    },
    [contextFor, emitError, onStepLeave],
  );

  const requestSkip = useCallback(async () => {
    const payload = payloadFor('skip');
    if (!payload) return;
    await leaveStep(safeIndex, 'skip');
    onSkip?.(payload);
    await persistState(false, safeIndex, 'skip');
    onOpenChange?.(false);
  }, [leaveStep, onOpenChange, onSkip, payloadFor, persistState, safeIndex]);

  const requestNext = useCallback(async () => {
    if (busy) return;
    const context = contextFor();
    if (!context) return;
    setLifecyclePending(true);
    let allowed = true;
    try {
      allowed =
        typeof context.step.canAdvance === 'function'
          ? await context.step.canAdvance(context)
          : context.step.canAdvance !== false;
    } catch (error) {
      allowed = false;
      emitError(error, 'guard');
    } finally {
      setLifecyclePending(false);
    }
    if (!allowed) {
      setAdvanceBlocked(true);
      return;
    }
    const payload = payloadFor('next');
    if (!payload) return;
    onNext?.(payload);
    if (isLast) {
      await leaveStep(safeIndex, 'complete');
      onComplete?.({ ...payload, reason: 'complete' });
      await persistState(false, safeIndex, 'complete');
      onOpenChange?.(false);
      return;
    }
    const nextIndex = safeIndex + 1;
    await persistState(true, nextIndex, 'next');
    onStepChange?.(nextIndex);
  }, [
    busy,
    contextFor,
    emitError,
    isLast,
    leaveStep,
    onComplete,
    onNext,
    onOpenChange,
    onStepChange,
    payloadFor,
    persistState,
    safeIndex,
  ]);

  const requestBack = useCallback(async () => {
    if (busy || isFirst) return;
    const payload = payloadFor('back');
    if (!payload) return;
    onBack?.(payload);
    const previousIndex = safeIndex - 1;
    await persistState(true, previousIndex, 'back');
    onStepChange?.(previousIndex);
  }, [busy, isFirst, onBack, onStepChange, payloadFor, persistState, safeIndex]);

  const updateGeometry = useCallback(() => {
    if (!open || typeof window === 'undefined') return;
    const cardRect = cardRef.current?.getBoundingClientRect();
    const cardSize = {
      width: cardRect?.width ?? Math.min(360, window.innerWidth - 32),
      height: cardRect?.height ?? 220,
    };
    if (mode !== 'spotlight' || !targetRef.current) {
      setTargetRect(null);
      setCardPosition({
        top: Math.max(16, (window.innerHeight - cardSize.height) / 2),
        left: Math.max(16, (window.innerWidth - cardSize.width) / 2),
        placement: 'bottom',
      });
      return;
    }
    const rect = expandGuidedTourRect(
      targetRef.current.getBoundingClientRect(),
      spotlightPadding,
      window.innerWidth,
      window.innerHeight,
    );
    setTargetRect(rect);
    setCardPosition(
      calculateGuidedTourPosition(
        rect,
        cardSize,
        currentStep?.placement ?? 'auto',
        window.innerWidth,
        window.innerHeight,
      ),
    );
  }, [currentStep?.placement, mode, open, spotlightPadding]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    if (!steps.length) {
      onOpenChange?.(false);
      return undefined;
    }
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const payload = payloadFor('start');
    if (payload) onStart?.(payload);
    void persistState(true, safeIndex, 'start');
    return () => {
      activationTokenRef.current += 1;
      const previousFocus = previousFocusRef.current;
      previousFocusRef.current = null;
      if (previousFocus !== null && previousFocus.isConnected) {
        window.requestAnimationFrame(() => previousFocus.focus());
      }
    };
  }, [open, onOpenChange, onStart, payloadFor, persistState, safeIndex, steps.length]);

  useEffect(() => {
    if (!open || !currentStep || typeof document === 'undefined') return undefined;
    const token = ++activationTokenRef.current;
    const activate = async () => {
      const previousIndex = previousIndexRef.current;
      if (previousIndex !== null && previousIndex !== safeIndex) {
        await leaveStep(previousIndex, 'external');
      }
      previousIndexRef.current = safeIndex;
      setAdvanceBlocked(false);
      setMissingTarget(false);
      setResolving(mode === 'spotlight' && currentStep.target !== undefined);
      targetRef.current = null;
      setTargetRect(null);

      const initialContext: GuidedTourLifecycleContext = {
        step: currentStep,
        index: safeIndex,
        target: null,
      };
      try {
        await currentStep.beforeEnter?.(initialContext);
      } catch (error) {
        emitError(error, 'beforeEnter', safeIndex);
      }
      if (token !== activationTokenRef.current) return;

      let resolvedTarget: HTMLElement | null = null;
      if (mode === 'spotlight' && currentStep.target !== undefined) {
        try {
          resolvedTarget = await resolveGuidedTourTarget(currentStep.target, {
            timeout: targetTimeout,
            isCancelled: () => token !== activationTokenRef.current,
          });
        } catch (error) {
          emitError(error, 'resolve', safeIndex);
        }
      }
      if (token !== activationTokenRef.current) return;
      targetRef.current = resolvedTarget;
      setResolving(false);

      if (mode === 'spotlight' && currentStep.target !== undefined && !resolvedTarget) {
        setMissingTarget(true);
        onTargetMissing?.({ step: currentStep, index: safeIndex });
        if (missingTargetStrategy === 'close' || (missingTargetStrategy === 'skip' && isLast)) {
          await persistState(false, safeIndex, 'skip');
          onOpenChange?.(false);
          return;
        }
        if (missingTargetStrategy === 'skip') {
          const nextIndex = safeIndex + 1;
          await persistState(true, nextIndex, 'next');
          onStepChange?.(nextIndex);
          return;
        }
      }

      if (resolvedTarget) {
        const reducedMotion = prefersReducedMotion();
        resolvedTarget.scrollIntoView({
          behavior: reducedMotion ? 'auto' : scrollBehavior,
          block: 'center',
          inline: 'center',
        });
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      }
      if (token !== activationTokenRef.current) return;
      window.requestAnimationFrame(() => {
        updateGeometry();
        cardRef.current?.focus({ preventScroll: true });
      });
      const payload = payloadFor('external', safeIndex);
      if (payload) onStepEnter?.(payload);
    };
    void activate();
    return () => {
      activationTokenRef.current += 1;
    };
  }, [
    activationRevision,
    currentStep,
    emitError,
    isLast,
    leaveStep,
    missingTargetStrategy,
    mode,
    onOpenChange,
    onStepChange,
    onStepEnter,
    onTargetMissing,
    open,
    payloadFor,
    persistState,
    safeIndex,
    scrollBehavior,
    targetTimeout,
    updateGeometry,
  ]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return undefined;
    updateGeometry();
    window.addEventListener('resize', updateGeometry);
    window.addEventListener('scroll', updateGeometry, true);
    window.visualViewport?.addEventListener('resize', updateGeometry);
    window.visualViewport?.addEventListener('scroll', updateGeometry);
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateGeometry);
    if (targetRef.current) observer?.observe(targetRef.current);
    if (cardRef.current) observer?.observe(cardRef.current);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateGeometry);
      window.removeEventListener('scroll', updateGeometry, true);
      window.visualViewport?.removeEventListener('resize', updateGeometry);
      window.visualViewport?.removeEventListener('scroll', updateGeometry);
    };
  }, [open, updateGeometry]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const handleKeydown = (event: KeyboardEvent) => {
      const containers = [cardRef.current, mode === 'spotlight' ? targetRef.current : null];
      if (
        event.defaultPrevented ||
        (event.key === 'Escape' && hasOpenDescendantOverlay(containers)) ||
        (event.key === 'Tab' && hasOpenDescendantOverlay(containers, 'modal-dialog'))
      )
        return;
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        void requestSkip();
        return;
      }
      trapTabKey(
        event,
        collectFocusableElements([
          cardRef.current,
          mode === 'spotlight' ? targetRef.current : null,
        ]),
        cardRef.current,
      );
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [closeOnEscape, mode, open, requestSkip]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      back: requestBack,
      next: requestNext,
      refreshTarget: () => setActivationRevision((value) => value + 1),
      skip: requestSkip,
    }),
    [requestBack, requestNext, requestSkip],
  );

  if (!open || !currentStep) return null;

  const renderContext: GuidedTourRenderContext = {
    step: currentStep,
    index: safeIndex,
    total: steps.length,
    isFirst,
    isLast,
    pending: busy,
    back: requestBack,
    next: requestNext,
    skip: requestSkip,
  };
  const progressText = labels.step(safeIndex + 1, steps.length);
  const hasDescription =
    Boolean(currentStep.description) || Boolean(renderDescription) || missingTarget;
  const rootClassName = [
    componentClass,
    `${componentClass}--mode-${mode}`,
    `${componentClass}--variant-${cardVariant}`,
    showMask ? null : `${componentClass}--without-mask`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  let dataState = 'active';
  if (resolving) dataState = 'resolving';
  else if (missingTarget) dataState = 'missing-target';
  let primaryActionLabel = labels.next;
  if (busy) primaryActionLabel = labels.pending;
  else if (isLast) primaryActionLabel = labels.complete;
  const spotlightStyle: CSSProperties | undefined = targetRect
    ? {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : undefined;
  const body = (() => {
    if (resolving) {
      return (
        <div id={descriptionId} className={`${componentClass}__status`}>
          {labels.resolving}
        </div>
      );
    }
    if (missingTarget) {
      return (
        <div
          id={descriptionId}
          className={`${componentClass}__status ${componentClass}__status--warning`}
          role="status"
        >
          {renderMissingTarget?.(renderContext) ?? labels.missingTarget}
        </div>
      );
    }
    if (typeof children === 'function') return children(renderContext);
    if (children !== undefined) return children;
    if (!currentStep.description && !renderDescription) return null;
    return (
      <p id={descriptionId} className={`${componentClass}__description`}>
        {renderDescription?.(renderContext) ?? currentStep.description}
      </p>
    );
  })();

  return (
    <div
      className={rootClassName}
      style={style}
      data-testid={dataTestId}
      data-step-id={currentStep.id}
      data-state={dataState}
    >
      {showMask && (mode === 'modal' || !targetRect) ? (
        <div
          className={`${componentClass}__mask ${componentClass}__mask--full`}
          aria-hidden="true"
        />
      ) : null}
      {showMask && mode === 'spotlight' && targetRect
        ? (['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <div
              key={side}
              className={`${componentClass}__mask ${componentClass}__mask--${side}`}
              style={getMaskStyle(side, targetRect)}
              aria-hidden="true"
            />
          ))
        : null}
      {mode === 'spotlight' && targetRect ? (
        <div className={`${componentClass}__spotlight`} style={spotlightStyle} aria-hidden="true" />
      ) : null}
      <section
        ref={cardRef}
        className={`${componentClass}__card`}
        style={{ top: cardPosition.top, left: cardPosition.left }}
        role="dialog"
        aria-modal={mode === 'modal' || undefined}
        aria-label={ariaLabel}
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        aria-busy={busy || undefined}
        tabIndex={-1}
      >
        <div className={`${componentClass}__header`}>
          <div className={`${componentClass}__heading`}>
            <span className={`${componentClass}__step-label`} aria-live="polite">
              {progressText}
            </span>
            <h2 id={titleId} className={`${componentClass}__title`}>
              {renderTitle?.(renderContext) ?? currentStep.title ?? progressText}
            </h2>
          </div>
          {renderProgress?.(renderContext) ?? (
            <ProgressIndicator
              steps={steps.length}
              active={safeIndex + 1}
              size={42}
              strokeWidth={4}
            />
          )}
        </div>
        <div className={`${componentClass}__body`}>
          {body}
          {advanceBlocked ? (
            <p className={`${componentClass}__blocked`} role="status">
              {labels.blocked}
            </p>
          ) : null}
        </div>
        <div className={`${componentClass}__actions`}>
          {renderActions?.(renderContext) ?? (
            <>
              {!isFirst ? (
                <ButtonAction
                  size="s"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void requestBack()}
                >
                  {labels.back}
                </ButtonAction>
              ) : null}
              {allowSkip && !missingTarget ? (
                <ButtonAction
                  size="s"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => void requestSkip()}
                >
                  {labels.skip}
                </ButtonAction>
              ) : null}
              {missingTarget ? (
                <ButtonAction
                  size="s"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void requestSkip()}
                >
                  {labels.close}
                </ButtonAction>
              ) : (
                <ButtonAction
                  size="s"
                  variant="primary"
                  disabled={busy || currentStep.canAdvance === false}
                  onClick={() => void requestNext()}
                >
                  {primaryActionLabel}
                </ButtonAction>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
});

GuidedTour.displayName = 'GuidedTour';

export default GuidedTour;
