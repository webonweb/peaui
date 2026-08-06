<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ApiEntry } from '../types';
import { useI18n } from '../i18n';

const { t } = useI18n();

const props = defineProps<{
  entry: ApiEntry;
  value: unknown;
}>();

const emit = defineEmits<{ change: [value: unknown] }>();
const jsonValue = ref('');
const jsonError = ref(false);

const unionValues = computed(() =>
  [...props.entry.type.matchAll(/['\"]([^'\"]+)['\"]/g)].map((match) => match[1]),
);
const isBoolean = computed(() => props.entry.type.includes('boolean'));
const isNumber = computed(
  () => props.entry.type.includes('number') && !props.entry.type.includes('[]'),
);
const isComplex = computed(
  () =>
    Array.isArray(props.value) ||
    (typeof props.value === 'object' && props.value !== null) ||
    props.entry.type.includes('[]') ||
    props.entry.type.includes('Record<'),
);

watch(
  () => props.value,
  (value) => {
    if (isComplex.value) jsonValue.value = JSON.stringify(value ?? null, null, 2);
  },
  { immediate: true, deep: true },
);

function updateJson() {
  try {
    emit('change', JSON.parse(jsonValue.value));
    jsonError.value = false;
  } catch {
    jsonError.value = true;
  }
}
</script>

<template>
  <label class="prop-control" :class="{ 'prop-control--toggle': isBoolean }">
    <span class="prop-control__header">
      <code>{{ entry.name }}</code>
      <span>{{ entry.type }}</span>
    </span>
    <input
      v-if="isBoolean"
      type="checkbox"
      :checked="Boolean(value)"
      @change="emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <select
      v-else-if="unionValues.length > 1"
      :value="String(value ?? '')"
      @change="emit('change', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in unionValues" :key="option" :value="option">{{ option }}</option>
    </select>
    <textarea
      v-else-if="isComplex"
      v-model="jsonValue"
      rows="4"
      :aria-invalid="jsonError"
      @blur="updateJson"
    />
    <input
      v-else-if="isNumber"
      type="number"
      :value="Number(value ?? 0)"
      @input="emit('change', Number(($event.target as HTMLInputElement).value))"
    />
    <input
      v-else
      type="text"
      :value="String(value ?? '')"
      @input="emit('change', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="jsonError" class="prop-control__error">{{ t('common.invalidJson') }}</small>
  </label>
</template>
