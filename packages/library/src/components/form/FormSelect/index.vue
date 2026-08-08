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
  placeholder = 'wybierz/wyszukaj',
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
  disabled?: boolean;
  readonly?: boolean;
  canWrite?: boolean;
  searchable?: boolean;
  size?: SelectSize;
  dataTestId?: string;
  options: SelectFieldOption[];
}>();

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
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
const inputIsReadonly = computed(() => readonly || !searchable);
const normalizedSearchPhrase = computed(() => normalizeText(searchPhrase.value));

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

  if (selectedOption.value) {
    return toDisplayText(capitalizeFirstLetter(selectedOption.value.label));
  }

  if (isModelValueEmpty(modelValue.value)) {
    return '';
  }

  return toDisplayText(capitalizeFirstLetter(`${modelValue.value}`));
});

const currentPlaceholder = computed(() =>
  isOpen.value && searchable ? 'wyszukaj opcję' : searchable ? placeholder : 'wybierz opcję',
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
    scrollActiveOptionIntoView();
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

function isOptionMatchingModelValue(option: SelectFieldOption): boolean {
  if (isModelValueEmpty(modelValue.value)) {
    return false;
  }

  if (option.value !== undefined && option.value === modelValue.value) {
    return true;
  }

  if (option.label === modelValue.value) {
    return true;
  }

  const optionLabel = normalizeText(option.label);
  const optionValue = normalizeText(option.value);
  const normalizedValue = normalizeText(modelValue.value);

  return optionLabel === normalizedValue || (optionValue !== '' && optionValue === normalizedValue);
}

function getOptionId(index: number): string {
  return `${id}-option-${index}`;
}

function isOptionSelected(option: SelectFieldOption): boolean {
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

function scrollActiveOptionIntoView(): void {
  if (!currentOption.value) {
    return;
  }

  document.getElementById(activeDescendantId.value ?? '')?.scrollIntoView({
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
  const availableAbove = rect.top;
  const availableBelow = window.innerHeight - rect.bottom;
  const preferredPlacement = placement ?? 'bottom';
  const preferredSpace = preferredPlacement === 'bottom' ? availableBelow : availableAbove;
  const fallbackPlacement: SelectPopoverPlacement =
    preferredPlacement === 'bottom' ? 'top' : 'bottom';
  const fallbackSpace = fallbackPlacement === 'bottom' ? availableBelow : availableAbove;

  popoverPlacement.value =
    preferredSpace >= estimatedPopoverHeight || preferredSpace >= fallbackSpace
      ? preferredPlacement
      : fallbackPlacement;
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
    scrollActiveOptionIntoView();
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

  modelValue.value = option.label;
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
          :class="inputClass"
          :readonly="inputIsReadonly"
          :style="fieldProps.style as StyleValue"
          :value="displayValue"
          @input.stop.prevent="handleInput"
          @keydown.down.stop.prevent="moveCurrentIndex(1)"
          @keydown.up.stop.prevent="moveCurrentIndex(-1)"
          @keydown.enter.stop.prevent="handleEnter"
          @keydown.space.stop.prevent="handleEnter"
          @keydown.spacebar.stop.prevent="handleEnter"
          @keydown.esc.stop="handleEscape"
          @keydown.home.stop="handleHome"
          @keydown.end.stop="handleEnd"
          @keydown.tab="handleTab"
          ref="inputReference"
          data-type="select"
          :data-testid="elementTestId"
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
        <ul
          :id="listboxId"
          :class="`${classNameComponent}__listbox`"
          :aria-label="listboxAriaLabel"
          :aria-labelledby="listboxLabelledBy"
          role="listbox"
          tabindex="-1"
          :data-testid="listboxTestId"
        >
          <li
            v-for="(option, index) in filteredOptions"
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
        </ul>

        <p
          v-if="filteredOptions.length === 0"
          :class="`${classNameComponent}__empty`"
          role="status"
          aria-live="polite"
          :data-testid="emptyStateTestId"
        >
          - brak wyników {{ canWrite ? '(wartość można wpisać ręcznie)' : '' }} -
        </p>
      </div>
    </template>
  </PopoverOverlayer>
</template>
