<script lang="ts">
export interface NavStepper {
  active?: boolean;
  childrens?: NavStepper[];
  key: string;
  subKey?: string;
  label: string;
  number?: string;
  pathName?: string;
  status: 'default' | 'complete' | 'during' | 'disabled' | 'hidden';
  type?: string;
  additional?: unknown;
}
</script>

<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import { UIKIT_NAME } from '@/constants';
import { sanitizeToSlug } from '@/helpers/string.helepr';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

// TYPES
//-----------------------------------------------------------------------------------------------//
type StepStatus = NavStepper['status'];
type ScrollDirection = 'prev' | 'next';

// CONSTANTS
//-----------------------------------------------------------------------------------------------//
const INTERACTIVE_STATUSES: StepStatus[] = ['during', 'complete'];
const STATUS_LABELS: Record<StepStatus, string> = {
  default: 'Do zrobienia',
  during: 'W trakcie',
  complete: 'Gotowe',
  disabled: 'Zablokowane',
  hidden: 'Ukryte',
};
const SCROLL_AMOUNT = 284;

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  options = [],
  ariaLabel = 'Nawigacja kroków',
  dataTestId,
} = defineProps<{
  options?: NavStepper[];
  ariaLabel?: string;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:select', element: NavStepper): void;
}>();

const classNameComponent = `${UIKIT_NAME}-navigation-stepper`;
const uid = useId();
const viewportReference = ref<HTMLElement | null>(null);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const viewportId = computed(() => `${classNameComponent}-viewport-${uid}`);
const controlTestId = computed(() => (dataTestId ? `${dataTestId}-control` : undefined));
const stepTestId = computed(() => (dataTestId ? `${dataTestId}-step` : undefined));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getStatusLabel(status: StepStatus): string {
  return STATUS_LABELS[status];
}

function getStepNumber(option: NavStepper, index: number): string {
  return option.number ?? String(index + 1);
}

function getStepSlug(option: NavStepper, index: number): string {
  return sanitizeToSlug(option.key || option.label || getStepNumber(option, index));
}

function getStepId(option: NavStepper, index: number): string {
  return `${classNameComponent}-step-${getStepSlug(option, index)}-${uid}`;
}

function getStepLabelForAria(option: NavStepper): string {
  return option.label.replace(/^\s*\d+\.\s*/, '').trim();
}

function getStepAriaLabel(option: NavStepper, index: number): string {
  return `Krok ${getStepNumber(option, index)}. ${getStepLabelForAria(option)}. ${getStatusLabel(option.status)}.`;
}

function isSelectable(option: NavStepper): boolean {
  return INTERACTIVE_STATUSES.includes(option.status);
}

function isCurrentStep(option: NavStepper): boolean {
  return Boolean(option.active) || option.status === 'during';
}

function isCompletedStep(option: NavStepper): boolean {
  return option.status === 'complete';
}

function syncScrollState(): void {
  const viewport = viewportReference.value;

  if (!viewport) {
    canScrollPrev.value = false;
    canScrollNext.value = false;
    return;
  }

  const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);

  canScrollPrev.value = viewport.scrollLeft > 0;
  canScrollNext.value = viewport.scrollLeft < maxScrollLeft - 1;
}

function scrollStepIntoView(index: number): void {
  const option = options[index];

  if (!option) return;

  document.getElementById(getStepId(option, index))?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
}

function focusStep(index: number): void {
  const option = options[index];

  if (!option) return;

  document.getElementById(getStepId(option, index))?.focus();
  scrollStepIntoView(index);
}

function getInteractiveIndexes(): number[] {
  return options.reduce<number[]>((indexes, option, index) => {
    if (isSelectable(option)) {
      indexes.push(index);
    }

    return indexes;
  }, []);
}

function onStepKeydown(event: KeyboardEvent, index: number): void {
  const interactiveIndexes = getInteractiveIndexes();
  const currentIndex = interactiveIndexes.indexOf(index);

  if (currentIndex === -1) return;

  let nextIndex: number | null = null;

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = interactiveIndexes[currentIndex + 1] ?? interactiveIndexes[0] ?? null;
      break;

    case 'ArrowLeft':
      nextIndex =
        interactiveIndexes[currentIndex - 1] ??
        interactiveIndexes[interactiveIndexes.length - 1] ??
        null;
      break;

    case 'Home':
      nextIndex = interactiveIndexes[0] ?? null;
      break;

    case 'End':
      nextIndex = interactiveIndexes[interactiveIndexes.length - 1] ?? null;
      break;

    default:
      return;
  }

  if (nextIndex === null) return;

  event.preventDefault();
  focusStep(nextIndex);
}

function onStepClick(option: NavStepper): void {
  if (!isSelectable(option)) return;
  emit('on:select', option);
}

function scrollSteps(direction: ScrollDirection): void {
  viewportReference.value?.scrollBy({
    left: SCROLL_AMOUNT * (direction === 'prev' ? -1 : 1),
    behavior: 'smooth',
  });
}

function onResize(): void {
  syncScrollState();
}

watch(
  () => options,
  async () => {
    await nextTick();
    syncScrollState();
  },
  { immediate: true, deep: true },
);

onMounted(async () => {
  await nextTick();
  syncScrollState();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div :class="classNameComponent" :data-testid="dataTestId">
    <ButtonAction
      variant="secondary"
      size="xs"
      :class="[`${classNameComponent}__control`, `${classNameComponent}__control--prev`]"
      :ariaLabel="'Przewin do poprzednich krokow'"
      useAriaLabel
      :aria-controls="viewportId"
      :disabled="!canScrollPrev"
      :dataTestId="controlTestId ? `${controlTestId}-prev` : undefined"
      @click="scrollSteps('prev')"
    >
      <SvgIcon
        :class="[
          `${classNameComponent}__control-icon`,
          `${classNameComponent}__control-icon--prev`,
        ]"
        name="arrow"
      />
    </ButtonAction>

    <nav
      :id="viewportId"
      ref="viewportReference"
      :class="`${classNameComponent}__viewport`"
      :aria-label="ariaLabel"
      @scroll="syncScrollState"
    >
      <ol :class="`${classNameComponent}__list`">
        <li
          v-for="(option, index) in options"
          :key="option.key"
          :class="`${classNameComponent}__item`"
        >
          <button
            type="button"
            :id="getStepId(option, index)"
            :class="[
              `${classNameComponent}__step`,
              `${classNameComponent}__step--status-${option.status}`,
              isCurrentStep(option) && `${classNameComponent}__step--current`,
              !isSelectable(option) && `${classNameComponent}__step--disabled`,
            ]"
            :data-testid="stepTestId ? `${stepTestId}-${option.key}` : undefined"
            :aria-label="getStepAriaLabel(option, index)"
            :aria-current="isCurrentStep(option) ? 'step' : undefined"
            :aria-disabled="!isSelectable(option) ? 'true' : undefined"
            :disabled="!isSelectable(option)"
            @click="onStepClick(option)"
            @keydown="onStepKeydown($event, index)"
          >
            <span :class="`${classNameComponent}__status`">
              <span
                :class="[
                  `${classNameComponent}__status-label`,
                  `${classNameComponent}__status-label--status-${option.status}`,
                ]"
              >
                {{ getStatusLabel(option.status) }}
              </span>

              <SvgIcon
                v-if="isCompletedStep(option)"
                :class="`${classNameComponent}__status-icon`"
                name="progressFinish"
              />
            </span>

            <strong
              :class="[
                `${classNameComponent}__label`,
                `${classNameComponent}__label--status-${option.status}`,
              ]"
            >
              {{ option.label }}
            </strong>

            <span
              v-if="typeof option.additional === 'string' && option.additional"
              :class="`${classNameComponent}__additional`"
            >
              {{ option.additional }}
            </span>
          </button>
        </li>
      </ol>
    </nav>

    <ButtonAction
      variant="secondary"
      size="xs"
      :class="[`${classNameComponent}__control`, `${classNameComponent}__control--next`]"
      :ariaLabel="'Przewin do kolejnych krokow'"
      useAriaLabel
      :aria-controls="viewportId"
      :disabled="!canScrollNext"
      :dataTestId="controlTestId ? `${controlTestId}-next` : undefined"
      @click="scrollSteps('next')"
    >
      <SvgIcon
        :class="[
          `${classNameComponent}__control-icon`,
          `${classNameComponent}__control-icon--next`,
        ]"
        name="arrow"
      />
    </ButtonAction>
  </div>
</template>
