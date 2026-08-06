<script setup lang="ts">
import { computed } from 'vue';
import { TABLE_LIST_CLASS } from '../shared';

const { index = 0 } = defineProps<{
  index?: number;
}>();

const displayValue = computed(() => index + 1);
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__index-column`">
    {{ displayValue }}
  </div>
</template>
