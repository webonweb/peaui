<script lang="ts">
export interface SelectFieldOption<T = string> {
  id?: string;
  active?: boolean;
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
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type StyleValue,
} from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { capitalizeFirstLetter } from '@/helpers/string.helper';

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
  getSelectOptionValue,
  isSelectOptionSelected,
  type SelectValueMode,
  type SelectLabels,
} from './select.shared';

defineOptions({
  inheritAttrs: false,
});

type PopoverOverlayerReference = {
  hidePopover: () => void;
  refreshPopoverPosition?: () => void;
  showPopover: () => void;
  togglePopover: () => void;
};

type SelectPopoverPlacement = 'top' | 'bottom';
type SelectSize = 'xs' | 's' | 'm' | 'l';

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
  placement,
  placeholder,
  labels,
  valueMode = 'value',
  virtual = false,
  optionHeight = 48,
  disabled,
  readonly,
  canWrite,
  searchable = true,
  size = 'm',
  dataTestId,
  options,
} = defineProps<{
  id: string;
  canErase?: boolean;
  after?: string;
  before?: string;
  name: string;
  label?: string;
  iconBefore?: string;
  required?: boolean;
  /** Preferred list placement. The list flips when the preferred side has insufficient space. */
  placement?: SelectPopoverPlacement;
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
  canWrite?: boolean;
  searchable?: boolean;
  size?: SelectSize;
  dataTestId?: string;
  options: SelectFieldOption<unknown>[];
}>();

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
const listboxReference = useTemplateRef<HTMLElement>('listboxReference');
const inputReference = useTemplateRef('inputReference');
const popoverReference = useTemplateRef<PopoverOverlayerReference>('popoverReference');
const classNameComponent = `${UIKIT_NAME}-form-select`;

const modelValue = defineModel<unknown>('value', {
  required: true,
});

const currentIndex = ref(-1);
const isOpen = ref(false);
const searchPhrase = ref('');
const popoverPlacement = ref<SelectPopoverPlacement>(placement ?? 'bottom');
let viewportListenersAttached = false;

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
const formValues = computed(() => getSelectFormValues(modelValue.value, false));
const inputIsReadonly = computed(() => readonly || !searchable);
const normalizedSearchPhrase = computed(() => normalizeText(searchPhrase.value));

const selectedValueIndex = computed(() => createSelectValueIndex([modelValue.value], valueMode));
const selectedOption = computed(() =>
  options.find((option) => {
    if (!isModelValueEmpty(modelValue.value)) {
      return isOptionMatchingModelValue(option);
    }

    return !!option.active;
  }),
);

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

  if (selectedOption.value) {
    return toDisplayText(capitalizeFirstLetter(selectedOption.value.label));
  }

  if (isModelValueEmpty(modelValue.value)) {
    return '';
  }

  return toDisplayText(capitalizeFirstLetter(`${modelValue.value}`));
});

const resolvedLabels = computed(() => getSelectLabels(labels));
const currentPlaceholder = computed(() =>
  isOpen.value && searchable
    ? resolvedLabels.value.searchPlaceholder
    : searchable
      ? (placeholder ?? resolvedLabels.value.placeholder)
      : resolvedLabels.value.selectPlaceholder,
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
  `${classNameComponent}--size-${size}`,
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

// WATCHERS
//-----------------------------------------------------------------------------------------------//
watch(
  [filteredOptions, () => isOpen.value],
  async () => {
    if (!isOpen.value) {
      return;
    }

    syncPopoverPlacement();
    syncCurrentIndex();
    await nextTick();
    popoverReference.value?.refreshPopoverPosition?.();
    void scrollActiveOptionIntoView();
  },
  { deep: true },
);

watch(
  () => isOpen.value,
  (open) => {
    if (open) {
      addViewportListeners();
      return;
    }

    removeViewportListeners();
  },
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

function toDisplayText(value: unknown): string {
  return value === null || value === undefined ? '' : `${capitalizeFirstLetter(`${value}`)}`;
}

function isModelValueEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function isOptionMatchingModelValue(option: SelectFieldOption<unknown>): boolean {
  return isSelectOptionSelected(option, selectedValueIndex.value, valueMode);
}

function getOptionId(index: number): string {
  return `${id}-option-${index}`;
}

function isOptionSelected(option: SelectFieldOption<unknown>): boolean {
  if (isModelValueEmpty(modelValue.value)) {
    return !!option.active;
  }

  return isOptionMatchingModelValue(option);
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

function getEstimatedPopoverHeight(): number {
  const emptyStateHeight = 48;
  const optionHeight = 48;
  const panelVerticalPadding = 8;
  const maxPanelHeight = 240;

  if (filteredOptions.value.length === 0) {
    return emptyStateHeight;
  }

  return Math.min(
    filteredOptions.value.length * optionHeight + panelVerticalPadding,
    maxPanelHeight,
  );
}

function syncPopoverPlacement(): void {
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

function refreshOpenPopoverPosition(): void {
  if (!isOpen.value) {
    return;
  }

  syncPopoverPlacement();
  void nextTick(() => {
    popoverReference.value?.refreshPopoverPosition?.();
  });
}

function addViewportListeners(): void {
  if (viewportListenersAttached || typeof window === 'undefined') {
    return;
  }

  window.addEventListener('resize', refreshOpenPopoverPosition);
  window.addEventListener('scroll', refreshOpenPopoverPosition, true);
  window.visualViewport?.addEventListener('resize', refreshOpenPopoverPosition);
  window.visualViewport?.addEventListener('scroll', refreshOpenPopoverPosition);
  viewportListenersAttached = true;
}

function removeViewportListeners(): void {
  if (!viewportListenersAttached || typeof window === 'undefined') {
    return;
  }

  window.removeEventListener('resize', refreshOpenPopoverPosition);
  window.removeEventListener('scroll', refreshOpenPopoverPosition, true);
  window.visualViewport?.removeEventListener('resize', refreshOpenPopoverPosition);
  window.visualViewport?.removeEventListener('scroll', refreshOpenPopoverPosition);
  viewportListenersAttached = false;
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

    if (searchable) {
      searchPhrase.value = canWrite && !selectedOption.value ? toDisplayText(modelValue.value) : '';
    }

    syncCurrentIndex();
    await nextTick();
    popoverReference.value?.refreshPopoverPosition?.();
    void scrollActiveOptionIntoView();
    return;
  }

  isOpen.value = false;
  currentIndex.value = -1;
  searchPhrase.value = '';
}

function selectOption(index: number): void {
  const option = filteredOptions.value[index];

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  modelValue.value = getSelectOptionValue(option, valueMode);
  searchPhrase.value = '';

  closeSelect();

  void nextTick(() => {
    inputReference.value?.focus();
  });
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

  if (canWrite) {
    modelValue.value = searchPhrase.value;
  }

  if (!isOpen.value) {
    openSelect();
  }
}

function handleEraseValue(): void {
  modelValue.value = '';
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
    selectOption(currentIndex.value);
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

function handleTab(): void {
  closeSelect();
}

function handleOptionMouseEnter(index: number): void {
  if (filteredOptions.value[index]?.disabled) {
    return;
  }

  currentIndex.value = index;
}

onBeforeUnmount(() => {
  removeViewportListeners();
});
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
          @input.stop.prevent="handleInput"
          @keydown.down.stop.prevent="moveCurrentIndex(1)"
          @keydown.up.stop.prevent="moveCurrentIndex(-1)"
          @keydown.enter.stop.prevent="handleEnter"
          @keydown.space.stop.prevent="handleEnter"
          @keydown.esc.stop="handleEscape"
          @keydown.home.stop="handleHome"
          @keydown.end.stop="handleEnd"
          @keydown.tab="handleTab"
          ref="inputReference"
          data-type="select"
          :data-testid="elementTestId"
        />
        <select
          aria-hidden="true"
          :tabindex="-1"
          class="peaui-form-field__native-select"
          :name="name"
          :form="typeof attrs.form === 'string' ? attrs.form : undefined"
          :disabled="disabled"
          :required="required && !readonly"
          @invalid="
            nativeInvalid = true;
            focusInvalidSelect($event, inputReference);
          "
        >
          <option value="" :selected="formValues.length === 0" />
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
        <ul
          ref="listboxReference"
          :id="listboxId"
          :class="`${classNameComponent}__listbox`"
          :aria-label="listboxAriaLabel"
          :aria-labelledby="listboxLabelledBy"
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
            :key="option.id ?? `${option.label}-${index}`"
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
            @click="selectOption(index)"
            @mousedown.prevent
            @mouseenter="handleOptionMouseEnter(index)"
            role="option"
          >
            <SvgIcon
              v-if="option.icon"
              :class="`${classNameComponent}__option-icon`"
              :name="option.icon"
            />

            <span :class="`${classNameComponent}__option-label`">
              {{ capitalizeFirstLetter(option.label) }}
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
          {{ canWrite ? resolvedLabels.emptyWritable : resolvedLabels.empty }}
        </p>
      </div>
    </template>
  </PopoverOverlayer>
</template>
