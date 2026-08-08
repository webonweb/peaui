<script lang="ts">
import type {
  InlineEditActions,
  InlineEditActivation,
  InlineEditDisplay,
  InlineEditEditor,
  InlineEditOption,
  InlineEditSaveMode,
  InlineEditTabBehavior,
  InlineEditValidate,
} from './inline-edit.shared';

export interface InlineEditProps {
  /** Rodzaj wbudowanego edytora albo własna kontrolka ze slotu editor. */
  editor?: InlineEditEditor;
  /** Właściwości przekazywane do istniejącego komponentu formularza. */
  editorProps?: Record<string, unknown>;
  /** Dodatkowy sposób rozpoczęcia edycji; przycisk pozostaje zawsze dostępny. */
  activation?: InlineEditActivation;
  /** Widoczne przyciski, skróty klawiaturowe albo oba mechanizmy zapisu. */
  actions?: InlineEditActions;
  /** Układ dopasowany do tekstu lub zajmujący pełną szerokość. */
  display?: InlineEditDisplay;
  /** Zachowanie klawisza Tab podczas edycji. */
  tabBehavior?: InlineEditTabBehavior;
  /** Zapis lokalny albo asynchroniczny sterowany przez aplikację. */
  saveMode?: InlineEditSaveMode;
  /** Synchroniczna walidacja szkicu przed zapisem. */
  validate?: InlineEditValidate;
  /** Oczekiwanie na zewnętrzny zapis. */
  loading?: boolean;
  /** Błąd zwrócony przez zewnętrzny zapis. */
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  emptyText?: string;
  editAriaLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  dataTestId?: string;
}

export type {
  InlineEditActions,
  InlineEditActivation,
  InlineEditDisplay,
  InlineEditEditor,
  InlineEditInvalidDetail,
  InlineEditOption,
  InlineEditSaveDetail,
  InlineEditSaveMode,
  InlineEditSlotState,
  InlineEditTabBehavior,
  InlineEditValidate,
  InlineEditValidationResult,
  InlineEditValue,
} from './inline-edit.shared';
</script>

<script setup lang="ts">
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormInput from '@/components/form/FormInput/index.vue';
import FormNumber from '@/components/form/FormNumber/index.vue';
import FormSelect from '@/components/form/FormSelect/index.vue';
import FormTextarea from '@/components/form/FormTextarea/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, ref, useAttrs, useId, useSlots, watch, type StyleValue } from 'vue';

import {
  areInlineEditValuesEqual,
  resolveInlineEditDisplayValue,
  resolveInlineEditValidation,
  type InlineEditInvalidDetail,
  type InlineEditSaveDetail,
  type InlineEditValue,
} from './inline-edit.shared';

defineOptions({ inheritAttrs: false });

const {
  editor = 'text',
  editorProps = {},
  activation = 'button',
  actions = 'both',
  display = 'inline',
  tabBehavior = 'commit',
  saveMode = 'sync',
  validate,
  loading = false,
  error,
  disabled = false,
  readonly = false,
  emptyText = 'Brak wartości',
  editAriaLabel = 'Edytuj wartość',
  saveLabel = 'Zapisz',
  cancelLabel = 'Anuluj',
  loadingLabel = 'Zapisywanie zmian',
  dataTestId,
} = defineProps<InlineEditProps>();

const emit = defineEmits<{
  edit: [value: InlineEditValue];
  save: [detail: InlineEditSaveDetail];
  cancel: [value: InlineEditValue];
  invalid: [detail: InlineEditInvalidDetail];
  draftChange: [value: InlineEditValue];
}>();

const valueModel = defineModel<InlineEditValue>('value', { required: true });
const editingModel = defineModel<boolean>('editing', { default: false });

const attrs = useAttrs();
const slots = useSlots();
const generatedId = useId().replaceAll(':', '');
const root = `${UIKIT_NAME}-inline-edit`;
const editorId = `${root}-${generatedId}-editor`;
const instructionsId = `${editorId}-instructions`;
const errorId = `${editorId}-error`;
const statusId = `${editorId}-status`;
const triggerReference = ref<HTMLElement | { $el?: HTMLElement }>();
const editorReference = ref<HTMLElement>();
const draft = ref<InlineEditValue>(valueModel.value);
const validationError = ref<string>();

const options = computed<InlineEditOption[]>(() =>
  Array.isArray(editorProps.options) ? (editorProps.options as InlineEditOption[]) : [],
);
const selectOptions = computed(() =>
  options.value.map((option) => ({ ...option, value: String(option.value ?? '') })),
);
const activeError = computed(() => validationError.value ?? error?.trim() ?? undefined);
const isDirty = computed(() => !areInlineEditValuesEqual(draft.value, valueModel.value));
const isBlocked = computed(() => disabled || readonly || loading);
const showActionButtons = computed(() => actions === 'buttons' || actions === 'both');
const displayValue = computed(() =>
  resolveInlineEditDisplayValue(valueModel.value, editor, options.value),
);
const rootClasses = computed(() => [
  root,
  `${root}--${display}`,
  `${root}--activation-${activation}`,
  editingModel.value && `${root}--editing`,
  isDirty.value && `${root}--dirty`,
  activeError.value && `${root}--invalid`,
  loading && `${root}--loading`,
  disabled && `${root}--disabled`,
  readonly && `${root}--readonly`,
  attrs.class,
]);
const describedBy = computed(() =>
  activeError.value ? `${instructionsId} ${errorId}` : instructionsId,
);
const editorBindings = computed(() => ({
  ...editorProps,
  'aria-describedby': describedBy.value,
  'aria-invalid': activeError.value ? 'true' : undefined,
  'aria-label': editAriaLabel,
  'data-inline-edit-control': '',
  ...(editor === 'number'
    ? {
        onInput: (event: Event) => {
          const rawValue = (event.target as HTMLInputElement).value;
          updateDraft(rawValue === '' ? undefined : Number(rawValue));
        },
      }
    : {}),
}));
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue);

watch(
  () => valueModel.value,
  (value) => {
    if (!editingModel.value) draft.value = value;
  },
);

watch(
  () => editingModel.value,
  async (editing, previous) => {
    if (editing) {
      if (!previous) {
        draft.value = valueModel.value;
        validationError.value = undefined;
      }
      await nextTick();
      focusEditor();
      return;
    }

    if (previous) {
      validationError.value = undefined;
      await nextTick();
      const trigger =
        triggerReference.value instanceof HTMLElement
          ? triggerReference.value
          : triggerReference.value?.$el;
      (trigger?.matches('button')
        ? trigger
        : trigger?.querySelector<HTMLElement>('button')
      )?.focus();
    }
  },
  { immediate: true },
);

function focusEditor(): void {
  const host = editorReference.value;
  const control = host?.querySelector<HTMLElement>(
    'input:not([disabled]), textarea:not([disabled]), [role="combobox"], [data-inline-edit-control]:not(.peaui-form-field), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  control?.focus();
}

function startEditing(): void {
  if (isBlocked.value || editingModel.value) return;
  draft.value = valueModel.value;
  validationError.value = undefined;
  editingModel.value = true;
  emit('edit', valueModel.value);
}

function updateDraft(value: InlineEditValue): void {
  if (loading) return;
  draft.value = value;
  validationError.value = undefined;
  emit('draftChange', value);
}

function save(): void {
  if (isBlocked.value) return;
  const message = resolveInlineEditValidation(validate, draft.value);
  if (message) {
    validationError.value = message;
    emit('invalid', { message, previousValue: valueModel.value, value: draft.value });
    void nextTick(focusEditor);
    return;
  }

  const detail = { previousValue: valueModel.value, value: draft.value };
  emit('save', detail);
  if (saveMode === 'async') return;

  valueModel.value = draft.value;
  editingModel.value = false;
}

function cancel(): void {
  if (loading) return;
  draft.value = valueModel.value;
  validationError.value = undefined;
  emit('cancel', valueModel.value);
  editingModel.value = false;
}

function handleDisplayClick(): void {
  if (activation === 'click') startEditing();
}

function handleDisplayDoubleClick(): void {
  if (activation === 'dblclick') startEditing();
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (event.key !== 'F2') return;
  event.preventDefault();
  startEditing();
}

function handleEditorKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    cancel();
    return;
  }

  if (event.key === 'Tab') {
    if (tabBehavior === 'stay') {
      event.preventDefault();
      return;
    }
    if (tabBehavior === 'commit') save();
    else cancel();
    return;
  }

  if (actions === 'buttons') return;
  const requestsSave =
    editor === 'textarea'
      ? event.key === 'Enter' && (event.ctrlKey || event.metaKey)
      : event.key === 'Enter' && !event.shiftKey;
  if (!requestsSave) return;
  event.preventDefault();
  save();
}
</script>

<template>
  <div
    v-bind="attrs"
    :aria-busy="loading || undefined"
    :aria-disabled="disabled || undefined"
    :class="rootClasses"
    :data-state="
      loading
        ? 'saving'
        : activeError
          ? 'invalid'
          : editingModel
            ? isDirty
              ? 'editing-dirty'
              : 'editing-clean'
            : 'display'
    "
    :data-testid="dataTestId"
    :style="rootStyle"
  >
    <template v-if="!editingModel">
      <span
        :class="`${root}__display`"
        :data-activatable="activation !== 'button' || undefined"
        @click="handleDisplayClick"
        @dblclick="handleDisplayDoubleClick"
      >
        <slot v-if="displayValue" name="display" :value="valueModel">
          <span :class="`${root}__value`">{{ displayValue }}</span>
        </slot>
        <slot v-else name="empty">
          <span :class="`${root}__empty`">{{ emptyText }}</span>
        </slot>
      </span>

      <ButtonAction
        v-if="!readonly"
        ref="triggerReference"
        :aria-label="editAriaLabel"
        :class="`${root}__edit-button`"
        :data-test-id="dataTestId ? `${dataTestId}-edit` : undefined"
        :disabled="disabled"
        size="xs"
        use-aria-label
        variant="ghost"
        @click="startEditing"
        @keydown="handleTriggerKeydown"
      >
        <SvgIcon aria-hidden="true" name="edit" :class="`${root}__button-icon`" />
        <span>{{ editAriaLabel }}</span>
      </ButtonAction>
    </template>

    <div v-else ref="editorReference" :class="`${root}__editing`" @keydown="handleEditorKeydown">
      <div :class="`${root}__editor`">
        <FormInput
          v-if="editor === 'text'"
          v-bind="editorBindings"
          :id="editorId"
          :data-test-id="dataTestId ? `${dataTestId}-editor` : undefined"
          :disabled="disabled || loading"
          :name="editorId"
          :readonly="readonly"
          :value="typeof draft === 'string' ? draft : `${draft ?? ''}`"
          @update:value="updateDraft"
        />

        <FormNumber
          v-else-if="editor === 'number'"
          v-bind="editorBindings"
          :id="editorId"
          :data-test-id="dataTestId ? `${dataTestId}-editor` : undefined"
          :disabled="disabled || loading"
          :is-range-visible="editorProps.isRangeVisible === true"
          :name="editorId"
          :readonly="readonly"
          :value="draft as number | string | undefined"
          @update:value="updateDraft"
        />

        <FormSelect
          v-else-if="editor === 'select'"
          v-bind="editorBindings"
          :id="editorId"
          :data-test-id="dataTestId ? `${dataTestId}-editor` : undefined"
          :disabled="disabled || loading"
          :name="editorId"
          :options="selectOptions"
          :readonly="readonly"
          :value="draft"
          @update:value="updateDraft"
        />

        <FormTextarea
          v-else-if="editor === 'textarea'"
          v-bind="editorBindings"
          :id="editorId"
          :data-test-id="dataTestId ? `${dataTestId}-editor` : undefined"
          :disabled="disabled || loading"
          :name="editorId"
          :readonly="readonly"
          :value="typeof draft === 'string' ? draft : `${draft ?? ''}`"
          @update:value="updateDraft"
        />

        <slot
          v-else
          name="editor"
          :draft="draft"
          :error="activeError"
          :loading="loading"
          :update-draft="updateDraft"
        />

        <MessageText
          v-if="activeError"
          :id="editorId"
          :class="`${root}__error`"
          role="alert"
          size="xs"
          variant="error"
        >
          <slot name="error">{{ activeError }}</slot>
        </MessageText>
      </div>

      <div v-if="showActionButtons" :class="`${root}__actions`">
        <slot name="actions" :cancel="cancel" :save="save">
          <ButtonAction
            :class="`${root}__action`"
            :data-test-id="dataTestId ? `${dataTestId}-save` : undefined"
            :disabled="isBlocked || !isDirty"
            size="xs"
            variant="primary"
            @click="save"
          >
            {{ loading ? loadingLabel : saveLabel }}
          </ButtonAction>
          <ButtonAction
            :class="`${root}__action`"
            :data-test-id="dataTestId ? `${dataTestId}-cancel` : undefined"
            :disabled="loading"
            size="xs"
            variant="secondary"
            @click="cancel"
          >
            {{ cancelLabel }}
          </ButtonAction>
        </slot>
      </div>
    </div>

    <span :id="instructionsId" :class="`${root}__sr-only`">
      Escape anuluje edycję.
      {{
        editor === 'textarea'
          ? 'Control lub Command z Enter zapisuje zmianę.'
          : 'Enter zapisuje zmianę.'
      }}
    </span>
    <span
      v-if="loading"
      :id="statusId"
      :class="`${root}__sr-only`"
      aria-live="polite"
      role="status"
    >
      {{ loadingLabel }}
    </span>
  </div>
</template>
