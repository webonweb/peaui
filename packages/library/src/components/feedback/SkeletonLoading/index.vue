<script lang="ts">
export type SkeletonLoadingSize = 'xs' | 's' | 'm' | 'l';
</script>

<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  size = 'm',
  rounded = false,
  ariaLabel = 'Trwa ladowanie tresci.',
  dataTestId,
} = defineProps<{
  size?: SkeletonLoadingSize;
  rounded?: boolean;
  ariaLabel?: string;
  dataTestId?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-skeleton-loading`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${size}`,
  rounded && `${classNameComponent}--rounded`,
]);

const barTestId = computed(() => (dataTestId ? `${dataTestId}-bar` : undefined));
const textTestId = computed(() => (dataTestId ? `${dataTestId}-text` : undefined));
</script>

<template>
  <div
    :class="classes"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    aria-busy="true"
    :data-testid="dataTestId"
  >
    <span :class="`${classNameComponent}__text`" :data-testid="textTestId">
      {{ ariaLabel }}
    </span>

    <span :class="`${classNameComponent}__bar`" :data-testid="barTestId" aria-hidden="true" />
  </div>
</template>
