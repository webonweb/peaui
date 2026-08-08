<script lang="ts">
import type { DropdownMenuItem } from '../../navigation/DropdownMenu/index.vue';

export type SplitButtonMenuAlign = 'start' | 'end';
export type SplitButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
export type SplitButtonVariant = 'primary' | 'secondary' | 'danger';
export type SplitButtonType = 'button' | 'submit' | 'reset';

export interface SplitButtonProps {
  /** Widoczna etykieta oraz awaryjna dostępna nazwa głównej akcji. */
  label: string;
  /** Akcje alternatywne renderowane przez DropdownMenu. */
  items?: DropdownMenuItem[];
  /** Opcjonalna nazwa ikony PeaUI poprzedzającej etykietę. */
  icon?: string;
  /** Wariant kolorystyczny obu części kontrolki. */
  variant?: SplitButtonVariant;
  /** Rozmiar zgodny z ButtonAction. */
  size?: SplitButtonSize;
  /** Natywny typ przycisku głównej akcji. */
  type?: SplitButtonType;
  /** Wyrównanie powierzchni menu do początku lub końca kontrolki. */
  menuAlign?: SplitButtonMenuAlign;
  /** Wyłącza obie części kontrolki. */
  disabled?: boolean;
  /** Wyłącza wyłącznie główną akcję. */
  primaryDisabled?: boolean;
  /** Wyłącza wyłącznie trigger menu i zamyka otwarte menu. */
  menuDisabled?: boolean;
  /** Blokuje główną akcję i pokazuje jej stan zajętości; menu pozostaje niezależne. */
  loading?: boolean;
  /** Pokazuje dostępny stan ładowania wewnątrz otwartego menu. */
  menuLoading?: boolean;
  /** Dostępna nazwa grupy dwóch przycisków. */
  ariaLabel?: string;
  /** Dostępna nazwa przycisku otwierającego menu. */
  menuAriaLabel?: string;
  /** Tekst statusu głównej akcji przekazywany technologiom asystującym. */
  loadingLabel?: string;
  /** Tekst dostępnego stanu ładowania menu. */
  menuLoadingLabel?: string;
  /** Tekst pustego stanu menu. */
  emptyLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}

export type SplitButtonItem = DropdownMenuItem;
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed } from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';
import ButtonAction from '../ButtonAction/index.vue';
import DropdownMenu from '../../navigation/DropdownMenu/index.vue';

const props = withDefaults(defineProps<SplitButtonProps>(), {
  items: () => [],
  variant: 'primary',
  size: 'm',
  type: 'button',
  menuAlign: 'end',
  disabled: false,
  primaryDisabled: false,
  menuDisabled: false,
  loading: false,
  menuLoading: false,
  loadingLabel: 'Trwa wykonywanie głównej akcji',
  menuLoadingLabel: 'Ładowanie menu…',
  emptyLabel: 'Brak dostępnych akcji',
});

const open = defineModel<boolean>('open', {
  default: false,
  /** Kontroluje stan otwarcia menu alternatywnych akcji. */
});

const emit = defineEmits<{
  /** Emitowane wyłącznie po aktywowaniu lewej, głównej części. */
  (event: 'primaryClick', nativeEvent: MouseEvent): void;
  /** Emitowane po wyborze dostępnej pozycji menu. */
  (event: 'select', item: DropdownMenuItem, path: number[]): void;
}>();

defineSlots<{
  /** Zastępuje widoczną etykietę głównej akcji. */
  default?(): unknown;
  /** Zastępuje widoczną etykietę głównej akcji. */
  label?(): unknown;
  /** Zastępuje opcjonalną ikonę głównej akcji. */
  icon?(): unknown;
  /** Zastępuje dekoracyjną ikonę triggera menu. */
  'menu-trigger-icon'?(props: { open: boolean }): unknown;
  /** Renderuje treść pozycji wewnątrz zachowanego elementu menuitem. */
  'menu-item'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje dekoracyjną ikonę pozycji menu. */
  'menu-item-icon'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje wizualną podpowiedź skrótu pozycji menu. */
  'menu-item-shortcut'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje widoczną etykietę grupy menu. */
  'group-label'?(props: { item: DropdownMenuItem; path: number[] }): unknown;
  /** Renderuje pusty stan menu. */
  empty?(): unknown;
  /** Renderuje stan ładowania menu. */
  'menu-loading'?(): unknown;
}>();

const classNameComponent = `${UIKIT_NAME}-split-button`;
const primaryBlocked = computed(() => props.disabled || props.primaryDisabled || props.loading);
const menuBlocked = computed(() => props.disabled || props.menuDisabled);
const groupLabel = computed(() => props.ariaLabel?.trim() || props.label);
const menuLabel = computed(() => props.menuAriaLabel?.trim() || `Więcej opcji: ${props.label}`);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${props.variant}`,
  `${classNameComponent}--size-${props.size}`,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--primary-disabled`]: primaryBlocked.value,
    [`${classNameComponent}--menu-disabled`]: menuBlocked.value,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--menu-loading`]: props.menuLoading,
    [`${classNameComponent}--open`]: open.value,
  },
]);

function handlePrimaryClick(event: MouseEvent): void {
  if (primaryBlocked.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('primaryClick', event);
}

function handleSelect(item: DropdownMenuItem, path: number[]): void {
  emit('select', item, path);
}
</script>

<template>
  <div :class="rootClasses" role="group" :aria-label="groupLabel" :data-testid="props.dataTestId">
    <ButtonAction
      :class="`${classNameComponent}__primary`"
      :variant="props.variant"
      :size="props.size"
      :type="props.type"
      :disabled="primaryBlocked"
      :aria-label="props.label"
      :aria-busy="props.loading || undefined"
      :data-test-id="props.dataTestId ? `${props.dataTestId}-primary` : undefined"
      @click="handlePrimaryClick"
    >
      <span v-if="props.loading" :class="`${classNameComponent}__spinner`" aria-hidden="true" />
      <slot v-else name="icon">
        <SvgIcon
          v-if="props.icon"
          :class="`${classNameComponent}__primary-icon`"
          :name="props.icon"
        />
      </slot>
      <span :class="`${classNameComponent}__label`">
        <slot name="label"
          ><slot>{{ props.label }}</slot></slot
        >
      </span>
    </ButtonAction>
    <span v-if="props.loading" :class="`${classNameComponent}__status`" role="status">
      {{ props.loadingLabel }}
    </span>

    <DropdownMenu
      v-model:open="open"
      :class="`${classNameComponent}__menu`"
      :items="props.items"
      :disabled="menuBlocked"
      :loading="props.menuLoading"
      placement="bottom"
      :align="props.menuAlign"
      :aria-label="menuLabel"
      :data-test-id="props.dataTestId ? `${props.dataTestId}-dropdown` : undefined"
      @select="handleSelect"
    >
      <template #trigger="{ open: menuOpen }">
        <ButtonAction
          :class="`${classNameComponent}__trigger`"
          :variant="props.variant"
          :size="props.size"
          type="button"
          :disabled="menuBlocked"
          use-aria-label
          :aria-label="menuLabel"
          :aria-busy="props.menuLoading || undefined"
          :data-test-id="props.dataTestId ? `${props.dataTestId}-trigger` : undefined"
        >
          <span :class="`${classNameComponent}__trigger-icon`" aria-hidden="true">
            <slot name="menu-trigger-icon" :open="menuOpen">
              <SvgIcon name="arrowRounded" />
            </slot>
          </span>
        </ButtonAction>
      </template>
      <template #item="slotProps">
        <slot name="menu-item" v-bind="slotProps">{{ slotProps.item.label }}</slot>
      </template>
      <template #item-icon="slotProps">
        <slot name="menu-item-icon" v-bind="slotProps">
          <SvgIcon v-if="slotProps.item.icon" :name="slotProps.item.icon" />
        </slot>
      </template>
      <template #item-shortcut="slotProps">
        <slot name="menu-item-shortcut" v-bind="slotProps">{{ slotProps.item.shortcut }}</slot>
      </template>
      <template #group-label="slotProps">
        <slot name="group-label" v-bind="slotProps">{{ slotProps.item.label }}</slot>
      </template>
      <template #empty
        ><slot name="empty">{{ props.emptyLabel }}</slot></template
      >
      <template #loading>
        <slot name="menu-loading">{{ props.menuLoadingLabel }}</slot>
      </template>
    </DropdownMenu>
  </div>
</template>
