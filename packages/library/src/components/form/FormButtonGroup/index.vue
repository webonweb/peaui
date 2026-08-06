<script lang="ts">
export interface ButtonGroupOption {
  label: string;
  key: string | number;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
}

export type ButtonGroupSize = 'xs' | 's' | 'm' | 'l';
</script>

<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useSlots } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import FormField from '@/components/form/FormField/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  name,
  label,
  size = 'm',
  isToggle = false,
  required,
  disabled,
  readonly,
  dataTestId,
  options,
} = defineProps<{
  id: string;
  name: string;
  label?: string;
  size?: ButtonGroupSize;
  isToggle?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
  options: ButtonGroupOption[];
}>();

const attrs = useAttrs();
const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-form-button-group`;
const modelValue = defineModel<string | number | undefined>('value', {
  required: true,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const firstEnabledIndex = computed(() => getFirstEnabledIndex());
const selectedIndex = computed(() =>
  options.findIndex((option) => isOptionSelected(option) && !option.disabled),
);
const activeIndex = computed(() =>
  selectedIndex.value >= 0 ? selectedIndex.value : firstEnabledIndex.value,
);

const selectedOption = computed(() => options.find((option) => isOptionSelected(option)));

const groupClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}__group`,
  attrs.class,
  {
    [`${classNameComponent}__group--disabled`]: disabled,
    [`${classNameComponent}__group--readonly`]: readonly,
  },
]);

const layoutClasses = computed(() => `${classNameComponent}__layout`);
const buttonsClasses = computed(() => `${classNameComponent}__buttons`);

const fieldValue = computed(() => selectedOption.value?.label ?? '');

const bindings = computed(() => {
  const { class: _class, ...restAttrs } = attrs;
  const explicitAriaLabel = getNormalizedAttributeValue(attrs['aria-label']);
  const explicitAriaLabelledBy = getNormalizedAttributeValue(attrs['aria-labelledby']);
  const groupBindings: Record<string, unknown> = {
    ...restAttrs,
    role: 'radiogroup',
    'aria-labelledby': label ? `label-${id}` : explicitAriaLabelledBy,
    'aria-label': explicitAriaLabel ?? (!label && !explicitAriaLabelledBy ? name : undefined),
    'aria-orientation': 'horizontal',
    'aria-readonly': readonly || undefined,
    'data-testid': dataTestId ? `${dataTestId}-group` : undefined,
  };

  return groupBindings;
});

const hiddenInputTestId = computed(() => (dataTestId ? `${dataTestId}-hidden-input` : undefined));
const additionalHintTestId = computed(() =>
  dataTestId ? `${dataTestId}-additional-hint` : undefined,
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function isModelValueEmpty(value: string | number | undefined): boolean {
  return value === null || value === undefined || value === '';
}

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function getButtonId(index: number): string {
  return `${id}-option-${index}`;
}

function getButtonTestId(index: number): string | undefined {
  return dataTestId ? `${dataTestId}-option-${index}` : undefined;
}

function getButtonHintTestId(index: number): string | undefined {
  return dataTestId ? `${dataTestId}-option-${index}-hint` : undefined;
}

function isOptionSelected(option: ButtonGroupOption): boolean {
  if (!isModelValueEmpty(modelValue.value)) {
    return option.key === modelValue.value;
  }

  return !!option.active;
}

function getOptionHint(option: ButtonGroupOption): string | undefined {
  return getNormalizedAttributeValue(option.hint);
}

function isButtonDisabled(option: ButtonGroupOption): boolean {
  return Boolean(disabled || option.disabled);
}

function getButtonTooltipVariant(option: ButtonGroupOption): 'default' | 'disabled' {
  return isButtonDisabled(option) ? 'disabled' : 'default';
}

function getFirstEnabledIndex(): number {
  return options.findIndex((option) => !option.disabled);
}

function getLastEnabledIndex(): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getNextEnabledIndex(startIndex: number, direction: 1 | -1): number {
  for (let index = startIndex; index >= 0 && index < options.length; index += direction) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getButtonTabIndex(index: number): number {
  return activeIndex.value === index ? 0 : -1;
}

function getButtonClasses(
  option: ButtonGroupOption,
  index: number,
): Array<string | Record<string, boolean>> {
  return [
    `${classNameComponent}__button`,
    `${classNameComponent}__button--size-${size}`,
    {
      [`${classNameComponent}__button--selected`]: isOptionSelected(option),
      [`${classNameComponent}__button--disabled`]: Boolean(disabled || option.disabled),
      [`${classNameComponent}__button--readonly`]: Boolean(readonly),
      [`${classNameComponent}__button--first`]: index === 0,
      [`${classNameComponent}__button--last`]: index === options.length - 1,
      [`${classNameComponent}__button--middle`]: index > 0 && index < options.length - 1,
      [`${classNameComponent}__button--not-first`]: index > 0,
    },
  ];
}

function focusButton(index: number): void {
  document.getElementById(getButtonId(index))?.focus();
}

function setSelectedIndex(index: number, allowToggleCurrent = false): void {
  const option = options[index];

  if (!option || option.disabled || disabled || readonly) {
    return;
  }

  if (allowToggleCurrent && isOptionSelected(option) && !required && isToggle) {
    modelValue.value = undefined;
    focusButton(index);
    return;
  }

  modelValue.value = option.key;
  focusButton(index);
}

function handleClick(index: number): void {
  setSelectedIndex(index, true);
}

function handleArrowNavigation(index: number, direction: 1 | -1): void {
  const nextIndex = getNextEnabledIndex(index + direction, direction);

  if (nextIndex === -1) {
    return;
  }

  setSelectedIndex(nextIndex);
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  if (disabled || readonly || options[index]?.disabled) {
    return;
  }

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      handleArrowNavigation(index, 1);
      return;
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      handleArrowNavigation(index, -1);
      return;
    case 'Home':
      event.preventDefault();
      setSelectedIndex(getFirstEnabledIndex());
      return;
    case 'End':
      event.preventDefault();
      setSelectedIndex(getLastEnabledIndex());
      return;
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      handleClick(index);
      return;
    default:
      return;
  }
}
</script>

<template>
  <FormField
    :id
    :label
    :name
    :readonly
    :required
    :disabled
    :value="fieldValue"
    :data-test-id="dataTestId"
  >
    <template v-if="slots.hint" #hint>
      <slot name="hint" />
    </template>

    <template #default="{ props: fieldProps }">
      <input
        type="hidden"
        :name="name"
        :value="modelValue ?? ''"
        :disabled="disabled"
        :data-testid="hiddenInputTestId"
      />

      <div :class="layoutClasses">
        <div v-bind="{ ...bindings, ...fieldProps }" :class="groupClasses">
          <div :class="buttonsClasses">
            <template v-for="(option, index) in options" :key="option.key">
              <div :class="`${classNameComponent}__button-item`">
                <InfoTooltip
                  v-if="getOptionHint(option)"
                  placement="right"
                  :variant="getButtonTooltipVariant(option)"
                  :class="`${classNameComponent}__button-tooltip`"
                  :data-test-id="getButtonHintTestId(index)"
                  tabindex="-1"
                >
                  <button
                    :id="getButtonId(index)"
                    type="button"
                    :class="getButtonClasses(option, index)"
                    role="radio"
                    :aria-checked="isOptionSelected(option)"
                    :aria-disabled="disabled || readonly || option.disabled || undefined"
                    :data-disabled="disabled || option.disabled || undefined"
                    :disabled="disabled || option.disabled || undefined"
                    :data-testid="getButtonTestId(index)"
                    :tabindex="getButtonTabIndex(index)"
                    @click.prevent="handleClick(index)"
                    @keydown="handleKeydown($event, index)"
                  >
                    <span :class="`${classNameComponent}__button-label`">
                      {{ option.label }}
                    </span>
                  </button>

                  <template #description>
                    {{ getOptionHint(option) }}
                  </template>
                </InfoTooltip>

                <button
                  v-else
                  :id="getButtonId(index)"
                  type="button"
                  :class="getButtonClasses(option, index)"
                  role="radio"
                  :aria-checked="isOptionSelected(option)"
                  :aria-disabled="disabled || readonly || option.disabled || undefined"
                  :data-disabled="disabled || option.disabled || undefined"
                  :disabled="disabled || option.disabled || undefined"
                  :data-testid="getButtonTestId(index)"
                  :tabindex="getButtonTabIndex(index)"
                  @click.prevent="handleClick(index)"
                  @keydown="handleKeydown($event, index)"
                >
                  <span :class="`${classNameComponent}__button-label`">
                    {{ option.label }}
                  </span>
                </button>
              </div>
            </template>
          </div>
        </div>

        <InfoTooltip
          v-if="slots.additionalHint"
          placement="right"
          :class="`${classNameComponent}__additional-hint`"
          :data-test-id="additionalHintTestId"
        >
          <svg
            viewBox="0 0 14 14"
            :class="`${classNameComponent}__additional-hint-icon`"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.19334 8.86C6.16467 8.89168 6.13795 8.92507 6.11334 8.96C6.08811 8.99716 6.06793 9.03752 6.05334 9.08C6.03412 9.11779 6.02063 9.15824 6.01334 9.2C6.01006 9.24438 6.01006 9.28895 6.01334 9.33333C6.01108 9.42078 6.02935 9.50755 6.06667 9.58667C6.09661 9.6694 6.14438 9.74453 6.20659 9.80674C6.26881 9.86896 6.34394 9.91673 6.42667 9.94667C6.50647 9.98194 6.59276 10.0002 6.68 10.0002C6.76725 10.0002 6.85354 9.98194 6.93334 9.94667C7.01607 9.91673 7.0912 9.86896 7.15341 9.80674C7.21563 9.74453 7.2634 9.6694 7.29334 9.58667C7.32294 9.50561 7.33653 9.41957 7.33334 9.33333C7.33384 9.2456 7.31703 9.15862 7.28385 9.0774C7.25067 8.99617 7.20179 8.92229 7.14 8.86C7.07803 8.79751 7.00429 8.74792 6.92305 8.71407C6.84181 8.68023 6.75468 8.6628 6.66667 8.6628C6.57866 8.6628 6.49153 8.68023 6.41029 8.71407C6.32905 8.74792 6.25531 8.79751 6.19334 8.86ZM6.66667 0C5.34813 0 4.0592 0.390993 2.96287 1.12354C1.86654 1.85608 1.01206 2.89727 0.507473 4.11544C0.00288856 5.33362 -0.129134 6.67406 0.128101 7.96727C0.385336 9.26048 1.02027 10.4484 1.95262 11.3807C2.88497 12.3131 4.07286 12.948 5.36607 13.2052C6.65927 13.4625 7.99972 13.3304 9.21789 12.8259C10.4361 12.3213 11.4773 11.4668 12.2098 10.3705C12.9423 9.27414 13.3333 7.98521 13.3333 6.66667C13.3333 5.79119 13.1609 4.92428 12.8259 4.11544C12.4908 3.30661 11.9998 2.57168 11.3807 1.95262C10.7617 1.33356 10.0267 0.842501 9.21789 0.50747C8.40906 0.172438 7.54215 0 6.66667 0ZM6.66667 12C5.61184 12 4.58069 11.6872 3.70363 11.1012C2.82657 10.5151 2.14298 9.68218 1.73931 8.70765C1.33564 7.73311 1.23003 6.66075 1.43582 5.62619C1.6416 4.59162 2.14955 3.64131 2.89543 2.89543C3.64131 2.14955 4.59162 1.6416 5.62619 1.43581C6.66075 1.23002 7.73311 1.33564 8.70765 1.73931C9.68219 2.14298 10.5151 2.82656 11.1012 3.70363C11.6872 4.58069 12 5.61183 12 6.66667C12 8.08115 11.4381 9.43771 10.4379 10.4379C9.43771 11.4381 8.08116 12 6.66667 12ZM6.66667 3.33333C6.31538 3.33311 5.97023 3.42541 5.66594 3.60096C5.36166 3.77651 5.10898 4.02911 4.93334 4.33333C4.8851 4.40921 4.85271 4.49406 4.83812 4.58278C4.82353 4.6715 4.82703 4.76226 4.84842 4.84959C4.86981 4.93692 4.90865 5.01902 4.96259 5.09096C5.01654 5.16289 5.08447 5.22317 5.16232 5.26816C5.24016 5.31316 5.3263 5.34194 5.41556 5.35279C5.50482 5.36363 5.59534 5.3563 5.68169 5.33125C5.76805 5.3062 5.84844 5.26394 5.91804 5.20701C5.98763 5.15009 6.04499 5.07967 6.08667 5C6.14541 4.89826 6.22998 4.81385 6.33183 4.75532C6.43369 4.69678 6.5492 4.6662 6.66667 4.66667C6.84348 4.66667 7.01305 4.7369 7.13807 4.86193C7.2631 4.98695 7.33334 5.15652 7.33334 5.33333C7.33334 5.51014 7.2631 5.67971 7.13807 5.80474C7.01305 5.92976 6.84348 6 6.66667 6C6.48986 6 6.32029 6.07024 6.19527 6.19526C6.07024 6.32029 6 6.48986 6 6.66667V7.33333C6 7.51014 6.07024 7.67971 6.19527 7.80474C6.32029 7.92976 6.48986 8 6.66667 8C6.84348 8 7.01305 7.92976 7.13807 7.80474C7.2631 7.67971 7.33334 7.51014 7.33334 7.33333V7.21333C7.77425 7.05335 8.14491 6.74348 8.38052 6.33791C8.61613 5.93234 8.7017 5.45686 8.62227 4.99459C8.54284 4.53233 8.30347 4.11268 7.946 3.80901C7.58853 3.50534 7.1357 3.33697 6.66667 3.33333Z"
            />
          </svg>

          <template #description>
            <slot name="additionalHint" />
          </template>
        </InfoTooltip>
      </div>
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
</template>
