<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

import { useI18n } from '../i18n';
import type { FrameworkId } from '../types';
import { copyText } from '../utils/clipboard';

type CopyState = 'idle' | 'copied' | 'error';

const props = defineProps<{ framework?: FrameworkId | null }>();
const command = computed(() =>
  props.framework === 'react'
    ? 'npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"'
    : props.framework
      ? 'npm install @peaui/ui "vue@^3.5.0"'
      : 'npm install @peaui/ui',
);
const state = ref<CopyState>('idle');
const { t } = useI18n();
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const buttonLabel = computed(() =>
  state.value === 'copied' ? t('common.copied') : t('home.copyCommand'),
);
const liveMessage = computed(() => {
  if (state.value === 'copied') return t('common.copied');
  if (state.value === 'error') return t('home.copyError');
  return '';
});

function scheduleReset(): void {
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    state.value = 'idle';
  }, 2200);
}

async function copyCommand(): Promise<void> {
  try {
    await copyText(command.value);
    state.value = 'copied';
  } catch {
    state.value = 'error';
  }
  scheduleReset();
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer);
});
</script>

<template>
  <div class="install-command">
    <div class="install-snippet" :class="`install-snippet--${state}`">
      <span aria-hidden="true">$</span>
      <code>{{ command }}</code>
      <button type="button" :aria-label="buttonLabel" @click="copyCommand">
        <svg v-if="state !== 'copied'" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8" y="8" width="11" height="11" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 12 4 4L19 6" />
        </svg>
        <span>{{ state === 'copied' ? t('common.copied') : t('common.copy') }}</span>
      </button>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ liveMessage }}</p>
    <p v-if="state === 'error'" class="install-command__error" role="alert">
      {{ t('home.copyError') }}
    </p>
  </div>
</template>
