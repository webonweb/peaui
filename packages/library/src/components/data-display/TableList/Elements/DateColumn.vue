<script setup lang="ts">
import { formatDateToISODateString } from '@/helpers/date.helper';
import { computed } from 'vue';
import { TABLE_LIST_CLASS } from '../shared';

const { value } = defineProps<{
  value: string | undefined;
}>();

const formatted = computed(() => (value ? formatDateToISODateString(value) : '-/-'));
const datetimeValue = computed(() => (value ? formatDateToISODateString(value) : undefined));
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__date-column`">
    <time :class="`${TABLE_LIST_CLASS}__date-value`" :datetime="datetimeValue">
      {{ formatted }}
    </time>
  </div>
</template>
