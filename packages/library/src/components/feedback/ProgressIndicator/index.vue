<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed } from 'vue';

const { steps, active, size, strokeWidth, removeActive, dataTestId } = defineProps<{
  steps: number;
  active?: number;
  size?: number;
  strokeWidth?: number;
  removeActive?: boolean;
  dataTestId?: string;
}>();

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const classNameComponent = `${UIKIT_NAME}-progress-indicator`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const stepsRef = computed(() => Math.max(steps ?? 0, 0));
const activeRef = computed(() => Math.max(active ?? 0, 0));

const sizeRef = computed(() => size ?? 100);
const strokeWidthRef = computed(() => strokeWidth ?? 10);

const center = computed(() => sizeRef.value / 2);
const radius = computed(() => Math.max(center.value - strokeWidthRef.value / 2, 0));
const circumference = computed(() => 2 * Math.PI * radius.value);

const progressPct = computed(() => {
  if (stepsRef.value <= 0) return 0;
  return Math.min(Math.max(activeRef.value / stepsRef.value, 0), 1);
});

const dashOffset = computed(() => circumference.value * (1 - progressPct.value));

const ariaMin = 0;
const ariaMax = computed(() => Math.max(stepsRef.value, 0));
const ariaNow = computed(() => {
  if (ariaMax.value <= 0) return 0;
  return Math.min(Math.max(activeRef.value, 0), ariaMax.value);
});

const ariaLabel = computed(() => {
  if (stepsRef.value <= 0) return 'Postęp: brak zdefiniowanych kroków.';
  if (removeActive) return `Postęp: ${stepsRef.value} kroków.`;
  return `Postęp: krok ${ariaNow.value} z ${stepsRef.value}.`;
});

const displayText = computed(() => {
  if (stepsRef.value <= 0) return '0/0';
  return removeActive ? `${stepsRef.value}` : `${ariaNow.value}/${stepsRef.value}`;
});

const fontSizePx = computed(() => {
  const raw = sizeRef.value * 0.28;
  return Math.round(Math.min(Math.max(raw, 10), sizeRef.value * 0.45));
});

const trackClasses = computed(() => [
  `${classNameComponent}__track`,
  removeActive ? `${classNameComponent}__track--inactive` : `${classNameComponent}__track--active`,
]);

const progressClasses = computed(() => [
  `${classNameComponent}__progress`,
  removeActive && `${classNameComponent}__progress--hidden`,
]);

const rootStyles = computed(() => ({
  width: `${sizeRef.value}px`,
  height: `${sizeRef.value}px`,
}));
</script>

<template>
  <div
    :class="classNameComponent"
    :style="rootStyles"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="ariaMin"
    :aria-valuenow="ariaNow"
    :aria-valuemax="ariaMax"
    :data-testid="dataTestId"
  >
    <svg
      :class="`${classNameComponent}__svg`"
      :height="sizeRef"
      :width="sizeRef"
      :viewBox="`0 0 ${sizeRef} ${sizeRef}`"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        :class="trackClasses"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidthRef"
        fill="none"
      />
      <circle
        :class="progressClasses"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :stroke-width="strokeWidthRef"
        :transform="`rotate(-90 ${center} ${center})`"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
    <span
      :class="`${classNameComponent}__text`"
      :style="{ fontSize: `${fontSizePx}px` }"
      aria-hidden="true"
    >
      {{ displayText }}
    </span>
  </div>
</template>
