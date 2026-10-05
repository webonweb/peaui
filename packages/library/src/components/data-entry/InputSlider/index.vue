<script setup lang="ts">
import { inputSliderPaths } from './input-slider-icons.shared';
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useId, type StyleValue } from 'vue';
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id: providedId,
  form,
  name,
  ariaLabel,
  disabled = false,
  dataTestId,
} = defineProps<{
  id?: string;
  form?: string;
  name: string;
  ariaLabel?: string;
  disabled?: boolean;
  dataTestId?: string;
}>();

const generatedId = useId();
const id = computed(() => providedId || `input-slider-${generatedId}`);
const controlAttrs = () =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'));
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
  <div
    :class="[classNameComponent, attrs.class]"
    :style="attrs.style as StyleValue"
    :data-testid="dataTestId"
  >
    <ButtonAction
      :class="`${classNameComponent}__button ${classNameComponent}__button--decrement`"
      type="button"
      :disabled
      :aria-controls="id"
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
        <path :d="inputSliderPaths.decrement" />
      </svg>
    </ButtonAction>

    <input
      v-bind="controlAttrs()"
      :class="`${classNameComponent}__slider`"
      type="range"
      :id="id"
      :name="name"
      :form="form"
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
      :aria-controls="id"
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
        <path :d="inputSliderPaths.increment" />
      </svg>
    </ButtonAction>
  </div>
</template>
