<script setup lang="ts">
import { formComponentsDictionary } from './editor-components';
import { computed, ref, useId, watch } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormContainer from '@/components/form/FormContainer/index.vue';
import GridItem from '@/components/layout/GridItem/index.vue';
import GridSection from '@/components/layout/GridSection/index.vue';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { setDeepValue } from '@/helpers/object.helper';
import type { TableColumn, TableManageColumn } from '../index.vue';

import { validateEditableValue } from '../editable-validation.shared';
import { TABLE_LIST_CLASS, resolveTableManageOptions } from '../shared';

const { column, manage, record } = defineProps<{
  manage?: TableManageColumn;
  deep?: string;
  record?: Record<string, unknown>;
  column: TableColumn;
}>();

defineEmits<{
  (e: 'on:click'): void;
}>();

const modelValue = defineModel<string | number | undefined>('value');
const isEditActive = ref(false);
const uid = useId();

const generateInitialValues = () => ({
  [column.key]: ((currentManage: TableManageColumn) => {
    if (!currentManage) {
      return '';
    }

    switch (currentManage.type) {
      case 'number':
        return modelValue.value || 0;
      default:
        return modelValue.value || '';
    }
  })(column.manage as TableManageColumn),
});

const columnValue = ref<string | number | undefined>(generateInitialValues()[column.key]);
const fieldError = ref<string>();
const fieldComponentKey = computed(() =>
  [column.key, fieldError.value ?? 'valid', isEditActive.value ? 'edit' : 'preview'].join('-'),
);
const fieldIdentifier = computed(() =>
  ['dynamical', manage?.type ?? 'field', column.key, uid].join('-'),
);

function resolveOptions(): import('../shared').TableManageOption[] | undefined {
  const currentRecord = { ...record };
  setDeepValue(currentRecord, column.key, columnValue.value);
  return resolveTableManageOptions({
    columnKey: column.key,
    currentRecord,
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

watch(modelValue, () => {
  columnValue.value = modelValue.value;
  fieldError.value = undefined;
});

async function handleOnSubmit(): Promise<void> {
  fieldError.value = validateEditableValue(columnValue.value, manage, ERROR_MESSAGES);
  if (fieldError.value) return;

  modelValue.value = columnValue.value;
  isEditActive.value = false;

  const updatedRecord = { ...record };
  setDeepValue(updatedRecord, column.key, modelValue.value);
  manage?.onUpdate?.(updatedRecord);
}

function handleOnCancel(): void {
  isEditActive.value = false;
  columnValue.value = modelValue.value;
  fieldError.value = undefined;
}
</script>

<template>
  <FormContainer
    :class="[`${TABLE_LIST_CLASS}__form-wrapper`, `${TABLE_LIST_CLASS}__form-wrapper--compact`]"
    label="Formularz edytowania kolumny"
    :showActions="false"
    :useAriaLabelledby="false"
    @submit.prevent="handleOnSubmit"
  >
    <GridSection :columns="1">
      <GridItem v-if="!isEditActive" :class="`${TABLE_LIST_CLASS}__editable-display`">
        <span>{{ columnValue }}</span>

        <button
          type="button"
          :class="`${TABLE_LIST_CLASS}__editable-toggle`"
          aria-label="Edytuj kolumne"
          @click.prevent="isEditActive = true"
        >
          <SvgIcon
            :class="`${TABLE_LIST_CLASS}__editable-toggle-icon`"
            name="edit"
            aria-hidden="true"
          />
        </button>
      </GridItem>

      <GridItem v-if="isEditActive" :colspan="12" :class="`${TABLE_LIST_CLASS}__editable-editor`">
        <component
          v-if="manage"
          :is="formComponentsDictionary[manage.type || '']"
          :key="fieldComponentKey"
          :class="[
            `${TABLE_LIST_CLASS}__editable-field`,
            fieldError && `${TABLE_LIST_CLASS}__editable-field--invalid`,
          ]"
          :aria-invalid="Boolean(fieldError)"
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
          :value="columnValue"
          @update:value="(value: string | undefined | number) => (columnValue = value)"
        >
          <template v-if="fieldError" #error>{{ fieldError }}</template>
        </component>

        <div :class="`${TABLE_LIST_CLASS}__editable-editor-actions`">
          <button
            type="button"
            :class="`${TABLE_LIST_CLASS}__editable-editor-button ${TABLE_LIST_CLASS}__editable-editor-button--submit`"
            aria-label="Zapisz zmiane w kolumnie"
            @click.prevent="handleOnSubmit"
          >
            <SvgIcon
              :class="`${TABLE_LIST_CLASS}__editable-editor-icon`"
              name="check"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            :class="`${TABLE_LIST_CLASS}__editable-editor-button ${TABLE_LIST_CLASS}__editable-editor-button--cancel`"
            aria-label="Anuluj edycje kolumny"
            @click.prevent="handleOnCancel"
          >
            <SvgIcon
              :class="`${TABLE_LIST_CLASS}__editable-editor-icon`"
              name="close"
              aria-hidden="true"
            />
          </button>
        </div>
      </GridItem>
    </GridSection>
  </FormContainer>
</template>
