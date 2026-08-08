<script lang="ts">
import type { DropdownMenuItem } from '../DropdownMenu/index.vue';

export type MenuBarVariant = 'default' | 'compact';

export interface MenuBarMenu {
  /** Stabilny identyfikator sekcji, używany również przez v-model:openMenu. */
  id: string | number;
  /** Widoczna i dostępna nazwa triggera sekcji. */
  label: string;
  /** Opcjonalna nazwa dekoracyjnej ikony PeaUI. */
  icon?: string;
  /** Wyłącza sekcję i pomija ją w roving tabindex oraz typeahead. */
  disabled?: boolean;
  /** Pozycje współdzielące kontrakt i zachowanie DropdownMenu. */
  items: DropdownMenuItem[];
}

export interface MenuBarProps {
  /** Uporządkowane sekcje poziomego menu aplikacyjnego. */
  menus?: MenuBarMenu[];
  /** Wyłącza cały pasek i zamyka aktywną sekcję. */
  disabled?: boolean;
  /** Pozwala zapętlać fokus między pierwszym i ostatnim dostępnym triggerem. */
  loop?: boolean;
  /** Gęstość wizualna triggerów i pozycji menu. */
  variant?: MenuBarVariant;
  /** Dostępna nazwa elementu z rolą menubar. */
  ariaLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch, type CSSProperties } from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';
import DropdownMenu from '../DropdownMenu/index.vue';
import {
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
  typeaheadMenuIndex,
} from '../DropdownMenu/menu.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuBarProps>(), {
  menus: () => [],
  disabled: false,
  loop: true,
  variant: 'default',
  ariaLabel: 'Menu aplikacji',
});

const openMenu = defineModel<string | number | null>('openMenu', {
  default: null,
  /** Identyfikator otwartej sekcji albo null, gdy żadna sekcja nie jest otwarta. */
});

const emit = defineEmits<{
  /** Emitowane po aktywowaniu pozycji wraz z sekcją nadrzędną. */
  (event: 'select', item: DropdownMenuItem, path: number[], menu: MenuBarMenu): void;
  /** Emitowane po przeniesieniu fokusu roving tabindex na inny trigger. */
  (event: 'focusChange', menu: MenuBarMenu, index: number): void;
  /** Przekazuje intencję zmiany pozycji checkbox lub radio. */
  (
    event: 'checkedChange',
    item: DropdownMenuItem,
    checked: boolean,
    path: number[],
    menu: MenuBarMenu,
  ): void;
  /** Przekazuje wartość wybranej pozycji wraz z sekcją nadrzędną. */
  (
    event: 'valueChange',
    item: DropdownMenuItem,
    value: unknown,
    path: number[],
    menu: MenuBarMenu,
  ): void;
}>();

defineSlots<{
  /** Renderuje zawartość triggera bez naruszania jego semantyki menuitem. */
  'menu-trigger'?(props: { menu: MenuBarMenu; open: boolean; disabled: boolean }): unknown;
  /** Renderuje treść pozycji wewnątrz zachowanego elementu menuitem. */
  item?(props: { item: DropdownMenuItem; path: number[]; menu: MenuBarMenu }): unknown;
  /** Renderuje widoczną etykietę grupy pozycji. */
  'group-label'?(props: { item: DropdownMenuItem; path: number[]; menu: MenuBarMenu }): unknown;
  /** Renderuje wizualną podpowiedź skrótu; komponent nie wykonuje skrótu globalnie. */
  shortcut?(props: { item: DropdownMenuItem; path: number[]; menu: MenuBarMenu }): unknown;
}>();

const TYPEAHEAD_TIMEOUT = 500;
const classNameComponent = `${UIKIT_NAME}-menu-bar`;
const attrs = useAttrs();
const root = ref<HTMLElement>();
const viewport = ref<HTMLElement>();
const activeIndex = ref(-1);
const activeMenuId = ref<string | number | null>(null);
const typeahead = ref('');
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.variant}`,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--open`]: openMenu.value !== null,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': attrsAriaLabel,
    'data-testid': attrsDataTestId,
    ...rest
  } = attrs;

  return {
    ...rest,
    'aria-label':
      typeof attrsAriaLabel === 'string' && attrsAriaLabel.trim()
        ? attrsAriaLabel
        : props.ariaLabel,
    'data-testid': props.dataTestId ?? attrsDataTestId,
  };
});
const navigationMenus = computed(() =>
  props.menus.map((menu) => ({
    disabled: props.disabled || menu.disabled === true,
    label: menu.label,
  })),
);

function menuDisabled(menu: MenuBarMenu): boolean {
  return props.disabled || menu.disabled === true;
}

function isOpen(menu: MenuBarMenu): boolean {
  return !menuDisabled(menu) && openMenu.value === menu.id;
}

function triggerAt(index: number): HTMLButtonElement | undefined {
  return (
    root.value?.querySelector<HTMLButtonElement>(`[data-menubar-index="${index}"]`) ?? undefined
  );
}

function keepTriggerVisible(trigger: HTMLElement): void {
  const scrollViewport = viewport.value;
  if (!scrollViewport || scrollViewport.scrollWidth <= scrollViewport.clientWidth) return;
  trigger.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}

function setActiveMenu(menu: MenuBarMenu, index: number, notify = true): void {
  const changed = activeMenuId.value !== menu.id;
  activeMenuId.value = menu.id;
  activeIndex.value = index;
  if (changed && notify) emit('focusChange', menu, index);
}

function focusMenu(index: number, preserveMenuMode = false): void {
  const menu = props.menus[index];
  if (!menu || index < 0 || menuDisabled(menu)) return;
  setActiveMenu(menu, index);
  const trigger = triggerAt(index);
  trigger?.focus({ preventScroll: true });
  if (trigger) keepTriggerVisible(trigger);
  if (preserveMenuMode) openMenu.value = menu.id;
}

function focusRelative(index: number, direction: 1 | -1, preserveMenuMode: boolean): void {
  const nextIndex = nextEnabledMenuIndex(navigationMenus.value, index, direction, props.loop);
  if (nextIndex >= 0) focusMenu(nextIndex, preserveMenuMode);
}

function focusEdge(edge: 'first' | 'last', preserveMenuMode: boolean): void {
  const index = edgeEnabledMenuIndex(navigationMenus.value, edge);
  if (index >= 0) focusMenu(index, preserveMenuMode);
}

function handleTriggerFocus(menu: MenuBarMenu, index: number): void {
  if (menuDisabled(menu)) return;
  setActiveMenu(menu, index);
  const trigger = triggerAt(index);
  if (trigger) keepTriggerVisible(trigger);
}

function handleTriggerPointerEnter(menu: MenuBarMenu): void {
  if (openMenu.value === null || menuDisabled(menu) || openMenu.value === menu.id) return;
  openMenu.value = menu.id;
}

function handleOpenChange(menu: MenuBarMenu, index: number, value: boolean): void {
  if (value) {
    if (menuDisabled(menu)) return;
    setActiveMenu(menu, index, false);
    openMenu.value = menu.id;
  } else if (openMenu.value === menu.id) {
    openMenu.value = null;
  }
}

function handleTypeahead(event: KeyboardEvent, currentIndex: number): void {
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
  typeahead.value += event.key;
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  typeaheadTimer = setTimeout(() => (typeahead.value = ''), TYPEAHEAD_TIMEOUT);
  const index = typeaheadMenuIndex(navigationMenus.value, typeahead.value, currentIndex);
  if (index >= 0) {
    event.preventDefault();
    focusMenu(index, openMenu.value !== null);
  }
}

function handleMenubarKeydown(event: KeyboardEvent): void {
  if (props.disabled) return;
  const target = event.target as HTMLElement;
  const trigger = target.closest<HTMLElement>('[data-menubar-index]');
  const rootItem = target.closest<HTMLElement>('[data-menu-parent="root"]');
  const nestedItem = target.closest<HTMLElement>(
    '[data-menu-parent]:not([data-menu-parent="root"])',
  );
  const menuIndexValue = trigger?.dataset.menubarIndex;
  const menuIndex = menuIndexValue === undefined ? activeIndex.value : Number(menuIndexValue);
  const preserveMenuMode = openMenu.value !== null;

  if (trigger) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      focusRelative(menuIndex, event.key === 'ArrowRight' ? 1 : -1, preserveMenuMode);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      focusEdge(event.key === 'Home' ? 'first' : 'last', preserveMenuMode);
      return;
    }
    handleTypeahead(event, menuIndex);
    return;
  }

  if (!rootItem || nestedItem) return;
  if (event.key === 'ArrowRight' && rootItem.getAttribute('aria-haspopup') === 'menu') return;
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  event.stopPropagation();
  focusRelative(activeIndex.value, event.key === 'ArrowRight' ? 1 : -1, true);
}

function handleSelect(menu: MenuBarMenu, item: DropdownMenuItem, path: number[]): void {
  emit('select', item, path, menu);
}

function handleCheckedChange(
  menu: MenuBarMenu,
  item: DropdownMenuItem,
  checked: boolean,
  path: number[],
): void {
  emit('checkedChange', item, checked, path, menu);
}

function handleValueChange(
  menu: MenuBarMenu,
  item: DropdownMenuItem,
  value: unknown,
  path: number[],
): void {
  emit('valueChange', item, value, path, menu);
}

watch(
  () => [
    props.disabled,
    props.menus.map((menu) => ({ disabled: menu.disabled === true, id: menu.id })),
  ],
  () => {
    const openIndex = props.menus.findIndex(
      (menu) => menu.id === openMenu.value && !menuDisabled(menu),
    );
    if (openMenu.value !== null && openIndex < 0) openMenu.value = null;

    const currentIndex = props.menus.findIndex(
      (menu) => menu.id === activeMenuId.value && !menuDisabled(menu),
    );
    if (currentIndex >= 0) {
      activeIndex.value = currentIndex;
      return;
    }
    const nextIndex = edgeEnabledMenuIndex(navigationMenus.value, 'first');
    activeIndex.value = nextIndex;
    activeMenuId.value = nextIndex >= 0 ? (props.menus[nextIndex]?.id ?? null) : null;
  },
  { immediate: true },
);

watch(openMenu, (value) => {
  if (value === null) return;
  const index = props.menus.findIndex((menu) => menu.id === value && !menuDisabled(menu));
  if (index < 0) {
    openMenu.value = null;
    return;
  }
  const menu = props.menus[index];
  if (menu) setActiveMenu(menu, index, false);
  void nextTick(() => {
    const trigger = triggerAt(index);
    if (trigger) keepTriggerVisible(trigger);
  });
});

onBeforeUnmount(() => {
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    role="menubar"
    aria-orientation="horizontal"
    @keydown.capture="handleMenubarKeydown"
  >
    <div ref="viewport" :class="`${classNameComponent}__viewport`">
      <div :class="`${classNameComponent}__list`">
        <DropdownMenu
          v-for="(menu, index) in props.menus"
          :key="menu.id"
          :items="menu.items"
          :open="isOpen(menu)"
          :disabled="menuDisabled(menu)"
          :loop="props.loop"
          :density="props.variant === 'compact' ? 'compact' : 'comfortable'"
          :aria-label="menu.label"
          :trigger-label="menu.label"
          placement="bottom"
          align="start"
          :offset="4"
          :data-test-id="props.dataTestId ? `${props.dataTestId}-menu-${menu.id}` : undefined"
          @update:open="handleOpenChange(menu, index, $event)"
          @select="(item, path) => handleSelect(menu, item, path)"
          @checked-change="(item, checked, path) => handleCheckedChange(menu, item, checked, path)"
          @value-change="(item, value, path) => handleValueChange(menu, item, value, path)"
        >
          <template #trigger="{ open, disabled }">
            <button
              type="button"
              :class="`${classNameComponent}__trigger`"
              role="menuitem"
              :tabindex="!disabled && index === activeIndex ? 0 : -1"
              :disabled="disabled"
              :aria-disabled="disabled || undefined"
              :data-menubar-index="index"
              :data-menubar-id="String(menu.id)"
              @focus="handleTriggerFocus(menu, index)"
              @pointerenter="handleTriggerPointerEnter(menu)"
            >
              <slot name="menu-trigger" :menu="menu" :open="open" :disabled="disabled">
                <SvgIcon
                  v-if="menu.icon"
                  :class="`${classNameComponent}__trigger-icon`"
                  :name="menu.icon"
                  aria-hidden="true"
                />
                <span :class="`${classNameComponent}__trigger-label`">{{ menu.label }}</span>
              </slot>
            </button>
          </template>
          <template #item="slotProps">
            <slot name="item" v-bind="slotProps" :menu="menu">{{ slotProps.item.label }}</slot>
          </template>
          <template #group-label="slotProps">
            <slot name="group-label" v-bind="slotProps" :menu="menu">{{
              slotProps.item.label
            }}</slot>
          </template>
          <template #item-shortcut="slotProps">
            <slot name="shortcut" v-bind="slotProps" :menu="menu">{{
              slotProps.item.shortcut
            }}</slot>
          </template>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
