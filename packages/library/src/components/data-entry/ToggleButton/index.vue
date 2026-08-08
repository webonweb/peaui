<script lang="ts">
export type ToggleButtonContent = 'text' | 'icon' | 'icon-text';
export type ToggleButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
export type ToggleButtonType = 'button' | 'submit' | 'reset';
export type ToggleButtonVariant = 'default' | 'outline' | 'ghost';

export interface ToggleButtonProps {
  /** Identyfikator natywnego przycisku. */
  id?: string;
  /** Stała etykieta widoczna w stanie nieaktywnym i używana jako dostępna nazwa. */
  label?: string;
  /** Opcjonalna etykieta widoczna po włączeniu; nie zmienia dostępnej nazwy. */
  pressedLabel?: string;
  /** Nazwa dekoracyjnej ikony SvgIcon. */
  icon?: string;
  /** Opcjonalna ikona dekoracyjna widoczna po włączeniu. */
  pressedIcon?: string;
  /** Określa, czy przycisk pokazuje tekst, ikonę czy oba elementy. */
  content?: ToggleButtonContent;
  /** Wariant wizualny powierzchni. */
  variant?: ToggleButtonVariant;
  /** Rozmiar zgodny ze skalą ButtonAction; cel dotykowy zachowuje minimum 44 px. */
  size?: ToggleButtonSize;
  /** Typ natywnego przycisku. */
  type?: ToggleButtonType;
  /** Pozwala jawnie zawijać długi tekst zamiast utrzymywać go w jednym wierszu. */
  allowWrap?: boolean;
  /** Wyłącza kontrolkę i usuwa ją z kolejności fokusu. */
  disabled?: boolean;
  /** Blokuje zmianę, ale pozostawia kontrolkę w kolejności fokusu. */
  readonly?: boolean;
  /** Blokuje zmianę i eksponuje stan zajętości. */
  loading?: boolean;
  /** Stała dostępna nazwa, wymagana dla przycisku wyłącznie ikonowego bez label. */
  ariaLabel?: string;
  /** Dostępny komunikat stanu ładowania. */
  loadingLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useId, type CSSProperties } from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  label: 'Przełącz',
  pressedLabel: '',
  icon: '',
  pressedIcon: '',
  content: 'icon-text',
  variant: 'default',
  size: 'm',
  type: 'button',
  allowWrap: false,
  disabled: false,
  readonly: false,
  loading: false,
  ariaLabel: '',
  loadingLabel: 'Trwa aktualizowanie ustawienia',
});

const value = defineModel<boolean>('value', { default: false });

const emit = defineEmits<{
  /** Emitowane po zmianie wraz z nowym stanem i natywnym zdarzeniem. */
  (event: 'change', value: boolean, nativeEvent: MouseEvent): void;
  /** Emitowane raz po skutecznej aktywacji kontrolki. */
  (event: 'click', nativeEvent: MouseEvent): void;
}>();

const slots = defineSlots<{
  /** Własna treść tekstowa; otrzymuje aktualny stan przycisku. */
  default?(props: { pressed: boolean; loading: boolean }): unknown;
  /** Własna dekoracyjna ikona stanu wyłączonego. */
  icon?(props: { pressed: false; loading: boolean }): unknown;
  /** Własna dekoracyjna ikona stanu włączonego. */
  'pressed-icon'?(props: { pressed: true; loading: boolean }): unknown;
}>();

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-toggle-button`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const loadingId = computed(() => `${resolvedId.value}-loading`);
const pressed = computed(() => value.value === true);
const nativelyDisabled = computed(() => props.disabled || props.loading);
const blocked = computed(() => nativelyDisabled.value || props.readonly);
const visibleLabel = computed(() =>
  pressed.value && props.pressedLabel.trim() ? props.pressedLabel : props.label,
);
const resolvedIcon = computed(() => {
  if (pressed.value && props.pressedIcon.trim()) return props.pressedIcon.trim();
  if (props.icon.trim()) return props.icon.trim();
  return '';
});
const showsText = computed(() => props.content !== 'icon');
const showsIcon = computed(() => props.content !== 'text');
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--content-${props.content}`,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--variant-${props.variant}`,
  {
    [`${classNameComponent}--pressed`]: pressed.value,
    [`${classNameComponent}--wrap`]: props.allowWrap,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const buttonAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    type: _type,
    disabled: _disabled,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalAriaLabelledBy,
    'aria-describedby': externalAriaDescribedBy,
    'aria-pressed': _externalPressed,
    'aria-busy': _externalBusy,
    'aria-disabled': _externalDisabled,
    'data-testid': _externalDataTestId,
    ...rest
  } = attrs;
  const ariaLabel = normalizeAttribute(externalAriaLabel);
  const ariaLabelledBy = normalizeAttribute(externalAriaLabelledBy);
  const describedBy = new Set(
    normalizeAttribute(externalAriaDescribedBy)?.split(/\s+/).filter(Boolean) ?? [],
  );

  if (props.loading) describedBy.add(loadingId.value);

  const canUseVisibleSlotName =
    props.content !== 'icon' &&
    !props.pressedLabel.trim() &&
    !props.label.trim() &&
    Boolean(slots.default);

  return {
    ...rest,
    'aria-label': ariaLabelledBy
      ? undefined
      : ariaLabel ||
        props.ariaLabel.trim() ||
        props.label.trim() ||
        (canUseVisibleSlotName ? undefined : 'Przełącznik'),
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': describedBy.size > 0 ? [...describedBy].join(' ') : undefined,
  };
});

function normalizeAttribute(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim() ? input.trim() : undefined;
}

function handleClick(event: MouseEvent): void {
  if (blocked.value) {
    event.preventDefault();
    return;
  }

  const nextValue = !pressed.value;
  value.value = nextValue;
  emit('change', nextValue, event);
  emit('click', event);
}
</script>

<template>
  <button
    v-bind="buttonAttrs"
    :id="resolvedId"
    :class="rootClasses"
    :style="rootStyle"
    :type="type"
    :disabled="nativelyDisabled"
    :aria-pressed="pressed"
    :aria-disabled="blocked || undefined"
    :aria-busy="loading || undefined"
    :data-pressed="pressed"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :data-loading="loading || undefined"
    :data-testid="dataTestId"
    @click="handleClick"
  >
    <span v-if="loading" :class="`${classNameComponent}__spinner`" aria-hidden="true" />
    <span v-else-if="showsIcon" :class="`${classNameComponent}__icon`" aria-hidden="true">
      <slot v-if="pressed" name="pressed-icon" :pressed="true" :loading>
        <slot name="icon" :pressed="false" :loading>
          <SvgIcon v-if="resolvedIcon" :name="resolvedIcon" />
        </slot>
      </slot>
      <slot v-else name="icon" :pressed="false" :loading>
        <SvgIcon v-if="resolvedIcon" :name="resolvedIcon" />
      </slot>
    </span>

    <span v-if="showsText" :class="`${classNameComponent}__label`">
      <slot :pressed="pressed" :loading>{{ visibleLabel }}</slot>
    </span>

    <span
      v-if="loading"
      :id="loadingId"
      :class="`${classNameComponent}__loading-status`"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      >{{ loadingLabel }}</span
    >
  </button>
</template>
