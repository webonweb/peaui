<script setup lang="ts">
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import FormCheckbox from '@/components/form/FormCheckbox/index.vue';
import { computed, useId } from 'vue';

const { dataTestId, disabled, isAllSelected } = defineProps<{
  disabled?: boolean;
  isAllSelected: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:toggle:select:row'): void;
}>();

const uid = useId();
const checkboxTestId = computed(() => buildTableTestId(dataTestId, 'checkbox'));
const checkboxFieldId = computed(() => `select-all-rows-${uid}`);
</script>

<template>
  <th :class="`${TABLE_LIST_CLASS}__select-head-cell`" scope="col">
    <span :class="`${TABLE_LIST_CLASS}__sr-only`">Pole zaznaczania lub odznaczania rekordow</span>

    <FormCheckbox
      :id="checkboxFieldId"
      name="select-all-rows"
      :disabled="disabled"
      :value="isAllSelected"
      :dataTestId="checkboxTestId"
      aria-label="Zaznacz wszystkie rekordy na stronie"
      @update:value="emit('on:toggle:select:row')"
    />
  </th>
</template>
