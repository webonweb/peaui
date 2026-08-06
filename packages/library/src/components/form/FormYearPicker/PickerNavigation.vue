<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { previousLabel, nextLabel, previousDisabled, nextDisabled, dataTestId } = defineProps<{
  previousLabel: string;
  nextLabel: string;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:previous'): void;
  (e: 'on:next'): void;
}>();

const classNameComponent = `${UIKIT_NAME}-form-year-picker-navigation`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const previousButtonTestId = computed(() =>
  dataTestId ? `${dataTestId}-previous-button` : undefined,
);
const nextButtonTestId = computed(() => (dataTestId ? `${dataTestId}-next-button` : undefined));
</script>

<template>
  <div :class="classNameComponent">
    <button
      :class="`${classNameComponent}__button`"
      :disabled="previousDisabled"
      :aria-disabled="previousDisabled || undefined"
      :aria-label="previousLabel"
      :title="previousLabel"
      :data-testid="previousButtonTestId"
      type="button"
      @click.prevent="emit('on:previous')"
    >
      <SvgIcon
        :class="[`${classNameComponent}__icon`, `${classNameComponent}__icon--previous`]"
        name="arrow"
      />
    </button>

    <button
      :class="`${classNameComponent}__button`"
      :disabled="nextDisabled"
      :aria-disabled="nextDisabled || undefined"
      :aria-label="nextLabel"
      :title="nextLabel"
      :data-testid="nextButtonTestId"
      type="button"
      @click.prevent="emit('on:next')"
    >
      <SvgIcon
        :class="[`${classNameComponent}__icon`, `${classNameComponent}__icon--next`]"
        name="arrow"
      />
    </button>
  </div>
</template>
