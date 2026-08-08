<script lang="ts">
import type {
  DateRangeFormatter,
  DateRangeParser,
  DateRangePreset,
  DateRangeValue,
  FormDateRangePickerCalendars,
  FormDateRangePickerDateFormat,
  FormDateRangePickerInvalidDetail,
  FormDateRangePickerPlacement,
  FormDateRangePickerSelectionOrder,
  FormDateRangePickerVariant,
} from './date-range-picker.shared';

export type FormDateRangePickerProps = {
  ariaLabel?: string;
  calendars?: FormDateRangePickerCalendars;
  canErase?: boolean;
  confirm?: boolean;
  dataTestId?: string;
  dateFormat?: FormDateRangePickerDateFormat;
  description?: string;
  disabled?: boolean;
  endLabel?: string;
  endPlaceholder?: string;
  error?: string;
  format?: DateRangeFormatter;
  id: string;
  isDateDisabled?: (date: string) => boolean;
  label?: string;
  loading?: boolean;
  loadingLabel?: string;
  locale?: string;
  maxDate?: string;
  minDate?: string;
  name: string;
  panelAriaLabel?: string;
  parse?: DateRangeParser;
  placement?: FormDateRangePickerPlacement;
  placeholder?: string;
  presets?: DateRangePreset[];
  readonly?: boolean;
  required?: boolean;
  selectionOrder?: FormDateRangePickerSelectionOrder;
  showPresets?: boolean;
  startLabel?: string;
  startPlaceholder?: string;
  variant?: FormDateRangePickerVariant;
};

export type {
  DateRangeCalendarDay,
  DateRangeFormatContext,
  DateRangeFormatter,
  DateRangeParser,
  DateRangePreset,
  DateRangeValue,
  FormDateRangePickerCalendars,
  FormDateRangePickerDateFormat,
  FormDateRangePickerInvalidDetail,
  FormDateRangePickerInvalidReason,
  FormDateRangePickerPlacement,
  FormDateRangePickerSection,
  FormDateRangePickerSelectionOrder,
  FormDateRangePickerVariant,
} from './date-range-picker.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
  type StyleValue,
} from 'vue';

import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import PickerNavigation from '../FormDatePicker/PickerNavigation.vue';
import {
  addDays,
  buildRangeCalendarDays,
  cloneDateRange,
  formatDateRange,
  formatRangeEndpoint,
  getCalendarLabels,
  getDateAriaLabel,
  getDateParts,
  getRangeStatus,
  getTodayModelDate,
  isCompleteDateRange,
  isDateUnavailable,
  normalizeManualRange,
  parseDateRange,
  parseRangeEndpoint,
  selectRangeDate,
  shiftMonth,
  validateDateRange,
  type DateRangeCalendarDay,
  type DateRangeValidationOptions,
} from './date-range-picker.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormDateRangePickerProps>(), {
  calendars: 2,
  canErase: true,
  confirm: false,
  dateFormat: 'locale',
  endLabel: 'Data końcowa',
  endPlaceholder: '',
  loading: false,
  loadingLabel: 'Ładowanie wyboru zakresu dat',
  locale: 'pl-PL',
  panelAriaLabel: 'Wybierz zakres dat',
  placement: 'bottom',
  placeholder: '',
  presets: () => [],
  selectionOrder: 'swap',
  showPresets: true,
  startLabel: 'Data początkowa',
  startPlaceholder: '',
  variant: 'two-inputs',
});

const emit = defineEmits<{
  (event: 'apply', value: [string, string]): void;
  (event: 'cancel'): void;
  (event: 'change', value: DateRangeValue | undefined): void;
  (event: 'close'): void;
  (event: 'endChange', value: string | undefined): void;
  (event: 'invalid', detail: FormDateRangePickerInvalidDetail): void;
  (event: 'monthChange', value: { month: number; year: number }): void;
  (event: 'open'): void;
  (event: 'startChange', value: string | undefined): void;
}>();

defineSlots<{
  day?(props: { day: DateRangeCalendarDay; select: () => void }): unknown;
  description?(): unknown;
  'end-label'?(): unknown;
  error?(props: { reason: FormDateRangePickerInvalidDetail['reason'] | undefined }): unknown;
  footer?(props: { apply: () => void; cancel: () => void; valid: boolean }): unknown;
  hint?(): unknown;
  preset?(props: { preset: DateRangePreset; select: () => void }): unknown;
  'start-label'?(): unknown;
  trigger?(props: { displayValue: string; open: boolean; toggle: () => void }): unknown;
}>();

type PopoverReference = { hidePopover: () => void; showPopover: () => void };

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance() as ({ ce?: HTMLElement; isCE?: boolean } & object) | null;
const modelValue = defineModel<DateRangeValue | undefined>('value');
const openModel = defineModel<boolean>('open', { default: false });
const classNameComponent = `${UIKIT_NAME}-form-date-range-picker`;
const popoverReference = ref<PopoverReference>();
const triggerReference = ref<HTMLElement>();
const activeDayReference = ref<HTMLElement>();
const isOpen = ref(false);
const touched = ref(false);
const draft = ref<DateRangeValue>([undefined, undefined]);
const hoverDate = ref<string>();
const singleText = ref('');
const startText = ref('');
const endText = ref('');
const activeDate = ref(getTodayModelDate());
const initialParts = getDateParts(modelValue.value?.[0]);
const visibleYear = ref(initialParts.year);
const visibleMonth = ref(initialParts.month);
const popoverPlacement = ref<FormDateRangePickerPlacement>(props.placement);
const availablePanelHeight = ref(640);

const blocked = computed(() => props.disabled || props.readonly || props.loading);
const validationOptions = computed(
  (): DateRangeValidationOptions => ({
    isDateDisabled: props.isDateDisabled,
    maxDate: props.maxDate,
    minDate: props.minDate,
  }),
);
const formatOptions = computed(() => ({
  dateFormat: props.dateFormat,
  format: props.format,
  locale: props.locale,
}));
const parseOptions = computed(() => ({
  dateFormat: props.dateFormat,
  locale: props.locale,
  parse: props.parse,
}));
const draftReason = computed(() =>
  validateDateRange(draft.value, validationOptions.value, props.required),
);
const publicReason = computed(() => (touched.value ? draftReason.value : undefined));
const hasError = computed(() => Boolean(props.error || publicReason.value));
const displayValue = computed(() => formatDateRange(modelValue.value, formatOptions.value));
const resolvedDatePlaceholder = computed(() =>
  props.dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr',
);
const resolvedPlaceholder = computed(
  () => props.placeholder || `${resolvedDatePlaceholder.value} – ${resolvedDatePlaceholder.value}`,
);
const months = computed(() =>
  Array.from({ length: props.calendars }, (_, index) => {
    const month = shiftMonth(visibleYear.value, visibleMonth.value, index);
    const labels = getCalendarLabels(props.locale, month.year, month.month);
    const days = buildRangeCalendarDays(
      month.year,
      month.month,
      draft.value,
      hoverDate.value,
      validationOptions.value,
    );
    return {
      ...month,
      days,
      labels,
      rows: Array.from({ length: 6 }, (_, row) => days.slice(row * 7, row * 7 + 7)),
    };
  }),
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${props.variant}`,
  `${classNameComponent}--calendars-${props.calendars}`,
  {
    [`${classNameComponent}--open`]: isOpen.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--error`]: hasError.value,
  },
  attrs.class,
]);
const panelId = computed(() => `${props.id}-panel`);
const panelHeadingId = computed(() => `${props.id}-panel-heading`);
const statusId = computed(() => `${props.id}-range-status`);
const baseTestId = computed(() => props.dataTestId || (attrs['data-testid'] as string | undefined));

function hasSlot(name: string): boolean {
  if (slots[name]) return true;
  return Boolean(instance?.isCE && instance.ce?.hasAttribute(`data-peaui-native-slot-${name}`));
}

function getFieldAria(fieldProps: Record<string, unknown>, name: string): string | undefined {
  const value = fieldProps[name];
  return typeof value === 'string' ? value : undefined;
}

function getFieldDescription(fieldProps: Record<string, unknown>): string | undefined {
  return getFieldAria(fieldProps, 'aria-describedby');
}

function syncText(value: DateRangeValue | undefined): void {
  singleText.value = formatDateRange(value, formatOptions.value);
  startText.value = formatRangeEndpoint(value?.[0], 'start', formatOptions.value);
  endText.value = formatRangeEndpoint(value?.[1], 'end', formatOptions.value);
}

function syncDraft(value: DateRangeValue | undefined = modelValue.value): void {
  draft.value = cloneDateRange(value);
  syncText(value);
  const parts = getDateParts(value?.[0] ?? value?.[1]);
  visibleYear.value = parts.year;
  visibleMonth.value = parts.month;
  activeDate.value = value?.[0] ?? getTodayModelDate();
  hoverDate.value = undefined;
}

function commit(next: DateRangeValue | undefined): void {
  const normalized = next && (next[0] || next[1]) ? cloneDateRange(next) : undefined;
  modelValue.value = normalized;
  emit('change', normalized);
}

function reportInvalid(
  reason: FormDateRangePickerInvalidDetail['reason'],
  section: FormDateRangePickerInvalidDetail['section'],
  input: FormDateRangePickerInvalidDetail['input'],
): void {
  touched.value = true;
  emit('invalid', { input, reason, section });
}

function updateDraft(next: DateRangeValue, closeWhenComplete = false): void {
  const previous = draft.value;
  draft.value = cloneDateRange(next);
  syncText(next);
  if (previous[0] !== next[0]) emit('startChange', next[0]);
  if (previous[1] !== next[1]) emit('endChange', next[1]);
  if (!props.confirm) {
    commit(next);
    if (closeWhenComplete && isCompleteDateRange(next)) closePicker(true);
  }
}

function syncPopoverPlacement(): void {
  const trigger = triggerReference.value;
  if (!trigger || typeof window === 'undefined') return;
  const rect = trigger.getBoundingClientRect();
  const above = rect.top;
  const below = window.innerHeight - rect.bottom;
  const preferred = props.placement === 'bottom' ? below : above;
  const fallback = props.placement === 'bottom' ? 'top' : 'bottom';
  const fallbackSpace = fallback === 'bottom' ? below : above;
  const estimated = props.calendars === 2 ? 590 : 500;
  popoverPlacement.value =
    preferred >= estimated || preferred >= fallbackSpace ? props.placement : fallback;
  availablePanelHeight.value = Math.max(
    260,
    (popoverPlacement.value === 'bottom' ? below : above) - 10,
  );
}

function openPicker(focusCalendar = false): void {
  if (blocked.value) return;
  if (!isOpen.value) syncDraft();
  syncPopoverPlacement();
  popoverReference.value?.showPopover();
  if (focusCalendar) void nextTick(() => activeDayReference.value?.focus());
}

function closePicker(restoreFocus = false): void {
  popoverReference.value?.hidePopover();
  if (restoreFocus) {
    void nextTick(() =>
      triggerReference.value?.querySelector<HTMLElement>('input, button')?.focus(),
    );
  }
}

function togglePicker(): void {
  if (isOpen.value) closePicker(true);
  else openPicker();
}

function handlePopoverState(next: boolean): void {
  if (next === isOpen.value) return;
  isOpen.value = next;
  openModel.value = next;
  if (next) {
    touched.value = false;
    emit('open');
  } else {
    if (props.confirm) syncDraft();
    emit('close');
  }
}

function handleErase(): void {
  if (blocked.value) return;
  const previous = cloneDateRange(draft.value);
  syncDraft(undefined);
  commit(undefined);
  if (previous[0]) emit('startChange', undefined);
  if (previous[1]) emit('endChange', undefined);
  closePicker(true);
}

function commitSingleInput(): void {
  const parsed = parseDateRange(singleText.value, parseOptions.value);
  if (!parsed) {
    reportInvalid('format', 'value', singleText.value);
    return;
  }
  const normalized = normalizeManualRange(parsed, props.selectionOrder);
  if (normalized.invalid) {
    reportInvalid(normalized.invalid, 'value', singleText.value);
    return;
  }
  const reason = validateDateRange(normalized.value, validationOptions.value, false);
  if (reason && reason !== 'partial') {
    reportInvalid(reason, 'value', singleText.value);
    return;
  }
  updateDraft(normalized.value);
}

function commitEndpoint(endpoint: 'start' | 'end'): void {
  const input = endpoint === 'start' ? startText.value : endText.value;
  const parsed = parseRangeEndpoint(input, endpoint, parseOptions.value);
  if (input.trim() && !parsed) {
    reportInvalid('format', endpoint, input);
    return;
  }
  const next: DateRangeValue =
    endpoint === 'start' ? [parsed, draft.value[1]] : [draft.value[0], parsed];
  const normalized = normalizeManualRange(next, props.selectionOrder);
  if (normalized.invalid) {
    reportInvalid(normalized.invalid, endpoint, input);
    return;
  }
  const reason = validateDateRange(normalized.value, validationOptions.value, false);
  if (reason && reason !== 'partial') {
    reportInvalid(reason, endpoint, input);
    return;
  }
  updateDraft(normalized.value);
}

function selectDate(date: string): void {
  if (blocked.value || isDateUnavailable(date, validationOptions.value)) return;
  activeDate.value = date;
  const result = selectRangeDate(draft.value, date, props.selectionOrder);
  if (result.invalid) {
    reportInvalid(result.invalid, 'end', cloneDateRange(draft.value));
    return;
  }
  updateDraft(result.value, true);
  hoverDate.value = undefined;
}

function selectPreset(preset: DateRangePreset): void {
  if (preset.disabled || blocked.value) return;
  const result = normalizeManualRange(cloneDateRange(preset.value), props.selectionOrder);
  const reason = result.invalid ?? validateDateRange(result.value, validationOptions.value, true);
  if (reason) {
    reportInvalid(reason, 'value', cloneDateRange(preset.value));
    return;
  }
  updateDraft(result.value, true);
}

function navigateMonth(offset: number): void {
  const next = shiftMonth(visibleYear.value, visibleMonth.value, offset);
  visibleYear.value = next.year;
  visibleMonth.value = next.month;
  activeDate.value = `${String(next.year).padStart(4, '0')}-${String(next.month).padStart(2, '0')}-01`;
  activeDayReference.value = undefined;
  emit('monthChange', next);
}

function setActiveDayReference(element: unknown, date: string, outsideMonth: boolean): void {
  if (
    date === activeDate.value &&
    !outsideMonth &&
    element instanceof HTMLElement &&
    !activeDayReference.value
  ) {
    activeDayReference.value = element;
  }
}

function focusCalendarDate(date: string): void {
  activeDate.value = date;
  const parts = getDateParts(date);
  const lastMonth = shiftMonth(visibleYear.value, visibleMonth.value, props.calendars - 1);
  const before = date < `${visibleYear.value}-${String(visibleMonth.value).padStart(2, '0')}-01`;
  const after = date > `${lastMonth.year}-${String(lastMonth.month).padStart(2, '0')}-31`;
  if (before || after) {
    visibleYear.value = parts.year;
    visibleMonth.value = parts.month;
  }
  activeDayReference.value = undefined;
  void nextTick(() => activeDayReference.value?.focus());
}

function nextEnabledDate(date: string, offset: number): string {
  let next = addDays(date, offset);
  for (let index = 0; index < 370 && isDateUnavailable(next, validationOptions.value); index += 1) {
    next = addDays(next, offset > 0 ? 1 : -1);
  }
  return next;
}

function handleDayKeydown(event: KeyboardEvent, date: string): void {
  let offset: number | undefined;
  if (event.key === 'ArrowLeft') offset = -1;
  else if (event.key === 'ArrowRight') offset = 1;
  else if (event.key === 'ArrowUp') offset = -7;
  else if (event.key === 'ArrowDown') offset = 7;
  else if (event.key === 'Home') offset = -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7);
  else if (event.key === 'End') offset = 6 - ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7);
  if (offset !== undefined) {
    event.preventDefault();
    focusCalendarDate(nextEnabledDate(date, offset));
    return;
  }
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault();
    const parts = getDateParts(date);
    const shifted = shiftMonth(parts.year, parts.month, event.key === 'PageDown' ? 1 : -1);
    const maxDay = new Date(Date.UTC(shifted.year, shifted.month, 0)).getUTCDate();
    const next = `${String(shifted.year).padStart(4, '0')}-${String(shifted.month).padStart(2, '0')}-${String(Math.min(parts.day, maxDay)).padStart(2, '0')}`;
    focusCalendarDate(nextEnabledDate(next, event.key === 'PageDown' ? 1 : -1));
  }
}

function applySelection(): void {
  touched.value = true;
  const reason = validateDateRange(draft.value, validationOptions.value, props.required);
  if (reason || !isCompleteDateRange(draft.value)) {
    reportInvalid(reason ?? 'partial', 'value', cloneDateRange(draft.value));
    return;
  }
  const next: [string, string] = [draft.value[0], draft.value[1]];
  commit(next);
  emit('apply', next);
  closePicker(true);
}

function cancelSelection(): void {
  syncDraft();
  emit('cancel');
  closePicker(true);
}

function invalidMessage(): string {
  if (props.error) return props.error;
  if (publicReason.value === 'empty') return 'Wybierz datę początkową i końcową.';
  if (publicReason.value === 'partial') return 'Uzupełnij obie daty zakresu.';
  if (publicReason.value === 'format') return 'Wpisz poprawną datę.';
  if (publicReason.value === 'order')
    return 'Data końcowa nie może być wcześniejsza niż początkowa.';
  if (publicReason.value === 'range') return 'Zakres wykracza poza dozwolone daty.';
  if (publicReason.value === 'disabled') return 'Jedna z wybranych dat jest niedostępna.';
  return '';
}

function getInputBindings(
  fieldProps: Record<string, unknown>,
  inputId = props.id,
  sectionLabel?: string,
) {
  const forwarded = { ...attrs } as Record<string, unknown>;
  delete forwarded.class;
  delete forwarded.style;
  delete forwarded['data-testid'];
  return {
    ...forwarded,
    ...fieldProps,
    id: inputId,
    'aria-busy': props.loading || undefined,
    'aria-controls': panelId.value,
    'aria-describedby': [getFieldDescription(fieldProps), statusId.value].filter(Boolean).join(' '),
    'aria-expanded': isOpen.value,
    'aria-haspopup': 'dialog' as const,
    'aria-invalid': hasError.value || undefined,
    'aria-label':
      sectionLabel ||
      props.ariaLabel ||
      (props.label ? undefined : getFieldAria(fieldProps, 'aria-label')),
    'aria-labelledby':
      sectionLabel || props.ariaLabel
        ? undefined
        : props.label
          ? `label-${props.id}`
          : getFieldAria(fieldProps, 'aria-labelledby'),
    'aria-readonly': props.readonly || undefined,
  };
}

watch(
  modelValue,
  (value) => {
    if (!isOpen.value || !props.confirm) syncDraft(value);
  },
  { deep: true, immediate: true },
);
watch(
  () => [props.locale, props.dateFormat, props.format],
  () => syncText(modelValue.value),
);
watch(openModel, (next) => {
  if (next && !isOpen.value) openPicker();
  else if (!next && isOpen.value) closePicker();
});
</script>

<template>
  <PopoverOverlayer
    ref="popoverReference"
    :class="rootClasses"
    :content-class="`${classNameComponent}__popover-content`"
    :data-test-id="baseTestId ? `${baseTestId}-popover` : undefined"
    :disabled="blocked"
    match-trigger-width
    :placement="popoverPlacement"
    popup-type="dialog"
    :style="attrs.style"
    @update:open="handlePopoverState"
  >
    <div ref="triggerReference" :class="`${classNameComponent}__trigger-host`">
      <slot name="trigger" :display-value="displayValue" :open="isOpen" :toggle="togglePicker">
        <FormField
          :can-erase="props.canErase"
          :disabled="props.disabled || props.loading"
          icon-after="calendar"
          :id="props.id"
          :label="props.label"
          :name="props.name"
          :placeholder="resolvedPlaceholder"
          :readonly="props.readonly"
          :required="props.required"
          :value="displayValue"
          :data-test-id="baseTestId"
          @on:remove="handleErase"
        >
          <template v-if="hasSlot('hint')" #hint><slot name="hint" /></template>
          <template #default="{ props: fieldProps }">
            <input
              v-if="props.variant === 'single-input'"
              v-bind="getInputBindings(fieldProps)"
              :class="[fieldProps.class, `${classNameComponent}__input`]"
              :data-testid="baseTestId ? `${baseTestId}-input` : undefined"
              type="text"
              role="combobox"
              aria-autocomplete="none"
              autocomplete="off"
              :disabled="props.disabled || props.loading"
              :placeholder="resolvedPlaceholder"
              :readonly="props.readonly"
              :value="singleText"
              @blur="commitSingleInput"
              @click.stop="openPicker()"
              @input.stop="singleText = ($event.target as HTMLInputElement).value"
              @keydown.down.prevent="openPicker(true)"
              @keydown.esc="closePicker(true)"
            />
            <div
              v-else
              :class="[fieldProps.class, `${classNameComponent}__range-fields`]"
              :style="fieldProps.style as StyleValue"
              :aria-busy="props.loading || undefined"
              :aria-describedby="getFieldDescription(fieldProps)"
              :aria-invalid="hasError || undefined"
              :aria-labelledby="props.label ? `label-${props.id}` : undefined"
              :aria-label="props.ariaLabel || (!props.label ? props.name : undefined)"
              role="group"
            >
              <label :class="`${classNameComponent}__range-field`">
                <span :class="`${classNameComponent}__input-label`">
                  <slot name="start-label">{{ props.startLabel }}</slot>
                </span>
                <input
                  v-bind="getInputBindings(fieldProps, props.id, props.startLabel)"
                  :class="`${classNameComponent}__range-input`"
                  :data-testid="baseTestId ? `${baseTestId}-start-input` : undefined"
                  type="text"
                  role="combobox"
                  aria-autocomplete="none"
                  autocomplete="off"
                  :disabled="props.disabled || props.loading"
                  :placeholder="props.startPlaceholder || resolvedDatePlaceholder"
                  :readonly="props.readonly"
                  :value="startText"
                  @blur="commitEndpoint('start')"
                  @click.stop="openPicker()"
                  @input.stop="startText = ($event.target as HTMLInputElement).value"
                  @keydown.down.prevent="openPicker(true)"
                />
              </label>
              <span aria-hidden="true" :class="`${classNameComponent}__range-separator`">–</span>
              <label :class="`${classNameComponent}__range-field`">
                <span :class="`${classNameComponent}__input-label`">
                  <slot name="end-label">{{ props.endLabel }}</slot>
                </span>
                <input
                  v-bind="getInputBindings(fieldProps, `${props.id}-end`, props.endLabel)"
                  :class="`${classNameComponent}__range-input`"
                  :data-testid="baseTestId ? `${baseTestId}-end-input` : undefined"
                  type="text"
                  role="combobox"
                  aria-autocomplete="none"
                  autocomplete="off"
                  :disabled="props.disabled || props.loading"
                  :placeholder="props.endPlaceholder || resolvedDatePlaceholder"
                  :readonly="props.readonly"
                  :value="endText"
                  @blur="commitEndpoint('end')"
                  @click.stop="openPicker()"
                  @input.stop="endText = ($event.target as HTMLInputElement).value"
                  @keydown.down.prevent="openPicker(true)"
                />
              </label>
            </div>
          </template>
          <template v-if="hasSlot('description') || props.description" #description>
            <slot name="description">{{ props.description }}</slot>
          </template>
          <template v-if="hasSlot('error') || hasError" #error>
            <slot name="error" :reason="publicReason">{{ invalidMessage() }}</slot>
          </template>
        </FormField>
        <span v-if="props.loading" :class="`${classNameComponent}__loading-status`" role="status">
          <span aria-hidden="true" :class="`${classNameComponent}__spinner`" />
          {{ props.loadingLabel }}
        </span>
      </slot>
      <input type="hidden" :name="`${props.name}.start`" :value="modelValue?.[0] || ''" />
      <input type="hidden" :name="`${props.name}.end`" :value="modelValue?.[1] || ''" />
    </div>

    <template #content>
      <section
        :id="panelId"
        :aria-label="props.panelAriaLabel"
        :aria-labelledby="props.panelAriaLabel ? undefined : panelHeadingId"
        :class="`${classNameComponent}__panel`"
        :style="{ '--peaui-form-date-range-picker-available-height': `${availablePanelHeight}px` }"
        role="dialog"
        @keydown.esc.prevent="props.confirm ? cancelSelection() : closePicker(true)"
      >
        <h2 :id="panelHeadingId" :class="`${classNameComponent}__sr-only`">
          {{ props.panelAriaLabel }}
        </h2>
        <p :id="statusId" :class="`${classNameComponent}__sr-only`" aria-live="polite">
          {{ getRangeStatus(draft, props.locale) }}
        </p>
        <aside
          v-if="props.showPresets && props.presets.length"
          :aria-label="'Gotowe zakresy dat'"
          :class="`${classNameComponent}__presets`"
        >
          <ButtonAction
            v-for="preset in props.presets"
            :key="preset.id"
            :class="`${classNameComponent}__preset`"
            :disabled="preset.disabled || blocked"
            size="xxs"
            variant="ghost"
            @click="selectPreset(preset)"
          >
            <slot name="preset" :preset="preset" :select="() => selectPreset(preset)">
              {{ preset.label }}
            </slot>
          </ButtonAction>
        </aside>

        <div :class="`${classNameComponent}__calendar-area`">
          <div :class="`${classNameComponent}__calendar-navigation`">
            <p :class="`${classNameComponent}__selection-summary`">
              {{ getRangeStatus(draft, props.locale) }}
            </p>
            <PickerNavigation
              :data-test-id="baseTestId ? `${baseTestId}-calendar-navigation` : undefined"
              next-label="Następny miesiąc"
              previous-label="Poprzedni miesiąc"
              @on:next="navigateMonth(1)"
              @on:previous="navigateMonth(-1)"
            />
          </div>
          <div :class="`${classNameComponent}__calendars`">
            <section
              v-for="(month, monthIndex) in months"
              :key="`${month.year}-${month.month}`"
              :aria-labelledby="`${props.id}-month-${monthIndex}`"
              :class="`${classNameComponent}__calendar-section`"
            >
              <h3
                :id="`${props.id}-month-${monthIndex}`"
                :class="`${classNameComponent}__month-label`"
              >
                {{ month.labels.month }}
              </h3>
              <div
                :aria-label="month.labels.month"
                :class="`${classNameComponent}__calendar`"
                role="grid"
              >
                <div :class="`${classNameComponent}__calendar-row`" role="row">
                  <span
                    v-for="weekday in month.labels.weekdays"
                    :key="weekday.long"
                    :abbr="weekday.long"
                    :class="`${classNameComponent}__weekday`"
                    role="columnheader"
                    >{{ weekday.short }}</span
                  >
                </div>
                <div
                  v-for="(row, rowIndex) in month.rows"
                  :key="rowIndex"
                  :class="`${classNameComponent}__calendar-row`"
                  role="row"
                >
                  <button
                    v-for="day in row"
                    :key="day.date"
                    :ref="(element) => setActiveDayReference(element, day.date, day.outsideMonth)"
                    type="button"
                    :aria-current="day.today ? 'date' : undefined"
                    :aria-label="getDateAriaLabel(day.date, props.locale, day)"
                    :aria-selected="day.start || day.end || day.inRange"
                    :class="[
                      `${classNameComponent}__day`,
                      {
                        [`${classNameComponent}__day--outside`]: day.outsideMonth,
                        [`${classNameComponent}__day--in-range`]: day.inRange,
                        [`${classNameComponent}__day--preview`]: day.inPreview,
                        [`${classNameComponent}__day--start`]: day.start,
                        [`${classNameComponent}__day--end`]: day.end,
                        [`${classNameComponent}__day--today`]: day.today,
                      },
                    ]"
                    :data-date="day.date"
                    :data-month-index="monthIndex"
                    :disabled="day.disabled"
                    role="gridcell"
                    :tabindex="day.date === activeDate && !day.outsideMonth ? 0 : -1"
                    @blur="hoverDate = undefined"
                    @click="selectDate(day.date)"
                    @focus="hoverDate = day.date"
                    @keydown="handleDayKeydown($event, day.date)"
                    @mouseenter="hoverDate = day.date"
                    @mouseleave="hoverDate = undefined"
                  >
                    <slot name="day" :day="day" :select="() => selectDate(day.date)">{{
                      day.day
                    }}</slot>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer v-if="props.confirm || hasSlot('footer')" :class="`${classNameComponent}__footer`">
          <slot
            name="footer"
            :apply="applySelection"
            :cancel="cancelSelection"
            :valid="!draftReason && isCompleteDateRange(draft)"
          >
            <ButtonAction
              :class="`${classNameComponent}__button ${classNameComponent}__button--secondary`"
              size="xs"
              variant="secondary"
              @click="cancelSelection"
            >
              Anuluj
            </ButtonAction>
            <ButtonAction
              :class="`${classNameComponent}__button ${classNameComponent}__button--primary`"
              :disabled="Boolean(draftReason || !isCompleteDateRange(draft))"
              size="xs"
              variant="primary"
              @click="applySelection"
            >
              Zastosuj
            </ButtonAction>
          </slot>
        </footer>
      </section>
    </template>
  </PopoverOverlayer>
</template>
