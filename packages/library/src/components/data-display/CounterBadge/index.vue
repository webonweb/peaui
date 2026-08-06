<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useId } from 'vue';

// TYPES
//-----------------------------------------------------------------------------------------------//
type BadgeVariant = 'info' | 'error' | 'success' | 'danger';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const id = useId();

const {
  value,
  dataTestId,
  variant = 'info',
  size = 's',
} = defineProps<{
  value: number;
  dataTestId?: string;
  variant?: BadgeVariant;
  size?: 's' | 'm' | 'l';
}>();

const classNameComponent = `${UIKIT_NAME}-counter-badge`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${variant}`,
  `${classNameComponent}--size-${size}`,
]);
</script>

<template>
  <span
    :id="`counter-badge-${id}`"
    role="status"
    :class="classes"
    aria-live="polite"
    aria-atomic="true"
    :data-testid="dataTestId"
  >
    {{ value }}
  </span>
</template>
