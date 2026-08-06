<script setup lang="ts">
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import { computed } from 'vue';

const currentAction = defineModel<string>('currentEditableAction', { required: false });

const {
  buttonText = 'Dodaj',
  colspan,
  dataTestId,
} = defineProps<{
  colspan: number;
  buttonText?: string;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:create'): void;
}>();

const buttonTestId = computed(() => buildTableTestId(dataTestId, 'button'));
</script>

<template>
  <tr>
    <td :class="`${TABLE_LIST_CLASS}__create-row-cell`" :colspan="colspan">
      <ButtonAction
        :class="`${TABLE_LIST_CLASS}__create-row-button`"
        :disabled="currentAction === 'update'"
        :dataTestId="buttonTestId"
        ariaLabel="Dodaj nowy rekord"
        size="xs"
        @click="emit('on:create')"
      >
        {{ buttonText }}
      </ButtonAction>
    </td>
  </tr>
</template>
