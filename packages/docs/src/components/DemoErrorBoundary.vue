<script setup lang="ts">
import { onErrorCaptured, ref, watch } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();

const props = defineProps<{ resetKey: string }>();
const error = ref<string>();

watch(
  () => props.resetKey,
  () => (error.value = undefined),
);

onErrorCaptured((capturedError) => {
  error.value = capturedError instanceof Error ? capturedError.message : String(capturedError);
  return false;
});
</script>

<template>
  <div v-if="error" class="demo-error" role="status">
    <strong>{{ t('demo.inputError') }}</strong>
    <span>{{ error }}</span>
  </div>
  <slot v-else />
</template>
