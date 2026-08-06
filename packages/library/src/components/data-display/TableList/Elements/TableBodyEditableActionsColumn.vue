<script setup lang="ts">
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { computed } from 'vue';

const { dataTestId } = defineProps<{
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:submit:update'): void;
  (e: 'on:cancel:action'): void;
}>();

const submitTestId = computed(() => buildTableTestId(dataTestId, 'submit'));
const cancelTestId = computed(() => buildTableTestId(dataTestId, 'cancel'));
</script>

<template>
  <td :class="`${TABLE_LIST_CLASS}__editable-actions-cell`">
    <button
      type="button"
      :class="`${TABLE_LIST_CLASS}__editable-action-button ${TABLE_LIST_CLASS}__editable-action-button--submit`"
      :data-testid="submitTestId"
      aria-label="Zapisz edytowany rekord"
      @click.prevent.stop="emit('on:submit:update')"
    >
      <SvgIcon
        :class="`${TABLE_LIST_CLASS}__editable-action-icon`"
        name="check"
        aria-hidden="true"
      />
    </button>

    <button
      type="button"
      :class="`${TABLE_LIST_CLASS}__editable-action-button ${TABLE_LIST_CLASS}__editable-action-button--cancel`"
      :data-testid="cancelTestId"
      aria-label="Anuluj edycje rekordu"
      @click.prevent="emit('on:cancel:action')"
    >
      <SvgIcon
        :class="`${TABLE_LIST_CLASS}__editable-action-icon`"
        name="close"
        aria-hidden="true"
      />
    </button>
  </td>
</template>
