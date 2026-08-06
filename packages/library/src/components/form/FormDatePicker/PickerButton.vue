<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  variant = 'ghost',
  disabled,
  dataTestId,
} = defineProps<{
  variant?: 'primary' | 'ghost' | 'outline';
  disabled?: boolean;
  dataTestId?: string;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-date-picker-button`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${variant}`,
  {
    [`${classNameComponent}--disabled`]: Boolean(disabled),
  },
]);
</script>

<template>
  <button
    v-bind="attrs"
    type="button"
    :disabled="disabled || undefined"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled || undefined"
    :class="classes"
    :data-testid="dataTestId"
  >
    <span :class="`${classNameComponent}__label`">
      <slot />
    </span>
  </button>
</template>
