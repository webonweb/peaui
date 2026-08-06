<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { useAttrs } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const attrs = useAttrs();

const { dataTestId } = defineProps<{
  dataTestId?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-spinner-loader`;
</script>

<template>
  <div
    v-bind="attrs"
    :class="[classNameComponent, `${classNameComponent}--fullscreen`]"
    aria-busy="true"
    :data-testid="dataTestId"
  >
    <div :class="`${classNameComponent}__text`" role="status" aria-live="polite" aria-atomic="true">
      &#321;adowanie... Prosz&#281; czeka&#263;.
    </div>

    <div :class="`${classNameComponent}__spinner`" aria-hidden="true"></div>
  </div>
</template>
