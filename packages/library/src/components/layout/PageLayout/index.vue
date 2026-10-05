<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  dataTestId,
  ariaLabel,
  isHeaderSticky = false,
} = defineProps<{
  dataTestId?: string;
  ariaLabel?: string;
  isHeaderSticky?: boolean;
}>();

const attrs = useAttrs();
const slots = useSlots();

const classNameComponent = `${UIKIT_NAME}-page-layout`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootAttrs = computed(() => ({
  ...attrs,
}));

const headerClasses = computed(() => [
  `${classNameComponent}__top`,
  isHeaderSticky && `${classNameComponent}__top--sticky`,
]);

const topTestId = computed(() => (dataTestId ? `${dataTestId}-top` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
</script>

<template>
  <div :class="classNameComponent" v-bind="rootAttrs">
    <header
      v-if="slots.top"
      :class="headerClasses"
      :aria-label="ariaLabel"
      :data-testid="topTestId"
    >
      <slot name="top" />
    </header>

    <main :class="`${classNameComponent}__content`" :data-testid="contentTestId">
      <div v-if="slots.additional" :class="`${classNameComponent}__additional`">
        <slot name="additional" />
      </div>
      <div :class="`${classNameComponent}__body`">
        <slot />
      </div>
    </main>
    <footer v-if="slots.footer" :class="`${classNameComponent}__footer`">
      <slot name="footer" />
    </footer>
  </div>
</template>
