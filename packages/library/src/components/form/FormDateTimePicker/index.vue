<script lang="ts">
import type { FormTimePickerFormat } from '../FormTimePicker/time-picker.shared';
import type {
  FormDateTimePickerDateFormat,
  FormDateTimePickerInvalidDetail,
  FormDateTimePickerLayout,
  FormDateTimePickerPlacement,
  FormDateTimePickerVariant,
  LocalDateTimeValue,
} from './date-time-picker.shared';

export type FormDateTimePickerProps = {
  allowOffStep?: boolean;
  ariaLabel?: string;
  canErase?: boolean;
  confirm?: boolean;
  dataTestId?: string;
  dateFormat?: FormDateTimePickerDateFormat;
  description?: string;
  disabled?: boolean;
  error?: string;
  format?: FormTimePickerFormat;
  hourStep?: number;
  id: string;
  isDateTimeDisabled?: (value: LocalDateTimeValue) => boolean;
  label?: string;
  layout?: FormDateTimePickerLayout;
  loading?: boolean;
  loadingLabel?: string;
  locale?: string;
  max?: LocalDateTimeValue;
  min?: LocalDateTimeValue;
  minuteStep?: number;
  name: string;
  panelAriaLabel?: string;
  placeholder?: string;
  placement?: FormDateTimePickerPlacement;
  readonly?: boolean;
  required?: boolean;
  secondStep?: number;
  showSeconds?: boolean;
  showTimeZone?: boolean;
  timeZone?: string;
  variant?: FormDateTimePickerVariant;
};

export type {
  FormDateTimePickerDateFormat,
  FormDateTimePickerInvalidDetail,
  FormDateTimePickerInvalidReason,
  FormDateTimePickerLayout,
  FormDateTimePickerPlacement,
  FormDateTimePickerSection,
  FormDateTimePickerVariant,
  LocalDateTimeValue,
} from './date-time-picker.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { useFormControlReset } from '@/composables/useFormControlReset';
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

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import PickerNavigation from '../FormDatePicker/PickerNavigation.vue';
import {
  DEFAULT_TIME_PARTS,
  formatDisplayTime,
  formatModelTime,
  getAdjacentSegmentValue,
  getSegmentRange,
  getSegmentText,
  getSegmentValue,
  normalizeStep,
  parseDisplayTime,
  parseModelTime,
  setTimeSegment,
  type TimePickerSegment,
  type TimePickerParts,
  type TimePickerValidationOptions,
} from '../FormTimePicker/time-picker.shared';
import {
  addDays,
  buildCalendarDays,
  formatDateTimeDisplay,
  formatDisplayDate,
  getCalendarLabels,
  getDateParts,
  getTimeBoundary,
  getTodayModelDate,
  parseDateTimeDisplay,
  parseDisplayDate,
  shiftMonth,
  validateLocalDateTime,
  type DateTimeValidationOptions,
} from './date-time-picker.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormDateTimePickerProps>(), {
  allowOffStep: false,
  canErase: true,
  confirm: false,
  dateFormat: 'locale',
  format: '24h',
  hourStep: 1,
  layout: 'side-by-side',
  loading: false,
  loadingLabel: 'Ładowanie wyboru daty i czasu',
  locale: 'pl-PL',
  minuteStep: 5,
  panelAriaLabel: 'Wybierz datę i czas',
  placeholder: '',
  placement: 'bottom',
  secondStep: 5,
  showSeconds: false,
  showTimeZone: false,
  variant: 'single-input',
});

const emit = defineEmits<{
  (event: 'apply', value: LocalDateTimeValue): void;
  (event: 'cancel'): void;
  (event: 'change', value: LocalDateTimeValue | undefined): void;
  (event: 'close'): void;
  (event: 'dateChange', date: string | undefined): void;
  (event: 'invalid', detail: FormDateTimePickerInvalidDetail): void;
  (event: 'open'): void;
  (event: 'timeChange', time: string | undefined): void;
}>();

defineSlots<{
  date?(props: { date: string | undefined }): unknown;
  description?(): unknown;
  error?(props: { reason: FormDateTimePickerInvalidDetail['reason'] | undefined }): unknown;
  footer?(props: { apply: () => void; cancel: () => void; valid: boolean }): unknown;
  hint?(): unknown;
  time?(props: { time: string | undefined }): unknown;
  'time-zone'?(props: { timeZone: string }): unknown;
  trigger?(props: { displayValue: string; open: boolean; toggle: () => void }): unknown;
}>();

type PopoverReference = { hidePopover: () => void; showPopover: () => void };

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance() as ({ ce?: HTMLElement; isCE?: boolean } & object) | null;
const modelValue = defineModel<LocalDateTimeValue | undefined>('value');
const openModel = defineModel<boolean>('open', { default: false });
const classNameComponent = `${UIKIT_NAME}-form-date-time-picker`;
const popoverReference = ref<PopoverReference>();
const triggerReference = ref<HTMLElement>();
useFormControlReset(triggerReference, () => {
  touched.value = false;
  syncDraft(modelValue.value);
});
const activeDayReference = ref<HTMLElement>();
const isOpen = ref(false);
const touched = ref(false);
const draft = ref<Partial<LocalDateTimeValue>>({});
const singleText = ref('');
const dateText = ref('');
const timeText = ref('');
const activeDate = ref(getTodayModelDate());
const initialParts = getDateParts(modelValue.value?.date);
const visibleYear = ref(initialParts.year);
const visibleMonth = ref(initialParts.month);
const popoverPlacement = ref<FormDateTimePickerPlacement>(props.placement);
const availablePanelHeight = ref(608);

const blocked = computed(() => props.disabled || props.readonly || props.loading);
const resolvedPlaceholder = computed(
  () =>
    props.placeholder ||
    `${props.dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr'} ${
      props.format === '12h'
        ? props.showSeconds
          ? 'gg:mm:ss AM/PM'
          : 'gg:mm AM/PM'
        : props.showSeconds
          ? 'gg:mm:ss'
          : 'gg:mm'
    }`,
);
const resolvedTimeZone = computed(() => {
  if (props.timeZone) return props.timeZone;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
  } catch {
    return 'local';
  }
});
const formatContext = computed(() => ({
  format: props.format,
  locale: props.locale,
  showSeconds: props.showSeconds,
}));
const validationOptions = computed((): DateTimeValidationOptions => ({
  allowOffStep: props.allowOffStep,
  format: props.format,
  hourStep: normalizeStep(props.hourStep, 24),
  isDateTimeDisabled: props.isDateTimeDisabled,
  locale: props.locale,
  max: props.max,
  min: props.min,
  minuteStep: normalizeStep(props.minuteStep, 60),
  secondStep: normalizeStep(props.secondStep, 60),
  showSeconds: props.showSeconds,
}));
const draftReason = computed(() => validateLocalDateTime(draft.value, validationOptions.value));
const publicReason = computed(() => {
  if (!touched.value) return undefined;
  if (!draft.value.date && !draft.value.time && props.required) return 'empty' as const;
  return draftReason.value;
});
const hasError = computed(() => Boolean(props.error || publicReason.value));
const displayValue = computed(() =>
  formatDateTimeDisplay(modelValue.value, {
    dateFormat: props.dateFormat,
    ...formatContext.value,
  }),
);
const currentTimeParts = computed(() => parseModelTime(draft.value.time) ?? DEFAULT_TIME_PARTS);
const segments = computed<TimePickerSegment[]>(() => [
  'hour',
  'minute',
  ...(props.showSeconds ? (['second'] as const) : []),
  ...(props.format === '12h' ? (['period'] as const) : []),
]);
const calendarLabels = computed(() =>
  getCalendarLabels(props.locale, visibleYear.value, visibleMonth.value),
);
const calendarDays = computed(() =>
  buildCalendarDays(
    visibleYear.value,
    visibleMonth.value,
    draft.value.date,
    draft.value.time,
    validationOptions.value,
  ),
);
const calendarRows = computed(() =>
  Array.from({ length: 6 }, (_, index) => calendarDays.value.slice(index * 7, index * 7 + 7)),
);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${props.variant}`,
  `${classNameComponent}--layout-${props.layout}`,
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
const zoneId = computed(() => `${props.id}-time-zone`);
const baseTestId = computed(() => props.dataTestId || (attrs['data-testid'] as string | undefined));

function hasSlot(name: string): boolean {
  if (slots[name]) return true;
  return Boolean(
    instance?.isCE === true && instance.ce?.hasAttribute(`data-peaui-native-slot-${name}`),
  );
}

function getFieldDescription(fieldProps: Record<string, unknown>): string | undefined {
  const value = fieldProps['aria-describedby'];
  return typeof value === 'string' ? value : undefined;
}

function getFieldAria(fieldProps: Record<string, unknown>, name: string): string | undefined {
  const value = fieldProps[name];
  return typeof value === 'string' ? value : undefined;
}

function syncDraft(value: LocalDateTimeValue | undefined = modelValue.value): void {
  draft.value = value ? { ...value } : {};
  singleText.value = formatDateTimeDisplay(value, {
    dateFormat: props.dateFormat,
    ...formatContext.value,
  });
  dateText.value = value?.date ? formatDisplayDate(value.date, props.locale, props.dateFormat) : '';
  const timeParts = parseModelTime(value?.time);
  timeText.value = timeParts ? formatDisplayTime(timeParts, formatContext.value) : '';
  const parts = getDateParts(value?.date);
  visibleYear.value = parts.year;
  visibleMonth.value = parts.month;
  activeDate.value = value?.date ?? getTodayModelDate();
}

function commit(next: LocalDateTimeValue | undefined): void {
  modelValue.value = next;
  emit('change', next);
}

function commitIfReady(): void {
  if (props.confirm || draftReason.value || !draft.value.date || !draft.value.time) return;
  commit(draft.value as LocalDateTimeValue);
}

function reportInvalid(
  reason: FormDateTimePickerInvalidDetail['reason'],
  section: FormDateTimePickerInvalidDetail['section'],
  input: FormDateTimePickerInvalidDetail['input'],
): void {
  touched.value = true;
  emit('invalid', { input, reason, section });
}

function updateDate(date: string | undefined): void {
  draft.value = { ...draft.value, date };
  dateText.value = date ? formatDisplayDate(date, props.locale, props.dateFormat) : '';
  singleText.value = formatDateTimeDisplay(
    draft.value.date && draft.value.time ? (draft.value as LocalDateTimeValue) : undefined,
    { dateFormat: props.dateFormat, ...formatContext.value },
  );
  emit('dateChange', date);
  commitIfReady();
}

function updateTime(time: string | undefined): void {
  draft.value = { ...draft.value, time };
  const parts = parseModelTime(time);
  timeText.value = parts ? formatDisplayTime(parts, formatContext.value) : '';
  singleText.value = formatDateTimeDisplay(
    draft.value.date && draft.value.time ? (draft.value as LocalDateTimeValue) : undefined,
    { dateFormat: props.dateFormat, ...formatContext.value },
  );
  emit('timeChange', time);
  commitIfReady();
}

function syncPopoverPlacement(): void {
  const trigger = triggerReference.value;
  if (!trigger || typeof window === 'undefined') return;
  const rect = trigger.getBoundingClientRect();
  const availableAbove = rect.top;
  const availableBelow = window.innerHeight - rect.bottom;
  const preferredSpace = props.placement === 'bottom' ? availableBelow : availableAbove;
  const fallback = props.placement === 'bottom' ? 'top' : 'bottom';
  const fallbackSpace = fallback === 'bottom' ? availableBelow : availableAbove;
  const estimatedHeight = props.layout === 'stacked' ? 600 : 500;
  popoverPlacement.value =
    preferredSpace >= estimatedHeight || preferredSpace >= fallbackSpace
      ? props.placement
      : fallback;
  const selectedSpace = popoverPlacement.value === 'bottom' ? availableBelow : availableAbove;
  availablePanelHeight.value = Math.max(240, selectedSpace - 10);
}

function openPicker(focusCalendar = false): void {
  if (blocked.value) return;
  syncDraft();
  syncPopoverPlacement();
  popoverReference.value?.showPopover();
  if (focusCalendar) void nextTick(() => activeDayReference.value?.focus());
}

function closePicker(restoreFocus = false): void {
  popoverReference.value?.hidePopover();
  if (restoreFocus)
    void nextTick(() =>
      triggerReference.value?.querySelector<HTMLElement>('input, button')?.focus(),
    );
}

function togglePicker(): void {
  if (isOpen.value) closePicker(true);
  else openPicker();
}

function handlePopoverState(next: boolean): void {
  if (isOpen.value === next) return;
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
  syncDraft(undefined);
  commit(undefined);
  emit('dateChange', undefined);
  emit('timeChange', undefined);
  closePicker(true);
}

function handleSingleInput(event: Event): void {
  singleText.value = (event.target as HTMLInputElement).value;
}

function commitSingleInput(): void {
  const parsed = parseDateTimeDisplay(singleText.value, {
    dateFormat: props.dateFormat,
    ...formatContext.value,
  });
  if (parsed === undefined) {
    reportInvalid('date', 'value', singleText.value);
    return;
  }
  draft.value = parsed;
  if (!parsed.date && !parsed.time) {
    if (props.required) reportInvalid('empty', 'value', singleText.value);
    else commit(undefined);
    return;
  }
  const reason = validateLocalDateTime(parsed, validationOptions.value);
  if (reason || !parsed.date || !parsed.time) {
    reportInvalid(reason ?? 'partial', 'value', singleText.value);
    return;
  }
  dateText.value = formatDisplayDate(parsed.date, props.locale, props.dateFormat);
  const parts = parseModelTime(parsed.time);
  timeText.value = parts ? formatDisplayTime(parts, formatContext.value) : '';
  emit('dateChange', parsed.date);
  emit('timeChange', parsed.time);
  if (!props.confirm) commit(parsed as LocalDateTimeValue);
}

function commitDateInput(): void {
  if (!dateText.value.trim()) {
    updateDate(undefined);
    if (draft.value.time) reportInvalid('partial', 'date', { ...draft.value });
    return;
  }
  const date = parseDisplayDate(dateText.value, props.locale, props.dateFormat);
  if (!date) {
    reportInvalid('date', 'date', dateText.value);
    return;
  }
  updateDate(date);
}

function commitTimeInput(): void {
  if (!timeText.value.trim()) {
    updateTime(undefined);
    if (draft.value.date) reportInvalid('partial', 'time', { ...draft.value });
    return;
  }
  const parts = parseDisplayTime(timeText.value, props.format, props.showSeconds);
  if (!parts) {
    reportInvalid('time', 'time', timeText.value);
    return;
  }
  updateTime(formatModelTime(parts, props.showSeconds));
}

function selectDate(date: string): void {
  const option = calendarDays.value.find((day) => day.date === date);
  if (!option || option.disabled || blocked.value) return;
  activeDate.value = date;
  const parts = getDateParts(date);
  visibleYear.value = parts.year;
  visibleMonth.value = parts.month;
  updateDate(date);
}

function navigateMonth(offset: number): void {
  const next = shiftMonth(visibleYear.value, visibleMonth.value, offset);
  visibleYear.value = next.year;
  visibleMonth.value = next.month;
}

function focusCalendarDate(date: string): void {
  activeDate.value = date;
  const parts = getDateParts(date);
  if (parts.year !== visibleYear.value || parts.month !== visibleMonth.value) {
    visibleYear.value = parts.year;
    visibleMonth.value = parts.month;
  }
  void nextTick(() => activeDayReference.value?.focus());
}

function handleDayKeydown(event: KeyboardEvent, date: string): void {
  let next: string | undefined;
  if (event.key === 'ArrowLeft') next = addDays(date, -1);
  else if (event.key === 'ArrowRight') next = addDays(date, 1);
  else if (event.key === 'ArrowUp') next = addDays(date, -7);
  else if (event.key === 'ArrowDown') next = addDays(date, 7);
  else if (event.key === 'Home')
    next = addDays(date, -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7));
  else if (event.key === 'End')
    next = addDays(date, 6 - ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7));
  else if (event.key === 'PageUp' || event.key === 'PageDown') {
    const parts = getDateParts(date);
    const shifted = shiftMonth(parts.year, parts.month, event.key === 'PageDown' ? 1 : -1);
    next = `${String(shifted.year).padStart(4, '0')}-${String(shifted.month).padStart(2, '0')}-${String(Math.min(parts.day, new Date(Date.UTC(shifted.year, shifted.month, 0)).getUTCDate())).padStart(2, '0')}`;
  }
  if (!next) return;
  event.preventDefault();
  focusCalendarDate(next);
}

function getDayAriaLabel(date: string): string {
  const parts = getDateParts(date);
  try {
    return new Intl.DateTimeFormat(props.locale, {
      dateStyle: 'full',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)));
  } catch {
    return date;
  }
}

function getTimeValidationOptions(): TimePickerValidationOptions {
  return {
    allowOffStep: props.allowOffStep,
    ...formatContext.value,
    hourStep: normalizeStep(props.hourStep, 24),
    max: draft.value.date ? getTimeBoundary(draft.value.date, props.max, 'max') : undefined,
    min: draft.value.date ? getTimeBoundary(draft.value.date, props.min, 'min') : undefined,
    minuteStep: normalizeStep(props.minuteStep, 60),
    secondStep: normalizeStep(props.secondStep, 60),
  };
}

function adjustTime(segment: TimePickerSegment, direction: 1 | -1): void {
  if (blocked.value) return;
  let next: TimePickerParts | undefined;
  if (segment === 'period') {
    next = setTimeSegment(
      currentTimeParts.value,
      'period',
      currentTimeParts.value.hour >= 12 ? 'am' : 'pm',
    );
  } else {
    next = getAdjacentSegmentValue(
      segment,
      currentTimeParts.value,
      direction,
      getTimeValidationOptions(),
    );
  }
  if (next) updateTime(formatModelTime(next, props.showSeconds));
}

function handleTimeKeydown(event: KeyboardEvent, segment: TimePickerSegment, index: number): void {
  if (blocked.value) return;
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    adjustTime(segment, event.key === 'ArrowUp' ? 1 : -1);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const elements = Array.from(
      (event.currentTarget as HTMLElement)
        .closest('[role="group"]')
        ?.querySelectorAll<HTMLElement>('[role="spinbutton"]') ?? [],
    );
    elements[
      (index + (event.key === 'ArrowRight' ? 1 : -1) + elements.length) % elements.length
    ]?.focus();
  }
}

function getTimeSegmentLabel(segment: TimePickerSegment, lowercase = false): string {
  const label = {
    hour: 'Godzina',
    minute: 'Minuta',
    second: 'Sekunda',
    period: 'Okres dnia',
  }[segment];
  return lowercase ? label.toLocaleLowerCase(props.locale) : label;
}

function setActiveDayReference(element: unknown, date: string): void {
  if (date === activeDate.value && element instanceof HTMLElement) {
    activeDayReference.value = element;
  }
}

function applySelection(): void {
  touched.value = true;
  const reason = validateLocalDateTime(draft.value, validationOptions.value);
  if (!draft.value.date && !draft.value.time) {
    reportInvalid('empty', 'value', { ...draft.value });
    return;
  }
  if (reason || !draft.value.date || !draft.value.time) {
    reportInvalid(reason ?? 'partial', 'value', { ...draft.value });
    return;
  }
  const next = draft.value as LocalDateTimeValue;
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
  if (publicReason.value === 'empty') return 'Wybierz datę i czas.';
  if (publicReason.value === 'partial') return 'Uzupełnij zarówno datę, jak i czas.';
  if (publicReason.value === 'date') return 'Wpisz poprawną datę.';
  if (publicReason.value === 'time') return 'Wpisz poprawny czas zgodny z dozwolonym interwałem.';
  if (publicReason.value === 'range') return 'Wybrana data i czas są poza dozwolonym zakresem.';
  if (publicReason.value === 'disabled') return 'Ta data i godzina są niedostępne.';
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
  () => [props.locale, props.dateFormat, props.format, props.showSeconds],
  () => syncDraft(),
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
              :aria-controls="panelId"
              :aria-expanded="isOpen"
              aria-haspopup="dialog"
              autocomplete="off"
              :disabled="props.disabled || props.loading"
              :placeholder="resolvedPlaceholder"
              :readonly="props.readonly"
              :value="singleText"
              @blur="commitSingleInput"
              @change.stop="commitSingleInput"
              @click.stop="openPicker()"
              @input.stop="handleSingleInput"
              @keydown.down.prevent="openPicker(true)"
              @keydown.esc="closePicker(true)"
            />
            <div
              v-else
              :class="[fieldProps.class, `${classNameComponent}__split-fields`]"
              :style="fieldProps.style as StyleValue"
              :aria-busy="props.loading || undefined"
              :aria-describedby="getFieldDescription(fieldProps)"
              :aria-invalid="hasError || undefined"
              :aria-labelledby="props.label ? `label-${props.id}` : undefined"
              :aria-label="props.ariaLabel || (!props.label ? props.name : undefined)"
              role="group"
            >
              <input
                v-bind="getInputBindings(fieldProps, props.id, 'Data')"
                role="combobox"
                :aria-controls="panelId"
                :aria-expanded="isOpen"
                aria-haspopup="dialog"
                :class="`${classNameComponent}__split-input`"
                :data-testid="baseTestId ? `${baseTestId}-date-input` : undefined"
                type="text"
                :aria-label="props.label ? 'Data' : `${props.name}: data`"
                :disabled="props.disabled || props.loading"
                :placeholder="props.dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr'"
                :readonly="props.readonly"
                :value="dateText"
                @blur="commitDateInput"
                @click.stop="openPicker()"
                @input.stop="dateText = ($event.target as HTMLInputElement).value"
                @keydown.down.prevent="openPicker(true)"
              />
              <span aria-hidden="true" :class="`${classNameComponent}__split-divider`" />
              <input
                v-bind="getInputBindings(fieldProps, `${props.id}-time`, 'Czas')"
                role="combobox"
                :aria-controls="panelId"
                :aria-expanded="isOpen"
                aria-haspopup="dialog"
                :class="`${classNameComponent}__split-input`"
                :data-testid="baseTestId ? `${baseTestId}-time-input` : undefined"
                type="text"
                :aria-label="props.label ? 'Czas' : `${props.name}: czas`"
                :disabled="props.disabled || props.loading"
                :placeholder="props.showSeconds ? 'gg:mm:ss' : 'gg:mm'"
                :readonly="props.readonly"
                :value="timeText"
                @blur="commitTimeInput"
                @click.stop="openPicker()"
                @input.stop="timeText = ($event.target as HTMLInputElement).value"
                @keydown.down.prevent="openPicker(false)"
              />
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
    </div>

    <template #content>
      <section
        :id="panelId"
        :aria-label="props.panelAriaLabel"
        :aria-labelledby="props.panelAriaLabel ? undefined : panelHeadingId"
        :class="[`${classNameComponent}__panel`, `${classNameComponent}__panel--${props.layout}`]"
        :style="{ '--peaui-form-date-time-picker-available-height': `${availablePanelHeight}px` }"
        role="dialog"
        @keydown.esc.prevent="props.confirm ? cancelSelection() : closePicker(true)"
      >
        <h2 :id="panelHeadingId" :class="`${classNameComponent}__sr-only`">
          {{ props.panelAriaLabel }}
        </h2>
        <div :class="`${classNameComponent}__sections`">
          <section
            :class="`${classNameComponent}__date-section`"
            :aria-labelledby="`${props.id}-date-section-heading`"
          >
            <h3
              :id="`${props.id}-date-section-heading`"
              :class="`${classNameComponent}__section-heading`"
            >
              Data
            </h3>
            <slot name="date" :date="draft.date">
              <div :class="`${classNameComponent}__calendar-header`">
                <p aria-live="polite" :class="`${classNameComponent}__month-label`">
                  {{ calendarLabels.month }}
                </p>
                <PickerNavigation
                  :data-test-id="baseTestId ? `${baseTestId}-calendar-navigation` : undefined"
                  next-label="Następny miesiąc"
                  previous-label="Poprzedni miesiąc"
                  @on:next="navigateMonth(1)"
                  @on:previous="navigateMonth(-1)"
                />
              </div>
              <div
                :aria-label="calendarLabels.month"
                :class="`${classNameComponent}__calendar`"
                role="grid"
              >
                <div :class="`${classNameComponent}__calendar-row`" role="row">
                  <span
                    v-for="weekday in calendarLabels.weekdays"
                    :key="weekday.long"
                    :abbr="weekday.long"
                    :class="`${classNameComponent}__weekday`"
                    role="columnheader"
                    >{{ weekday.short }}</span
                  >
                </div>
                <div
                  v-for="(row, rowIndex) in calendarRows"
                  :key="rowIndex"
                  :class="`${classNameComponent}__calendar-row`"
                  role="row"
                >
                  <button
                    v-for="day in row"
                    :key="day.date"
                    :ref="(element) => setActiveDayReference(element, day.date)"
                    type="button"
                    :aria-current="day.today ? 'date' : undefined"
                    :aria-label="getDayAriaLabel(day.date)"
                    :aria-selected="day.selected"
                    :class="[
                      `${classNameComponent}__day`,
                      {
                        [`${classNameComponent}__day--outside`]: day.outsideMonth,
                        [`${classNameComponent}__day--selected`]: day.selected,
                        [`${classNameComponent}__day--today`]: day.today,
                      },
                    ]"
                    :data-date="day.date"
                    :disabled="day.disabled"
                    role="gridcell"
                    :tabindex="day.date === activeDate ? 0 : -1"
                    @click="selectDate(day.date)"
                    @keydown="handleDayKeydown($event, day.date)"
                  >
                    {{ day.day }}
                  </button>
                </div>
              </div>
            </slot>
          </section>

          <section
            :class="`${classNameComponent}__time-section`"
            :aria-labelledby="`${props.id}-time-section-heading`"
          >
            <h3
              :id="`${props.id}-time-section-heading`"
              :class="`${classNameComponent}__section-heading`"
            >
              Czas
            </h3>
            <slot name="time" :time="draft.time">
              <div
                :class="`${classNameComponent}__time-controls`"
                role="group"
                aria-label="Ustaw czas"
              >
                <div
                  v-for="(segment, index) in segments"
                  :key="segment"
                  :class="`${classNameComponent}__time-column`"
                >
                  <span :class="`${classNameComponent}__time-label`">
                    {{ getTimeSegmentLabel(segment) }}
                  </span>
                  <button
                    type="button"
                    :aria-label="`Zwiększ: ${getTimeSegmentLabel(segment, true)}`"
                    :class="`${classNameComponent}__time-action`"
                    :disabled="blocked"
                    @click="adjustTime(segment, 1)"
                  >
                    +
                  </button>
                  <div
                    :aria-label="getTimeSegmentLabel(segment)"
                    :aria-disabled="blocked ? 'true' : undefined"
                    :aria-valuemax="getSegmentRange(segment, props.format).max"
                    :aria-valuemin="getSegmentRange(segment, props.format).min"
                    :aria-valuenow="getSegmentValue(currentTimeParts, segment, props.format)"
                    :aria-valuetext="getSegmentText(currentTimeParts, segment, formatContext)"
                    :class="`${classNameComponent}__time-value`"
                    role="spinbutton"
                    :tabindex="blocked ? -1 : 0"
                    @click="
                      !blocked &&
                      !draft.time &&
                      updateTime(formatModelTime(currentTimeParts, props.showSeconds))
                    "
                    @keydown="handleTimeKeydown($event, segment, index)"
                  >
                    {{ getSegmentText(currentTimeParts, segment, formatContext) }}
                  </div>
                  <button
                    type="button"
                    :aria-label="`Zmniejsz: ${getTimeSegmentLabel(segment, true)}`"
                    :class="`${classNameComponent}__time-action`"
                    :disabled="blocked"
                    @click="adjustTime(segment, -1)"
                  >
                    −
                  </button>
                </div>
              </div>
            </slot>
            <p v-if="props.showTimeZone" :id="zoneId" :class="`${classNameComponent}__time-zone`">
              <SvgIcon name="clock" />
              <slot name="time-zone" :time-zone="resolvedTimeZone"
                >Strefa: {{ resolvedTimeZone }}</slot
              >
            </p>
          </section>
        </div>

        <footer v-if="props.confirm || hasSlot('footer')" :class="`${classNameComponent}__footer`">
          <slot
            name="footer"
            :apply="applySelection"
            :cancel="cancelSelection"
            :valid="!draftReason && Boolean(draft.date && draft.time)"
          >
            <button
              type="button"
              :class="`${classNameComponent}__button ${classNameComponent}__button--secondary`"
              @click="cancelSelection"
            >
              Anuluj
            </button>
            <button
              type="button"
              :class="`${classNameComponent}__button ${classNameComponent}__button--primary`"
              :disabled="Boolean(draftReason || !draft.date || !draft.time)"
              @click="applySelection"
            >
              Zastosuj
            </button>
          </slot>
        </footer>
      </section>
    </template>
  </PopoverOverlayer>
</template>
