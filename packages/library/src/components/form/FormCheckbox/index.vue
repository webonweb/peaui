<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  disabled,
  id,
  name,
  required,
  isValid = true,
  dataTestId,
} = defineProps<{
  id: string;
  name: string;
  isValid?: boolean;
  required?: boolean;
  disabled?: boolean;
  dataTestId?: string;
}>();

const slots = useSlots();
const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-field-checkbox`;
const modelValue = defineModel<boolean | undefined>('value', { required: true });
const hasDefaultSlot = computed(() => !!slots.default);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const inputAriaLabel = computed(() =>
  hasDefaultSlot.value
    ? undefined
    : (explicitAriaLabel.value ?? (!explicitAriaLabelledBy.value ? name : undefined)),
);

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    'aria-disabled': disabled,
    'data-disabled': disabled,
    'aria-invalid': !isValid,
    'aria-label': inputAriaLabel.value,
    'aria-required': required || false,
    id,
    name,
    type: 'checkbox',
    disabled: disabled,
    ...attrs,
  };

  return bindings;
});

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function handleEnterToggle(): void {
  if (disabled) {
    return;
  }

  modelValue.value = !modelValue.value;
}
</script>

<template>
  <div
    :class="[
      classNameComponent,
      {
        [`${classNameComponent}--with-slot`]: hasDefaultSlot,
        [`${classNameComponent}--without-slot`]: !hasDefaultSlot,
      },
    ]"
  >
    <input
      :class="`${classNameComponent}__element ${disabled ? `${classNameComponent}__element--disabled` : ''} ${!isValid ? `${classNameComponent}__element--in-valid` : ''}`"
      v-bind="bindings"
      :data-testid="elementTestId"
      :checked="disabled ? false : modelValue"
      @change="(event: Event) => (modelValue = (event.target as HTMLInputElement).checked)"
      @keydown.enter.prevent.stop="handleEnterToggle"
      data-type="checkbox"
    />
    <label
      :class="[
        `${classNameComponent}__label`,
        {
          [`${classNameComponent}__label--disabled`]: disabled,
          [`${classNameComponent}__label--medium`]: disabled ? false : modelValue,
          [`${classNameComponent}__label--normal`]: !modelValue,
          [`${classNameComponent}__label--in-valid`]: !isValid,
        },
      ]"
      :data-testid="labelTestId"
      v-if="hasDefaultSlot"
      :for="id"
    >
      <slot />
    </label>
  </div>
</template>
