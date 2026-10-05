<script setup lang="ts">
import { formComponentsDictionary } from './editor-components';
import { computed, ref, useId, watch } from 'vue';
import FormContainer from '@/components/form/FormContainer/index.vue';
import GridItem from '@/components/layout/GridItem/index.vue';
import GridSection from '@/components/layout/GridSection/index.vue';
import type { TableColumn, TableManageColumn } from '../index.vue';

import { TABLE_LIST_CLASS, resolveTableManageOptions } from '../shared';

const { manage, column, record } = defineProps<{
  manage?: TableManageColumn;
  deep?: string;
  record?: Record<string, unknown>;
  column: TableColumn;
  index?: number;
}>();

const emit = defineEmits<{
  (e: 'on:click'): void;
  (e: 'on:update', value: Record<string, string | number | undefined>, column: TableColumn): void;
}>();

const modelValue = defineModel<string | number | undefined>('value');
const currentValue = ref<string | number | undefined>(modelValue.value);
const uid = useId();

const fieldIdentifier = computed(() =>
  ['dynamical', manage?.type ?? 'field', column.key, uid].join('-'),
);

function resolveOptions(): import('../shared').TableManageOption[] | undefined {
  return resolveTableManageOptions({
    columnKey: column.key,
    currentRecord: {
      ...(record || {}),
      [column.key]: currentValue.value,
    },
    manageType: manage?.type,
    options: manage?.options,
  });
}

function resolvePlacement(): 'top' | 'bottom' | undefined {
  if (manage?.placement === 'top') {
    return 'top';
  }

  if (manage?.placement === 'bottom') {
    return 'bottom';
  }

  return undefined;
}

function onHandleChangeValue(value: string | undefined | number): void {
  currentValue.value = value;
  emit('on:update', { [column.key]: value }, column);
}

watch(modelValue, () => {
  currentValue.value = modelValue.value;
});
</script>

<template>
  <FormContainer
    :class="[`${TABLE_LIST_CLASS}__form-wrapper`, `${TABLE_LIST_CLASS}__form-wrapper--compact`]"
    label="Formularz edytowania kolumny"
    :showActions="false"
    :useAriaLabelledby="false"
  >
    <GridSection>
      <GridItem :colspan="12" :grid="false" :class="`${TABLE_LIST_CLASS}__editable-inline`">
        <component
          v-if="manage"
          :is="formComponentsDictionary[manage.type || '']"
          :class="`${TABLE_LIST_CLASS}__editable-field`"
          :can-write="manage.canWrite"
          :disabled="manage.disabled"
          :id="fieldIdentifier"
          :max="
            typeof manage.max === 'function'
              ? manage.max(record as Record<string, unknown>)
              : manage.max
          "
          :min="manage.min"
          :name="fieldIdentifier"
          :options="resolveOptions()"
          :value-mode="manage?.valueMode"
          :placeholder="manage.placeholder"
          :placement="resolvePlacement()"
          :readonly="manage.disabled"
          :required="manage.required"
          :step="manage.step"
          :value="currentValue"
          @update:value="onHandleChangeValue"
        />
      </GridItem>
    </GridSection>
  </FormContainer>
</template>
