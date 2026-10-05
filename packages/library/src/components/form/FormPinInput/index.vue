<script lang="ts">
import type {
  FormPinInputInputMode,
  FormPinInputInvalidDetail,
  FormPinInputSize,
  FormPinInputTransform,
  FormPinInputType,
} from './pin-input.shared';

export interface FormPinInputProps {
  /** Unikalny identyfikator grupy. */
  id?: string;
  /** Nazwa wartości wysyłanej z natywnym formularzem. */
  name?: string;
  /** Identyfikator formularza właściciela. */
  form?: string;
  /** Liczba komórek kodu od 1 do 32. */
  length?: number;
  /** Zbiór znaków akceptowanych przez komponent. */
  type?: FormPinInputType;
  /** Maskuje wizualnie wpisane znaki. */
  mask?: boolean;
  /** Rozmiar wizualny komórek; cel dotykowy zawsze ma minimum 44 px. */
  size?: FormPinInputSize;
  /** Dodatkowy wzorzec wyrażenia regularnego sprawdzany dla każdego znaku. */
  pattern?: string;
  /** Transformacja wykonywana przed walidacją znaku. */
  transform?: FormPinInputTransform;
  /** Co ile komórek renderowany jest separator; 0 wyłącza grupowanie. */
  separatorEvery?: number;
  /** Wartość autocomplete pierwszej komórki. */
  autocomplete?: string;
  /** Podpowiedź klawiatury ekranowej. Domyślnie wynika z typu. */
  inputmode?: FormPinInputInputMode;
  /** Ustawia początkowy fokus na pierwszej nieuzupełnionej komórce. */
  autoFocus?: boolean;
  /** Wyłącza kontrolkę. */
  disabled?: boolean;
  /** Blokuje edycję bez usuwania kontrolki z kolejności fokusu. */
  readonly?: boolean;
  /** Blokuje edycję i udostępnia stan zajętości. */
  loading?: boolean;
  /** Oznacza każdą komórkę jako wymaganą. */
  required?: boolean;
  /** Widoczna etykieta całej grupy. */
  label?: string;
  /** Tekst instrukcji powiązany z grupą i komórkami. */
  description?: string;
  /** Komunikat błędu powiązany przez aria-describedby. */
  error?: string;
  /** Dostępna nazwa używana, gdy nie ma widocznej etykiety. */
  ariaLabel?: string;
  /** Tekst stanu ładowania dla technologii asystujących. */
  loadingLabel?: string;
  /** Stabilny identyfikator używany w testach. */
  dataTestId?: string;
}

export type {
  FormPinInputApplication,
  FormPinInputInputMode,
  FormPinInputInvalidDetail,
  FormPinInputInvalidReason,
  FormPinInputOptions,
  FormPinInputSize,
  FormPinInputTransform,
  FormPinInputTransformMode,
  FormPinInputType,
} from './pin-input.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import { computed, nextTick, ref, useAttrs, useId, watch, type CSSProperties } from 'vue';

import {
  applyPinInput,
  getPinCellLabel,
  normalizePinLength,
  normalizePinValue,
  removePinCharacter,
  type FormPinInputOptions,
} from './pin-input.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormPinInputProps>(), {
  length: 6,
  type: 'numeric',
  mask: false,
  size: 'm',
  transform: 'none',
  separatorEvery: 0,
  autocomplete: 'one-time-code',
  autoFocus: false,
  disabled: false,
  readonly: false,
  loading: false,
  required: false,
  label: '',
  description: '',
  error: '',
  ariaLabel: '',
  loadingLabel: 'Trwa przygotowywanie pola kodu',
});

const value = defineModel<string>('value', { default: '' });

const emit = defineEmits<{
  /** Emitowane po każdej zaakceptowanej zmianie kodu. */
  (event: 'change', value: string, nativeEvent: Event): void;
  /** Emitowane raz dla każdej nowej, kompletnej wartości. */
  (event: 'complete', value: string, nativeEvent: Event): void;
  /** Emitowane po odrzuceniu znaku, wzorca, transformacji lub nadmiaru. */
  (event: 'invalidInput', detail: FormPinInputInvalidDetail, nativeEvent: Event): void;
  /** Emitowane po wejściu fokusu do komórki. */
  (event: 'focus', nativeEvent: FocusEvent, index: number): void;
  /** Emitowane po opuszczeniu całej grupy komórek. */
  (event: 'blur', nativeEvent: FocusEvent): void;
}>();

const attrs = useAttrs();
const labelSlot = useSlotPresence('label');
const descriptionSlot = useSlotPresence('description');
const errorSlot = useSlotPresence('error');
const classNameComponent = `${UIKIT_NAME}-form-pin-input`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const labelId = computed(() => `${resolvedId.value}-label`);
const descriptionId = computed(() => `${resolvedId.value}-description`);
const errorId = computed(() => `${resolvedId.value}-error`);
const loadingId = computed(() => `${resolvedId.value}-loading`);
const groupRef = ref<HTMLElement>();
const inputRefs = ref<Array<HTMLInputElement | undefined>>([]);
const activeIndex = ref(0);

const normalizedLength = computed(() => normalizePinLength(props.length));
const options = computed<FormPinInputOptions>(() => ({
  length: normalizedLength.value,
  pattern: props.pattern,
  transform: props.transform,
  type: props.type,
}));
const normalizedValue = computed(() => normalizePinValue(value.value ?? '', options.value));
const cells = computed(() =>
  Array.from({ length: normalizedLength.value }, (_, index) => normalizedValue.value[index] ?? ''),
);
const isComplete = computed(() => normalizedValue.value.length === normalizedLength.value);
const blocked = computed(() => props.disabled || props.loading);
const hasLabel = computed(() => Boolean(labelSlot.value || props.label.trim()));
const hasDescription = computed(() => Boolean(descriptionSlot.value || props.description.trim()));
const hasError = computed(() => Boolean(errorSlot.value || props.error.trim()));
const resolvedInputMode = computed<FormPinInputInputMode>(() =>
  props.inputmode?.trim() ? props.inputmode : props.type === 'numeric' ? 'numeric' : 'text',
);
const lastCompletedValue = ref(isComplete.value ? normalizedValue.value : '');

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
  return ids.size ? [...ids].join(' ') : undefined;
});

const groupLabelAttrs = computed(() => {
  const externalLabel = `${attrs['aria-label'] ?? ''}`.trim();
  const externalLabelledBy = `${attrs['aria-labelledby'] ?? ''}`.trim();
  if (externalLabel) return { 'aria-label': externalLabel };
  if (externalLabelledBy) return { 'aria-labelledby': externalLabelledBy };
  if (hasLabel.value) return { 'aria-labelledby': labelId.value };
  return { 'aria-label': props.ariaLabel.trim() || props.name?.trim() || 'Kod PIN' };
});

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  {
    [`${classNameComponent}--complete`]: isComplete.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--invalid`]: hasError.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-describedby': _ariaDescribedBy,
    'data-testid': _dataTestId,
    ...rest
  } = attrs;
  return rest;
});

function setInputRef(element: unknown, index: number): void {
  inputRefs.value[index] = element instanceof HTMLInputElement ? element : undefined;
}

function focusCell(index: number, select = true): void {
  const nextIndex = Math.min(normalizedLength.value - 1, Math.max(0, index));
  activeIndex.value = nextIndex;
  void nextTick(() => {
    const input = inputRefs.value[nextIndex];
    input?.focus();
    if (select) input?.select();
    input?.scrollIntoView?.({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  });
}

function reportInvalid(detail: FormPinInputInvalidDetail | undefined, event: Event): void {
  if (detail) emit('invalidInput', detail, event);
}

function updateValue(nextValue: string, event: Event): void {
  if (nextValue === normalizedValue.value) return;
  const shouldEmitComplete =
    nextValue.length === normalizedLength.value && nextValue !== lastCompletedValue.value;
  lastCompletedValue.value = nextValue.length === normalizedLength.value ? nextValue : '';
  value.value = nextValue;
  emit('change', nextValue, event);
  if (shouldEmitComplete) emit('complete', nextValue, event);
}

function insert(index: number, input: string, event: Event): void {
  if (blocked.value || props.readonly) return;
  const result = applyPinInput(normalizedValue.value, index, input, options.value);
  reportInvalid(result.invalid, event);
  if (result.accepted) {
    updateValue(result.value, event);
    focusCell(result.nextIndex);
  } else {
    focusCell(index);
  }
}

function handleKeydown(index: number, event: KeyboardEvent): void {
  if (event.altKey || event.metaKey || event.ctrlKey || event.isComposing) return;

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusCell(index - 1);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusCell(index + 1);
    return;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    focusCell(0);
    return;
  }
  if (event.key === 'End') {
    event.preventDefault();
    focusCell(normalizedLength.value - 1);
    return;
  }
  if (event.key === 'Backspace') {
    if (props.readonly || blocked.value) return;
    event.preventDefault();
    const targetIndex = cells.value[index] ? index : Math.max(0, index - 1);
    updateValue(removePinCharacter(normalizedValue.value, targetIndex), event);
    focusCell(targetIndex);
    return;
  }
  if (event.key === 'Delete') {
    if (props.readonly || blocked.value) return;
    event.preventDefault();
    updateValue(removePinCharacter(normalizedValue.value, index), event);
    focusCell(index);
    return;
  }
  if (event.key.length === 1) {
    event.preventDefault();
    insert(index, event.key, event);
  }
}

function handleInput(index: number, event: Event): void {
  const input = event.currentTarget as HTMLInputElement;
  if ((event as InputEvent).isComposing || !input.value) return;
  insert(index, input.value, event);
  void nextTick(() => {
    input.value = cells.value[index] ?? '';
  });
}

function handlePaste(index: number, event: ClipboardEvent): void {
  if (blocked.value || props.readonly) return;
  event.preventDefault();
  insert(index, event.clipboardData?.getData('text') ?? '', event);
}

function handleFocus(index: number, event: FocusEvent): void {
  const target = event.target as HTMLInputElement;
  target.scrollIntoView?.({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
  activeIndex.value = index;
  (event.currentTarget as HTMLInputElement).select();
  emit('focus', event, index);
}

function handleFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget;
  if (next instanceof Node && groupRef.value?.contains(next)) return;
  emit('blur', event);
}

watch(normalizedLength, (length) => {
  inputRefs.value.length = length;
  activeIndex.value = Math.min(activeIndex.value, length - 1);
});

watch(normalizedValue, (next) => {
  lastCompletedValue.value = next.length === normalizedLength.value ? next : '';
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    :data-complete="isComplete || undefined"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :data-loading="loading || undefined"
    :data-invalid="hasError || undefined"
    :data-testid="dataTestId"
  >
    <div v-if="hasLabel" :class="`${classNameComponent}__heading`">
      <label :id="labelId" :for="`${resolvedId}-cell-0`" :class="`${classNameComponent}__label`">
        <slot name="label" :complete="isComplete" :value="normalizedValue">{{ label }}</slot>
        <span v-if="required" :class="`${classNameComponent}__required`" aria-hidden="true">*</span>
      </label>
      <slot name="hint" />
    </div>

    <div
      ref="groupRef"
      v-bind="groupLabelAttrs"
      :class="`${classNameComponent}__group`"
      role="group"
      :aria-describedby="describedBy"
      :aria-invalid="hasError || undefined"
      :aria-busy="loading || undefined"
      :aria-disabled="blocked || undefined"
      :data-testid="dataTestId ? `${dataTestId}-group` : undefined"
      @focusout="handleFocusOut"
    >
      <template v-for="(cell, index) in cells" :key="index">
        <input
          :id="`${resolvedId}-cell-${index}`"
          :ref="(element) => setInputRef(element, index)"
          :form="form"
          :class="`${classNameComponent}__cell`"
          :value="cell"
          :type="mask ? 'password' : 'text'"
          :inputmode="resolvedInputMode"
          :autocomplete="index === 0 ? autocomplete : 'off'"
          :maxlength="index === 0 ? normalizedLength : 1"
          :tabindex="index === activeIndex ? 0 : -1"
          :disabled="blocked"
          :readonly="readonly"
          :required="required"
          :aria-label="getPinCellLabel(type, index, normalizedLength)"
          :aria-describedby="describedBy"
          :aria-invalid="hasError || undefined"
          :aria-disabled="blocked || undefined"
          :aria-readonly="readonly || undefined"
          :aria-required="required || undefined"
          :autofocus="autoFocus && index === Math.min(normalizedValue.length, normalizedLength - 1)"
          autocapitalize="none"
          spellcheck="false"
          :data-index="index"
          :data-testid="dataTestId ? `${dataTestId}-cell-${index}` : undefined"
          @focus="handleFocus(index, $event)"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste(index, $event)"
        />
        <span
          v-if="
            separatorEvery > 0 && (index + 1) % separatorEvery === 0 && index < normalizedLength - 1
          "
          :class="`${classNameComponent}__separator`"
          aria-hidden="true"
        >
          <slot name="separator" :index="index">–</slot>
        </span>
      </template>
    </div>

    <input
      v-if="name"
      :name="name"
      :form="form"
      :value="normalizedValue"
      :disabled="disabled"
      type="hidden"
    />

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
    >
      {{ loadingLabel }}
    </span>
  </div>
</template>
