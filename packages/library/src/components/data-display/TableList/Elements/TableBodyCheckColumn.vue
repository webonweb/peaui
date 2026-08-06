<script setup lang="ts">
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import { computed, useId } from 'vue';

const { dataTestId, id, row, tableScopeId } = defineProps<{
  id: string;
  row?: number | string;
  dataTestId?: string;
  tableScopeId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:check:row', id?: number | string): void;
}>();

const rowScopeId = useId();
const radioTestId = computed(() => buildTableTestId(dataTestId, 'radio'));
const radioFieldId = computed(() =>
  ['check-record', tableScopeId, id, rowScopeId].filter(Boolean).join('-'),
);
const radioGroupName = computed(() =>
  ['table-check-record', tableScopeId ?? rowScopeId].filter(Boolean).join('-'),
);
</script>

<template>
  <td :class="`${TABLE_LIST_CLASS}__check-cell`">
    <input
      :class="`${TABLE_LIST_CLASS}__check-input`"
      :checked="row === id"
      :id="radioFieldId"
      :value="id"
      :data-testid="radioTestId"
      :aria-label="`Wybierz rekord ${id}`"
      :name="radioGroupName"
      type="radio"
      @change="emit('on:check:row', id)"
    />
  </td>
</template>
