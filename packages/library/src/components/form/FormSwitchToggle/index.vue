<script lang="ts">
export type FormSwitchToggleLabelPosition = 'start' | 'end';
export type FormSwitchToggleSize = 's' | 'm' | 'l';

export interface FormSwitchToggleProps<Value = boolean> {
  /** Unikalny identyfikator kontrolki. Generowany automatycznie, jeśli nie zostanie podany. */
  id?: string;
  /** Nazwa pola używana podczas natywnego wysyłania formularza. */
  name?: string;
  /** Identyfikator formularza właściciela, również gdy kontrolka znajduje się poza formularzem. */
  form?: string;
  /** Widoczna etykieta przełącznika. */
  label?: string;
  /** Tekst pomocniczy powiązany z kontrolką przez aria-describedby. */
  description?: string;
  /** Komunikat błędu powiązany z kontrolką i aria-invalid. */
  error?: string;
  /** Wartość modelu reprezentująca stan włączony. */
  trueValue?: Value;
  /** Wartość modelu reprezentująca stan wyłączony. */
  falseValue?: Value;
  /** Rozmiar wizualny szyny; obszar dotykowy zawsze ma co najmniej 44 px. */
  size?: FormSwitchToggleSize;
  /** Pozycja etykiety względem szyny. */
  labelPosition?: FormSwitchToggleLabelPosition;
  /** Wyłącza kontrolkę i usuwa ją z kolejności fokusu. */
  disabled?: boolean;
  /** Blokuje zmianę, zachowując kontrolkę w kolejności fokusu. */
  readonly?: boolean;
  /** Blokuje zmianę i udostępnia stan zajętości technologiom asystującym. */
  loading?: boolean;
  /** Oznacza pole jako wymagane dla formularza i technologii asystujących. */
  required?: boolean;
  /** Pokazuje tekstowy stan obok szyny bez polegania wyłącznie na kolorze. */
  showStateLabel?: boolean;
  /** Tekst widoczny dla stanu włączonego. */
  onLabel?: string;
  /** Tekst widoczny dla stanu wyłączonego. */
  offLabel?: string;
  /** Dostępna nazwa używana, gdy nie ma widocznej etykiety. */
  ariaLabel?: string;
  /** Dostępny komunikat stanu ładowania. */
  loadingLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts" generic="Value = boolean">
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import { computed, useAttrs, useId, type CSSProperties } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormSwitchToggleProps<Value>>(), {
  label: '',
  description: '',
  error: '',
  size: 'm',
  labelPosition: 'end',
  disabled: false,
  readonly: false,
  loading: false,
  required: false,
  showStateLabel: false,
  onLabel: 'Włączone',
  offLabel: 'Wyłączone',
  ariaLabel: '',
  loadingLabel: 'Trwa aktualizowanie ustawienia',
});

const value = defineModel<Value>('value', { required: true });

const emit = defineEmits<{
  /** Emitowane po zmianie wraz z nową wartością domenową i natywnym zdarzeniem. */
  (event: 'change', value: Value, nativeEvent: Event): void;
  /** Emitowane po ustawieniu fokusu na natywnej kontrolce. */
  (event: 'focus', nativeEvent: FocusEvent): void;
  /** Emitowane po opuszczeniu natywnej kontrolki. */
  (event: 'blur', nativeEvent: FocusEvent): void;
}>();

const labelSlot = useSlotPresence('label');
const descriptionSlot = useSlotPresence('description');
const errorSlot = useSlotPresence('error');
const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-switch-toggle`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const labelId = computed(() => `${resolvedId.value}-label`);
const descriptionId = computed(() => `${resolvedId.value}-description`);
const errorId = computed(() => `${resolvedId.value}-error`);
const loadingId = computed(() => `${resolvedId.value}-loading`);
const trueValue = computed<Value>(() =>
  props.trueValue === undefined ? (true as Value) : props.trueValue,
);
const falseValue = computed<Value>(() =>
  props.falseValue === undefined ? (false as Value) : props.falseValue,
);
const checked = computed(() => Object.is(value.value, trueValue.value));
const blocked = computed(() => props.disabled || props.loading);
const hasLabel = computed(() => Boolean(labelSlot.value || props.label.trim()));
const hasDescription = computed(() => Boolean(descriptionSlot.value || props.description.trim()));
const hasError = computed(() => Boolean(errorSlot.value || props.error.trim()));
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  `${classNameComponent}--label-${props.labelPosition}`,
  {
    [`${classNameComponent}--checked`]: checked.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--invalid`]: hasError.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const describedBy = computed(() => {
  const ids = new Set(
    `${attrs['aria-describedby'] ?? ''}`
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription.value) ids.add(descriptionId.value);
  if (hasError.value) ids.add(errorId.value);
  if (props.loading) ids.add(loadingId.value);
  return ids.size > 0 ? [...ids].join(' ') : undefined;
});
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'data-testid': _dataTestId,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalAriaLabelledBy,
    'aria-describedby': _externalDescribedBy,
    ...rest
  } = attrs;
  const externalLabel = typeof externalAriaLabel === 'string' ? externalAriaLabel.trim() : '';
  const externalLabelledBy =
    typeof externalAriaLabelledBy === 'string' ? externalAriaLabelledBy.trim() : '';
  const explicitLabel = externalLabel;
  const labelledBy =
    externalLabelledBy || (hasLabel.value && !explicitLabel ? labelId.value : undefined);

  return {
    ...rest,
    'aria-label': labelledBy
      ? undefined
      : explicitLabel ||
        (hasLabel.value
          ? undefined
          : props.ariaLabel.trim() || props.name?.trim() || 'Przełącznik'),
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy.value,
  };
});
const elementTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-element` : undefined,
);

function serializeFormValue(input: Value): string {
  if (input === null || input === undefined) return '';
  if (typeof input === 'string') return input;
  if (typeof input === 'number' || typeof input === 'boolean' || typeof input === 'bigint') {
    return String(input);
  }
  try {
    return JSON.stringify(input) ?? String(input);
  } catch {
    return String(input);
  }
}

function handleClick(event: MouseEvent): void {
  if (!props.readonly) return;
  event.preventDefault();
}

function handleChange(event: Event): void {
  const input = event.currentTarget as HTMLInputElement;
  if (props.readonly || blocked.value) {
    event.preventDefault();
    input.checked = checked.value;
    return;
  }
  const nextValue = input.checked ? trueValue.value : falseValue.value;
  value.value = nextValue;
  emit('change', nextValue, event);
}
</script>

<template>
  <div
    :class="rootClasses"
    :style="rootStyle"
    :data-checked="checked"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :data-loading="loading || undefined"
    :data-invalid="hasError || undefined"
    :data-testid="dataTestId"
  >
    <label
      :class="`${classNameComponent}__interaction`"
      :for="resolvedId"
      :data-testid="dataTestId ? `${dataTestId}-label` : undefined"
    >
      <span
        v-if="hasLabel && labelPosition === 'start'"
        :id="labelId"
        :class="`${classNameComponent}__label`"
      >
        <slot name="label" :checked="checked">{{ label }}</slot>
        <span v-if="required" :class="`${classNameComponent}__required`" aria-hidden="true">*</span>
      </span>

      <span :class="`${classNameComponent}__control`">
        <input
          v-bind="inputAttrs"
          :id="resolvedId"
          :class="`${classNameComponent}__input`"
          :form="form"
          :name="name"
          :value="serializeFormValue(trueValue)"
          :checked="checked"
          :disabled="blocked"
          :required="required"
          type="checkbox"
          role="switch"
          :aria-checked="checked"
          :aria-disabled="blocked || undefined"
          :aria-readonly="readonly || undefined"
          :aria-required="required || undefined"
          :aria-invalid="hasError || undefined"
          :aria-busy="loading || undefined"
          :data-testid="elementTestId"
          @click="handleClick"
          @change.stop="handleChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <span :class="`${classNameComponent}__track`" aria-hidden="true">
          <span :class="`${classNameComponent}__thumb`">
            <slot name="thumb" :checked="checked" :loading="loading">
              <span v-if="loading" :class="`${classNameComponent}__spinner`" />
            </slot>
          </span>
        </span>
      </span>

      <span
        v-if="hasLabel && labelPosition === 'end'"
        :id="labelId"
        :class="`${classNameComponent}__label`"
      >
        <slot name="label" :checked="checked">{{ label }}</slot>
        <span v-if="required" :class="`${classNameComponent}__required`" aria-hidden="true">*</span>
      </span>

      <span v-if="showStateLabel" :class="`${classNameComponent}__state`" aria-hidden="true">
        <span v-show="checked" :class="`${classNameComponent}__state-value`">
          <slot name="on-label">{{ onLabel }}</slot>
        </span>
        <span v-show="!checked" :class="`${classNameComponent}__state-value`">
          <slot name="off-label">{{ offLabel }}</slot>
        </span>
      </span>
    </label>

    <p v-if="hasDescription" :id="descriptionId" :class="`${classNameComponent}__description`">
      <slot name="description">{{ description }}</slot>
    </p>
    <p v-if="hasError" :id="errorId" :class="`${classNameComponent}__error`" aria-live="polite">
      <slot name="error">{{ error }}</slot>
    </p>
    <span
      v-if="loading"
      :id="loadingId"
      :class="`${classNameComponent}__loading-status`"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      >{{ loadingLabel }}</span
    >
  </div>
</template>
