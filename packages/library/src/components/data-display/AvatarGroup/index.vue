<script lang="ts">
export type AvatarGroupDirection = 'start' | 'end';
export type AvatarGroupOverflowMode = 'count' | 'popover' | 'none';
export type AvatarGroupSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type AvatarGroupShape = 'circle' | 'rounded';
export type AvatarGroupStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

export interface AvatarGroupItem {
  /** Stabilny identyfikator osoby. */
  id: string | number;
  /** Nazwa osoby używana jako dostępna etykieta i źródło inicjałów. */
  name?: string;
  /** Adres obrazu awatara. */
  src?: string;
  /** Alternatywny opis obrazu; nazwa osoby pozostaje etykietą przycisku. */
  alt?: string;
  /** Jawne inicjały osoby. */
  initials?: string;
  /** Status obecności zgodny z komponentem Avatar. */
  status?: AvatarGroupStatus;
  /** Wyłącza wybór konkretnej osoby. */
  disabled?: boolean;
  /** Dane domenowe zachowywane w evencie select. */
  metadata?: unknown;
}

export interface AvatarGroupProps {
  /** Osoby prezentowane w stabilnej kolejności wejściowej. */
  items?: AvatarGroupItem[];
  /** Maksymalna liczba awatarów widocznych przed licznikiem nadmiaru. */
  maxVisible?: number;
  /** Rozmiar awatarów i licznika. */
  size?: AvatarGroupSize;
  /** Kształt awatarów i licznika. */
  shape?: AvatarGroupShape;
  /** Włącza kompaktowy układ z nachodzącymi na siebie elementami. */
  overlap?: boolean;
  /** Określa, która krawędź stosu znajduje się wizualnie na wierzchu. */
  direction?: AvatarGroupDirection;
  /** Sposób prezentacji pozycji poza limitem. */
  overflowMode?: AvatarGroupOverflowMode;
  /** Pole lub funkcja zwracająca stabilny klucz elementu. */
  itemKey?: keyof AvatarGroupItem | ((item: AvatarGroupItem, index: number) => string | number);
  /** Dostępna nazwa listy widocznych osób. */
  ariaLabel?: string;
  /** Wyłącza wszystkie akcje grupy. */
  disabled?: boolean;
  /** Sygnalizuje ładowanie szczegółowej listy w popoverze. */
  loading?: boolean;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  useId,
  watch,
  type CSSProperties,
} from 'vue';

import Avatar, { type AvatarShape, type AvatarSize, type AvatarStatus } from '../Avatar/index.vue';
import { observeAvatarGroupPopover } from './avatar-group.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  items: () => [],
  maxVisible: 3,
  size: 'm',
  shape: 'circle',
  overlap: true,
  direction: 'end',
  overflowMode: 'count',
  itemKey: 'id',
  ariaLabel: 'Członkowie grupy',
  disabled: false,
  loading: false,
});

const open = defineModel<boolean>('open', {
  default: false,
  /** Steruje widocznością listy osób ukrytych za licznikiem. */
});

const emit = defineEmits<{
  /** Zwraca wybraną osobę oraz jej indeks w źródłowej tablicy. */
  (event: 'select', item: AvatarGroupItem, index: number): void;
  /** Informuje o aktywowaniu licznika nadmiaru. */
  (event: 'overflowClick', hiddenItems: AvatarGroupItem[]): void;
}>();

defineSlots<{
  /** Renderuje zawartość widocznego przycisku osoby. */
  item?(props: { item: AvatarGroupItem; index: number }): unknown;
  /** Renderuje wizualną zawartość przycisku nadmiaru. */
  overflow?(props: { count: number; items: AvatarGroupItem[] }): unknown;
  /** Renderuje nagłówek panelu pozostałych osób. */
  'popover-header'?(props: { count: number }): unknown;
  /** Renderuje zawartość osoby w panelu. */
  'popover-item'?(props: { item: AvatarGroupItem; index: number }): unknown;
  /** Renderuje pusty stan grupy. */
  empty?(): unknown;
}>();

const STATUS_LABELS: Readonly<Record<Exclude<AvatarStatus, 'none'>, string>> = {
  online: 'Dostępny',
  offline: 'Niedostępny',
  away: 'Zaraz wracam',
  busy: 'Zajęty',
};
const classNameComponent = `${UIKIT_NAME}-avatar-group`;
const attrs = useAttrs();
const instanceId = useId().replace(/:/g, '');
const popoverId = `${classNameComponent}-popover-${instanceId}`;
const root = ref<HTMLElement>();
const overflowButton = ref<HTMLButtonElement>();
const popover = ref<HTMLElement>();

const normalizedLimit = computed(() => {
  if (!Number.isFinite(props.maxVisible)) return props.items.length;

  return Math.max(0, Math.floor(props.maxVisible));
});
const visibleItems = computed(() => props.items.slice(0, normalizedLimit.value));
const hiddenItems = computed(() => props.items.slice(normalizedLimit.value));
const hasOverflow = computed(() => props.overflowMode !== 'none' && hiddenItems.value.length > 0);
const showsPopover = computed(
  () => props.overflowMode === 'popover' && hasOverflow.value && open.value && !props.disabled,
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--shape-${props.shape}`,
  `${classNameComponent}--direction-${props.direction}`,
  props.overlap ? `${classNameComponent}--overlap` : `${classNameComponent}--spaced`,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--open`]: showsPopover.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': _ariaLabel,
    'data-testid': attrsDataTestId,
    ...restAttrs
  } = attrs;

  return {
    ...restAttrs,
    'data-testid': props.dataTestId ?? attrsDataTestId,
  };
});
const groupLabel = computed(() => {
  const attributeLabel = typeof attrs['aria-label'] === 'string' ? attrs['aria-label'].trim() : '';

  return attributeLabel || props.ariaLabel;
});
const overflowLabel = computed(() => `Pokaż ${hiddenItems.value.length} pozostałych użytkowników`);

function getItemKey(item: AvatarGroupItem, index: number): string | number {
  if (typeof props.itemKey === 'function') return props.itemKey(item, index);

  const value = item[props.itemKey];

  return typeof value === 'string' || typeof value === 'number' ? value : item.id;
}

function itemName(item: AvatarGroupItem, index: number): string {
  const name = item.name?.trim() || item.alt?.trim() || item.initials?.trim();

  return name || `Użytkownik ${index + 1}`;
}

function itemLabel(item: AvatarGroupItem, index: number): string {
  const status = item.status && item.status !== 'none' ? STATUS_LABELS[item.status] : undefined;

  return status ? `${itemName(item, index)}, ${status}` : itemName(item, index);
}

function itemStyle(index: number): CSSProperties {
  return {
    '--peaui-avatar-group-index': index,
    '--peaui-avatar-group-reverse-index': Math.max(0, visibleItems.value.length - index),
  } as CSSProperties;
}

function isItemDisabled(item: AvatarGroupItem): boolean {
  return props.disabled || item.disabled === true;
}

function selectItem(item: AvatarGroupItem, index: number, fromPopover = false): void {
  if (isItemDisabled(item)) return;
  emit('select', item, index);
  if (fromPopover) closePopover(true);
}

function activateOverflow(): void {
  if (props.disabled) return;
  emit('overflowClick', hiddenItems.value);
  if (props.overflowMode !== 'popover') return;

  open.value = !open.value;
}

function closePopover(restoreFocus = false): void {
  if (!open.value) return;
  open.value = false;
  if (restoreFocus)
    void nextTick(() => {
      const target = overflowButton.value;
      (target && !target.disabled ? target : root.value)?.focus();
    });
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !showsPopover.value) return;
  event.preventDefault();
  event.stopPropagation();
  closePopover(true);
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!showsPopover.value || root.value?.contains(event.target as Node)) return;
  closePopover(false);
}

function focusPopover(): void {
  const firstAction = popover.value?.querySelector<HTMLButtonElement>('button:not(:disabled)');
  (firstAction ?? popover.value)?.focus();
}

let removedFocus: { element: HTMLElement; index: number } | undefined;
onBeforeUpdate(() => {
  const active = document.activeElement;
  removedFocus =
    active instanceof HTMLElement && popover.value?.contains(active)
      ? {
          element: active,
          index: Array.from(popover.value.querySelectorAll('button:not(:disabled)')).indexOf(
            active,
          ),
        }
      : undefined;
});
onUpdated(() => {
  const previous = removedFocus;
  removedFocus = undefined;
  if (
    !previous ||
    previous.element.isConnected ||
    (document.activeElement !== document.body && document.activeElement !== previous.element)
  )
    return;
  const actions = showsPopover.value
    ? popover.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
    : undefined;
  const next = actions?.[Math.min(Math.max(previous.index, 0), actions.length - 1)];
  (next ?? (showsPopover.value ? popover.value : overflowButton.value) ?? root.value)?.focus();
});

let stopPositioning: (() => void) | undefined;
function positionPopover(): void {
  stopPositioning?.();
  stopPositioning =
    showsPopover.value && root.value && popover.value
      ? observeAvatarGroupPopover(root.value, popover.value, props.direction)
      : undefined;
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && open.value) closePopover(root.value?.contains(document.activeElement) ?? false);
  },
);
watch(
  () => props.loading,
  () => {
    if (showsPopover.value && popover.value?.contains(document.activeElement))
      void nextTick(focusPopover);
  },
);
watch(
  () => props.direction,
  () => {
    if (showsPopover.value) void nextTick(positionPopover);
  },
);
watch(showsPopover, (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    void nextTick(() => {
      if (!showsPopover.value) return;
      positionPopover();
      focusPopover();
    });
  } else {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    positionPopover();
  }
});
onMounted(() => {
  if (!showsPopover.value) return;
  document.addEventListener('pointerdown', handleDocumentPointerDown);
  positionPopover();
  focusPopover();
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown);
  stopPositioning?.();
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    :tabindex="
      typeof attrs.tabindex === 'string' || typeof attrs.tabindex === 'number' ? attrs.tabindex : -1
    "
    @keydown="handleKeydown"
  >
    <ul :class="`${classNameComponent}__list`" role="list" :aria-label="groupLabel">
      <li
        v-for="(item, index) in visibleItems"
        :key="getItemKey(item, index)"
        :class="`${classNameComponent}__item`"
        :style="itemStyle(index)"
        :data-testid="props.dataTestId ? `${props.dataTestId}-item-${index}` : undefined"
      >
        <button
          type="button"
          :class="`${classNameComponent}__avatar-button`"
          :aria-label="itemLabel(item, index)"
          :disabled="isItemDisabled(item)"
          @click="selectItem(item, index)"
        >
          <span :class="`${classNameComponent}__visual`" aria-hidden="true">
            <slot name="item" :item="item" :index="index">
              <Avatar
                alt=""
                :name="item.name"
                :src="item.src"
                :initials="item.initials"
                :status="item.status ?? 'none'"
                :size="props.size as AvatarSize"
                :shape="props.shape as AvatarShape"
                aria-hidden="true"
              />
            </slot>
          </span>
        </button>
      </li>

      <li
        v-if="hasOverflow"
        :class="`${classNameComponent}__item ${classNameComponent}__overflow-item`"
      >
        <button
          ref="overflowButton"
          type="button"
          :class="`${classNameComponent}__overflow-button`"
          :aria-label="overflowLabel"
          :aria-expanded="props.overflowMode === 'popover' ? showsPopover : undefined"
          :aria-controls="props.overflowMode === 'popover' ? popoverId : undefined"
          :aria-haspopup="props.overflowMode === 'popover' ? 'dialog' : undefined"
          :disabled="props.disabled"
          :data-testid="props.dataTestId ? `${props.dataTestId}-overflow` : undefined"
          @click="activateOverflow"
        >
          <span aria-hidden="true">
            <slot name="overflow" :count="hiddenItems.length" :items="hiddenItems">
              +{{ hiddenItems.length }}
            </slot>
          </span>
        </button>
      </li>

      <li v-if="props.items.length === 0" :class="`${classNameComponent}__empty`">
        <slot name="empty">Brak użytkowników</slot>
      </li>
    </ul>

    <section
      v-if="props.overflowMode === 'popover' && hasOverflow"
      v-show="showsPopover"
      :id="popoverId"
      ref="popover"
      :class="`${classNameComponent}__popover`"
      role="dialog"
      tabindex="-1"
      :aria-label="`Pozostali użytkownicy (${hiddenItems.length})`"
      :aria-busy="props.loading || undefined"
      :data-testid="props.dataTestId ? `${props.dataTestId}-popover` : undefined"
    >
      <template v-if="showsPopover">
        <div :class="`${classNameComponent}__popover-header`">
          <slot name="popover-header" :count="hiddenItems.length">Pozostali użytkownicy</slot>
        </div>
        <p v-if="props.loading" :class="`${classNameComponent}__loading`" role="status">
          Ładowanie użytkowników…
        </p>
        <ul v-else :class="`${classNameComponent}__popover-list`" role="list">
          <li
            v-for="(item, hiddenIndex) in hiddenItems"
            :key="getItemKey(item, normalizedLimit + hiddenIndex)"
            :class="`${classNameComponent}__popover-item`"
          >
            <button
              type="button"
              :class="`${classNameComponent}__popover-button`"
              :aria-label="itemLabel(item, normalizedLimit + hiddenIndex)"
              :disabled="isItemDisabled(item)"
              @click="selectItem(item, normalizedLimit + hiddenIndex, true)"
            >
              <span :class="`${classNameComponent}__popover-visual`" aria-hidden="true">
                <slot name="popover-item" :item="item" :index="normalizedLimit + hiddenIndex">
                  <Avatar
                    alt=""
                    :name="item.name"
                    :src="item.src"
                    :initials="item.initials"
                    :status="item.status ?? 'none'"
                    size="s"
                    :shape="props.shape as AvatarShape"
                    aria-hidden="true"
                  />
                  <span :class="`${classNameComponent}__popover-name`">
                    {{ itemName(item, normalizedLimit + hiddenIndex) }}
                  </span>
                </slot>
              </span>
            </button>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>
