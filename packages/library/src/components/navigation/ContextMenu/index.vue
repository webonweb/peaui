<script lang="ts">
import type { DropdownMenuDensity, DropdownMenuItem } from '../DropdownMenu/index.vue';

export type ContextMenuTrigger = 'pointer' | 'keyboard' | 'both';
export type ContextMenuPosition = 'cursor' | 'target';
export type ContextMenuOpenSource = 'pointer' | 'keyboard' | 'long-press' | 'programmatic';
export type ContextMenuCloseReason =
  'programmatic' | 'dismiss' | 'select' | 'scroll' | 'target-removed' | 'disabled';
export type ContextMenuLongPressCancelReason =
  'move' | 'release' | 'pointer-cancel' | 'disabled' | 'target-removed';

export interface ContextMenuPoint {
  x: number;
  y: number;
  context?: unknown;
}

export interface ContextMenuOpenDetail {
  context: unknown;
  source: ContextMenuOpenSource;
  x: number;
  y: number;
}

export interface ContextMenuProps {
  /** Pozycje współdzielące pełny kontrakt semantyczny z DropdownMenu. */
  items?: DropdownMenuItem[];
  /** Dane domenowe bieżącego celu przekazywane w zdarzeniach akcji. */
  context?: unknown;
  /** Wyłącza wyłącznie menu kontekstowe, bez blokowania podstawowej funkcji celu. */
  disabled?: boolean;
  /** Dozwolony sposób otwierania menu. */
  trigger?: ContextMenuTrigger;
  /** Pozycjonuje menu przy kursorze albo przy prostokącie aktywnego celu. */
  position?: ContextMenuPosition;
  /** Włącza otwieranie dotykiem po bezruchowym przytrzymaniu. */
  longPress?: boolean;
  /** Czas przytrzymania w milisekundach; wartości są ograniczane do bezpiecznego zakresu. */
  longPressDelay?: number;
  /** Maksymalny ruch wskaźnika w pikselach przed anulowaniem long press. */
  longPressMoveThreshold?: number;
  /** Zamyka otwarte menu po przewinięciu dokumentu lub kontenera celu. */
  closeOnScroll?: boolean;
  /** Odstęp powierzchni menu od punktu albo celu w pikselach. */
  offset?: number;
  /** Zamyka menu po zwykłej akcji. */
  closeOnSelect?: boolean;
  /** Pozwala zapętlać nawigację strzałkami. */
  loop?: boolean;
  /** Gęstość pionowa pozycji menu. */
  density?: DropdownMenuDensity;
  /** Dostępna nazwa powierzchni menu. */
  ariaLabel?: string;
  /** Pokazuje stan ładowania zamiast pozycji. */
  loading?: boolean;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}

export interface ContextMenuHandle {
  openAt(point: ContextMenuPoint): boolean;
  close(): void;
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
  watch,
  type CSSProperties,
} from 'vue';

import DropdownMenu from '../DropdownMenu/index.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ContextMenuProps>(), {
  items: () => [],
  disabled: false,
  trigger: 'both',
  position: 'cursor',
  longPress: true,
  longPressDelay: 550,
  longPressMoveThreshold: 10,
  closeOnScroll: true,
  offset: 4,
  closeOnSelect: true,
  loop: true,
  density: 'comfortable',
  ariaLabel: 'Menu kontekstowe',
  loading: false,
});

const open = defineModel<boolean>('open', {
  default: false,
  /** Stan otwarcia menu kontrolowany przez v-model:open. */
});

const emit = defineEmits<{
  /** Emitowane po skutecznym otwarciu menu. */
  (event: 'open', detail: ContextMenuOpenDetail): void;
  /** Emitowane po zamknięciu menu wraz z przyczyną. */
  (event: 'close', reason: ContextMenuCloseReason): void;
  /** Emitowane po aktywowaniu dostępnej pozycji. */
  (event: 'select', item: DropdownMenuItem, path: number[], context: unknown): void;
  /** Emitowane po zmianie intencji pozycji checkbox lub radio. */
  (
    event: 'checkedChange',
    item: DropdownMenuItem,
    checked: boolean,
    path: number[],
    context: unknown,
  ): void;
  /** Emitowane po wyborze pozycji posiadającej wartość. */
  (
    event: 'valueChange',
    item: DropdownMenuItem,
    value: unknown,
    path: number[],
    context: unknown,
  ): void;
  /** Emitowane, gdy aktywacja wskazuje nowy kontekst danych. */
  (event: 'contextChange', context: unknown): void;
  /** Emitowane, gdy oczekujący long press został świadomie anulowany. */
  (event: 'longPressCancel', reason: ContextMenuLongPressCancelReason): void;
}>();

defineSlots<{
  /** Obszar wywołujący menu; automatycznie otrzymuje równoważną obsługę myszy i klawiatury. */
  default?(props: { open: boolean; disabled: boolean; context: unknown }): unknown;
  /** Nazwany odpowiednik domyślnego obszaru wywołującego. */
  trigger?(props: { open: boolean; disabled: boolean; context: unknown }): unknown;
  /** Renderuje treść pozycji wewnątrz zachowanego elementu menuitem. */
  item?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje dekoracyjną ikonę pozycji. */
  'item-icon'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje wizualną podpowiedź skrótu. */
  'item-shortcut'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje widoczną etykietę grupy. */
  'group-label'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje pusty stan menu. */
  empty?(): unknown;
  /** Renderuje stan ładowania. */
  loading?(): unknown;
}>();

type MenuComponentHandle = {
  $el?: HTMLElement;
  reposition(): void;
};

type LongPressState = {
  pointerId: number;
  startX: number;
  startY: number;
  target: HTMLElement;
};

const FOCUSABLE_TARGET =
  'button, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const classNameComponent = `${UIKIT_NAME}-context-menu`;
const attrs = useAttrs();
const root = ref<HTMLElement>();
const targetHost = ref<HTMLElement>();
const virtualTrigger = ref<HTMLButtonElement>();
const menuComponent = ref<MenuComponentHandle>();
const activeContext = ref<unknown>(props.context);
const anchorRect = ref<DOMRect>(pointRect(0, 0));
const anchorPlacement = ref<'top' | 'bottom'>('bottom');
const anchorAlign = ref<'start' | 'end'>('start');
let activeTarget: HTMLElement | undefined;
let managedTarget: HTMLElement | undefined;
let managedTargetOriginals: Map<string, string | null> | undefined;
let targetObserver: MutationObserver | undefined;
let virtualTriggerObserver: MutationObserver | undefined;
let longPressState: LongPressState | undefined;
let longPressTimer: ReturnType<typeof setTimeout> | undefined;
let pendingCloseReason: ContextMenuCloseReason = 'dismiss';

const rootClasses = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--open`]: open.value,
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
    ...rest
  } = attrs;

  return { ...rest, 'data-testid': props.dataTestId ?? attrsDataTestId };
});
const menuLabel = computed(() => {
  const value = attrs['aria-label'];
  return typeof value === 'string' && value.trim() ? value : props.ariaLabel;
});
const pointerEnabled = computed(() => props.trigger === 'pointer' || props.trigger === 'both');
const keyboardEnabled = computed(() => props.trigger === 'keyboard' || props.trigger === 'both');

function pointRect(x: number, y: number): DOMRect {
  return {
    bottom: y,
    height: 0,
    left: x,
    right: x,
    top: y,
    width: 0,
    x,
    y,
    toJSON: () => ({ bottom: y, height: 0, left: x, right: x, top: y, width: 0, x, y }),
  } as DOMRect;
}

function eventTarget(event: Event): HTMLElement | undefined {
  const candidate = event.target instanceof HTMLElement ? event.target : undefined;
  if (!candidate || !targetHost.value?.contains(candidate)) return managedTarget;
  return candidate.closest<HTMLElement>(FOCUSABLE_TARGET) ?? managedTarget ?? candidate;
}

function restoreManagedTarget(): void {
  if (!managedTarget || !managedTargetOriginals || managedTarget === targetHost.value) return;
  for (const [name, value] of managedTargetOriginals) {
    if (value === null) managedTarget.removeAttribute(name);
    else managedTarget.setAttribute(name, value);
  }
  managedTarget = undefined;
  managedTargetOriginals = undefined;
}

function syncTargetAria(): void {
  const host = targetHost.value;
  if (!host) return;
  const nextTarget = host.querySelector<HTMLElement>(FOCUSABLE_TARGET) ?? host;

  if (managedTarget !== nextTarget) {
    restoreManagedTarget();
    managedTarget = nextTarget;
    if (nextTarget !== host) {
      managedTargetOriginals = new Map();
      for (const name of ['aria-haspopup', 'aria-expanded', 'aria-controls']) {
        managedTargetOriginals.set(name, nextTarget.getAttribute(name));
      }
    }
  }

  if (nextTarget === host) {
    host.tabIndex = props.disabled ? -1 : 0;
    host.setAttribute('role', 'button');
    host.setAttribute('aria-disabled', String(props.disabled));
  } else {
    host.removeAttribute('tabindex');
    host.removeAttribute('role');
    host.removeAttribute('aria-disabled');
  }

  if (props.disabled) {
    nextTarget.removeAttribute('aria-haspopup');
    nextTarget.removeAttribute('aria-expanded');
    nextTarget.removeAttribute('aria-controls');
    return;
  }

  nextTarget.setAttribute('aria-haspopup', 'menu');
  nextTarget.setAttribute('aria-expanded', String(open.value));
  const controls = virtualTrigger.value?.getAttribute('aria-controls');
  if (controls) nextTarget.setAttribute('aria-controls', controls);
}

function installVirtualTrigger(): void {
  const trigger = virtualTrigger.value;
  if (!trigger) return;
  trigger.getBoundingClientRect = () => anchorRect.value;
  trigger.focus = (options?: FocusOptions) => {
    const target = activeTarget?.isConnected ? activeTarget : managedTarget;
    target?.focus(options);
  };
  virtualTriggerObserver?.disconnect();
  virtualTriggerObserver = new MutationObserver(syncTargetAria);
  virtualTriggerObserver.observe(trigger, {
    attributes: true,
    attributeFilter: ['aria-controls', 'aria-expanded'],
  });
  syncTargetAria();
}

function setContext(nextContext: unknown): void {
  if (Object.is(activeContext.value, nextContext)) return;
  activeContext.value = nextContext;
  emit('contextChange', nextContext);
}

function resolveAnchorDirection(rect: DOMRect): void {
  const viewport = window.visualViewport;
  const left = viewport?.offsetLeft ?? 0;
  const top = viewport?.offsetTop ?? 0;
  const width = viewport?.width ?? window.innerWidth;
  const height = viewport?.height ?? window.innerHeight;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  anchorAlign.value = centerX > left + width / 2 ? 'end' : 'start';
  anchorPlacement.value = centerY > top + height / 2 ? 'top' : 'bottom';
}

function requestOpenAt(
  rect: DOMRect,
  target: HTMLElement | undefined,
  source: ContextMenuOpenSource,
  nextContext: unknown,
): boolean {
  if (props.disabled) return false;
  anchorRect.value = rect;
  resolveAnchorDirection(rect);
  activeTarget = target?.isConnected ? target : managedTarget;
  setContext(nextContext);
  pendingCloseReason = 'dismiss';
  open.value = true;
  emit('open', { context: activeContext.value, source, x: rect.left, y: rect.top });
  void nextTick(() => {
    installVirtualTrigger();
    menuComponent.value?.reposition();
  });
  return true;
}

function openAt(point: ContextMenuPoint): boolean {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
  const nextContext = Object.prototype.hasOwnProperty.call(point, 'context')
    ? point.context
    : props.context;
  return requestOpenAt(pointRect(point.x, point.y), managedTarget, 'programmatic', nextContext);
}

function close(reason: ContextMenuCloseReason = 'programmatic'): void {
  cancelLongPress(reason === 'disabled' ? 'disabled' : 'release', false);
  if (!open.value) return;
  pendingCloseReason = reason;
  open.value = false;
  emit('close', reason);
}

function handleInnerOpen(value: boolean): void {
  if (value) {
    open.value = true;
    return;
  }
  if (!open.value) return;
  const reason = pendingCloseReason;
  open.value = false;
  emit('close', reason);
  pendingCloseReason = 'dismiss';
}

function openForTarget(target: HTMLElement | undefined, source: ContextMenuOpenSource): boolean {
  const resolvedTarget = target?.isConnected ? target : managedTarget;
  if (!resolvedTarget) return false;
  const rect = resolvedTarget.getBoundingClientRect();
  return requestOpenAt(rect, resolvedTarget, source, props.context);
}

function handleContextMenu(event: MouseEvent): void {
  if (!pointerEnabled.value || props.disabled || event.defaultPrevented) return;
  const target = eventTarget(event);
  const activated =
    props.position === 'target'
      ? openForTarget(target, 'pointer')
      : requestOpenAt(pointRect(event.clientX, event.clientY), target, 'pointer', props.context);
  if (activated) event.preventDefault();
}

function handleKeydown(event: KeyboardEvent): void {
  if (!keyboardEnabled.value || props.disabled) return;
  const fallbackButtonActivation =
    managedTarget === targetHost.value && (event.key === 'Enter' || event.key === ' ');
  if (!(
    fallbackButtonActivation ||
    event.key === 'ContextMenu' ||
    event.key === 'Apps' ||
    (event.shiftKey && event.key === 'F10')
  ))
    return;
  if (openForTarget(eventTarget(event), 'keyboard')) event.preventDefault();
}

function safeLongPressDelay(): number {
  return Math.min(1500, Math.max(300, props.longPressDelay));
}

function cancelLongPress(reason: ContextMenuLongPressCancelReason, notify = true): void {
  if (!longPressState && !longPressTimer) return;
  if (longPressTimer) clearTimeout(longPressTimer);
  longPressTimer = undefined;
  longPressState = undefined;
  if (notify) emit('longPressCancel', reason);
}

function handlePointerDown(event: PointerEvent): void {
  if (
    !props.longPress ||
    !pointerEnabled.value ||
    props.disabled ||
    event.pointerType !== 'touch' ||
    !event.isPrimary ||
    event.button !== 0
  )
    return;
  cancelLongPress('pointer-cancel', false);
  const target = eventTarget(event);
  if (!target) return;
  longPressState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    target,
  };
  longPressTimer = setTimeout(() => {
    const state = longPressState;
    longPressState = undefined;
    longPressTimer = undefined;
    if (!state?.target.isConnected || props.disabled) return;
    requestOpenAt(pointRect(state.startX, state.startY), state.target, 'long-press', props.context);
  }, safeLongPressDelay());
}

function handlePointerMove(event: PointerEvent): void {
  const state = longPressState;
  if (!state || state.pointerId !== event.pointerId) return;
  const distance = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
  if (distance > Math.max(4, props.longPressMoveThreshold)) cancelLongPress('move');
}

function handlePointerEnd(event: PointerEvent, reason: ContextMenuLongPressCancelReason): void {
  if (longPressState?.pointerId === event.pointerId) cancelLongPress(reason);
}

function handleSelect(item: DropdownMenuItem, path: number[]): void {
  pendingCloseReason = 'select';
  emit('select', item, path, activeContext.value);
}

function handleCheckedChange(item: DropdownMenuItem, checked: boolean, path: number[]): void {
  emit('checkedChange', item, checked, path, activeContext.value);
}

function handleValueChange(item: DropdownMenuItem, value: unknown, path: number[]): void {
  emit('valueChange', item, value, path, activeContext.value);
}

function handleScroll(event: Event): void {
  const target = event.target;
  const menuRoot = menuComponent.value?.$el;
  if (target instanceof Node && menuRoot?.contains(target)) return;
  close('scroll');
}

watch(
  () => props.context,
  (value) => (activeContext.value = value),
);
watch(
  () => [open.value, props.disabled],
  () => void nextTick(syncTargetAria),
);
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      cancelLongPress('disabled');
      close('disabled');
    }
  },
);
watch(
  () => [open.value, props.closeOnScroll],
  ([isOpen, closeOnScroll], _previous, onCleanup) => {
    if (!isOpen || !closeOnScroll) return;
    window.addEventListener('scroll', handleScroll, true);
    onCleanup(() => window.removeEventListener('scroll', handleScroll, true));
  },
);

onMounted(() => {
  void nextTick(() => {
    syncTargetAria();
    installVirtualTrigger();
    if (managedTarget && open.value) {
      anchorRect.value = managedTarget.getBoundingClientRect();
      menuComponent.value?.reposition();
    }
    if (targetHost.value && typeof MutationObserver !== 'undefined') {
      targetObserver = new MutationObserver(() => {
        if (activeTarget && !activeTarget.isConnected) {
          cancelLongPress('target-removed');
          close('target-removed');
        }
        syncTargetAria();
      });
      targetObserver.observe(targetHost.value, { childList: true, subtree: true });
    }
  });
});

onBeforeUnmount(() => {
  cancelLongPress('target-removed', false);
  window.removeEventListener('scroll', handleScroll, true);
  targetObserver?.disconnect();
  virtualTriggerObserver?.disconnect();
  restoreManagedTarget();
});

defineExpose<ContextMenuHandle>({ close: () => close(), openAt });
</script>

<template>
  <span ref="root" v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <span
      ref="targetHost"
      :class="`${classNameComponent}__target`"
      @contextmenu="handleContextMenu"
      @keydown="handleKeydown"
      @pointercancel="handlePointerEnd($event, 'pointer-cancel')"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerEnd($event, 'release')"
    >
      <slot name="trigger" :open="open" :disabled="props.disabled" :context="activeContext">
        <slot :open="open" :disabled="props.disabled" :context="activeContext">
          <span :class="`${classNameComponent}__placeholder`">
            Kliknij prawym przyciskiem lub naciśnij Shift+F10
          </span>
        </slot>
      </slot>
    </span>

    <DropdownMenu
      ref="menuComponent"
      :class="`${classNameComponent}__menu`"
      :items="props.items"
      :open="open"
      :placement="anchorPlacement"
      :align="anchorAlign"
      :offset="Math.max(0, props.offset)"
      :close-on-select="props.closeOnSelect"
      :loop="props.loop"
      :density="props.density"
      :aria-label="menuLabel"
      :loading="props.loading"
      :data-test-id="props.dataTestId ? `${props.dataTestId}-dropdown` : undefined"
      @update:open="handleInnerOpen"
      @select="handleSelect"
      @checked-change="handleCheckedChange"
      @value-change="handleValueChange"
    >
      <template #trigger>
        <button
          ref="virtualTrigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          inert
          :class="`${classNameComponent}__virtual-trigger`"
        />
      </template>
      <template #item="slotProps">
        <slot name="item" v-bind="slotProps">{{ slotProps.item.label }}</slot>
      </template>
      <template #item-icon="slotProps">
        <slot name="item-icon" v-bind="slotProps" />
      </template>
      <template #item-shortcut="slotProps">
        <slot name="item-shortcut" v-bind="slotProps">{{ slotProps.item.shortcut }}</slot>
      </template>
      <template #group-label="slotProps">
        <slot name="group-label" v-bind="slotProps">{{ slotProps.item.label }}</slot>
      </template>
      <template #empty><slot name="empty">Brak dostępnych akcji</slot></template>
      <template #loading><slot name="loading">Ładowanie menu…</slot></template>
    </DropdownMenu>
  </span>
</template>
