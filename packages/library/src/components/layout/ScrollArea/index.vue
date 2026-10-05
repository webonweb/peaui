<script lang="ts">
import type {
  ScrollAreaEdgeDetail,
  ScrollAreaHandle,
  ScrollAreaOrientation,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
  ScrollAreaScrollbarSlotState,
  ScrollAreaScrollbarVisibility,
  ScrollAreaType,
} from './scroll-area.shared';

export interface ScrollAreaProps {
  /** Stabilny identyfikator komponentu, relacji ARIA i opcjonalnie zapisanej pozycji. */
  id?: string;
  /** Natywne paski systemowe albo dostępne paski stylowane przez PeaUI. */
  type?: ScrollAreaType;
  /** Osie, na których zawartość może być przewijana. */
  orientation?: ScrollAreaOrientation;
  /** Sposób widoczności stylowanych pasków przewijania. */
  scrollbarVisibility?: ScrollAreaScrollbarVisibility;
  /** Grubość paska w pikselach, ograniczona do zakresu 6–20. */
  scrollbarSize?: number;
  /** Opóźnienie ukrycia automatycznego paska w milisekundach, maksymalnie 10000. */
  autoHideDelay?: number;
  /** Nadpisuje tabindex viewportu. Tryb native domyślnie dodaje przystanek Tab (0). */
  tabindex?: number;
  /** Dostępna nazwa przewijanego regionu. */
  ariaLabel?: string;
  /** Blokuje publiczne metody i sterowanie stylowanymi paskami, zachowując natywny scroll. */
  disabled?: boolean;
  /** Przywraca pozycję po ponownym montażu, gdy przekazano stabilne id. */
  restorePosition?: boolean;
  /** Stabilny selektor testowy elementu głównego. */
  dataTestId?: string;
}

export type {
  ScrollAreaAxis,
  ScrollAreaEdgeDetail,
  ScrollAreaHandle,
  ScrollAreaOrientation,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
  ScrollAreaScrollbarSlotState,
  ScrollAreaScrollbarVisibility,
  ScrollAreaType,
} from './scroll-area.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
  type StyleValue,
} from 'vue';

import {
  createScrollAreaController,
  type ScrollAreaController,
  type ScrollAreaEventName,
} from './scroll-area.controller';
import {
  getScrollAreaPosition,
  normalizeScrollAreaAutoHideDelay,
  normalizeScrollAreaScrollbarSize,
} from './scroll-area.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  type: 'styled',
  orientation: 'vertical',
  scrollbarVisibility: 'auto',
  scrollbarSize: 10,
  autoHideDelay: 700,
  disabled: false,
  restorePosition: false,
});

const emit = defineEmits<{
  (event: 'scroll', detail: ScrollAreaPosition): void;
  (event: 'scrollStart', detail: ScrollAreaPosition): void;
  (event: 'scrollEnd', detail: ScrollAreaPosition): void;
  (event: 'reachStart', detail: ScrollAreaEdgeDetail): void;
  (event: 'reachEnd', detail: ScrollAreaEdgeDetail): void;
  (event: 'resize', detail: ScrollAreaResizeDetail): void;
}>();

defineSlots<{
  default?: () => unknown;
  scrollbar?: (state: ScrollAreaScrollbarSlotState) => unknown;
  'start-indicator'?: () => unknown;
  'end-indicator'?: () => unknown;
}>();

const attrs = useAttrs();
const generatedId = useId().replaceAll(':', '');
const classNameComponent = `${UIKIT_NAME}-scroll-area`;
const rootRef = ref<HTMLElement>();
const viewportRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
const horizontalBarRef = ref<HTMLElement>();
const horizontalThumbRef = ref<HTMLElement>();
const verticalBarRef = ref<HTMLElement>();
const verticalThumbRef = ref<HTMLElement>();
let controller: ScrollAreaController | undefined;

const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const viewportId = computed(() => `${resolvedId.value}-viewport`);
const viewportTabindex = computed(
  () => props.tabindex ?? (props.type === 'native' ? 0 : undefined),
);
const externalLabel = computed(() => `${attrs['aria-label'] ?? ''}`.trim() || undefined);
const externalLabelledBy = computed(() => `${attrs['aria-labelledby'] ?? ''}`.trim() || undefined);
const resolvedLabel = computed(
  () =>
    props.ariaLabel?.trim() ||
    externalLabel.value ||
    (viewportTabindex.value !== undefined ? 'Obszar przewijania' : undefined),
);
const restoreKey = computed(() =>
  props.restorePosition && props.id?.trim() ? props.id.trim() : undefined,
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.type}`,
  `${classNameComponent}--${props.orientation}`,
  `${classNameComponent}--visibility-${props.scrollbarVisibility}`,
  { [`${classNameComponent}--disabled`]: props.disabled },
  attrs.class,
]);
const rootStyle = computed<StyleValue>(() => [
  {
    '--peaui-scroll-area-scrollbar-size': `${normalizeScrollAreaScrollbarSize(props.scrollbarSize)}px`,
  },
  attrs.style as StyleValue,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    tabindex: _tabindex,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'data-testid': externalTestId,
    ...rest
  } = attrs;
  return {
    ...rest,
    id: resolvedId.value,
    'data-testid': props.dataTestId || externalTestId,
  };
});
const viewportTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-viewport` : undefined,
);

function emitControllerEvent(
  name: ScrollAreaEventName,
  detail: ScrollAreaPosition | ScrollAreaResizeDetail | ScrollAreaEdgeDetail,
): void {
  if (name === 'reachStart') {
    emit('reachStart', detail as ScrollAreaEdgeDetail);
  } else if (name === 'reachEnd') {
    emit('reachEnd', detail as ScrollAreaEdgeDetail);
  } else if (name === 'resize') {
    emit(name, detail as ScrollAreaResizeDetail);
  } else if (name === 'scroll') {
    emit('scroll', detail as ScrollAreaPosition);
  } else if (name === 'scrollStart') {
    emit('scrollStart', detail as ScrollAreaPosition);
  } else {
    emit('scrollEnd', detail as ScrollAreaPosition);
  }
}

function controllerOptions() {
  return {
    autoHideDelay: normalizeScrollAreaAutoHideDelay(props.autoHideDelay),
    disabled: props.disabled,
    orientation: props.orientation,
    restoreKey: restoreKey.value,
    restorePosition: props.restorePosition,
    styled: props.type === 'styled',
    onEvent: emitControllerEvent,
  } as const;
}

function createController(): void {
  if (!rootRef.value || !viewportRef.value || !contentRef.value) return;
  controller?.destroy();
  controller = createScrollAreaController(
    {
      root: rootRef.value,
      viewport: viewportRef.value,
      content: contentRef.value,
      horizontalBar: horizontalBarRef.value,
      horizontalThumb: horizontalThumbRef.value,
      verticalBar: verticalBarRef.value,
      verticalThumb: verticalThumbRef.value,
    },
    controllerOptions(),
  );
}

const exposedHandle: ScrollAreaHandle = {
  get viewport() {
    return controller?.viewport ?? viewportRef.value ?? null;
  },
  scrollTo(options) {
    controller?.scrollTo(options);
  },
  scrollBy(options) {
    controller?.scrollBy(options);
  },
  scrollIntoView(target, options) {
    return controller?.scrollIntoView(target, options) ?? false;
  },
  getPosition() {
    return (
      controller?.getPosition() ??
      (viewportRef.value
        ? getScrollAreaPosition(viewportRef.value)
        : {
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
          })
    );
  },
};

defineExpose(exposedHandle);

onMounted(() => {
  createController();
});

onBeforeUnmount(() => {
  controller?.destroy();
  controller = undefined;
});

watch(
  () => [props.autoHideDelay, props.disabled, props.orientation, props.restorePosition, props.type],
  async () => {
    await nextTick();
    controller?.update(controllerOptions(), true);
  },
);
</script>

<template>
  <div ref="rootRef" v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <div
      ref="viewportRef"
      :id="viewportId"
      :class="`${classNameComponent}__viewport`"
      :aria-label="externalLabelledBy ? undefined : resolvedLabel"
      :aria-labelledby="externalLabelledBy"
      :data-testid="viewportTestId"
      :role="resolvedLabel || externalLabelledBy ? 'region' : undefined"
      :tabindex="viewportTabindex"
    >
      <div ref="contentRef" :class="`${classNameComponent}__content`">
        <slot />
      </div>
    </div>

    <div
      ref="horizontalBarRef"
      :class="[`${classNameComponent}__scrollbar`, `${classNameComponent}__scrollbar--horizontal`]"
      :aria-controls="viewportId"
      :aria-label="`${resolvedLabel || 'Obszar przewijania'}: przewijanie poziome`"
      aria-orientation="horizontal"
      aria-valuemax="0"
      aria-valuemin="0"
      aria-valuenow="0"
      role="scrollbar"
    >
      <div ref="horizontalThumbRef" :class="`${classNameComponent}__thumb`">
        <slot name="scrollbar" orientation="horizontal" />
      </div>
    </div>

    <div
      ref="verticalBarRef"
      :class="[`${classNameComponent}__scrollbar`, `${classNameComponent}__scrollbar--vertical`]"
      :aria-controls="viewportId"
      :aria-label="`${resolvedLabel || 'Obszar przewijania'}: przewijanie pionowe`"
      aria-orientation="vertical"
      aria-valuemax="0"
      aria-valuemin="0"
      aria-valuenow="0"
      role="scrollbar"
    >
      <div ref="verticalThumbRef" :class="`${classNameComponent}__thumb`">
        <slot name="scrollbar" orientation="vertical" />
      </div>
    </div>

    <div
      :class="[`${classNameComponent}__indicator`, `${classNameComponent}__indicator--start`]"
      aria-hidden="true"
    >
      <slot name="start-indicator" />
    </div>
    <div
      :class="[`${classNameComponent}__indicator`, `${classNameComponent}__indicator--end`]"
      aria-hidden="true"
    >
      <slot name="end-indicator" />
    </div>
  </div>
</template>
