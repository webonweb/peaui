<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import {
  Comment,
  computed,
  isVNode,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useAttrs,
  useId,
  useSlots,
  type StyleValue,
} from 'vue';

defineOptions({
  inheritAttrs: false,
});

// TYPES
//-----------------------------------------------------------------------------------------------//
type Placement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type Variant = 'default' | 'disabled';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const props = withDefaults(
  defineProps<{
    placement?: Placement;
    dataTestId?: string;
    variant?: Variant;
    disabled?: boolean;
  }>(),
  {
    placement: 'top',
    variant: 'default',
    disabled: false,
  },
);

const attrs = useAttrs();
const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-info-tooltip`;
const uid = `info-tooltip-${useId()}`;
const DEFAULT_TRIGGER_ARIA_LABEL = 'Pokaz dodatkowe informacje';
let resizeObserver: ResizeObserver | null = null;
let animationFrameId: number | null = null;
let describedTriggerElements: HTMLElement[] = [];
let hoverTriggerElement: HTMLElement | null = null;
let focusTriggerElement: HTMLElement | null = null;
const focusableTriggerSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const managedTriggerAncestorSelector =
  'button, a[href], summary, [role="button"], [role="link"], [role="option"], [role="radio"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"]';
const triggerReference = ref<HTMLElement | null>(null);
const tooltipReference = ref<HTMLElement | null>(null);
const layoutVersion = ref(0);
const hasFocusableTriggerDescendant = ref(false);
const managedTriggerAncestor = ref<HTMLElement | null>(null);
const isTooltipVisible = ref(false);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const contentClasses = computed(() => [
  `${classNameComponent}__content`,
  `${classNameComponent}__content--placement-${props.placement}`,
  `${classNameComponent}__content--variant-${props.variant}`,
]);
const triggerBindings = computed(() => {
  const { class: _class, style: _style, 'data-testid': _dataTestId, ...restAttrs } = attrs;

  return restAttrs;
});
const triggerClasses = computed(() => [
  classNameComponent,
  attrs.class,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
  },
]);
const sharedStyles = computed(() => ({
  '--unique-anchor': `--anchor-${uid}`,
  '--peaui-info-tooltip-layout-version': `${layoutVersion.value}`,
}));
const triggerStyles = computed<StyleValue>(() =>
  attrs.style === undefined ? sharedStyles.value : [attrs.style as StyleValue, sharedStyles.value],
);
const triangleClass = computed(() => `${classNameComponent}__triangle`);

const contentTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-content` : undefined,
);
const tooltipTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-tooltip` : undefined,
);
const titleTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-title` : undefined));
const descriptionTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-description` : undefined,
);
const forwardedTriggerTestId = computed(() => getNormalizedAttributeValue(attrs['data-testid']));
const resolvedTriggerTestId = computed(() => contentTestId.value ?? forwardedTriggerTestId.value);
const normalizedTriggerRole = computed(() => getNormalizedAttributeValue(attrs.role));
const normalizedTriggerTabindex = computed(() => getNormalizedAttributeValue(attrs.tabindex));
const normalizedTriggerAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const normalizedTriggerAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const normalizedTriggerAriaDescribedBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-describedby']),
);
const hasOwnFocusableTrigger = computed(
  () => !hasFocusableTriggerDescendant.value && !managedTriggerAncestor.value,
);
const triggerTabindex = computed(() => {
  if (normalizedTriggerTabindex.value !== undefined) {
    return normalizedTriggerTabindex.value;
  }

  if (props.disabled) {
    return undefined;
  }

  return hasOwnFocusableTrigger.value ? '0' : undefined;
});
const triggerRole = computed(() => {
  if (normalizedTriggerRole.value) {
    return normalizedTriggerRole.value;
  }

  if (props.disabled) {
    return undefined;
  }

  return hasOwnFocusableTrigger.value ? 'button' : undefined;
});
const triggerAriaLabel = computed(() => {
  if (normalizedTriggerAriaLabel.value) {
    return normalizedTriggerAriaLabel.value;
  }

  if (props.disabled) {
    return undefined;
  }

  if (!hasOwnFocusableTrigger.value || normalizedTriggerAriaLabelledBy.value) {
    return undefined;
  }

  if (hasVisibleTextContent(slots.default?.())) {
    return undefined;
  }

  return DEFAULT_TRIGGER_ARIA_LABEL;
});
const triggerAriaDescribedBy = computed(() => {
  if (props.disabled) {
    return normalizedTriggerAriaDescribedBy.value;
  }

  if (!hasOwnFocusableTrigger.value) {
    return normalizedTriggerAriaDescribedBy.value;
  }

  const descriptionIds = new Set(
    (normalizedTriggerAriaDescribedBy.value ?? '').split(/\s+/).filter(Boolean),
  );

  descriptionIds.add(uid);

  return Array.from(descriptionIds).join(' ');
});

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function hasVisibleTextContent(nodes: unknown): boolean {
  if (nodes == null || typeof nodes === 'boolean') {
    return false;
  }

  if (typeof nodes === 'string') {
    return nodes.trim().length > 0;
  }

  if (Array.isArray(nodes)) {
    return nodes.some((node) => hasVisibleTextContent(node));
  }

  if (!isVNode(nodes) || nodes.type === Comment) {
    return false;
  }

  if (typeof nodes.children === 'string') {
    return nodes.children.trim().length > 0;
  }

  if (Array.isArray(nodes.children)) {
    return hasVisibleTextContent(nodes.children);
  }

  return false;
}

const onTriggerMouseEnter = () => {
  if (props.disabled) {
    return;
  }

  isTooltipVisible.value = true;
};

const onTriggerMouseLeave = () => {
  isTooltipVisible.value = false;
};

const onTriggerFocusIn = () => {
  if (props.disabled) {
    return;
  }

  isTooltipVisible.value = true;
};

const onTriggerFocusOut = (event: FocusEvent) => {
  const currentTarget = event.currentTarget as HTMLElement | null;
  const relatedTarget = event.relatedTarget as Node | null;

  if (currentTarget && relatedTarget && currentTarget.contains(relatedTarget)) {
    return;
  }

  isTooltipVisible.value = false;
};

const attachHoverListeners = (element: HTMLElement | null) => {
  if (!element) {
    return;
  }

  element.addEventListener('mouseenter', onTriggerMouseEnter);
  element.addEventListener('mouseleave', onTriggerMouseLeave);
};

const detachHoverListeners = (element: HTMLElement | null) => {
  if (!element) {
    return;
  }

  element.removeEventListener('mouseenter', onTriggerMouseEnter);
  element.removeEventListener('mouseleave', onTriggerMouseLeave);
};

const attachFocusListeners = (element: HTMLElement | null) => {
  if (!element) {
    return;
  }

  element.addEventListener('focusin', onTriggerFocusIn);
  element.addEventListener('focusout', onTriggerFocusOut);
};

const detachFocusListeners = (element: HTMLElement | null) => {
  if (!element) {
    return;
  }

  element.removeEventListener('focusin', onTriggerFocusIn);
  element.removeEventListener('focusout', onTriggerFocusOut);
};

const syncVisibilityTriggers = () => {
  if (props.disabled) {
    isTooltipVisible.value = false;
    detachHoverListeners(hoverTriggerElement);
    detachFocusListeners(focusTriggerElement);
    hoverTriggerElement = null;
    focusTriggerElement = null;
    return;
  }

  const nextHoverTrigger = triggerReference.value;
  const nextFocusTrigger = managedTriggerAncestor.value ?? triggerReference.value;

  if (hoverTriggerElement !== nextHoverTrigger) {
    detachHoverListeners(hoverTriggerElement);
    hoverTriggerElement = nextHoverTrigger;
    attachHoverListeners(hoverTriggerElement);
  }

  if (focusTriggerElement !== nextFocusTrigger) {
    detachFocusListeners(focusTriggerElement);
    focusTriggerElement = nextFocusTrigger;
    attachFocusListeners(focusTriggerElement);
  }
};

const addTooltipDescriptionToTrigger = (element: HTMLElement) => {
  const descriptionIds = new Set(
    (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean),
  );

  descriptionIds.add(uid);
  element.setAttribute('aria-describedby', Array.from(descriptionIds).join(' '));
};

const removeTooltipDescriptionFromTrigger = (element: HTMLElement) => {
  const descriptionIds = (element.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((descriptionId) => descriptionId !== uid);

  if (descriptionIds.length === 0) {
    element.removeAttribute('aria-describedby');
    return;
  }

  element.setAttribute('aria-describedby', descriptionIds.join(' '));
};

const getManagedTriggerAncestor = (): HTMLElement | null => {
  let currentElement = triggerReference.value?.parentElement ?? null;

  while (currentElement) {
    if (currentElement.matches(managedTriggerAncestorSelector)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
};

const syncTriggerAccessibility = () => {
  describedTriggerElements.forEach(removeTooltipDescriptionFromTrigger);
  describedTriggerElements = [];

  if (props.disabled) {
    hasFocusableTriggerDescendant.value = false;
    managedTriggerAncestor.value = null;
    syncVisibilityTriggers();
    return;
  }

  const nextFocusableTriggerElements = triggerReference.value
    ? Array.from(triggerReference.value.querySelectorAll<HTMLElement>(focusableTriggerSelector))
    : [];

  managedTriggerAncestor.value =
    nextFocusableTriggerElements.length === 0 ? getManagedTriggerAncestor() : null;

  const nextDescribedTriggerElements =
    nextFocusableTriggerElements.length > 0
      ? nextFocusableTriggerElements
      : managedTriggerAncestor.value
        ? [managedTriggerAncestor.value]
        : [];

  hasFocusableTriggerDescendant.value = nextFocusableTriggerElements.length > 0;
  nextDescribedTriggerElements.forEach(addTooltipDescriptionToTrigger);
  describedTriggerElements = nextDescribedTriggerElements;
  syncVisibilityTriggers();
};

const refreshTooltipPosition = () => {
  layoutVersion.value += 1;
};

const onHandleViewportChange = () => {
  refreshTooltipPosition();
};

const scheduleInitialTooltipRefresh = () => {
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    refreshTooltipPosition();
    return;
  }

  animationFrameId = window.requestAnimationFrame(() => {
    animationFrameId = null;
    refreshTooltipPosition();
  });
};

onMounted(() => {
  syncTriggerAccessibility();
  window.addEventListener('resize', onHandleViewportChange);
  window.visualViewport?.addEventListener('resize', onHandleViewportChange);
  scheduleInitialTooltipRefresh();

  if (typeof ResizeObserver === 'undefined') {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    refreshTooltipPosition();
  });

  if (triggerReference.value) {
    resizeObserver.observe(triggerReference.value);
  }

  if (tooltipReference.value) {
    resizeObserver.observe(tooltipReference.value);
  }
});

onUpdated(() => {
  syncTriggerAccessibility();
});

onBeforeUnmount(() => {
  describedTriggerElements.forEach(removeTooltipDescriptionFromTrigger);
  detachHoverListeners(hoverTriggerElement);
  detachFocusListeners(focusTriggerElement);
  window.removeEventListener('resize', onHandleViewportChange);
  window.visualViewport?.removeEventListener('resize', onHandleViewportChange);
  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId);
  }
  resizeObserver?.disconnect();
});
</script>

<template>
  <div
    ref="triggerReference"
    v-bind="triggerBindings"
    :role="triggerRole"
    :tabindex="triggerTabindex"
    :aria-label="triggerAriaLabel"
    :aria-describedby="triggerAriaDescribedBy"
    :data-open="isTooltipVisible ? 'true' : undefined"
    :class="triggerClasses"
    :data-testid="resolvedTriggerTestId"
    :style="triggerStyles"
  >
    <slot />
  </div>
  <div
    ref="tooltipReference"
    role="tooltip"
    :id="uid"
    :class="contentClasses"
    :data-testid="tooltipTestId"
    :style="sharedStyles"
    :aria-hidden="props.disabled ? 'true' : undefined"
  >
    <strong v-if="slots.title" :class="`${classNameComponent}__title`" :data-testid="titleTestId">
      <slot name="title" />
    </strong>
    <p
      v-if="slots.description"
      :class="`${classNameComponent}__description`"
      :data-testid="descriptionTestId"
    >
      <slot name="description" />
    </p>
  </div>
</template>
