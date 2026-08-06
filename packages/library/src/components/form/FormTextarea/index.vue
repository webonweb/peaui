<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import FormField from '@/components/form/FormField/index.vue';

const {
  disabled,
  readonly,
  id,
  name,
  required,
  label,
  maxLength,
  placeholder = 'wpisz',
  rows = 5,
  dataTestId,
} = defineProps<{
  id: string;
  name: string;
  rows?: number;
  label?: string;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
}>();

const slots = useSlots();
const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-field-textarea`;

const modelValue = defineModel<string | undefined>('value', {
  required: true,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    ...attrs,
    rows,
  };

  return bindings;
});
</script>

<template>
  <FormField
    :disabled
    :id
    :label
    :maxLength
    :name
    :placeholder
    :readonly
    :required
    :value="modelValue"
    @on:remove="modelValue = ''"
  >
    <template v-if="slots.hint" #hint>
      <slot name="hint" />
    </template>

    <template #default="{ props }">
      <textarea
        :class="classNameComponent"
        v-bind="{ ...bindings, ...props }"
        @input="(event: Event) => (modelValue = (event.target as HTMLInputElement).value)"
        data-type="textarea"
        :data-testid="elementTestId"
      />
    </template>
    <template v-if="slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="slots.error" #error>
      <slot name="error" />
    </template>
    <template v-if="slots.success" #success>
      <slot name="success" />
    </template>
  </FormField>
</template>
