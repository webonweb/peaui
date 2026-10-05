<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onBeforeUnmount, useAttrs, useId, useTemplateRef, watch } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { createSearchScheduler } from './search-scheduler.shared';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

defineOptions({
  inheritAttrs: false,
});

//
// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  ariaLabel = 'Pole wyszukiwania',
  placeholder = 'Wpisz czego szukasz',
  debounceTime = 1000,
  disabled = false,
  readonly = false,
  dataTestId,
} = defineProps<{
  ariaLabel?: string;
  placeholder?: string;
  debounceTime?: number;
  disabled?: boolean;
  readonly?: boolean;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:search', phrase: string): void;
  (e: 'on:remove'): void;
}>();

const attrs = useAttrs();
const uid = useId();
const inputReference = useTemplateRef<HTMLInputElement>('inputReference');
const classNameComponent = `${UIKIT_NAME}-search-input`;
const searchButtonAriaLabel = 'Wyszukaj';
const canErase = true;
const required = false;

const modelValue = defineModel<string | undefined>('value');

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const normalizedValue = computed(() => modelValue.value ?? '');
const fieldDataTestId = computed(() => (dataTestId ? `${dataTestId}-field` : undefined));
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const buttonTestId = computed(() => (dataTestId ? `${dataTestId}-search-button` : undefined));
const eraseButtonTestId = computed(() =>
  fieldDataTestId.value ? `${fieldDataTestId.value}-erase-button` : undefined,
);
const isEraseButtonVisible = computed(
  () => canErase && normalizedValue.value !== '' && !disabled && !readonly,
);
const fieldId = computed(() => String(attrs.id ?? `${classNameComponent}-${uid}`));
const fieldName = computed(() => String(attrs.name ?? 'search-input'));

const fieldInputClass = computed(() => [
  `${classNameComponent}__input`,
  `${classNameComponent}__input--interactive`,
]);

const searchScheduler = createSearchScheduler(
  (phrase) => emit('on:search', phrase),
  () => debounceTime,
  () => disabled || readonly,
);
onBeforeUnmount(searchScheduler.cancel);
watch(() => debounceTime, searchScheduler.cancel);
watch(
  () => disabled || readonly,
  (blocked) => {
    if (blocked) searchScheduler.cancel();
  },
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getInputBindings(): Record<string, unknown> {
  return {
    ...attrs,
    id: fieldId.value,
    name: fieldName.value,
    type: 'search',
    autocomplete: 'off',
    autocapitalize: 'none',
    spellcheck: false,
    enterkeyhint: 'search',
    role: attrs.role ?? 'searchbox',
    'aria-label': attrs['aria-label'] ?? (attrs['aria-labelledby'] ? undefined : ariaLabel),
    'aria-disabled': disabled,
    'aria-required': required,
    disabled,
    readonly,
    placeholder,
  };
}

function scheduleSearch(phrase: string): void {
  searchScheduler.schedule(phrase);
}

function handleSearch(phrase = inputReference.value?.value ?? normalizedValue.value): void {
  searchScheduler.search(phrase);
}

function handleInput(event: Event): void {
  if (disabled || readonly) {
    return;
  }

  const nextValue = (event.target as HTMLInputElement).value;

  modelValue.value = nextValue;
  scheduleSearch(nextValue);
}

function handleKeydown(event: KeyboardEvent): void {
  if (disabled || readonly) {
    return;
  }

  if (event.key !== 'Enter') {
    return;
  }

  event.preventDefault();
  handleSearch();
}

function handleRemove(): void {
  if (disabled || readonly) {
    return;
  }

  modelValue.value = '';
  emit('on:remove');
  searchScheduler.clear();

  void nextTick(() => {
    inputReference.value?.focus();
  });
}
</script>

<template>
  <div :class="classNameComponent" role="search" :aria-label="ariaLabel" :data-testid="dataTestId">
    <div
      :class="`${classNameComponent}__field`"
      :data-testid="fieldDataTestId"
      :data-disabled="disabled || undefined"
    >
      <SvgIcon :class="`${classNameComponent}__field-icon`" name="search" />

      <input
        ref="inputReference"
        v-bind="getInputBindings()"
        :class="fieldInputClass"
        :value="normalizedValue"
        data-type="search-input"
        :data-testid="elementTestId"
        @input="handleInput"
        @keydown="handleKeydown"
      />

      <button
        v-if="isEraseButtonVisible"
        :class="`${classNameComponent}__erase-button`"
        type="button"
        :data-testid="eraseButtonTestId"
        aria-label="Usun wartosc pola"
        @click="handleRemove"
      >
        <SvgIcon :class="`${classNameComponent}__erase-icon`" name="cross" />
      </button>
    </div>

    <ButtonAction
      :class="`${classNameComponent}__button`"
      :ariaLabel="searchButtonAriaLabel"
      useAriaLabel
      :dataTestId="buttonTestId"
      :disabled="disabled || readonly"
      size="m"
      type="button"
      variant="primary"
      @click="handleSearch(normalizedValue)"
    >
      <SvgIcon :class="`${classNameComponent}__button-icon`" name="search" />
    </ButtonAction>
  </div>
</template>
