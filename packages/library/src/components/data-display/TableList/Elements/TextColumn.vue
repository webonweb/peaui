<script setup lang="ts">
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import { computed } from 'vue';
import type { TableColumn } from '../index.vue';
import { TABLE_LIST_CLASS, resolveTableTextValue } from '../shared';

const { column, deep, value } = defineProps<{
  deep?: string;
  record?: Record<string, unknown>;
  column: TableColumn;
  value: unknown;
}>();

const displayValue = computed(() => resolveTableTextValue(value, deep));
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
