<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useId } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  name,
  ariaLabel,
  disabled = false,
  dataTestId,
} = defineProps<{
  name: string;
  ariaLabel?: string;
  disabled?: boolean;
  dataTestId?: string;
}>();

const id = useId();
const classNameComponent = `${UIKIT_NAME}-input-slider`;

const model = defineModel<number>('value', { default: 0 });

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const sliderTestId = computed(() => (dataTestId ? `${dataTestId}-slider` : undefined));
const buttonDecrementTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-decrement` : undefined,
);
const buttonIncrementTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-increment` : undefined,
);
const resolvedAriaLabel = computed(() => ariaLabel?.trim() || `Suwak ${name}`);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const onHandleChangeValue = (type: 'increment' | 'decrement') => {
  if (type === 'decrement' && model.value <= 0.1) {
    model.value = 0;
    return;
  }

  if (type === 'increment' && model.value >= 0.9) {
    model.value = 1;
    return;
  }

  model.value = type === 'increment' ? (model.value += 0.1) : (model.value -= 0.1);
};
</script>

<template>
  <div :class="classNameComponent" :data-testid="dataTestId">
    <ButtonAction
      :class="`${classNameComponent}__button ${classNameComponent}__button--decrement`"
      type="button"
      :disabled
      :aria-controls="`input-slider-${id}`"
      :ariaLabel="`Zmniejsz warto\u015b\u0107. Obecna: ${model}`"
      useAriaLabel
      @click.prevent="onHandleChangeValue('decrement')"
      :data-testid="buttonDecrementTestId"
      size="xs"
      variant="ghost"
    >
      <svg
        :class="`${classNameComponent}__button-icon`"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.4158 11H5.10975C4.83873 11 4.57882 11.1054 4.38719 11.2929C4.19555 11.4804 4.08789 11.7348 4.08789 12C4.08789 12.2652 4.19555 12.5196 4.38719 12.7071C4.57882 12.8946 4.83873 13 5.10975 13H19.4158C19.6868 13 19.9467 12.8946 20.1383 12.7071C20.33 12.5196 20.4376 12.2652 20.4376 12C20.4376 11.7348 20.33 11.4804 20.1383 11.2929C19.9467 11.1054 19.6868 11 19.4158 11Z"
        />
      </svg>
    </ButtonAction>

    <input
      :class="`${classNameComponent}__slider`"
      type="range"
      :id="`input-slider-${id}`"
      :name="name"
      :min="0"
      :max="1"
      :step="0.1"
      :value="model"
      :disabled
      :aria-label="resolvedAriaLabel"
      aria-valuemin="0"
      aria-valuemax="1"
      :aria-valuenow="model"
      @input.stop.prevent="(e) => (model = Number((e.target as HTMLInputElement).value))"
      :data-testid="sliderTestId"
    />

    <ButtonAction
      :class="`${classNameComponent}__button ${classNameComponent}__button--increment`"
      type="button"
      :disabled
      :aria-controls="`input-slider-${id}`"
      :ariaLabel="`Zwi\u0119ksz warto\u015b\u0107. Obecna: ${model}`"
      useAriaLabel
      @click.prevent="onHandleChangeValue('increment')"
      :data-testid="buttonIncrementTestId"
      size="xs"
      variant="ghost"
    >
      <svg
        :class="`${classNameComponent}__button-icon`"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.4158 11H13.2846V5C13.2846 4.73478 13.177 4.48043 12.9853 4.29289C12.7937 4.10536 12.5338 4 12.2628 4C11.9917 4 11.7318 4.10536 11.5402 4.29289C11.3486 4.48043 11.2409 4.73478 11.2409 5V11H5.10975C4.83873 11 4.57882 11.1054 4.38719 11.2929C4.19555 11.4804 4.08789 11.7348 4.08789 12C4.08789 12.2652 4.19555 12.5196 4.38719 12.7071C4.57882 12.8946 4.83873 13 5.10975 13H11.2409V19C11.2409 19.2652 11.3486 19.5196 11.5402 19.7071C11.7318 19.8946 11.9917 20 12.2628 20C12.5338 20 12.7937 19.8946 12.9853 19.7071C13.177 19.5196 13.2846 19.2652 13.2846 19V13H19.4158C19.6868 13 19.9467 12.8946 20.1383 12.7071C20.33 12.5196 20.4376 12.2652 20.4376 12C20.4376 11.7348 20.33 11.4804 20.1383 11.2929C19.9467 11.1054 19.6868 11 19.4158 11Z"
        />
      </svg>
    </ButtonAction>
  </div>
</template>
