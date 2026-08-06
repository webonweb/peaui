<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue';

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
const classNameComponent = `${UIKIT_NAME}-drawer-panel`;
const scrollHiddenClass = `${classNameComponent}--scroll-hidden`;
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

const setScrollbarHidden = (value: boolean) => {
  if (typeof document === 'undefined') return;

  const body = document.body;
  const root = document.documentElement;
  if (!body || !root) return;

  body.classList.toggle(scrollHiddenClass, value);
  root.classList.toggle(scrollHiddenClass, value);
};

const animateIn = async (el: HTMLElement) => {
  if (prefersReducedMotion) return;

  el.animate(
    [
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    {
      duration: 220,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    },
  );
};

const animateOut = async (el: HTMLElement) => {
  if (prefersReducedMotion) return;

  const animation = el.animate(
    [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 },
    ],
    {
      duration: 180,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'forwards',
    },
  );

  await animation.finished;
};

const openDialog = async () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog || !inner) return;

  setScrollbarHidden(true);
  if (!dialog.open) {
    dialog.showModal();
  }

  await nextTick();
  await animateIn(inner);
};

const closeDialog = async () => {
  const dialog = dialogRef.value;
  const inner = innerRef.value;
  if (!dialog || !inner) {
    setScrollbarHidden(false);
    return;
  }

  await animateOut(inner);

  if (dialog.open) {
    dialog.close();
  }

  setScrollbarHidden(false);
};

const onNativeClose = () => {
  model.value = false;
};

onBeforeUnmount(() => {
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
