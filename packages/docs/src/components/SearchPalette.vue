<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';

import { getFrameworkComponents } from '../data/catalog';
import { icons } from '../data/icons';
import { getCategoryLabel, getComponentCopy, getIcon } from '../data/localized-content';
import { useI18n } from '../i18n';
import type { FrameworkId } from '../types';

type SearchResult = {
  iconName?: string;
  name: string;
  path: string;
  subtitle: string;
  terms: string[];
  type: 'component' | 'icon';
};

const props = defineProps<{ open: boolean; framework: FrameworkId }>();
const emit = defineEmits<{ close: [] }>();
const router = useRouter();
const { locale, t } = useI18n();
const phrase = ref('');
const input = ref<HTMLInputElement>();

const results = computed(() => {
  const components = getFrameworkComponents(props.framework);
  const needle = phrase.value.trim().toLocaleLowerCase(locale.value);
  const componentResults: SearchResult[] = components.map((component) => {
    const categoryLabel = getCategoryLabel(component.category, component.categoryLabel);
    const copy = getComponentCopy(component.name, component.copy);
    return {
      type: 'component',
      name: component.name,
      subtitle: categoryLabel,
      path: `/${props.framework}/components/${component.category}/${component.slug}`,
      terms: [component.name, categoryLabel, copy.description],
    };
  });

  if (!needle) return componentResults.slice(0, 12);

  const matchingComponents = componentResults.filter((result) =>
    result.terms.join(' ').toLocaleLowerCase(locale.value).includes(needle),
  );

  const matchingIcons: SearchResult[] = icons
    .map(getIcon)
    .filter((icon) =>
      [icon.name, icon.label, icon.description, ...icon.keywords]
        .join(' ')
        .toLocaleLowerCase(locale.value)
        .includes(needle),
    )
    .map((icon) => ({
      type: 'icon',
      name: icon.name,
      subtitle: `${t('search.icon')} · ${icon.label}`,
      path: `/${props.framework}/icons?search=${encodeURIComponent(icon.name)}`,
      iconName: icon.name,
      terms: [icon.name, icon.label, icon.description, ...icon.keywords],
    }));

  return [...matchingComponents, ...matchingIcons].slice(0, 16);
});

function close() {
  phrase.value = '';
  emit('close');
}

async function goTo(path: string) {
  await router.push(path);
  close();
}

watch(
  () => props.open,
  async (open) => {
    if (!open) return;
    await nextTick();
    input.value?.focus();
  },
);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="search-backdrop" @click.self="close" @keydown.esc="close">
      <section
        class="search-palette"
        role="dialog"
        aria-modal="true"
        :aria-label="t('search.dialog')"
      >
        <label class="search-palette__input">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.5-4.5m2.5-5A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <input
            ref="input"
            v-model="phrase"
            type="search"
            :placeholder="t('search.placeholder')"
          />
          <kbd>ESC</kbd>
        </label>
        <div class="search-palette__results">
          <p v-if="results.length === 0" class="search-empty">{{ t('search.noResults') }}</p>
          <button
            v-for="component in results"
            :key="component.path"
            type="button"
            @click="goTo(component.path)"
          >
            <span class="search-result__icon">
              <SvgIcon v-if="component.iconName" :name="component.iconName" aria-hidden="true" />
              <template v-else>{{ component.name.slice(0, 1) }}</template>
            </span>
            <span>
              <strong>{{ component.name }}</strong>
              <small>{{ component.subtitle }}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <footer>
          <span><kbd>↑</kbd><kbd>↓</kbd> {{ t('search.navigation') }}</span
          ><span><kbd>↵</kbd> {{ t('search.open') }}</span>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
