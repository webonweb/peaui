<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue: string;
    options: readonly string[];
    labelledby: string;
    disabled?: boolean;
  }>(),
  {
    id: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const generatedId = useId();
const trigger = ref<HTMLButtonElement>();
const overlay = ref<HTMLElement>();
const isOpen = ref(false);
const activeIndex = ref(-1);
const placement = ref<'top' | 'bottom'>('bottom');
const overlayPosition = ref({ left: 0, top: 0, bottom: 0, width: 0, maxHeight: 0 });

let typeaheadQuery = '';
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

const triggerId = computed(() => props.id || `docs-select-${generatedId}`);
const listboxId = computed(() => `${triggerId.value}-listbox`);
const triggerLabelledby = computed(() => `${props.labelledby} ${triggerId.value}`);
const selectedIndex = computed(() => props.options.indexOf(props.modelValue));
const selectedLabel = computed(() =>
  selectedIndex.value >= 0 ? props.options[selectedIndex.value] : props.modelValue,
);
const activeOptionId = computed(() =>
  isOpen.value && activeIndex.value >= 0
    ? `${listboxId.value}-option-${activeIndex.value}`
    : undefined,
);
const positionStyle = computed(() => ({
  left: `${overlayPosition.value.left}px`,
  top: placement.value === 'bottom' ? `${overlayPosition.value.top}px` : 'auto',
  bottom: placement.value === 'top' ? `${overlayPosition.value.bottom}px` : 'auto',
  width: `${overlayPosition.value.width}px`,
  maxHeight: `${overlayPosition.value.maxHeight}px`,
}));

function updatePosition() {
  if (!trigger.value || !isOpen.value) return;

  const rect = trigger.value.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const viewportMargin = 12;
  const overlayGap = 6;
  const preferredHeight = Math.min(288, Math.max(96, props.options.length * 38 + 10));
  const availableBelow = Math.max(0, viewportHeight - rect.bottom - overlayGap - viewportMargin);
  const availableAbove = Math.max(0, rect.top - overlayGap - viewportMargin);
  const openAbove = availableBelow < preferredHeight && availableAbove > availableBelow;
  const availableHeight = openAbove ? availableAbove : availableBelow;
  const width = Math.min(
    Math.max(rect.width, 176),
    Math.max(0, viewportWidth - viewportMargin * 2),
  );
  const left = Math.min(
    Math.max(viewportMargin, rect.left),
    Math.max(viewportMargin, viewportWidth - viewportMargin - width),
  );

  placement.value = openAbove ? 'top' : 'bottom';
  overlayPosition.value = {
    left,
    top: rect.bottom + overlayGap,
    bottom: viewportHeight - rect.top + overlayGap,
    width,
    maxHeight: Math.max(72, Math.min(preferredHeight, availableHeight)),
  };
}

function scrollActiveOptionIntoView() {
  nextTick(() => {
    const option = overlay.value?.querySelector<HTMLElement>(
      `#${CSS.escape(`${listboxId.value}-option-${activeIndex.value}`)}`,
    );
    option?.scrollIntoView({ block: 'nearest' });
  });
}

function setActiveIndex(index: number) {
  if (!props.options.length) return;
  activeIndex.value = (index + props.options.length) % props.options.length;
  scrollActiveOptionIntoView();
}

async function openSelect() {
  if (props.disabled || !props.options.length || isOpen.value) return;

  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0;
  isOpen.value = true;
  await nextTick();
  updatePosition();
  scrollActiveOptionIntoView();
}

function closeSelect(restoreFocus = false) {
  if (!isOpen.value) return;
  isOpen.value = false;
  activeIndex.value = -1;
  clearTypeahead();

  if (restoreFocus) nextTick(() => trigger.value?.focus());
}

function toggleSelect() {
  if (isOpen.value) closeSelect();
  else void openSelect();
}

function selectOption(index: number) {
  const option = props.options[index];
  if (option === undefined) return;

  if (option !== props.modelValue) emit('update:modelValue', option);
  closeSelect(true);
}

function clearTypeahead() {
  typeaheadQuery = '';
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  typeaheadTimer = undefined;
}

function runTypeahead(character: string) {
  if (!props.options.length) return;

  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  typeaheadQuery += character.toLocaleLowerCase();
  typeaheadTimer = setTimeout(clearTypeahead, 650);

  const startIndex = Math.max(activeIndex.value, selectedIndex.value, -1);
  const matchingIndex = Array.from(
    { length: props.options.length },
    (_, offset) => (startIndex + offset + 1) % props.options.length,
  ).find((index) => props.options[index].toLocaleLowerCase().startsWith(typeaheadQuery));

  if (matchingIndex !== undefined) setActiveIndex(matchingIndex);
}

function onTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (!isOpen.value) void openSelect();
      else setActiveIndex(activeIndex.value + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (!isOpen.value) void openSelect();
      else setActiveIndex(activeIndex.value - 1);
      break;
    case 'Home':
      if (!isOpen.value) return;
      event.preventDefault();
      setActiveIndex(0);
      break;
    case 'End':
      if (!isOpen.value) return;
      event.preventDefault();
      setActiveIndex(props.options.length - 1);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (isOpen.value) selectOption(activeIndex.value);
      else void openSelect();
      break;
    case 'Escape':
      if (!isOpen.value) return;
      event.preventDefault();
      closeSelect(true);
      break;
    case 'Tab':
      closeSelect();
      break;
    default:
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (!isOpen.value) void openSelect();
        runTypeahead(event.key);
      }
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node;
  if (trigger.value?.contains(target) || overlay.value?.contains(target)) return;
  closeSelect();
}

function addOpenListeners() {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
}

function removeOpenListeners() {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
}

watch(isOpen, (open) => {
  if (open) addOpenListeners();
  else removeOpenListeners();
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeSelect();
  },
);

watch(
  () => props.modelValue,
  () => {
    if (isOpen.value) activeIndex.value = selectedIndex.value;
  },
);

onBeforeUnmount(() => {
  removeOpenListeners();
  clearTypeahead();
});
</script>

<template>
  <div class="docs-select">
    <button
      :id="triggerId"
      ref="trigger"
      class="docs-select__trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-autocomplete="none"
      :aria-labelledby="triggerLabelledby"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listboxId : undefined"
      :aria-activedescendant="activeOptionId"
      :disabled="disabled"
      @click="toggleSelect"
      @keydown="onTriggerKeydown"
    >
      <span class="docs-select__value">{{ selectedLabel }}</span>
      <svg
        class="docs-select__chevron"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </button>

    <Teleport to="body">
      <ul
        v-if="isOpen"
        :id="listboxId"
        ref="overlay"
        class="docs-select__overlay"
        :class="`docs-select__overlay--${placement}`"
        :style="positionStyle"
        role="listbox"
        :aria-labelledby="labelledby"
      >
        <li
          v-for="(option, index) in options"
          :id="`${listboxId}-option-${index}`"
          :key="option"
          class="docs-select__option"
          :class="{
            'docs-select__option--active': activeIndex === index,
            'docs-select__option--selected': modelValue === option,
          }"
          role="option"
          :aria-selected="modelValue === option"
          @click="selectOption(index)"
          @pointerdown.prevent
          @pointerenter="activeIndex = index"
        >
          <span>{{ option }}</span>
          <svg
            v-if="modelValue === option"
            class="docs-select__check"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d="m3.5 8.25 2.75 2.75 6.25-6.25" />
          </svg>
        </li>
      </ul>
    </Teleport>
  </div>
</template>
