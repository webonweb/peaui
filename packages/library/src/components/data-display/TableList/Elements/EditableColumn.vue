<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { computed, defineAsyncComponent, ref, useId, watch, type Component } from 'vue';
import { number, object, string } from 'yup';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormContainer from '@/components/form/FormContainer/index.vue';
import GridItem from '@/components/layout/GridItem/index.vue';
import GridSection from '@/components/layout/GridSection/index.vue';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { mergeArrayObjects } from '@/helpers/array.helper';
import { unflatten } from '@/helpers/object.helper';
import type { TableColumn, TableManageColumn } from '../index.vue';

import { TABLE_LIST_CLASS, resolveTableManageOptions } from '../shared';

const { column, manage, record } = defineProps<{
  manage?: TableManageColumn;
  deep?: string;
  record?: Record<string, any>;
  column: TableColumn;
}>();

defineEmits<{
  (e: 'on:click'): void;
}>();

const modelValue = defineModel<string | number | undefined>('value');
const isEditActive = ref(false);
const uid = useId();

const formComponentsDictionary: Readonly<Record<string, Component>> = {
  number: defineAsyncComponent(() => import('@/components/form/FormNumber/index.vue')),
  select: defineAsyncComponent(() => import('@/components/form/FormSelect/index.vue')),
  text: defineAsyncComponent(() => import('@/components/form/FormInput/index.vue')),
} as const;

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

const generateInitialValuesValidation = () => {
  const validationShape = unflatten(
    mergeArrayObjects([
      {
        [column.key]: ((currentManage: TableManageColumn) => {
          if (!currentManage) {
            return '';
          }

          switch (currentManage.type) {
            case 'number':
              return number()
                .test('is-required', ERROR_MESSAGES.required, (value: number | undefined) => {
                  return !currentManage.required ? true : !Number.isNaN(value as number);
                })
                .test('is-integer', ERROR_MESSAGES.integer, (value: number | undefined) => {
                  return (
                    !currentManage.integer || (currentManage.integer && Number.isInteger(value))
                  );
                });
            default:
              return string().test(
                'is-required',
                ERROR_MESSAGES.required,
                (value: string | undefined) => {
                  return !currentManage.required ? true : (value || '').trim() !== '';
                },
              );
          }
        })(column.manage as TableManageColumn),
      },
    ]),
    (value) => object(value as Record<string, any>),
  ) as Record<string, any>;

  return object({
    ...validationShape,
  });
};

const { defineField, errors, handleSubmit, resetForm } = useForm<any>({
  initialValues: generateInitialValues(),
  validationSchema: toTypedSchema(generateInitialValuesValidation()),
  validateOnMount: false,
  keepValuesOnUnmount: false,
});

const [columnValue] = defineField(`${column.key}`);

const fieldError = computed(() => errors.value[column.key]);
const fieldComponentKey = computed(() =>
  [column.key, fieldError.value ?? 'valid', isEditActive.value ? 'edit' : 'preview'].join('-'),
);
const fieldIdentifier = computed(() =>
  ['dynamical', manage?.type ?? 'field', column.key, uid].join('-'),
);

function resolveOptions(): any[] | undefined {
  return resolveTableManageOptions({
    columnKey: column.key,
    currentRecord: {
      ...(record || {}),
      [column.key]: columnValue.value,
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

watch(modelValue, () => {
  columnValue.value = modelValue.value;
});

const handleOnSubmit = handleSubmit(async (values) => {
  modelValue.value = values[column.key];
  isEditActive.value = false;

  resetForm({
    values: generateInitialValues(),
  });

  manage?.onUpdate?.({
    ...record,
    [column.key]: modelValue.value,
  });
});

function handleOnCancel(): void {
  isEditActive.value = false;

  resetForm({
    values: generateInitialValues(),
  });
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
              ? manage.max(record as Record<string, any>)
              : manage.max
          "
          :min="manage.min"
          :name="fieldIdentifier"
          :options="resolveOptions()"
          :placeholder="manage.placeholder"
          :placement="resolvePlacement()"
          :readonly="manage.disabled"
          :required="manage.required"
          :step="manage.step"
          :value="columnValue"
          @update:value="(value: string | undefined | number) => (columnValue = value)"
        />

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
