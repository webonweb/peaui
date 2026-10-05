<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs } from 'vue';
import { useSlotPresence } from '@/composables/useSlotPresence';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { columns = 4, gap = 6 } = defineProps<{
  /** Liczba kolumn siatki; domyślnie 4. */
  columns?: number;
  gap?: number;
}>();

const attrs = useAttrs();

const classNameComponent = `${UIKIT_NAME}-grid-section`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const hasAdditional = useSlotPresence('additional');
const rootAttrs = computed(() => ({
  ...attrs,
}));

const columnsMinusOne = computed(() => Math.max(columns - 1, 1));
</script>

<template>
  <div :class="classNameComponent" v-bind="rootAttrs">
    <div v-if="hasAdditional" :class="`${classNameComponent}__additional`">
      <slot name="additional" />
    </div>

    <div
      :class="[
        `${classNameComponent}__content`,
        columns > 1 && `${classNameComponent}__content--multi`,
      ]"
      :style="{
        '--peaui-grid-gap-y': String(gap),
        '--columns-minus-one': columnsMinusOne,
        '--columns': columns,
      }"
    >
      <slot />
    </div>
  </div>
</template>
