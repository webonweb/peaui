<script lang="ts">
import type {
  VirtualListItem,
  VirtualListItemKeyResolver,
  VirtualListItemLabelResolver,
  VirtualListRole,
} from './virtual-list.shared';

export interface VirtualListProps {
  /** Kolekcja danych. W DOM pozostaje wyłącznie widoczny zakres z overscanem. */
  items?: readonly VirtualListItem[];
  /** Stała wysokość pojedynczego elementu w pikselach. */
  itemSize?: number;
  /** Liczba dodatkowych elementów renderowanych przed i za viewportem. */
  overscan?: number;
  /** Wysokość viewportu jako liczba pikseli albo poprawna wartość CSS. */
  height?: number | string;
  /** Pole lub funkcja zwracająca stabilny klucz string/number. */
  itemKey?: VirtualListItemKeyResolver;
  /** Pole lub funkcja zwracająca domyślną widoczną etykietę. */
  itemLabel?: VirtualListItemLabelResolver;
  /** Semantyka neutralnej listy albo interaktywnego listboxa. */
  semanticRole?: VirtualListRole;
  /** Dostępna nazwa viewportu i listboxa. */
  ariaLabel?: string;
  /** Pokazuje początkowy albo przyrostowy stan ładowania. */
  loading?: boolean;
  /** Informuje, że aplikacja może dołączyć kolejne elementy po zdarzeniu reachEnd. */
  hasMore?: boolean;
  /** Jawny komunikat błędu prezentowany zamiast pustego stanu. */
  error?: string;
  /** Tytuł domyślnego pustego stanu. */
  emptyTitle?: string;
  /** Opis domyślnego pustego stanu. */
  emptyDescription?: string;
  /** Tekst wyświetlany po osiągnięciu kompletnego końca listy. */
  endLabel?: string;
  /** Stabilny selektor testowy elementu głównego. */
  dataTestId?: string;
}

export type {
  ResolvedVirtualListItem,
  VirtualListAlign,
  VirtualListHandle,
  VirtualListItem,
  VirtualListItemFocusDetail,
  VirtualListItemKeyResolver,
  VirtualListItemLabelResolver,
  VirtualListItemSlotState,
  VirtualListKey,
  VirtualListMeasureErrorDetail,
  VirtualListRange,
  VirtualListReachEndDetail,
  VirtualListRole,
  VirtualListScrollDetail,
} from './virtual-list.shared';
</script>

<script setup lang="ts">
import EmptyState from '@/components/feedback/EmptyState/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';
import ScrollArea from '@/components/layout/ScrollArea/index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
  type CSSProperties,
} from 'vue';

import type {
  ScrollAreaHandle,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
} from '../../layout/ScrollArea/scroll-area.shared';
import {
  areVirtualListRangesEqual,
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  isVirtualListHeightValid,
  normalizeVirtualListHeight,
  normalizeVirtualListItems,
  normalizeVirtualListItemSize,
  normalizeVirtualListOverscan,
  type ResolvedVirtualListItem,
  type VirtualListAlign,
  type VirtualListHandle,
  type VirtualListItemFocusDetail,
  type VirtualListItemSlotState,
  type VirtualListMeasureErrorDetail,
  type VirtualListRange,
  type VirtualListReachEndDetail,
  type VirtualListScrollDetail,
} from './virtual-list.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<VirtualListProps>(), {
  items: () => [],
  itemSize: 64,
  overscan: 4,
  height: 320,
  itemKey: 'id',
  itemLabel: 'label',
  semanticRole: 'list',
  ariaLabel: 'Lista wirtualna',
  loading: false,
  hasMore: false,
  error: '',
  emptyTitle: 'Brak elementów',
  emptyDescription: 'Lista nie zawiera jeszcze żadnych elementów.',
  endLabel: 'Koniec listy',
});

const activeIndex = defineModel<number | null>('activeIndex', { default: null });

const emit = defineEmits<{
  /** Emitowane po zmianie renderowanego i rzeczywiście widocznego zakresu. */
  (event: 'visibleRangeChange', detail: VirtualListRange): void;
  /** Emitowane raz dla danego rozmiaru kolekcji po dotarciu do końca z hasMore. */
  (event: 'reachEnd', detail: VirtualListReachEndDetail): void;
  /** Emitowane podczas przewijania po obliczeniu nowego zakresu. */
  (event: 'scroll', detail: VirtualListScrollDetail): void;
  /** Emitowane, gdy element albo jego interaktywny potomek otrzyma fokus. */
  (event: 'itemFocus', detail: VirtualListItemFocusDetail): void;
  /** Emitowane dla niepoprawnych parametrów pomiaru zastąpionych bezpiecznym fallbackiem. */
  (event: 'measureError', detail: VirtualListMeasureErrorDetail): void;
}>();

const slots = defineSlots<{
  item?: (state: VirtualListItemSlotState) => unknown;
  empty?: () => unknown;
  loading?: () => unknown;
  before?: () => unknown;
  after?: () => unknown;
  footer?: () => unknown;
}>();

const attrs = useAttrs();
const generatedId = useId().replaceAll(':', '');
const classNameComponent = `${UIKIT_NAME}-virtual-list`;
const scrollArea = ref<ScrollAreaHandle>();
const scrollOffset = ref(0);
const viewportSize = ref(typeof props.height === 'number' ? Math.max(96, props.height) : 320);
const retainedFocusIndex = ref<number | null>(null);
let previousRange: VirtualListRange | undefined;
let previousOffset = 0;
let reachedEndForCount = -1;

const normalizedItemSize = computed(() => normalizeVirtualListItemSize(props.itemSize));
const normalizedOverscan = computed(() => normalizeVirtualListOverscan(props.overscan));
const resolvedHeight = computed(() => normalizeVirtualListHeight(props.height));
const resolvedItems = computed(() =>
  normalizeVirtualListItems(props.items, props.itemKey, props.itemLabel),
);
const totalSize = computed(() => resolvedItems.value.length * normalizedItemSize.value);
const currentRange = computed(() =>
  calculateVirtualListRange({
    itemCount: resolvedItems.value.length,
    itemSize: normalizedItemSize.value,
    overscan: normalizedOverscan.value,
    scrollOffset: scrollOffset.value,
    viewportSize: viewportSize.value,
  }),
);
const hasReachedEnd = computed(
  () =>
    resolvedItems.value.length > 0 &&
    currentRange.value.visibleEndIndex >= resolvedItems.value.length - 1,
);
const renderedIndices = computed(() => {
  const indices = new Set<number>();
  for (
    let index = currentRange.value.startIndex;
    index <= currentRange.value.endIndex;
    index += 1
  ) {
    if (index >= 0) indices.add(index);
  }
  if (
    retainedFocusIndex.value !== null &&
    retainedFocusIndex.value >= 0 &&
    retainedFocusIndex.value < resolvedItems.value.length
  ) {
    indices.add(retainedFocusIndex.value);
  }
  if (
    props.semanticRole === 'listbox' &&
    activeIndex.value !== null &&
    activeIndex.value >= 0 &&
    activeIndex.value < resolvedItems.value.length
  ) {
    indices.add(activeIndex.value);
  }
  return [...indices].sort((first, second) => first - second);
});
const renderedItems = computed(() =>
  renderedIndices.value.flatMap((index) => {
    const item = resolvedItems.value[index];
    return item ? [item] : [];
  }),
);
const resolvedId = computed(() => `${classNameComponent}-${generatedId}`);
const listId = computed(() => `${resolvedId.value}-items`);
const activeDescendant = computed(() => {
  if (props.semanticRole !== 'listbox' || activeIndex.value === null) return undefined;
  return renderedIndices.value.includes(activeIndex.value)
    ? `${resolvedId.value}-item-${activeIndex.value}`
    : undefined;
});
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.semanticRole}`,
  {
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--empty`]: resolvedItems.value.length === 0,
    [`${classNameComponent}--error`]: Boolean(props.error),
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, 'data-testid': externalTestId, ...rest } = attrs;
  return { ...rest, 'data-testid': props.dataTestId || externalTestId };
});
const scrollAreaStyle = computed<CSSProperties>(() => ({ blockSize: resolvedHeight.value }));
const trackStyle = computed<CSSProperties>(() => ({ blockSize: `${totalSize.value}px` }));

function itemStyle(index: number): Readonly<Record<string, string>> {
  return {
    blockSize: `${normalizedItemSize.value}px`,
    transform: `translateY(${index * normalizedItemSize.value}px)`,
  };
}

function emitRangeIfChanged(): void {
  const range = currentRange.value;
  if (areVirtualListRangesEqual(previousRange, range)) return;
  previousRange = { ...range };
  emit('visibleRangeChange', range);
}

function maybeReachEnd(): void {
  const count = resolvedItems.value.length;
  if (
    !props.hasMore ||
    count === 0 ||
    currentRange.value.visibleEndIndex < count - 1 ||
    reachedEndForCount === count
  ) {
    return;
  }
  reachedEndForCount = count;
  emit('reachEnd', { lastIndex: count - 1, total: count });
}

function updateViewportSize(): void {
  const size = scrollArea.value?.viewport?.clientHeight;
  if (typeof size === 'number' && size > 0) viewportSize.value = size;
}

function handleScroll(position: ScrollAreaPosition): void {
  const nextOffset = position.y;
  const direction =
    nextOffset > previousOffset ? 'forward' : nextOffset < previousOffset ? 'backward' : 'none';
  previousOffset = nextOffset;
  scrollOffset.value = nextOffset;
  emitRangeIfChanged();
  maybeReachEnd();
  emit('scroll', { direction, offset: nextOffset, range: currentRange.value });
}

function handleResize(detail: ScrollAreaResizeDetail): void {
  if (detail.clientHeight > 0) viewportSize.value = detail.clientHeight;
  emitRangeIfChanged();
  maybeReachEnd();
}

function scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
  const maximum = Math.max(0, totalSize.value - viewportSize.value);
  const next = Math.min(Math.max(Number.isFinite(offset) ? offset : 0, 0), maximum);
  scrollOffset.value = next;
  scrollArea.value?.scrollTo({ top: next, behavior });
  emitRangeIfChanged();
}

function scrollToIndex(
  index: number,
  align: VirtualListAlign = 'auto',
  behavior: ScrollBehavior = 'auto',
): void {
  scrollToOffset(
    getVirtualListScrollOffset({
      align,
      currentOffset: scrollOffset.value,
      index,
      itemCount: resolvedItems.value.length,
      itemSize: normalizedItemSize.value,
      viewportSize: viewportSize.value,
    }),
    behavior,
  );
}

function setActiveItem(index: number, shouldFocus = false): void {
  const item = resolvedItems.value[index];
  if (!item) return;
  activeIndex.value = index;
  scrollToIndex(index, 'auto');
  emit('itemFocus', { index, item: item.item, key: item.key });
  if (shouldFocus) {
    void nextTick(() => {
      document.getElementById(listId.value)?.focus();
    });
  }
}

function handleListboxKeydown(event: KeyboardEvent): void {
  if (props.semanticRole !== 'listbox' || resolvedItems.value.length === 0) return;
  const current =
    activeIndex.value === null
      ? currentRange.value.visibleStartIndex
      : Math.min(Math.max(activeIndex.value, 0), resolvedItems.value.length - 1);
  const page = Math.max(1, Math.floor(viewportSize.value / normalizedItemSize.value));
  let next: number | undefined;
  if (event.key === 'ArrowDown') next = current + 1;
  else if (event.key === 'ArrowUp') next = current - 1;
  else if (event.key === 'PageDown') next = current + page;
  else if (event.key === 'PageUp') next = current - page;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = resolvedItems.value.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  setActiveItem(Math.min(Math.max(next, 0), resolvedItems.value.length - 1));
}

function handleItemFocus(event: FocusEvent, item: ResolvedVirtualListItem): void {
  retainedFocusIndex.value = item.index;
  emit('itemFocus', { index: item.index, item: item.item, key: item.key });
}

function handleItemFocusOut(event: FocusEvent, index: number): void {
  const currentTarget = event.currentTarget;
  queueMicrotask(() => {
    if (
      retainedFocusIndex.value === index &&
      currentTarget instanceof HTMLElement &&
      !currentTarget.contains(document.activeElement)
    ) {
      retainedFocusIndex.value = null;
    }
  });
}

const exposedHandle: VirtualListHandle = {
  get viewport() {
    return scrollArea.value?.viewport ?? null;
  },
  getVisibleRange() {
    return { ...currentRange.value };
  },
  scrollToIndex,
  scrollToOffset,
};

defineExpose(exposedHandle);

watch(
  currentRange,
  () => {
    emitRangeIfChanged();
    maybeReachEnd();
  },
  { immediate: true },
);

watch(resolvedItems, (nextItems, previousItems) => {
  reachedEndForCount = -1;
  if (activeIndex.value !== null && activeIndex.value >= nextItems.length) {
    activeIndex.value = nextItems.length > 0 ? nextItems.length - 1 : null;
  }
  const anchor = previousItems[currentRange.value.visibleStartIndex];
  if (!anchor || scrollOffset.value === 0) return;
  const nextIndex = nextItems.findIndex((item) => Object.is(item.key, anchor.key));
  if (nextIndex >= 0 && nextIndex !== anchor.index) {
    scrollToOffset(scrollOffset.value + (nextIndex - anchor.index) * normalizedItemSize.value);
  }
});

watch(
  () => [props.itemSize, props.height] as const,
  ([itemSize, height]) => {
    if (normalizeVirtualListItemSize(itemSize) !== itemSize) {
      emit('measureError', {
        message: 'itemSize musi być dodatnią, skończoną liczbą.',
        property: 'itemSize',
        value: itemSize,
      });
    }
    if (!isVirtualListHeightValid(height)) {
      emit('measureError', {
        message: 'height musi być dodatnią liczbą albo poprawnym rozmiarem CSS.',
        property: 'height',
        value: height,
      });
    }
    void nextTick(updateViewportSize);
  },
  { immediate: true },
);

onMounted(() => {
  updateViewportSize();
  emitRangeIfChanged();
});
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <div v-if="slots.before" :class="`${classNameComponent}__before`">
      <slot name="before" />
    </div>

    <ScrollArea
      ref="scrollArea"
      :aria-label="ariaLabel"
      :class="`${classNameComponent}__scroll-area`"
      :data-test-id="dataTestId ? `${dataTestId}-scroll-area` : undefined"
      orientation="vertical"
      scrollbar-visibility="auto"
      :style="scrollAreaStyle"
      :tabindex="semanticRole === 'list' ? 0 : undefined"
      type="styled"
      @resize="handleResize"
      @scroll="handleScroll"
    >
      <div v-if="loading && resolvedItems.length === 0" :class="`${classNameComponent}__state`">
        <slot name="loading">
          <SpinnerLoader :data-test-id="dataTestId ? `${dataTestId}-loading` : undefined" />
        </slot>
      </div>

      <div v-else-if="error && resolvedItems.length === 0" :class="`${classNameComponent}__state`">
        <p :class="`${classNameComponent}__error`" role="alert">{{ error }}</p>
      </div>

      <div v-else-if="resolvedItems.length === 0" :class="`${classNameComponent}__state`">
        <slot name="empty">
          <EmptyState
            :data-test-id="dataTestId ? `${dataTestId}-empty` : undefined"
            :description="emptyDescription"
            :title="emptyTitle"
          />
        </slot>
      </div>

      <div
        v-else
        :id="listId"
        :aria-activedescendant="activeDescendant"
        :aria-label="semanticRole === 'listbox' ? ariaLabel : undefined"
        :aria-multiselectable="semanticRole === 'listbox' ? false : undefined"
        :class="`${classNameComponent}__items`"
        :data-end-index="currentRange.endIndex"
        :data-start-index="currentRange.startIndex"
        :data-total="currentRange.total"
        :data-visible-end-index="currentRange.visibleEndIndex"
        :data-visible-start-index="currentRange.visibleStartIndex"
        :role="semanticRole"
        :style="trackStyle"
        :tabindex="semanticRole === 'listbox' ? 0 : undefined"
        @keydown="handleListboxKeydown"
      >
        <div
          v-for="item in renderedItems"
          :id="`${resolvedId}-item-${item.index}`"
          :key="item.key"
          :aria-posinset="item.index + 1"
          :aria-selected="semanticRole === 'listbox' ? activeIndex === item.index : undefined"
          :aria-setsize="resolvedItems.length"
          :class="[
            `${classNameComponent}__item`,
            { [`${classNameComponent}__item--active`]: activeIndex === item.index },
          ]"
          :data-index="item.index"
          :data-key="String(item.key)"
          :role="semanticRole === 'listbox' ? 'option' : 'listitem'"
          :style="itemStyle(item.index)"
          @click="semanticRole === 'listbox' && setActiveItem(item.index, true)"
          @focusin="handleItemFocus($event, item)"
          @focusout="handleItemFocusOut($event, item.index)"
        >
          <slot
            name="item"
            :active="activeIndex === item.index"
            :index="item.index"
            :item="item.item"
            :item-key="item.key"
            :style="itemStyle(item.index)"
          >
            <span :class="`${classNameComponent}__item-label`">{{ item.label }}</span>
            <span v-if="item.description" :class="`${classNameComponent}__item-description`">
              {{ item.description }}
            </span>
          </slot>
        </div>
      </div>
    </ScrollArea>

    <div v-if="loading && resolvedItems.length > 0" :class="`${classNameComponent}__status`">
      <slot name="loading">
        <SpinnerLoader :data-test-id="dataTestId ? `${dataTestId}-loading-more` : undefined" />
      </slot>
    </div>

    <p v-else-if="hasReachedEnd && !hasMore" :class="`${classNameComponent}__end`">
      {{ endLabel }}
    </p>

    <p
      v-if="error && resolvedItems.length > 0"
      :class="`${classNameComponent}__error`"
      role="alert"
    >
      {{ error }}
    </p>

    <div v-if="slots.after" :class="`${classNameComponent}__after`">
      <slot name="after" />
    </div>
    <div v-if="slots.footer" :class="`${classNameComponent}__footer`">
      <slot name="footer" />
    </div>
  </div>
</template>
