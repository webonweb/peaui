<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useId, useSlots } from 'vue';

// TYPES
//-----------------------------------------------------------------------------------------------//
type Tab = {
  key: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  isValid?: boolean;
};

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  tabs = [],
  dataTestId,
  ariaLabel,
  withBackround = true,
} = defineProps<{
  tabs?: Tab[];
  dataTestId?: string;
  ariaLabel: string;
  withBackround?: boolean;
}>();

const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-navigation-tabs`;
const uid = useId();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const navClasses = computed(() => [
  classNameComponent,
  !withBackround && `${classNameComponent}--without-background`,
]);
const buttonTestId = computed(() => (dataTestId ? `${dataTestId}-button` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  (e: 'on:select', tab: Tab): void;
}>();

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getTabId(key: string) {
  return `navigation-tabs-${key}-${uid}`;
}

function getSlotName(key: string, position: 'before' | 'after') {
  const preferred = `navigation-tabs-${key}-${position}`;
  const legacy = `nav-tabs-${key}-${position}`;

  return slots[preferred] ? preferred : legacy;
}

function onKeydown(event: KeyboardEvent, index: number) {
  const enabledTabs = tabs
    .map((tab, originalIndex) => ({ tab, originalIndex }))
    .filter(({ tab }) => !tab.disabled);

  const current = enabledTabs.findIndex(({ originalIndex }) => originalIndex === index);
  if (current === -1) return;

  let nextIndex: number | null = null;

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = enabledTabs[(current + 1) % enabledTabs.length]?.originalIndex ?? null;
      break;

    case 'ArrowLeft':
      nextIndex =
        enabledTabs[(current - 1 + enabledTabs.length) % enabledTabs.length]?.originalIndex ?? null;
      break;

    case 'Home':
      nextIndex = enabledTabs[0]?.originalIndex ?? null;
      break;

    case 'End':
      nextIndex = enabledTabs[enabledTabs.length - 1]?.originalIndex ?? null;
      break;

    default:
      return;
  }

  if (nextIndex === null) return;
  event.preventDefault();
  const tab = tabs[nextIndex];
  if (tab) {
    document.getElementById(getTabId(tab.key))?.focus();
  }
}
</script>

<template>
  <nav :class="navClasses" :aria-label="ariaLabel" :data-testid="dataTestId">
    <button
      type="button"
      :key="tab.key"
      :id="getTabId(tab.key)"
      :aria-pressed="tab.active ? 'true' : 'false'"
      v-for="(tab, index) in tabs"
      :class="[
        `${classNameComponent}__button`,
        {
          [`${classNameComponent}__button--disabled`]: tab.disabled,
          [`${classNameComponent}__button--active`]: tab.active,
          [`${classNameComponent}__button--invalid`]: tab.isValid === false,
        },
      ]"
      :disabled="tab.disabled"
      :data-testid="buttonTestId ? `${buttonTestId}-${tab.key}` : undefined"
      :aria-label="tab.label"
      @keydown="onKeydown($event, index)"
      @click.prevent="emit('on:select', tab)"
    >
      <slot :name="getSlotName(tab.key, 'before')" />
      <span :data-testid="contentTestId ? `${contentTestId}-${tab.key}` : undefined">{{
        tab.label
      }}</span>
      <slot :name="getSlotName(tab.key, 'after')" />
    </button>
  </nav>
</template>
