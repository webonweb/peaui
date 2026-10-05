<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import { acquireDocumentScrollLock } from '@/helpers/browser.helper';
import { createDialogMotion } from '@/helpers/dialog-motion.helper';
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { dataTestId, ariaLabel } = defineProps<{
  dataTestId?: string;
  ariaLabel?: string;
}>();

const model = defineModel<boolean>('open', { required: true });

const dialogRef = ref<HTMLDialogElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);

const classNameComponent = `${UIKIT_NAME}-drawer-panel`;
const scrollHiddenClass = `${classNameComponent}--scroll-hidden`;
const uid = useId();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const innerTestId = computed(() => (dataTestId ? `${dataTestId}-inner` : undefined));
const headerTestId = computed(() => (dataTestId ? `${dataTestId}-header` : undefined));
const headerId = computed(() => `${classNameComponent}-header-${uid}`);
const hasHeaderSlot = useSlotPresence('header');

let releaseScrollLock: (() => void) | undefined;

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const motion = createDialogMotion('DrawerPanel');

onMounted(() => {
  if (model.value) {
    openDialog();
  }
});

watch(model, (open) => {
  if (open) openDialog();
  else closeDialog();
});

const setScrollbarHidden = (value: boolean) => {
  if (value && !releaseScrollLock) {
    releaseScrollLock = acquireDocumentScrollLock(scrollHiddenClass);
  } else if (!value) {
    releaseScrollLock?.();
    releaseScrollLock = undefined;
  }
};

const openDialog = () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog || !inner) return;
  setScrollbarHidden(true);
  if (!dialog.open) dialog.showModal();
  motion.run(inner, true);
};

const closeDialog = () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog?.open || !inner) {
    motion.cancel();
    setScrollbarHidden(false);
    return;
  }
  motion.run(inner, false, () => {
    if (dialog.open) dialog.close();
    setScrollbarHidden(false);
  });
};

const onNativeClose = (event: Event) => {
  // A queued native close must not overwrite a newer open request.
  if (event.type === 'close' && dialogRef.value?.open) return;
  if (event.type === 'close') {
    motion.cancel();
    setScrollbarHidden(false);
  }
  model.value = false;
};

onBeforeUnmount(() => {
  motion.cancel();
  setScrollbarHidden(false);
});
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="classNameComponent"
    @close="onNativeClose"
    @cancel.prevent="onNativeClose"
    :data-testid="dataTestId"
    :aria-labelledby="hasHeaderSlot ? headerId : undefined"
    :aria-label="hasHeaderSlot ? undefined : ariaLabel"
  >
    <div ref="innerRef" :class="`${classNameComponent}__inner`" :data-testid="innerTestId">
      <header
        v-if="hasHeaderSlot"
        :id="headerId"
        :class="`${classNameComponent}__header`"
        :data-testid="headerTestId"
      >
        <slot name="header" />
      </header>

      <slot />
    </div>
  </dialog>
</template>
