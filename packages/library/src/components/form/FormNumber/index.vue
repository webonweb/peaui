<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots, useTemplateRef } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { getPaddingRight } from '@/helpers/functions.helper';
import { countDecimalPlaces } from '@/helpers/number.helper';

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
  iconAfter,
  iconBefore,
  canErase,
  placeholder = 'wpisz',
  isRangeVisible = true,
  max,
  min,
  step,
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
  max?: number;
  min?: number;
  step?: number;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  isRangeVisible?: boolean;
  dataTestId?: string;
}>();

const slots = useSlots();
const attrs = useAttrs();
const inputReference = useTemplateRef('inputReference');
const classNameComponent = `${UIKIT_NAME}-form-field-number`;
const modelValue = defineModel<number | undefined | string>('value', {
  required: true,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rightErasePosition = computed(() => getPaddingRight(inputReference.value));

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    type: 'number',
    role: 'spinbutton',
    inputmode: 'numeric',
    ...attrs,
    'aria-valuenow': modelValue.value,
    'aria-valuetext': modelValue.value,
  };

  if (min) {
    bindings['min'] = min;
    bindings['aria-valuemin'] = min;
  }

  if (max) {
    bindings['max'] = max;
    bindings['aria-valuemax'] = max;
  }

  if (step) {
    bindings['step'] = step;
  }

  return bindings;
});

const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const handleBlurValue = (value: number) => {
  if (disabled || readonly) {
    return;
  }

  if (typeof min === 'number' && value <= min) {
    modelValue.value = min as number;
    // @ts-ignore
    inputReference.value.value = min as number;
    return;
  }

  if (typeof max === 'number' && value >= max) {
    modelValue.value = max as number;
    // @ts-ignore
    inputReference.value.value = max as number;
    return;
  }

  const decimalFix = step ? (step.toString().split('.')[1] || '').length || 0 : 0;
  modelValue.value = parseFloat(value.toFixed(decimalFix));
  // @ts-ignore
  inputReference.value.value = parseFloat(value.toFixed(decimalFix));
};

const onArrowClick = (type: 'up' | 'down') => {
  if (disabled || readonly) {
    return;
  }

  const currentStep = step ? step : 1;

  let startValue = type === 'up' && min ? min : 0;
  startValue = type === 'down' && max ? max : startValue;

  let value =
    type === 'up'
      ? (modelValue.value === undefined ? startValue : (modelValue.value as number)) + currentStep
      : (modelValue.value === undefined ? startValue : (modelValue.value as number)) - currentStep;

  handleBlurValue(Number(value.toFixed(countDecimalPlaces(currentStep))));
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
    :name
    :placeholder
    :readonly
    :required
    :data-test-id="dataTestId"
    :right-erase-position="rightErasePosition"
    :value="modelValue"
    @on:remove="modelValue = ''"
  >
    <template v-if="slots.hint" #hint>
      <slot name="hint" />
    </template>

    <template #default="{ props }">
      <input
        v-bind="{ ...bindings, ...props }"
        :class="[
          classNameComponent,
          {
            [`${classNameComponent}--appearance-none`]: !isRangeVisible || readonly || disabled,
          },
        ]"
        :data-testid="elementTestId"
        @blur.stop.prevent="
          (event: Event) => handleBlurValue(Number((event.target as HTMLInputElement).value))
        "
        @keydown.down.prevent="onArrowClick('down')"
        @keydown.up.prevent="onArrowClick('up')"
        data-type="number"
        ref="inputReference"
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
