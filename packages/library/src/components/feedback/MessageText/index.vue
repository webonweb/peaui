<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { feedbackIconPaths } from '../feedback-icons.shared';
import { computed } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  dataTestId,
  variant = 'default',
  size = 's',
  id,
  withIcon = true,
  ownIcon,
} = defineProps<{
  id: string;
  dataTestId?: string;
  size?:
    'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'heading-xs' | 'heading-s' | 'heading-m' | 'heading-l';
  variant?: 'info' | 'error' | 'success' | 'danger' | 'default' | 'white';
  withIcon?: boolean;
  ownIcon?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-message-text`;
const BUILTIN_ICON_VARIANTS = ['info', 'error', 'success', 'danger'] as const;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${size}`,
  `${classNameComponent}--variant-${variant}`,
]);

const iconTestId = computed(() => (dataTestId ? `${dataTestId}-icon` : undefined));
const textTestId = computed(() => (dataTestId ? `${dataTestId}-title` : undefined));
const showVariantIcon = computed(
  () => withIcon && !ownIcon && (BUILTIN_ICON_VARIANTS as readonly string[]).includes(variant),
);
</script>
<template>
  <div :class="classes" :data-testid="dataTestId" :id="id">
    <SvgIcon
      v-if="ownIcon"
      :name="ownIcon"
      :data-testid="iconTestId"
      aria-hidden="true"
      focusable="false"
      :class="`${classNameComponent}__icon-own ${classNameComponent}__icon-own--variant-${variant}`"
    />
    <svg
      :class="`${classNameComponent}__icon`"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      :data-testid="iconTestId"
      v-if="showVariantIcon"
    >
      <path v-if="variant === 'info'" :d="feedbackIconPaths.info" />

      <path v-if="variant === 'error'" :d="feedbackIconPaths.error" />
      <path v-if="variant === 'success'" :d="feedbackIconPaths.success" fill="#10893C" />
      <path v-if="variant === 'danger'" :d="feedbackIconPaths.danger" />
    </svg>
    <p :data-testid="textTestId" :class="`${classNameComponent}__content`"><slot /></p>
  </div>
</template>
