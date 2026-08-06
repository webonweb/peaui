<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();

const props = defineProps<{
  code: string;
  language?: string;
}>();

const copied = ref(false);

async function copyCode() {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  window.setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__toolbar">
      <span>{{ language ?? 'vue' }}</span>
      <button type="button" @click="copyCode">
        {{ copied ? t('common.copied') : t('common.copy') }}
      </button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>
