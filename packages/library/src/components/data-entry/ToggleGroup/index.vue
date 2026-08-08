<script lang="ts">
import type { ToggleButtonContent } from '../ToggleButton/index.vue';
import type { ToggleGroupValue } from './toggle-group.shared';

export type { ToggleGroupValue } from './toggle-group.shared';
export type ToggleGroupType = 'single' | 'multiple';
export type ToggleGroupOrientation = 'horizontal' | 'vertical';
export type ToggleGroupAppearance = 'separate' | 'attached';
export type ToggleGroupSemanticRole = 'toolbar' | 'group';
export type ToggleGroupOverflow = 'wrap' | 'scroll';
export type ToggleGroupSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
export type ToggleGroupVariant = 'default' | 'outline' | 'ghost';
export type ToggleGroupModelValue = ToggleGroupValue | ToggleGroupValue[] | null;

export interface ToggleGroupItem {
  /** Stabilna wartość pozycji zwracana przez model. */
  value: ToggleGroupValue;
  /** Widoczna etykieta przycisku. */
  label: string;
  /** Dostępna nazwa zastępująca etykietę wizualną. */
  ariaLabel?: string;
  /** Dostępna nazwa używana po włączeniu przycisku. */
  pressedLabel?: string;
  /** Ikona stanu wyłączonego. */
  icon?: string;
  /** Opcjonalna ikona stanu włączonego. */
  pressedIcon?: string;
  /** Sposób prezentacji tekstu i ikony. */
  content?: ToggleButtonContent;
  /** Wyłącza pojedynczą pozycję oraz usuwa ją z nawigacji. */
  disabled?: boolean;
  /** Pozwala ustawić fokus bez zmiany wartości pozycji. */
  readonly?: boolean;
  /** Oznacza pozycję jako zajętą i blokuje interakcję. */
  loading?: boolean;
  /** Dane aplikacyjne zwracane razem z pozycją. */
  metadata?: unknown;
}

export interface ToggleGroupProps {
  /** Identyfikator grupy i powiązanych opisów. */
  id?: string;
  /** Nazwa ukrytych pól przekazywanych z formularzem. */
  name?: string;
  /** Pozycje zarządzane przez komponent. */
  items?: ToggleGroupItem[];
  /** Tryb pojedynczego albo wielokrotnego wyboru. */
  type?: ToggleGroupType;
  /** Kierunek układu i nawigacji klawiaturą. */
  orientation?: ToggleGroupOrientation;
  /** Oddzielny albo połączony wygląd przycisków. */
  appearance?: ToggleGroupAppearance;
  /** Semantyka dostępności grupy. */
  semanticRole?: ToggleGroupSemanticRole;
  /** Zachowanie grupy przy braku miejsca. */
  overflow?: ToggleGroupOverflow;
  /** Wymaga co najmniej jednej wybranej pozycji. */
  required?: boolean;
  /** Pozwala wyłączyć ostatnią aktywną pozycję, gdy grupa nie jest wymagana. */
  allowEmpty?: boolean;
  /** Zapętla nawigację strzałkami pomiędzy skrajnymi pozycjami. */
  loop?: boolean;
  /** Wyłącza całą grupę i usuwa ją z kolejności tabulatora. */
  disabled?: boolean;
  /** Blokuje zmianę wartości, zachowując możliwość odczytu i fokusu. */
  readonly?: boolean;
  /** Widoczna etykieta grupy. */
  label?: string;
  /** Zewnętrzny komunikat błędu. */
  error?: string;
  /** Komunikat używany dla pustej wymaganej grupy. */
  requiredMessage?: string;
  /** Dostępna nazwa, gdy widoczna etykieta nie jest potrzebna. */
  ariaLabel?: string;
  /** Rozmiar wszystkich przycisków. */
  size?: ToggleGroupSize;
  /** Wariant wizualny wszystkich przycisków. */
  variant?: ToggleGroupVariant;
  /** Stabilny selektor do testów integracyjnych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, ref, useAttrs, useId, watch, type CSSProperties } from 'vue';

import ToggleButton from '../ToggleButton/index.vue';
import {
  findNextToggleGroupIndex,
  findToggleGroupEdgeIndex,
  findToggleGroupReplacementIndex,
  isToggleGroupItemAvailable,
  normalizeToggleGroupSelection,
} from './toggle-group.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  name: '',
  items: () => [],
  type: 'single',
  orientation: 'horizontal',
  appearance: 'separate',
  semanticRole: 'toolbar',
  overflow: 'wrap',
  required: false,
  allowEmpty: true,
  loop: true,
  disabled: false,
  readonly: false,
  label: '',
  error: '',
  requiredMessage: 'Wybierz co najmniej jedną opcję.',
  ariaLabel: '',
  size: 'm',
  variant: 'outline',
  dataTestId: '',
});

/** Wybrana wartość albo lista wartości zależnie od trybu `type`. */
const modelValue = defineModel<ToggleGroupModelValue>('value', { default: null });
const emit = defineEmits<{
  /** Emitowany po zaakceptowanej zmianie wyboru. */
  (
    event: 'change',
    value: ToggleGroupModelValue,
    item: ToggleGroupItem,
    nativeEvent: MouseEvent,
  ): void;
  /** Emitowany po przeniesieniu aktywnego fokusu w grupie. */
  (event: 'focusChange', item: ToggleGroupItem, index: number): void;
}>();
const slots = defineSlots<{
  /** Deklaratywny wariant renderowania pozycji z udostępnionymi właściwościami. */
  default?(props: {
    items: ToggleGroupItem[];
    isPressed: (item: ToggleGroupItem) => boolean;
    getItemProps: (item: ToggleGroupItem, index: number) => Record<string, unknown>;
  }): unknown;
  /** Zawartość pojedynczej pozycji w wariancie tablicowym. */
  item?(props: {
    item: ToggleGroupItem;
    index: number;
    pressed: boolean;
    disabled: boolean;
  }): unknown;
  /** Niestandardowa widoczna etykieta grupy. */
  label?(): unknown;
  /** Niestandardowy komunikat walidacyjny. */
  error?(props: { message: string }): unknown;
}>();

const attrs = useAttrs();
const root = ref<HTMLElement>();
const buttonElements = ref<Array<HTMLElement | null>>([]);
const focusWithin = ref(false);
const focusedValue = ref<ToggleGroupValue | null>(null);
const renderNonce = ref(0);
const classNameComponent = `${UIKIT_NAME}-toggle-group`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const labelId = computed(() => `${resolvedId.value}-label`);
const errorId = computed(() => `${resolvedId.value}-error`);
const selectedValues = computed(() => normalizeToggleGroupSelection(props.type, modelValue.value));
const isEmpty = computed(() => selectedValues.value.length === 0);
const validationMessage = computed(
  () => props.error.trim() || (props.required && isEmpty.value ? props.requiredMessage.trim() : ''),
);
const activeValue = ref<ToggleGroupValue | null>(getInitialActiveValue());
const lastActiveIndex = ref(Math.max(getItemIndex(activeValue.value), 0));
const activeIndex = computed(() => {
  const index = getItemIndex(activeValue.value);
  return isItemAvailable(index) ? index : -1;
});
const itemFocusSignature = computed(() =>
  props.items.map((item) => [
    typeof item.value,
    item.value,
    Boolean(item.disabled),
    Boolean(item.loading),
  ]),
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.orientation}`,
  `${classNameComponent}--${props.appearance}`,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--overflow-${props.overflow}`,
  {
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--invalid`]: Boolean(validationMessage.value),
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const groupAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalAriaLabelledBy,
    'aria-describedby': externalAriaDescribedBy,
    'aria-orientation': _externalOrientation,
    'aria-disabled': _externalDisabled,
    'aria-invalid': _externalInvalid,
    'data-testid': _externalTestId,
    ...rest
  } = attrs;
  const labelledBy = normalizeAttribute(externalAriaLabelledBy);
  const ariaLabel = normalizeAttribute(externalAriaLabel) || props.ariaLabel.trim();
  const resolvedLabelledBy =
    labelledBy || (!ariaLabel && props.label.trim() ? labelId.value : undefined);
  const describedBy = new Set(
    normalizeAttribute(externalAriaDescribedBy)?.split(/\s+/).filter(Boolean) ?? [],
  );
  if (validationMessage.value) describedBy.add(errorId.value);

  return {
    ...rest,
    'aria-label': resolvedLabelledBy
      ? undefined
      : ariaLabel || (!props.label.trim() ? 'Grupa przełączników' : undefined),
    'aria-labelledby': resolvedLabelledBy,
    'aria-describedby': describedBy.size ? [...describedBy].join(' ') : undefined,
  };
});

watch(
  itemFocusSignature,
  async () => {
    const currentIndex = getItemIndex(activeValue.value);
    if (isItemAvailable(currentIndex)) {
      lastActiveIndex.value = currentIndex;
      return;
    }

    const containedFocus =
      focusWithin.value ||
      Object.is(focusedValue.value, activeValue.value) ||
      Boolean(root.value?.contains(document.activeElement));
    const replacementIndex = findToggleGroupReplacementIndex(props.items, lastActiveIndex.value);
    activeValue.value = props.items[replacementIndex]?.value ?? null;
    lastActiveIndex.value = Math.max(replacementIndex, 0);
    if (containedFocus && replacementIndex >= 0) {
      await nextTick();
      focusItem(replacementIndex);
    }
  },
  { flush: 'pre' },
);

function normalizeAttribute(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getItemIndex(value: ToggleGroupValue | null): number {
  if (value === null) return -1;
  return props.items.findIndex((item) => Object.is(item.value, value));
}

function isItemAvailable(index: number): boolean {
  return !props.disabled && isToggleGroupItemAvailable(props.items[index]);
}

function getInitialActiveValue(): ToggleGroupValue | null {
  const selected = normalizeToggleGroupSelection(props.type, modelValue.value);
  const selectedIndex = props.items.findIndex(
    (item) =>
      selected.some((value) => Object.is(value, item.value)) && isToggleGroupItemAvailable(item),
  );
  const index = selectedIndex >= 0 ? selectedIndex : findToggleGroupEdgeIndex(props.items, 'first');
  return props.items[index]?.value ?? null;
}

function isPressed(item: ToggleGroupItem): boolean {
  return selectedValues.value.some((value) => Object.is(value, item.value));
}

function getItemTestId(index: number): string | undefined {
  return props.dataTestId ? `${props.dataTestId}-item-${index}` : undefined;
}

function getStableKey(value: ToggleGroupValue, index?: number): string {
  return `${typeof value}:${String(value)}${index === undefined ? '' : `:${index}`}`;
}

function getItemTabIndex(index: number): number {
  return isItemAvailable(index) && activeIndex.value === index ? 0 : -1;
}

function getItemContent(item: ToggleGroupItem): ToggleButtonContent {
  if (item.content) return item.content;
  return item.icon?.trim() || item.pressedIcon?.trim() ? 'icon-text' : 'text';
}

function setButtonElement(index: number, element: unknown): void {
  const candidate = element as { $el?: HTMLElement } | HTMLElement | null;
  buttonElements.value[index] =
    candidate instanceof HTMLElement ? candidate : (candidate?.$el ?? null);
}

function focusItem(index: number): void {
  if (!isItemAvailable(index)) return;
  activeValue.value = props.items[index]?.value ?? null;
  lastActiveIndex.value = index;
  const button =
    buttonElements.value[index] ??
    root.value?.querySelector<HTMLElement>(`[data-toggle-group-index="${index}"]`);
  button?.focus();
}

function moveFocus(index: number, direction: 1 | -1): void {
  const nextIndex = findNextToggleGroupIndex(props.items, index, direction, props.loop);
  if (nextIndex >= 0) focusItem(nextIndex);
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  if (!isItemAvailable(index)) return;
  let nextIndex = -1;
  if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(props.items, 'first');
  else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(props.items, 'last');
  else if (
    props.orientation === 'horizontal' &&
    (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
  ) {
    const rtl = root.value ? getComputedStyle(root.value).direction === 'rtl' : false;
    const forward = event.key === 'ArrowRight' ? !rtl : rtl;
    event.preventDefault();
    moveFocus(index, forward ? 1 : -1);
    return;
  } else if (
    props.orientation === 'vertical' &&
    (event.key === 'ArrowUp' || event.key === 'ArrowDown')
  ) {
    event.preventDefault();
    moveFocus(index, event.key === 'ArrowDown' ? 1 : -1);
    return;
  } else return;

  event.preventDefault();
  if (nextIndex >= 0) focusItem(nextIndex);
}

function handleFocus(item: ToggleGroupItem, index: number): void {
  focusWithin.value = true;
  focusedValue.value = item.value;
  activeValue.value = item.value;
  lastActiveIndex.value = index;
  emit('focusChange', item, index);
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && !root.value?.contains(nextTarget)) {
    focusWithin.value = false;
    focusedValue.value = null;
  }
}

function handleChange(item: ToggleGroupItem, nativeEvent: MouseEvent): void {
  if (props.disabled || props.readonly || item.disabled || item.readonly || item.loading) return;
  const pressed = isPressed(item);
  let nextValue: ToggleGroupModelValue;

  if (props.type === 'single') {
    if (pressed && (!props.allowEmpty || props.required)) {
      renderNonce.value += 1;
      void nextTick(() => focusItem(getItemIndex(item.value)));
      return;
    }
    nextValue = pressed ? null : item.value;
  } else if (pressed) {
    if (selectedValues.value.length === 1 && (!props.allowEmpty || props.required)) {
      renderNonce.value += 1;
      void nextTick(() => focusItem(getItemIndex(item.value)));
      return;
    }
    nextValue = selectedValues.value.filter((value) => !Object.is(value, item.value));
  } else {
    nextValue = [...selectedValues.value, item.value];
  }

  modelValue.value = nextValue;
  emit('change', nextValue, item, nativeEvent);
}

function getItemProps(item: ToggleGroupItem, index: number): Record<string, unknown> {
  return {
    ref: (element: unknown) => setButtonElement(index, element),
    class: `${classNameComponent}__item`,
    value: isPressed(item),
    label: item.label,
    pressedLabel: item.pressedLabel,
    icon: item.icon,
    pressedIcon: item.pressedIcon,
    content: getItemContent(item),
    size: props.size,
    variant: props.variant,
    disabled: props.disabled || item.disabled,
    readonly: props.readonly || item.readonly,
    loading: item.loading,
    ariaLabel: item.ariaLabel || item.label,
    tabindex: getItemTabIndex(index),
    'data-toggle-group-index': index,
    dataTestId: getItemTestId(index),
    onChange: (_pressed: boolean, event: MouseEvent) => handleChange(item, event),
    onFocus: () => handleFocus(item, index),
    onKeydown: (event: KeyboardEvent) => handleKeydown(event, index),
  };
}
</script>

<template>
  <div :class="`${classNameComponent}__field`">
    <div v-if="label || slots.label" :id="labelId" :class="`${classNameComponent}__label`">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" :class="classNameComponent + '__required'" aria-hidden="true">*</span>
    </div>

    <div
      ref="root"
      v-bind="groupAttrs"
      :id="resolvedId"
      :class="rootClasses"
      :style="rootStyle"
      :role="semanticRole"
      :aria-orientation="semanticRole === 'toolbar' ? orientation : undefined"
      :aria-disabled="disabled || undefined"
      :aria-invalid="validationMessage ? true : undefined"
      :data-required="required || undefined"
      :data-disabled="disabled || undefined"
      :data-readonly="readonly || undefined"
      :data-testid="dataTestId || undefined"
      @focusout="handleFocusOut"
    >
      <slot
        v-if="slots.default"
        :items="items"
        :is-pressed="isPressed"
        :get-item-props="getItemProps"
      />
      <template v-else>
        <ToggleButton
          v-for="(item, index) in items"
          :key="getStableKey(item.value, index) + ':' + renderNonce"
          :ref="(element) => setButtonElement(index, element)"
          v-bind="getItemProps(item, index)"
          :class="classNameComponent + '__item'"
        >
          <template v-if="slots.item" #default>
            <slot
              name="item"
              :item="item"
              :index="index"
              :pressed="isPressed(item)"
              :disabled="Boolean(disabled || item.disabled)"
            />
          </template>
        </ToggleButton>
      </template>
    </div>

    <template v-if="name">
      <input
        v-for="selectedValue in selectedValues"
        :key="getStableKey(selectedValue)"
        type="hidden"
        :name="name"
        :value="selectedValue"
        :disabled="disabled"
      />
    </template>

    <div
      v-if="validationMessage"
      :id="errorId"
      :class="classNameComponent + '__error'"
      role="alert"
    >
      <slot name="error" :message="validationMessage">{{ validationMessage }}</slot>
    </div>
  </div>
</template>
