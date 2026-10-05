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
import { useVirtualListWindow } from '@/composables/useVirtualListWindow';
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type StyleValue,
} from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import {
  getSelectLabels,
  getSelectFormValues,
  focusInvalidSelect,
  resolveSelectPlacement,
  createSelectValueIndex,
  isSelectOptionSelected,
  toggleSelectValues,
  type SelectValueMode,
  type SelectLabels,
} from '../FormSelect/select.shared';

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
  placeholder,
  labels,
  valueMode = 'value',
  virtual = false,
  optionHeight = 48,
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
  labels?: Partial<SelectLabels>;
  /** Value is the default; label preserves the pre-3.0 Vue/WC model contract. */
  valueMode?: SelectValueMode;
  /** Render only visible fixed-height options for large lists. */
  virtual?: boolean;
  /** Row height in pixels when virtual is enabled (minimum 24). */
  optionHeight?: number;
  disabled?: boolean;
  readonly?: boolean;
  searchable?: boolean;
  withSelectAll?: boolean;
  dataTestId?: string;
  options: MultiSelectFieldOption<unknown>[];
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
const nativeInvalid = ref(false);
watch(modelValue, () => {
  nativeInvalid.value = false;
});
const formValues = computed(() => getSelectFormValues(modelValue.value, true));
const inputIsReadonly = computed(() => readonly || !searchable);
const normalizedSearchPhrase = computed(() => normalizeText(searchPhrase.value));

const selectedValueIndex = computed(() => createSelectValueIndex(getModelValues(), valueMode));
const selectedOptions = computed(() => options.filter((option) => isOptionSelected(option)));

const filteredOptions = computed(() => {
  if (!normalizedSearchPhrase.value) {
    return options;
  }

  return options.filter((option) =>
    normalizeText(option.label).startsWith(normalizedSearchPhrase.value),
  );
});

const { visibleOptions, beforeSize, afterSize, optionStyle, handleScroll, revealActive } =
  useVirtualListWindow({
    items: filteredOptions,
    viewport: listboxReference,
    activeIndex: currentIndex,
    enabled: () => virtual,
    itemSize: () => optionHeight,
    open: isOpen,
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
  currentOption.value &&
  (!virtual || visibleOptions.value.some(({ index }) => index === currentIndex.value))
    ? getOptionId(currentIndex.value)
    : undefined,
);

const displayValue = computed(() => {
  if (isOpen.value && searchable) {
    return searchPhrase.value;
  }

  return selectedOptions.value.map((option) => option.label).join(', ');
});

const resolvedLabels = computed(() => getSelectLabels(labels));
const currentPlaceholder = computed(() =>
  isOpen.value && searchable
    ? resolvedLabels.value.searchPlaceholder
    : (placeholder ?? resolvedLabels.value.placeholder),
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

const bindings = computed(() => {
  const inputBindings: Record<string, unknown> = {
    ...attrs,
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    autocapitalize: 'none',
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
  areAllFilteredOptionsSelected.value
    ? resolvedLabels.value.deselectAll
    : resolvedLabels.value.selectAll,
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

    void scrollActiveOptionIntoView();
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

function getOptionId(index: number): string {
  return `${id}-option-${index}`;
}

function getOptionKey(option: MultiSelectFieldOption<unknown>, index: number): string {
  return option.id ?? `${option.label}-${index}`;
}

function isOptionSelected(option: MultiSelectFieldOption<unknown>): boolean {
  return isSelectOptionSelected(option, selectedValueIndex.value, valueMode);
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

async function scrollActiveOptionIntoView(): Promise<void> {
  await revealActive();
  if (!currentOption.value) {
    return;
  }

  document.getElementById(activeDescendantId.value ?? '')?.scrollIntoView?.({
    block: 'nearest',
  });
}

function restoreListboxScrollPosition(scrollTop: number | null): void {
  if (scrollTop === null || !listboxReference.value) {
    return;
  }

  listboxReference.value.scrollTop = scrollTop;
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
  popoverPlacement.value = resolveSelectPlacement(
    rect,
    estimatedPopoverHeight,
    window.innerHeight,
    placement ?? 'bottom',
  );
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
    void scrollActiveOptionIntoView();
    return;
  }

  isOpen.value = false;
  currentIndex.value = -1;
  searchPhrase.value = '';
}

function commitToggle(candidates: MultiSelectFieldOption<unknown>[]): void {
  if (disabled || readonly) return;
  const scrollTop = listboxReference.value?.scrollTop ?? null;
  skipNextAutoScrollSync.value = true;
  modelValue.value = toggleSelectValues(getModelValues(), candidates, valueMode);
  void nextTick(() => restoreListboxScrollPosition(scrollTop));
}

function toggleOption(option: MultiSelectFieldOption<unknown>): void {
  if (!option || option.disabled) return;
  commitToggle([option]);
}

function toggleAllOptions(): void {
  commitToggle(selectableFilteredOptions.value);
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
      :aria-label="attrs['aria-label']"
      :aria-labelledby="attrs['aria-labelledby']"
      :aria-describedby="attrs['aria-describedby']"
      :aria-invalid="nativeInvalid || attrs['aria-invalid']"
      :after
      :before
      :can-erase="canErase"
      :clear-label="resolvedLabels.clear"
      :disabled
      iconAfter="arrow"
      :iconBefore
      :id
      :label
      :name
      :placeholder="currentPlaceholder"
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
          v-bind="{ ...bindings, ...fieldProps }"
          :name="undefined"
          :required="false"
          @invalid="
            nativeInvalid = true;
            focusInvalidSelect($event, inputReference);
          "
          :class="inputClass"
          :readonly="inputIsReadonly"
          :style="fieldProps.style as StyleValue"
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
        <select
          aria-hidden="true"
          :tabindex="-1"
          class="peaui-form-field__native-select"
          :name="name"
          :form="typeof attrs.form === 'string' ? attrs.form : undefined"
          :disabled="disabled"
          :required="required && !readonly"
          multiple
          @invalid="
            nativeInvalid = true;
            focusInvalidSelect($event, inputReference);
          "
        >
          <option
            v-for="(entry, index) in formValues"
            :key="`${index}:${entry}`"
            :value="entry"
            selected
          >
            {{ entry }}
          </option>
        </select>
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
      <div v-if="isOpen" :class="`${classNameComponent}__panel`">
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
          @scroll="handleScroll"
          role="listbox"
          tabindex="-1"
          :data-testid="listboxTestId"
        >
          <li
            v-if="beforeSize"
            role="presentation"
            aria-hidden="true"
            :style="{ height: `${beforeSize}px` }"
          />
          <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -- The combobox input owns focus and keyboard selection; pointer hover only changes its active descendant. -->
          <li
            v-for="{ item: option, index } in visibleOptions"
            :style="optionStyle"
            :aria-setsize="virtual ? filteredOptions.length : undefined"
            :aria-posinset="virtual ? index + 1 : undefined"
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
          <li
            v-if="afterSize"
            role="presentation"
            aria-hidden="true"
            :style="{ height: `${afterSize}px` }"
          />
        </ul>

        <p
          v-if="filteredOptions.length === 0"
          :class="`${classNameComponent}__empty`"
          role="status"
          aria-live="polite"
          :data-testid="emptyStateTestId"
        >
          {{ resolvedLabels.empty }}
        </p>
      </div>
    </template>
  </PopoverOverlayer>
</template>
