<script setup lang="ts">
import { useI18n, type Locale } from '../i18n';

const { locale, setLocale, t } = useI18n();

function selectLocale(nextLocale: Locale): void {
  setLocale(nextLocale);
}
</script>

<template>
  <div class="locale-switcher" role="group" :aria-label="t('language.label')">
    <button
      type="button"
      :class="{ active: locale === 'en' }"
      :aria-pressed="locale === 'en'"
      :title="t('language.english')"
      @click="selectLocale('en')"
    >
      EN
    </button>
    <button
      type="button"
      :class="{ active: locale === 'pl' }"
      :aria-pressed="locale === 'pl'"
      :title="t('language.polish')"
      @click="selectLocale('pl')"
    >
      PL
    </button>
  </div>
</template>
