<script setup lang="ts">
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import ProgressIndicator from '@/components/feedback/ProgressIndicator/index.vue';
import { UIKIT_NAME } from '@/constants';
import { prefersReducedMotion } from '@/helpers/browser.helper';
import {
  collectFocusableElements,
  hasOpenDescendantOverlay,
  trapTabKey,
} from '@/helpers/focus.helper';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue';

import {
  calculateGuidedTourPosition,
  expandGuidedTourRect,
  resolveGuidedTourTarget,
  type GuidedTourCardVariant,
  type GuidedTourErrorPayload,
  type GuidedTourLabels,
  type GuidedTourLifecycleContext,
  type GuidedTourMissingTargetStrategy,
  type GuidedTourMode,
  type GuidedTourPersistState,
  type GuidedTourPlacement,
  type GuidedTourScrollBehavior,
  type GuidedTourStep,
  type GuidedTourStepPayload,
  type GuidedTourTransitionReason,
} from './guided-tour.shared';

interface Props {
  steps: GuidedTourStep[];
  open?: boolean;
  step?: number;
  mode?: GuidedTourMode;
  cardVariant?: GuidedTourCardVariant;
  linear?: boolean;
  showMask?: boolean;
  allowSkip?: boolean;
  closeOnEscape?: boolean;
  scrollBehavior?: GuidedTourScrollBehavior;
  targetTimeout?: number;
  missingTargetStrategy?: GuidedTourMissingTargetStrategy;
  spotlightPadding?: number;
  pending?: boolean;
  labels?: Partial<GuidedTourLabels>;
  persist?: (state: GuidedTourPersistState) => void | Promise<void>;
  ariaLabel?: string;
  dataTestId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  step: 0,
  mode: 'spotlight',
  cardVariant: 'card',
  linear: true,
  showMask: true,
  allowSkip: true,
  closeOnEscape: true,
  scrollBehavior: 'smooth',
  targetTimeout: 2000,
  missingTargetStrategy: 'block',
  spotlightPadding: 8,
  pending: false,
  labels: () => ({}),
  persist: undefined,
  ariaLabel: 'Guided tour',
  dataTestId: undefined,
});

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void;
  (event: 'update:step', value: number): void;
  (event: 'start', payload: GuidedTourStepPayload): void;
  (event: 'stepEnter', payload: GuidedTourStepPayload): void;
  (event: 'stepLeave', payload: GuidedTourStepPayload): void;
  (event: 'next', payload: GuidedTourStepPayload): void;
  (event: 'back', payload: GuidedTourStepPayload): void;
  (event: 'skip', payload: GuidedTourStepPayload): void;
  (event: 'complete', payload: GuidedTourStepPayload): void;
  (event: 'targetMissing', payload: { step: GuidedTourStep; index: number }): void;
  (event: 'error', payload: GuidedTourErrorPayload): void;
}>();

const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-guided-tour`;
const uid = useId();
const titleId = `${classNameComponent}-${uid}-title`;
const descriptionId = `${classNameComponent}-${uid}-description`;
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

const cardReference = ref<HTMLElement | null>(null);
const targetRect = ref<ReturnType<typeof expandGuidedTourRect> | null>(null);
const cardPosition = ref({
  top: 0,
  left: 0,
  placement: 'bottom' as Exclude<GuidedTourPlacement, 'auto'>,
});
const resolving = ref(false);
const missingTarget = ref(false);
const lifecyclePending = ref(false);
const advanceBlocked = ref(false);
let mounted = false;
let targetElement: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;
let activationToken = 0;

const labels = computed<GuidedTourLabels>(() => ({ ...defaultLabels, ...props.labels }));
const safeIndex = computed(() =>
  props.steps.length ? Math.min(Math.max(Math.trunc(props.step), 0), props.steps.length - 1) : 0,
);
const currentStep = computed(() => props.steps[safeIndex.value]);
const isFirstStep = computed(() => safeIndex.value === 0);
const isLastStep = computed(() => safeIndex.value >= props.steps.length - 1);
const isBusy = computed(() => props.pending || resolving.value || lifecyclePending.value);
const isAdvanceStaticallyDisabled = computed(() => currentStep.value?.canAdvance === false);
const hasDescription = computed(
  () =>
    Boolean(currentStep.value?.description) || Boolean(slots.description) || missingTarget.value,
);
const progressText = computed(() => labels.value.step(safeIndex.value + 1, props.steps.length));
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--mode-${props.mode}`,
  `${classNameComponent}--variant-${props.cardVariant}`,
  { [`${classNameComponent}--without-mask`]: !props.showMask },
]);
const cardStyle = computed(() => ({
  top: `${cardPosition.value.top}px`,
  left: `${cardPosition.value.left}px`,
}));
const spotlightStyle = computed(() => {
  const rect = targetRect.value;
  return rect
    ? {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }
    : undefined;
});

function maskStyle(side: 'top' | 'right' | 'bottom' | 'left') {
  const rect = targetRect.value;
  if (!rect) return undefined;
  if (side === 'top') return { top: '0', left: '0', right: '0', height: `${rect.top}px` };
  if (side === 'bottom') return { top: `${rect.bottom}px`, left: '0', right: '0', bottom: '0' };
  if (side === 'left')
    return { top: `${rect.top}px`, left: '0', width: `${rect.left}px`, height: `${rect.height}px` };
  return { top: `${rect.top}px`, left: `${rect.right}px`, right: '0', height: `${rect.height}px` };
}

function lifecycleContext(index = safeIndex.value): GuidedTourLifecycleContext | null {
  const stepItem = props.steps[index];
  return stepItem ? { step: stepItem, index, target: targetElement } : null;
}

function stepPayload(
  reason?: GuidedTourTransitionReason,
  index = safeIndex.value,
): GuidedTourStepPayload | null {
  const context = lifecycleContext(index);
  return context ? { ...context, reason } : null;
}

function emitError(
  error: unknown,
  phase: GuidedTourErrorPayload['phase'],
  index = safeIndex.value,
) {
  emit('error', { error, phase, step: props.steps[index], index });
}

async function persistState(open: boolean, step: number, reason: GuidedTourTransitionReason) {
  if (!props.persist) return;
  try {
    await props.persist({ open, step, stepId: props.steps[step]?.id, reason });
  } catch (error) {
    emitError(error, 'persist', step);
  }
}

function clearTargetTracking() {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener('resize', updateGeometry);
  window.removeEventListener('scroll', updateGeometry, true);
  window.visualViewport?.removeEventListener('resize', updateGeometry);
  window.visualViewport?.removeEventListener('scroll', updateGeometry);
}

function startTargetTracking() {
  clearTargetTracking();
  window.addEventListener('resize', updateGeometry);
  window.addEventListener('scroll', updateGeometry, true);
  window.visualViewport?.addEventListener('resize', updateGeometry);
  window.visualViewport?.addEventListener('scroll', updateGeometry);
  if (typeof ResizeObserver !== 'undefined' && targetElement) {
    resizeObserver = new ResizeObserver(updateGeometry);
    resizeObserver.observe(targetElement);
    if (cardReference.value) resizeObserver.observe(cardReference.value);
  }
}

function updateGeometry() {
  if (!mounted || !props.open) return;
  const card = cardReference.value?.getBoundingClientRect();
  const cardSize = {
    width: card?.width ?? Math.min(360, window.innerWidth - 32),
    height: card?.height ?? 220,
  };
  if (props.mode !== 'spotlight' || !targetElement) {
    targetRect.value = null;
    cardPosition.value = {
      top: Math.max(16, (window.innerHeight - cardSize.height) / 2),
      left: Math.max(16, (window.innerWidth - cardSize.width) / 2),
      placement: 'bottom',
    };
    return;
  }
  const rect = expandGuidedTourRect(
    targetElement.getBoundingClientRect(),
    props.spotlightPadding,
    window.innerWidth,
    window.innerHeight,
  );
  targetRect.value = rect;
  cardPosition.value = calculateGuidedTourPosition(
    rect,
    cardSize,
    currentStep.value?.placement ?? 'auto',
    window.innerWidth,
    window.innerHeight,
  );
}

function focusCard() {
  void nextTick(() => cardReference.value?.focus({ preventScroll: true }));
}

function allowedFocusElements(): HTMLElement[] {
  return collectFocusableElements([
    cardReference.value,
    props.mode === 'spotlight' ? targetElement : null,
  ]);
}

function handleDocumentKeydown(event: KeyboardEvent) {
  const containers = [cardReference.value, props.mode === 'spotlight' ? targetElement : null];
  if (
    !props.open ||
    event.defaultPrevented ||
    (event.key === 'Escape' && hasOpenDescendantOverlay(containers)) ||
    (event.key === 'Tab' && hasOpenDescendantOverlay(containers, 'modal-dialog'))
  )
    return;
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault();
    void requestSkip();
    return;
  }
  trapTabKey(event, allowedFocusElements(), cardReference.value);
}

function restoreFocus() {
  const focusTarget = previousFocus;
  previousFocus = null;
  if (focusTarget?.isConnected) window.requestAnimationFrame(() => focusTarget.focus());
}

async function leaveStep(index: number, reason: GuidedTourTransitionReason) {
  const context = lifecycleContext(index);
  if (!context) return;
  lifecyclePending.value = true;
  try {
    await context.step.afterLeave?.(context);
  } catch (error) {
    emitError(error, 'afterLeave', index);
  } finally {
    lifecyclePending.value = false;
  }
  emit('stepLeave', { ...context, reason });
}

async function completeTour() {
  const payload = stepPayload('complete');
  if (!payload) return;
  await leaveStep(safeIndex.value, 'complete');
  emit('complete', payload);
  await persistState(false, safeIndex.value, 'complete');
  emit('update:open', false);
}

async function handleMissingTarget(index: number) {
  const stepItem = props.steps[index];
  if (!stepItem) return;
  missingTarget.value = true;
  resolving.value = false;
  emit('targetMissing', { step: stepItem, index });
  await nextTick();
  updateGeometry();
  if (props.missingTargetStrategy === 'skip') {
    if (index < props.steps.length - 1) {
      emit('update:step', index + 1);
      await persistState(true, index + 1, 'external');
    } else await completeTour();
    return;
  }
  if (props.missingTargetStrategy === 'close') {
    emit('update:open', false);
    await persistState(false, index, 'external');
    return;
  }
  focusCard();
}

async function activateStep(index: number, reason: GuidedTourTransitionReason) {
  const stepItem = props.steps[index];
  if (!stepItem || !mounted || !props.open) return;
  const token = ++activationToken;
  clearTargetTracking();
  targetElement = null;
  targetRect.value = null;
  missingTarget.value = false;
  advanceBlocked.value = false;
  resolving.value = true;
  const initialContext: GuidedTourLifecycleContext = { step: stepItem, index, target: null };
  try {
    await stepItem.beforeEnter?.(initialContext);
  } catch (error) {
    emitError(error, 'beforeEnter', index);
  }
  if (token !== activationToken || !props.open) return;
  if (props.mode === 'spotlight') {
    try {
      targetElement = await resolveGuidedTourTarget(stepItem.target, {
        timeout: props.targetTimeout,
        isCancelled: () => token !== activationToken || !props.open,
      });
    } catch (error) {
      emitError(error, 'resolve', index);
      targetElement = null;
    }
    if (token !== activationToken || !props.open) return;
    if (!targetElement) {
      await handleMissingTarget(index);
      return;
    }
    const rect = targetElement.getBoundingClientRect();
    const outside =
      rect.top < 0 ||
      rect.left < 0 ||
      rect.bottom > window.innerHeight ||
      rect.right > window.innerWidth;
    if (outside) {
      targetElement.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : props.scrollBehavior,
        block: 'center',
        inline: 'center',
      });
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    }
  }
  resolving.value = false;
  await nextTick();
  updateGeometry();
  startTargetTracking();
  focusCard();
  const payload = stepPayload(reason, index);
  if (payload) emit('stepEnter', payload);
}

async function startTour() {
  if (!props.steps.length) {
    emit('update:open', false);
    return;
  }
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.addEventListener('keydown', handleDocumentKeydown);
  const payload = stepPayload('start');
  if (payload) emit('start', payload);
  await persistState(true, safeIndex.value, 'start');
  await activateStep(safeIndex.value, 'start');
}

function stopTour(shouldRestoreFocus = true) {
  activationToken += 1;
  resolving.value = false;
  lifecyclePending.value = false;
  clearTargetTracking();
  document.removeEventListener('keydown', handleDocumentKeydown);
  targetElement = null;
  targetRect.value = null;
  if (shouldRestoreFocus) restoreFocus();
}

async function canAdvance(): Promise<boolean> {
  const context = lifecycleContext();
  if (!context) return false;
  if (typeof context.step.canAdvance === 'boolean') return context.step.canAdvance;
  if (!context.step.canAdvance) return true;
  try {
    return await context.step.canAdvance(context);
  } catch (error) {
    emitError(error, 'guard');
    return false;
  }
}

async function requestNext() {
  if (isBusy.value) return;
  lifecyclePending.value = true;
  const allowed = await canAdvance();
  lifecyclePending.value = false;
  if (!allowed) {
    advanceBlocked.value = true;
    return;
  }
  const payload = stepPayload('next');
  if (!payload) return;
  emit('next', payload);
  if (isLastStep.value) {
    await completeTour();
    return;
  }
  const nextIndex = safeIndex.value + 1;
  await persistState(true, nextIndex, 'next');
  emit('update:step', nextIndex);
}

async function requestBack() {
  if (isBusy.value || isFirstStep.value) return;
  const payload = stepPayload('back');
  if (!payload) return;
  emit('back', payload);
  const previousIndex = safeIndex.value - 1;
  await persistState(true, previousIndex, 'back');
  emit('update:step', previousIndex);
}

async function requestSkip() {
  const payload = stepPayload('skip');
  if (!payload) return;
  await leaveStep(safeIndex.value, 'skip');
  emit('skip', payload);
  await persistState(false, safeIndex.value, 'skip');
  emit('update:open', false);
}

async function refreshTarget() {
  if (props.open) await activateStep(safeIndex.value, 'external');
}

watch(
  () => props.open,
  (value, previousValue) => {
    if (!mounted || value === previousValue) return;
    if (value) void startTour();
    else stopTour();
  },
);
watch(
  () => props.step,
  (value, previousValue) => {
    if (!mounted || !props.open || value === previousValue) return;
    void (async () => {
      const oldIndex = Math.min(
        Math.max(Math.trunc(previousValue), 0),
        Math.max(0, props.steps.length - 1),
      );
      await leaveStep(oldIndex, 'external');
      await activateStep(safeIndex.value, 'external');
    })();
  },
);
watch(
  () => props.steps,
  () => {
    if (mounted && props.open) void refreshTarget();
  },
  { deep: false },
);

onMounted(() => {
  mounted = true;
  if (props.open) void startTour();
});
onBeforeUnmount(() => {
  mounted = false;
  stopTour(false);
});

defineExpose({ back: requestBack, next: requestNext, refreshTarget, skip: requestSkip });
</script>

<template>
  <div
    v-if="open && currentStep"
    :class="rootClasses"
    :data-testid="dataTestId"
    :data-step-id="currentStep.id"
    :data-state="resolving ? 'resolving' : missingTarget ? 'missing-target' : 'active'"
  >
    <template v-if="showMask">
      <div
        v-if="mode === 'modal' || !targetRect"
        :class="`${classNameComponent}__mask ${classNameComponent}__mask--full`"
        aria-hidden="true"
      />
      <template v-else>
        <div
          v-for="side in ['top', 'right', 'bottom', 'left'] as const"
          :key="side"
          :class="`${classNameComponent}__mask ${classNameComponent}__mask--${side}`"
          :style="maskStyle(side)"
          aria-hidden="true"
        />
      </template>
    </template>
    <div
      v-if="mode === 'spotlight' && targetRect"
      :class="`${classNameComponent}__spotlight`"
      :style="spotlightStyle"
      aria-hidden="true"
    />
    <section
      ref="cardReference"
      :class="`${classNameComponent}__card`"
      :style="cardStyle"
      role="dialog"
      :aria-modal="mode === 'modal' ? 'true' : undefined"
      :aria-label="ariaLabel"
      :aria-labelledby="titleId"
      :aria-describedby="hasDescription ? descriptionId : undefined"
      :aria-busy="isBusy || undefined"
      tabindex="-1"
    >
      <div :class="`${classNameComponent}__header`">
        <div :class="`${classNameComponent}__heading`">
          <span :class="`${classNameComponent}__step-label`" aria-live="polite">{{
            progressText
          }}</span>
          <h2 :id="titleId" :class="`${classNameComponent}__title`">
            <slot name="title" :step="currentStep" :index="safeIndex">{{
              currentStep.title || progressText
            }}</slot>
          </h2>
        </div>
        <slot name="progress" :step="currentStep" :index="safeIndex" :total="steps.length">
          <ProgressIndicator
            :steps="steps.length"
            :active="safeIndex + 1"
            :size="42"
            :stroke-width="4"
          />
        </slot>
      </div>
      <div :class="`${classNameComponent}__body`">
        <div v-if="resolving" :id="descriptionId" :class="`${classNameComponent}__status`">
          {{ labels.resolving }}
        </div>
        <div
          v-else-if="missingTarget"
          :id="descriptionId"
          :class="`${classNameComponent}__status ${classNameComponent}__status--warning`"
          role="status"
        >
          <slot name="missing-target" :step="currentStep" :index="safeIndex">{{
            labels.missingTarget
          }}</slot>
        </div>
        <slot v-else name="content" :step="currentStep" :index="safeIndex" :total="steps.length">
          <p
            v-if="currentStep.description || slots.description"
            :id="descriptionId"
            :class="`${classNameComponent}__description`"
          >
            <slot name="description" :step="currentStep" :index="safeIndex">{{
              currentStep.description
            }}</slot>
          </p>
        </slot>
        <p v-if="advanceBlocked" :class="`${classNameComponent}__blocked`" role="status">
          {{ labels.blocked }}
        </p>
      </div>
      <div :class="`${classNameComponent}__actions`">
        <slot
          name="actions"
          :step="currentStep"
          :index="safeIndex"
          :is-first="isFirstStep"
          :is-last="isLastStep"
          :pending="isBusy"
          :back="requestBack"
          :next="requestNext"
          :skip="requestSkip"
        >
          <ButtonAction
            v-if="!isFirstStep"
            size="s"
            variant="secondary"
            :disabled="isBusy"
            @click="requestBack"
          >
            {{ labels.back }}
          </ButtonAction>
          <ButtonAction
            v-if="allowSkip && !missingTarget"
            size="s"
            variant="ghost"
            :disabled="isBusy"
            @click="requestSkip"
          >
            {{ labels.skip }}
          </ButtonAction>
          <ButtonAction
            v-if="missingTarget"
            size="s"
            variant="secondary"
            :disabled="isBusy"
            @click="requestSkip"
          >
            {{ labels.close }}
          </ButtonAction>
          <ButtonAction
            v-else
            size="s"
            variant="primary"
            :disabled="isBusy || isAdvanceStaticallyDisabled"
            @click="requestNext"
          >
            {{ isBusy ? labels.pending : isLastStep ? labels.complete : labels.next }}
          </ButtonAction>
        </slot>
      </div>
    </section>
  </div>
</template>
