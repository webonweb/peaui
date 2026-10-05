<script setup lang="ts">
import { computed } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import type { TableColumn } from '../index.vue';
import { TABLE_LIST_CLASS, resolveTableTextValue } from '../shared';

const { deep, record, value, isExpanded } = defineProps<{
  deep?: string;
  record?: Record<string, unknown>;
  column: TableColumn;
  value: unknown;
  isExpanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:click', id: string): void;
}>();

const displayValue = computed(() => resolveTableTextValue(value, deep));

const buttonAriaLabel = computed(() => {
  const actionLabel = isExpanded ? 'Zwin dodatkowy wiersz' : 'Rozwin dodatkowy wiersz';

  return `${String(displayValue.value)}. ${actionLabel}`;
});

function handleToggle(): void {
  const recordId = record?.id;

  if (recordId === undefined || recordId === null || recordId === '') {
    return;
  }

  emit('on:click', String(recordId));
}
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__expandable-column`">
    <button
      type="button"
      :class="`${TABLE_LIST_CLASS}__expandable-button`"
      :aria-expanded="isExpanded ? 'true' : 'false'"
      :aria-label="buttonAriaLabel"
      @click.prevent="handleToggle"
    >
      <span :class="`${TABLE_LIST_CLASS}__expandable-value`">{{ displayValue }}</span>

      <SvgIcon
        :class="[
          `${TABLE_LIST_CLASS}__expandable-arrow`,
          isExpanded
            ? `${TABLE_LIST_CLASS}__expandable-arrow--expanded`
            : `${TABLE_LIST_CLASS}__expandable-arrow--collapsed`,
        ]"
        name="arrow"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
