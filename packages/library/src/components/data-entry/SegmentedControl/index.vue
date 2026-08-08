<script lang="ts">
import type { ToggleGroupValue } from '../ToggleGroup/toggle-group.shared';

export type SegmentedControlValue = ToggleGroupValue;
export type SegmentedControlSize = 's' | 'm' | 'l';
export type SegmentedControlDistribution = 'equal' | 'auto';
export type SegmentedControlContent = 'text' | 'icon' | 'icon-text';
export type SegmentedControlOrientation = 'horizontal' | 'vertical';
export type SegmentedControlActivation = 'automatic' | 'manual';
export type SegmentedControlModelValue = SegmentedControlValue | null;

export interface SegmentedControlItem {
  /** Stabilna i unikalna wartość zwracana przez model. */
  value: SegmentedControlValue;
  /** Widoczna etykieta oraz domyślna dostępna nazwa segmentu. */
  label: string;
  /** Opcjonalna dekoracyjna ikona SvgIcon. */
  icon?: string;
  /** Dostępna nazwa zastępująca etykietę wizualną. */
  ariaLabel?: string;
  /** Wyłącza segment i usuwa go z nawigacji klawiaturą. */
  disabled?: boolean;
  /** Neutralne dane aplikacyjne przekazywane do eventów i slotów. */
  metadata?: unknown;
}

export interface SegmentedControlProps {
  /** Identyfikator grupy radio. */
  id?: string;
  /** Nazwa ukrytego pola wysyłanego z formularzem. */
  name?: string;
  /** Niewielki zestaw wzajemnie wykluczających się pozycji. */
  items?: SegmentedControlItem[];
  /** Rozmiar wszystkich segmentów. */
  size?: SegmentedControlSize;
  /** Równy albo naturalny rozkład szerokości segmentów. */
  distribution?: SegmentedControlDistribution;
  /** Rozciąga kontrolkę do szerokości kontenera. */
  fullWidth?: boolean;
  /** Prezentuje tekst, ikonę albo oba elementy. */
  content?: SegmentedControlContent;
  /** Wyłącza całą kontrolkę i usuwa ją z kolejności tabulatora. */
  disabled?: boolean;
  /** Kierunek układu oraz nawigacji klawiaturą. */
  orientation?: SegmentedControlOrientation;
  /** Określa, czy nawigacja od razu wybiera segment, czy tylko przenosi fokus. */
  activation?: SegmentedControlActivation;
  /** Zapętla nawigację pomiędzy skrajnymi dostępnymi segmentami. */
  loop?: boolean;
  /** Dostępna nazwa grupy radio. */
  ariaLabel?: string;
  /** Stabilny selektor do testów integracyjnych. */
  dataTestId?: string;
}
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
  type CSSProperties,
} from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';
import {
  findNextToggleGroupIndex,
  findToggleGroupEdgeIndex,
  findToggleGroupReplacementIndex,
  isToggleGroupItemAvailable,
} from '../ToggleGroup/toggle-group.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SegmentedControlProps>(), {
  name: '',
  items: () => [],
  size: 'm',
  distribution: 'equal',
  fullWidth: false,
  content: 'text',
  disabled: false,
  orientation: 'horizontal',
  activation: 'automatic',
  loop: true,
  ariaLabel: 'Wybór opcji',
  dataTestId: '',
});

/** Wartość dokładnie jednego wybranego segmentu albo `null` dla stanu początkowego. */
const modelValue = defineModel<SegmentedControlModelValue>('value', { default: null });
const emit = defineEmits<{
  /** Emitowany po skutecznym wyborze innego segmentu. */
  (
    event: 'change',
    value: SegmentedControlValue,
    item: SegmentedControlItem,
    nativeEvent: MouseEvent | KeyboardEvent,
  ): void;
  /** Emitowany po przeniesieniu aktywnego fokusu. */
  (event: 'focusChange', item: SegmentedControlItem, index: number): void;
}>();
const slots = defineSlots<{
  /** Zastępuje wizualną zawartość pojedynczego segmentu. */
  item?(props: {
    item: SegmentedControlItem;
    index: number;
    selected: boolean;
    disabled: boolean;
  }): unknown;
  /** Zastępuje dekoracyjną ikonę segmentu. */
  'item-icon'?(props: { item: SegmentedControlItem; index: number; selected: boolean }): unknown;
  /** Zastępuje wizualną powierzchnię wskaźnika bez zmiany semantyki radio. */
  indicator?(props: { item: SegmentedControlItem | null; index: number }): unknown;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-segmented-control`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const root = ref<HTMLElement>();
const buttonElements = ref<Array<HTMLButtonElement | null>>([]);
const focusWithin = ref(false);
const activeValue = ref<SegmentedControlValue | null>(getInitialActiveValue());
const lastActiveIndex = ref(Math.max(getItemIndex(activeValue.value), 0));
const indicatorStyle = ref<CSSProperties>({});
const indicatorReady = ref(false);
let resizeObserver: ResizeObserver | undefined;
let frameId: number | undefined;

const selectedIndex = computed(() => getItemIndex(modelValue.value));
const selectedItem = computed(() => props.items[selectedIndex.value] ?? null);
const activeIndex = computed(() => {
  const index = getItemIndex(activeValue.value);
  return isItemAvailable(index) ? index : -1;
});
const itemSignature = computed(() =>
  props.items.map((item) => [typeof item.value, item.value, item.label, item.icon, item.disabled]),
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--distribution-${props.distribution}`,
  `${classNameComponent}--content-${props.content}`,
  `${classNameComponent}--${props.orientation}`,
  {
    [`${classNameComponent}--full-width`]: props.fullWidth,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--indicator-ready`]: indicatorReady.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => [indicatorStyle.value, attrs.style] as CSSProperties[]);
const groupAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalAriaLabelledBy,
    'aria-orientation': _externalOrientation,
    'aria-disabled': _externalDisabled,
    'data-testid': _externalTestId,
    ...rest
  } = attrs;
  const labelledBy = normalizeAttribute(externalAriaLabelledBy);
  const ariaLabel = normalizeAttribute(externalAriaLabel) || props.ariaLabel.trim();

  return {
    ...rest,
    'aria-label': labelledBy ? undefined : ariaLabel || 'Wybór opcji',
    'aria-labelledby': labelledBy,
  };
});

watch(
  itemSignature,
  async () => {
    const currentIndex = getItemIndex(activeValue.value);
    if (isItemAvailable(currentIndex)) {
      lastActiveIndex.value = currentIndex;
    } else {
      const hadFocus = focusWithin.value || Boolean(root.value?.contains(document.activeElement));
      const replacementIndex = props.disabled
        ? -1
        : findToggleGroupReplacementIndex(props.items, lastActiveIndex.value);
      activeValue.value = props.items[replacementIndex]?.value ?? null;
      lastActiveIndex.value = Math.max(replacementIndex, 0);
      if (hadFocus && replacementIndex >= 0) {
        await nextTick();
        focusItem(replacementIndex);
      }
    }

    await nextTick();
    observeRoot();
    scheduleIndicatorUpdate();
  },
  { flush: 'pre' },
);

watch(
  [selectedIndex, () => props.orientation, () => props.distribution, () => props.fullWidth],
  async ([index]) => {
    if (typeof index === 'number' && isItemAvailable(index)) {
      activeValue.value = props.items[index]?.value ?? null;
      lastActiveIndex.value = index;
    }
    await nextTick();
    scheduleIndicatorUpdate();
    ensureSelectedVisible();
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleIndicatorUpdate);
    observeRoot();
  } else {
    window.addEventListener('resize', scheduleIndicatorUpdate, { passive: true });
  }

  const fontSet = Reflect.get(document, 'fonts') as FontFaceSet | undefined;
  if (fontSet) void fontSet.ready.then(scheduleIndicatorUpdate);
  scheduleIndicatorUpdate();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', scheduleIndicatorUpdate);
  if (frameId !== undefined) cancelAnimationFrame(frameId);
});

function normalizeAttribute(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getItemIndex(value: SegmentedControlModelValue): number {
  if (value === null) return -1;
  return props.items.findIndex((item) => Object.is(item.value, value));
}

function isItemAvailable(index: number): boolean {
  return !props.disabled && isToggleGroupItemAvailable(props.items[index]);
}

function getInitialActiveValue(): SegmentedControlValue | null {
  const selected = getItemIndex(modelValue.value);
  const index = isItemAvailable(selected)
    ? selected
    : findToggleGroupEdgeIndex(props.items, 'first');
  return props.items[index]?.value ?? null;
}

function isSelected(index: number): boolean {
  return index === selectedIndex.value;
}

function showsIcon(item: SegmentedControlItem): boolean {
  return props.content !== 'text' && Boolean(item.icon || slots['item-icon']);
}

function showsText(): boolean {
  return props.content !== 'icon';
}

function setButtonElement(index: number, element: unknown): void {
  buttonElements.value[index] = element instanceof HTMLButtonElement ? element : null;
}

function getItemId(index: number): string {
  return `${resolvedId.value}-item-${index}`;
}

function getItemTestId(index: number): string | undefined {
  return props.dataTestId ? `${props.dataTestId}-item-${index}` : undefined;
}

function getItemTabIndex(index: number): number {
  return isItemAvailable(index) && activeIndex.value === index ? 0 : -1;
}

function focusItem(index: number): void {
  if (!isItemAvailable(index)) return;
  activeValue.value = props.items[index]?.value ?? null;
  lastActiveIndex.value = index;
  buttonElements.value[index]?.focus();
}

function selectItem(
  item: SegmentedControlItem,
  index: number,
  nativeEvent: MouseEvent | KeyboardEvent,
): void {
  if (!isItemAvailable(index) || isSelected(index)) return;
  modelValue.value = item.value;
  emit('change', item.value, item, nativeEvent);
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  if (!isItemAvailable(index)) return;
  let nextIndex = -1;

  if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(props.items, 'first');
  else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(props.items, 'last');
  else if (
    props.orientation === 'horizontal' &&
    (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
  ) {
    const rtl = root.value ? getComputedStyle(root.value).direction === 'rtl' : false;
    const forward = event.key === 'ArrowRight' ? !rtl : rtl;
    nextIndex = findNextToggleGroupIndex(props.items, index, forward ? 1 : -1, props.loop);
  } else if (
    props.orientation === 'vertical' &&
    (event.key === 'ArrowUp' || event.key === 'ArrowDown')
  ) {
    nextIndex = findNextToggleGroupIndex(
      props.items,
      index,
      event.key === 'ArrowDown' ? 1 : -1,
      props.loop,
    );
  } else return;

  event.preventDefault();
  if (nextIndex < 0) return;
  focusItem(nextIndex);
  const item = props.items[nextIndex];
  if (item && props.activation === 'automatic') selectItem(item, nextIndex, event);
}

function handleFocus(item: SegmentedControlItem, index: number): void {
  focusWithin.value = true;
  activeValue.value = item.value;
  lastActiveIndex.value = index;
  emit('focusChange', item, index);
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget;
  if (!(nextTarget instanceof Node) || !root.value?.contains(nextTarget)) focusWithin.value = false;
}

function observeRoot(): void {
  resizeObserver?.disconnect();
  if (root.value) resizeObserver?.observe(root.value);
}

function scheduleIndicatorUpdate(): void {
  if (typeof requestAnimationFrame === 'undefined') {
    updateIndicator();
    return;
  }
  if (frameId !== undefined) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    frameId = undefined;
    updateIndicator();
  });
}

function updateIndicator(): void {
  const segment = buttonElements.value[selectedIndex.value];
  if (!segment || !root.value) {
    indicatorStyle.value = {};
    indicatorReady.value = true;
    return;
  }

  indicatorStyle.value = {
    '--peaui-segmented-control-indicator-x': `${segment.offsetLeft}px`,
    '--peaui-segmented-control-indicator-y': `${segment.offsetTop}px`,
    '--peaui-segmented-control-indicator-width': `${segment.offsetWidth}px`,
    '--peaui-segmented-control-indicator-height': `${segment.offsetHeight}px`,
  } as CSSProperties;
  indicatorReady.value = true;
}

function ensureSelectedVisible(): void {
  const container = root.value;
  const segment = buttonElements.value[selectedIndex.value];
  if (!container || !segment || typeof container.scrollBy !== 'function') return;
  const containerRect = container.getBoundingClientRect();
  const segmentRect = segment.getBoundingClientRect();

  if (props.orientation === 'vertical') {
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
}
</script>

<template>
  <div
    ref="root"
    v-bind="groupAttrs"
    :id="resolvedId"
    :class="rootClasses"
    :style="rootStyle"
    role="radiogroup"
    :aria-orientation="orientation"
    :aria-disabled="disabled || undefined"
    :data-activation="activation"
    :data-disabled="disabled || undefined"
    :data-has-selection="selectedIndex >= 0 || undefined"
    :data-testid="dataTestId || undefined"
    @focusout="handleFocusOut"
  >
    <span
      :class="classNameComponent + '__indicator'"
      :data-visible="selectedIndex >= 0 || undefined"
      aria-hidden="true"
    >
      <slot name="indicator" :item="selectedItem" :index="selectedIndex" />
    </span>

    <button
      v-for="(item, index) in items"
      :id="getItemId(index)"
      :key="`${typeof item.value}:${String(item.value)}:${index}`"
      :ref="(element) => setButtonElement(index, element)"
      type="button"
      role="radio"
      :class="[
        classNameComponent + '__item',
        {
          [classNameComponent + '__item--selected']: isSelected(index),
          [classNameComponent + '__item--disabled']: disabled || item.disabled,
        },
      ]"
      :aria-checked="isSelected(index)"
      :aria-label="item.ariaLabel || item.label"
      :disabled="disabled || item.disabled"
      :tabindex="getItemTabIndex(index)"
      :data-selected="isSelected(index) || undefined"
      :data-segmented-control-index="index"
      :data-testid="getItemTestId(index)"
      @click="selectItem(item, index, $event)"
      @focus="handleFocus(item, index)"
      @keydown="handleKeydown($event, index)"
    >
      <slot
        name="item"
        :item="item"
        :index="index"
        :selected="isSelected(index)"
        :disabled="Boolean(disabled || item.disabled)"
      >
        <span v-if="showsIcon(item)" :class="classNameComponent + '__icon'" aria-hidden="true">
          <slot name="item-icon" :item="item" :index="index" :selected="isSelected(index)">
            <SvgIcon v-if="item.icon" :name="item.icon" />
          </slot>
        </span>
        <span v-if="showsText()" :class="classNameComponent + '__label'">{{ item.label }}</span>
      </slot>
    </button>
  </div>

  <input
    v-if="name && selectedItem"
    type="hidden"
    :name="name"
    :value="selectedItem.value"
    :disabled="disabled"
  />
</template>
