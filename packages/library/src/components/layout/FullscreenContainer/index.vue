<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';

defineOptions({
  inheritAttrs: false,
});

const {
  ariaLabel,
  dataTestId,
  openLabel = 'Otwórz tryb pełnoekranowy',
  closeLabel = 'Zamknij tryb pełnoekranowy',
} = defineProps<{
  ariaLabel?: string;
  dataTestId?: string;
  openLabel?: string;
  closeLabel?: string;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-fullscreen-container`;
const isFullscreenActive = ref(false);

let hasStoredDocumentOverflow = false;
let previousBodyOverflow = '';
let previousDocumentOverflow = '';

const rootAttrs = computed(() => ({
  ...attrs,
}));

const rootClasses = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--fullscreen`]: isFullscreenActive.value,
  },
]);

const toggleLabel = computed(() => (isFullscreenActive.value ? closeLabel : openLabel));
const toggleIconName = computed(() =>
  isFullscreenActive.value ? 'compressArrows' : 'expandArrows',
);
const toggleTestId = computed(() => (dataTestId ? `${dataTestId}-toggle` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
const iconTestId = computed(() => (dataTestId ? `${dataTestId}-icon` : undefined));

function restoreDocumentOverflow(): void {
  if (typeof document === 'undefined' || !hasStoredDocumentOverflow) {
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  document.documentElement.style.overflow = previousDocumentOverflow;
  hasStoredDocumentOverflow = false;
}

function handleToggleFullscreen(): void {
  isFullscreenActive.value = !isFullscreenActive.value;
}

watch(isFullscreenActive, (nextIsFullscreen) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (nextIsFullscreen) {
    hasStoredDocumentOverflow = true;
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return;
  }

  restoreDocumentOverflow();
});

onBeforeUnmount(() => {
  restoreDocumentOverflow();
});
</script>

<template>
  <div v-bind="rootAttrs" :aria-label="ariaLabel" :class="rootClasses" :data-testid="dataTestId">
    <div :class="`${classNameComponent}__content`" :data-testid="contentTestId">
      <div :class="`${classNameComponent}__content-inner`">
        <slot />
      </div>
    </div>

    <div :class="`${classNameComponent}__actions`">
      <button
        :aria-label="toggleLabel"
        :aria-pressed="isFullscreenActive ? 'true' : 'false'"
        :class="`${classNameComponent}__toggle`"
        :data-testid="toggleTestId"
        type="button"
        @click="handleToggleFullscreen"
      >
        <SvgIcon
          :class="`${classNameComponent}__toggle-icon`"
          :dataTestId="iconTestId"
          :name="toggleIconName"
        />

        <span :class="`${classNameComponent}__toggle-label`">
          {{ toggleLabel }}
        </span>
      </button>
    </div>
  </div>
</template>
