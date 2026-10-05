<script setup lang="ts">
import { createHighlighter } from "shiki";
import { ref, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
  }>(),
  { language: "vue" },
);

const html = ref("");
const copied = ref(false);
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;
let copyResetTimeout: number | undefined;

function getSingletonHighlighter() {
  highlighterPromise ??= createHighlighter({
    langs: ["vue", "ts", "js", "html", "css", "json", "bash"],
    themes: ["github-light-high-contrast", "github-dark-high-contrast"],
  });

  return highlighterPromise;
}

async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    window.clearTimeout(copyResetTimeout);
    copyResetTimeout = window.setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    copied.value = false;
  }
}

watchEffect(async () => {
  const highlighter = await getSingletonHighlighter();

  html.value = highlighter.codeToHtml(props.code, {
    lang: props.language,
    defaultColor: "light-dark()",
    themes: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
  });
});
</script>

<template>
  <div class="story-source">
    <div class="story-source__toolbar">
      <span>{{ language }}</span>
      <button type="button" @click="copyCode">
        {{ copied ? "Skopiowano" : "Kopiuj kod" }}
      </button>
    </div>
    <div class="story-source__code" v-html="html" />
  </div>
</template>

<style lang="scss" scoped>
.story-source {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid var(--docs-border, #dce3ec);
  border-radius: 0.9rem;
  background: #fff;
}

.story-source__toolbar {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem 0 1rem;
  border-bottom: 1px solid var(--docs-border, #dce3ec);
  color: var(--docs-muted, #5d6878);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.story-source__toolbar button {
  padding: 0.38rem 0.65rem;
  border: 1px solid #cfd7e3;
  border-radius: 0.45rem;
  background: #fff;
  color: #344153;
  cursor: pointer;
  font: inherit;
  text-transform: none;
}

.story-source__toolbar button:hover,
.story-source__toolbar button:focus-visible {
  border-color: #afe34b;
  color: #326a04;
  outline: none;
}

.story-source__code {
  max-height: 32rem;
  overflow: auto;
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  line-height: 1.55;
}

:deep(pre.shiki) {
  margin: 0;
  background-color: transparent !important;
}

:global(body.dark-mode .story-source) {
  color-scheme: dark;
  background: #0c1220;
}

:global(body.dark-mode .story-source__toolbar button) {
  border-color: #334159;
  background: #172033;
  color: #d5dfed;
}
</style>
