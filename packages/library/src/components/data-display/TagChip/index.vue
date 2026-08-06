<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, getCurrentInstance, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  size = 'xs',
  variant = 'outline',
  label,
  active = false,
  dataTestId,
  as = 'button',
} = defineProps<{
  size?: 'xxs' | 'xs' | 's';
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';
  active?: boolean;
  label: string;
  dataTestId?: string;
  as?: 'span' | 'button';
}>();

const classNameComponent = `${UIKIT_NAME}-tag-chip`;
const attrs = useAttrs();
const instance = getCurrentInstance();
const interactiveListenerNames = [
  'onClick',
  'onKeydown',
  'onKeyup',
  'onKeypress',
  'onMousedown',
  'onMouseup',
  'onPointerdown',
  'onPointerup',
  'onTouchstart',
  'onTouchend',
] as const;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const activeClass = computed(() => `${active ? `-active` : ''}`);
const hasActiveProp = computed(() =>
  Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, 'active'),
);
const hasInteractiveHandler = computed(() =>
  interactiveListenerNames.some((listenerName) => attrs[listenerName] !== undefined),
);
const explicitAriaPressed = computed(() => getNormalizedAttributeValue(attrs['aria-pressed']));
const ariaPressed = computed(() => {
  if (as !== 'button') {
    return undefined;
  }

  if (explicitAriaPressed.value) {
    return explicitAriaPressed.value;
  }

  if (!hasActiveProp.value || !hasInteractiveHandler.value) {
    return undefined;
  }

  return active ? 'true' : 'false';
});
const rootAttrs = computed(() => ({
  ...attrs,
  'aria-pressed': ariaPressed.value,
  type: as === 'button' ? 'button' : undefined,
}));

const baseClass = computed(
  () =>
    `${classNameComponent} ${classNameComponent}--size-${size} ${classNameComponent}--variant-${variant}${activeClass.value}`,
);

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}
</script>

<template>
  <component :is="as" v-bind="rootAttrs" :class="baseClass" :data-testid="dataTestId">
    {{ label }}
  </component>
</template>
