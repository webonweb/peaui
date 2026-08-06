<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  Comment,
  Fragment,
  Text,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
  type StyleValue,
  type VNode,
} from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    animationDelay?: number;
    dataTestId?: string;
    defaultVisibleSlides?: number;
    defualtVisibleSlides?: number;
    isNavigationDotsVisible?: boolean;
    isNavigationVisible?: boolean;
    withAnimation?: boolean;
  }>(),
  {
    animationDelay: 2000,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: false,
  },
);

const attrs = useAttrs();
const slots = useSlots();
const uid = useId();
const viewportRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const visibleSlidesCount = ref(
  Math.max(1, Math.floor(Number(props.defaultVisibleSlides ?? props.defualtVisibleSlides ?? 4))),
);
const slideStep = ref(0);
const isPointerDragging = ref(false);
const totalSlides = ref(0);

let resizeObserver: ResizeObserver | null = null;
let pointerStartX = 0;
let pointerStartScrollLeft = 0;
let animationInterval: number | undefined;
let syncIndexTimeout: number | undefined;

const classNameComponent = `${UIKIT_NAME}-card-carousel`;
const DEFAULT_ACCESSIBLE_NAME = 'Karuzela kart';
const INTERACTIVE_TARGET_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [role="link"], [contenteditable="true"]';

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const renderedSlides = computed(() => normalizeSlides(slots.default?.() ?? []));

const requestedVisibleSlides = computed(() => {
  const value = props.defaultVisibleSlides ?? props.defualtVisibleSlides ?? 4;
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    return 4;
  }

  return Math.max(1, Math.floor(normalizedValue));
});

const maxStartIndex = computed(() => {
  return Math.max(totalSlides.value - visibleSlidesCount.value, 0);
});

const dotCount = computed(() => {
  return totalSlides.value > 0 ? maxStartIndex.value + 1 : 0;
});

const hasOverflow = computed(() => totalSlides.value > visibleSlidesCount.value);
const canGoPrevious = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => currentIndex.value < maxStartIndex.value);
const isNavigationDotsEnabled = computed(() => props.isNavigationDotsVisible);
const shouldRenderDots = computed(() => isNavigationDotsEnabled.value && dotCount.value > 1);
const hasControls = computed(
  () => hasOverflow.value && (props.isNavigationVisible || shouldRenderDots.value),
);
const resolvedAnimationDelay = computed(() => {
  const normalizedValue = Number(props.animationDelay);

  if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
    return 2000;
  }

  return normalizedValue;
});
const controlsClasses = computed(() => [
  `${classNameComponent}__controls`,
  !shouldRenderDots.value && `${classNameComponent}__controls--navigation-only`,
]);

const normalizedAttrsAriaLabel = computed(() => `${attrs['aria-label'] ?? ''}`.trim() || undefined);
const normalizedAttrsAriaLabelledBy = computed(
  () => `${attrs['aria-labelledby'] ?? ''}`.trim() || undefined,
);
const normalizedAttrsDataTestId = computed(
  () => `${attrs['data-testid'] ?? ''}`.trim() || undefined,
);

const resolvedAriaLabel = computed(() => {
  return props.ariaLabel?.trim() || normalizedAttrsAriaLabel.value || DEFAULT_ACCESSIBLE_NAME;
});
const viewportAriaLabel = computed(() => `${resolvedAriaLabel.value} - obszar przewijania`);

const rootId = computed(() => {
  return `${attrs.id ?? `${classNameComponent}-${uid}`}`;
});

const rootTestId = computed(() => {
  return props.dataTestId ?? normalizedAttrsDataTestId.value;
});

const viewportId = computed(() => `${rootId.value}-viewport`);

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    tabindex: _tabIndex,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'data-testid': _dataTestId,
    ...restAttrs
  } = attrs;

  return {
    ...restAttrs,
    id: rootId.value,
    role: 'region',
    tabindex:
      typeof _tabIndex === 'string' || typeof _tabIndex === 'number' ? _tabIndex : undefined,
    'aria-roledescription': 'carousel',
    'aria-label': normalizedAttrsAriaLabelledBy.value ? undefined : resolvedAriaLabel.value,
    'aria-labelledby': normalizedAttrsAriaLabelledBy.value,
    'data-testid': rootTestId.value,
  };
});

const rootClasses = computed(() => [
  classNameComponent,
  attrs.class,
  isPointerDragging.value && `${classNameComponent}--dragging`,
  totalSlides.value === 1 && `${classNameComponent}--single-slide`,
]);

const rootStyle = computed<StyleValue>(() => {
  const carouselStyle = {
    '--peaui-card-carousel-visible-slides': `${requestedVisibleSlides.value}`,
  };

  return attrs.style === undefined ? carouselStyle : [carouselStyle, attrs.style as StyleValue];
});

const previousButtonTestId = computed(() =>
  rootTestId.value ? `${rootTestId.value}-previous` : undefined,
);
const nextButtonTestId = computed(() =>
  rootTestId.value ? `${rootTestId.value}-next` : undefined,
);
const viewportTestId = computed(() =>
  rootTestId.value ? `${rootTestId.value}-viewport` : undefined,
);
const paginationTestId = computed(() =>
  rootTestId.value ? `${rootTestId.value}-pagination` : undefined,
);
const controlsTestId = computed(() =>
  rootTestId.value ? `${rootTestId.value}-controls` : undefined,
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function normalizeSlides(nodes: VNode[]): VNode[] {
  const result: VNode[] = [];

  for (const node of nodes) {
    if (node.type === Comment) {
      continue;
    }

    if (node.type === Text && typeof node.children === 'string' && !node.children.trim()) {
      continue;
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...normalizeSlides(node.children as VNode[]));
      continue;
    }

    result.push(node);
  }

  return result;
}

function clampIndex(index: number): number {
  return Math.min(Math.max(index, 0), maxStartIndex.value);
}

function getViewportGap(element: HTMLElement): number {
  const styles = getComputedStyle(element);
  const normalizedGap = parseFloat(styles.columnGap || styles.gap || '0');

  return Number.isFinite(normalizedGap) ? normalizedGap : 0;
}

function getSlideWidth(): number {
  const viewportElement = viewportRef.value;
  const slideElement = viewportElement?.querySelector<HTMLElement>(`.${classNameComponent}__slide`);

  return slideElement?.offsetWidth ?? 0;
}

function updateMetrics() {
  const viewportElement = viewportRef.value;

  if (!viewportElement) {
    return;
  }

  const nextTotalSlides = viewportElement.querySelectorAll(`.${classNameComponent}__slide`).length;
  totalSlides.value = nextTotalSlides;

  const gap = getViewportGap(viewportElement);
  const slideWidth = getSlideWidth();

  slideStep.value = slideWidth > 0 ? slideWidth + gap : 0;

  if (slideWidth > 0 && slideStep.value > 0) {
    const calculatedVisibleSlides = Math.round(
      (viewportElement.clientWidth + gap) / slideStep.value,
    );

    visibleSlidesCount.value = Math.max(
      1,
      Math.min(totalSlides.value || 1, calculatedVisibleSlides || 1),
    );
  } else {
    visibleSlidesCount.value = Math.min(
      requestedVisibleSlides.value,
      totalSlides.value || requestedVisibleSlides.value,
    );
  }

  const nextIndex = clampIndex(currentIndex.value);

  if (nextIndex !== currentIndex.value && slideStep.value > 0) {
    viewportElement.scrollLeft = nextIndex * slideStep.value;
  }

  currentIndex.value = nextIndex;
}

function syncIndexFromScroll() {
  const viewportElement = viewportRef.value;

  if (!viewportElement) {
    return;
  }

  if (slideStep.value <= 0) {
    currentIndex.value = clampIndex(currentIndex.value);
    return;
  }

  currentIndex.value = clampIndex(Math.round(viewportElement.scrollLeft / slideStep.value));
}

function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
  const viewportElement = viewportRef.value;

  if (!viewportElement) {
    return;
  }

  const clampedIndex = clampIndex(index);
  const fallbackGap = getViewportGap(viewportElement);
  const fallbackWidth = getSlideWidth();
  const calculatedStep =
    slideStep.value ||
    (fallbackWidth > 0 ? fallbackWidth + fallbackGap : viewportElement.clientWidth);

  currentIndex.value = clampedIndex;
  viewportElement.scrollTo({
    left: clampedIndex * calculatedStep,
    behavior,
  });
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGET_SELECTOR));
}

function shouldHandleKeyboardNavigation(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  if (target === currentTarget) {
    return true;
  }

  if (target.closest(`.${classNameComponent}__navigation`)) {
    return true;
  }

  if (target.closest(`.${classNameComponent}__dot`)) {
    return true;
  }

  return !target.closest(`.${classNameComponent}__slide`);
}

function handleGoToPreviousSlide() {
  if (!canGoPrevious.value) {
    return;
  }

  scrollToIndex(currentIndex.value - 1);
}

function handleGoToNextSlide() {
  if (!canGoNext.value) {
    return;
  }

  scrollToIndex(currentIndex.value + 1);
}

function handleGoToAnimatedSlide() {
  const nextIndex = currentIndex.value >= maxStartIndex.value ? 0 : currentIndex.value + 1;
  scrollToIndex(nextIndex);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (!shouldHandleKeyboardNavigation(event.target, event.currentTarget)) {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      handleGoToPreviousSlide();
      break;
    case 'ArrowRight':
      event.preventDefault();
      handleGoToNextSlide();
      break;
    case 'Home':
      event.preventDefault();
      scrollToIndex(0);
      break;
    case 'End':
      event.preventDefault();
      scrollToIndex(maxStartIndex.value);
      break;
    default:
      break;
  }
}

function handleScroll() {
  syncIndexFromScroll();
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  if (isInteractiveTarget(event.target) || !viewportRef.value) {
    return;
  }

  if (syncIndexTimeout) {
    window.clearTimeout(syncIndexTimeout);
    syncIndexTimeout = undefined;
  }

  isPointerDragging.value = true;
  pointerStartX = event.clientX;
  pointerStartScrollLeft = viewportRef.value.scrollLeft;

  if (typeof viewportRef.value.setPointerCapture === 'function') {
    viewportRef.value.setPointerCapture(event.pointerId);
  }
}

function handlePointerMove(event: PointerEvent) {
  if (!isPointerDragging.value || !viewportRef.value) {
    return;
  }

  viewportRef.value.scrollLeft = pointerStartScrollLeft - (event.clientX - pointerStartX);
}

function handlePointerEnd(event?: PointerEvent) {
  if (!isPointerDragging.value) {
    return;
  }

  isPointerDragging.value = false;

  if (
    event &&
    viewportRef.value &&
    typeof viewportRef.value.hasPointerCapture === 'function' &&
    viewportRef.value.hasPointerCapture(event.pointerId)
  ) {
    viewportRef.value.releasePointerCapture(event.pointerId);
  }

  syncIndexTimeout = window.setTimeout(() => {
    syncIndexFromScroll();
  }, 80);
}

function getSlideTestId(index: number): string | undefined {
  return rootTestId.value ? `${rootTestId.value}-slide-${index + 1}` : undefined;
}

function getDotTestId(index: number): string | undefined {
  return rootTestId.value ? `${rootTestId.value}-dot-${index + 1}` : undefined;
}

function getSlideAriaLabel(index: number, slideCount: number): string {
  return `Slajd ${index + 1} z ${slideCount}`;
}

function getDotAriaLabel(index: number): string {
  return `Przejdz do widoku ${index + 1} z ${dotCount.value}`;
}

function clearAnimationInterval() {
  if (animationInterval) {
    window.clearInterval(animationInterval);
    animationInterval = undefined;
  }
}

function syncAnimationInterval() {
  clearAnimationInterval();

  if (!props.withAnimation || !hasOverflow.value || isPointerDragging.value) {
    return;
  }

  animationInterval = window.setInterval(() => {
    handleGoToAnimatedSlide();
  }, resolvedAnimationDelay.value);
}

onMounted(async () => {
  await nextTick();
  updateMetrics();
  syncIndexFromScroll();
  syncAnimationInterval();

  if (typeof ResizeObserver === 'undefined' || !viewportRef.value) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    updateMetrics();
  });

  resizeObserver.observe(viewportRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  clearAnimationInterval();

  if (syncIndexTimeout) {
    window.clearTimeout(syncIndexTimeout);
    syncIndexTimeout = undefined;
  }
});

onUpdated(() => {
  updateMetrics();
});

watch(
  requestedVisibleSlides,
  async () => {
    await nextTick();
    updateMetrics();
    scrollToIndex(clampIndex(currentIndex.value), 'auto');
    syncAnimationInterval();
  },
  {
    flush: 'post',
  },
);

watch(
  [() => props.withAnimation, resolvedAnimationDelay, hasOverflow, isPointerDragging],
  () => {
    syncAnimationInterval();
  },
  {
    flush: 'post',
  },
);
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses" :style="rootStyle" @keydown="handleKeydown">
    <div
      ref="viewportRef"
      :id="viewportId"
      :class="`${classNameComponent}__viewport`"
      :aria-labelledby="normalizedAttrsAriaLabelledBy"
      :aria-label="normalizedAttrsAriaLabelledBy ? undefined : viewportAriaLabel"
      :data-testid="viewportTestId"
      tabindex="0"
      @pointercancel="handlePointerEnd"
      @pointerdown="handlePointerDown"
      @pointerleave="handlePointerEnd"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerEnd"
      @scroll.passive="handleScroll"
    >
      <div
        v-for="(slide, index) in renderedSlides"
        :key="index"
        :class="`${classNameComponent}__slide`"
        :aria-label="getSlideAriaLabel(index, renderedSlides.length)"
        :data-testid="getSlideTestId(index)"
        aria-roledescription="slide"
        role="group"
      >
        <component :is="slide" />
      </div>
    </div>

    <div v-if="hasControls" :class="controlsClasses" :data-testid="controlsTestId">
      <button
        v-if="isNavigationVisible"
        type="button"
        :class="[
          `${classNameComponent}__navigation`,
          `${classNameComponent}__navigation--previous`,
        ]"
        :aria-controls="viewportId"
        aria-label="Pokaz poprzednie karty"
        :data-testid="previousButtonTestId"
        :disabled="!canGoPrevious"
        @click="handleGoToPreviousSlide"
      >
        <SvgIcon name="arrow" :class="`${classNameComponent}__navigation-icon`" />
      </button>

      <div
        v-if="shouldRenderDots"
        :class="`${classNameComponent}__pagination`"
        :data-testid="paginationTestId"
        aria-label="Pozycje karuzeli"
        role="group"
      >
        <button
          v-for="(_, index) in dotCount"
          :key="index"
          type="button"
          :class="[
            `${classNameComponent}__dot`,
            index === currentIndex && `${classNameComponent}__dot--active`,
          ]"
          :aria-current="index === currentIndex ? 'true' : undefined"
          :aria-label="getDotAriaLabel(index)"
          :data-testid="getDotTestId(index)"
          @click="scrollToIndex(index)"
        />
      </div>

      <button
        v-if="isNavigationVisible"
        type="button"
        :class="[`${classNameComponent}__navigation`, `${classNameComponent}__navigation--next`]"
        :aria-controls="viewportId"
        aria-label="Pokaz nastepne karty"
        :data-testid="nextButtonTestId"
        :disabled="!canGoNext"
        @click="handleGoToNextSlide"
      >
        <SvgIcon name="arrow" :class="`${classNameComponent}__navigation-icon`" />
      </button>
    </div>
  </div>
</template>
