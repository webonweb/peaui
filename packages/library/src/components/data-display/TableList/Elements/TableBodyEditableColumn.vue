<script setup lang="ts">
import type { Component } from 'vue';
import type { TableColumn } from '../index.vue';
import { computed, defineAsyncComponent, useId } from 'vue';
import { getDeepValue } from '@/helpers/object.helper';
import {
  TABLE_LIST_CLASS,
  TABLE_LIST_DEFAULT_COLUMN_WIDTH,
  buildTableTestId,
  resolveTableManageOptions,
  type TableLockedColumnMeta,
} from '../shared';

const props = defineProps<{
  columns: TableColumn[];
  errors?: Record<string, string | undefined>;
  formValues: Record<string, any>;
  dataTestId?: string;
  lockedColumns?: Record<string, TableLockedColumnMeta | undefined>;
}>();

const emit = defineEmits<{
  (
    e: 'on:update',
    value: string | undefined | number | unknown[] | Record<string, any>,
    column: TableColumn,
  ): void;
}>();

const uid = useId();

const formComponentsDictionary: Readonly<Record<string, Component>> = {
  multiselect: defineAsyncComponent(() => import('@/components/form/FormMultiSelect/index.vue')),
  number: defineAsyncComponent(() => import('@/components/form/FormNumber/index.vue')),
  select: defineAsyncComponent(() => import('@/components/form/FormSelect/index.vue')),
  text: defineAsyncComponent(() => import('@/components/form/FormInput/index.vue')),
} as const;

const vMask = {
  mounted() {
    return undefined;
  },
  updated() {
    return undefined;
  },
};

function resolveOptions(column: TableColumn): any[] | undefined {
  return resolveTableManageOptions({
    columnKey: column.key,
    currentRecord: props.formValues,
    manageType: column.manage?.type,
    options: column.manage?.options,
  });
}

function getFieldTestId(column: TableColumn): string | undefined {
  return buildTableTestId(props.dataTestId, 'field', column.key);
}

function getFieldValue(column: TableColumn): unknown {
  return getDeepValue(props.formValues, column.key);
}

function getFieldError(column: TableColumn): string | undefined {
  return props.errors?.[column.key];
}

function getFieldComponentKey(column: TableColumn): string {
  return [column.key, String(getDeepValue(props.formValues, 'id') ?? 'create')].join('-');
}

const fieldIdentifierPrefix = computed(() => `dynamical-field-${uid}`);

function getFieldIdentifier(column: TableColumn): string {
  return [fieldIdentifierPrefix.value, column.manage?.type ?? 'field', column.key].join('-');
}

function getLockedColumnMeta(column: TableColumn): TableLockedColumnMeta | undefined {
  return props.lockedColumns?.[column.key];
}

function getCellClasses(column: TableColumn): string[] {
  const lockedColumn = getLockedColumnMeta(column);

  return [
    `${TABLE_LIST_CLASS}__editable-cell`,
    ...(column.border === 'left' ? [`${TABLE_LIST_CLASS}__editable-cell--border-left`] : []),
    ...(column.border === 'right' ? [`${TABLE_LIST_CLASS}__editable-cell--border-right`] : []),
    ...(lockedColumn
      ? [
          `${TABLE_LIST_CLASS}__editable-cell--locked`,
          `${TABLE_LIST_CLASS}__editable-cell--locked-${lockedColumn.side}`,
        ]
      : []),
  ];
}

function getCellStyles(column: TableColumn): Record<string, string> {
  const width = column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH;
  const lockedColumn = getLockedColumnMeta(column);

  return {
    minWidth: `${width}px`,
    width: column.width ? `${column.width}px` : '100%',
    ...(lockedColumn ? { [lockedColumn.side]: `${lockedColumn.offset}px` } : {}),
  };
}

function handleUpdateValue(
  value: string | undefined | number | unknown[] | Record<string, any>,
  column: TableColumn,
): void {
  emit('on:update', value, column);
}

function resolvePlacement(column: TableColumn): 'top' | 'bottom' | undefined {
  if (column.manage?.placement === 'top') {
    return 'top';
  }

  if (column.manage?.placement === 'bottom') {
    return 'bottom';
  }

  return undefined;
}
</script>

<template>
  <td
    v-for="column in props.columns.filter((column) =>
      column.visible === undefined ? true : column.visible,
    )"
    :key="`column-editable-${column.key}`"
    :class="getCellClasses(column)"
    :style="getCellStyles(column)"
  >
    <component
      v-if="column.manage && column.manage.mask"
      v-mask="column.manage.mask"
      :is="formComponentsDictionary[column.manage.type || '']"
      :key="getFieldComponentKey(column)"
      :class="`${TABLE_LIST_CLASS}__editable-cell-field`"
      :dataTestId="getFieldTestId(column)"
      :can-write="column.manage.canWrite"
      :disabled="column.manage.disabled"
      :id="getFieldIdentifier(column)"
      :max="column.manage.max"
      :max-length="column.manage.maxLength"
      :min="column.manage.min"
      :name="getFieldIdentifier(column)"
      :options="resolveOptions(column)"
      :placeholder="column.manage.placeholder"
      :placement="resolvePlacement(column)"
      :readonly="column.manage.disabled"
      :required="column.manage.required"
      :step="column.manage.step"
      :with-select-all="column.manage.withSelectAll"
      :value="getFieldValue(column)"
      @update:value="
        (value: string | undefined | number | unknown[] | Record<string, any>) =>
          handleUpdateValue(value, column)
      "
    >
      <template v-if="getFieldError(column)" #error>
        {{ getFieldError(column) }}
      </template>
    </component>

    <component
      v-else-if="column.manage"
      :is="formComponentsDictionary[column.manage.type || '']"
      :key="getFieldComponentKey(column)"
      :class="`${TABLE_LIST_CLASS}__editable-cell-field`"
      :dataTestId="getFieldTestId(column)"
      :can-write="column.manage.canWrite"
      :disabled="column.manage.disabled"
      :id="getFieldIdentifier(column)"
      :max="column.manage.max"
      :max-length="column.manage.maxLength"
      :min="column.manage.min"
      :name="getFieldIdentifier(column)"
      :options="resolveOptions(column)"
      :placeholder="column.manage.placeholder"
      :placement="resolvePlacement(column)"
      :readonly="column.manage.disabled"
      :required="column.manage.required"
      :step="column.manage.step"
      :with-select-all="column.manage.withSelectAll"
      :value="getFieldValue(column)"
      @update:value="
        (value: string | undefined | number | unknown[] | Record<string, any>) =>
          handleUpdateValue(value, column)
      "
    >
      <template v-if="getFieldError(column)" #error>
        {{ getFieldError(column) }}
      </template>
    </component>

    <span v-else :class="`${TABLE_LIST_CLASS}__editable-empty`">---</span>
  </td>
</template>
