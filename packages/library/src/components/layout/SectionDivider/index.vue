<script setup lang="ts">
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
  dataTestId,
  direction = 'horizontal',
  size = 's',
} = defineProps<{
  dataTestId?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 's' | 'm' | 'l' | 'xl';
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-section-divider`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const isVertical = computed(() => direction === 'vertical');
const rootTag = computed(() => (isVertical.value ? 'div' : 'hr'));
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--${direction}`,
  `${classNameComponent}--size-${size}`,
]);
const rootAttrs = computed(() => {
  const { role: _role, 'aria-orientation': _ariaOrientation, ...restAttrs } = attrs;

  return {
    ...restAttrs,
    'data-testid': dataTestId ?? attrs['data-testid'],
    role: isVertical.value ? 'separator' : undefined,
    'aria-orientation': isVertical.value ? 'vertical' : undefined,
  };
});
</script>

<template>
  <component :is="rootTag" :class="classes" v-bind="rootAttrs" />
</template>
