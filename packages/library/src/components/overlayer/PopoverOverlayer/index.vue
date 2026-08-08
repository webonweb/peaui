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
} from 'vue';

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

type PopoverElement = HTMLElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

type PopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
type ManagedTriggerAttributeName =
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-labelledby'
  | 'role';
type ManagedTriggerAttributes = Partial<Record<ManagedTriggerAttributeName, string>>;

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  placement = 'top',
  disabled = false,
  ariaLabel,
  dataTestId,
  contentClass,
  manageTriggerAccessibility = true,
  matchTriggerWidth = false,
  popupType,
} = defineProps<{
  placement?: Placement;
  dataTestId?: string;
  disabled?: boolean;
  ariaLabel?: string;
  contentClass?: string;
  manageTriggerAccessibility?: boolean;
  matchTriggerWidth?: boolean;
  popupType?: PopupType;
}>();

const attrs = useAttrs();
const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-popover-overlayer`;
const uid = `popover-overlayer-${useId()}`;
const DEFAULT_TRIGGER_ARIA_LABEL = 'Otworz popover';
let resizeObserver: ResizeObserver | null = null;
let managedTriggerElement: HTMLElement | null = null;
let managedTriggerKeyboardElement: HTMLElement | null = null;
let managedTriggerAttributes: ManagedTriggerAttributes = {};
const focusableTriggerSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const preferredTriggerSelector = '[data-peaui-popover-trigger]';

const triggerReference = ref<HTMLElement | null>(null);
const popoverReference = ref<PopoverElement | null>(null);
const isOpen = ref(false);
const triggerWidth = ref<number | null>(null);
const layoutVersion = ref(0);
const hasFocusableTriggerDescendant = ref(false);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const placementClass = computed(
  () => `${classNameComponent}__content ${classNameComponent}__content--placement-${placement}`,
);
const triggerClasses = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--match-trigger-width`]: matchTriggerWidth,
  },
]);
const contentClasses = computed(() => [
  placementClass.value,
  contentClass,
  {
    [`${classNameComponent}__content--match-trigger-width`]: matchTriggerWidth,
  },
]);

const sharedStyles = computed(() => ({
  '--unique-anchor': `--anchor-${uid}`,
  '--peaui-popover-overlayer-layout-version': `${layoutVersion.value}`,
  ...(matchTriggerWidth && triggerWidth.value
    ? {
        '--peaui-popover-overlayer-trigger-width': `${triggerWidth.value}px`,
      }
    : {}),
}));
const triggerTestId = computed(() => (dataTestId ? `${dataTestId}-trigger` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
const resolvedAriaHaspopup = computed(
  () => popupType ?? (attrs['aria-haspopup'] as PopupType | undefined),
);
const normalizedTriggerAriaLabel = computed(() => getNormalizedAttributeValue(ariaLabel));
const normalizedAttrsAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const normalizedTriggerAriaLabelledby = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const resolvedExplicitTriggerAriaLabel = computed(
  () => normalizedTriggerAriaLabel.value ?? normalizedAttrsAriaLabel.value,
);
const shouldProvideDefaultTriggerAccessibility = computed(
  () =>
    manageTriggerAccessibility &&
    attrs.role === undefined &&
    attrs.tabindex === undefined &&
    !hasFocusableTriggerDescendant.value,
);
const resolvedTriggerRole = computed(() => {
  if (typeof attrs.role === 'string') {
    return attrs.role;
  }

  return shouldProvideDefaultTriggerAccessibility.value ? 'button' : undefined;
});
const resolvedManagedTriggerRole = computed(() => {
  if (typeof attrs.role === 'string') {
    return attrs.role;
  }

  return 'button';
});
const resolvedTriggerTabindex = computed(() => {
  if (typeof attrs.tabindex === 'string' || typeof attrs.tabindex === 'number') {
    return attrs.tabindex;
  }

  return shouldProvideDefaultTriggerAccessibility.value ? (disabled ? -1 : 0) : undefined;
});
const resolvedTriggerAriaLabel = computed(() => {
  if (normalizedTriggerAriaLabelledby.value) {
    return undefined;
  }

  if (resolvedExplicitTriggerAriaLabel.value) {
    return resolvedExplicitTriggerAriaLabel.value;
  }

  if (hasVisibleTextContent(slots.default?.())) {
    return undefined;
  }

  return DEFAULT_TRIGGER_ARIA_LABEL;
});

const getTriggerWrapperAttributes = () => {
  const nextAttrs: Record<string, unknown> = {
    ...attrs,
  };

  if (!hasFocusableTriggerDescendant.value) {
    return nextAttrs;
  }

  delete nextAttrs['aria-controls'];
  delete nextAttrs['aria-disabled'];
  delete nextAttrs['aria-expanded'];
  delete nextAttrs['aria-haspopup'];
  delete nextAttrs['aria-label'];
  delete nextAttrs['aria-labelledby'];
  delete nextAttrs.role;
  delete nextAttrs.tabindex;

  return nextAttrs;
};

const triggerBindings = computed(() => {
  if (!manageTriggerAccessibility) return { ...attrs };

  return {
    ...getTriggerWrapperAttributes(),
    'aria-controls': hasFocusableTriggerDescendant.value ? undefined : uid,
    'aria-disabled': hasFocusableTriggerDescendant.value ? undefined : disabled || undefined,
    'aria-expanded': hasFocusableTriggerDescendant.value ? undefined : isOpen.value,
    'aria-haspopup': hasFocusableTriggerDescendant.value ? undefined : resolvedAriaHaspopup.value,
    'aria-label': hasFocusableTriggerDescendant.value ? undefined : resolvedTriggerAriaLabel.value,
    role: hasFocusableTriggerDescendant.value ? undefined : resolvedTriggerRole.value,
    tabindex: hasFocusableTriggerDescendant.value ? undefined : resolvedTriggerTabindex.value,
  };
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

  const nodeProps = (nodes.props as Record<string, unknown> | null) ?? null;

  if (nodeProps?.['aria-hidden'] === true || nodeProps?.['aria-hidden'] === 'true') {
    return false;
  }

  if (nodeProps?.hidden !== undefined) {
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

function hasVisibleTextContentInElement(element: HTMLElement): boolean {
  const hasVisibleTextInNode = (node: Node): boolean => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    const nodeElement = node as HTMLElement;

    if (nodeElement.getAttribute('aria-hidden') === 'true' || nodeElement.hasAttribute('hidden')) {
      return false;
    }

    return Array.from(node.childNodes).some((childNode) => hasVisibleTextInNode(childNode));
  };

  return Array.from(element.childNodes).some((childNode) => hasVisibleTextInNode(childNode));
}

function getNormalizedElementAttributeValue(
  element: HTMLElement,
  attributeName: string,
): string | undefined {
  return getNormalizedAttributeValue(element.getAttribute(attributeName));
}

function hasAssociatedLabelElement(element: HTMLElement): boolean {
  const labelableElement = element as HTMLElement & {
    labels?: NodeListOf<HTMLLabelElement> | null;
  };

  return Boolean(labelableElement.labels?.length);
}

function shouldProvideManagedTriggerAriaLabelFallback(element: HTMLElement): boolean {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName.toUpperCase())) {
    return false;
  }

  if (hasAssociatedLabelElement(element)) {
    return false;
  }

  if (hasVisibleTextContentInElement(element)) {
    return false;
  }

  return true;
}

const syncTriggerWidth = () => {
  triggerWidth.value = triggerReference.value?.getBoundingClientRect().width ?? null;
};

const isNativeInteractiveTriggerElement = (element: HTMLElement) => {
  if (
    ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(element.tagName.toUpperCase())
  ) {
    return true;
  }

  return element.tagName.toUpperCase() === 'A' && element.hasAttribute('href');
};

const clearManagedTriggerKeyboardInteraction = () => {
  managedTriggerKeyboardElement?.removeEventListener('keydown', onHandleManagedTriggerKeydown);
  managedTriggerKeyboardElement = null;
};

const clearManagedTriggerAccessibility = () => {
  clearManagedTriggerKeyboardInteraction();

  if (!managedTriggerElement) {
    managedTriggerAttributes = {};
    return;
  }

  Object.entries(managedTriggerAttributes).forEach(([attributeName, attributeValue]) => {
    if (managedTriggerElement?.getAttribute(attributeName) === attributeValue) {
      managedTriggerElement.removeAttribute(attributeName);
    }
  });

  managedTriggerElement = null;
  managedTriggerAttributes = {};
};

const handleTriggerActivationKeydown = (event: KeyboardEvent) => {
  if (!['Enter', ' ', 'Spacebar', 'ArrowDown', 'Escape'].includes(event.key)) {
    return;
  }

  if (event.key === 'Escape') {
    hidePopover();
    return;
  }

  event.preventDefault();
  togglePopover();
};

const onHandleManagedTriggerKeydown = (event: KeyboardEvent) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  handleTriggerActivationKeydown(event);
};

const syncTriggerAccessibility = () => {
  clearManagedTriggerAccessibility();

  if (!manageTriggerAccessibility) {
    hasFocusableTriggerDescendant.value = false;
    return;
  }

  const focusableTriggerElement =
    triggerReference.value?.querySelector<HTMLElement>(preferredTriggerSelector) ??
    triggerReference.value?.querySelector<HTMLElement>(focusableTriggerSelector) ??
    null;

  hasFocusableTriggerDescendant.value = Boolean(focusableTriggerElement);

  if (!focusableTriggerElement) {
    return;
  }

  const nextManagedTriggerAttributes: ManagedTriggerAttributes = {};
  const focusableTriggerAriaLabel = getNormalizedElementAttributeValue(
    focusableTriggerElement,
    'aria-label',
  );
  const focusableTriggerAriaLabelledby = getNormalizedElementAttributeValue(
    focusableTriggerElement,
    'aria-labelledby',
  );

  if (!focusableTriggerElement.hasAttribute('aria-controls')) {
    nextManagedTriggerAttributes['aria-controls'] = uid;
  }

  if (!focusableTriggerElement.hasAttribute('aria-expanded')) {
    nextManagedTriggerAttributes['aria-expanded'] = `${isOpen.value}`;
  }

  if (resolvedAriaHaspopup.value && !focusableTriggerElement.hasAttribute('aria-haspopup')) {
    nextManagedTriggerAttributes['aria-haspopup'] = resolvedAriaHaspopup.value;
  }

  if (
    normalizedTriggerAriaLabelledby.value &&
    !focusableTriggerAriaLabel &&
    !focusableTriggerAriaLabelledby
  ) {
    nextManagedTriggerAttributes['aria-labelledby'] = normalizedTriggerAriaLabelledby.value;
  }

  if (
    !normalizedTriggerAriaLabelledby.value &&
    !focusableTriggerAriaLabel &&
    !focusableTriggerAriaLabelledby
  ) {
    if (resolvedExplicitTriggerAriaLabel.value) {
      nextManagedTriggerAttributes['aria-label'] = resolvedExplicitTriggerAriaLabel.value;
    } else if (shouldProvideManagedTriggerAriaLabelFallback(focusableTriggerElement)) {
      nextManagedTriggerAttributes['aria-label'] = DEFAULT_TRIGGER_ARIA_LABEL;
    }
  }

  if (
    disabled &&
    !focusableTriggerElement.hasAttribute('aria-disabled') &&
    !focusableTriggerElement.hasAttribute('disabled')
  ) {
    nextManagedTriggerAttributes['aria-disabled'] = 'true';
  }

  if (
    resolvedManagedTriggerRole.value &&
    !focusableTriggerElement.hasAttribute('role') &&
    !isNativeInteractiveTriggerElement(focusableTriggerElement)
  ) {
    nextManagedTriggerAttributes.role = resolvedManagedTriggerRole.value;
  }

  Object.entries(nextManagedTriggerAttributes).forEach(([attributeName, attributeValue]) => {
    focusableTriggerElement.setAttribute(attributeName, attributeValue);
  });

  if (!isNativeInteractiveTriggerElement(focusableTriggerElement)) {
    focusableTriggerElement.addEventListener('keydown', onHandleManagedTriggerKeydown);
    managedTriggerKeyboardElement = focusableTriggerElement;
  }

  managedTriggerElement = focusableTriggerElement;
  managedTriggerAttributes = nextManagedTriggerAttributes;
};

const refreshPopoverPosition = () => {
  syncTriggerWidth();
  layoutVersion.value += 1;
};

const onHandlePopoverToggle = (event: Event) => {
  const newState = (event as Event & { newState?: 'open' | 'closed' }).newState;

  if (newState) {
    isOpen.value = newState === 'open';
    emit('update:open', isOpen.value);
    return;
  }

  isOpen.value = popoverReference.value?.matches(':popover-open') ?? false;
  emit('update:open', isOpen.value);
};

const onHandleViewportChange = () => {
  if (!isOpen.value) {
    return;
  }

  refreshPopoverPosition();
};

const showPopover = () => {
  if (disabled || !popoverReference.value || popoverReference.value.matches(':popover-open')) {
    return;
  }

  refreshPopoverPosition();
  popoverReference.value.showPopover?.();
};

const hidePopover = () => {
  if (!popoverReference.value || !popoverReference.value.matches(':popover-open')) {
    return;
  }

  popoverReference.value.hidePopover?.();
};

const togglePopover = () => {
  if (disabled) {
    return;
  }

  if (popoverReference.value?.matches(':popover-open')) {
    hidePopover();
    return;
  }

  showPopover();
};

const onHandleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  handleTriggerActivationKeydown(event);
};

onMounted(() => {
  syncTriggerAccessibility();
  syncTriggerWidth();
  popoverReference.value?.addEventListener('toggle', onHandlePopoverToggle as EventListener);
  window.addEventListener('resize', onHandleViewportChange);
  window.addEventListener('scroll', onHandleViewportChange, true);
  window.visualViewport?.addEventListener('resize', onHandleViewportChange);
  window.visualViewport?.addEventListener('scroll', onHandleViewportChange);

  if (typeof ResizeObserver === 'undefined' || !triggerReference.value) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    if (isOpen.value) {
      refreshPopoverPosition();
      return;
    }

    syncTriggerWidth();
  });
  resizeObserver.observe(triggerReference.value);
});

onUpdated(() => {
  syncTriggerAccessibility();
});

onBeforeUnmount(() => {
  clearManagedTriggerAccessibility();
  popoverReference.value?.removeEventListener('toggle', onHandlePopoverToggle as EventListener);
  window.removeEventListener('resize', onHandleViewportChange);
  window.removeEventListener('scroll', onHandleViewportChange, true);
  window.visualViewport?.removeEventListener('resize', onHandleViewportChange);
  window.visualViewport?.removeEventListener('scroll', onHandleViewportChange);
  resizeObserver?.disconnect();
});

defineExpose({
  hidePopover,
  refreshPopoverPosition,
  showPopover,
  togglePopover,
});
</script>

<template>
  <div
    ref="triggerReference"
    v-bind="triggerBindings"
    :class="triggerClasses"
    :data-testid="triggerTestId"
    :style="sharedStyles"
    @click="togglePopover"
    @keydown="onHandleTriggerKeydown"
  >
    <slot />
  </div>

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
