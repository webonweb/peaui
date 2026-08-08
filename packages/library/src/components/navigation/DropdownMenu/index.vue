<script lang="ts">
export type DropdownMenuAlign = 'start' | 'center' | 'end';
export type DropdownMenuDensity = 'compact' | 'comfortable';
export type DropdownMenuItemType =
  | 'item'
  | 'checkbox'
  | 'radio'
  | 'separator'
  | 'group'
  | 'submenu';
export type DropdownMenuItemVariant = 'default' | 'danger';
export type DropdownMenuPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface DropdownMenuItem {
  /** Stabilny identyfikator pozycji. */
  id: string | number;
  /** Semantyczny rodzaj pozycji menu. */
  type?: DropdownMenuItemType;
  /** Widoczna i dostępna etykieta pozycji albo grupy. */
  label?: string;
  /** Opcjonalna nazwa ikony PeaUI. */
  icon?: string;
  /** Wizualna podpowiedź skrótu; komponent nie rejestruje skrótu globalnie. */
  shortcut?: string;
  /** Wyłącza aktywację i pomija pozycję w nawigacji klawiaturą. */
  disabled?: boolean;
  /** Kontrolowany stan pozycji checkbox lub radio. */
  checked?: boolean;
  /** Wartość przekazywana przez event valueChange. */
  value?: unknown;
  /** Nazwa logicznej grupy radio. */
  group?: string;
  /** Pozycje grupy albo podmenu; obsługiwane są maksymalnie dwa poziomy menu. */
  children?: DropdownMenuItem[];
  /** Wariant wizualny zwykły lub destrukcyjny. */
  variant?: DropdownMenuItemVariant;
  /** Nadpisuje globalną politykę zamknięcia dla tej pozycji. */
  closeOnSelect?: boolean;
  /** Dane domenowe zwracane bez modyfikacji w eventach. */
  metadata?: unknown;
}

export interface DropdownMenuProps {
  /** Deklaratywna kolekcja akcji, grup, separatorów i podmenu. */
  items?: DropdownMenuItem[];
  /** Wyłącza trigger i wszystkie akcje menu. */
  disabled?: boolean;
  /** Strona triggera zachowywana także przy kolizji; powierzchnia jest ograniczana do viewportu. */
  placement?: DropdownMenuPlacement;
  /** Wyrównanie menu na osi poprzecznej. */
  align?: DropdownMenuAlign;
  /** Odstęp menu od triggera w pikselach. */
  offset?: number;
  /** Zamyka menu po zwykłej akcji; checkbox i radio pozostają domyślnie otwarte. */
  closeOnSelect?: boolean;
  /** Pozwala zapętlać nawigację strzałkami między skrajnymi pozycjami. */
  loop?: boolean;
  /** Gęstość pionowa pozycji menu. */
  density?: DropdownMenuDensity;
  /** Dostępna nazwa powierzchni menu. */
  ariaLabel?: string;
  /** Widoczna i dostępna etykieta domyślnego triggera. */
  triggerLabel?: string;
  /** Pokazuje stan ładowania zamiast pozycji. */
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
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
  type CSSProperties,
} from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';
import DropdownMenuItemRow from './DropdownMenuItemRow.vue';
import {
  calculateRootMenuPosition,
  calculateSubmenuPosition,
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
  typeaheadMenuIndex,
  type MenuViewport,
  type MenuNavigableItem,
} from './menu.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  items: () => [],
  disabled: false,
  placement: 'bottom',
  align: 'start',
  offset: 8,
  closeOnSelect: true,
  loop: true,
  density: 'comfortable',
  ariaLabel: 'Menu akcji',
  triggerLabel: 'Otwórz menu',
  loading: false,
});

const open = defineModel<boolean>('open', {
  default: false,
  /** Kontroluje stan otwarcia menu. */
});

const emit = defineEmits<{
  /** Emitowane po aktywowaniu dostępnej pozycji. */
  (event: 'select', item: DropdownMenuItem, path: number[]): void;
  /** Emitowane po zmianie intencji pozycji checkbox lub radio. */
  (event: 'checkedChange', item: DropdownMenuItem, checked: boolean, path: number[]): void;
  /** Emitowane po wyborze pozycji posiadającej wartość. */
  (event: 'valueChange', item: DropdownMenuItem, value: unknown, path: number[]): void;
  /** Emitowane przy każdej intencji otwarcia lub zamknięcia. */
  (event: 'openChange', value: boolean): void;
  /** Emitowane po zamknięciu klawiszem Escape. */
  (event: 'escape'): void;
  /** Emitowane po zamknięciu kliknięciem poza komponentem. */
  (event: 'outsideClick'): void;
}>();

defineSlots<{
  /** Alternatywny trigger używany przez light-DOM Web Component. */
  default?(props: { open: boolean; disabled: boolean }): unknown;
  /** Renderuje trigger; interaktywny element otrzymuje aria-haspopup, aria-expanded i aria-controls. */
  trigger?(props: { open: boolean; disabled: boolean }): unknown;
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

type NativePopoverElement = HTMLDivElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

const FOCUSABLE_TRIGGER =
  'button, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role="button"], [tabindex]:not([tabindex="-1"])';
const TYPEAHEAD_TIMEOUT = 500;
const SUBMENU_HOVER_DELAY = 180;
const classNameComponent = `${UIKIT_NAME}-dropdown-menu`;
const attrs = useAttrs();
const slots = useSlots();
const instanceId = useId().replace(/:/g, '');
const menuId = `${classNameComponent}-${instanceId}`;
const supportsPopover =
  typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
const root = ref<HTMLElement>();
const defaultTrigger = ref<HTMLButtonElement>();
const triggerHost = ref<HTMLElement>();
const menu = ref<NativePopoverElement>();
const submenuOpenKey = ref('');
const menuStyle = ref<CSSProperties>({});
const submenuStyle = ref<CSSProperties>({});
const resolvedPlacement = ref<DropdownMenuPlacement>(props.placement);
const pendingFocus = ref<'first' | 'last'>('first');
const typeahead = ref('');
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
let submenuTimer: ReturnType<typeof setTimeout> | undefined;
let frame: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let triggerObserver: MutationObserver | undefined;
let managedTrigger: HTMLElement | undefined;
let managedTriggerOriginals: Map<string, string | null> | undefined;

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--density-${props.density}`,
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
const hasTriggerContent = computed(() => Boolean(slots.trigger || slots.default));

function pathKey(path: number[]): string {
  return path.join('-');
}

function itemType(item: DropdownMenuItem): DropdownMenuItemType {
  return item.type ?? (item.children?.length ? 'submenu' : 'item');
}

function clearTimers(): void {
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  if (submenuTimer) clearTimeout(submenuTimer);
  typeaheadTimer = undefined;
  submenuTimer = undefined;
}

function restoreManagedTrigger(): void {
  if (!managedTrigger || !managedTriggerOriginals) return;
  for (const [name, value] of managedTriggerOriginals) {
    if (value === null) managedTrigger.removeAttribute(name);
    else managedTrigger.setAttribute(name, value);
  }
  managedTrigger = undefined;
  managedTriggerOriginals = undefined;
}

function syncManagedTrigger(): void {
  if (!hasTriggerContent.value || !triggerHost.value) {
    restoreManagedTrigger();
    return;
  }

  const target =
    triggerHost.value.querySelector<HTMLElement>(FOCUSABLE_TRIGGER) ?? triggerHost.value;
  if (managedTrigger !== target) {
    restoreManagedTrigger();
    managedTrigger = target;
    managedTriggerOriginals = new Map();
    for (const name of [
      'role',
      'tabindex',
      'aria-haspopup',
      'aria-expanded',
      'aria-controls',
      'aria-disabled',
      'aria-label',
      'disabled',
    ]) {
      managedTriggerOriginals.set(name, target.getAttribute(name));
    }
  }

  if (target === triggerHost.value) {
    target.setAttribute('role', 'button');
    target.setAttribute('tabindex', props.disabled ? '-1' : '0');
  }
  target.setAttribute('aria-haspopup', 'menu');
  target.setAttribute('aria-expanded', String(open.value));
  target.setAttribute('aria-controls', menuId);
  if (props.disabled) {
    target.setAttribute('aria-disabled', 'true');
    if (target instanceof HTMLButtonElement) target.disabled = true;
  } else {
    const originalAriaDisabled = managedTriggerOriginals?.get('aria-disabled');
    if (originalAriaDisabled === null) target.removeAttribute('aria-disabled');
    else if (originalAriaDisabled !== undefined)
      target.setAttribute('aria-disabled', originalAriaDisabled);
    if (target instanceof HTMLButtonElement) {
      target.disabled = managedTriggerOriginals?.get('disabled') !== null;
    }
  }
  if (
    !target.getAttribute('aria-label') &&
    !target.getAttribute('aria-labelledby') &&
    !target.textContent?.trim()
  ) {
    target.setAttribute('aria-label', props.triggerLabel);
  }
}

function triggerElement(): HTMLElement | undefined {
  return managedTrigger ?? defaultTrigger.value ?? triggerHost.value;
}

function navigableButtons(parentKey = 'root'): HTMLButtonElement[] {
  if (!menu.value) return [];

  return Array.from(
    menu.value.querySelectorAll<HTMLButtonElement>(`[data-menu-parent="${parentKey}"]`),
  );
}

function enabledNavigation(
  parentKey = 'root',
): Array<MenuNavigableItem & { button: HTMLButtonElement }> {
  return navigableButtons(parentKey).map((button) => ({
    button,
    disabled: button.getAttribute('aria-disabled') === 'true',
    label: button.dataset.menuLabel,
  }));
}

function focusEdge(parentKey: string, edge: 'first' | 'last'): void {
  const items = enabledNavigation(parentKey);
  const index = edgeEnabledMenuIndex(items, edge);

  if (index >= 0) items[index]?.button.focus();
  else menu.value?.focus();
}

function focusRelative(parentKey: string, current: HTMLButtonElement, direction: 1 | -1): void {
  const items = enabledNavigation(parentKey);
  const index = items.findIndex(({ button }) => button === current);
  const nextIndex = nextEnabledMenuIndex(items, index, direction, props.loop);

  if (nextIndex >= 0) items[nextIndex]?.button.focus();
}

function showPopover(): void {
  const surface = menu.value;
  if (!surface?.showPopover) return;
  try {
    surface.showPopover();
  } catch {
    // It can already be open after an externally controlled update.
  }
}

function hidePopover(): void {
  const surface = menu.value;
  if (!surface?.hidePopover) return;
  try {
    surface.hidePopover();
  } catch {
    // It can already be closed by the browser.
  }
}

function requestOpen(value: boolean, focus: 'first' | 'last' = 'first'): void {
  if (value && props.disabled) return;
  pendingFocus.value = focus;
  if (open.value !== value) open.value = value;
  emit('openChange', value);
}

function handleTriggerClick(event?: MouseEvent): void {
  if (props.disabled || event?.defaultPrevented) return;
  requestOpen(!open.value, 'first');
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (props.disabled) return;

  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    requestOpen(true, event.key === 'ArrowUp' ? 'last' : 'first');
  } else if (event.key === 'Escape' && open.value) {
    event.preventDefault();
    closeFromEscape();
  } else if (event.key === 'Tab' && open.value) {
    closeMenu(false);
  }
}

function closeMenu(restoreFocus = false): void {
  submenuOpenKey.value = '';
  requestOpen(false);
  if (restoreFocus) void nextTick(() => triggerElement()?.focus());
}

function closeFromEscape(): void {
  closeMenu(true);
  emit('escape');
}

function handleItemFocus(item: DropdownMenuItem, path: number[]): void {
  const focusedKey = pathKey(path);
  if (
    submenuOpenKey.value &&
    focusedKey !== submenuOpenKey.value &&
    !focusedKey.startsWith(`${submenuOpenKey.value}-`) &&
    itemType(item) !== 'submenu'
  ) {
    submenuOpenKey.value = '';
  }
}

function openSubmenu(item: DropdownMenuItem, path: number[], focusFirst = false): void {
  if (item.disabled || !item.children?.length || path.length > 2) return;
  submenuOpenKey.value = pathKey(path);
  void nextTick(() => {
    positionSubmenu(pathKey(path));
    if (focusFirst) focusEdge(pathKey(path), 'first');
  });
}

function activateItem(item: DropdownMenuItem, path: number[]): void {
  if (props.disabled || item.disabled) return;
  const type = itemType(item);

  if (type === 'submenu') {
    if (path.length > 2) return;
    openSubmenu(item, path, true);
    return;
  }
  if (type === 'separator' || type === 'group') return;

  emit('select', item, path);
  if (type === 'checkbox') emit('checkedChange', item, !item.checked, path);
  if (type === 'radio') emit('checkedChange', item, true, path);
  if (item.value !== undefined) emit('valueChange', item, item.value, path);

  const shouldClose =
    item.closeOnSelect ?? (type === 'checkbox' || type === 'radio' ? false : props.closeOnSelect);
  if (shouldClose) closeMenu(true);
}

function handleItemKeydown(
  event: KeyboardEvent,
  item: DropdownMenuItem,
  path: number[],
  parentKey: string,
): void {
  const current = event.currentTarget as HTMLButtonElement;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    focusRelative(parentKey, current, event.key === 'ArrowDown' ? 1 : -1);
    return;
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    focusEdge(parentKey, event.key === 'Home' ? 'first' : 'last');
    return;
  }
  if (event.key === 'ArrowRight' && itemType(item) === 'submenu') {
    event.preventDefault();
    openSubmenu(item, path, true);
    return;
  }
  if (event.key === 'ArrowLeft' && parentKey !== 'root') {
    event.preventDefault();
    submenuOpenKey.value = '';
    menu.value?.querySelector<HTMLButtonElement>(`[data-menu-path="${parentKey}"]`)?.focus();
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    if (parentKey !== 'root') {
      submenuOpenKey.value = '';
      menu.value?.querySelector<HTMLButtonElement>(`[data-menu-path="${parentKey}"]`)?.focus();
    } else closeFromEscape();
    return;
  }
  if (event.key === 'Tab') {
    closeMenu(false);
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    activateItem(item, path);
    return;
  }
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

  typeahead.value += event.key;
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  typeaheadTimer = setTimeout(() => (typeahead.value = ''), TYPEAHEAD_TIMEOUT);
  const items = enabledNavigation(parentKey);
  const currentIndex = items.findIndex(({ button }) => button === current);
  const index = typeaheadMenuIndex(items, typeahead.value, currentIndex);
  if (index >= 0) {
    event.preventDefault();
    items[index]?.button.focus();
  }
}

function handleItemPointerEnter(item: DropdownMenuItem, path: number[]): void {
  if (submenuTimer) clearTimeout(submenuTimer);
  if (itemType(item) !== 'submenu' || item.disabled || !item.children?.length) return;
  submenuTimer = setTimeout(() => openSubmenu(item, path), SUBMENU_HOVER_DELAY);
}

function handleItemPointerLeave(item: DropdownMenuItem, path: number[]): void {
  if (itemType(item) !== 'submenu' || submenuOpenKey.value === pathKey(path)) return;
  if (submenuTimer) clearTimeout(submenuTimer);
}

function positionRootMenu(): void {
  const trigger = triggerElement();
  const surface = menu.value;
  if (!trigger || !surface || !open.value) return;

  const position = calculateRootMenuPosition({
    align: props.align,
    offset: props.offset,
    placement: props.placement,
    surface: surface.getBoundingClientRect(),
    trigger: trigger.getBoundingClientRect(),
    viewport: currentViewport(),
  });
  resolvedPlacement.value = position.placement;
  menuStyle.value = {
    left: `${position.left}px`,
    maxHeight: `${position.maxHeight}px`,
    maxWidth: `${position.maxWidth}px`,
    minWidth: `${position.minWidth}px`,
    top: `${position.top}px`,
  };
}

function currentViewport(): MenuViewport {
  const viewport = window.visualViewport;

  return {
    height: viewport?.height ?? window.innerHeight,
    left: viewport?.offsetLeft ?? 0,
    top: viewport?.offsetTop ?? 0,
    width: viewport?.width ?? window.innerWidth,
  };
}

function positionSubmenu(key: string): void {
  const parent = menu.value?.querySelector<HTMLElement>(`[data-menu-path="${key}"]`);
  const submenu = menu.value?.querySelector<HTMLElement>(`[data-submenu-for="${key}"]`);
  if (!parent || !submenu) return;
  const position = calculateSubmenuPosition({
    parent: parent.getBoundingClientRect(),
    surface: submenu.getBoundingClientRect(),
    viewport: currentViewport(),
  });
  submenuStyle.value = {
    left: `${position.left}px`,
    maxHeight: `${position.maxHeight}px`,
    maxWidth: `${position.maxWidth}px`,
    minWidth: `${position.minWidth}px`,
    top: `${position.top}px`,
  };
}

function schedulePosition(): void {
  if (frame !== undefined) cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    frame = undefined;
    positionRootMenu();
    if (submenuOpenKey.value) positionSubmenu(submenuOpenKey.value);
  });
}

defineExpose({
  /** Ponownie oblicza pozycję otwartej powierzchni względem aktualnego triggera. */
  reposition: schedulePosition,
});

function handleDocumentPointerDown(event: PointerEvent): void {
  if (
    !open.value ||
    root.value?.contains(event.target as Node) ||
    menu.value?.contains(event.target as Node)
  )
    return;
  closeMenu(false);
  emit('outsideClick');
}

function addOpenListeners(): void {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  window.addEventListener('resize', schedulePosition);
  window.addEventListener('scroll', schedulePosition, true);
  window.visualViewport?.addEventListener('resize', schedulePosition);
  window.visualViewport?.addEventListener('scroll', schedulePosition);
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(schedulePosition);
    if (triggerElement()) resizeObserver.observe(triggerElement() as HTMLElement);
    if (menu.value) resizeObserver.observe(menu.value);
  }
}

function removeOpenListeners(): void {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
  window.removeEventListener('resize', schedulePosition);
  window.removeEventListener('scroll', schedulePosition, true);
  window.visualViewport?.removeEventListener('resize', schedulePosition);
  window.visualViewport?.removeEventListener('scroll', schedulePosition);
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  if (frame !== undefined) cancelAnimationFrame(frame);
  frame = undefined;
}

watch(
  () => [open.value, props.disabled, props.triggerLabel],
  () => void nextTick(syncManagedTrigger),
);
watch(() => [props.placement, props.align, props.offset], schedulePosition);
watch(open, (isOpen) => {
  if (isOpen && props.disabled) {
    requestOpen(false);
    return;
  }
  if (isOpen) {
    void nextTick(() => {
      showPopover();
      schedulePosition();
      addOpenListeners();
      focusEdge('root', pendingFocus.value);
    });
  } else {
    hidePopover();
    removeOpenListeners();
    submenuOpenKey.value = '';
  }
});
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && open.value) closeMenu(false);
  },
);

onMounted(() => {
  void nextTick(() => {
    syncManagedTrigger();
    if (hasTriggerContent.value && triggerHost.value && typeof MutationObserver !== 'undefined') {
      triggerObserver = new MutationObserver(syncManagedTrigger);
      triggerObserver.observe(triggerHost.value, { childList: true, subtree: true });
    }
  });
  if (open.value) {
    showPopover();
    schedulePosition();
    addOpenListeners();
    focusEdge('root', pendingFocus.value);
  }
});
onBeforeUnmount(() => {
  clearTimers();
  removeOpenListeners();
  triggerObserver?.disconnect();
  restoreManagedTrigger();
});
</script>

<template>
  <span ref="root" v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <span
      v-if="hasTriggerContent"
      ref="triggerHost"
      :class="`${classNameComponent}__trigger-host`"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger" :open="open" :disabled="props.disabled">
        <slot :open="open" :disabled="props.disabled" />
      </slot>
    </span>
    <button
      v-else
      ref="defaultTrigger"
      type="button"
      :class="`${classNameComponent}__trigger`"
      :disabled="props.disabled"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      {{ props.triggerLabel }}
    </button>

    <div
      v-show="open"
      :id="menuId"
      ref="menu"
      :class="`${classNameComponent}__surface`"
      :style="menuStyle"
      role="menu"
      tabindex="0"
      :aria-label="menuLabel"
      :aria-busy="props.loading || undefined"
      :data-align="props.align"
      :data-placement="resolvedPlacement"
      :data-testid="props.dataTestId ? `${props.dataTestId}-menu` : undefined"
      :popover="supportsPopover ? 'manual' : undefined"
    >
      <div
        v-if="props.loading"
        :class="`${classNameComponent}__status`"
        role="menuitem"
        aria-disabled="true"
        aria-live="polite"
        tabindex="-1"
      >
        <slot name="loading">Ładowanie menu…</slot>
      </div>
      <div
        v-else-if="props.items.length === 0"
        :class="`${classNameComponent}__status`"
        role="menuitem"
        aria-disabled="true"
        tabindex="-1"
      >
        <slot name="empty">Brak dostępnych akcji</slot>
      </div>
      <ul v-else :class="`${classNameComponent}__list`" role="none">
        <template v-for="(item, index) in props.items" :key="item.id">
          <li
            v-if="itemType(item) === 'separator'"
            :class="`${classNameComponent}__separator`"
            role="separator"
          />
          <li
            v-else-if="itemType(item) === 'group'"
            :class="`${classNameComponent}__group-row`"
            role="none"
          >
            <div
              :class="`${classNameComponent}__group`"
              role="group"
              :aria-labelledby="`${menuId}-group-${index}`"
            >
              <div :id="`${menuId}-group-${index}`" :class="`${classNameComponent}__group-label`">
                <slot name="group-label" :item="item" :path="[index]">{{ item.label }}</slot>
              </div>
              <ul :class="`${classNameComponent}__list`" role="none">
                <template v-for="(child, childIndex) in item.children" :key="child.id">
                  <li
                    v-if="itemType(child) === 'separator'"
                    :class="`${classNameComponent}__separator`"
                    role="separator"
                  />
                  <DropdownMenuItemRow
                    v-else
                    :item="child"
                    :menu-id="menuId"
                    :path="[index, childIndex]"
                    parent-key="root"
                    :disabled="props.disabled"
                    :submenu-open-key="submenuOpenKey"
                    :submenu-style="submenuStyle"
                    :data-test-id="props.dataTestId"
                    @activate="activateItem"
                    @focus="handleItemFocus"
                    @keydown="handleItemKeydown"
                    @pointerenter="handleItemPointerEnter"
                    @pointerleave="handleItemPointerLeave"
                  >
                    <template #item="slotProps"
                      ><slot name="item" v-bind="slotProps">{{
                        slotProps.item.label
                      }}</slot></template
                    >
                    <template #item-icon="slotProps">
                      <slot name="item-icon" v-bind="slotProps">
                        <SvgIcon v-if="slotProps.item.icon" :name="slotProps.item.icon" />
                      </slot>
                    </template>
                    <template #item-shortcut="slotProps"
                      ><slot name="item-shortcut" v-bind="slotProps">{{
                        slotProps.item.shortcut
                      }}</slot></template
                    >
                  </DropdownMenuItemRow>
                </template>
              </ul>
            </div>
          </li>
          <DropdownMenuItemRow
            v-else
            :item="item"
            :menu-id="menuId"
            :path="[index]"
            parent-key="root"
            :disabled="props.disabled"
            :submenu-open-key="submenuOpenKey"
            :submenu-style="submenuStyle"
            :data-test-id="props.dataTestId"
            @activate="activateItem"
            @focus="handleItemFocus"
            @keydown="handleItemKeydown"
            @pointerenter="handleItemPointerEnter"
            @pointerleave="handleItemPointerLeave"
          >
            <template #item="slotProps"
              ><slot name="item" v-bind="slotProps">{{ slotProps.item.label }}</slot></template
            >
            <template #item-icon="slotProps">
              <slot name="item-icon" v-bind="slotProps">
                <SvgIcon v-if="slotProps.item.icon" :name="slotProps.item.icon" />
              </slot>
            </template>
            <template #item-shortcut="slotProps"
              ><slot name="item-shortcut" v-bind="slotProps">{{
                slotProps.item.shortcut
              }}</slot></template
            >
          </DropdownMenuItemRow>
        </template>
      </ul>
    </div>
  </span>
</template>
