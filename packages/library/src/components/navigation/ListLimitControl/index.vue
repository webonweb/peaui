<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SelectField from '@/components/form/FormSelect/index.vue';
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useId } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  label,
  limitList = [5, 10, 25, 50],
  position = 'bottom',
  dataTestId,
} = defineProps<{
  id: string;
  label: string;
  limitList?: number[];
  /** Preferred list placement; it flips automatically when the selected side has insufficient space. */
  position?: 'top' | 'bottom';
  dataTestId?: string;
}>();

const attrs = useAttrs();
const uid = useId();
const limitModel = defineModel<number>('limit', { required: true });

const classNameComponent = `${UIKIT_NAME}-list-limit-control`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const fieldId = computed(() => `page-size-${id}`);
const labelId = computed(() => `${classNameComponent}-label-${id}-${uid}`);

const rootAttrs = computed(() => ({
  ...attrs,
  role: 'group',
  'aria-labelledby': labelId.value,
  'data-testid': dataTestId,
}));

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--position-${position}`,
]);

const selectClasses = computed(() => [
  `${classNameComponent}__select`,
  `${classNameComponent}__select--position-${position}`,
]);

const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const selectTestId = computed(() => (dataTestId ? `${dataTestId}-select` : undefined));

const recordsOnPageList = computed(() =>
  limitList.map((item) => ({
    id: item.toString(),
    value: item.toString(),
    label: item.toString(),
    active: limitModel.value === item,
  })),
);

const limitValue = computed(() =>
  limitModel.value === undefined || limitModel.value === null ? '' : String(limitModel.value),
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function handleLimitUpdate(option: unknown): void {
  if (option === null || option === undefined || option === '') {
    return;
  }

  const parsedValue = Number(option);

  if (Number.isNaN(parsedValue)) {
    return;
  }

  limitModel.value = parsedValue;
}
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses">
    <label
      :id="labelId"
      :class="`${classNameComponent}__label`"
      :data-testid="labelTestId"
      :for="fieldId"
    >
      <slot>{{ label }}</slot>
    </label>
    <SelectField
      :id="fieldId"
      :class="selectClasses"
      :dataTestId="selectTestId"
      :aria-labelledby="labelId"
      :name="fieldId"
      size="xs"
      :options="recordsOnPageList"
      :placement="position"
      :searchable="false"
      :value="limitValue"
      placeholder="Wybierz"
      @update:value="handleLimitUpdate"
    />
  </div>
</template>
