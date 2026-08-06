<script setup lang="ts">
import type { TableColumn } from '../index.vue';
import { TABLE_LIST_CLASS } from '../shared';

defineProps<{
  deep?: string;
  record?: Record<string, any>;
  column: TableColumn;
  value: string | undefined | Record<string, string>;
}>();
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__empty-column`">&nbsp;</div>
</template>
