<script lang="ts">
export interface MultiSelectFieldOption<T = string> {
  id?: string;
  disabled?: boolean;
  icon?: string;
  label: string;
  value?: T;
  hint?: string;
}
</script>

<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import type { StyleValue } from 'vue';
import { computed, nextTick, ref, useAttrs, useSlots, useTemplateRef, watch } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { getPaddingRight } from '@/helpers/functions.helper';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';

defineOptions({
  inheritAttrs: false,
});

type PopoverOverlayerReference = {
  hidePopover: () => void;
  showPopover: () => void;
  togglePopover: () => void;
};

type MultiSelectPopoverPlacement = 'top' | 'bottom';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  canErase,
  after,
  before,
  name,
  label,
  iconBefore,
  required,
  placeholder = 'wybierz/wyszukaj',
  disabled,
  readonly,
  searchable = true,
  withSelectAll = false,
  dataTestId,
  options,
  placement,
} = defineProps<{
  id: string;
  canErase?: boolean;
  after?: string;
  before?: string;
  name: string;
  label?: string;
  iconBefore?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  searchable?: boolean;
  withSelectAll?: boolean;
  dataTestId?: string;
  options: MultiSelectFieldOption[];
  placement?: MultiSelectPopoverPlacement;
}>();

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
const inputReference = useTemplateRef('inputReference');
const listboxReference = useTemplateRef<HTMLElement>('listboxReference');
const popoverReference = useTemplateRef<PopoverOverlayerReference>('popoverReference');
const selectAllButtonReference = useTemplateRef<HTMLButtonElement>('selectAllButtonReference');
const classNameComponent = `${UIKIT_NAME}-form-multiselect`;

const modelValue = defineModel<unknown[] | null | undefined>('value', {
  required: true,
});

const currentIndex = ref(-1);
const isOpen = ref(false);
const searchPhrase = ref('');
const popoverPlacement = ref<MultiSelectPopoverPlacement>('bottom');
const skipNextAutoScrollSync = ref(false);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const listboxId = computed(() => `${id}-listbox`);
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const listboxLabelledBy = computed(() => (label ? `label-${id}` : explicitAriaLabelledBy.value));
const listboxAriaLabel = computed(
  () => explicitAriaLabel.value ?? (!label && !explicitAriaLabelledBy.value ? name : undefined),
);
const inputIsReadonly = computed(() => readonly || !searchable);
const inputReferencePaddingRight = computed(() => getPaddingRight(inputReference.value));
const normalizedSearchPhrase = computed(() => normalizeText(searchPhrase.value));

const selectedOptions = computed(() => options.filter((option) => isOptionSelected(option)));

const filteredOptions = computed(() => {
  if (!normalizedSearchPhrase.value) {
    return options;
  }

  return options.filter((option) =>
    normalizeText(option.label).startsWith(normalizedSearchPhrase.value),
  );
});

const selectableFilteredOptions = computed(() =>
  filteredOptions.value.filter((option) => !option.disabled),
);

const areAllFilteredOptionsSelected = computed(
  () =>
    selectableFilteredOptions.value.length > 0 &&
    selectableFilteredOptions.value.every((option) => isOptionSelected(option)),
);

const currentOption = computed(() =>
  currentIndex.value >= 0 ? filteredOptions.value[currentIndex.value] : undefined,
);

const activeDescendantId = computed(() =>
  currentOption.value ? getOptionId(currentIndex.value) : undefined,
);

const displayValue = computed(() => {
  if (isOpen.value && searchable) {
    return searchPhrase.value;
  }

  return selectedOptions.value.map((option) => option.label).join(', ');
});

const currentPlaceholder = computed(() =>
  isOpen.value && searchable ? 'wyszukaj opcje' : placeholder,
);

const inputClass = computed(() => [
  `${classNameComponent}__input`,
  {
    [`${classNameComponent}__input--searchable`]: searchable && !readonly && !disabled,
    [`${classNameComponent}__input--select-only`]: !searchable && !readonly && !disabled,
  },
]);

const rootClass = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--open`]: isOpen.value,
    [`${classNameComponent}--disabled`]: disabled,
    [`${classNameComponent}--readonly`]: readonly,
  },
]);

const inputStyles = computed(() => ({
  '--peaui-form-multiselect-input-padding-right': canErase ? '4.5rem' : '2.75rem',
}));

function mergeInputStyles(style: unknown): StyleValue {
  return [style as StyleValue, inputStyles.value];
}

const bindings = computed(() => {
  const inputBindings: Record<string, unknown> = {
    ...attrs,
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: false,
    readonly: inputIsReadonly.value,
    'aria-autocomplete': searchable ? 'list' : 'none',
    'aria-controls': listboxId.value,
    'aria-expanded': isOpen.value,
    'aria-haspopup': 'listbox',
  };

  if (isOpen.value && activeDescendantId.value) {
    inputBindings['aria-activedescendant'] = activeDescendantId.value;
  }

  return inputBindings;
});

const rightErasePosition = computed(() => inputReferencePaddingRight.value);

const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const listboxTestId = computed(() => (dataTestId ? `${dataTestId}-listbox` : undefined));
const emptyStateTestId = computed(() => (dataTestId ? `${dataTestId}-empty` : undefined));
const popoverTestId = computed(() => (dataTestId ? `${dataTestId}-popover` : undefined));
const popoverContentClass = computed(() => `${classNameComponent}__popover-content`);
const selectAllOptionTestId = computed(() =>
  dataTestId ? `${dataTestId}-select-all-option` : undefined,
);
const showSelectAllAction = computed(() => withSelectAll && filteredOptions.value.length > 0);
const selectAllActionDisabled = computed(() => selectableFilteredOptions.value.length === 0);
const selectAllActionLabel = computed(() =>
  areAllFilteredOptionsSelected.value ? 'Odznacz wszystkie' : 'Zaznacz wszystkie',
);

// WATCHERS
//-----------------------------------------------------------------------------------------------//
watch(
  [filteredOptions, () => isOpen.value],
  async () => {
    if (!isOpen.value) {
      return;
    }

    const shouldSkipAutoScrollSync = skipNextAutoScrollSync.value;

    syncPopoverPlacement();
    if (!shouldSkipAutoScrollSync) {
      syncCurrentIndex();
    }
    await nextTick();

    if (shouldSkipAutoScrollSync) {
      skipNextAutoScrollSync.value = false;
      return;
    }

    scrollActiveOptionIntoView();
  },
  { deep: true },
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function normalizeText(value: unknown): string {
  return `${value ?? ''}`.trim().toLowerCase();
}

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function getModelValues(): unknown[] {
  return Array.isArray(modelValue.value) ? modelValue.value : [];
}

function getOptionModelValue(option: MultiSelectFieldOption): unknown {
  return option.label ?? option.value;
}

function isValueEqual(leftValue: unknown, rightValue: unknown): boolean {
  if (leftValue === rightValue) {
    return true;
  }

  const normalizedLeftValue = normalizeText(leftValue);
  const normalizedRightValue = normalizeText(rightValue);

  return normalizedLeftValue !== '' && normalizedLeftValue === normalizedRightValue;
}

function areOptionsEqual(
  leftOption: MultiSelectFieldOption,
  rightOption: MultiSelectFieldOption,
): boolean {
  if (leftOption.id && rightOption.id) {
    return leftOption.id === rightOption.id;
  }

  return (
    isValueEqual(getOptionModelValue(leftOption), getOptionModelValue(rightOption)) ||
    isValueEqual(leftOption.label, rightOption.label)
  );
}

function getOptionId(index: number): string {
  return `${id}-option-${index}`;
}

function getOptionKey(option: MultiSelectFieldOption, index: number): string {
  return option.id ?? `${option.label}-${index}`;
}

function isOptionSelected(option: MultiSelectFieldOption): boolean {
  return getModelValues().some((value) => {
    if (option.value !== undefined && isValueEqual(option.value, value)) {
      return true;
    }

    return isValueEqual(option.label, value);
  });
}

function getFirstEnabledIndex(): number {
  return filteredOptions.value.findIndex((option) => !option.disabled);
}

function getLastEnabledIndex(): number {
  for (let index = filteredOptions.value.length - 1; index >= 0; index -= 1) {
    if (!filteredOptions.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getNextEnabledIndex(startIndex: number, direction: 1 | -1): number {
  for (
    let index = startIndex;
    index >= 0 && index < filteredOptions.value.length;
    index += direction
  ) {
    if (!filteredOptions.value[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getSelectedEnabledIndex(): number {
  return filteredOptions.value.findIndex((option) => isOptionSelected(option) && !option.disabled);
}

function syncCurrentIndex(): void {
  const selectedIndex = getSelectedEnabledIndex();

  if (selectedIndex >= 0) {
    currentIndex.value = selectedIndex;
    return;
  }

  currentIndex.value = getFirstEnabledIndex();
}

function scrollActiveOptionIntoView(): void {
  if (!currentOption.value) {
    return;
  }

  document.getElementById(activeDescendantId.value ?? '')?.scrollIntoView({
    block: 'nearest',
  });
}

function restoreListboxScrollPosition(scrollTop: number | null): void {
  if (scrollTop === null || !listboxReference.value) {
    return;
  }

  listboxReference.value.scrollTop = scrollTop;
}

function commitSelectedOptions(
  nextSelectedOptions: MultiSelectFieldOption[],
  currentListboxScrollTop: number | null,
): void {
  skipNextAutoScrollSync.value = true;
  modelValue.value = nextSelectedOptions.map((selectedOption) =>
    getOptionModelValue(selectedOption),
  );

  void nextTick(() => {
    restoreListboxScrollPosition(currentListboxScrollTop);
  });
}

function orderSelectedOptions(
  selectedCandidates: MultiSelectFieldOption[],
): MultiSelectFieldOption[] {
  return options.filter((option) =>
    selectedCandidates.some((candidate) => areOptionsEqual(candidate, option)),
  );
}

function getEstimatedPopoverHeight(): number {
  const selectAllActionHeight = 56;
  const emptyStateHeight = 48;
  const optionHeight = 48;
  const panelVerticalPadding = 8;
  const maxPanelHeight = 240;

  if (filteredOptions.value.length === 0) {
    return emptyStateHeight;
  }

  return Math.min(
    filteredOptions.value.length * optionHeight +
      panelVerticalPadding +
      (showSelectAllAction.value ? selectAllActionHeight : 0),
    maxPanelHeight,
  );
}

function syncPopoverPlacement(): void {
  if (placement) {
    popoverPlacement.value = placement;
    return;
  }

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

function openSelect(): void {
  if (disabled || readonly) {
    return;
  }

  syncPopoverPlacement();
  popoverReference.value?.showPopover();
}

function closeSelect(): void {
  popoverReference.value?.hidePopover();
}

async function handlePopoverState(open: boolean): Promise<void> {
  if (open) {
    isOpen.value = true;

    syncCurrentIndex();
    await nextTick();
    scrollActiveOptionIntoView();
    return;
  }

  isOpen.value = false;
  currentIndex.value = -1;
  searchPhrase.value = '';
}

function toggleOption(option: MultiSelectFieldOption): void {
  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  const currentListboxScrollTop = listboxReference.value?.scrollTop ?? null;

  const nextSelectedOptions = selectedOptions.value.filter(
    (selectedOption) => !areOptionsEqual(selectedOption, option),
  );

  if (!isOptionSelected(option)) {
    nextSelectedOptions.push(option);
  }

  commitSelectedOptions(orderSelectedOptions(nextSelectedOptions), currentListboxScrollTop);
}

function toggleAllOptions(): void {
  if (disabled || readonly || selectableFilteredOptions.value.length === 0) {
    return;
  }

  const currentListboxScrollTop = listboxReference.value?.scrollTop ?? null;

  const nextSelectedOptions = areAllFilteredOptionsSelected.value
    ? selectedOptions.value.filter(
        (selectedOption) =>
          !selectableFilteredOptions.value.some((option) =>
            areOptionsEqual(option, selectedOption),
          ),
      )
    : selectedOptions.value.concat(
        selectableFilteredOptions.value.filter(
          (option) =>
            !selectedOptions.value.some((selectedOption) =>
              areOptionsEqual(option, selectedOption),
            ),
        ),
      );

  commitSelectedOptions(orderSelectedOptions(nextSelectedOptions), currentListboxScrollTop);
}

function toggleOptionByIndex(index: number): void {
  const option = filteredOptions.value[index];

  if (!option || option.disabled) {
    return;
  }

  toggleOption(option);
}

function moveCurrentIndex(direction: 1 | -1): void {
  if (!isOpen.value) {
    openSelect();
    return;
  }

  const startIndex =
    currentIndex.value === -1
      ? direction === 1
        ? 0
        : filteredOptions.value.length - 1
      : currentIndex.value + direction;

  const nextIndex = getNextEnabledIndex(startIndex, direction);

  if (nextIndex !== -1) {
    currentIndex.value = nextIndex;
    void nextTick(scrollActiveOptionIntoView);
  }
}

function handleInput(event: Event): void {
  if (!searchable || disabled || readonly) {
    return;
  }

  searchPhrase.value = (event.target as HTMLInputElement).value;

  if (!isOpen.value) {
    openSelect();
  }
}

function handleEraseValue(): void {
  modelValue.value = [];
  searchPhrase.value = '';
  closeSelect();

  emit('on:remove');

  void nextTick(() => {
    inputReference.value?.focus();
  });
}

function handleEnter(event: KeyboardEvent): void {
  event.preventDefault();

  if (!isOpen.value) {
    openSelect();
    return;
  }

  if (currentIndex.value >= 0) {
    toggleOptionByIndex(currentIndex.value);
  }
}

function handleEscape(event: KeyboardEvent): void {
  if (!isOpen.value) {
    return;
  }

  event.preventDefault();
  closeSelect();
}

function handleHome(event: KeyboardEvent): void {
  if (!isOpen.value) {
    return;
  }

  event.preventDefault();
  currentIndex.value = getFirstEnabledIndex();
  void nextTick(scrollActiveOptionIntoView);
}

function handleEnd(event: KeyboardEvent): void {
  if (!isOpen.value) {
    return;
  }

  event.preventDefault();
  currentIndex.value = getLastEnabledIndex();
  void nextTick(scrollActiveOptionIntoView);
}

function handleTab(event: KeyboardEvent): void {
  if (
    isOpen.value &&
    !event.shiftKey &&
    showSelectAllAction.value &&
    !selectAllActionDisabled.value
  ) {
    event.preventDefault();
    selectAllButtonReference.value?.focus();
    return;
  }

  closeSelect();
}

function handleOptionMouseEnter(index: number): void {
  if (filteredOptions.value[index]?.disabled) {
    return;
  }

  currentIndex.value = index;
}

function handleSelectAllActionEscape(event: KeyboardEvent): void {
  event.preventDefault();
  closeSelect();

  void nextTick(() => {
    inputReference.value?.focus();
  });
}

function handleSelectAllActionTab(event: KeyboardEvent): void {
  if (event.shiftKey) {
    event.preventDefault();
    inputReference.value?.focus();
    return;
  }

  requestAnimationFrame(() => {
    closeSelect();
  });
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
      iconAfter="arrow"
      :iconBefore
      :id
      :label
      :name
      :placeholder="currentPlaceholder"
      :readonly
      :required
      :right-erase-position="rightErasePosition"
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
          v-bind="{ ...bindings, ...fieldProps }"
          :class="inputClass"
          :readonly="inputIsReadonly"
          :style="mergeInputStyles(fieldProps.style)"
          :value="displayValue"
          data-type="multiselect"
          :data-testid="elementTestId"
          @input.stop.prevent="handleInput"
          @keydown.down.stop.prevent="moveCurrentIndex(1)"
          @keydown.up.stop.prevent="moveCurrentIndex(-1)"
          @keydown.enter.stop.prevent="handleEnter"
          @keydown.esc.stop="handleEscape"
          @keydown.home.stop="handleHome"
          @keydown.end.stop="handleEnd"
          @keydown.tab="handleTab"
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
      <div :class="`${classNameComponent}__panel`">
        <button
          v-if="showSelectAllAction"
          ref="selectAllButtonReference"
          type="button"
          :class="`${classNameComponent}__action`"
          :data-testid="selectAllOptionTestId"
          :disabled="selectAllActionDisabled"
          :aria-pressed="areAllFilteredOptionsSelected"
          @click="toggleAllOptions"
          @keydown.esc.stop.prevent="handleSelectAllActionEscape"
          @keydown.tab="handleSelectAllActionTab"
        >
          {{ selectAllActionLabel }}
        </button>

        <ul
          ref="listboxReference"
          :id="listboxId"
          :class="`${classNameComponent}__listbox`"
          :aria-label="listboxAriaLabel"
          :aria-labelledby="listboxLabelledBy"
          aria-multiselectable="true"
          role="listbox"
          tabindex="-1"
          :data-testid="listboxTestId"
        >
          <li
            v-for="(option, index) in filteredOptions"
            :id="getOptionId(index)"
            :key="getOptionKey(option, index)"
            :class="[
              `${classNameComponent}__option`,
              {
                [`${classNameComponent}__option--current`]: currentIndex === index,
                [`${classNameComponent}__option--selected`]: isOptionSelected(option),
                [`${classNameComponent}__option--disabled`]: option.disabled,
                [`${classNameComponent}__option--with-icon`]: option.icon,
                [`${classNameComponent}__option--with-hint`]: option.hint,
              },
            ]"
            :aria-disabled="option.disabled || undefined"
            :aria-selected="isOptionSelected(option)"
            role="option"
            @click="toggleOptionByIndex(index)"
            @mousedown.prevent
            @mouseenter="handleOptionMouseEnter(index)"
          >
            <span :class="`${classNameComponent}__option-marker`" aria-hidden="true" />

            <SvgIcon
              v-if="option.icon"
              :class="`${classNameComponent}__option-icon`"
              :name="option.icon"
            />

            <span :class="`${classNameComponent}__option-label`">
              {{ option.label }}
            </span>

            <InfoTooltip
              v-if="option.hint"
              :class="`${classNameComponent}__option-hint`"
              placement="right"
            >
              <span :class="`${classNameComponent}__option-hint-trigger`" aria-hidden="true"
                >i</span
              >

              <template #description>
                {{ option.hint }}
              </template>
            </InfoTooltip>
          </li>
        </ul>

        <p
          v-if="filteredOptions.length === 0"
          :class="`${classNameComponent}__empty`"
          role="status"
          aria-live="polite"
          :data-testid="emptyStateTestId"
        >
          - brak wynikow -
        </p>
      </div>
    </template>
  </PopoverOverlayer>
</template>
