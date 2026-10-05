<script lang="ts">
import type {
  TransferListItem,
  TransferListKey,
  TransferListKeyResolver,
  TransferListLabelResolver,
  TransferListLabels,
  TransferListLoadingState,
  TransferListOrientation,
  TransferListSize,
  TransferListSort,
} from './transfer-list.shared';

export interface TransferListProps {
  /** Render a bounded fixed-height window in each panel. */
  virtual?: boolean;
  /** Height of a virtual row, in pixels. */
  optionHeight?: number;
  /** Stabilny identyfikator komponentu i jego relacji ARIA. */
  id?: string;
  /** Pełny katalog elementów. Pierwszy element o danym kluczu wygrywa. */
  items?: readonly TransferListItem[];
  /** Pole lub funkcja zwracająca stabilny klucz string/number. */
  itemKey?: TransferListKeyResolver;
  /** Pole lub funkcja zwracająca widoczną etykietę. */
  itemLabel?: TransferListLabelResolver;
  /** Pokazuje niezależny filtr w obu panelach. */
  searchable?: boolean;
  /** Sortowanie widoku; false zachowuje kolejność źródłową. */
  sort?: TransferListSort;
  /** Zachowuje kolejność tablicy value w panelu docelowym. */
  preserveOrder?: boolean;
  /** Klucze blokowane niezależnie od pola disabled elementu. */
  disabledKeys?: readonly TransferListKey[];
  /** Stan ładowania całego komponentu albo wybranego panelu. */
  loading?: boolean | TransferListLoadingState;
  /** Lokalizowane teksty interfejsu. */
  labels?: Partial<TransferListLabels>;
  /** Wyłącza wszystkie operacje i usuwa listy z kolejności Tab. */
  disabled?: boolean;
  /** Preferowany układ; horizontal automatycznie składa się na mobile. */
  orientation?: TransferListOrientation;
  /** Standardowa lub kompaktowa gęstość wierszy. */
  size?: TransferListSize;
  /** Locale filtrowania i sortowania. */
  locale?: string;
  /** Dostępna nazwa całego przepływu. */
  ariaLabel?: string;
  /** Opcjonalny błąd wspólny dla obu list. */
  error?: string;
  /** Stabilny selektor testowy. */
  dataTestId?: string;
}

export type {
  TransferListDirection,
  TransferListItem,
  TransferListKey,
  TransferListKeyResolver,
  TransferListLabelResolver,
  TransferListLabels,
  TransferListLoadingState,
  TransferListMoveDetail,
  TransferListOrientation,
  TransferListPanel,
  TransferListSearchDetail,
  TransferListSelectionDetail,
  TransferListSize,
  TransferListSort,
} from './transfer-list.shared';
</script>

<script setup lang="ts">
import { useVirtualListWindow } from '@/composables/useVirtualListWindow';
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import SearchInput from '@/components/data-entry/SearchInput/index.vue';
import EmptyState from '@/components/feedback/EmptyState/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';
import FormCheckbox from '@/components/form/FormCheckbox/index.vue';
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, ref, useAttrs, useId, watch, type CSSProperties, type Ref } from 'vue';

import {
  areTransferListKeysEqual,
  createTransferListKeySet,
  getTransferListKeyIdentity,
  filterTransferListItems,
  findTransferListEdgeIndex,
  findTransferListEnabledIndex,
  getTransferListLabels,
  getTransferListPanelItems,
  getTransferListRangeKeys,
  moveTransferListItems,
  normalizeTransferListItems,
  normalizeTransferListKeys,
  normalizeTransferListLoading,
  normalizeTransferListSelection,
  type ResolvedTransferListItem,
  type TransferListDirection,
  type TransferListMoveDetail,
  type TransferListPanel,
  type TransferListSearchDetail,
  type TransferListSelectionDetail,
} from './transfer-list.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TransferListProps>(), {
  items: () => [],
  itemKey: 'key',
  itemLabel: 'label',
  searchable: true,
  sort: false,
  preserveOrder: true,
  disabledKeys: () => [],
  loading: false,
  labels: () => ({}),
  disabled: false,
  orientation: 'horizontal',
  size: 'standard',
  locale: 'pl-PL',
  ariaLabel: 'Przenoszenie elementów między listami',
  error: '',
});

const value = defineModel<TransferListKey[]>('value', { default: () => [] });
const sourceSelected = defineModel<TransferListKey[]>('sourceSelected', { default: () => [] });
const targetSelected = defineModel<TransferListKey[]>('targetSelected', { default: () => [] });

const emit = defineEmits<{
  (event: 'move', detail: TransferListMoveDetail): void;
  (event: 'search', detail: TransferListSearchDetail): void;
  (event: 'selectionChange', detail: TransferListSelectionDetail): void;
}>();

defineSlots<{
  'source-header'?: (props: { count: number; selectedCount: number }) => unknown;
  'target-header'?: (props: { count: number; selectedCount: number }) => unknown;
  item?: (props: {
    item: TransferListItem;
    itemKey: TransferListKey;
    label: string;
    description?: string;
    panel: TransferListPanel;
    selected: boolean;
    disabled: boolean;
  }) => unknown;
  'source-empty'?: (props: { query: string }) => unknown;
  'target-empty'?: (props: { query: string }) => unknown;
  controls?: (props: {
    moveSelectedToTarget: () => void;
    moveSelectedToSource: () => void;
    moveAllToTarget: () => void;
    moveAllToSource: () => void;
  }) => unknown;
  loading?: (props: { panel: TransferListPanel }) => unknown;
}>();

const attrs = useAttrs();
const generatedId = useId().replaceAll(':', '');
const classNameComponent = `${UIKIT_NAME}-transfer-list`;
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const labels = computed(() => getTransferListLabels(props.labels));
const loadingState = computed(() => normalizeTransferListLoading(props.loading));
const sourceQuery = ref('');
const targetQuery = ref('');
const sourceActiveIndex = ref(-1);
const targetActiveIndex = ref(-1);
const sourceAnchorIndex = ref(-1);
const targetAnchorIndex = ref(-1);
const sourceListbox = ref<HTMLElement>();
const targetListbox = ref<HTMLElement>();
const announcement = ref('');

const normalizedItems = computed(() =>
  normalizeTransferListItems(props.items, {
    disabledKeys: props.disabledKeys,
    itemKey: props.itemKey,
    itemLabel: props.itemLabel,
  }),
);
const normalizedValue = computed(() => normalizeTransferListKeys(value.value));
const sourceItems = computed(() =>
  getTransferListPanelItems(normalizedItems.value, normalizedValue.value, 'source', {
    locale: props.locale,
    preserveOrder: props.preserveOrder,
    sort: props.sort,
  }),
);
const targetItems = computed(() =>
  getTransferListPanelItems(normalizedItems.value, normalizedValue.value, 'target', {
    locale: props.locale,
    preserveOrder: props.preserveOrder,
    sort: props.sort,
  }),
);
const visibleSourceItems = computed(() =>
  filterTransferListItems(sourceItems.value, sourceQuery.value, props.locale),
);
const visibleTargetItems = computed(() =>
  filterTransferListItems(targetItems.value, targetQuery.value, props.locale),
);
const virtualOpen = computed(() => true);
const sourceWindow = useVirtualListWindow({
  items: visibleSourceItems,
  activeIndex: sourceActiveIndex,
  viewport: sourceListbox,
  enabled: () => props.virtual ?? false,
  itemSize: () => props.optionHeight ?? 64,
  open: virtualOpen,
});
const targetWindow = useVirtualListWindow({
  items: visibleTargetItems,
  activeIndex: targetActiveIndex,
  viewport: targetListbox,
  enabled: () => props.virtual ?? false,
  itemSize: () => props.optionHeight ?? 64,
  open: virtualOpen,
});
const panelWindow = (panel: TransferListPanel) =>
  panel === 'source' ? sourceWindow : targetWindow;
const normalizedSourceSelection = computed(() =>
  normalizeTransferListSelection(sourceSelected.value, sourceItems.value),
);
const normalizedTargetSelection = computed(() =>
  normalizeTransferListSelection(targetSelected.value, targetItems.value),
);
const sourceMembership = computed(() => createTransferListKeySet(normalizedSourceSelection.value));
const targetMembership = computed(() => createTransferListKeySet(normalizedTargetSelection.value));
const selectionIndex = (panel: TransferListPanel) =>
  panel === 'source' ? sourceMembership.value : targetMembership.value;
const hasError = computed(() => Boolean(props.error.trim()));
const errorId = computed(() => `${resolvedId.value}-error`);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.orientation}`,
  `${classNameComponent}--${props.size}`,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--invalid`]: hasError.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': externalLabel,
    'aria-describedby': externalDescription,
    ...rest
  } = attrs;
  const descriptions = new Set(
    `${externalDescription ?? ''}`
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasError.value) descriptions.add(errorId.value);
  return {
    ...rest,
    'aria-label': `${externalLabel ?? props.ariaLabel}`.trim(),
    'aria-describedby': descriptions.size ? [...descriptions].join(' ') : undefined,
  };
});

function panelItems(panel: TransferListPanel): ResolvedTransferListItem[] {
  return panel === 'source' ? sourceItems.value : targetItems.value;
}

function visibleItems(panel: TransferListPanel): ResolvedTransferListItem[] {
  return panel === 'source' ? visibleSourceItems.value : visibleTargetItems.value;
}

function panelSelection(panel: TransferListPanel): TransferListKey[] {
  return panel === 'source' ? normalizedSourceSelection.value : normalizedTargetSelection.value;
}

function activeIndexRef(panel: TransferListPanel): Ref<number> {
  return panel === 'source' ? sourceActiveIndex : targetActiveIndex;
}

function anchorIndexRef(panel: TransferListPanel): Ref<number> {
  return panel === 'source' ? sourceAnchorIndex : targetAnchorIndex;
}

function listboxRef(panel: TransferListPanel): Ref<HTMLElement | undefined> {
  return panel === 'source' ? sourceListbox : targetListbox;
}

function setListboxRef(panel: TransferListPanel, element: unknown): void {
  const resolved = element instanceof HTMLElement ? element : undefined;
  if (panel === 'source') sourceListbox.value = resolved;
  else targetListbox.value = resolved;
}

function panelTitleId(panel: TransferListPanel): string {
  return `${resolvedId.value}-${panel}-title`;
}

function panelListboxId(panel: TransferListPanel): string {
  return `${resolvedId.value}-${panel}-listbox`;
}

function optionId(panel: TransferListPanel, index: number): string {
  return `${resolvedId.value}-${panel}-option-${index}`;
}

function activeDescendant(panel: TransferListPanel): string | undefined {
  const index = activeIndexRef(panel).value;
  return visibleItems(panel)[index] &&
    (!props.virtual ||
      panelWindow(panel).visibleOptions.value.some((entry) => entry.index === index))
    ? optionId(panel, index)
    : undefined;
}

function isPanelBlocked(panel: TransferListPanel): boolean {
  return props.disabled || loadingState.value[panel];
}

function isSelected(panel: TransferListPanel, key: TransferListKey): boolean {
  return selectionIndex(panel).has(getTransferListKeyIdentity(key));
}

function setSelection(panel: TransferListPanel, keys: readonly TransferListKey[]): void {
  const normalized = normalizeTransferListSelection(keys, panelItems(panel));
  const current = panelSelection(panel);
  if (areTransferListKeysEqual(current, normalized)) return;
  if (panel === 'source') sourceSelected.value = normalized;
  else targetSelected.value = normalized;
  emit('selectionChange', { panel, selectedKeys: normalized });
}

function toggleItem(
  panel: TransferListPanel,
  item: ResolvedTransferListItem,
  index: number,
  extend = false,
): void {
  if (isPanelBlocked(panel) || item.disabled) return;
  const current = panelSelection(panel);
  if (extend && anchorIndexRef(panel).value >= 0) {
    setSelection(
      panel,
      getTransferListRangeKeys(visibleItems(panel), anchorIndexRef(panel).value, index),
    );
  } else if (isSelected(panel, item.key)) {
    setSelection(
      panel,
      current.filter((key) => !Object.is(key, item.key)),
    );
    anchorIndexRef(panel).value = index;
  } else {
    setSelection(panel, [...current, item.key]);
    anchorIndexRef(panel).value = index;
  }
  activeIndexRef(panel).value = index;
}

function eligibleVisibleItems(panel: TransferListPanel): ResolvedTransferListItem[] {
  return visibleItems(panel).filter((item) => !item.disabled);
}

function allVisibleSelected(panel: TransferListPanel): boolean {
  const eligible = eligibleVisibleItems(panel);
  return (
    eligible.length > 0 &&
    eligible.every((item) => selectionIndex(panel).has(getTransferListKeyIdentity(item.key)))
  );
}

function toggleAllVisible(panel: TransferListPanel, checked: boolean): void {
  if (isPanelBlocked(panel)) return;
  const visibleKeys = eligibleVisibleItems(panel).map((item) => item.key);
  const visibleKeySet = createTransferListKeySet(visibleKeys);
  const current = panelSelection(panel);
  setSelection(
    panel,
    checked
      ? [...current, ...visibleKeys]
      : current.filter((key) => !visibleKeySet.has(getTransferListKeyIdentity(key))),
  );
}

function updateSearch(panel: TransferListPanel, query: string | undefined): void {
  const normalized = query ?? '';
  if (panel === 'source') sourceQuery.value = normalized;
  else targetQuery.value = normalized;
  activeIndexRef(panel).value = findTransferListEdgeIndex(visibleItems(panel), 'first');
  anchorIndexRef(panel).value = -1;
  emit('search', { panel, query: normalized });
}

function scrollActiveIntoView(panel: TransferListPanel): void {
  const index = activeIndexRef(panel).value;
  void nextTick(() => {
    const option = listboxRef(panel).value?.querySelector<HTMLElement>(
      `[data-option-index="${index}"]`,
    );
    option?.scrollIntoView?.({ block: 'nearest' });
  });
}

function moveActive(panel: TransferListPanel, direction: 1 | -1, extend: boolean): void {
  const current = activeIndexRef(panel).value;
  const next = findTransferListEnabledIndex(visibleItems(panel), current, direction);
  if (next < 0) return;
  activeIndexRef(panel).value = next;
  if (extend) {
    if (anchorIndexRef(panel).value < 0) anchorIndexRef(panel).value = Math.max(0, current);
    setSelection(
      panel,
      getTransferListRangeKeys(visibleItems(panel), anchorIndexRef(panel).value, next),
    );
  }
  scrollActiveIntoView(panel);
}

function moveActiveToEdge(panel: TransferListPanel, edge: 'first' | 'last', extend: boolean): void {
  const next = findTransferListEdgeIndex(visibleItems(panel), edge);
  if (next < 0) return;
  if (extend) {
    if (anchorIndexRef(panel).value < 0) {
      anchorIndexRef(panel).value = Math.max(0, activeIndexRef(panel).value);
    }
    setSelection(
      panel,
      getTransferListRangeKeys(visibleItems(panel), anchorIndexRef(panel).value, next),
    );
  }
  activeIndexRef(panel).value = next;
  scrollActiveIntoView(panel);
}

function handleListboxFocus(panel: TransferListPanel): void {
  if (activeIndexRef(panel).value < 0) {
    activeIndexRef(panel).value = findTransferListEdgeIndex(visibleItems(panel), 'first');
  }
}

function handleListboxKeydown(panel: TransferListPanel, event: KeyboardEvent): void {
  if (isPanelBlocked(panel)) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveActive(panel, 1, event.shiftKey);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveActive(panel, -1, event.shiftKey);
  } else if (event.key === 'Home') {
    event.preventDefault();
    moveActiveToEdge(panel, 'first', event.shiftKey);
  } else if (event.key === 'End') {
    event.preventDefault();
    moveActiveToEdge(panel, 'last', event.shiftKey);
  } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
    event.preventDefault();
    const index = activeIndexRef(panel).value;
    const item = visibleItems(panel)[index];
    if (item) toggleItem(panel, item, index, event.shiftKey);
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    toggleAllVisible(panel, !allVisibleSelected(panel));
  }
}

function performMove(direction: TransferListDirection, mode: 'selected' | 'all'): void {
  const panel: TransferListPanel = direction === 'to-target' ? 'source' : 'target';
  if (isPanelBlocked(panel)) return;
  const keys =
    mode === 'selected'
      ? panelSelection(panel)
      : eligibleVisibleItems(panel).map((item) => item.key);
  const result = moveTransferListItems({
    direction,
    items: normalizedItems.value,
    keys,
    preserveOrder: props.preserveOrder,
    value: normalizedValue.value,
  });
  if (result.movedKeys.length === 0) return;
  const movedKeySet = createTransferListKeySet(result.movedKeys);

  value.value = result.value;
  if (panel === 'source') {
    setSelection(
      'source',
      panelSelection('source').filter((key) => !movedKeySet.has(getTransferListKeyIdentity(key))),
    );
  } else {
    setSelection(
      'target',
      panelSelection('target').filter((key) => !movedKeySet.has(getTransferListKeyIdentity(key))),
    );
  }

  const destination =
    direction === 'to-target' ? labels.value.targetTitle : labels.value.sourceTitle;
  announcement.value = `${labels.value.moved} ${result.movedKeys.length}: ${destination}.`;
  emit('move', { direction, ...result });
}

watch(
  [sourceItems, targetItems],
  () => {
    const source = normalizeTransferListSelection(sourceSelected.value, sourceItems.value);
    const target = normalizeTransferListSelection(targetSelected.value, targetItems.value);
    if (!areTransferListKeysEqual(source, normalizeTransferListKeys(sourceSelected.value))) {
      sourceSelected.value = source;
    }
    if (!areTransferListKeysEqual(target, normalizeTransferListKeys(targetSelected.value))) {
      targetSelected.value = target;
    }
  },
  { immediate: true },
);

watch(visibleSourceItems, (items) => {
  if (!items[sourceActiveIndex.value] || items[sourceActiveIndex.value]?.disabled) {
    sourceActiveIndex.value = findTransferListEdgeIndex(items, 'first');
  }
});

watch(visibleTargetItems, (items) => {
  if (!items[targetActiveIndex.value] || items[targetActiveIndex.value]?.disabled) {
    targetActiveIndex.value = findTransferListEdgeIndex(items, 'first');
  }
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :id="resolvedId"
    :class="rootClasses"
    :style="rootStyle"
    role="group"
    :aria-disabled="disabled || undefined"
    :aria-invalid="hasError || undefined"
    :data-testid="dataTestId"
  >
    <div :class="`${classNameComponent}__layout`">
      <template v-for="panel in ['source', 'target'] as const" :key="panel">
        <div v-if="panel === 'target'" :class="`${classNameComponent}__controls`">
          <slot
            name="controls"
            :move-selected-to-target="() => performMove('to-target', 'selected')"
            :move-selected-to-source="() => performMove('to-source', 'selected')"
            :move-all-to-target="() => performMove('to-target', 'all')"
            :move-all-to-source="() => performMove('to-source', 'all')"
          >
            <ButtonAction
              :class="`${classNameComponent}__control ${classNameComponent}__control--all-target`"
              :aria-label="labels.moveAllToTarget"
              :ariaLabel="labels.moveAllToTarget"
              use-aria-label
              variant="secondary"
              size="s"
              type="button"
              :disabled="
                disabled || loadingState.source || eligibleVisibleItems('source').length === 0
              "
              :data-test-id="dataTestId ? `${dataTestId}-move-all-target` : undefined"
              @click="performMove('to-target', 'all')"
            >
              <SvgIcon name="core/chevrons-right" />
            </ButtonAction>
            <ButtonAction
              :class="`${classNameComponent}__control ${classNameComponent}__control--selected-target`"
              :aria-label="labels.moveSelectedToTarget"
              :ariaLabel="labels.moveSelectedToTarget"
              use-aria-label
              variant="primary"
              size="s"
              type="button"
              :disabled="disabled || loadingState.source || normalizedSourceSelection.length === 0"
              :data-test-id="dataTestId ? `${dataTestId}-move-selected-target` : undefined"
              @click="performMove('to-target', 'selected')"
            >
              <SvgIcon name="core/arrow-right" />
            </ButtonAction>
            <ButtonAction
              :class="`${classNameComponent}__control ${classNameComponent}__control--selected-source`"
              :aria-label="labels.moveSelectedToSource"
              :ariaLabel="labels.moveSelectedToSource"
              use-aria-label
              variant="primary"
              size="s"
              type="button"
              :disabled="disabled || loadingState.target || normalizedTargetSelection.length === 0"
              :data-test-id="dataTestId ? `${dataTestId}-move-selected-source` : undefined"
              @click="performMove('to-source', 'selected')"
            >
              <SvgIcon name="core/arrow-left" />
            </ButtonAction>
            <ButtonAction
              :class="`${classNameComponent}__control ${classNameComponent}__control--all-source`"
              :aria-label="labels.moveAllToSource"
              :ariaLabel="labels.moveAllToSource"
              use-aria-label
              variant="secondary"
              size="s"
              type="button"
              :disabled="
                disabled || loadingState.target || eligibleVisibleItems('target').length === 0
              "
              :data-test-id="dataTestId ? `${dataTestId}-move-all-source` : undefined"
              @click="performMove('to-source', 'all')"
            >
              <SvgIcon name="core/chevrons-left" />
            </ButtonAction>
          </slot>
        </div>

        <section
          :class="`${classNameComponent}__panel ${classNameComponent}__panel--${panel}`"
          :aria-busy="loadingState[panel] || undefined"
          :data-panel="panel"
        >
          <header :class="`${classNameComponent}__panel-header`">
            <h3 :id="panelTitleId(panel)" :class="`${classNameComponent}__panel-title`">
              <slot
                v-if="panel === 'source'"
                name="source-header"
                :count="panelItems(panel).length"
                :selected-count="panelSelection(panel).length"
              >
                {{ labels.sourceTitle }}
              </slot>
              <slot
                v-else
                name="target-header"
                :count="panelItems(panel).length"
                :selected-count="panelSelection(panel).length"
              >
                {{ labels.targetTitle }}
              </slot>
            </h3>
            <span :class="`${classNameComponent}__panel-count`">
              {{ panelItems(panel).length }} {{ labels.items }}
            </span>
          </header>

          <div
            :class="`${classNameComponent}__panel-content`"
            :inert="isPanelBlocked(panel) || undefined"
          >
            <SearchInput
              v-if="searchable"
              :id="`${resolvedId}-${panel}-search`"
              :class="`${classNameComponent}__search`"
              :aria-label="panel === 'source' ? labels.sourceSearchAria : labels.targetSearchAria"
              :placeholder="
                panel === 'source' ? labels.sourceSearchPlaceholder : labels.targetSearchPlaceholder
              "
              :debounce-time="0"
              :data-test-id="dataTestId ? `${dataTestId}-${panel}-search` : undefined"
              :value="panel === 'source' ? sourceQuery : targetQuery"
              @update:value="updateSearch(panel, $event)"
            />

            <div :class="`${classNameComponent}__selection-summary`">
              <FormCheckbox
                :id="`${resolvedId}-${panel}-select-all`"
                :name="`${resolvedId}-${panel}-select-all`"
                :value="allVisibleSelected(panel)"
                :disabled="isPanelBlocked(panel) || eligibleVisibleItems(panel).length === 0"
                :aria-label="panel === 'source' ? labels.selectAllSource : labels.selectAllTarget"
                :data-test-id="dataTestId ? `${dataTestId}-${panel}-select-all` : undefined"
                @update:value="toggleAllVisible(panel, Boolean($event))"
              >
                {{ panel === 'source' ? labels.selectAllSource : labels.selectAllTarget }}
              </FormCheckbox>
              <span :class="`${classNameComponent}__selected-count`">
                {{ labels.selected }}: {{ panelSelection(panel).length }}
              </span>
            </div>

            <div :class="`${classNameComponent}__viewport`">
              <div
                :id="panelListboxId(panel)"
                :ref="(element) => setListboxRef(panel, element)"
                :class="`${classNameComponent}__listbox`"
                role="listbox"
                aria-multiselectable="true"
                :aria-labelledby="panelTitleId(panel)"
                :aria-activedescendant="activeDescendant(panel)"
                :aria-describedby="hasError ? errorId : undefined"
                :tabindex="isPanelBlocked(panel) ? -1 : 0"
                :data-testid="dataTestId ? `${dataTestId}-${panel}-listbox` : undefined"
                @scroll="panelWindow(panel).handleScroll($event)"
                @focus="handleListboxFocus(panel)"
                @keydown="handleListboxKeydown(panel, $event)"
              >
                <div
                  v-if="panelWindow(panel).beforeSize.value"
                  role="presentation"
                  aria-hidden="true"
                  :style="{ height: `${panelWindow(panel).beforeSize.value}px` }"
                />
                <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- The owning listbox handles keyboard selection with aria-activedescendant. -->
                <div
                  v-for="{ item, index } in panelWindow(panel).visibleOptions.value"
                  :style="panelWindow(panel).optionStyle.value"
                  :aria-setsize="props.virtual ? visibleItems(panel).length : undefined"
                  :aria-posinset="props.virtual ? index + 1 : undefined"
                  :id="optionId(panel, index)"
                  :key="item.key"
                  :class="[
                    `${classNameComponent}__option`,
                    {
                      [`${classNameComponent}__option--active`]:
                        activeIndexRef(panel).value === index,
                      [`${classNameComponent}__option--selected`]: isSelected(panel, item.key),
                      [`${classNameComponent}__option--disabled`]: item.disabled,
                    },
                  ]"
                  role="option"
                  :aria-selected="isSelected(panel, item.key)"
                  :aria-disabled="item.disabled || undefined"
                  :data-option-index="index"
                  :data-key="item.key"
                  @click="toggleItem(panel, item, index, $event.shiftKey)"
                  @pointermove="!item.disabled && (activeIndexRef(panel).value = index)"
                >
                  <span :class="`${classNameComponent}__option-marker`" aria-hidden="true">
                    <SvgIcon v-if="isSelected(panel, item.key)" name="core/check" />
                  </span>
                  <span :class="`${classNameComponent}__option-content`">
                    <slot
                      name="item"
                      :item="item.item"
                      :item-key="item.key"
                      :label="item.label"
                      :description="item.description"
                      :panel="panel"
                      :selected="isSelected(panel, item.key)"
                      :disabled="item.disabled"
                    >
                      <span :class="`${classNameComponent}__option-label`">{{ item.label }}</span>
                      <span
                        v-if="item.description"
                        :class="`${classNameComponent}__option-description`"
                      >
                        {{ item.description }}
                      </span>
                    </slot>
                  </span>
                </div>
                <div
                  v-if="panelWindow(panel).afterSize.value"
                  role="presentation"
                  aria-hidden="true"
                  :style="{ height: `${panelWindow(panel).afterSize.value}px` }"
                />
              </div>

              <div v-if="loadingState[panel]" :class="`${classNameComponent}__loading`">
                <slot name="loading" :panel="panel">
                  <SpinnerLoader
                    :aria-label="labels.loading"
                    :data-test-id="dataTestId ? `${dataTestId}-${panel}-loading` : undefined"
                  />
                </slot>
              </div>

              <div
                v-else-if="visibleItems(panel).length === 0"
                :class="`${classNameComponent}__empty`"
              >
                <slot v-if="panel === 'source'" name="source-empty" :query="sourceQuery">
                  <EmptyState
                    :title="sourceQuery ? labels.noResults : labels.sourceEmpty"
                    :data-test-id="dataTestId ? `${dataTestId}-${panel}-empty` : undefined"
                  />
                </slot>
                <slot v-else name="target-empty" :query="targetQuery">
                  <EmptyState
                    :title="targetQuery ? labels.noResults : labels.targetEmpty"
                    :data-test-id="dataTestId ? `${dataTestId}-${panel}-empty` : undefined"
                  />
                </slot>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <MessageText
      v-if="hasError"
      :id="errorId"
      :data-test-id="dataTestId ? `${dataTestId}-error` : undefined"
      variant="error"
      size="xs"
      aria-live="polite"
    >
      {{ error }}
    </MessageText>

    <p :class="`${classNameComponent}__live`" role="status" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </p>
  </div>
</template>
