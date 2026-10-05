<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, onBeforeUnmount, ref, useAttrs, useTemplateRef, watch } from 'vue';

import { acquireDocumentScrollLock } from '@/helpers/browser.helper';
import { collectFocusableElements, trapTabKey } from '@/helpers/focus.helper';

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

const toggleRef = useTemplateRef<HTMLButtonElement>('toggleRef');
const rootRef = useTemplateRef<HTMLDivElement>('rootRef');
let releaseScrollLock: (() => void) | undefined;

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

function handleToggleFullscreen(): void {
  isFullscreenActive.value = !isFullscreenActive.value;
  toggleRef.value?.focus();
}

function handleKeydown(event: KeyboardEvent): void {
  if (!isFullscreenActive.value || event.defaultPrevented) return;
  if (event.key === 'Tab') {
    trapTabKey(event, collectFocusableElements([rootRef.value]), toggleRef.value);
    return;
  }
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  isFullscreenActive.value = false;
  toggleRef.value?.focus();
}

watch(isFullscreenActive, (active) => {
  releaseScrollLock?.();
  releaseScrollLock = active
    ? acquireDocumentScrollLock('peaui-fullscreen-container--scroll-hidden')
    : undefined;
});
onBeforeUnmount(() => releaseScrollLock?.());
</script>

<template>
  <div
    ref="rootRef"
    @keydown="handleKeydown"
    v-bind="rootAttrs"
    :aria-label="ariaLabel"
    :class="rootClasses"
    :data-testid="dataTestId"
  >
    <div :class="`${classNameComponent}__content`" :data-testid="contentTestId">
      <div :class="`${classNameComponent}__content-inner`">
        <slot />
      </div>
    </div>

    <div :class="`${classNameComponent}__actions`">
      <button
        ref="toggleRef"
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
