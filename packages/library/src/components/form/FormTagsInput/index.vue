<script lang="ts">
import type {
  FormTagsInputInvalidDetail,
  FormTagsInputKeyGetter,
  FormTagsInputLayout,
  FormTagsInputMode,
  FormTagsInputNormalizer,
  FormTagsInputPlacement,
  FormTagsInputSerializer,
  FormTagsInputSuggestionProvider,
  FormTagsInputTag,
  FormTagsInputValidator,
} from './tags-input.shared';

export interface FormTagsInputProps {
  /** Unikalny identyfikator pola. */
  id?: string;
  /** Nazwa używana przez natywny formularz; każdy tag tworzy osobną wartość. */
  name?: string;
  /** Identyfikator formularza właściciela. */
  form?: string;
  /** Widoczna etykieta pola. */
  label?: string;
  /** Tekst pomocniczy powiązany z polem. */
  description?: string;
  /** Komunikat błędu powiązany przez aria-describedby. */
  error?: string;
  /** Placeholder edytora. */
  placeholder?: string;
  /** Dostępna nazwa, gdy nie podano widocznej etykiety. */
  ariaLabel?: string;
  /** Układ tagów i edytora. */
  layout?: FormTagsInputLayout;
  /** Tryb swobodny albo ograniczony do sugestii. */
  mode?: FormTagsInputMode;
  /** Pozwala utworzyć tag spoza listy sugestii. */
  allowCreate?: boolean;
  /** Pozwala dodać tag o tym samym kluczu więcej niż raz. */
  allowDuplicates?: boolean;
  /** Maksymalna liczba tagów. */
  max?: number;
  /** Separatory używane podczas wpisywania i wklejania. */
  separators?: readonly string[];
  /** Kontrolowana lista sugestii. */
  suggestions?: readonly FormTagsInputTag[];
  /** Opcjonalny dostawca sugestii z anulowaniem nieaktualnych zapytań. */
  suggestionProvider?: FormTagsInputSuggestionProvider;
  /** Zewnętrzny stan ładowania sugestii. */
  loading?: boolean;
  /** Położenie panelu sugestii. */
  placement?: FormTagsInputPlacement;
  /** Normalizuje tekst przed walidacją. */
  normalizeTag?: FormTagsInputNormalizer;
  /** Waliduje pojedynczy tag przed zmianą modelu. */
  validateTag?: FormTagsInputValidator;
  /** Wyznacza stabilny klucz i regułę duplikatów. */
  getTagKey?: FormTagsInputKeyGetter;
  /** Serializuje wartości do natywnych pól formularza. */
  serializeTag?: FormTagsInputSerializer;
  /** Klucze lub etykiety tagów, których nie można edytować ani usunąć. */
  disabledTags?: readonly (string | number)[];
  /** Wyłącza całą kontrolkę. */
  disabled?: boolean;
  /** Pozwala odczytać i kopiować zawartość bez jej zmiany. */
  readonly?: boolean;
  /** Oznacza pole jako wymagane. */
  required?: boolean;
  /** Tekst prezentowany podczas ładowania sugestii. */
  loadingLabel?: string;
  /** Tekst pustego wyniku wyszukiwania. */
  emptyLabel?: string;
  /** Stabilny identyfikator używany w testach. */
  dataTestId?: string;
}

export type {
  FormTagsInputCommitOptions,
  FormTagsInputCommitResult,
  FormTagsInputInvalidDetail,
  FormTagsInputInvalidReason,
  FormTagsInputItem,
  FormTagsInputKeyGetter,
  FormTagsInputLayout,
  FormTagsInputMode,
  FormTagsInputNormalizer,
  FormTagsInputPlacement,
  FormTagsInputSerializer,
  FormTagsInputSuggestionProvider,
  FormTagsInputTag,
  FormTagsInputValidator,
} from './tags-input.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { useSlotPresence } from '@/composables/useSlotPresence';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
  type CSSProperties,
} from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormFieldLabel from '@/components/form/FormFieldLabel/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import {
  createTagsInputMatcher,
  commitTagsInput,
  getTagsInputKey,
  getTagsInputLabel,
  isTagsInputItemDisabled,
  normalizeTagsInputMax,
  parseTagsInput,
  serializeTagsInputTag,
  type FormTagsInputCommitOptions,
} from './tags-input.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormTagsInputProps>(), {
  label: '',
  description: '',
  error: '',
  placeholder: 'Dodaj tag',
  ariaLabel: '',
  layout: 'inline',
  mode: 'freeform',
  allowCreate: true,
  allowDuplicates: false,
  separators: () => [',', ';', '\n'],
  suggestions: () => [],
  loading: false,
  placement: 'auto',
  disabledTags: () => [],
  disabled: false,
  readonly: false,
  required: false,
  loadingLabel: 'Ładowanie sugestii',
  emptyLabel: 'Brak pasujących sugestii',
});

const value = defineModel<FormTagsInputTag[]>('value', { default: () => [] });
const inputValue = defineModel<string>('inputValue', { default: '' });

const emit = defineEmits<{
  /** Emitowane po dodaniu zaakceptowanego tagu. */
  (event: 'add', tag: FormTagsInputTag, index: number, nativeEvent: Event): void;
  /** Emitowane po usunięciu tagu. */
  (event: 'remove', tag: FormTagsInputTag, index: number, nativeEvent: Event): void;
  /** Emitowane po zatwierdzeniu edycji tagu. */
  (
    event: 'edit',
    previous: FormTagsInputTag,
    next: FormTagsInputTag,
    index: number,
    nativeEvent: Event,
  ): void;
  /** Emitowane dla każdej odrzuconej wartości. */
  (event: 'invalidTag', detail: FormTagsInputInvalidDetail, nativeEvent: Event): void;
  /** Emitowane przy zmianie tekstu wyszukiwania. */
  (event: 'search', query: string, requestId: number): void;
  /** Emitowane, gdy próba dodania przekracza limit. */
  (event: 'maxReached', max: number, nativeEvent: Event): void;
}>();

defineSlots<{
  label?(props: { count: number }): unknown;
  hint?(props: { count: number; max?: number }): unknown;
  tag?(props: {
    tag: FormTagsInputTag;
    index: number;
    selected: boolean;
    editing: boolean;
    disabled: boolean;
  }): unknown;
  'tag-content'?(props: { tag: FormTagsInputTag; index: number }): unknown;
  suggestion?(props: { suggestion: FormTagsInputTag; index: number; active: boolean }): unknown;
  'empty-suggestions'?(props: { query: string }): unknown;
  loading?(): unknown;
  prefix?(): unknown;
  suffix?(): unknown;
  description?(): unknown;
  error?(): unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();
const labelSlot = useSlotPresence('label');
const descriptionSlot = useSlotPresence('description');
const errorSlot = useSlotPresence('error');
const classNameComponent = `${UIKIT_NAME}-form-tags-input`;
const generatedId = useId();
const resolvedId = computed(() => props.id?.trim() || `${classNameComponent}-${generatedId}`);
const inputId = computed(() => `${resolvedId.value}-input`);
const labelId = computed(() => `label-${inputId.value}`);
const descriptionId = computed(() => `${resolvedId.value}-description`);
const errorId = computed(() => `${resolvedId.value}-error`);
const listboxId = computed(() => `${resolvedId.value}-suggestions`);
const liveId = computed(() => `${resolvedId.value}-status`);
const rootRef = ref<HTMLElement>();
const controlRef = ref<HTMLElement>();
const popoverReference = ref<{
  hidePopover: () => void;
  refreshPopoverPosition: () => void;
  showPopover: () => void;
}>();
const inputRef = ref<HTMLInputElement>();
const tagButtonRefs = ref<Array<HTMLButtonElement | undefined>>([]);
const focused = ref(false);
const panelOpen = ref(false);
const activeSuggestionIndex = ref(-1);
const selectedTagIndex = ref(-1);
const editingTagIndex = ref(-1);
const internalSuggestions = ref<readonly FormTagsInputTag[]>([]);
const internalLoading = ref(false);
const resolvedPlacement = ref<'top' | 'bottom'>('bottom');
const announcement = ref('');
let suggestionRequestId = 0;
let suggestionAbortController: AbortController | undefined;

const tags = computed(() => (Array.isArray(value.value) ? value.value : []));
const normalizedMax = computed(() => normalizeTagsInputMax(props.max));
const atMax = computed(() => tags.value.length >= normalizedMax.value);
const effectiveAllowCreate = computed(() => props.mode === 'freeform' && props.allowCreate);
const hasSuggestionSource = computed(
  () =>
    Boolean(props.suggestionProvider) ||
    props.suggestions.length > 0 ||
    props.mode === 'suggestions-only',
);
const effectiveLoading = computed(() => props.loading || internalLoading.value);
const sourceSuggestions = computed(() =>
  props.suggestionProvider ? internalSuggestions.value : props.suggestions,
);
const matchesSelectedTag = computed(() => createTagsInputMatcher(tags.value, props.getTagKey));
const filteredSuggestions = computed(() => {
  const query = inputValue.value.trim().toLocaleLowerCase();
  return sourceSuggestions.value.filter((suggestion) => {
    if (!props.allowDuplicates && matchesSelectedTag.value(suggestion)) {
      return false;
    }
    return !query || getTagsInputLabel(suggestion).toLocaleLowerCase().includes(query);
  });
});
const showPanel = computed(() => panelOpen.value && hasSuggestionSource.value);
const hasLabel = computed(() => Boolean(labelSlot.value || props.label.trim()));
const hasDescription = computed(() => Boolean(descriptionSlot.value || props.description.trim()));
const hasError = computed(() => Boolean(errorSlot.value || props.error.trim()));
const blocked = computed(() => props.disabled || props.loading);
const activeSuggestionId = computed(() =>
  activeSuggestionIndex.value >= 0
    ? `${resolvedId.value}-suggestion-${activeSuggestionIndex.value}`
    : undefined,
);
const describedBy = computed(() => {
  const ids = new Set(
    `${attrs['aria-describedby'] ?? ''}`
      .split(/\s+/)
      .map((id) => id.trim())
      .filter(Boolean),
  );
  if (hasDescription.value) ids.add(descriptionId.value);
  if (hasError.value) ids.add(errorId.value);
  return ids.size ? [...ids].join(' ') : undefined;
});
const accessibleName = computed(() => {
  const externalLabel = `${attrs['aria-label'] ?? ''}`.trim();
  return externalLabel || props.ariaLabel.trim() || props.name?.trim() || 'Tagi';
});
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.layout}`,
  `${classNameComponent}--placement-${resolvedPlacement.value}`,
  {
    [`${classNameComponent}--open`]: showPanel.value,
    [`${classNameComponent}--focused`]: focused.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--searching`]: internalLoading.value,
    [`${classNameComponent}--invalid`]: hasError.value,
    [`${classNameComponent}--max`]: atMax.value,
  },
  attrs.class,
]);
const rootStyle = computed(
  () =>
    ({
      ...(attrs.style as CSSProperties | undefined),
    }) as CSSProperties,
);
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': _ariaLabel,
    'aria-describedby': _ariaDescribedBy,
    'aria-labelledby': _ariaLabelledBy,
    'data-testid': _dataTestId,
    ...rest
  } = attrs;
  return rest;
});
const inputLabelAttrs = computed(() => {
  const externalLabelledBy = `${attrs['aria-labelledby'] ?? ''}`.trim();
  if (externalLabelledBy) return { 'aria-labelledby': externalLabelledBy };
  if (hasLabel.value) return { 'aria-labelledby': labelId.value };
  return { 'aria-label': accessibleName.value };
});
const commitOptions = computed<FormTagsInputCommitOptions>(() => ({
  allowCreate: effectiveAllowCreate.value,
  allowDuplicates: props.allowDuplicates,
  getTagKey: props.getTagKey,
  max: props.max,
  normalizeTag: props.normalizeTag,
  suggestions: sourceSuggestions.value,
  validateTag: props.validateTag,
}));

function setTagButtonRef(element: unknown, index: number): void {
  tagButtonRefs.value[index] = element instanceof HTMLButtonElement ? element : undefined;
}

function isTagDisabled(tag: FormTagsInputTag, index: number): boolean {
  return isTagsInputItemDisabled(tag, index, props.disabledTags, props.getTagKey);
}

function suggestionKey(suggestion: FormTagsInputTag, index: number): string | number {
  return getTagsInputKey(suggestion, index, props.getTagKey);
}

function updateTags(nextTags: FormTagsInputTag[]): void {
  value.value = nextTags;
}

function updateInput(nextValue: string): void {
  inputValue.value = nextValue;
  selectedTagIndex.value = -1;
}

function reportInvalid(details: readonly FormTagsInputInvalidDetail[], event: Event): void {
  for (const detail of details) emit('invalidTag', detail, event);
  if (details[0]) announcement.value = details[0].message;
}

function commitInputs(inputs: readonly string[], event: Event): boolean {
  if (blocked.value || props.readonly || inputs.length === 0) return false;

  if (editingTagIndex.value >= 0) {
    const index = editingTagIndex.value;
    const previous = tags.value[index];
    if (!previous || isTagDisabled(previous, index)) return false;
    const remaining = tags.value.filter((_, tagIndex) => tagIndex !== index);
    const result = commitTagsInput(inputs.slice(0, 1), remaining, {
      ...commitOptions.value,
      max: undefined,
    });
    reportInvalid(result.invalid, event);
    const next = result.accepted[0];
    if (!next) return false;
    const nextTags = [...tags.value];
    nextTags[index] = next;
    updateTags(nextTags);
    editingTagIndex.value = -1;
    updateInput('');
    emit('edit', previous, next, index, event);
    announcement.value = `Zmieniono tag ${getTagsInputLabel(previous)} na ${getTagsInputLabel(next)}.`;
    return true;
  }

  const result = commitTagsInput(inputs, tags.value, commitOptions.value);
  reportInvalid(result.invalid, event);
  if (result.maxReached && Number.isFinite(normalizedMax.value)) {
    emit('maxReached', normalizedMax.value, event);
  }
  if (result.accepted.length === 0) return false;
  const startIndex = tags.value.length;
  updateTags(tags.value.concat(result.accepted));
  result.accepted.forEach((tag, offset) => emit('add', tag, startIndex + offset, event));
  updateInput('');
  announcement.value =
    result.accepted.length === 1
      ? `Dodano tag ${getTagsInputLabel(result.accepted[0] as FormTagsInputTag)}.`
      : `Dodano ${result.accepted.length} tagi.`;
  return true;
}

function commitSuggestion(index: number, event: Event): void {
  const suggestion = filteredSuggestions.value[index];
  if (!suggestion || isTagsInputItemDisabled(suggestion, index, [], props.getTagKey)) return;
  const label = getTagsInputLabel(suggestion);
  const editIndex = editingTagIndex.value;
  const existingTags =
    editIndex >= 0 ? tags.value.filter((_, tagIndex) => tagIndex !== editIndex) : tags.value;
  const result = commitTagsInput([label], existingTags, {
    ...commitOptions.value,
    max: editIndex >= 0 ? undefined : props.max,
    normalizeTag: () => suggestion,
  });
  reportInvalid(result.invalid, event);
  const accepted = result.accepted[0];
  if (!accepted) return;
  if (editIndex >= 0) {
    const previous = tags.value[editIndex];
    if (!previous) return;
    const nextTags = [...tags.value];
    nextTags[editIndex] = accepted;
    updateTags(nextTags);
    editingTagIndex.value = -1;
    emit('edit', previous, accepted, editIndex, event);
    announcement.value = `Zmieniono tag ${getTagsInputLabel(previous)} na ${label}.`;
  } else {
    const nextIndex = tags.value.length;
    updateTags(tags.value.concat(accepted));
    emit('add', accepted, nextIndex, event);
    announcement.value = `Dodano tag ${label}.`;
  }
  updateInput('');
  closePanel();
}

function removeTag(index: number, event: Event, focusAfter = true): void {
  const tag = tags.value[index];
  if (!tag || blocked.value || props.readonly || isTagDisabled(tag, index)) return;
  updateTags(tags.value.filter((_, tagIndex) => tagIndex !== index));
  editingTagIndex.value = -1;
  selectedTagIndex.value = -1;
  emit('remove', tag, index, event);
  announcement.value = `Usunięto tag ${getTagsInputLabel(tag)}.`;
  if (focusAfter) void nextTick(() => inputRef.value?.focus());
}

function beginEdit(index: number): void {
  const tag = tags.value[index];
  if (!tag || blocked.value || props.readonly || isTagDisabled(tag, index)) return;
  editingTagIndex.value = index;
  selectedTagIndex.value = index;
  updateInput(getTagsInputLabel(tag));
  panelOpen.value = hasSuggestionSource.value;
  void nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
}

function cancelEdit(): void {
  const previousIndex = editingTagIndex.value;
  editingTagIndex.value = -1;
  updateInput('');
  closePanel();
  if (previousIndex >= 0) void nextTick(() => tagButtonRefs.value[previousIndex]?.focus());
}

function focusTag(index: number): void {
  const safeIndex = Math.min(tags.value.length - 1, Math.max(0, index));
  selectedTagIndex.value = safeIndex;
  void nextTick(() => tagButtonRefs.value[safeIndex]?.focus());
}

function handleTagKeydown(index: number, event: KeyboardEvent): void {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const nextIndex = event.key === 'ArrowLeft' ? index - 1 : index + 1;
    if (nextIndex >= tags.value.length) {
      selectedTagIndex.value = -1;
      inputRef.value?.focus();
    } else focusTag(nextIndex);
    return;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    focusTag(0);
    return;
  }
  if (event.key === 'End') {
    event.preventDefault();
    inputRef.value?.focus();
    return;
  }
  if (event.key === 'Enter' || event.key === 'F2') {
    event.preventDefault();
    beginEdit(index);
    return;
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    const nextFocusIndex = Math.min(index, tags.value.length - 2);
    removeTag(index, event, false);
    void nextTick(() => {
      if (nextFocusIndex >= 0) focusTag(nextFocusIndex);
      else inputRef.value?.focus();
    });
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    selectedTagIndex.value = -1;
    inputRef.value?.focus();
  }
}

function handleInput(event: Event): void {
  updateInput((event.currentTarget as HTMLInputElement).value);
  activeSuggestionIndex.value = -1;
  panelOpen.value = hasSuggestionSource.value;
  syncPlacement();
}

function handleInputKeydown(event: KeyboardEvent): void {
  if (event.isComposing || event.altKey || event.metaKey || event.ctrlKey) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!hasSuggestionSource.value) return;
    event.preventDefault();
    panelOpen.value = true;
    const count = filteredSuggestions.value.length;
    if (count === 0) return;
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const start =
      activeSuggestionIndex.value < 0 ? (direction === 1 ? -1 : 0) : activeSuggestionIndex.value;
    activeSuggestionIndex.value = (start + direction + count) % count;
    return;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    if (showPanel.value && activeSuggestionIndex.value >= 0) {
      commitSuggestion(activeSuggestionIndex.value, event);
    } else if (inputValue.value.trim()) {
      if (commitInputs([inputValue.value], event)) closePanel();
    }
    return;
  }
  if (event.key === 'Escape') {
    if (editingTagIndex.value >= 0) cancelEdit();
    else closePanel();
    return;
  }
  if (event.key === 'Backspace' && !inputValue.value) {
    event.preventDefault();
    const lastIndex = tags.value.length - 1;
    if (selectedTagIndex.value === lastIndex && lastIndex >= 0) removeTag(lastIndex, event);
    else {
      selectedTagIndex.value = lastIndex;
      if (lastIndex >= 0)
        announcement.value = `Wybrano tag ${getTagsInputLabel(tags.value[lastIndex] as FormTagsInputTag)}.`;
    }
    return;
  }
  if (event.key === 'ArrowLeft' && !inputValue.value && tags.value.length > 0) {
    event.preventDefault();
    focusTag(tags.value.length - 1);
    return;
  }
  if (props.separators.includes(event.key) && inputValue.value.trim()) {
    event.preventDefault();
    commitInputs([inputValue.value], event);
  }
}

function handlePaste(event: ClipboardEvent): void {
  if (blocked.value || props.readonly) return;
  const parts = parseTagsInput(event.clipboardData?.getData('text') ?? '', props.separators);
  if (parts.length <= 1 && editingTagIndex.value < 0) return;
  event.preventDefault();
  commitInputs(parts, event);
}

function handleFocus(): void {
  focused.value = true;
  panelOpen.value = hasSuggestionSource.value;
  syncPlacement();
  if (props.suggestionProvider && internalSuggestions.value.length === 0) {
    void loadSuggestions(inputValue.value);
  }
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && rootRef.value?.contains(nextTarget)) return;
  focused.value = false;
  closePanel();
}

function closePanel(): void {
  panelOpen.value = false;
  activeSuggestionIndex.value = -1;
}

function syncPlacement(): void {
  if (props.placement !== 'auto') {
    resolvedPlacement.value = props.placement;
    popoverReference.value?.refreshPopoverPosition();
    return;
  }
  const rect = rootRef.value?.getBoundingClientRect();
  if (!rect) return;
  const availableBelow = window.innerHeight - rect.bottom;
  resolvedPlacement.value = availableBelow < 240 && rect.top > availableBelow ? 'top' : 'bottom';
  popoverReference.value?.refreshPopoverPosition();
}

function handlePopoverState(open: boolean): void {
  if (!open && panelOpen.value) closePanel();
}

watch(showPanel, async (open) => {
  await nextTick();
  if (open) {
    syncPlacement();
    popoverReference.value?.showPopover();
  } else {
    popoverReference.value?.hidePopover();
  }
});

async function loadSuggestions(query: string): Promise<void> {
  if (!props.suggestionProvider) return;
  suggestionAbortController?.abort();
  const requestId = ++suggestionRequestId;
  const controller = new AbortController();
  suggestionAbortController = controller;
  internalLoading.value = true;
  emit('search', query, requestId);
  try {
    const result = await props.suggestionProvider(query, controller.signal);
    if (requestId === suggestionRequestId && !controller.signal.aborted) {
      internalSuggestions.value = Array.isArray(result) ? result : [];
      activeSuggestionIndex.value = -1;
    }
  } catch (error) {
    if (!controller.signal.aborted) {
      const detail: FormTagsInputInvalidDetail = {
        index: -1,
        input: query,
        message: error instanceof Error ? error.message : 'Nie udało się pobrać sugestii.',
        reason: 'invalid',
      };
      emit('invalidTag', detail, new Event('suggestion-error'));
      announcement.value = detail.message;
    }
  } finally {
    if (requestId === suggestionRequestId) internalLoading.value = false;
  }
}

watch(
  () => inputValue.value,
  (query) => {
    if (props.suggestionProvider && focused.value) void loadSuggestions(query);
  },
);

watch(filteredSuggestions, (suggestions) => {
  if (activeSuggestionIndex.value >= suggestions.length) activeSuggestionIndex.value = -1;
});

watch(
  () => tags.value.length,
  (length) => {
    tagButtonRefs.value.length = length;
    if (selectedTagIndex.value >= length) selectedTagIndex.value = -1;
    if (editingTagIndex.value >= length) editingTagIndex.value = -1;
  },
);

onBeforeUnmount(() => suggestionAbortController?.abort());
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClasses"
    :style="rootStyle"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :data-loading="effectiveLoading || undefined"
    :data-invalid="hasError || undefined"
    :data-max-reached="atMax || undefined"
    :data-testid="dataTestId"
    @focusout="handleFocusOut"
  >
    <FormFieldLabel
      v-if="hasLabel"
      :for="inputId"
      :text="label"
      :readonly="readonly"
      :required="required || undefined"
      :data-test-id="dataTestId"
      :class="`${classNameComponent}__label`"
    >
      <slot name="label" :count="tags.length">{{ label }}</slot>
      <template v-if="slots.hint" #hint>
        <slot name="hint" :count="tags.length" :max="max" />
      </template>
    </FormFieldLabel>

    <PopoverOverlayer
      ref="popoverReference"
      :class="`${classNameComponent}__overlayer`"
      :content-class="`${classNameComponent}__popover-content`"
      :disabled="blocked || readonly"
      match-trigger-width
      :placement="resolvedPlacement"
      popup-type="listbox"
      @update:open="handlePopoverState"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- Clicking this wrapper only focuses the native input, which is reachable with Tab. -->
      <div
        ref="controlRef"
        :class="`${classNameComponent}__control`"
        :aria-busy="effectiveLoading || undefined"
        :aria-disabled="disabled || undefined"
        :data-testid="dataTestId ? `${dataTestId}-control` : undefined"
        @click.stop="inputRef?.focus()"
      >
        <slot name="prefix" />

        <ul
          v-if="tags.length"
          :class="`${classNameComponent}__tags`"
          :aria-label="`${accessibleName}: wybrane tagi`"
        >
          <li
            v-for="(tag, index) in tags"
            :key="getTagsInputKey(tag, index, getTagKey)"
            :class="[
              `${classNameComponent}__tag`,
              {
                [`${classNameComponent}__tag--selected`]: selectedTagIndex === index,
                [`${classNameComponent}__tag--editing`]: editingTagIndex === index,
                [`${classNameComponent}__tag--disabled`]: isTagDisabled(tag, index),
              },
            ]"
          >
            <button
              :ref="(element) => setTagButtonRef(element, index)"
              type="button"
              :class="`${classNameComponent}__tag-main`"
              :disabled="blocked || readonly"
              tabindex="-1"
              :aria-disabled="isTagDisabled(tag, index) || undefined"
              :aria-label="
                isTagDisabled(tag, index)
                  ? `Tag ${getTagsInputLabel(tag)} (niedostępny)`
                  : `Edytuj tag ${getTagsInputLabel(tag)}`
              "
              @click.stop="beginEdit(index)"
              @keydown.stop="handleTagKeydown(index, $event)"
            >
              <slot
                name="tag"
                :tag="tag"
                :index="index"
                :selected="selectedTagIndex === index"
                :editing="editingTagIndex === index"
                :disabled="isTagDisabled(tag, index)"
              >
                <slot name="tag-content" :tag="tag" :index="index">
                  <span :class="`${classNameComponent}__tag-label`" :title="getTagsInputLabel(tag)">
                    {{ getTagsInputLabel(tag) }}
                  </span>
                </slot>
              </slot>
            </button>
            <button
              v-if="!readonly && !isTagDisabled(tag, index)"
              type="button"
              :class="`${classNameComponent}__remove`"
              :disabled="blocked"
              :aria-label="`Usuń tag ${getTagsInputLabel(tag)}`"
              @click.stop="removeTag(index, $event)"
            >
              <SvgIcon name="cross" :class="`${classNameComponent}__remove-icon`" />
            </button>
          </li>
        </ul>

        <input
          :id="inputId"
          ref="inputRef"
          :form="form"
          v-bind="{ ...inputAttrs, ...inputLabelAttrs }"
          :class="`${classNameComponent}__input`"
          :value="inputValue"
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          :placeholder="atMax && editingTagIndex < 0 ? '' : placeholder"
          :disabled="blocked"
          :readonly="readonly || (atMax && editingTagIndex < 0)"
          :required="required && tags.length === 0"
          :aria-autocomplete="hasSuggestionSource ? 'list' : 'none'"
          :aria-controls="hasSuggestionSource ? listboxId : undefined"
          :aria-expanded="showPanel"
          aria-haspopup="listbox"
          :aria-activedescendant="activeSuggestionId"
          :aria-describedby="describedBy"
          :aria-invalid="hasError || undefined"
          :aria-required="required || undefined"
          :aria-readonly="readonly || undefined"
          data-peaui-popover-trigger
          :data-testid="dataTestId ? `${dataTestId}-input` : undefined"
          @focus="handleFocus"
          @input="handleInput"
          @keydown="handleInputKeydown"
          @paste="handlePaste"
        />

        <slot name="suffix" />
        <span
          v-if="effectiveLoading"
          :class="`${classNameComponent}__spinner`"
          aria-hidden="true"
        />
      </div>

      <template #content>
        <div :class="`${classNameComponent}__panel`">
          <div
            v-if="effectiveLoading"
            :id="listboxId"
            :class="`${classNameComponent}__panel-state`"
            role="listbox"
            :aria-label="`${accessibleName}: sugestie`"
            aria-busy="true"
          >
            <slot name="loading">{{ loadingLabel }}</slot>
          </div>
          <ul
            v-else-if="filteredSuggestions.length"
            :id="listboxId"
            :class="`${classNameComponent}__listbox`"
            role="listbox"
            :aria-label="`${accessibleName}: sugestie`"
          >
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/mouse-events-have-key-events -- The combobox input owns focus and keyboard selection with aria-activedescendant. -->
            <li
              v-for="(suggestion, index) in filteredSuggestions"
              :id="`${resolvedId}-suggestion-${index}`"
              :key="suggestionKey(suggestion, index)"
              :class="[
                `${classNameComponent}__option`,
                {
                  [`${classNameComponent}__option--active`]: activeSuggestionIndex === index,
                  [`${classNameComponent}__option--disabled`]: isTagsInputItemDisabled(
                    suggestion,
                    index,
                    [],
                    getTagKey,
                  ),
                },
              ]"
              role="option"
              :aria-selected="activeSuggestionIndex === index"
              :aria-disabled="
                isTagsInputItemDisabled(suggestion, index, [], getTagKey) || undefined
              "
              @mouseenter="activeSuggestionIndex = index"
              @mousedown.prevent
              @click="commitSuggestion(index, $event)"
            >
              <slot
                name="suggestion"
                :suggestion="suggestion"
                :index="index"
                :active="activeSuggestionIndex === index"
              >
                {{ getTagsInputLabel(suggestion) }}
              </slot>
            </li>
          </ul>
          <div
            v-else
            :id="listboxId"
            :class="`${classNameComponent}__panel-state`"
            role="listbox"
            :aria-label="`${accessibleName}: sugestie`"
          >
            <slot name="empty-suggestions" :query="inputValue">{{ emptyLabel }}</slot>
          </div>
        </div>
      </template>
    </PopoverOverlayer>

    <template v-if="name">
      <input
        v-for="(tag, index) in tags"
        :key="`form-${getTagsInputKey(tag, index, getTagKey)}`"
        type="hidden"
        :name="name"
        :form="form"
        :value="serializeTagsInputTag(tag, index, serializeTag)"
        :disabled="disabled"
      />
    </template>

    <p v-if="hasDescription" :id="descriptionId" :class="`${classNameComponent}__description`">
      <slot name="description">{{ description }}</slot>
    </p>
    <p v-if="hasError" :id="errorId" :class="`${classNameComponent}__error`">
      <slot name="error">{{ error }}</slot>
    </p>
    <span :id="liveId" :class="`${classNameComponent}__live`" role="status" aria-live="polite">
      {{ effectiveLoading ? loadingLabel : announcement }}
    </span>
  </div>
</template>
