<script setup lang="ts">
import { xorElement } from '@/helpers/array.helper';
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import FormCheckbox from '@/components/form/FormCheckbox/index.vue';
import { computed, useId } from 'vue';

const { dataTestId, id, selectedRows, tableScopeId } = defineProps<{
  id: string;
  selected?: boolean;
  selectedRows: string[];
  dataTestId?: string;
  tableScopeId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:select:row', records: string[]): void;
}>();

const rowScopeId = useId();
const checkboxTestId = computed(() => buildTableTestId(dataTestId, 'checkbox'));
const checkboxFieldIdentifier = computed(() =>
  ['select-record', tableScopeId, id, rowScopeId].filter(Boolean).join('-'),
);
</script>

<template>
  <td :class="`${TABLE_LIST_CLASS}__select-cell`">
    <FormCheckbox
      :id="checkboxFieldIdentifier"
      :name="checkboxFieldIdentifier"
      :value="selectedRows.includes(id)"
      :dataTestId="checkboxTestId"
      :aria-label="`Zaznacz rekord ${id}`"
      @update:value="emit('on:select:row', xorElement(selectedRows, id))"
    />
  </td>
</template>
