<script setup lang="ts">
import SvgIcon from '../../basic/SvgIcon/index.vue';
import type { CSSProperties } from 'vue';

import type { DropdownMenuItem } from './index.vue';

defineOptions({ name: 'PeauiDropdownMenuItemRow' });

const props = defineProps<{
  item: DropdownMenuItem;
  menuId: string;
  path: number[];
  parentKey: string;
  disabled: boolean;
  submenuOpenKey: string;
  submenuStyle?: CSSProperties;
  depth?: number;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  activate: [item: DropdownMenuItem, path: number[]];
  focus: [item: DropdownMenuItem, path: number[]];
  keydown: [event: KeyboardEvent, item: DropdownMenuItem, path: number[], parentKey: string];
  pointerenter: [item: DropdownMenuItem, path: number[]];
  pointerleave: [item: DropdownMenuItem, path: number[]];
}>();

defineSlots<{
  item?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  'item-icon'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  'item-shortcut'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
}>();

const root = 'peaui-dropdown-menu';

function pathKey(path: number[]): string {
  return path.join('-');
}

function normalizedType(item: DropdownMenuItem): DropdownMenuItem['type'] {
  return item.type ?? (item.children?.length ? 'submenu' : 'item');
}

function isCheckable(item: DropdownMenuItem): boolean {
  const type = normalizedType(item);

  return type === 'checkbox' || type === 'radio';
}

function hasAvailableSubmenu(item: DropdownMenuItem): boolean {
  return (
    (props.depth ?? 0) === 0 && normalizedType(item) === 'submenu' && Boolean(item.children?.length)
  );
}

function roleFor(item: DropdownMenuItem): 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' {
  const type = normalizedType(item);

  if (type === 'checkbox') return 'menuitemcheckbox';
  if (type === 'radio') return 'menuitemradio';
  return 'menuitem';
}

function isEffectivelyDisabled(item: DropdownMenuItem): boolean {
  return (
    props.disabled ||
    item.disabled === true ||
    ((props.depth ?? 0) > 0 && normalizedType(item) === 'submenu')
  );
}

function forwardActivate(item: DropdownMenuItem, path: number[]): void {
  emit('activate', item, path);
}

function forwardFocus(item: DropdownMenuItem, path: number[]): void {
  emit('focus', item, path);
}

function forwardKeydown(
  event: KeyboardEvent,
  item: DropdownMenuItem,
  path: number[],
  parentKey: string,
): void {
  emit('keydown', event, item, path, parentKey);
}

function forwardPointerEnter(item: DropdownMenuItem, path: number[]): void {
  emit('pointerenter', item, path);
}

function forwardPointerLeave(item: DropdownMenuItem, path: number[]): void {
  emit('pointerleave', item, path);
}
</script>

<template>
  <li role="none" :class="`${root}__row`">
    <button
      type="button"
      :class="[
        `${root}__item`,
        `${root}__item--${item.variant ?? 'default'}`,
        { [`${root}__item--submenu`]: hasAvailableSubmenu(item) },
      ]"
      :role="roleFor(item)"
      tabindex="-1"
      :aria-disabled="isEffectivelyDisabled(item) || undefined"
      :aria-checked="isCheckable(item) ? Boolean(item.checked) : undefined"
      :aria-haspopup="hasAvailableSubmenu(item) ? 'menu' : undefined"
      :aria-expanded="hasAvailableSubmenu(item) ? submenuOpenKey === pathKey(path) : undefined"
      :aria-controls="hasAvailableSubmenu(item) ? `${menuId}-submenu-${pathKey(path)}` : undefined"
      :data-menu-parent="parentKey"
      :data-menu-label="item.label ?? ''"
      :data-menu-path="pathKey(path)"
      :data-testid="dataTestId ? `${dataTestId}-item-${pathKey(path)}` : undefined"
      @click="emit('activate', item, path)"
      @focus="emit('focus', item, path)"
      @keydown="emit('keydown', $event, item, path, parentKey)"
      @pointerenter="emit('pointerenter', item, path)"
      @pointerleave="emit('pointerleave', item, path)"
    >
      <span :class="`${root}__indicator`" aria-hidden="true">
        <SvgIcon v-if="isCheckable(item) && item.checked" name="check" />
      </span>

      <span :class="`${root}__icon`" aria-hidden="true">
        <slot name="item-icon" :item="item" :path="path">
          <SvgIcon v-if="item.icon" :name="item.icon" />
        </slot>
      </span>

      <span :class="`${root}__label`">
        <slot name="item" :item="item" :path="path">{{ item.label }}</slot>
      </span>

      <span
        v-if="item.shortcut || $slots['item-shortcut']"
        :class="`${root}__shortcut`"
        aria-hidden="true"
      >
        <slot name="item-shortcut" :item="item" :path="path">{{ item.shortcut }}</slot>
      </span>

      <SvgIcon
        v-if="hasAvailableSubmenu(item)"
        name="arrowRight"
        :class="`${root}__submenu-arrow`"
        aria-hidden="true"
      />
    </button>

    <div
      v-if="hasAvailableSubmenu(item)"
      v-show="submenuOpenKey === pathKey(path)"
      :id="`${menuId}-submenu-${pathKey(path)}`"
      :class="`${root}__surface ${root}__submenu`"
      :style="submenuStyle"
      role="menu"
      :aria-label="item.label"
      :data-submenu-for="pathKey(path)"
    >
      <ul :class="`${root}__list`" role="none">
        <template v-for="(child, childIndex) in item.children" :key="child.id">
          <li v-if="child.type === 'separator'" :class="`${root}__separator`" role="separator" />
          <DropdownMenuItemRow
            v-else
            :item="child"
            :menu-id="menuId"
            :path="[...path, childIndex]"
            :parent-key="pathKey(path)"
            :disabled="disabled"
            :submenu-open-key="submenuOpenKey"
            :depth="(depth ?? 0) + 1"
            :data-test-id="dataTestId"
            @activate="forwardActivate"
            @focus="forwardFocus"
            @keydown="forwardKeydown"
            @pointerenter="forwardPointerEnter"
            @pointerleave="forwardPointerLeave"
          >
            <template #item="slotProps">
              <slot name="item" v-bind="slotProps">{{ slotProps.item.label }}</slot>
            </template>
            <template #item-icon="slotProps">
              <slot name="item-icon" v-bind="slotProps">
                <SvgIcon v-if="slotProps.item.icon" :name="slotProps.item.icon" />
              </slot>
            </template>
            <template #item-shortcut="slotProps">
              <slot name="item-shortcut" v-bind="slotProps">{{ slotProps.item.shortcut }}</slot>
            </template>
          </DropdownMenuItemRow>
        </template>
      </ul>
    </div>
  </li>
</template>
