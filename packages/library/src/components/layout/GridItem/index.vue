<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  colspan,
  columns = 2,
  gap = 6,
  grid = true,
} = defineProps<{
  colspan?: number;
  columns?: number;
  gap?: number;
  grid?: boolean;
}>();

const attrs = useAttrs();
const slots = useSlots();

const classNameComponent = `${UIKIT_NAME}-grid-item`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const slotColumns = computed(() => {
  if (columns && columns > 0) return columns;
  const len = slots.default?.()?.length ?? 1;
  return Math.max(len, 1);
});

const styleVars = computed(() => ({
  '--peaui-grid-item-colspan': String(Math.max(colspan ?? 1, 1)),
  '--peaui-grid-item-columns': String(slotColumns.value),
  '--peaui-grid-item-gap': String(gap),
}));

const classes = computed(() => [classNameComponent, grid && `${classNameComponent}--grid`]);

const bindings = computed(() => ({
  ...attrs,
}));
</script>

<template>
  <div v-bind="bindings" :class="classes" :style="styleVars">
    <slot />
  </div>
</template>
