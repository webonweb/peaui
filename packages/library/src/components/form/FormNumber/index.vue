<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots, useTemplateRef } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { normalizeNumberInput, stepNumberInput } from '@/helpers/number.helper';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import FormField from '@/components/form/FormField/index.vue';
import { getFormFieldEraseOffset } from '@/components/form/FormField/form-field-layout.shared';

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
const inputReference = useTemplateRef<HTMLInputElement>('inputReference');
const classNameComponent = `${UIKIT_NAME}-form-field-number`;
const modelValue = defineModel<number | undefined | string>('value', {
  required: true,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rightErasePosition = computed(() =>
  getFormFieldEraseOffset({
    after,
    iconAfter,
    trailingControlWidth: isRangeVisible && !readonly && !disabled ? 20 : 0,
  }),
);

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    type: 'number',
    role: 'spinbutton',
    inputmode: 'numeric',
    ...attrs,
    'aria-valuenow': modelValue.value,
    'aria-valuetext': modelValue.value,
  };

  if (min !== undefined) {
    bindings['min'] = min;
    bindings['aria-valuemin'] = min;
  }

  if (max !== undefined) {
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
const handleBlurValue = (value: string | number | undefined) => {
  if (disabled || readonly) {
    return;
  }

  const next = normalizeNumberInput(value, { min, max, step });
  modelValue.value = next;
  if (inputReference.value) inputReference.value.value = next === undefined ? '' : String(next);
};

const onArrowClick = (type: 'up' | 'down') => {
  if (disabled || readonly) {
    return;
  }

  handleBlurValue(
    stepNumberInput(inputReference.value?.value ?? modelValue.value, type === 'up' ? 1 : -1, {
      min,
      max,
      step,
    }),
  );
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
          (event: Event) => handleBlurValue((event.target as HTMLInputElement).value)
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
