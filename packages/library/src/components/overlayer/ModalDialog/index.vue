<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onMounted, ref, useId, useSlots, watch } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { dataTestId, ariaLabel } = defineProps<{
  dataTestId?: string;
  ariaLabel: string;
}>();

const model = defineModel<boolean>('open', { required: true });

const slots = useSlots();
const dialogRef = ref<HTMLDialogElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const classNameComponent = `${UIKIT_NAME}-modal-dialog`;
const uid = useId();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const innerTestId = computed(() => (dataTestId ? `${dataTestId}-inner` : undefined));
const headerTestId = computed(() => (dataTestId ? `${dataTestId}-header` : undefined));
const headerId = computed(() => `${classNameComponent}-header-${uid}`);
const hasHeaderSlot = computed(() => Boolean(slots.header));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
onMounted(() => {
  if (model.value) {
    openDialog();
  }
});

watch(model, async (open) => {
  if (open) {
    await openDialog();
  } else {
    await closeDialog();
  }
});

const animateIn = async (el: HTMLElement) => {
  if (prefersReducedMotion) return;

  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 180,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    fill: 'forwards',
  });
};

const animateOut = async (el: HTMLElement) => {
  if (prefersReducedMotion) return;

  const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 160,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    fill: 'forwards',
  });

  await animation.finished;
};

const openDialog = async () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog || !inner) return;

  if (!dialog.open) {
    dialog.showModal();
  }

  await nextTick();
  await animateIn(inner);
};

const closeDialog = async () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog || !inner) return;

  await animateOut(inner);

  if (dialog.open) {
    dialog.close();
  }
};

const onNativeClose = () => {
  model.value = false;
};
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
