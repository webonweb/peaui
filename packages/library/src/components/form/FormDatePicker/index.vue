<script lang="ts">
export type DatePickerRangeValue = [string, string];
export type DatePickerValue = string | DatePickerRangeValue | undefined;

export interface DatePickerOption {
  value: string;
  current: boolean;
  selected: boolean;
  disabled: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  outsideCurrentMonth: boolean;
}
</script>

<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { getRequiredValueAttributes, focusInvalidValue } from '@/helpers/form-validation.helper';
import { computed, nextTick, ref, useAttrs, useSlots, useTemplateRef, watch } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import FormField from '@/components/form/FormField/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import PickerButton from './PickerButton.vue';
import PickerNavigation from './PickerNavigation.vue';

const MONTH_LABELS = [
  'styczen',
  'luty',
  'marzec',
  'kwiecien',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpien',
  'wrzesien',
  'pazdziernik',
  'listopad',
  'grudzien',
] as const;

const MONTH_ARIA_LABELS = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'wrzesnia',
  'pazdziernika',
  'listopada',
  'grudnia',
] as const;

const WEEKDAY_LABELS = [
  { short: 'Pon', long: 'Poniedzialek' },
  { short: 'Wt', long: 'Wtorek' },
  { short: 'Sr', long: 'Sroda' },
  { short: 'Czw', long: 'Czwartek' },
  { short: 'Pt', long: 'Piatek' },
  { short: 'Sob', long: 'Sobota' },
  { short: 'Nd', long: 'Niedziela' },
] as const;

defineOptions({
  inheritAttrs: false,
});

type PopoverOverlayerReference = {
  hidePopover: () => void;
  showPopover: () => void;
  togglePopover: () => void;
};

type DatePickerPopoverPlacement = 'top' | 'bottom';
type CalendarView = 'day' | 'month' | 'year';
type DateParts = {
  year: number;
  month: number;
  day: number;
};

type DisabledOption = {
  disabled: boolean;
};

interface MonthOption {
  value: number;
  label: string;
  current: boolean;
  active: boolean;
  disabled: boolean;
}

interface YearOption {
  value: number;
  label: number;
  current: boolean;
  active: boolean;
  disabled: boolean;
}

interface DayOption extends DatePickerOption {
  date: DateParts;
  label: number;
}

interface DayGridOption {
  value: string;
  date: DateParts;
  label: number;
  outsideCurrentMonth: boolean;
}

type IndexedOption<T> = T & { index: number };

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  canErase = true,
  after,
  before,
  name,
  label,
  iconBefore,
  required,
  placeholder = 'wybierz date',
  range,
  minDate,
  maxDate,
  min,
  max,
  disabled,
  readonly,
  dataTestId,
} = defineProps<{
  id: string;
  canErase?: boolean;
  after?: string;
  before?: string;
  name: string;
  label?: string;
  iconBefore?: string;
  /** Empty selection blocks native form submission; readonly and disabled are exempt. */
  required?: boolean;
  placeholder?: string;
  range?: boolean;
  minDate?: string;
  maxDate?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
const inputReference = useTemplateRef<HTMLInputElement>('inputReference');
const popoverReference = useTemplateRef<PopoverOverlayerReference>('popoverReference');
const classNameComponent = `${UIKIT_NAME}-form-date-picker`;
const today = toDateParts(new Date());

const modelValue = defineModel<DatePickerValue>('value', {
  required: true,
});

const currentIndex = ref(-1);
const isOpen = ref(false);
const view = ref<CalendarView>('day');
const visibleYear = ref(today.year);
const visibleMonth = ref(today.month);
const popoverPlacement = ref<DatePickerPopoverPlacement>('bottom');
const pendingRangeStart = ref<DateParts | undefined>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const panelId = computed(() => `${id}-dialog`);
const panelLabelId = computed(() => `${id}-dialog-label`);
const gridId = computed(() => `${id}-grid`);
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);

const dateBounds = computed(() => {
  const normalizedMinDate = parseDateString(minDate ?? min);
  const normalizedMaxDate = parseDateString(maxDate ?? max);

  if (!normalizedMinDate && !normalizedMaxDate) {
    return {
      min: undefined,
      max: undefined,
    };
  }

  if (!normalizedMinDate) {
    return {
      min: undefined,
      max: normalizedMaxDate,
    };
  }

  if (!normalizedMaxDate) {
    return {
      min: normalizedMinDate,
      max: undefined,
    };
  }

  return compareDateParts(normalizedMinDate, normalizedMaxDate) <= 0
    ? { min: normalizedMinDate, max: normalizedMaxDate }
    : { min: normalizedMaxDate, max: normalizedMinDate };
});

const normalizedSingleValue = computed(() => {
  if (range) {
    return undefined;
  }

  const date = parseDateString(modelValue.value);

  return date ? clampDateToBounds(date) : undefined;
});

const normalizedRangeValue = computed(() => {
  if (!range) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  return getNormalizedRangeValue(modelValue.value);
});

const anchorDate = computed(() => {
  if (range) {
    return clampDateToBounds(
      pendingRangeStart.value ??
        normalizedRangeValue.value.start ??
        normalizedRangeValue.value.end ??
        today,
    );
  }

  return clampDateToBounds(normalizedSingleValue.value ?? today);
});

const visibleMonthLabel = computed(() => capitalize(MONTH_LABELS[visibleMonth.value - 1] ?? ''));
const visibleMonthAriaLabel = computed(() => MONTH_ARIA_LABELS[visibleMonth.value - 1] ?? '');

const yearRange = computed(() => {
  const start = Math.floor(visibleYear.value / 10) * 10;

  return {
    start,
    end: start + 9,
  };
});

const dayGridOptions = computed<DayGridOption[]>(() => {
  const monthStart = {
    year: visibleYear.value,
    month: visibleMonth.value,
    day: 1,
  };
  const startOffset = getWeekdayIndex(monthStart);
  const gridStart = addDays(monthStart, -startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      value: formatDateString(date),
      date,
      label: date.day,
      outsideCurrentMonth: date.month !== visibleMonth.value || date.year !== visibleYear.value,
    };
  });
});

const previewRange = computed<{
  start: DateParts | undefined;
  end: DateParts | undefined;
}>(() => {
  if (!range) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  if (!pendingRangeStart.value) {
    return normalizedRangeValue.value;
  }

  const focusedDate =
    view.value === 'day' && currentIndex.value >= 0
      ? dayGridOptions.value[currentIndex.value]?.date
      : undefined;

  return createOrderedRange(pendingRangeStart.value, focusedDate ?? pendingRangeStart.value);
});

const dayOptions = computed<DayOption[]>(() =>
  dayGridOptions.value.map((option) => ({
    ...option,
    current: isSameDateParts(option.date, today),
    selected: isDateSelected(option.date),
    disabled: isDateDisabled(option.date),
    rangeStart:
      isSameDateParts(previewRange.value.start, option.date) && !isDateDisabled(option.date),
    rangeEnd: isSameDateParts(previewRange.value.end, option.date) && !isDateDisabled(option.date),
    inRange: isDateInPreviewRange(option.date),
  })),
);

const dayRows = computed<IndexedOption<DayOption>[][]>(() => chunkOptions(dayOptions.value, 7));

const monthOptions = computed<MonthOption[]>(() =>
  MONTH_LABELS.map((monthLabel, index) => {
    const monthValue = index + 1;

    return {
      value: monthValue,
      label: capitalize(monthLabel),
      current: today.year === visibleYear.value && today.month === monthValue,
      active: visibleMonth.value === monthValue,
      disabled: !hasSelectableDateInMonth(visibleYear.value, monthValue),
    };
  }),
);

const monthRows = computed<IndexedOption<MonthOption>[][]>(() =>
  chunkOptions(monthOptions.value, 3),
);

const yearOptions = computed<YearOption[]>(() =>
  Array.from({ length: 10 }, (_, index) => {
    const yearValue = yearRange.value.start + index;

    return {
      value: yearValue,
      label: yearValue,
      current: today.year === yearValue,
      active: visibleYear.value === yearValue,
      disabled: !hasSelectableDateInYear(yearValue),
    };
  }),
);

const yearRows = computed<IndexedOption<YearOption>[][]>(() => chunkOptions(yearOptions.value, 3));

const displayValue = computed(() => {
  if (!range) {
    return normalizedSingleValue.value ? formatDateString(normalizedSingleValue.value) : '';
  }

  if (pendingRangeStart.value && isOpen.value) {
    return `${formatDateString(pendingRangeStart.value)} - `;
  }

  if (normalizedRangeValue.value.start && normalizedRangeValue.value.end) {
    return `${formatDateString(normalizedRangeValue.value.start)} - ${formatDateString(normalizedRangeValue.value.end)}`;
  }

  if (normalizedRangeValue.value.start) {
    return `${formatDateString(normalizedRangeValue.value.start)} - `;
  }

  return '';
});

const panelLabel = computed(() => {
  if (view.value === 'month') {
    return `Wybierz miesiac dla roku ${visibleYear.value}`;
  }

  if (view.value === 'year') {
    return `Wybierz rok z zakresu ${yearRange.value.start} - ${yearRange.value.end}`;
  }

  return `Wybierz date w miesiacu ${visibleMonthAriaLabel.value} ${visibleYear.value}`;
});

const monthTriggerAriaLabel = computed(() => `${visibleMonthLabel.value}. Wybierz miesiac`);
const yearTriggerAriaLabel = computed(() => `${visibleYear.value}. Wybierz rok`);

const headerLabel = computed(() => {
  if (view.value === 'month') {
    return `${visibleYear.value}`;
  }

  if (view.value === 'year') {
    return `${yearRange.value.start} - ${yearRange.value.end}`;
  }

  return `${visibleMonthLabel.value} ${visibleYear.value}`;
});

const previousNavigationLabel = computed(() => {
  if (view.value === 'month') {
    return 'Poprzedni rok';
  }

  if (view.value === 'year') {
    return 'Poprzednie 10 lat';
  }

  return 'Poprzedni miesiac';
});

const nextNavigationLabel = computed(() => {
  if (view.value === 'month') {
    return 'Nastepny rok';
  }

  if (view.value === 'year') {
    return 'Nastepne 10 lat';
  }

  return 'Nastepny miesiac';
});

const previousNavigationDisabled = computed(() => disabled || readonly || !canNavigate(-1));
const nextNavigationDisabled = computed(() => disabled || readonly || !canNavigate(1));

const rootClass = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--open`]: isOpen.value,
    [`${classNameComponent}--disabled`]: disabled,
    [`${classNameComponent}--readonly`]: readonly,
  },
]);

const inputClass = computed(() => [
  `${classNameComponent}__input`,
  {
    [`${classNameComponent}__input--interactive`]: !disabled && !readonly,
  },
]);

const activeDescendant = computed(() => {
  if (!isOpen.value || currentIndex.value < 0) {
    return undefined;
  }

  if (view.value === 'month') {
    const option = monthOptions.value[currentIndex.value];

    return option ? getMonthButtonId(option.value) : undefined;
  }

  if (view.value === 'year') {
    const option = yearOptions.value[currentIndex.value];

    return option ? getYearButtonId(option.value) : undefined;
  }

  const option = dayOptions.value[currentIndex.value];

  return option ? getDayButtonId(option.value) : undefined;
});

const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const panelTestId = computed(() => (dataTestId ? `${dataTestId}-panel` : undefined));
const gridTestId = computed(() => (dataTestId ? `${dataTestId}-grid` : undefined));
const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const monthTriggerTestId = computed(() => (dataTestId ? `${dataTestId}-month-trigger` : undefined));
const yearTriggerTestId = computed(() => (dataTestId ? `${dataTestId}-year-trigger` : undefined));
const popoverTestId = computed(() => (dataTestId ? `${dataTestId}-popover` : undefined));
const popoverContentClass = computed(() => `${classNameComponent}__popover-content`);
const navigationTestId = computed(() => (dataTestId ? `${dataTestId}-navigation` : undefined));

// WATCHERS
//-----------------------------------------------------------------------------------------------//
watch(
  [() => isOpen.value, () => view.value, dayOptions, monthOptions, yearOptions],
  async ([open]) => {
    if (!open) {
      return;
    }

    syncPopoverPlacement();
    syncCurrentIndex();
    await nextTick();
    focusActiveOptionButton();
  },
  { deep: true },
);

watch(
  [anchorDate, () => isOpen.value],
  ([nextAnchorDate, open]) => {
    if (open) {
      return;
    }

    syncVisibleDate(nextAnchorDate);
  },
  { deep: true, immediate: true },
);

watch(
  () => range,
  () => {
    pendingRangeStart.value = undefined;
  },
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function toDateParts(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function parseDateString(value: unknown): DateParts | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return undefined;
  }

  const nextDate = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  return isValidDate(nextDate) ? nextDate : undefined;
}

function isValidDate(date: DateParts): boolean {
  const normalizedDate = new Date(date.year, date.month - 1, date.day);

  return (
    normalizedDate.getFullYear() === date.year &&
    normalizedDate.getMonth() === date.month - 1 &&
    normalizedDate.getDate() === date.day
  );
}

function formatDateString(date: DateParts): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

function formatDateAriaLabel(date: DateParts): string {
  return `${date.day} ${MONTH_ARIA_LABELS[date.month - 1] ?? ''} ${date.year}`;
}

function compareDateParts(firstDate: DateParts, secondDate: DateParts): number {
  return (
    firstDate.year - secondDate.year ||
    firstDate.month - secondDate.month ||
    firstDate.day - secondDate.day
  );
}

function isSameDateParts(
  firstDate: DateParts | undefined,
  secondDate: DateParts | undefined,
): boolean {
  if (!firstDate || !secondDate) {
    return false;
  }

  return compareDateParts(firstDate, secondDate) === 0;
}

function addDays(date: DateParts, amount: number): DateParts {
  const normalizedDate = new Date(date.year, date.month - 1, date.day);

  normalizedDate.setDate(normalizedDate.getDate() + amount);

  return toDateParts(normalizedDate);
}

function getWeekdayIndex(date: DateParts): number {
  return (new Date(date.year, date.month - 1, date.day).getDay() + 6) % 7;
}

function capitalize(value: string): string {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function chunkOptions<T extends object>(
  options: T[],
  size: number,
): Array<Array<IndexedOption<T>>> {
  const rows: Array<Array<IndexedOption<T>>> = [];

  options.forEach((option, index) => {
    const rowIndex = Math.floor(index / size);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push({
      ...option,
      index,
    });
  });

  return rows;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getMonthBounds(
  year: number,
  month: number,
): {
  start: DateParts;
  end: DateParts;
} {
  return {
    start: {
      year,
      month,
      day: 1,
    },
    end: {
      year,
      month,
      day: getDaysInMonth(year, month),
    },
  };
}

function createOrderedRange(
  firstDate: DateParts | undefined,
  secondDate: DateParts | undefined,
): {
  start: DateParts | undefined;
  end: DateParts | undefined;
} {
  if (!firstDate || !secondDate) {
    return {
      start: firstDate,
      end: secondDate,
    };
  }

  return compareDateParts(firstDate, secondDate) <= 0
    ? { start: firstDate, end: secondDate }
    : { start: secondDate, end: firstDate };
}

function clampDateToBounds(date: DateParts): DateParts {
  let normalizedDate = date;

  if (dateBounds.value.min && compareDateParts(normalizedDate, dateBounds.value.min) < 0) {
    normalizedDate = dateBounds.value.min;
  }

  if (dateBounds.value.max && compareDateParts(normalizedDate, dateBounds.value.max) > 0) {
    normalizedDate = dateBounds.value.max;
  }

  return normalizedDate;
}

function getNormalizedRangeValue(value: DatePickerValue): {
  start: DateParts | undefined;
  end: DateParts | undefined;
} {
  if (!Array.isArray(value)) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  const firstDate = parseDateString(value[0]);
  const secondDate = parseDateString(value[1]);

  return createOrderedRange(
    firstDate ? clampDateToBounds(firstDate) : undefined,
    secondDate ? clampDateToBounds(secondDate) : undefined,
  );
}

function hasSelectableDateBetween(startDate: DateParts, endDate: DateParts): boolean {
  if (dateBounds.value.min && compareDateParts(endDate, dateBounds.value.min) < 0) {
    return false;
  }

  if (dateBounds.value.max && compareDateParts(startDate, dateBounds.value.max) > 0) {
    return false;
  }

  return true;
}

function hasSelectableDateInMonth(year: number, month: number): boolean {
  const monthBounds = getMonthBounds(year, month);

  return hasSelectableDateBetween(monthBounds.start, monthBounds.end);
}

function hasSelectableDateInYear(year: number): boolean {
  return hasSelectableDateBetween(
    {
      year,
      month: 1,
      day: 1,
    },
    {
      year,
      month: 12,
      day: 31,
    },
  );
}

function canNavigate(direction: -1 | 1): boolean {
  if (view.value === 'month') {
    return hasSelectableDateInYear(visibleYear.value + direction);
  }

  if (view.value === 'year') {
    const nextStart = yearRange.value.start + direction * 10;
    const nextEnd = yearRange.value.end + direction * 10;

    for (let year = nextStart; year <= nextEnd; year += 1) {
      if (hasSelectableDateInYear(year)) {
        return true;
      }
    }

    return false;
  }

  const nextDate = new Date(visibleYear.value, visibleMonth.value - 1 + direction, 1);

  return hasSelectableDateInMonth(nextDate.getFullYear(), nextDate.getMonth() + 1);
}

function shiftVisibleMonth(offset: number): void {
  const nextDate = new Date(visibleYear.value, visibleMonth.value - 1 + offset, 1);

  visibleYear.value = nextDate.getFullYear();
  visibleMonth.value = nextDate.getMonth() + 1;
}

function syncVisibleDate(date: DateParts): void {
  visibleYear.value = date.year;
  visibleMonth.value = date.month;
}

function getDayButtonId(value: string): string {
  return `${id}-day-${value}`;
}

function getMonthButtonId(value: number): string {
  return `${id}-month-${value}`;
}

function getYearButtonId(value: number): string {
  return `${id}-year-${value}`;
}

function getDayButtonTestId(value: string): string | undefined {
  return dataTestId ? `${dataTestId}-day-${value}` : undefined;
}

function getMonthButtonTestId(value: number): string | undefined {
  return dataTestId ? `${dataTestId}-month-${value}` : undefined;
}

function getYearButtonTestId(value: number): string | undefined {
  return dataTestId ? `${dataTestId}-year-${value}` : undefined;
}

function getDayButtonAriaLabel(date: DateParts): string {
  const dateLabel = formatDateAriaLabel(date);

  if (!range) {
    return `Wybierz date ${dateLabel}`;
  }

  if (pendingRangeStart.value) {
    return `Wybierz date koncowa ${dateLabel}`;
  }

  if (normalizedRangeValue.value.start && normalizedRangeValue.value.end) {
    return `Rozpocznij nowy zakres od daty ${dateLabel}`;
  }

  return `Wybierz date poczatkowa ${dateLabel}`;
}

function getMonthButtonAriaLabel(option: MonthOption): string {
  return `Wybierz miesiac ${option.label} ${visibleYear.value}`;
}

function getYearButtonAriaLabel(year: number): string {
  return `Wybierz rok ${year}`;
}

function getCurrentViewOptions(): DisabledOption[] {
  if (view.value === 'month') {
    return monthOptions.value;
  }

  if (view.value === 'year') {
    return yearOptions.value;
  }

  return dayOptions.value;
}

function getFirstEnabledIndex(options: DisabledOption[]): number {
  return options.findIndex((option) => !option.disabled);
}

function getLastEnabledIndex(options: DisabledOption[]): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getNextEnabledIndex(
  options: DisabledOption[],
  startIndex: number,
  direction: 1 | -1,
): number {
  for (let index = startIndex; index >= 0 && index < options.length; index += direction) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getPreferredIndex(): number {
  if (view.value === 'month') {
    const activeMonthIndex = monthOptions.value.findIndex(
      (option) => option.active && !option.disabled,
    );

    return activeMonthIndex >= 0
      ? activeMonthIndex
      : monthOptions.value.findIndex((option) => option.current && !option.disabled);
  }

  if (view.value === 'year') {
    const activeYearIndex = yearOptions.value.findIndex(
      (option) => option.active && !option.disabled,
    );

    return activeYearIndex >= 0
      ? activeYearIndex
      : yearOptions.value.findIndex((option) => option.current && !option.disabled);
  }

  const selectedDateIndex = dayOptions.value.findIndex(
    (option) => (option.rangeStart || option.selected) && !option.disabled,
  );

  if (selectedDateIndex >= 0) {
    return selectedDateIndex;
  }

  return dayOptions.value.findIndex((option) => option.current && !option.disabled);
}

function syncCurrentIndex(): void {
  const options = getCurrentViewOptions();
  const preferredIndex = getPreferredIndex();

  if (preferredIndex >= 0) {
    currentIndex.value = preferredIndex;
    return;
  }

  currentIndex.value = getFirstEnabledIndex(options);
}

function focusInput(): void {
  inputReference.value?.focus();
}

function focusButtonById(buttonId: string | undefined): void {
  if (!buttonId) {
    return;
  }

  document.getElementById(buttonId)?.focus();
}

function focusOptionButton(index: number): void {
  if (index < 0) {
    return;
  }

  if (view.value === 'month') {
    const option = monthOptions.value[index];

    focusButtonById(option ? getMonthButtonId(option.value) : undefined);
    return;
  }

  if (view.value === 'year') {
    const option = yearOptions.value[index];

    focusButtonById(option ? getYearButtonId(option.value) : undefined);
    return;
  }

  const option = dayOptions.value[index];

  focusButtonById(option ? getDayButtonId(option.value) : undefined);
}

function focusActiveOptionButton(): void {
  if (currentIndex.value < 0) {
    return;
  }

  focusOptionButton(currentIndex.value);
}

function setCurrentIndex(index: number): void {
  const options = getCurrentViewOptions();

  if (index < 0) {
    currentIndex.value = -1;
    return;
  }

  const clampedIndex = Math.min(Math.max(index, 0), options.length - 1);

  if (options[clampedIndex]?.disabled) {
    return;
  }

  currentIndex.value = clampedIndex;

  void nextTick(() => {
    focusOptionButton(clampedIndex);
  });
}

function moveCurrentIndex(offset: number): void {
  const options = getCurrentViewOptions();
  const direction = offset >= 0 ? 1 : -1;
  const fallbackIndex =
    direction === 1 ? getFirstEnabledIndex(options) : getLastEnabledIndex(options);
  const targetIndex =
    currentIndex.value === -1
      ? fallbackIndex
      : Math.min(Math.max(currentIndex.value + offset, 0), options.length - 1);
  const nextEnabledIndex = getNextEnabledIndex(options, targetIndex, direction);

  if (nextEnabledIndex === -1) {
    return;
  }

  setCurrentIndex(nextEnabledIndex);
}

function getEstimatedPopoverHeight(): number {
  return 420;
}

function syncPopoverPlacement(): void {
  if (!inputReference.value) {
    return;
  }

  const rect = inputReference.value.getBoundingClientRect();
  const estimatedPopoverHeight = getEstimatedPopoverHeight() + 5;
  const availableAbove = rect.top;
  const availableBelow = window.innerHeight - rect.bottom;

  popoverPlacement.value =
    availableBelow >= estimatedPopoverHeight || availableBelow >= availableAbove ? 'bottom' : 'top';
}

function openPicker(): void {
  if (disabled || readonly) {
    return;
  }

  view.value = 'day';
  syncVisibleDate(anchorDate.value);
  syncPopoverPlacement();
  popoverReference.value?.showPopover();
}

function closePicker(): void {
  popoverReference.value?.hidePopover();
}

async function handlePopoverState(open: boolean): Promise<void> {
  if (open) {
    isOpen.value = true;
    view.value = 'day';
    syncVisibleDate(anchorDate.value);
    syncCurrentIndex();
    await nextTick();
    focusActiveOptionButton();
    return;
  }

  isOpen.value = false;
  currentIndex.value = -1;
  view.value = 'day';
  pendingRangeStart.value = undefined;
  syncVisibleDate(anchorDate.value);
}

function showMonthView(): void {
  if (disabled || readonly) {
    return;
  }

  view.value = 'month';
}

function showYearView(): void {
  if (disabled || readonly) {
    return;
  }

  view.value = 'year';
}

function navigatePrevious(): void {
  if (disabled || readonly || previousNavigationDisabled.value) {
    return;
  }

  if (view.value === 'month') {
    visibleYear.value -= 1;
    return;
  }

  if (view.value === 'year') {
    visibleYear.value -= 10;
    return;
  }

  shiftVisibleMonth(-1);
}

function navigateNext(): void {
  if (disabled || readonly || nextNavigationDisabled.value) {
    return;
  }

  if (view.value === 'month') {
    visibleYear.value += 1;
    return;
  }

  if (view.value === 'year') {
    visibleYear.value += 10;
    return;
  }

  shiftVisibleMonth(1);
}

function handleRangeSelection(date: DateParts): void {
  if (!pendingRangeStart.value) {
    pendingRangeStart.value = date;
    syncVisibleDate(date);
    return;
  }

  const nextRange = createOrderedRange(pendingRangeStart.value, date);

  if (nextRange.start && nextRange.end) {
    modelValue.value = [formatDateString(nextRange.start), formatDateString(nextRange.end)];
  }

  pendingRangeStart.value = undefined;
  syncVisibleDate(date);
  closePicker();

  void nextTick(() => {
    focusInput();
  });
}

function selectDay(index: number): void {
  const option = dayOptions.value[index];

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  syncVisibleDate(option.date);

  if (range) {
    handleRangeSelection(option.date);
    return;
  }

  modelValue.value = option.value;
  closePicker();

  void nextTick(() => {
    focusInput();
  });
}

function selectMonth(month: number): void {
  const option = monthOptions.value.find((currentOption) => currentOption.value === month);

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  visibleMonth.value = month;
  view.value = 'day';
}

function selectYear(year: number): void {
  const option = yearOptions.value.find((currentOption) => currentOption.value === year);

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  visibleYear.value = year;
  view.value = 'day';
}

function handleEraseValue(): void {
  modelValue.value = undefined;
  pendingRangeStart.value = undefined;
  syncVisibleDate(today);
  closePicker();

  emit('on:remove');

  void nextTick(() => {
    focusInput();
  });
}

function handleInputKeydown(event: KeyboardEvent): void {
  if (disabled || readonly) {
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      openPicker();
      return;
    case 'PageUp':
      event.preventDefault();
      openPicker();
      navigatePrevious();
      return;
    case 'PageDown':
      event.preventDefault();
      openPicker();
      navigateNext();
      return;
    case 'Escape':
      event.preventDefault();
      closePicker();
      return;
    default:
      return;
  }
}

function handleOptionKeydown(event: KeyboardEvent, index: number): void {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      moveCurrentIndex(-1);
      return;
    case 'ArrowRight':
      event.preventDefault();
      moveCurrentIndex(1);
      return;
    case 'ArrowUp':
      event.preventDefault();
      moveCurrentIndex(view.value === 'day' ? -7 : -3);
      return;
    case 'ArrowDown':
      event.preventDefault();
      moveCurrentIndex(view.value === 'day' ? 7 : 3);
      return;
    case 'Home':
      event.preventDefault();
      setCurrentIndex(getFirstEnabledIndex(getCurrentViewOptions()));
      return;
    case 'End':
      event.preventDefault();
      setCurrentIndex(getLastEnabledIndex(getCurrentViewOptions()));
      return;
    case 'PageUp':
      event.preventDefault();
      navigatePrevious();
      return;
    case 'PageDown':
      event.preventDefault();
      navigateNext();
      return;
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();

      if (view.value === 'month') {
        const monthOption = monthOptions.value[index];

        if (monthOption) {
          selectMonth(monthOption.value);
        }

        return;
      }

      if (view.value === 'year') {
        const yearOption = yearOptions.value[index];

        if (yearOption) {
          selectYear(yearOption.value);
        }

        return;
      }

      selectDay(index);
      return;
    case 'Escape':
      event.preventDefault();
      closePicker();
      void nextTick(() => {
        focusInput();
      });
      return;
    default:
      return;
  }
}

function handleOptionFocus(index: number): void {
  if (getCurrentViewOptions()[index]?.disabled) {
    return;
  }

  currentIndex.value = index;
}

function isDateDisabled(date: DateParts): boolean {
  if (dateBounds.value.min && compareDateParts(date, dateBounds.value.min) < 0) {
    return true;
  }

  if (dateBounds.value.max && compareDateParts(date, dateBounds.value.max) > 0) {
    return true;
  }

  return false;
}

function isDateSelected(date: DateParts): boolean {
  if (range) {
    if (normalizedRangeValue.value.start && normalizedRangeValue.value.end) {
      return (
        compareDateParts(date, normalizedRangeValue.value.start) >= 0 &&
        compareDateParts(date, normalizedRangeValue.value.end) <= 0 &&
        !isDateDisabled(date)
      );
    }

    return false;
  }

  return isSameDateParts(date, normalizedSingleValue.value) && !isDateDisabled(date);
}

function isDateInPreviewRange(date: DateParts): boolean {
  if (!range || !previewRange.value.start || !previewRange.value.end) {
    return false;
  }

  return (
    compareDateParts(date, previewRange.value.start) >= 0 &&
    compareDateParts(date, previewRange.value.end) <= 0 &&
    !isDateDisabled(date)
  );
}

function getDayButtonVariant(option: DatePickerOption): 'primary' | 'ghost' | 'outline' {
  if (range) {
    if (option.rangeStart || option.rangeEnd) {
      return 'primary';
    }

    if (option.inRange || option.current) {
      return 'outline';
    }

    return 'ghost';
  }

  if (option.selected) {
    return 'primary';
  }

  if (option.current) {
    return 'outline';
  }

  return 'ghost';
}

function getPeriodButtonVariant(
  option: Pick<MonthOption, 'active' | 'current'>,
): 'primary' | 'ghost' | 'outline' {
  if (option.active) {
    return 'primary';
  }

  if (option.current) {
    return 'outline';
  }

  return 'ghost';
}

function getInputBindings(fieldProps: Record<string, unknown>): Record<string, unknown> {
  return {
    ...attrs,
    ...fieldProps,
    'aria-label':
      explicitAriaLabel.value ??
      (!explicitAriaLabelledBy.value ? fieldProps['aria-label'] : undefined),
    'aria-labelledby': explicitAriaLabelledBy.value ?? fieldProps['aria-labelledby'],
  };
}

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}
</script>

<template>
  <PopoverOverlayer
    ref="popoverReference"
    :class="[rootClass, `${classNameComponent}__overlayer`]"
    :content-class="popoverContentClass"
    :data-test-id="popoverTestId"
    :disabled="disabled || readonly"
    match-trigger-width
    :placement="popoverPlacement"
    @update:open="handlePopoverState"
  >
    <FormField
      :after
      :before
      :can-erase="canErase"
      :disabled
      iconAfter="calendar"
      :iconBefore
      :id
      :label
      :name
      :placeholder
      :readonly
      :required
      :value="displayValue"
      :data-test-id="dataTestId"
      @on:remove="handleEraseValue"
    >
      <template v-if="slots.hint" #hint>
        <slot name="hint" />
      </template>

      <template #default="{ props: fieldProps }">
        <input
          ref="inputReference"
          v-bind="getInputBindings(fieldProps)"
          type="text"
          role="combobox"
          readonly
          autocomplete="off"
          autocapitalize="none"
          :spellcheck="false"
          inputmode="none"
          :aria-activedescendant="activeDescendant"
          :aria-controls="panelId"
          :aria-expanded="isOpen"
          aria-autocomplete="none"
          aria-haspopup="dialog"
          aria-readonly="true"
          :class="inputClass"
          :value="displayValue"
          data-type="date-picker"
          :data-testid="elementTestId"
          @keydown="handleInputKeydown"
        />
        <input
          v-bind="
            getRequiredValueAttributes(
              Boolean(displayValue),
              required,
              disabled,
              readonly,
              typeof attrs.form === 'string' ? attrs.form : undefined,
            )
          "
          @invalid="focusInvalidValue($event, inputReference)"
        />
      </template>

      <template v-if="slots.description" #description>
        <slot name="description" />
      </template>

      <template v-if="slots.error" #error>
        <slot name="error" />
      </template>

      <template v-if="slots.success" #success>
        <slot name="success" />
      </template>
    </FormField>

    <template #content>
      <div
        :id="panelId"
        :class="`${classNameComponent}__panel`"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="panelLabelId"
        :data-testid="panelTestId"
      >
        <p :id="panelLabelId" :class="`${classNameComponent}__sr-only`" aria-live="polite">
          {{ panelLabel }}
        </p>

        <div :class="`${classNameComponent}__header`">
          <div :class="`${classNameComponent}__heading`" :data-testid="labelTestId">
            <template v-if="view === 'day'">
              <button
                :class="`${classNameComponent}__heading-trigger`"
                type="button"
                :aria-label="monthTriggerAriaLabel"
                :data-testid="monthTriggerTestId"
                @click.prevent="showMonthView"
              >
                {{ visibleMonthLabel }}
              </button>

              <button
                :class="`${classNameComponent}__heading-trigger`"
                type="button"
                :aria-label="yearTriggerAriaLabel"
                :data-testid="yearTriggerTestId"
                @click.prevent="showYearView"
              >
                {{ visibleYear }}
              </button>
            </template>

            <template v-else-if="view === 'month'">
              <button
                :class="`${classNameComponent}__heading-trigger`"
                type="button"
                :aria-label="yearTriggerAriaLabel"
                :data-testid="yearTriggerTestId"
                @click.prevent="showYearView"
              >
                {{ visibleYear }}
              </button>
            </template>

            <p v-else :class="`${classNameComponent}__heading-label`">
              {{ headerLabel }}
            </p>
          </div>

          <PickerNavigation
            :data-test-id="navigationTestId"
            :next-label="nextNavigationLabel"
            :next-disabled="nextNavigationDisabled"
            :previous-label="previousNavigationLabel"
            :previous-disabled="previousNavigationDisabled"
            @on:next="navigateNext"
            @on:previous="navigatePrevious"
          />
        </div>

        <div
          v-if="view === 'day'"
          :id="gridId"
          :class="[`${classNameComponent}__grid`, `${classNameComponent}__grid--day`]"
          role="grid"
          :aria-labelledby="panelLabelId"
          :data-testid="gridTestId"
        >
          <div :class="`${classNameComponent}__weekday-row`" role="row">
            <div
              v-for="weekday in WEEKDAY_LABELS"
              :key="weekday.long"
              :class="`${classNameComponent}__weekday`"
              role="columnheader"
              :aria-label="weekday.long"
            >
              {{ weekday.short }}
            </div>
          </div>

          <div
            v-for="(row, rowIndex) in dayRows"
            :key="`day-row-${rowIndex}`"
            :class="[`${classNameComponent}__row`, `${classNameComponent}__row--day`]"
            role="row"
          >
            <div
              v-for="option in row"
              :key="option.value"
              :class="`${classNameComponent}__cell`"
              role="gridcell"
              :aria-disabled="option.disabled || undefined"
              :aria-selected="option.selected || option.inRange"
            >
              <PickerButton
                :id="getDayButtonId(option.value)"
                :aria-current="option.current ? 'date' : undefined"
                :aria-label="getDayButtonAriaLabel(option.date)"
                :class="{
                  [`${classNameComponent}__picker-button--outside-month`]:
                    option.outsideCurrentMonth,
                }"
                :data-test-id="getDayButtonTestId(option.value)"
                :disabled="option.disabled"
                :tabindex="currentIndex === option.index ? 0 : -1"
                :variant="getDayButtonVariant(option)"
                @click.prevent.stop="selectDay(option.index)"
                @focus="handleOptionFocus(option.index)"
                @keydown="handleOptionKeydown($event, option.index)"
              >
                {{ option.label }}
              </PickerButton>
            </div>
          </div>
        </div>

        <div
          v-else-if="view === 'month'"
          :id="gridId"
          :class="[`${classNameComponent}__grid`, `${classNameComponent}__grid--period`]"
          role="grid"
          :aria-labelledby="panelLabelId"
          :data-testid="gridTestId"
        >
          <div
            v-for="(row, rowIndex) in monthRows"
            :key="`month-row-${rowIndex}`"
            :class="[`${classNameComponent}__row`, `${classNameComponent}__row--period`]"
            role="row"
          >
            <div
              v-for="option in row"
              :key="option.value"
              :class="`${classNameComponent}__cell`"
              role="gridcell"
              :aria-disabled="option.disabled || undefined"
              :aria-selected="option.active"
            >
              <PickerButton
                :id="getMonthButtonId(option.value)"
                :aria-label="getMonthButtonAriaLabel(option)"
                :data-test-id="getMonthButtonTestId(option.value)"
                :disabled="option.disabled"
                :tabindex="currentIndex === option.index ? 0 : -1"
                :variant="getPeriodButtonVariant(option)"
                @click.prevent.stop="selectMonth(option.value)"
                @focus="handleOptionFocus(option.index)"
                @keydown="handleOptionKeydown($event, option.index)"
              >
                {{ option.label }}
              </PickerButton>
            </div>
          </div>
        </div>

        <div
          v-else
          :id="gridId"
          :class="[`${classNameComponent}__grid`, `${classNameComponent}__grid--period`]"
          role="grid"
          :aria-labelledby="panelLabelId"
          :data-testid="gridTestId"
        >
          <div
            v-for="(row, rowIndex) in yearRows"
            :key="`year-row-${rowIndex}`"
            :class="[`${classNameComponent}__row`, `${classNameComponent}__row--period`]"
            role="row"
          >
            <div
              v-for="option in row"
              :key="option.value"
              :class="`${classNameComponent}__cell`"
              role="gridcell"
              :aria-disabled="option.disabled || undefined"
              :aria-selected="option.active"
            >
              <PickerButton
                :id="getYearButtonId(option.value)"
                :aria-label="getYearButtonAriaLabel(option.value)"
                :data-test-id="getYearButtonTestId(option.value)"
                :disabled="option.disabled"
                :tabindex="currentIndex === option.index ? 0 : -1"
                :variant="getPeriodButtonVariant(option)"
                @click.prevent.stop="selectYear(option.value)"
                @focus="handleOptionFocus(option.index)"
                @keydown="handleOptionKeydown($event, option.index)"
              >
                {{ option.label }}
              </PickerButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PopoverOverlayer>
</template>
