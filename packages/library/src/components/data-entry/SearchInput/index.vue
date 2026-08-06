<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, ref, useAttrs, useId, useTemplateRef } from 'vue';

// HELPERS
//-----------------------------------------------------------------------------------------------//
import { debounce } from '@/helpers/functions.helper';

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
  dataTestId,
} = defineProps<{
  ariaLabel?: string;
  placeholder?: string;
  debounceTime?: number;
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
const disabled = false;
const readonly = false;
const canErase = true;
const required = false;
const minimumDebouncedSearchLength = 3;
const minimumImmediateSearchLength = 3;

const modelValue = defineModel<string | undefined>('value');
const searchRequestVersion = ref(0);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const normalizedValue = computed(() => modelValue.value ?? '');
const fieldDataTestId = computed(() => (dataTestId ? `${dataTestId}-field` : undefined));
const elementTestId = computed(() => (dataTestId ? `${dataTestId}-element` : undefined));
const buttonTestId = computed(() => (dataTestId ? `${dataTestId}-search-button` : undefined));
const eraseButtonTestId = computed(() =>
  fieldDataTestId.value ? `${fieldDataTestId.value}-erase-button` : undefined,
);
const isEraseButtonVisible = computed(() => canErase && normalizedValue.value !== '' && !disabled);
const fieldId = computed(() => String(attrs.id ?? `${classNameComponent}-${uid}`));
const fieldName = computed(() => String(attrs.name ?? 'search-input'));

const fieldInputClass = computed(() => [
  `${classNameComponent}__input`,
  `${classNameComponent}__input--interactive`,
]);

const debouncedSearch = debounce(
  ((...args: unknown[]) => {
    const payload = String(args[0] ?? '');
    const separatorIndex = payload.indexOf('::');
    const version = Number(payload.slice(0, separatorIndex));
    const phrase = payload.slice(separatorIndex + 2);

    if (version !== searchRequestVersion.value) {
      return;
    }

    emit('on:search', phrase);
  }) as (...args: unknown[]) => void,
  debounceTime,
) as (payload: string) => void;

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function getInputBindings(): Record<string, unknown> {
  return {
    ...attrs,
    id: fieldId.value,
    name: fieldName.value,
    type: 'search',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: false,
    enterkeyhint: 'search',
    role: 'searchbox',
    'aria-label': ariaLabel,
    'aria-disabled': disabled,
    'aria-required': required,
    disabled,
    readonly,
    placeholder,
  };
}

function scheduleSearch(phrase: string): void {
  searchRequestVersion.value += 1;

  if (phrase !== '' && phrase.length < minimumDebouncedSearchLength) {
    return;
  }

  debouncedSearch(`${searchRequestVersion.value}::${phrase}`);
}

function handleSearch(phrase = inputReference.value?.value ?? normalizedValue.value): void {
  if (disabled || readonly || phrase.length < minimumImmediateSearchLength) {
    return;
  }

  searchRequestVersion.value += 1;
  emit('on:search', phrase);
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
  searchRequestVersion.value += 1;
  emit('on:search', '');

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
