<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from '../i18n';

type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');
const { t } = useI18n();
const label = computed(() => (theme.value === 'light' ? t('theme.dark') : t('theme.light')));

function applyTheme(nextTheme: Theme) {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  localStorage.setItem('peaui-docs-theme', nextTheme);
}

function toggleTheme() {
  applyTheme(theme.value === 'light' ? 'dark' : 'light');
}

onMounted(() => {
  const saved = localStorage.getItem('peaui-docs-theme') as Theme | null;
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved ?? preferred);
});
</script>

<template>
  <button class="icon-button theme-toggle" type="button" :aria-label="label" @click="toggleTheme">
    <svg v-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.06 16.94l-1.42 1.42m12.72 0-1.42-1.42M7.06 7.06 5.64 5.64M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z" />
    </svg>
  </button>
</template>
