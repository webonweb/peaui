<script setup lang="ts">
import { computed } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ProgressIndicator from '@/components/feedback/ProgressIndicator/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import { slugify } from '@/helpers/string.helper';
import type { TableColumn, TableManageColumn, TableStepperStep } from '../index.vue';
import { TABLE_LIST_CLASS } from '../shared';

const props = defineProps<{
  manage?: TableManageColumn;
  deep?: string;
  record?: Record<string, any>;
  column: TableColumn;
  isExpanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:click', id: string): void;
}>();

const steps = computed<TableStepperStep[]>(() =>
  props.column.steps ? props.column.steps(props.record || {}) : [],
);

function handleStepAction(step: TableStepperStep): void {
  if (step.status === 'disabled') {
    return;
  }

  if (step.onRedirect) {
    step.onRedirect();
    return;
  }

  if (step.collapse) {
    emit('on:click', String(props.record?.id ?? ''));
  }
}
</script>

<template>
  <div :class="`${TABLE_LIST_CLASS}__stepper`">
    <div :class="`${TABLE_LIST_CLASS}__stepper-list`">
      <template v-for="(step, index) in steps" :key="step.key">
        <span
          v-if="step.isSeparate && index > 0"
          :class="`${TABLE_LIST_CLASS}__stepper-separator`"
          aria-hidden="true"
          role="presentation"
        >
          |
        </span>

        <button
          type="button"
          :class="[
            `${TABLE_LIST_CLASS}__stepper-button`,
            `${TABLE_LIST_CLASS}__stepper-button--status-${step.status}`,
            step.isSeparate && `${TABLE_LIST_CLASS}__stepper-button--separate`,
            index === 0 && `${TABLE_LIST_CLASS}__stepper-button--first`,
            (index === steps.length - 1 || steps[index + 1]?.isSeparate) &&
              `${TABLE_LIST_CLASS}__stepper-button--last`,
          ]"
          :data-testid="slugify(step.key)"
          :aria-disabled="step.status === 'disabled' ? 'true' : undefined"
          :aria-label="`${step.label}. Status ${step.status}`"
          @click.prevent="handleStepAction(step)"
        >
          <span :class="`${TABLE_LIST_CLASS}__stepper-label`" v-html="step.label" />

          <ProgressIndicator
            v-if="step.collapse"
            :class="`${TABLE_LIST_CLASS}__stepper-progress-indicator`"
            :active="step.collapse.activeElements"
            :dataTestId="`${slugify(step.key)}-progress`"
            :size="20"
            :steps="step.collapse.count"
            :strokeWidth="2.5"
          />

          <SvgIcon
            v-if="step.collapse"
            :class="[
              `${TABLE_LIST_CLASS}__stepper-arrow`,
              props.isExpanded
                ? `${TABLE_LIST_CLASS}__stepper-arrow--expanded`
                : `${TABLE_LIST_CLASS}__stepper-arrow--collapsed`,
            ]"
            name="arrow"
            aria-hidden="true"
          />

          <SvgIcon
            v-if="step.status === 'complete'"
            :class="`${TABLE_LIST_CLASS}__stepper-complete-icon`"
            name="checkCircle"
            aria-hidden="true"
          />

          <InfoTooltip v-if="step.status === 'disabled'" placement="right">
            <SvgIcon
              :class="`${TABLE_LIST_CLASS}__stepper-lock-icon`"
              name="lock"
              aria-hidden="true"
            />

            <template #description>
              Aby przejść do wybranego kroku, musisz wypełnić <br />
              poprzedni.
            </template>
          </InfoTooltip>
        </button>
      </template>
    </div>
  </div>
</template>
