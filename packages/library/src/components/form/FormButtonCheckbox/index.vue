<script lang="ts">
export type FormButtonCheckboxSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
</script>

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
  required,
  isValid = true,
  size = 'm',
  ariaLabel,
  dataTestId,
} = defineProps<{
  id: string;
  name: string;
  isValid?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: FormButtonCheckboxSize;
  ariaLabel?: string;
  dataTestId?: string;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-button-checkbox`;
const modelValue = defineModel<boolean | undefined>('value', { required: true });
const hasDefaultSlot = useSlotPresence('default');
const isChecked = computed(() => Boolean(modelValue.value));

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootTestId = computed(() => dataTestId);
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const markerTestId = computed(() => (dataTestId ? `${dataTestId}-marker` : undefined));
const textTestId = computed(() => (dataTestId ? `${dataTestId}-text` : undefined));
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const normalizedAriaLabel = computed(() => getNormalizedAttributeValue(ariaLabel));
const srOnlyText = computed(() =>
  hasDefaultSlot.value
    ? undefined
    : (normalizedAriaLabel.value ??
      explicitAriaLabel.value ??
      (!explicitAriaLabelledBy.value ? name : undefined)),
);

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${size}`,
  {
    [`${classNameComponent}--checked`]: isChecked.value,
    [`${classNameComponent}--disabled`]: disabled,
    [`${classNameComponent}--invalid`]: !isValid,
  },
]);

const labelClasses = computed(() => [
  `${classNameComponent}__label`,
  {
    [`${classNameComponent}__label--checked`]: isChecked.value,
    [`${classNameComponent}__label--disabled`]: disabled,
    [`${classNameComponent}__label--invalid`]: !isValid,
  },
]);

const markerClasses = computed(() => [
  `${classNameComponent}__marker`,
  {
    [`${classNameComponent}__marker--checked`]: isChecked.value,
    [`${classNameComponent}__marker--disabled`]: disabled,
    [`${classNameComponent}__marker--invalid`]: !isValid,
  },
]);

const textClasses = computed(() => [
  `${classNameComponent}__text`,
  {
    [`${classNameComponent}__text--checked`]: isChecked.value,
  },
]);

const inputBindings = computed(() => ({
  'aria-disabled': disabled || false,
  'aria-invalid': !isValid,
  'aria-label': srOnlyText.value,
  'aria-required': required || false,
  required,
  disabled,
  id,
  name,
  type: 'checkbox',
  ...attrs,
}));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

async function handleOnChange(event: Event): Promise<void> {
  if (!(event.target instanceof HTMLInputElement) || disabled) {
    return;
  }

  const input = event.target;
  modelValue.value = input.checked;
  await nextTick();
  input.checked = isChecked.value;
}

function handleOnKeydown(event: KeyboardEvent): void {
  if (disabled || event.key !== 'Enter') {
    return;
  }

  event.preventDefault();
  modelValue.value = !isChecked.value;
}
</script>

<template>
  <div :class="rootClasses" :data-testid="rootTestId">
    <input
      :class="`${classNameComponent}__element`"
      v-bind="inputBindings"
      :checked="isChecked"
      :data-testid="elementTestId"
      data-type="button-checkbox"
      @change="handleOnChange"
      @keydown="handleOnKeydown"
    />

    <label :class="labelClasses" :data-testid="labelTestId" :for="id">
      <span :class="markerClasses" :data-testid="markerTestId" aria-hidden="true" />

      <span v-if="hasDefaultSlot" :class="textClasses" :data-testid="textTestId">
        <slot />
      </span>

      <span
        v-else-if="srOnlyText"
        :class="`${classNameComponent}__text ${classNameComponent}__text--sr-only`"
        :data-testid="textTestId"
      >
        {{ srOnlyText }}
      </span>
    </label>
  </div>
</template>
