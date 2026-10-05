<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { getIconComponent } from './icon-component';
import { UIKIT_NAME } from '@/constants';
import { computed, shallowRef, useAttrs, useId, watch, type Component } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const id = useId();
const attrs = useAttrs();

const props = defineProps<{
  dataTestId?: string;
  name: string;
}>();

const classNameComponent = `${UIKIT_NAME}-svg-icon`;
const icon = shallowRef<Component | null>(null);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootAttrs = computed(() => {
  const accessibleName = attrs['aria-label'] || attrs['aria-labelledby'];

  return {
    ...(!accessibleName && attrs['aria-hidden'] === undefined ? { 'aria-hidden': 'true' } : {}),
    ...(accessibleName && attrs.role === undefined ? { role: 'img' } : {}),
    focusable: 'false',
    ...attrs,
  };
});

watch(
  () => props.name,
  (nextName) => {
    icon.value = getIconComponent(nextName);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <component
    v-bind="rootAttrs"
    :key="props.name"
    :id
    :class="classNameComponent"
    :data-testid="props.dataTestId"
    :is="icon"
  />
</template>
