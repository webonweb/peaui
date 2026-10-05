<script setup lang="ts">
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { computed } from 'vue';
import type { TableColumn } from '../index.vue';
import { buildTableTestId, TABLE_LIST_CLASS, resolveTableTextValue } from '../shared';

const { column, dataTestId, deep, record, value } = defineProps<{
  deep?: string;
  record?: Record<string, unknown>;
  column: TableColumn;
  dataTestId?: string;
  value: unknown;
}>();

const emit = defineEmits<{
  (e: 'on:click', id: string): void;
}>();

const displayValue = computed(() => resolveTableTextValue(value, deep));

const buttonAriaLabel = computed(() => column.actionLabel || 'Edytuj wartosc inline');
const buttonTestId = computed(() => buildTableTestId(dataTestId, 'button'));

function handleClick(): void {
  emit('on:click', String(record?.id ?? ''));
}
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__edit-action-column`">
    <span :class="`${TABLE_LIST_CLASS}__edit-action-value`">{{ displayValue }}</span>

    <button
      type="button"
      :class="[
        `${TABLE_LIST_CLASS}__actions-simple-button`,
        `${TABLE_LIST_CLASS}__edit-action-button`,
      ]"
      :aria-label="buttonAriaLabel"
      :data-testid="buttonTestId"
      @click.prevent="handleClick"
    >
      <SvgIcon
        :class="`${TABLE_LIST_CLASS}__actions-simple-icon`"
        name="edit2"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
