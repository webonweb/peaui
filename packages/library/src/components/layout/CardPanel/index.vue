<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, type Component } from 'vue';
import { useSlotPresence } from '@/composables/useSlotPresence';

type CardPanelTag = 'div' | 'section' | 'article' | 'a' | Component;

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  as = 'div',
  isShadowEnabled = false,
  isHoverEnabled = true,
  dataTestId,
  ariaLabel,
  size = 'm',
  backgroundColor = 'default',
  borderColor = 'default',
} = defineProps<{
  ariaLabel?: string;
  isShadowEnabled?: boolean;
  isHoverEnabled?: boolean;
  dataTestId?: string;
  as?: CardPanelTag;
  backgroundColor?: 'default' | 'primary' | 'grey';
  borderColor?: 'default' | 'primary' | 'grey';
  size?: 'xs' | 's' | 'm' | 'l';
}>();

const classNameComponent = `${UIKIT_NAME}-card-panel`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const baseClass = computed(
  () =>
    `${classNameComponent} ${classNameComponent}--size-${size} ${
      hasHeaderSlot.value ? `${classNameComponent}--with-header` : ''
    } ${isHoverEnabled && !isShadowEnabled ? `${classNameComponent}--hover-enabled` : ''} ${
      isShadowEnabled ? `${classNameComponent}--shadow-enabled` : ''
    } ${classNameComponent}--background-${backgroundColor} ${classNameComponent}--border-${borderColor}`,
);
const hasHeaderSlot = useSlotPresence('header');
</script>

<template>
  <component :is="as" :class="baseClass" :data-testid="dataTestId" :aria-label="ariaLabel">
    <div v-if="hasHeaderSlot" :class="`${classNameComponent}__header`">
      <slot name="header" />
    </div>

    <div
      :class="[
        `${classNameComponent}__content`,
        hasHeaderSlot && `${classNameComponent}__content--with-header`,
      ]"
    >
      <slot />
    </div>
  </component>
</template>
