<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { Comment, computed, getCurrentInstance, isVNode, useAttrs, useSlots } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  path,
  size = 's',
  variant = 'default',
  ariaLabel,
  dataTestId,
} = defineProps<{
  path: string;
  ariaLabel?: string;
  dataTestId?: string;
  size?: 'm' | 's' | 'xs';
  variant?: 'default' | 'primary';
}>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const routerLinkComponent = instance?.appContext.components.RouterLink;
const classNameComponent = `${UIKIT_NAME}-navigation-link`;
const DEFAULT_ACCESSIBLE_NAME = 'Link nawigacyjny';

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const normalizedPath = computed(() => path.trim());
const normalizedAriaLabel = computed(() => ariaLabel?.trim() || undefined);
const normalizedAttrsAriaLabel = computed(() => `${attrs['aria-label'] ?? ''}`.trim() || undefined);
const normalizedTarget = computed(() => `${attrs.target ?? ''}`.trim() || undefined);
const normalizedRel = computed(() => `${attrs.rel ?? ''}`.trim() || undefined);
const isHashLink = computed(() => normalizedPath.value.startsWith('#'));
const isProtocolLink = computed(
  () => /^[a-z][a-z\d+.-]*:/i.test(normalizedPath.value) || normalizedPath.value.startsWith('//'),
);
const isRouterLink = computed(
  () => Boolean(routerLinkComponent) && !isHashLink.value && !isProtocolLink.value,
);
const rootTag = computed(() =>
  isRouterLink.value && routerLinkComponent ? routerLinkComponent : 'a',
);
const hasVisibleLabel = computed(() => hasVisibleTextContent(slots.default?.()));
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${size}`,
  `${classNameComponent}--variant-${variant}`,
]);
const rootAttrs = computed(() => {
  const {
    href: _href,
    to: _to,
    'data-testid': attrsDataTestId,
    'aria-label': _ariaLabel,
    rel: _rel,
    ...restAttrs
  } = attrs;

  const resolvedRel =
    normalizedTarget.value === '_blank'
      ? (normalizedRel.value ?? 'noopener noreferrer')
      : normalizedRel.value;

  return {
    ...restAttrs,
    'data-testid': dataTestId ?? attrsDataTestId,
    'aria-label': hasVisibleLabel.value
      ? undefined
      : (normalizedAriaLabel.value ?? normalizedAttrsAriaLabel.value ?? DEFAULT_ACCESSIBLE_NAME),
    href: isRouterLink.value ? undefined : normalizedPath.value,
    to: isRouterLink.value ? normalizedPath.value : undefined,
    rel: resolvedRel,
  };
});

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
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
</script>

<template>
  <component :is="rootTag" :class="classes" v-bind="rootAttrs">
    <slot />
  </component>
</template>
