<script setup lang="ts">
import { computed } from 'vue';
import type { TableColumn } from '../index.vue';
import { TABLE_LIST_CLASS } from '../shared';

const { column, deep, record, value } = defineProps<{
  deep?: string;
  record?: Record<string, any>;
  column: TableColumn;
  value: string | undefined | Record<string, string>;
}>();

const emit = defineEmits<{
  (e: 'on:click'): void;
}>();

const displayValue = computed(() => {
  if (!value || (typeof value === 'string' && value.length === 0)) {
    return '-/-';
  }

  if (deep && typeof value === 'object') {
    return value[deep];
  }

  return value;
});

const ariaLabel = computed(() => {
  const label = typeof displayValue.value === 'string' ? displayValue.value : column.label;
  return `Otworz powiazanie ${label}`;
});

const href = computed(() => {
  if (
    typeof displayValue.value === 'string' &&
    /^(https?:\/\/|\/|#|mailto:|tel:|\.\/|\.\.\/)/.test(displayValue.value)
  ) {
    return displayValue.value;
  }

  return undefined;
});

function handleClick(): void {
  emit('on:click');
}
</script>

<template>
  <a
    v-if="href"
    :class="`${TABLE_LIST_CLASS}__link-column`"
    :href="href"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    {{ displayValue }}
  </a>

  <button
    v-else
    type="button"
    :class="`${TABLE_LIST_CLASS}__link-column`"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    {{ displayValue }}
  </button>
</template>
