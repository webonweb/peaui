<script setup lang="ts">
import { computed } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import { stripHtmlUsingDom } from '@/helpers/functions.helper';
import type { TableColumn } from '../index.vue';
import {
  buildTableTestId,
  getTableColumnIdentifier,
  TABLE_LIST_CLASS,
  TABLE_LIST_MIN_VISIBLE_COLUMNS,
} from '../shared';

const {
  as = 'th',
  columns = [],
  dataTestId,
  lockedState,
  canHideColumns = false,
  minimumVisibleColumns = TABLE_LIST_MIN_VISIBLE_COLUMNS,
} = defineProps<{
  as?: 'th' | 'div';
  columns?: TableColumn[];
  dataTestId?: string;
  lockedState?: Record<string, boolean | undefined>;
  minimumVisibleColumns?: number;
  canHideColumns?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:toggle:column', column: string, visible: boolean): void;
}>();

const visibleColumnsCount = computed(
  () => columns.filter((column) => (column.visible === undefined ? true : column.visible)).length,
);

const canManageColumns = computed(
  () =>
    columns.length > minimumVisibleColumns || columns.some((column) => column.visible === false),
);

const canShowColumnVisibilityManager = computed(() => canHideColumns && canManageColumns.value);

const popoverTestId = computed(() => buildTableTestId(dataTestId, 'column-visibility'));

function getCheckboxTestId(column: TableColumn): string | undefined {
  return buildTableTestId(
    dataTestId,
    'column-visibility-checkbox',
    getTableColumnIdentifier(column),
  );
}

function isColumnVisible(column: TableColumn): boolean {
  return column.visible === undefined ? true : column.visible;
}

function isColumnLocked(column: TableColumn): boolean {
  const identifier = getTableColumnIdentifier(column);

  return Boolean(lockedState?.[identifier] ?? lockedState?.[column.key]);
}

function isColumnToggleDisabled(column: TableColumn): boolean {
  if (!isColumnVisible(column)) {
    return false;
  }

  return isColumnLocked(column) || visibleColumnsCount.value <= minimumVisibleColumns;
}

function getColumnLabel(column: TableColumn): string {
  return stripHtmlUsingDom(column.label || column.key);
}

function handleToggleColumnVisibility(event: Event, column: TableColumn): void {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  emit('on:toggle:column', getTableColumnIdentifier(column), event.target.checked);
}
</script>

<template>
  <component
    :is="as"
    v-if="as === 'th' || canShowColumnVisibilityManager"
    :class="as === 'th' ? `${TABLE_LIST_CLASS}__actions-head-cell` : undefined"
    :data-testid="dataTestId"
    :scope="as === 'th' ? 'col' : undefined"
  >
    <PopoverOverlayer
      v-if="canShowColumnVisibilityManager"
      :class="`${TABLE_LIST_CLASS}__head-actions-popover-trigger`"
      :contentClass="`${TABLE_LIST_CLASS}__head-actions-popover`"
      :dataTestId="popoverTestId"
      placement="bottom-left"
      ariaLabel="Zarzadzaj widocznoscia kolumn"
    >
      <span :class="`${TABLE_LIST_CLASS}__head-actions-trigger`" aria-hidden="true">
        <SvgIcon
          :class="`${TABLE_LIST_CLASS}__head-actions-trigger-icon`"
          name="cogs"
          aria-hidden="true"
        />
      </span>

      <template #content>
        <div :class="`${TABLE_LIST_CLASS}__head-actions-menu`">
          <p :class="`${TABLE_LIST_CLASS}__head-actions-title`">Widoczne kolumny</p>
          <p :class="`${TABLE_LIST_CLASS}__head-actions-description`">
            Pozostaw przynajmniej {{ minimumVisibleColumns }} kolumny widoczne.
          </p>

          <ul :class="`${TABLE_LIST_CLASS}__head-actions-list`">
            <li
              v-for="(column, index) in columns"
              :key="`${getTableColumnIdentifier(column)}-${index}`"
              :class="`${TABLE_LIST_CLASS}__head-actions-item`"
            >
              <label
                :class="[
                  `${TABLE_LIST_CLASS}__head-actions-option`,
                  isColumnToggleDisabled(column) &&
                    `${TABLE_LIST_CLASS}__head-actions-option--disabled`,
                ]"
              >
                <input
                  :checked="isColumnVisible(column)"
                  :class="`${TABLE_LIST_CLASS}__head-actions-checkbox`"
                  :data-testid="getCheckboxTestId(column)"
                  :disabled="isColumnToggleDisabled(column)"
                  type="checkbox"
                  @change="(event: Event) => handleToggleColumnVisibility(event, column)"
                />

                <span :class="`${TABLE_LIST_CLASS}__head-actions-option-label`">
                  {{ getColumnLabel(column) }}
                </span>
              </label>
            </li>
          </ul>
        </div>
      </template>
    </PopoverOverlayer>

    <span v-if="as === 'th'" :class="`${TABLE_LIST_CLASS}__sr-only`"
      >Dodatkowe akcje dla rekordow</span
    >
  </component>
</template>
