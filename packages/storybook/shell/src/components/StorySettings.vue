<script lang="ts" setup>
import { ref } from "vue";

const { resize = true, darkmode = true } = defineProps<{
  darkmode?: boolean;
  resize?: boolean;
}>();

type SizeKey =
  "peaui-size-s" | "peaui-size-md" | "peaui-size-lg" | "peaui-size-xl";

const size = ref<SizeKey>("peaui-size-md");
const referenceSize: Record<
  "enlarge" | "reduce",
  Record<SizeKey, SizeKey | undefined>
> = {
  enlarge: {
    "peaui-size-s": "peaui-size-md",
    "peaui-size-md": "peaui-size-lg",
    "peaui-size-lg": "peaui-size-xl",
    "peaui-size-xl": undefined,
  },
  reduce: {
    "peaui-size-s": undefined,
    "peaui-size-md": "peaui-size-s",
    "peaui-size-lg": "peaui-size-md",
    "peaui-size-xl": "peaui-size-lg",
  },
};

const referenceSizePercent: Record<SizeKey, string> = {
  "peaui-size-s": "50%",
  "peaui-size-md": "100%",
  "peaui-size-lg": "150%",
  "peaui-size-xl": "200%",
};

function handleChangeFontSize(type: "enlarge" | "reduce"): void {
  const nextSize = referenceSize[type][size.value];

  document.body.classList.remove(size.value);
  size.value = nextSize ?? size.value;
  document.body.classList.add(size.value);
}

function handleToggleDarkMode(): void {
  document.body.classList.toggle("dark-mode");
}
</script>

<template>
  <div class="story-settings" aria-label="Ustawienia podglądu">
    <span v-if="resize" class="story-settings__percent"
      >Skala {{ referenceSizePercent[size] }}</span
    >
    <div v-if="resize" class="story-settings__group">
      <button
        type="button"
        aria-label="Zmniejsz skalę tekstu"
        @click="handleChangeFontSize('reduce')"
      >
        −A
      </button>
      <button
        type="button"
        aria-label="Powiększ skalę tekstu"
        @click="handleChangeFontSize('enlarge')"
      >
        +A
      </button>
    </div>
    <button
      v-if="darkmode"
      class="story-settings__theme"
      type="button"
      aria-label="Przełącz jasny lub ciemny motyw podglądu"
      @click="handleToggleDarkMode"
    >
      ◐
    </button>
  </div>
</template>

<style lang="scss" scoped>
.story-settings,
.story-settings__group {
  display: flex;
  align-items: center;
}

.story-settings {
  gap: 0.5rem;
}

.story-settings__group {
  overflow: hidden;
  border: 1px solid var(--docs-border, #dce3ec);
  border-radius: 0.55rem;
  background: var(--docs-surface, #fff);
}

.story-settings__percent {
  color: var(--docs-muted, #5d6878);
  font-size: 0.72rem;
  white-space: nowrap;
}

.story-settings button {
  display: inline-grid;
  min-width: 2.2rem;
  min-height: 2.2rem;
  place-items: center;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-weight: 700;
}

.story-settings__group button + button {
  border-left: 1px solid var(--docs-border, #dce3ec);
}

.story-settings button:hover,
.story-settings button:focus-visible {
  background: var(--docs-accent-soft, #f4fbe8);
  color: var(--docs-accent, #3f8205);
  outline: none;
}

.story-settings__theme {
  border: 1px solid var(--docs-border, #dce3ec) !important;
  border-radius: 0.55rem;
  background: var(--docs-surface, #fff) !important;
  font-size: 1rem;
}
</style>
