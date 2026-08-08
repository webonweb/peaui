<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, onUpdated, ref, useAttrs, useSlots } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import FormFieldLabel from '@/components/form/FormFieldLabel/index.vue';
import { getFormFieldEraseOffset, getFormFieldPaddingRight } from './form-field-layout.shared';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  after,
  before,
  canErase,
  disabled,
  iconAfter,
  iconBefore,
  id,
  label,
  maxLength,
  name,
  placeholder,
  readonly,
  required,
  value,
  dataTestId,
  rightErasePosition,
} = defineProps<{
  after?: string;
  before?: string;
  canErase?: boolean;
  disabled?: boolean;
  iconAfter?: string;
  iconBefore?: string;
  id: string;
  label?: string;
  maxLength?: number;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  dataTestId?: string;
  rightErasePosition?: number;
  value?: string | number | string[] | null;
}>();

const attrs = useAttrs();
const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-form-field`;

const hasErrorSlot = ref(Boolean(slots.error));
const hasDescriptionSlot = ref(Boolean(slots.description));
const hasSuccessSlot = ref(Boolean(slots.success));

function syncSlotPresence(): void {
  hasErrorSlot.value = Boolean(slots.error);
  hasDescriptionSlot.value = Boolean(slots.description);
  hasSuccessSlot.value = Boolean(slots.success);
}

onUpdated(syncSlotPresence);

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const baseClass = `${classNameComponent}__element`;

const fieldClasses = computed<string>(() => {
  const map: Record<string, boolean> = {
    [`${classNameComponent}__element--medium`]: value !== '',
    [`${classNameComponent}__element--normal`]: value === '',
    [`${classNameComponent}__element--disabled`]: disabled,
    [`${classNameComponent}__element--readonly`]: readonly,
    [`${classNameComponent}__element--basic`]: !readonly,
    [`${classNameComponent}__element--error`]:
      hasErrorSlot.value || getNormalizedAttributeValue(attrs['aria-invalid']) === 'true',
    [`${classNameComponent}__element--success`]: hasSuccessSlot.value,
  };

  return Object.entries(map)
    .filter(([, active]) => active)
    .map(([cls]) => cls)
    .join(' ');
});

const descriptionMessageId = computed(() => `${id}-help-description`);
const maxLengthMessageId = computed(() => `${id}-help-max-length-description`);
const errorMessageId = computed(() => `${id}-error`);
const successMessageId = computed(() => `${id}-success`);
const hasAdditionalSlot = computed(() => Boolean(slots.additional));
const eraseButtonRight = computed(() =>
  getFormFieldEraseOffset({
    after,
    hasAdditional: hasAdditionalSlot.value,
    iconAfter,
    minimumEraseOffset: rightErasePosition,
  }),
);
const paddingRight = computed(() =>
  getFormFieldPaddingRight({
    after,
    canErase,
    hasAdditional: hasAdditionalSlot.value,
    iconAfter,
    minimumEraseOffset: rightErasePosition,
  }),
);
const explicitAriaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const explicitAriaLabelledBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-labelledby']),
);
const explicitAriaDescribedBy = computed(() =>
  getNormalizedAttributeValue(attrs['aria-describedby']),
);
const explicitAriaInvalid = computed(() => getNormalizedAttributeValue(attrs['aria-invalid']));
const fieldAriaLabel = computed(
  () => explicitAriaLabel.value ?? (!label && !explicitAriaLabelledBy.value ? name : undefined),
);
const fieldAriaLabelledBy = computed(() => (label ? undefined : explicitAriaLabelledBy.value));
const generatedDescriptionId = computed(() => {
  if (hasErrorSlot.value && !hasSuccessSlot.value) {
    return errorMessageId.value;
  }

  if (hasSuccessSlot.value && !hasErrorSlot.value) {
    return successMessageId.value;
  }

  if (maxLength) {
    return maxLengthMessageId.value;
  }

  if (hasDescriptionSlot.value) {
    return descriptionMessageId.value;
  }

  return undefined;
});

const describeComponent = computed(() => {
  const ids = new Set(
    `${explicitAriaDescribedBy.value ?? ''} ${generatedDescriptionId.value ?? ''}`
      .split(/\s+/)
      .filter(Boolean),
  );

  return ids.size ? [...ids].join(' ') : undefined;
});

const bindings = computed(() => {
  const bindings: Record<string, unknown> = {
    'aria-disabled': disabled,
    'data-disabled': disabled,
    'aria-invalid': hasErrorSlot.value || explicitAriaInvalid.value === 'true',
    'aria-label': fieldAriaLabel.value,
    'aria-labelledby': fieldAriaLabelledBy.value,
    'aria-required': required || false,
    id,
    name,
    readonly,
    disabled: disabled === true ? true : undefined,
    value,
  };

  if (maxLength) bindings.maxLength = maxLength;

  if (placeholder) {
    bindings.placeholder = placeholder;
  }

  bindings.style = `--pr:${paddingRight.value}px;`;

  if (before) {
    bindings.style = `${bindings.style} --pl:${iconBefore ? before.length * 7.5 + 14 + 24 : before.length * 7.5 + 14}px;`;
  } else {
    bindings.style = `${bindings.style} --pl:${iconBefore ? '32px' : '12px'};`;
  }

  if (describeComponent.value) {
    bindings['aria-describedby'] = describeComponent.value;
  }

  bindings.class = `${attrs.class ? attrs.class : ''}  ${baseClass} ${fieldClasses.value}`;

  return bindings;
});

const isEraseButtonVisible = computed(() => {
  if (typeof value === 'object') {
    return canErase && Array.isArray(value) && value.length > 0 && !disabled;
  }

  return canErase && value !== undefined && value !== '' && !disabled;
});

const descriptionTestId = computed(() =>
  dataTestId ? `${dataTestId}-help-description` : undefined,
);
const errorTestId = computed(() => (dataTestId ? `${dataTestId}-error` : undefined));
const successTestId = computed(() => (dataTestId ? `${dataTestId}-success` : undefined));
const descriptionMaxLengthTestId = computed(() =>
  dataTestId ? `${dataTestId}-help-max-length-description` : undefined,
);
const eraseButtonTestId = computed(() => (dataTestId ? `${dataTestId}-erase-button` : undefined));

function getNormalizedAttributeValue(value: unknown): string | undefined {
  const normalizedValue = `${value ?? ''}`.trim();

  return normalizedValue ? normalizedValue : undefined;
}
</script>

<template>
  <div :class="classNameComponent" :data-testid="dataTestId">
    <FormFieldLabel v-if="label" :for="id" :required :text="label" :data-test-id="dataTestId">
      <template v-if="slots.hint" #hint>
        <slot name="hint" />
      </template>
    </FormFieldLabel>

    <div :class="`${classNameComponent}__content`">
      <SvgIcon
        v-if="iconBefore"
        :name="iconBefore"
        :class="`${classNameComponent}__icon ${classNameComponent}__icon--before`"
      />
      <SvgIcon
        v-if="iconAfter"
        :name="iconAfter"
        :class="`${classNameComponent}__icon ${classNameComponent}__icon--after`"
      />

      <slot name="additional" />
      <slot :props="bindings" />

      <span
        v-if="before"
        :class="`${classNameComponent}__additional ${classNameComponent}__additional--before`"
        :data-before="before"
        :style="{ paddingLeft: iconBefore ? '2rem' : '0.75rem' }"
      />
      <span
        v-if="after"
        :class="`${classNameComponent}__additional ${classNameComponent}__additional--after`"
        :data-after="after"
        :style="{ paddingRight: iconAfter ? '2rem' : '0.75rem' }"
      />

      <button
        v-if="isEraseButtonVisible"
        type="button"
        :class="`${classNameComponent}__erase-button`"
        :data-testid="eraseButtonTestId"
        aria-label="Usuń wartość pola"
        :style="{ '--right': `${eraseButtonRight}px` }"
        @click.prevent.stop="emit('on:remove')"
      >
        <SvgIcon name="cross" :class="`${classNameComponent}__erase-icon`" />
      </button>
    </div>

    <MessageText
      v-if="hasDescriptionSlot && !hasErrorSlot && !hasSuccessSlot && !maxLength"
      :class="`${classNameComponent}__message`"
      :id="descriptionMessageId"
      :data-test-id="descriptionTestId"
      size="xs"
    >
      <slot name="description" />
    </MessageText>

    <MessageText
      v-if="!hasErrorSlot && !hasSuccessSlot && maxLength"
      :class="`${classNameComponent}__message`"
      :variant="maxLength === (typeof value === 'string' ? value.length : 0) ? 'info' : 'default'"
      :id="maxLengthMessageId"
      :data-test-id="descriptionMaxLengthTestId"
      size="xs"
    >
      Długość tekstu: {{ typeof value === 'string' ? value.length : 0 }} / {{ maxLength }} znaków
    </MessageText>

    <MessageText
      v-if="hasErrorSlot && !hasSuccessSlot"
      :class="`${classNameComponent}__message`"
      variant="error"
      :id="errorMessageId"
      :data-test-id="errorTestId"
      size="xs"
    >
      <slot name="error" />
    </MessageText>

    <MessageText
      v-if="hasSuccessSlot && !hasErrorSlot"
      :class="`${classNameComponent}__message`"
      variant="success"
      :id="successMessageId"
      :data-test-id="successTestId"
      size="xs"
    >
      <slot name="success" />
    </MessageText>
  </div>
</template>
