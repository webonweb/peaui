<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, ref, useAttrs, useSlots, watchEffect } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { copyToClipboard } from '@/helpers/functions.helper';
import { PASSWORD_STRENGTH_SEGMENTS, evaluatePasswordStrength } from './strength.helper';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  canCopy = true,
  canVisible = true,
  disabled,
  readonly,
  id,
  name,
  required,
  label,
  before,
  iconBefore,
  maxLength,
  placeholder = 'wpisz',
  dataTestId,
  showPasswordAriaLabel = 'Pokaz haslo',
  hidePasswordAriaLabel = 'Ukryj haslo',
  copyPasswordAriaLabel = 'Kopiuj haslo',
  copySuccessMessage = 'Haslo skopiowano do schowka.',
  copyErrorMessage = 'Nie udalo sie skopiowac hasla.',
  enablePasswordStrengthMeter = false,
} = defineProps<{
  id: string;
  before?: string;
  name: string;
  label?: string;
  iconBefore?: string;
  maxLength?: number;
  canCopy?: boolean;
  canVisible?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
  copyPasswordAriaLabel?: string;
  copySuccessMessage?: string;
  copyErrorMessage?: string;
  enablePasswordStrengthMeter?: boolean;
}>();

const slots = useSlots();
const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-form-field-password`;
const modelValue = defineModel<string | undefined>('value', {
  required: true,
});

const inputElement = ref<HTMLInputElement | null>(null);
const isPasswordVisible = ref(false);
const copyStatusMessage = ref('');

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const actionsCount = computed(() => Number(canCopy) + Number(canVisible));
const inputActionsPaddingRight = computed(() => {
  if (actionsCount.value === 2) {
    return '5.75rem';
  }

  if (actionsCount.value === 1) {
    return '2.875rem';
  }

  return undefined;
});
const isActionsVisible = computed(() => actionsCount.value > 0);
const normalizedValue = computed(() => modelValue.value ?? '');
const inputType = computed(() => (canVisible && isPasswordVisible.value ? 'text' : 'password'));
const inputBindings = computed<Record<string, unknown>>(() => ({
  ...attrs,
}));
const passwordStrength = computed(() => evaluatePasswordStrength(normalizedValue.value));
const togglePasswordAriaLabel = computed(() =>
  isPasswordVisible.value ? hidePasswordAriaLabel : showPasswordAriaLabel,
);
const isToggleDisabled = computed(() => disabled || !canVisible);
const isCopyDisabled = computed(() => disabled || !canCopy || normalizedValue.value === '');
const strengthMeterStatusId = computed(() => `${id}-strength-status`);
const hasSupportingMessage = computed(() =>
  Boolean(slots.description || slots.error || slots.success || maxLength),
);

const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const toggleButtonTestId = computed(() => (dataTestId ? `${dataTestId}-toggle-button` : undefined));
const copyButtonTestId = computed(() => (dataTestId ? `${dataTestId}-copy-button` : undefined));
const copyStatusTestId = computed(() => (dataTestId ? `${dataTestId}-copy-status` : undefined));
const strengthMeterTestId = computed(() =>
  dataTestId ? `${dataTestId}-strength-meter` : undefined,
);
const strengthLabelTestId = computed(() =>
  dataTestId ? `${dataTestId}-strength-label` : undefined,
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function mergeDescribedByIds(...values: unknown[]): string | undefined {
  const normalizedIds = values
    .flatMap((value) => `${value ?? ''}`.split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);

  if (normalizedIds.length === 0) {
    return undefined;
  }

  return Array.from(new Set(normalizedIds)).join(' ');
}

function getInputBindings(fieldProps: Record<string, unknown>): Record<string, unknown> {
  const describedBy = mergeDescribedByIds(
    fieldProps['aria-describedby'],
    enablePasswordStrengthMeter ? strengthMeterStatusId.value : undefined,
  );

  return {
    ...inputBindings.value,
    ...fieldProps,
    'aria-describedby': describedBy,
    type: inputType.value,
    style: [
      inputBindings.value.style,
      fieldProps.style,
      inputActionsPaddingRight.value ? `--pr: ${inputActionsPaddingRight.value};` : undefined,
    ],
  };
}

function togglePasswordVisibility(): void {
  if (isToggleDisabled.value) {
    return;
  }

  isPasswordVisible.value = !isPasswordVisible.value;
}

async function announceCopyResult(message: string): Promise<void> {
  copyStatusMessage.value = '';
  await nextTick();
  copyStatusMessage.value = message;
}

async function handleCopyPassword(): Promise<void> {
  if (isCopyDisabled.value) {
    return;
  }

  try {
    await copyToClipboard(normalizedValue.value);
    await announceCopyResult(copySuccessMessage);
  } catch {
    await announceCopyResult(copyErrorMessage);
  }
}

watchEffect(() => {
  if (!inputElement.value) {
    return;
  }

  inputElement.value.setCustomValidity(
    enablePasswordStrengthMeter ? passwordStrength.value.validationMessage : '',
  );
});
</script>

<template>
  <div :class="`${classNameComponent}__wrapper`">
    <FormField
      :before
      :disabled
      :iconBefore
      :id
      :label
      :maxLength
      :name
      :placeholder
      :readonly
      :required
      :value="modelValue"
      :data-test-id="dataTestId"
    >
      <template v-if="slots.hint" #hint>
        <slot name="hint" />
      </template>

      <template v-if="isActionsVisible" #additional>
        <div
          :class="`${classNameComponent}__actions`"
          :data-disabled="disabled || undefined"
          :data-readonly="readonly || undefined"
        >
          <button
            v-if="canVisible"
            type="button"
            :class="[
              `${classNameComponent}__button`,
              `${classNameComponent}__button--toggle`,
              isPasswordVisible && `${classNameComponent}__button--active`,
            ]"
            :aria-controls="id"
            :aria-label="togglePasswordAriaLabel"
            :aria-pressed="isPasswordVisible"
            :data-testid="toggleButtonTestId"
            :disabled="isToggleDisabled"
            @click.prevent.stop="togglePasswordVisibility"
          >
            <SvgIcon name="eye" :class="`${classNameComponent}__icon`" />
          </button>

          <button
            v-if="canCopy"
            type="button"
            :class="`${classNameComponent}__button`"
            :aria-label="copyPasswordAriaLabel"
            :data-testid="copyButtonTestId"
            :disabled="isCopyDisabled"
            @click.prevent.stop="handleCopyPassword"
          >
            <SvgIcon name="copy" :class="`${classNameComponent}__icon`" />
          </button>

          <span
            v-if="canCopy"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            :class="`${classNameComponent}__status`"
            :data-testid="copyStatusTestId"
          >
            {{ copyStatusMessage }}
          </span>
        </div>
      </template>

      <template #default="{ props }">
        <input
          ref="inputElement"
          v-bind="getInputBindings(props)"
          :class="classNameComponent"
          @input.stop.prevent="(event) => (modelValue = (event.target as HTMLInputElement).value)"
          data-type="password"
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

    <div
      v-if="enablePasswordStrengthMeter"
      :class="`${classNameComponent}__strength`"
      :data-has-supporting-message="hasSupportingMessage || undefined"
      :data-testid="strengthMeterTestId"
      :data-tone="passwordStrength.tone"
    >
      <span :class="`${classNameComponent}__strength-bar`" aria-hidden="true">
        <span
          v-for="segmentIndex in PASSWORD_STRENGTH_SEGMENTS"
          :key="segmentIndex"
          :class="`${classNameComponent}__strength-segment`"
          :data-active="segmentIndex <= passwordStrength.activeSegments || undefined"
        />
      </span>

      <span :class="`${classNameComponent}__strength-label`" :data-testid="strengthLabelTestId">
        {{ passwordStrength.label }}
      </span>

      <span
        :id="strengthMeterStatusId"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :class="`${classNameComponent}__status`"
      >
        {{ passwordStrength.assistiveText }}
      </span>
    </div>
  </div>
</template>
