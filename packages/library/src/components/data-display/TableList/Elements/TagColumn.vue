<script setup lang="ts">
import TagChip from '@/components/data-display/TagChip/index.vue';
import type { TableColumn, TableTagVariant } from '../index.vue';
import { computed } from 'vue';

const { column, value } = defineProps<{
  column?: TableColumn;
  value: string;
}>();

const variant = computed<TableTagVariant>(() => column?.statusDictionary?.[value] ?? 'green');
</script>

<template>
  <TagChip :label="value" :variant="variant" size="xs" />
</template>
