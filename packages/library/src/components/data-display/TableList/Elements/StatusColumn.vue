<script setup lang="ts">
import TagChip from '@/components/data-display/TagChip/index.vue';
import { computed } from 'vue';

const { value = false } = defineProps<{
  value?: boolean;
}>();

const label = computed(() => (value ? 'TAK' : 'NIE'));
const variant = computed<'green' | 'red'>(() => (value ? 'green' : 'red'));
</script>

<template>
  <TagChip :label="label" :variant="variant" size="xs" />
</template>
