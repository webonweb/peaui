<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  type ComponentPublicInstance,
} from 'vue';

defineOptions({ inheritAttrs: false });

type ButtonSize = 'xs' | 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Placement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
type PopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | 'true';

type ButtonActionReference = ComponentPublicInstance & {
  $el: HTMLElement;
};

type VerticalPlacement = 'top' | 'bottom';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  placement = 'top',
  size = 'm',
  variant = 'primary',
  disabled = false,
  ariaLabel,
  dataTestId,
  matchTriggerWidth = false,
  popupType,
  useAriaLabel = false,
} = defineProps<{
  size?: ButtonSize;
  variant?: ButtonVariant;
  placement?: Placement;
  dataTestId?: string;
  disabled?: boolean;
  ariaLabel?: string;
  matchTriggerWidth?: boolean;
  popupType?: PopupType;
  useAriaLabel?: boolean;
}>();

const classNameComponent = `${UIKIT_NAME}-popover-button`;
const uid = `popover-button-${useId()}`;
const attrs = useAttrs();
let resizeObserver: ResizeObserver | null = null;
const triggerReference = ref<ButtonActionReference | null>(null);
const popoverReference = ref<HTMLElement | null>(null);
const triggerWidth = ref<number | null>(null);
const resolvedPlacement = ref<Placement>(placement);
const isOpen = ref(false);
const layoutVersion = ref(0);

const emit = defineEmits<{
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'pointerdown', event: PointerEvent): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const placementClass = computed(
  () =>
    `${classNameComponent}__content ${classNameComponent}__content--placement-${resolvedPlacement.value}`,
);
const contentClasses = computed(() => [
  placementClass.value,
  {
    [`${classNameComponent}__content--match-trigger-width`]: matchTriggerWidth,
  },
]);

const sharedStyles = computed(() => ({
  '--unique-anchor': `--anchor-${uid}`,
  '--peaui-popover-button-layout-version': `${layoutVersion.value}`,
  ...(matchTriggerWidth && triggerWidth.value
    ? {
        '--peaui-popover-button-trigger-width': `${triggerWidth.value}px`,
      }
    : {}),
}));
const triggerTestId = computed(() => (dataTestId ? `${dataTestId}-trigger` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
const resolvedAriaHaspopup = computed(() => {
  if (popupType) {
    return popupType;
  }

  return typeof attrs['aria-haspopup'] === 'string' ? attrs['aria-haspopup'] : undefined;
});
const triggerAttrs = computed(() => ({
  ...attrs,
  'aria-controls': uid,
  'aria-expanded': isOpen.value,
  'aria-haspopup': resolvedAriaHaspopup.value,
}));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const syncTriggerWidth = () => {
  triggerWidth.value = triggerReference.value?.$el.getBoundingClientRect().width ?? null;
};

const syncPopoverState = () => {
  isOpen.value = popoverReference.value?.matches(':popover-open') ?? false;
};

const getFlippedPlacement = (nextVerticalPlacement: VerticalPlacement): Placement => {
  if (placement === 'top' || placement === 'bottom') {
    return nextVerticalPlacement;
  }

  if (placement === 'top-left' || placement === 'bottom-left') {
    return nextVerticalPlacement === 'top' ? 'top-left' : 'bottom-left';
  }

  if (placement === 'top-right' || placement === 'bottom-right') {
    return nextVerticalPlacement === 'top' ? 'top-right' : 'bottom-right';
  }

  return placement;
};

const syncPopoverPlacement = () => {
  if (!triggerReference.value?.$el) {
    resolvedPlacement.value = placement;
    return;
  }

  if (
    !['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(placement)
  ) {
    resolvedPlacement.value = placement;
    return;
  }

  const rect = triggerReference.value.$el.getBoundingClientRect();
  const estimatedPopoverHeight = Math.max(popoverReference.value?.scrollHeight ?? 0, 240) + 5;
  const availableAbove = rect.top;
  const availableBelow = window.innerHeight - rect.bottom;
  const nextVerticalPlacement: VerticalPlacement =
    availableBelow >= estimatedPopoverHeight || availableBelow >= availableAbove ? 'bottom' : 'top';

  resolvedPlacement.value = getFlippedPlacement(nextVerticalPlacement);
};

const refreshPopoverPosition = () => {
  syncTriggerWidth();
  syncPopoverPlacement();
  layoutVersion.value += 1;
};

const onHandlePopoverToggle = (event: Event) => {
  const newState = (event as Event & { newState?: 'open' | 'closed' }).newState;

  if (newState) {
    isOpen.value = newState === 'open';
    return;
  }

  syncPopoverState();
};

const onHandleViewportChange = () => {
  if (!isOpen.value) {
    return;
  }

  refreshPopoverPosition();
};

const onHandleTriggerPointerDown = (event: PointerEvent) => {
  refreshPopoverPosition();
  emit('pointerdown', event);
};

const onHandleTriggerKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);

  if (!['Enter', ' ', 'Spacebar', 'ArrowDown'].includes(event.key)) {
    return;
  }

  refreshPopoverPosition();
};

onMounted(() => {
  syncTriggerWidth();
  syncPopoverState();
  popoverReference.value?.addEventListener('toggle', onHandlePopoverToggle as EventListener);
  window.addEventListener('resize', onHandleViewportChange);
  window.addEventListener('scroll', onHandleViewportChange, true);
  window.visualViewport?.addEventListener('resize', onHandleViewportChange);
  window.visualViewport?.addEventListener('scroll', onHandleViewportChange);

  if (typeof ResizeObserver === 'undefined' || !triggerReference.value?.$el) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    if (isOpen.value) {
      refreshPopoverPosition();
      return;
    }

    syncTriggerWidth();
  });
  resizeObserver.observe(triggerReference.value.$el);
});

onBeforeUnmount(() => {
  popoverReference.value?.removeEventListener('toggle', onHandlePopoverToggle as EventListener);
  window.removeEventListener('resize', onHandleViewportChange);
  window.removeEventListener('scroll', onHandleViewportChange, true);
  window.visualViewport?.removeEventListener('resize', onHandleViewportChange);
  window.visualViewport?.removeEventListener('scroll', onHandleViewportChange);
  resizeObserver?.disconnect();
});
</script>

<template>
  <ButtonAction
    ref="triggerReference"
    :variant
    :size
    :ariaLabel
    :useAriaLabel="useAriaLabel"
    :disabled="disabled"
    :data-testid="triggerTestId"
    :class="classNameComponent"
    :popovertarget="uid"
    popovertargetaction="toggle"
    :style="sharedStyles"
    v-bind="triggerAttrs"
    @keydown="onHandleTriggerKeydown"
    @pointerdown="onHandleTriggerPointerDown"
  >
    <slot />
  </ButtonAction>
  <div
    ref="popoverReference"
    :class="contentClasses"
    :style="sharedStyles"
    @click.stop
    :data-test-id="contentTestId"
    :id="uid"
    popover="auto"
  >
    <slot name="content" />
  </div>
</template>
