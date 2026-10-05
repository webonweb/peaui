<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import { computed, nextTick, useAttrs } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  disabled,
  id,
  name,
  optionValue,
  required,
  isValid = true,
  dataTestId,
} = defineProps<{
  id: string;
  name: string;
  optionValue: string | number | boolean;
  isValid?: boolean;
  required?: boolean;
  disabled?: boolean;
  dataTestId?: string;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-field-radio`;
const modelValue = defineModel<string | number | boolean | undefined>('value', { required: true });
const hasDefaultSlot = useSlotPresence('default');

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootTestId = computed(() => dataTestId);
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const isChecked = computed(() => modelValue.value === optionValue);
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
    'aria-invalid': !isValid,
    'aria-label': inputAriaLabel.value,
    'aria-required': required || false,
    required: required || undefined,
    id,
    name,
    type: 'radio',
    value: optionValue,
    disabled,
    ...attrs,
  };

  return bindings;
});

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function handleSelect(): void {
  if (disabled) {
    return;
  }

  modelValue.value = optionValue;
}

async function handleOnChange(event: Event): Promise<void> {
  if (!(event.target instanceof HTMLInputElement) || !event.target.checked) {
    return;
  }

  const input = event.target;
  handleSelect();
  await nextTick();
  input.checked = isChecked.value;
}

function handleOnKeydown(event: KeyboardEvent): void {
  if (!['Enter', ' ', 'Spacebar'].includes(event.key)) {
    return;
  }

  event.preventDefault();
  handleSelect();
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
    :data-testid="rootTestId"
  >
    <input
      :class="[
        `${classNameComponent}__element`,
        {
          [`${classNameComponent}__element--disabled`]: disabled,
          [`${classNameComponent}__element--invalid`]: !isValid,
          [`${classNameComponent}__element--checked`]: isChecked,
        },
      ]"
      v-bind="bindings"
      :data-testid="elementTestId"
      :checked="isChecked"
      data-type="radio"
      @change="handleOnChange"
      @keydown="handleOnKeydown"
    />

    <label
      v-if="hasDefaultSlot"
      :class="[
        `${classNameComponent}__label`,
        {
          [`${classNameComponent}__label--disabled`]: disabled,
          [`${classNameComponent}__label--checked`]: isChecked,
          [`${classNameComponent}__label--normal`]: !isChecked,
          [`${classNameComponent}__label--invalid`]: !isValid,
        },
      ]"
      :data-testid="labelTestId"
      :for="id"
    >
      <slot />
    </label>
  </div>
</template>
