<script setup lang="ts">
import { computed } from 'vue';
import { TABLE_LIST_CLASS } from '../shared';

const { value } = defineProps<{
  value: string | undefined | string[];
}>();

const displayValue = computed(() =>
  Array.isArray(value) && value.length > 0 ? value.join(', ') : '-/-',
);
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__array-column`">
    {{ displayValue }}
  </div>
</template>
