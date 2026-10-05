<script lang="ts">
import type {
  FormRatingInputSize,
  FormRatingInputStep,
  RatingLabelGetter,
  RatingLabels,
  RatingValue,
} from './rating-input.shared';

export interface FormRatingInputProps {
  /** Unikalny identyfikator kontrolki. */
  id?: string;
  /** Nazwa wartości wysyłanej z formularzem. */
  name?: string;
  /** Identyfikator formularza właściciela. */
  form?: string;
  /** Najwyższa ocena; wartości są normalizowane do zakresu 1–100. */
  max?: number;
  /** Precyzja pełnej lub połówkowej oceny. */
  step?: FormRatingInputStep;
  /** Pozwala wyczyścić ocenę klawiszem Delete/Backspace lub ponownym kliknięciem. */
  allowClear?: boolean;
  /** Wyświetla nietabowalny odczyt zamiast kontrolki. */
  readonly?: boolean;
  /** Wyłącza kontrolkę. */
  disabled?: boolean;
  /** Oznacza ocenę jako wymaganą. */
  /** Empty selection blocks native form submission; readonly and disabled are exempt. */
  required?: boolean;
  /** Mapa tekstowych opisów indeksowana wartością, np. `{ '4': 'Dobra' }`. */
  labels?: RatingLabels;
  /** Funkcja tworząca tekstowy opis wartości. */
  getLabel?: RatingLabelGetter;
  /** Nazwa ikony z katalogu PeaUI. */
  icon?: string;
  /** Rozmiar wizualny ikon; cel dotykowy zachowuje co najmniej 44 px. */
  size?: FormRatingInputSize;
  /** Widoczna etykieta pola. */
  label?: string;
  /** Tekst pomocniczy powiązany przez aria-describedby. */
  description?: string;
  /** Komunikat błędu powiązany przez aria-describedby i aria-invalid. */
  error?: string;
  /** Dostępna nazwa, gdy nie ma widocznej etykiety. */
  ariaLabel?: string;
  /** Lokalizowany tekst używany dla pustej oceny. */
  emptyLabel?: string;
  /** Locale używane do formatowania wartości połówkowych. */
  locale?: string;
  /** Pokazuje widoczny tekst bieżącej wartości. */
  showValueLabel?: boolean;
  /** Stabilny identyfikator dla testów automatycznych. */
  dataTestId?: string;
}

export type {
  FormRatingInputSize,
  FormRatingInputStep,
  RatingLabelGetter,
  RatingLabels,
  RatingValue,
} from './rating-input.shared';
</script>

<script setup lang="ts">
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import FormFieldLabel from '@/components/form/FormFieldLabel/index.vue';
import { UIKIT_NAME } from '@/constants';
import { getRequiredValueAttributes, focusInvalidValue } from '@/helpers/form-validation.helper';
import { useSlotPresence } from '@/composables/useSlotPresence';
import { computed, ref, useAttrs, useId, type CSSProperties } from 'vue';

import {
  getRatingDescription,
  getRatingItemFill,
  getRatingKeyboardValue,
  getRatingPointerValue,
  normalizeRatingMax,
  normalizeRatingStep,
  normalizeRatingValue,
  type RatingKeyboardAction,
} from './rating-input.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormRatingInputProps>(), {
  max: 5,
  step: 1,
  allowClear: false,
  readonly: false,
  disabled: false,
  required: false,
  labels: () => ({}),
  icon: 'core/star',
  size: 'm',
  label: '',
  description: '',
  error: '',
  ariaLabel: '',
  emptyLabel: 'Brak oceny',
  locale: 'pl-PL',
  showValueLabel: true,
});

const value = defineModel<number | null>('value', { default: null });

const emit = defineEmits<{
  /** Emitowane po zatwierdzeniu wartości. */
  (event: 'change', value: RatingValue, nativeEvent: Event): void;
  /** Emitowane wyłącznie dla podglądu wskaźnikiem; null oznacza jego koniec. */
  (event: 'previewChange', value: RatingValue): void;
  /** Emitowane po jawnym wyczyszczeniu wartości. */
  (event: 'clear', nativeEvent: Event): void;
  /** Emitowane przy ustawieniu fokusu na pojedynczym suwaku. */
  (event: 'focus', nativeEvent: FocusEvent): void;
  /** Emitowane po opuszczeniu pojedynczego suwaka. */
  (event: 'blur', nativeEvent: FocusEvent): void;
}>();

const attrs = useAttrs();
const labelSlot = useSlotPresence('label');
const descriptionSlot = useSlotPresence('description');
const errorSlot = useSlotPresence('error');
const generatedId = useId();
const classNameComponent = `${UIKIT_NAME}-form-rating-input`;
const inputRef = ref<HTMLInputElement>();
const previewValue = ref<RatingValue>(null);
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const normalizedMax = computed(() => normalizeRatingMax(props.max));
const normalizedStep = computed(() => normalizeRatingStep(props.step));
const committedValue = computed(() =>
  normalizeRatingValue(value.value, normalizedMax.value, normalizedStep.value),
);
const displayedValue = computed(() => previewValue.value ?? committedValue.value);
const items = computed(() => Array.from({ length: normalizedMax.value }, (_, index) => index));
const hasLabel = computed(() => Boolean(labelSlot.value || props.label.trim()));
const hasDescription = computed(() => Boolean(descriptionSlot.value || props.description.trim()));
const hasError = computed(() => Boolean(errorSlot.value || props.error.trim()));
const labelId = computed(() => `${resolvedId.value}-label-text`);
const descriptionId = computed(() => `${resolvedId.value}-default`);
const errorId = computed(() => `${resolvedId.value}-error`);
const valueLabelId = computed(() => `${resolvedId.value}-value-label`);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--size-${props.size}`,
  {
    [`${classNameComponent}--empty`]: committedValue.value === null,
    [`${classNameComponent}--preview`]: previewValue.value !== null,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
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
  return ids.size ? [...ids].join(' ') : undefined;
});
const accessibleValueText = computed(() =>
  getRatingDescription(committedValue.value, normalizedMax.value, {
    emptyLabel: `${props.emptyLabel} z ${normalizedMax.value}`,
    getLabel: props.getLabel,
    labels: props.labels,
    locale: props.locale,
  }),
);
const displayedValueText = computed(() =>
  getRatingDescription(displayedValue.value, normalizedMax.value, {
    emptyLabel: props.emptyLabel,
    getLabel: props.getLabel,
    labels: props.labels,
    locale: props.locale,
  }),
);
const controlAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'data-testid': _dataTestId,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalLabelledBy,
    'aria-describedby': _externalDescribedBy,
    ...rest
  } = attrs;
  const explicitLabel = `${externalAriaLabel ?? props.ariaLabel}`.trim();
  const labelledBy =
    `${externalLabelledBy ?? ''}`.trim() ||
    (hasLabel.value && !explicitLabel ? labelId.value : undefined);
  return {
    ...rest,
    'aria-label': labelledBy ? undefined : explicitLabel || props.name?.trim() || 'Ocena',
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy.value,
  };
});

function updatePreview(nextValue: RatingValue): void {
  if (previewValue.value === nextValue) return;
  previewValue.value = nextValue;
  emit('previewChange', nextValue);
}

function clearRating(event: Event): void {
  if (!props.allowClear || props.disabled || props.readonly) return;
  value.value = null;
  updatePreview(null);
  emit('clear', event);
  emit('change', null, event);
}

function commitRating(nextValue: number, event: Event): void {
  if (props.disabled || props.readonly) return;
  const normalized = normalizeRatingValue(nextValue, normalizedMax.value, normalizedStep.value);
  if (props.allowClear && normalized !== null && normalized === committedValue.value) {
    clearRating(event);
    return;
  }
  if (normalized === null || normalized === committedValue.value) return;
  value.value = normalized;
  emit('change', normalized, event);
}

function pointerValue(index: number, event: PointerEvent): number {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 1;
  return getRatingPointerValue(
    index,
    ratio,
    normalizedMax.value,
    normalizedStep.value,
    getComputedStyle(target).direction === 'rtl',
  );
}

function handlePointerMove(index: number, event: PointerEvent): void {
  if (props.disabled || props.readonly || event.pointerType === 'touch') return;
  updatePreview(pointerValue(index, event));
}

function handlePointerDown(index: number, event: PointerEvent): void {
  if (props.disabled || props.readonly) return;
  event.preventDefault();
  inputRef.value?.focus();
  commitRating(pointerValue(index, event), event);
}

function handleKeyboardAction(action: RatingKeyboardAction, event: KeyboardEvent): void {
  event.preventDefault();
  if (action === 'clear') {
    clearRating(event);
    return;
  }
  const next = getRatingKeyboardValue(committedValue.value, action, {
    allowClear: props.allowClear,
    max: normalizedMax.value,
    step: normalizedStep.value,
  });
  if (next !== null) commitRating(next, event);
}

function handleKeydown(event: KeyboardEvent): void {
  if (props.disabled || props.readonly) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    handleKeyboardAction('increment', event);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    handleKeyboardAction('decrement', event);
  } else if (event.key === 'Home') {
    handleKeyboardAction('minimum', event);
  } else if (event.key === 'End') {
    handleKeyboardAction('maximum', event);
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    handleKeyboardAction('clear', event);
  }
}

function handleNativeInput(event: Event): void {
  commitRating(Number((event.currentTarget as HTMLInputElement).value), event);
}
</script>

<template>
  <div
    :class="rootClasses"
    :style="rootStyle"
    :data-value="committedValue ?? undefined"
    :data-preview-value="previewValue ?? undefined"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :data-invalid="hasError || undefined"
    :data-testid="dataTestId"
  >
    <FormFieldLabel
      v-if="hasLabel"
      :for="resolvedId"
      :text="label"
      :readonly
      :required
      :data-test-id="dataTestId ? `${dataTestId}-label` : undefined"
    >
      <template #default>
        <span :id="labelId"
          ><slot name="label">{{ label }}</slot></span
        >
      </template>
    </FormFieldLabel>

    <div :class="`${classNameComponent}__control-row`">
      <div :class="`${classNameComponent}__control`" @pointerleave="updatePreview(null)">
        <input
          v-if="!readonly"
          v-bind="controlAttrs"
          :id="resolvedId"
          ref="inputRef"
          :form="form"
          :class="`${classNameComponent}__input`"
          :min="0"
          :max="normalizedMax"
          :step="normalizedStep"
          :value="committedValue ?? 0"
          :disabled
          type="range"
          :aria-valuemin="0"
          :aria-valuemax="normalizedMax"
          :aria-valuenow="committedValue ?? 0"
          :aria-valuetext="accessibleValueText"
          :aria-required="required || undefined"
          :aria-invalid="hasError || undefined"
          :data-testid="dataTestId ? `${dataTestId}-element` : undefined"
          @keydown="handleKeydown"
          @input="handleNativeInput"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <meter
          v-else
          v-bind="controlAttrs"
          :id="resolvedId"
          :class="`${classNameComponent}__meter`"
          :min="0"
          :max="normalizedMax"
          :value="committedValue ?? 0"
          :aria-valuetext="accessibleValueText"
          :data-testid="dataTestId ? `${dataTestId}-element` : undefined"
        >
          {{ accessibleValueText }}
        </meter>

        <span :class="`${classNameComponent}__items`" aria-hidden="true">
          <span
            v-for="index in items"
            :key="index"
            :class="`${classNameComponent}__item`"
            :data-rating-value="index + 1"
            @pointermove="handlePointerMove(index, $event)"
            @pointerdown="handlePointerDown(index, $event)"
          >
            <span :class="`${classNameComponent}__icon-frame`">
              <span :class="`${classNameComponent}__icon ${classNameComponent}__icon--base`">
                <slot
                  name="icon"
                  :index="index"
                  :value="displayedValue"
                  :fill="getRatingItemFill(displayedValue, index)"
                >
                  <SvgIcon :name="icon" aria-hidden="true" focusable="false" />
                </slot>
              </span>
              <span
                :class="`${classNameComponent}__icon ${classNameComponent}__icon--fill`"
                :style="{
                  '--peaui-rating-item-fill': `${getRatingItemFill(displayedValue, index)}%`,
                }"
              >
                <slot
                  name="icon"
                  :index="index"
                  :value="displayedValue"
                  :fill="getRatingItemFill(displayedValue, index)"
                >
                  <SvgIcon :name="icon" aria-hidden="true" focusable="false" />
                </slot>
              </span>
            </span>
          </span>
        </span>
      </div>

      <output
        v-if="showValueLabel"
        :id="valueLabelId"
        :class="`${classNameComponent}__value-label`"
        :for="resolvedId"
        :title="displayedValueText"
        aria-hidden="true"
      >
        <slot name="value-label" :value="displayedValue" :text="displayedValueText">
          {{ displayedValueText }}
        </slot>
      </output>
    </div>

    <input
      v-bind="
        getRequiredValueAttributes(committedValue !== null, required, disabled, readonly, form)
      "
      @invalid="focusInvalidValue($event, inputRef)"
    />
    <input
      v-if="name && committedValue !== null && !disabled"
      :name
      :form
      :value="committedValue"
      type="hidden"
    />

    <MessageText
      v-if="hasDescription"
      :id="descriptionId"
      :data-test-id="dataTestId ? `${dataTestId}-description` : undefined"
      size="xs"
      variant="default"
      :with-icon="false"
    >
      <slot name="description">{{ description }}</slot>
    </MessageText>
    <MessageText
      v-if="hasError"
      :id="errorId"
      :data-test-id="dataTestId ? `${dataTestId}-error` : undefined"
      aria-live="polite"
      size="xs"
      variant="error"
      :with-icon="false"
    >
      <slot name="error">{{ error }}</slot>
    </MessageText>
  </div>
</template>

<style lang="scss">
@use './styles.scss';
</style>
