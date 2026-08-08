<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import FormField from '@/components/form/FormField/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  disabled,
  readonly,
  id,
  name,
  required,
  label,
  before,
  after,
  iconBefore,
  maxLength,
  iconAfter,
  canErase,
  placeholder = 'wpisz',
  dataTestId,
} = defineProps<{
  id: string;
  canErase?: boolean;
  after?: string;
  before?: string;
  name: string;
  label?: string;
  iconBefore?: string;
  iconAfter?: string;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
}>();

const slots = useSlots();
const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-field-input`;
const modelValue = defineModel<string | undefined>('value', {
  required: true,
});

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  'on:remove': [];
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    ...attrs,
  };

  return bindings;
});

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const onHandleRemoveValue = () => {
  emit('on:remove');
  modelValue.value = '';
};
</script>

<template>
  <FormField
    :after
    :before
    :can-erase="canErase"
    :disabled
    :iconAfter
    :iconBefore
    :id
    :label
    :maxLength
    :name
    :placeholder
    :readonly
    :required
    :value="modelValue"
    @on:remove="onHandleRemoveValue"
    :data-test-id="dataTestId"
  >
    <template v-if="slots.hint" #hint>
      <slot name="hint" />
    </template>

    <template #default="{ props }">
      <input
        type="text"
        v-bind="{ ...bindings, ...props }"
        :class="classNameComponent"
        @input.stop.prevent="(e) => (modelValue = (e.target as HTMLInputElement).value)"
        data-type="input"
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
