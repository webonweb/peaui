<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';

import type { ApiEntry } from '../types';
import { useI18n } from '../i18n';
import DocsSelect from './DocsSelect.vue';

const { t } = useI18n();

const props = defineProps<{
  entry: ApiEntry;
  value: unknown;
}>();

const emit = defineEmits<{ change: [value: unknown] }>();
const jsonValue = ref('');
const jsonError = ref(false);
const controlId = `prop-control-${useId()}`;
const labelId = `${controlId}-label`;

const unionValues = computed(() => [
  ...new Set([...props.entry.type.matchAll(/['\"]([^'\"]+)['\"]/g)].map((match) => match[1])),
]);
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
  <div class="prop-control" :class="{ 'prop-control--toggle': isBoolean }">
    <label :id="labelId" class="prop-control__header" :for="controlId">
      <code>{{ entry.name }}</code>
      <span>{{ entry.type }}</span>
    </label>
    <input
      v-if="isBoolean"
      :id="controlId"
      type="checkbox"
      :checked="Boolean(value)"
      @change="emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <DocsSelect
      v-else-if="unionValues.length > 1"
      :id="controlId"
      :model-value="String(value ?? '')"
      :options="unionValues"
      :labelledby="labelId"
      @update:model-value="emit('change', $event)"
    />
    <textarea
      v-else-if="isComplex"
      :id="controlId"
      v-model="jsonValue"
      rows="4"
      :aria-invalid="jsonError"
      @blur="updateJson"
    />
    <input
      v-else-if="isNumber"
      :id="controlId"
      type="number"
      :value="Number(value ?? 0)"
      @input="emit('change', Number(($event.target as HTMLInputElement).value))"
    />
    <input
      v-else
      :id="controlId"
      type="text"
      :value="String(value ?? '')"
      @input="emit('change', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="jsonError" class="prop-control__error">{{ t('common.invalidJson') }}</small>
  </div>
</template>
