<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { feedbackIconPaths } from '../feedback-icons.shared';
import { computed, useId } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  variant = 'info',
  title,
  description,
  dataTestId,
  size = 'm',
  withShadow = false,
  withBorder = false,
  canClose = false,
} = defineProps<{
  variant?: 'info' | 'error' | 'success' | 'danger';
  title?: string;
  description?: string;
  dataTestId?: string;
  size?: 's' | 'm' | 'l';
  withShadow?: boolean;
  withBorder?: boolean;
  canClose?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:close'): void;
}>();

const classNameComponent = `${UIKIT_NAME}-toast-alert`;

const uid = `toast-${useId()}`;
const toastId = `${uid}-region`;
const titleId = `${uid}-title`;
const descId = `${uid}-desc`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const baseClass = computed(
  () =>
    `${classNameComponent} ${classNameComponent}--variant-${variant} ${classNameComponent}--size-${size} ${withShadow ? `${classNameComponent}--shadow` : ''} ${withBorder ? `${classNameComponent}--border` : ''}`,
);

const isAssertive = computed(() => variant === 'error' || variant === 'danger');
const ariaRole = computed(() => (isAssertive.value ? 'alert' : 'status'));
const ariaLive = computed(() => (isAssertive.value ? 'assertive' : 'polite'));

const ariaLabel = computed(() => title || description || 'Powiadomienie');
const closeButtonAriaLabel = computed(() =>
  title ? `Zamknij powiadomienie: ${title}` : 'Zamknij powiadomienie',
);

const iconTestId = computed(() => (dataTestId ? `${dataTestId}-icon` : undefined));
const titleTestId = computed(() => (dataTestId ? `${dataTestId}-title` : undefined));
const descriptionTestId = computed(() => (dataTestId ? `${dataTestId}-description` : undefined));
const closeButtonTestId = computed(() => (dataTestId ? `${dataTestId}-close-button` : undefined));
const closeIconTestId = computed(() =>
  closeButtonTestId.value ? `${closeButtonTestId.value}-icon` : undefined,
);
</script>

<template>
  <div
    :id="toastId"
    :class="baseClass"
    :data-testid="dataTestId"
    :role="ariaRole"
    :aria-live="ariaLive"
    aria-atomic="true"
    :aria-labelledby="title ? titleId : undefined"
    :aria-describedby="description ? descId : undefined"
    :aria-label="title ? undefined : ariaLabel"
  >
    <svg
      :class="`${classNameComponent}__icon`"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      :data-testid="iconTestId"
    >
      <path v-if="variant === 'info'" :d="feedbackIconPaths.info" />

      <path v-if="variant === 'error'" :d="feedbackIconPaths.error" />
      <path v-if="variant === 'success'" :d="feedbackIconPaths.success" fill="#10893C" />
      <path v-if="variant === 'danger'" :d="feedbackIconPaths.danger" />
    </svg>

    <div :class="`${classNameComponent}__content`">
      <strong
        v-if="title"
        :class="`${classNameComponent}__title ${classNameComponent}__title--size-${size}`"
        :id="titleId"
        :data-testid="titleTestId"
      >
        {{ title }}
      </strong>
      <p
        v-if="description"
        :class="`${classNameComponent}__description ${classNameComponent}__description--size-${size}`"
        :id="descId"
        :data-testid="descriptionTestId"
      >
        {{ description }}
      </p>
    </div>

    <button
      v-if="canClose"
      :class="`${classNameComponent}__close-button`"
      type="button"
      :data-testid="closeButtonTestId"
      :aria-label="closeButtonAriaLabel"
      :aria-controls="toastId"
      @click="emit('on:close')"
    >
      <svg
        :class="`${classNameComponent}__close-icon`"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        focusable="false"
        :data-testid="closeIconTestId"
      >
        <path
          d="M1.75732 1.75732L10.2426 10.2426M10.2426 1.75732L1.75732 10.2426"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>
