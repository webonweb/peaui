<script lang="ts">
export type YearPickerRangeValue = [number, number];
export type YearPickerValue = number | YearPickerRangeValue | undefined;

export interface YearPickerOption {
  value: number;
  current: boolean;
  selected: boolean;
  disabled: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
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

defineOptions({
  inheritAttrs: false,
});

type PopoverOverlayerReference = {
  hidePopover: () => void;
  showPopover: () => void;
  togglePopover: () => void;
};

type YearPickerPopoverPlacement = 'top' | 'bottom';

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
  placeholder = 'wybierz rok',
  range,
  minYear,
  maxYear,
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
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
const inputReference = useTemplateRef('inputReference');
const popoverReference = useTemplateRef<PopoverOverlayerReference>('popoverReference');
const classNameComponent = `${UIKIT_NAME}-form-year-picker`;
const currentCalendarYear = new Date().getFullYear();

const modelValue = defineModel<YearPickerValue>('value', {
  required: true,
});

const currentIndex = ref(-1);
const isOpen = ref(false);
const rangeOffset = ref(0);
const popoverPlacement = ref<YearPickerPopoverPlacement>('bottom');
const pendingRangeStart = ref<number | undefined>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const panelId = computed(() => `${id}-dialog`);
const rangeLabelId = computed(() => `${id}-range-label`);
const gridId = computed(() => `${id}-grid`);
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);

const yearBounds = computed(() => {
  const normalizedMinYear = toYear(minYear);
  const normalizedMaxYear = toYear(maxYear);

  if (normalizedMinYear === undefined && normalizedMaxYear === undefined) {
    return {
      min: undefined,
      max: undefined,
    };
  }

  if (normalizedMinYear === undefined) {
    return {
      min: undefined,
      max: normalizedMaxYear,
    };
  }

  if (normalizedMaxYear === undefined) {
    return {
      min: normalizedMinYear,
      max: undefined,
    };
  }

  return {
    min: Math.min(normalizedMinYear, normalizedMaxYear),
    max: Math.max(normalizedMinYear, normalizedMaxYear),
  };
});

const normalizedSingleValue = computed(() => {
  if (range) {
    return undefined;
  }

  const year = toYear(modelValue.value);

  return year === undefined ? undefined : clampYearToBounds(year);
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

const baseYear = computed(() => {
  if (range) {
    return clampYearToBounds(
      pendingRangeStart.value ??
        normalizedRangeValue.value.start ??
        normalizedRangeValue.value.end ??
        currentCalendarYear,
    );
  }

  return clampYearToBounds(normalizedSingleValue.value ?? currentCalendarYear);
});

const yearRange = computed(() => {
  const start = Math.floor(baseYear.value / 10) * 10 + rangeOffset.value;

  return {
    start,
    end: start + 9,
  };
});

const previewRange = computed(() => {
  if (!range) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  if (pendingRangeStart.value === undefined) {
    return normalizedRangeValue.value;
  }

  const focusedYear =
    currentIndex.value >= 0 ? yearRange.value.start + currentIndex.value : pendingRangeStart.value;

  return createOrderedRange(pendingRangeStart.value, focusedYear);
});

const yearsInRange = computed<YearPickerOption[]>(() =>
  Array.from({ length: 10 }, (_, index) => {
    const value = yearRange.value.start + index;

    return {
      value,
      current: value === currentCalendarYear,
      selected: isYearSelected(value),
      disabled: isYearDisabled(value),
      rangeStart: previewRange.value.start === value && !isYearDisabled(value),
      rangeEnd: previewRange.value.end === value && !isYearDisabled(value),
      inRange: isYearInPreviewRange(value),
    };
  }),
);

const yearRows = computed(() => {
  const rows: Array<Array<YearPickerOption & { index: number }>> = [];

  yearsInRange.value.forEach((year, index) => {
    const rowIndex = Math.floor(index / 3);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push({
      ...year,
      index,
    });
  });

  return rows;
});

const displayValue = computed(() => {
  if (!range) {
    return normalizedSingleValue.value === undefined ? '' : `${normalizedSingleValue.value}`;
  }

  if (pendingRangeStart.value !== undefined && isOpen.value) {
    return `${pendingRangeStart.value} - `;
  }

  if (
    normalizedRangeValue.value.start !== undefined &&
    normalizedRangeValue.value.end !== undefined
  ) {
    return `${normalizedRangeValue.value.start} - ${normalizedRangeValue.value.end}`;
  }

  if (normalizedRangeValue.value.start !== undefined) {
    return `${normalizedRangeValue.value.start} - `;
  }

  return '';
});

const rangeLabel = computed(() => `${yearRange.value.start} - ${yearRange.value.end}`);
const previousNavigationDisabled = computed(() => disabled || readonly || !canShiftRange(-10));
const nextNavigationDisabled = computed(() => disabled || readonly || !canShiftRange(10));

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

const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const panelTestId = computed(() => (dataTestId ? `${dataTestId}-panel` : undefined));
const gridTestId = computed(() => (dataTestId ? `${dataTestId}-grid` : undefined));
const rangeTestId = computed(() => (dataTestId ? `${dataTestId}-range` : undefined));
const popoverTestId = computed(() => (dataTestId ? `${dataTestId}-popover` : undefined));
const popoverContentClass = computed(() => `${classNameComponent}__popover-content`);
const navigationTestId = computed(() => (dataTestId ? `${dataTestId}-navigation` : undefined));

// WATCHERS
//-----------------------------------------------------------------------------------------------//
watch(
  [yearsInRange, () => isOpen.value],
  async () => {
    if (!isOpen.value) {
      return;
    }

    syncPopoverPlacement();
    syncCurrentIndex();
    await nextTick();
    focusActiveYearButton();
  },
  { deep: true },
);

watch(
  () => range,
  () => {
    pendingRangeStart.value = undefined;
  },
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function toYear(value: unknown): number | undefined {
  const normalizedValue = Number(value);

  return Number.isInteger(normalizedValue) ? normalizedValue : undefined;
}

function clampYearToBounds(year: number): number {
  let normalizedYear = year;

  if (yearBounds.value.min !== undefined && normalizedYear < yearBounds.value.min) {
    normalizedYear = yearBounds.value.min;
  }

  if (yearBounds.value.max !== undefined && normalizedYear > yearBounds.value.max) {
    normalizedYear = yearBounds.value.max;
  }

  return normalizedYear;
}

function createOrderedRange(
  firstYear: number | undefined,
  secondYear: number | undefined,
): {
  start: number | undefined;
  end: number | undefined;
} {
  if (firstYear === undefined || secondYear === undefined) {
    return {
      start: firstYear,
      end: secondYear,
    };
  }

  return firstYear <= secondYear
    ? { start: firstYear, end: secondYear }
    : { start: secondYear, end: firstYear };
}

function getNormalizedRangeValue(value: YearPickerValue): {
  start: number | undefined;
  end: number | undefined;
} {
  if (!Array.isArray(value)) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  const firstYear = toYear(value[0]);
  const secondYear = toYear(value[1]);

  const normalizedFirstYear = firstYear === undefined ? undefined : clampYearToBounds(firstYear);
  const normalizedSecondYear = secondYear === undefined ? undefined : clampYearToBounds(secondYear);

  return createOrderedRange(normalizedFirstYear, normalizedSecondYear);
}

function getYearButtonId(year: number): string {
  return `${id}-year-${year}`;
}

function getYearButtonTestId(year: number): string | undefined {
  return dataTestId ? `${dataTestId}-year-${year}` : undefined;
}

function getYearButtonAriaLabel(year: number): string {
  if (!range) {
    return `Wybierz rok ${year}`;
  }

  if (pendingRangeStart.value !== undefined) {
    return `Wybierz rok koncowy ${year}`;
  }

  if (
    normalizedRangeValue.value.start !== undefined &&
    normalizedRangeValue.value.end !== undefined
  ) {
    return `Rozpocznij nowy zakres od roku ${year}`;
  }

  return `Wybierz rok poczatkowy ${year}`;
}

function getSelectedIndex(): number {
  return yearsInRange.value.findIndex((year) => year.rangeStart || year.selected);
}

function getCurrentYearIndex(): number {
  return yearsInRange.value.findIndex((year) => year.current && !year.disabled);
}

function getFirstEnabledIndex(): number {
  return yearsInRange.value.findIndex((year) => !year.disabled);
}

function getLastEnabledIndex(): number {
  for (let index = yearsInRange.value.length - 1; index >= 0; index -= 1) {
    if (!yearsInRange.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getNextEnabledIndex(startIndex: number, direction: 1 | -1): number {
  for (
    let index = startIndex;
    index >= 0 && index < yearsInRange.value.length;
    index += direction
  ) {
    if (!yearsInRange.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function syncCurrentIndex(): void {
  const selectedIndex = getSelectedIndex();

  if (selectedIndex >= 0) {
    currentIndex.value = selectedIndex;
    return;
  }

  const currentYearIndex = getCurrentYearIndex();

  if (currentYearIndex >= 0) {
    currentIndex.value = currentYearIndex;
    return;
  }

  currentIndex.value = getFirstEnabledIndex();
}

function focusInput(): void {
  inputReference.value?.focus();
}

function focusYearButton(index: number): void {
  const option = yearsInRange.value[index];

  if (!option || option.disabled) {
    return;
  }

  document.getElementById(getYearButtonId(option.value))?.focus();
}

function focusActiveYearButton(): void {
  if (currentIndex.value === -1) {
    return;
  }

  focusYearButton(currentIndex.value);
}

function setCurrentIndex(index: number): void {
  if (index < 0) {
    currentIndex.value = -1;
    return;
  }

  const clampedIndex = Math.min(Math.max(index, 0), yearsInRange.value.length - 1);

  if (yearsInRange.value[clampedIndex]?.disabled) {
    return;
  }

  currentIndex.value = clampedIndex;

  void nextTick(() => {
    focusYearButton(clampedIndex);
  });
}

function getEstimatedPopoverHeight(): number {
  return 320;
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

  syncPopoverPlacement();
  popoverReference.value?.showPopover();
}

function closePicker(): void {
  popoverReference.value?.hidePopover();
}

async function handlePopoverState(open: boolean): Promise<void> {
  if (open) {
    isOpen.value = true;
    syncCurrentIndex();
    await nextTick();
    focusActiveYearButton();
    return;
  }

  isOpen.value = false;
  currentIndex.value = -1;
  rangeOffset.value = 0;
  pendingRangeStart.value = undefined;
}

function hasEnabledYearInRange(start: number, end: number): boolean {
  const minimumAllowedYear = yearBounds.value.min ?? Number.NEGATIVE_INFINITY;
  const maximumAllowedYear = yearBounds.value.max ?? Number.POSITIVE_INFINITY;

  return !(end < minimumAllowedYear || start > maximumAllowedYear);
}

function canShiftRange(step: number): boolean {
  const nextStart = yearRange.value.start + step;
  const nextEnd = yearRange.value.end + step;

  return hasEnabledYearInRange(nextStart, nextEnd);
}

function shiftRange(step: number): void {
  if (disabled || readonly || !canShiftRange(step)) {
    return;
  }

  rangeOffset.value += step;
}

function handleRangeSelection(year: number): void {
  if (pendingRangeStart.value === undefined) {
    pendingRangeStart.value = year;
    return;
  }

  const nextRange = createOrderedRange(pendingRangeStart.value, year);

  if (nextRange.start !== undefined && nextRange.end !== undefined) {
    modelValue.value = [nextRange.start, nextRange.end];
  }

  pendingRangeStart.value = undefined;
  rangeOffset.value = 0;
  closePicker();

  void nextTick(() => {
    focusInput();
  });
}

function selectYear(index: number): void {
  const option = yearsInRange.value[index];

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  if (range) {
    handleRangeSelection(option.value);
    return;
  }

  modelValue.value = option.value;
  rangeOffset.value = 0;
  closePicker();

  void nextTick(() => {
    focusInput();
  });
}

function moveCurrentIndex(offset: number): void {
  const direction = offset >= 0 ? 1 : -1;
  const fallbackIndex = direction === 1 ? getFirstEnabledIndex() : getLastEnabledIndex();
  const targetIndex =
    currentIndex.value === -1
      ? fallbackIndex
      : Math.min(Math.max(currentIndex.value + offset, 0), yearsInRange.value.length - 1);
  const nextEnabledIndex = getNextEnabledIndex(targetIndex, direction);

  if (nextEnabledIndex === -1) {
    return;
  }

  setCurrentIndex(nextEnabledIndex);
}

function handleRangeNavigation(step: number): void {
  shiftRange(step);
}

function handleEraseValue(): void {
  modelValue.value = undefined;
  rangeOffset.value = 0;
  pendingRangeStart.value = undefined;
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
      shiftRange(-10);
      return;
    case 'PageDown':
      event.preventDefault();
      openPicker();
      shiftRange(10);
      return;
    case 'Escape':
      event.preventDefault();
      closePicker();
      return;
    default:
      return;
  }
}

function handleYearButtonKeydown(event: KeyboardEvent, index: number): void {
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
      moveCurrentIndex(-3);
      return;
    case 'ArrowDown':
      event.preventDefault();
      moveCurrentIndex(3);
      return;
    case 'Home':
      event.preventDefault();
      setCurrentIndex(getFirstEnabledIndex());
      return;
    case 'End':
      event.preventDefault();
      setCurrentIndex(getLastEnabledIndex());
      return;
    case 'PageUp':
      event.preventDefault();
      handleRangeNavigation(-10);
      return;
    case 'PageDown':
      event.preventDefault();
      handleRangeNavigation(10);
      return;
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      selectYear(index);
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

function handleYearButtonFocus(index: number): void {
  if (yearsInRange.value[index]?.disabled) {
    return;
  }

  currentIndex.value = index;
}

function isYearDisabled(year: number): boolean {
  if (yearBounds.value.min !== undefined && year < yearBounds.value.min) {
    return true;
  }

  if (yearBounds.value.max !== undefined && year > yearBounds.value.max) {
    return true;
  }

  return false;
}

function isYearSelected(year: number): boolean {
  if (range) {
    if (
      normalizedRangeValue.value.start !== undefined &&
      normalizedRangeValue.value.end !== undefined
    ) {
      return (
        year >= normalizedRangeValue.value.start &&
        year <= normalizedRangeValue.value.end &&
        !isYearDisabled(year)
      );
    }

    return false;
  }

  return year === normalizedSingleValue.value && !isYearDisabled(year);
}

function isYearInPreviewRange(year: number): boolean {
  if (!range) {
    return false;
  }

  if (previewRange.value.start === undefined || previewRange.value.end === undefined) {
    return false;
  }

  return (
    year >= previewRange.value.start && year <= previewRange.value.end && !isYearDisabled(year)
  );
}

function getYearButtonVariant(option: YearPickerOption): 'primary' | 'ghost' | 'outline' {
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
          inputmode="numeric"
          :aria-controls="panelId"
          :aria-expanded="isOpen"
          aria-haspopup="dialog"
          aria-readonly="true"
          :class="inputClass"
          :value="displayValue"
          data-type="year-picker"
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
        :aria-labelledby="rangeLabelId"
        :data-testid="panelTestId"
      >
        <div :class="`${classNameComponent}__header`">
          <p
            :id="rangeLabelId"
            :class="`${classNameComponent}__range`"
            aria-live="polite"
            :data-testid="rangeTestId"
          >
            {{ rangeLabel }}
          </p>

          <PickerNavigation
            :data-test-id="navigationTestId"
            next-label="Nastepne 10 lat"
            :next-disabled="nextNavigationDisabled"
            previous-label="Poprzednie 10 lat"
            :previous-disabled="previousNavigationDisabled"
            @on:next="shiftRange(10)"
            @on:previous="shiftRange(-10)"
          />
        </div>

        <div
          :id="gridId"
          :class="`${classNameComponent}__grid`"
          role="grid"
          :aria-labelledby="rangeLabelId"
          :data-testid="gridTestId"
        >
          <div
            v-for="(row, rowIndex) in yearRows"
            :key="`row-${rowIndex}`"
            :class="`${classNameComponent}__row`"
            role="row"
          >
            <div
              v-for="year in row"
              :key="year.value"
              :class="`${classNameComponent}__cell`"
              role="gridcell"
              :aria-disabled="year.disabled || undefined"
              :aria-selected="year.selected || year.inRange"
            >
              <PickerButton
                :id="getYearButtonId(year.value)"
                :aria-current="year.current ? 'date' : undefined"
                :aria-label="getYearButtonAriaLabel(year.value)"
                :data-test-id="getYearButtonTestId(year.value)"
                :disabled="year.disabled"
                :tabindex="currentIndex === year.index ? 0 : -1"
                :variant="getYearButtonVariant(year)"
                @click.prevent.stop="selectYear(year.index)"
                @focus="handleYearButtonFocus(year.index)"
                @keydown="handleYearButtonKeydown($event, year.index)"
              >
                {{ year.value }}
              </PickerButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PopoverOverlayer>
</template>
