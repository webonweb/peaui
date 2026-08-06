<script setup lang="ts">
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import { computed } from 'vue';
import type { TableColumn } from '../index.vue';
import { TABLE_LIST_CLASS } from '../shared';

const { column, deep, record, value } = defineProps<{
  deep?: string;
  record?: Record<string, any>;
  column: TableColumn;
  value: string | undefined | Record<string, string>;
}>();

const displayValue = computed(() => {
  if (deep && typeof value === 'object') {
    return value[deep] || '-/-';
  }

  if (value === null || value === undefined) {
    return '-/-';
  }

  if (typeof value === 'string' && value.length === 0) {
    return '-/-';
  }

  return value as string | number;
});
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__text-column`">
    <span :class="`${TABLE_LIST_CLASS}__text-value`">{{ displayValue }}</span>

    <InfoTooltip v-if="column.hintColumn" placement="top">
      <SvgIcon :class="`${TABLE_LIST_CLASS}__hint-icon`" name="hint" aria-hidden="true" />

      <template #description>
        {{ column.hintColumn }}
      </template>
    </InfoTooltip>
  </div>
</template>
