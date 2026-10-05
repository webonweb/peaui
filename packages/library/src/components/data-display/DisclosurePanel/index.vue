<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
} from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  title,
  ariaLabel,
  dataTestId,
  disabled = false,
  alwaysOpen = false,
  allwaysOpen = false,
} = defineProps<{
  title?: string;
  ariaLabel?: string;
  dataTestId?: string;
  disabled?: boolean;
  /** Keeps the panel expanded and disables its toggle interaction. */
  alwaysOpen?: boolean;
  /** @deprecated Use `alwaysOpen`. */
  allwaysOpen?: boolean;
}>();

const model = defineModel<boolean>('open', { default: false });

const attrs = useAttrs();
const slots = useSlots();
const uid = useId();
const contentInnerRef = ref<HTMLElement | null>(null);
const contentHeight = ref(0);
let resizeObserver: ResizeObserver | null = null;

const classNameComponent = `${UIKIT_NAME}-disclosure-panel`;
const DEFAULT_ACCESSIBLE_NAME = 'Sekcja rozwijana';

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootAttrs = computed(() => ({
  ...attrs,
}));

const resolvedAlwaysOpen = computed(() => alwaysOpen || allwaysOpen);
const isOpen = computed(() => resolvedAlwaysOpen.value || Boolean(model.value));
const isInteractionBlocked = computed(() => disabled || resolvedAlwaysOpen.value);
const hasTitleSlot = useSlotPresence('title');
const hasTitle = computed(() => hasTitleSlot.value || Boolean(title));

const summaryId = computed(() => `${classNameComponent}-summary-${uid}`);
const contentId = computed(() => `${classNameComponent}-content-${uid}`);

const summaryTestId = computed(() => (dataTestId ? `${dataTestId}-summary` : undefined));
const titleTestId = computed(() => (dataTestId ? `${dataTestId}-title` : undefined));
const additionalTestId = computed(() => (dataTestId ? `${dataTestId}-additional` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));

const summaryClasses = computed(() => [
  `${classNameComponent}__summary`,
  isOpen.value && `${classNameComponent}__summary--open`,
  disabled && `${classNameComponent}__summary--disabled`,
]);

const contentClasses = computed(() => [
  `${classNameComponent}__content`,
  isOpen.value && `${classNameComponent}__content--open`,
]);

const resolvedAriaLabel = computed(
  () => ariaLabel?.trim() || (hasTitle.value ? undefined : DEFAULT_ACCESSIBLE_NAME),
);
const summaryAriaLabel = computed(() => (hasTitle.value ? undefined : resolvedAriaLabel.value));
const contentAriaLabel = computed(() => (hasTitle.value ? undefined : resolvedAriaLabel.value));
const contentAriaLabelledBy = computed(() => (hasTitle.value ? summaryId.value : undefined));
const contentStyle = computed(() => ({
  '--peaui-disclosure-content-height': `${contentHeight.value}px`,
}));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const updateHeight = () => {
  if (!contentInnerRef.value) return;
  contentHeight.value = contentInnerRef.value.scrollHeight;
};

const onToggle = (event: Event) => {
  const details = event.currentTarget as HTMLDetailsElement | null;
  if (!details) return;
  if (resolvedAlwaysOpen.value) {
    if (!details.open) details.open = true;
    return;
  }
  if (disabled) return;
  model.value = details.open;
};

const onSummaryClick = (event: MouseEvent) => {
  if (!isInteractionBlocked.value) return;
  event.preventDefault();
  event.stopPropagation();
};

const onSummaryKeydown = (event: KeyboardEvent) => {
  if (!isInteractionBlocked.value) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
  }
};

onMounted(() => {
  updateHeight();
  if (typeof ResizeObserver === 'undefined' || !contentInnerRef.value) return;
  resizeObserver = new ResizeObserver(() => updateHeight());
  resizeObserver.observe(contentInnerRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(
  () => isOpen.value,
  async () => {
    await nextTick();
    updateHeight();
  },
);

// WARNINGS
//-----------------------------------------------------------------------------------------------//
if (import.meta.env.DEV && !hasTitle.value && !ariaLabel) {
  console.warn('[DisclosurePanel] Missing title/ariaLabel. Using generic accessible name.');
}
</script>

<template>
  <details
    :class="classNameComponent"
    v-bind="rootAttrs"
    :data-testid="dataTestId"
    :open="isOpen"
    @toggle="onToggle"
  >
    <summary
      :class="summaryClasses"
      :id="summaryId"
      :aria-label="summaryAriaLabel"
      :aria-disabled="disabled ? 'true' : undefined"
      :data-testid="summaryTestId"
      @click="onSummaryClick"
      @keydown="onSummaryKeydown"
    >
      <span :class="`${classNameComponent}__title`" :data-testid="titleTestId">
        <slot name="title">{{ title }}</slot>
      </span>
      <span :class="`${classNameComponent}__meta`">
        <span
          v-if="slots.additional"
          :class="`${classNameComponent}__additional`"
          :data-testid="additionalTestId"
        >
          <slot name="additional" />
        </span>
        <svg
          v-if="!resolvedAlwaysOpen"
          :class="`${classNameComponent}__icon`"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 6.5L8 10.5L12 6.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </summary>

    <div
      :id="contentId"
      role="region"
      :class="contentClasses"
      :aria-labelledby="contentAriaLabelledBy"
      :aria-label="contentAriaLabel"
      :data-testid="contentTestId"
      :style="contentStyle"
    >
      <div ref="contentInnerRef" :class="`${classNameComponent}__content-inner`">
        <slot />
      </div>
    </div>
  </details>
</template>
