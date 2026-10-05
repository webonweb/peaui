<script lang="ts">
import type {
  NotificationCenterBaseProps,
  NotificationCenterDate,
  NotificationCenterDensity,
  NotificationCenterFilter,
  NotificationCenterGroupBy,
  NotificationCenterItem,
  NotificationCenterItemId,
  NotificationCenterLabels,
  NotificationCenterPaginationMode,
  NotificationCenterVariant,
} from './notification-center.shared';

/** Props for the controlled NotificationCenter component. */
export interface NotificationCenterProps extends NotificationCenterBaseProps {
  /** Notifications rendered in their supplied order. The component never mutates them. */
  items: readonly NotificationCenterItem[];
  /** Optional controlled unread count, useful when not all pages are loaded. */
  unreadCount?: number;
  /** Custom filter definitions. Defaults to All and Unread. */
  filters?: readonly NotificationCenterFilter[];
  /** Identifier of the controlled active filter. */
  activeFilter?: string;
  /** Groups visible notifications without changing their order. */
  groupBy?: NotificationCenterGroupBy;
  /** Shows the initial loading state. */
  loading?: boolean;
  /** Shows the incremental loading state. */
  loadingMore?: boolean;
  /** Enables requesting another page. */
  hasMore?: boolean;
  /** Error message displayed without modifying the supplied items. */
  error?: string | null;
  /** Identifier of the controlled selected notification. */
  selectedId?: NotificationCenterItemId | null;
  /** Locale used by the default date formatter. */
  locale?: string;
  /** Optional application date formatter. */
  formatDate?: (date: NotificationCenterDate, item: NotificationCenterItem) => string;
  /** Accessible name of the notification center. */
  ariaLabel?: string;
  /** Stable test selector. */
  dataTestId?: string;
  /** Surface treatment for a panel, drawer body, or full page. */
  variant?: NotificationCenterVariant;
  /** Vertical spacing density. */
  density?: NotificationCenterDensity;
  /** How additional data is requested. */
  paginationMode?: NotificationCenterPaginationMode;
  /** Disables the mark-all intent while the application processes it. */
  markAllPending?: boolean;
  /** Item identifiers with an application-side action in progress. */
  pendingItemIds?: readonly NotificationCenterItemId[];
  /** Stable reference date for deterministic relative formatting. */
  referenceDate?: NotificationCenterDate;
  /** User-facing text overrides. */
  labels?: Partial<NotificationCenterLabels>;
  /** Optional maximum height of the scrollable list. */
  maxHeight?: string;
}
</script>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import ButtonAction from '../../data-entry/ButtonAction/index.vue';
import CounterBadge from '../../data-display/CounterBadge/index.vue';
import ScrollArea from '../../layout/ScrollArea/index.vue';
import EmptyState from '../EmptyState/index.vue';
import SkeletonLoading from '../SkeletonLoading/index.vue';
import {
  filterNotificationCenterItems,
  formatNotificationCenterDate,
  getNotificationCenterDateTime,
  getNotificationCenterFilters,
  getNotificationCenterPriorityLabel,
  getNotificationCenterUnreadCount,
  groupNotificationCenterItems,
  getNotificationCenterGroupKey,
  resolveNotificationCenterLabels,
  type NotificationCenterAction,
  type NotificationCenterActionPayload,
  type NotificationCenterLoadMorePayload,
  type NotificationCenterSelectPayload,
} from './notification-center.shared';

const props = withDefaults(defineProps<NotificationCenterProps>(), {
  activeFilter: 'all',
  groupBy: 'none',
  loading: false,
  loadingMore: false,
  hasMore: false,
  error: null,
  selectedId: null,
  locale: 'en',
  ariaLabel: 'Notifications',
  variant: 'panel',
  density: 'comfortable',
  paginationMode: 'pagination',
  markAllPending: false,
  referenceDate: () => new Date(),
  maxHeight: '32rem',
});

const emit = defineEmits<{
  (event: 'update:activeFilter', value: string): void;
  (event: 'update:selectedId', value: NotificationCenterItemId): void;
  (event: 'select', payload: NotificationCenterSelectPayload): void;
  (event: 'action', payload: NotificationCenterActionPayload): void;
  (event: 'markRead', item: NotificationCenterItem): void;
  (event: 'markUnread', item: NotificationCenterItem): void;
  (event: 'markAllRead'): void;
  (event: 'loadMore', payload: NotificationCenterLoadMorePayload): void;
  (event: 'filterChange', filterId: string): void;
  (event: 'retry'): void;
}>();

const labels = computed(() => resolveNotificationCenterLabels(props.labels));
const availableFilters = computed(() => getNotificationCenterFilters(props.filters, labels.value));
const currentFilter = computed(
  () =>
    availableFilters.value.find((filter) => filter.id === props.activeFilter) ??
    availableFilters.value[0],
);
const resolvedActiveFilter = computed(() => currentFilter.value?.id ?? props.activeFilter);
const visibleItems = computed(() =>
  filterNotificationCenterItems(props.items, currentFilter.value),
);
const groups = computed(() =>
  groupNotificationCenterItems(
    visibleItems.value,
    props.groupBy,
    props.locale,
    props.referenceDate,
    labels.value,
  ),
);
const effectiveUnreadCount = computed(
  () => props.unreadCount ?? getNotificationCenterUnreadCount(props.items),
);
const requestLocked = ref(false);

watch(
  () => props.loadingMore,
  (loadingMore, wasLoadingMore) => {
    if (wasLoadingMore && !loadingMore) requestLocked.value = false;
  },
);
watch(
  () => props.items.length,
  () => {
    requestLocked.value = false;
  },
);
watch(
  () => props.hasMore,
  (hasMore) => {
    if (!hasMore) requestLocked.value = false;
  },
);

function isPending(id: NotificationCenterItemId): boolean {
  return props.pendingItemIds?.includes(id) ?? false;
}

function itemIndex(item: NotificationCenterItem): number {
  return props.items.findIndex((candidate) => candidate.id === item.id);
}

function selectItem(item: NotificationCenterItem): void {
  if (item.disabled || isPending(item.id)) return;
  const payload = { item, index: itemIndex(item) };
  emit('update:selectedId', item.id);
  emit('select', payload);
}

function selectFilter(filterId: string): void {
  if (filterId === props.activeFilter) return;
  emit('update:activeFilter', filterId);
  emit('filterChange', filterId);
}

function emitAction(item: NotificationCenterItem, action: NotificationCenterAction): void {
  if (item.disabled || action.disabled || isPending(item.id)) return;
  emit('action', { item, action, index: itemIndex(item) });
}

function toggleRead(item: NotificationCenterItem): void {
  if (item.disabled || isPending(item.id)) return;
  if (item.read) emit('markUnread', item);
  else emit('markRead', item);
}

function displayDate(item: NotificationCenterItem): string {
  return (
    item.dateLabel ||
    props.formatDate?.(item.createdAt, item) ||
    formatNotificationCenterDate(item.createdAt, props.locale, props.referenceDate)
  );
}

function requestLoadMore(): void {
  if (!props.hasMore || props.loading || props.loadingMore || requestLocked.value) return;
  requestLocked.value = true;
  emit('loadMore', { mode: props.paginationMode, visibleCount: visibleItems.value.length });
}

function resetLoadRequest(): void {
  requestLocked.value = false;
}

const instanceId = useId();
function groupHeadingId(groupId: string): string {
  return `peaui-notification-center-${instanceId}-${getNotificationCenterGroupKey(groupId)}`;
}

defineExpose({ requestLoadMore, resetLoadRequest });
</script>

<template>
  <section
    class="peaui-notification-center"
    :class="[`peaui-notification-center--${variant}`, `peaui-notification-center--${density}`]"
    :aria-label="ariaLabel"
    :aria-busy="loading || loadingMore"
    :data-testid="dataTestId"
    :style="{ '--peaui-notification-center-max-height': maxHeight }"
  >
    <slot
      name="header"
      :unread-count="effectiveUnreadCount"
      :mark-all-pending="markAllPending"
      :mark-all-read="() => emit('markAllRead')"
    >
      <header class="peaui-notification-center__header">
        <div class="peaui-notification-center__title-row">
          <h2 class="peaui-notification-center__title">{{ labels.title }}</h2>
          <CounterBadge v-if="effectiveUnreadCount > 0" :value="effectiveUnreadCount" size="s" />
        </div>
        <ButtonAction
          size="s"
          variant="ghost"
          :disabled="effectiveUnreadCount === 0 || markAllPending"
          :aria-label="labels.markAllRead"
          data-testid="notification-center-mark-all"
          @click="emit('markAllRead')"
        >
          {{ labels.markAllRead }}
        </ButtonAction>
      </header>
    </slot>

    <slot
      name="filters"
      :filters="availableFilters"
      :active-filter="resolvedActiveFilter"
      :select-filter="selectFilter"
    >
      <nav class="peaui-notification-center__filters" :aria-label="labels.filters">
        <button
          v-for="filter in availableFilters"
          :key="filter.id"
          type="button"
          class="peaui-notification-center__filter"
          :class="{
            'peaui-notification-center__filter--active': filter.id === resolvedActiveFilter,
          }"
          :aria-pressed="filter.id === resolvedActiveFilter"
          @click="selectFilter(filter.id)"
        >
          {{ filter.label }}
        </button>
      </nav>
    </slot>

    <div
      v-if="error && items.length > 0"
      class="peaui-notification-center__inline-error"
      role="alert"
    >
      <span>{{ error }}</span>
      <ButtonAction size="s" variant="ghost" @click="emit('retry')">{{
        labels.retry
      }}</ButtonAction>
    </div>

    <ScrollArea
      class="peaui-notification-center__scroll-area"
      type="styled"
      orientation="vertical"
      :aria-label="labels.notificationsList"
      @reach-end="paginationMode === 'infinite' && requestLoadMore()"
    >
      <slot v-if="loading && items.length === 0" name="loading" :label="labels.loading">
        <div class="peaui-notification-center__loading" role="status" :aria-label="labels.loading">
          <SkeletonLoading v-for="index in 4" :key="index" size="l" rounded />
        </div>
      </slot>

      <slot
        v-else-if="error && items.length === 0"
        name="error"
        :error="error"
        :retry="() => emit('retry')"
      >
        <div class="peaui-notification-center__state" role="alert">
          <EmptyState :title="labels.errorTitle" :description="error" />
          <ButtonAction size="s" variant="secondary" @click="emit('retry')">{{
            labels.retry
          }}</ButtonAction>
        </div>
      </slot>

      <slot
        v-else-if="visibleItems.length === 0"
        name="empty"
        :filtered="resolvedActiveFilter !== 'all'"
      >
        <EmptyState
          :title="resolvedActiveFilter === 'all' ? labels.emptyTitle : labels.filteredEmptyTitle"
          :description="
            resolvedActiveFilter === 'all'
              ? labels.emptyDescription
              : labels.filteredEmptyDescription
          "
        />
      </slot>

      <div v-else class="peaui-notification-center__groups">
        <section
          v-for="group in groups"
          :key="group.id"
          class="peaui-notification-center__group"
          :role="groupBy === 'none' ? undefined : 'group'"
          :aria-labelledby="groupBy === 'none' ? undefined : groupHeadingId(group.id)"
        >
          <slot v-if="groupBy !== 'none'" name="group-header" :group="group">
            <h3 :id="groupHeadingId(group.id)" class="peaui-notification-center__group-title">
              {{ group.label }}
            </h3>
          </slot>

          <ol class="peaui-notification-center__list" role="list">
            <li
              v-for="item in group.items"
              :key="item.id"
              class="peaui-notification-center__item"
              :class="{
                'peaui-notification-center__item--unread': !item.read,
                'peaui-notification-center__item--selected': item.id === selectedId,
                'peaui-notification-center__item--disabled': item.disabled,
              }"
              :data-priority="item.priority || 'normal'"
            >
              <slot
                name="item"
                :item="item"
                :selected="item.id === selectedId"
                :select="() => selectItem(item)"
              >
                <button
                  type="button"
                  class="peaui-notification-center__item-main"
                  :disabled="item.disabled || isPending(item.id)"
                  :aria-current="item.id === selectedId ? 'true' : undefined"
                  @click="selectItem(item)"
                >
                  <slot name="item-icon" :item="item">
                    <span
                      class="peaui-notification-center__indicator"
                      :class="{ 'peaui-notification-center__indicator--visible': !item.read }"
                      aria-hidden="true"
                    />
                  </slot>
                  <span class="peaui-notification-center__content">
                    <span class="peaui-notification-center__item-heading">
                      <span class="peaui-notification-center__item-title">{{ item.title }}</span>
                      <span v-if="!item.read" class="peaui-sr-only">{{ labels.unreadStatus }}</span>
                    </span>
                    <span v-if="item.description" class="peaui-notification-center__description">
                      {{ item.description }}
                    </span>
                    <span class="peaui-notification-center__meta">
                      <time
                        :datetime="getNotificationCenterDateTime(item.createdAt)"
                        :title="getNotificationCenterDateTime(item.createdAt)"
                      >
                        {{ displayDate(item) }}
                      </time>
                      <span
                        v-if="getNotificationCenterPriorityLabel(item.priority, labels)"
                        class="peaui-notification-center__priority"
                      >
                        {{ getNotificationCenterPriorityLabel(item.priority, labels) }}
                      </span>
                    </span>
                  </span>
                </button>

                <div class="peaui-notification-center__actions">
                  <ButtonAction
                    size="s"
                    variant="ghost"
                    :disabled="item.disabled || isPending(item.id)"
                    :aria-label="item.read ? labels.markUnread : labels.markRead"
                    @click="toggleRead(item)"
                  >
                    {{ item.read ? labels.markUnread : labels.markRead }}
                  </ButtonAction>
                  <slot
                    name="item-actions"
                    :item="item"
                    :emit-action="(action: NotificationCenterAction) => emitAction(item, action)"
                  >
                    <ButtonAction
                      v-for="action in item.actions || []"
                      :key="action.id"
                      size="s"
                      :variant="action.danger ? 'danger' : 'ghost'"
                      :disabled="item.disabled || action.disabled || isPending(item.id)"
                      @click="emitAction(item, action)"
                    >
                      {{ action.label }}
                    </ButtonAction>
                  </slot>
                </div>
              </slot>
            </li>
          </ol>
        </section>
      </div>

      <div v-if="loadingMore" class="peaui-notification-center__loading-more" role="status">
        <SkeletonLoading size="m" rounded />
        <span>{{ labels.loadingMore }}</span>
      </div>
    </ScrollArea>

    <slot name="footer" :has-more="hasMore" :load-more="requestLoadMore">
      <footer v-if="hasMore && visibleItems.length > 0" class="peaui-notification-center__footer">
        <ButtonAction
          size="s"
          variant="secondary"
          :disabled="loading || loadingMore || requestLocked"
          @click="requestLoadMore"
        >
          {{ loadingMore ? labels.loadingMore : labels.loadMore }}
        </ButtonAction>
      </footer>
    </slot>
  </section>
</template>

<style lang="scss" src="./styles.scss"></style>
