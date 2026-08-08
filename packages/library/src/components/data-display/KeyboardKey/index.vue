<script lang="ts">
import type {
  KeyboardKeyFormat,
  KeyboardKeyPlatform,
  KeyboardKeySize,
} from './keyboard-key.shared';

export interface KeyboardKeyProps {
  /** Klawisz albo uporządkowana kombinacja tokenów. String rozdziela tokeny znakiem plus. */
  keys: string | readonly string[];
  /** Platforma używana do mapowania przenośnego tokenu Mod i symboli modyfikatorów. */
  platform?: KeyboardKeyPlatform;
  /** Symbole skracają zapis wizualny; pełne nazwy pozostają dostępne dla AT. */
  format?: KeyboardKeyFormat;
  /** Rozmiar keycapów zgodny ze skalą kompaktowych komponentów PeaUI. */
  size?: KeyboardKeySize;
  /** Wariant inline dopasowuje komponent do wiersza tekstu; false tworzy osobny blok. */
  inline?: boolean;
  /** Wyłącznie wizualny separator kolejnych klawiszy. */
  separator?: string;
  /** Pełna dostępna nazwa zastępująca automatycznie złożoną frazę. */
  ariaLabel?: string;
  /** Ogranicza kontrast nieaktywnej wizualnie wskazówki bez dodawania semantyki disabled. */
  muted?: boolean;
  /** Stabilny selektor testowy elementu głównego. */
  dataTestId?: string;
}

export type {
  KeyboardKeyFormat,
  KeyboardKeyPlatform,
  KeyboardKeySize,
  KeyboardKeySlotState,
  ResolvedKeyboardKeyPlatform,
} from './keyboard-key.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, onMounted, ref, useAttrs, watch, type CSSProperties } from 'vue';

import {
  createKeyboardKeyAccessibleLabel,
  detectKeyboardPlatform,
  resolveInitialKeyboardPlatform,
  resolveKeyboardKeyCombination,
  type KeyboardKeySlotState,
  type ResolvedKeyboardKeyPlatform,
} from './keyboard-key.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<KeyboardKeyProps>(), {
  platform: 'auto',
  format: 'symbol',
  size: 's',
  inline: true,
  separator: '+',
  ariaLabel: '',
  muted: false,
});

const slots = defineSlots<{
  key?: (state: KeyboardKeySlotState) => unknown;
  separator?: (state: { index: number; separator: string }) => unknown;
}>();

const attrs = useAttrs();
const root = `${UIKIT_NAME}-keyboard-key`;
const mounted = ref(false);
const detectedPlatform = ref<ResolvedKeyboardKeyPlatform>('generic');

const resolvedPlatform = computed<ResolvedKeyboardKeyPlatform>(() =>
  props.platform === 'auto' ? detectedPlatform.value : props.platform,
);
const states = computed(() =>
  resolveKeyboardKeyCombination(props.keys, resolvedPlatform.value, props.format),
);
const accessibleLabel = computed(() =>
  createKeyboardKeyAccessibleLabel(
    states.value,
    normalizeAttribute(attrs['aria-label']) ?? props.ariaLabel,
  ),
);
const rootClasses = computed(() => [
  root,
  `${root}--${props.inline ? 'inline' : 'block'}`,
  `${root}--size-${props.size}`,
  props.muted && `${root}--muted`,
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    'aria-label': _ariaLabel,
    'aria-keyshortcuts': _ariaKeyshortcuts,
    ...rest
  } = attrs;
  return rest;
});

function normalizeAttribute(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function detectClientPlatform(): ResolvedKeyboardKeyPlatform {
  if (typeof navigator === 'undefined') return 'generic';
  return detectKeyboardPlatform(navigator.userAgent, navigator.platform);
}

watch(
  () => props.platform,
  (platform) => {
    detectedPlatform.value =
      platform === 'auto' && mounted.value
        ? detectClientPlatform()
        : resolveInitialKeyboardPlatform(platform);
  },
  { immediate: true },
);

onMounted(() => {
  mounted.value = true;
  if (props.platform === 'auto') detectedPlatform.value = detectClientPlatform();
});
</script>

<template>
  <span
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    :data-format="format"
    :data-inline="inline || undefined"
    :data-muted="muted || undefined"
    :data-platform="resolvedPlatform"
    :data-testid="dataTestId"
  >
    <span :class="`${root}__accessible`">{{ accessibleLabel }}</span>
    <span :class="`${root}__visual`" aria-hidden="true">
      <kbd v-if="states[0]" :class="`${root}__key`" :data-key="states[0].key">
        <slot v-if="slots.key" name="key" v-bind="states[0]" />
        <template v-else>{{ states[0].visualLabel }}</template>
      </kbd>
      <span
        v-for="state in states.slice(1)"
        :key="`${state.index}-${state.token}`"
        :class="`${root}__segment`"
      >
        <span :class="`${root}__separator`">
          <slot v-if="slots.separator" name="separator" :index="state.index" :separator />
          <template v-else>{{ separator }}</template>
        </span>
        <kbd :class="`${root}__key`" :data-key="state.key">
          <slot v-if="slots.key" name="key" v-bind="state" />
          <template v-else>{{ state.visualLabel }}</template>
        </kbd>
      </span>
    </span>
  </span>
</template>
