<script setup lang="ts">
import type { TableColumn } from '../index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import { computed } from 'vue';

const { column, dataTestId, record } = defineProps<{
  record?: Record<string, any>;
  column: TableColumn;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:click', id: string): void;
}>();

const buttonTestId = computed(() => buildTableTestId(dataTestId, 'button'));

function handleClick(): void {
  emit('on:click', String(record?.id ?? ''));
}
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__action-column`">
    <ButtonAction
      size="xs"
      variant="secondary"
      :ariaLabel="column.actionLabel || 'akcja'"
      :dataTestId="buttonTestId"
      @click="handleClick"
    >
      {{ column.actionLabel || 'akcja' }}
    </ButtonAction>
  </div>
</template>
