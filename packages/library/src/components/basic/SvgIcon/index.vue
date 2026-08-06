<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  defineAsyncComponent,
  shallowRef,
  useAttrs,
  useId,
  watch,
  type Component,
} from 'vue';

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
const rootAttrs = computed(() => ({
  'aria-hidden': 'true',
  focusable: 'false',
  ...attrs,
}));

watch(
  () => props.name,
  (nextName) => {
    icon.value = defineAsyncComponent(
      () => import(`../../../assets/icons/${nextName}.svg?component`),
    );
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
