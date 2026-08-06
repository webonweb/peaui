<script lang="ts">
export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type AvatarShape = 'circle' | 'rounded';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
export type AvatarLoading = 'eager' | 'lazy';
export type AvatarImageState = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarProps {
  /** Adres obrazu prezentowanego w awatarze. */
  src?: string;
  /** Alternatywny opis obrazu. Pusty tekst oznacza obraz dekoracyjny. */
  alt?: string;
  /** Nazwa używana do wyliczenia inicjałów i nazwy dostępnej fallbacku. */
  name?: string;
  /** Jawne inicjały mają pierwszeństwo przed inicjałami wyliczonymi z name. */
  initials?: string;
  /** Wariant rozmiaru awatara. */
  size?: AvatarSize;
  /** Kształt awatara. */
  shape?: AvatarShape;
  /** Status obecności prezentowany wizualnie i tekstowo. */
  status?: AvatarStatus;
  /** Własna dostępna etykieta statusu. */
  statusLabel?: string;
  /** Strategia ładowania natywnego obrazu. */
  loading?: AvatarLoading;
  /** Nazwa ikony używanej, gdy obraz i inicjały nie są dostępne. */
  fallbackIcon?: string;
  /** Renderuje semantyczny przycisk zamiast prezentacyjnego awatara. */
  interactive?: boolean;
  /** Wyłącza interaktywny awatar. */
  disabled?: boolean;
  /** Dostępna nazwa awatara lub przycisku. */
  ariaLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, ref, useAttrs, useId, watch, type StyleValue } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { getAvatarInitials, normalizeAvatarInitials } from './avatar.helper';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'm',
  shape: 'circle',
  status: 'none',
  loading: 'lazy',
  fallbackIcon: 'users',
  interactive: false,
  disabled: false,
});

const emit = defineEmits<{
  (event: 'load', nativeEvent: Event): void;
  (event: 'error', nativeEvent: Event): void;
}>();

defineSlots<{
  default?(props: { initials: string; name?: string }): unknown;
  status?(props: { status: Exclude<AvatarStatus, 'none'>; label: string }): unknown;
}>();

const STATUS_LABELS: Record<Exclude<AvatarStatus, 'none'>, string> = {
  online: 'Dostępny',
  offline: 'Niedostępny',
  away: 'Zaraz wracam',
  busy: 'Zajęty',
};
const DEFAULT_ACCESSIBLE_NAME = 'Awatar użytkownika';

const attrs = useAttrs();
const statusId = `${UIKIT_NAME}-avatar-status-${useId()}`;
const classNameComponent = `${UIKIT_NAME}-avatar`;
const imageState = ref<AvatarImageState>('idle');

function normalizeText(value: unknown): string | undefined {
  const normalized = typeof value === 'string' ? value.trim() : '';

  return normalized || undefined;
}

function mergeIds(...values: Array<string | undefined>): string | undefined {
  const ids = new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []));

  return ids.size > 0 ? [...ids].join(' ') : undefined;
}

const normalizedSrc = computed(() => normalizeText(props.src));
const normalizedAlt = computed(() => (props.alt === undefined ? undefined : props.alt.trim()));
const normalizedName = computed(() => normalizeText(props.name));
const resolvedInitials = computed(
  () => normalizeAvatarInitials(props.initials) || getAvatarInitials(normalizedName.value),
);
const externalAriaLabel = computed(
  () => normalizeText(props.ariaLabel) ?? normalizeText(attrs['aria-label']),
);
const externalAriaLabelledBy = computed(() => normalizeText(attrs['aria-labelledby']));
const externalAriaDescribedBy = computed(() => normalizeText(attrs['aria-describedby']));
const isDecorative = computed(
  () =>
    !props.interactive &&
    normalizedAlt.value === '' &&
    !externalAriaLabel.value &&
    !externalAriaLabelledBy.value,
);
const hasImage = computed(() => Boolean(normalizedSrc.value) && imageState.value !== 'error');
const isImageVisible = computed(() => hasImage.value && imageState.value === 'loaded');
const hasSemanticImage = computed(
  () =>
    isImageVisible.value &&
    !props.interactive &&
    Boolean(normalizedAlt.value) &&
    !externalAriaLabel.value &&
    !externalAriaLabelledBy.value,
);
const usesRootSemantics = computed(
  () => props.interactive || (!isDecorative.value && !hasSemanticImage.value),
);
const accessibleName = computed(
  () =>
    externalAriaLabel.value ??
    normalizedAlt.value ??
    normalizedName.value ??
    (resolvedInitials.value || DEFAULT_ACCESSIBLE_NAME),
);
const resolvedStatusLabel = computed(() => {
  if (props.status === 'none') return undefined;

  return normalizeText(props.statusLabel) ?? STATUS_LABELS[props.status];
});
const statusDescriptionId = computed(() => (resolvedStatusLabel.value ? statusId : undefined));
const rootAriaDescribedBy = computed(() =>
  usesRootSemantics.value && !isDecorative.value
    ? mergeIds(externalAriaDescribedBy.value, statusDescriptionId.value)
    : undefined,
);
const imageAriaDescribedBy = computed(() =>
  hasSemanticImage.value
    ? mergeIds(externalAriaDescribedBy.value, statusDescriptionId.value)
    : undefined,
);
const classes = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--shape-${props.shape}`,
  `${classNameComponent}--state-${imageState.value}`,
  {
    [`${classNameComponent}--interactive`]: props.interactive,
    [`${classNameComponent}--disabled`]: props.interactive && props.disabled,
  },
  attrs.class,
]);
const rootTag = computed(() => (props.interactive ? 'button' : 'span'));
const rootRole = computed(() => {
  if (props.interactive || !usesRootSemantics.value) return undefined;

  return normalizeText(attrs.role) ?? 'img';
});
const rootAriaLabel = computed(() => {
  if (!usesRootSemantics.value || isDecorative.value || externalAriaLabelledBy.value) {
    return undefined;
  }

  return accessibleName.value;
});
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-describedby': _ariaDescribedBy,
    'data-testid': attrsDataTestId,
    onClick: _attrsOnClick,
    ...restAttrs
  } = attrs;

  return {
    ...restAttrs,
    'data-testid': props.dataTestId ?? attrsDataTestId,
  };
});
const rootStyle = computed(() => attrs.style as StyleValue | undefined);
const imageTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-image` : undefined));
const fallbackTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-fallback` : undefined,
);
const initialsTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-initials` : undefined,
);
const iconTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-icon` : undefined));
const statusTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-status` : undefined));

function handleImageLoad(event: Event): void {
  imageState.value = 'loaded';
  emit('load', event);
}

function handleImageError(event: Event): void {
  imageState.value = 'error';
  emit('error', event);
}

function handleRootClick(event: MouseEvent): void {
  if (props.interactive && typeof attrs.onClick === 'function') {
    (attrs.onClick as (event: MouseEvent) => void)(event);
  }
}

watch(
  normalizedSrc,
  (nextSource) => {
    imageState.value = nextSource ? 'loading' : 'idle';
  },
  { immediate: true },
);
</script>

<template>
  <component
    :is="rootTag"
    v-bind="rootAttrs"
    :class="classes"
    :style="rootStyle"
    :type="props.interactive ? 'button' : undefined"
    :disabled="props.interactive ? props.disabled : undefined"
    :role="rootRole"
    :aria-label="rootAriaLabel"
    :aria-labelledby="usesRootSemantics && !isDecorative ? externalAriaLabelledBy : undefined"
    :aria-describedby="rootAriaDescribedBy"
    :data-state="imageState"
    @click="handleRootClick"
  >
    <span :class="`${classNameComponent}__media`">
      <img
        v-if="hasImage"
        :key="normalizedSrc"
        :src="normalizedSrc"
        :alt="hasSemanticImage ? normalizedAlt : ''"
        :aria-hidden="hasSemanticImage ? undefined : 'true'"
        :aria-describedby="imageAriaDescribedBy"
        :role="hasSemanticImage ? undefined : 'presentation'"
        :loading="props.loading"
        decoding="async"
        :class="[
          `${classNameComponent}__image`,
          { [`${classNameComponent}__image--visible`]: isImageVisible },
        ]"
        :data-testid="imageTestId"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <span
        v-if="!isImageVisible"
        aria-hidden="true"
        :class="`${classNameComponent}__fallback`"
        :data-testid="fallbackTestId"
      >
        <slot v-bind="{ initials: resolvedInitials, name: normalizedName }">
          <span
            v-if="resolvedInitials"
            :class="`${classNameComponent}__initials`"
            :data-testid="initialsTestId"
          >
            {{ resolvedInitials }}
          </span>
          <SvgIcon
            v-else
            :class="`${classNameComponent}__icon`"
            :name="props.fallbackIcon"
            :data-test-id="iconTestId"
          />
        </slot>
      </span>
    </span>

    <span
      v-if="props.status !== 'none' && resolvedStatusLabel"
      aria-hidden="true"
      :class="[`${classNameComponent}__status`, `${classNameComponent}__status--${props.status}`]"
      :data-testid="statusTestId"
    >
      <slot name="status" :status="props.status" :label="resolvedStatusLabel" />
    </span>
    <span v-if="resolvedStatusLabel" :id="statusId" :class="`${classNameComponent}__status-label`">
      {{ resolvedStatusLabel }}
    </span>
  </component>
</template>
