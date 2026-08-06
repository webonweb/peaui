<script setup lang="ts">
import type { Component } from 'vue';
import type { TableColumn } from '../index.vue';
import { computed, defineAsyncComponent } from 'vue';
import { copyToClipboard, stripHtmlUsingDom } from '@/helpers/functions.helper';
import { getDeepValue } from '@/helpers/object.helper';
import { notificationSuccess } from '@/helpers/notifications.helper';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import {
  buildTableTestId,
  TABLE_LIST_CLASS,
  TABLE_LIST_DEFAULT_COLUMN_WIDTH,
  type TableLockedColumnMeta,
} from '../shared';

const { column, dataTestId, index, lockedColumn, record } = defineProps<{
  index?: number;
  column: TableColumn;
  lockedColumn?: TableLockedColumnMeta;
  record: Record<string, any>;
  dataTestId?: string;
  isExpanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:click', id: string): void;
  (e: 'on:update', value: string | undefined | number, column: TableColumn): void;
}>();

const columnsDictionary: Readonly<Record<string, Component>> = {
  action: defineAsyncComponent(() => import('./ActionColumn.vue')),
  array: defineAsyncComponent(() => import('./ArrayColumn.vue')),
  date: defineAsyncComponent(() => import('./DateColumn.vue')),
  editAction: defineAsyncComponent(() => import('./EditActionColumn.vue')),
  EditActionColumn: defineAsyncComponent(() => import('./EditActionColumn.vue')),
  editable: defineAsyncComponent(() => import('./EditableColumn.vue')),
  editableInline: defineAsyncComponent(() => import('./EditableInline.vue')),
  expandable: defineAsyncComponent(() => import('./ExpandableColumn.vue')),
  empty: defineAsyncComponent(() => import('./EmptyColumn.vue')),
  index: defineAsyncComponent(() => import('./IndexColumn.vue')),
  link: defineAsyncComponent(() => import('./LinkColumn.vue')),
  status: defineAsyncComponent(() => import('./StatusColumn.vue')),
  stepper: defineAsyncComponent(() => import('./StepperColumn.vue')),
  tag: defineAsyncComponent(() => import('./TagColumn.vue')),
  text: defineAsyncComponent(() => import('./TextColumn.vue')),
} as const;

const resolvedType = computed(() => {
  if (column.inline) {
    return 'editableInline';
  }

  if (typeof column.type === 'function') {
    return column.type(record) as string;
  }

  return (column.type || 'text') as string;
});

const cellTestId = computed(() =>
  buildTableTestId(dataTestId, 'cell', stripHtmlUsingDom(column.key || 'column')),
);

const copyButtonTestId = computed(() => buildTableTestId(cellTestId.value, 'copy'));
const cellClasses = computed(() => [
  `${TABLE_LIST_CLASS}__body-cell`,
  column.border === 'left' && `${TABLE_LIST_CLASS}__body-cell--border-left`,
  column.border === 'right' && `${TABLE_LIST_CLASS}__body-cell--border-right`,
  lockedColumn && `${TABLE_LIST_CLASS}__body-cell--locked`,
  lockedColumn && `${TABLE_LIST_CLASS}__body-cell--locked-${lockedColumn.side}`,
]);
const cellStyles = computed(() => {
  const width = column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH;

  return {
    minWidth: `${width}px`,
    width: column.width ? `${column.width}px` : '100%',
    ...(lockedColumn ? { [lockedColumn.side]: `${lockedColumn.offset}px` } : {}),
  };
});

function getResolvedValue(): unknown {
  return column.template
    ? column.template(record[column.key] as string, record)
    : getDeepValue(record, column.key);
}

async function handleCopyText(text: string): Promise<void> {
  await copyToClipboard(text);
  notificationSuccess('Tekst skopiowany poprawnie');
}
</script>

<template>
  <td
    :class="cellClasses"
    :data-testid="cellTestId"
    :style="cellStyles"
    :width="column.width ? `${column.width}px` : '100%'"
  >
    <div
      :class="[
        `${TABLE_LIST_CLASS}__body-cell-content`,
        column.canCopy && `${TABLE_LIST_CLASS}__body-cell-content--copyable`,
      ]"
      :style="{
        minWidth: column.width ? `${column.width}px` : `${TABLE_LIST_DEFAULT_COLUMN_WIDTH}px`,
        width: column.width ? `${column.width}px` : '100%',
      }"
    >
      <component
        :is="columnsDictionary[resolvedType]"
        :column="column"
        :data-test-id="cellTestId"
        :deep="column.deep"
        :index="index"
        :is-expanded="isExpanded"
        :manage="column.manage"
        :record="record"
        :value="getResolvedValue()"
        @on:click="(recordId: string) => emit('on:click', recordId)"
        @on:update="(value: string | undefined | number) => emit('on:update', value, column)"
      />

      <InfoTooltip v-if="column.canCopy && record[column.key]" placement="right">
        <button
          type="button"
          :class="`${TABLE_LIST_CLASS}__copy-button`"
          :data-testid="copyButtonTestId"
          aria-label="Skopiuj tekst do schowka"
          @click.prevent="handleCopyText(record[column.key] as string)"
        >
          <SvgIcon :class="`${TABLE_LIST_CLASS}__copy-icon`" name="copy" aria-hidden="true" />
        </button>

        <template #description>Skopiuj tekst z kolumny</template>
      </InfoTooltip>
    </div>
  </td>
</template>
