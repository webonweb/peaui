<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useId, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  label,
  isLoading = false,
  showActions = true,
  submitButtonLabel = 'Zapisz',
  cancelButtonLabel = 'Anuluj',
  dataTestId,
  disabled,
  actionsPosition = 'bottom-left',
  showCancelButton = true,
  sizeButton = 'xs',
  useAriaLabelledby = true,
} = defineProps<{
  label: string;
  submitButtonLabel?: string;
  isLoading?: boolean;
  showActions?: boolean;
  dataTestId?: string;
  disabled?: boolean;
  cancelButtonLabel?: string;
  actionsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showCancelButton?: boolean;
  sizeButton?: 'xxs' | 'xs' | 's' | 'm' | 'l';
  useAriaLabelledby?: boolean;
}>();

const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-form-container`;
const uid = useId();

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  (e: 'on:cancel'): void;
  (e: 'on:submit'): void;
}>();

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';

const actionsTestId = computed(() => (dataTestId ? `${dataTestId}-actions` : undefined));
const submitTestId = computed(() => (dataTestId ? `${dataTestId}-actions-submit` : undefined));
const cancelTestId = computed(() => (dataTestId ? `${dataTestId}-actions-cancel` : undefined));
const additionalBeforeTestId = computed(() =>
  dataTestId ? `${dataTestId}-additional-before` : undefined,
);
const additionalAfterTestId = computed(() =>
  dataTestId ? `${dataTestId}-additional-after` : undefined,
);
const labelId = computed(() =>
  label && useAriaLabelledby ? `${classNameComponent}-label-${uid}` : undefined,
);

function handleSubmit(): void {
  if (disabled || isLoading) {
    return;
  }

  emit('on:submit');
}
</script>

<template>
  <form
    :class="[classNameComponent, `${classNameComponent}--${actionsPosition}`]"
    :data-testid="dataTestId"
    :aria-busy="isLoading ? 'true' : undefined"
    :aria-labelledby="labelId"
    @submit.prevent="handleSubmit"
  >
    <SpinnerLoader v-if="isLoading" />
    <div :class="`${classNameComponent}__body`" :inert="isLoading">
      <span :id="labelId" :class="`${classNameComponent}__label`" v-if="label">
        {{ label }}
      </span>
      <slot />
      <div
        v-if="showActions"
        :class="`${classNameComponent}__actions`"
        :data-testid="actionsTestId"
      >
        <div
          v-if="slots['additional-before']"
          :class="`${classNameComponent}__actions-additional`"
          :data-testid="additionalBeforeTestId"
        >
          <slot name="additional-before" />
        </div>
        <ButtonAction
          :class="`${classNameComponent}__actions-button`"
          type="submit"
          :ariaLabel="submitButtonLabel"
          :size="sizeButton"
          :data-testid="submitTestId"
          :disabled="disabled || isLoading"
        >
          {{ submitButtonLabel }}
        </ButtonAction>
        <ButtonAction
          v-if="showCancelButton"
          :class="`${classNameComponent}__actions-button`"
          :ariaLabel="cancelButtonLabel"
          variant="secondary"
          @click.prevent="emit('on:cancel')"
          :data-testid="cancelTestId"
          :disabled="isLoading"
          :size="sizeButton"
        >
          {{ cancelButtonLabel }}
        </ButtonAction>
        <div
          v-if="slots['additional-after']"
          :class="`${classNameComponent}__actions-additional`"
          :data-testid="additionalAfterTestId"
        >
          <slot name="additional-after" />
        </div>
      </div>
    </div>
  </form>
</template>
