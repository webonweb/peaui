<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { useI18n, type Locale } from '../i18n';
import { getLocalizedRoutePath } from '../router';

const { locale, setLocale, t } = useI18n();
const route = useRoute();
const router = useRouter();

async function selectLocale(nextLocale: Locale): Promise<void> {
  setLocale(nextLocale);
  const query = { ...route.query };
  delete query.lang;
  await router.replace({
    path: getLocalizedRoutePath(route.path, nextLocale),
    query,
    hash: route.hash,
  });
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
