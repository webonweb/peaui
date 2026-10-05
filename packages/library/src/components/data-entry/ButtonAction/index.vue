<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { Comment, computed, getCurrentInstance, inject, isVNode, useAttrs, useSlots } from 'vue';
import { NATIVE_SLOT_VERSION } from '@/composables/useSlotPresence';

// TYPES
//-----------------------------------------------------------------------------------------------//
type ButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const classNameComponent = `${UIKIT_NAME}-button-action`;
const DEFAULT_ACCESSIBLE_NAME = 'Przycisk akcji';

const {
  size = 'm',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ariaLabel,
  dataTestId,
  useAriaLabel = false,
} = defineProps<{
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  disabled?: boolean;
  ariaLabel?: string;
  dataTestId?: string;
  useAriaLabel?: boolean;
}>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const nativeSlotVersion = inject(NATIVE_SLOT_VERSION, undefined);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${size}`,
  `${classNameComponent}--variant-${variant}`,
  disabled && `${classNameComponent}--is-disabled`,
]);

const normalizedAriaLabel = computed(() => getNormalizedAttributeValue(ariaLabel));
const normalizedAttrsAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const normalizedAttrsAriaLabelledby = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const resolvedAriaLabel = computed(
  () => normalizedAriaLabel.value ?? normalizedAttrsAriaLabel.value ?? DEFAULT_ACCESSIBLE_NAME,
);

const hasVisibleTextContent = (nodes: unknown): boolean => {
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

  if (nodes.type === 'slot') {
    const name = typeof nodes.props?.name === 'string' ? nodes.props.name : 'default';
    // A forwarded WC slot is projected after this nested Vue button renders.
    // Inspect its existing light-DOM nodes without replacing their identity.
    for (let owner = instance; owner; owner = owner.parent) {
      const host: unknown = Reflect.get(owner, 'ce');
      if (typeof HTMLElement === 'undefined' || !(host instanceof HTMLElement)) continue;
      const projected: unknown = Reflect.get(host, '_slots');
      const content: unknown =
        typeof projected === 'object' && projected !== null
          ? Reflect.get(projected, name)
          : undefined;
      return (
        Array.isArray(content) &&
        content.some((node: unknown) => node instanceof Node && Boolean(node.textContent?.trim()))
      );
    }
  }

  if (typeof nodes.children === 'string') {
    return nodes.children.trim().length > 0;
  }

  if (Array.isArray(nodes.children)) {
    return hasVisibleTextContent(nodes.children);
  }

  return false;
};

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

const getButtonAttrs = () => {
  // Native text mutations need to invalidate even a compiler-stable forwarded slot.
  void nativeSlotVersion?.value;
  const shouldUseAriaLabel = useAriaLabel || !hasVisibleTextContent(slots.default?.());

  return {
    ...attrs,
    ...(shouldUseAriaLabel && !normalizedAttrsAriaLabelledby.value
      ? { 'aria-label': resolvedAriaLabel.value }
      : {}),
  };
};
</script>

<template>
  <button
    :type
    v-bind="getButtonAttrs()"
    :class="classes"
    :disabled="disabled"
    :data-testid="dataTestId"
  >
    <slot />
  </button>
</template>
