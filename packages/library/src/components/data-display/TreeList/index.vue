<script lang="ts">
export interface TreeListType {
  label: string;
  children: Record<string, TreeListType>;
}

export interface AreaTreeListType {
  [key: string]: TreeListType;
}
</script>

<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { UIKIT_NAME } from '@/constants';
import { capitalizeFirstLetter } from '@/helpers/string.helper';
import { computed, ref, useAttrs, useId } from 'vue';

defineOptions({
  name: 'TreeList',
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  disabled = false,
  level = 1,
  isLast = false,
  canRemove = false,
  dataTestId,
} = defineProps<{
  id?: string;
  disabled?: boolean;
  level?: number;
  isLast?: boolean;
  canRemove?: boolean;
  dataTestId?: string;
}>();

const treeModel = defineModel<TreeListType>('tree', {
  default: () => ({ children: {}, label: '' }),
});

const emit = defineEmits<{
  (e: 'on:remove', id: string): void;
}>();

defineSlots<{
  default(props: { level: number }): unknown;
}>();

const attrs = useAttrs();
const uid = useId();
const isOpen = ref(false);
const classNameComponent = `${UIKIT_NAME}-tree-list`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const normalizedLabel = computed(() => capitalizeFirstLetter(treeModel.value.label));
const childEntries = computed(() =>
  Object.entries(treeModel.value.children ?? {}).filter((entry): entry is [string, TreeListType] =>
    Boolean(entry[1]),
  ),
);
const hasChildren = computed(() => childEntries.value.length > 0);
const contentId = computed(() => `${classNameComponent}-content-${uid}`);
const labelId = computed(() => `${classNameComponent}-label-${uid}`);

const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--level-${level}`,
  hasChildren.value && `${classNameComponent}--branch`,
  !hasChildren.value && `${classNameComponent}--leaf`,
  disabled && `${classNameComponent}--disabled`,
]);

const rowClasses = computed(() => [
  `${classNameComponent}__row`,
  `${classNameComponent}__row--level-${level}`,
  disabled && `${classNameComponent}__row--disabled`,
]);

const labelClasses = computed(() => [
  `${classNameComponent}__label`,
  level !== 3 && `${classNameComponent}__label--emphasized`,
]);

const toggleClasses = computed(() => [
  `${classNameComponent}__toggle`,
  disabled && `${classNameComponent}__toggle--disabled`,
]);

const arrowClasses = computed(() => [
  `${classNameComponent}__toggle-icon`,
  isOpen.value
    ? `${classNameComponent}__toggle-icon--open`
    : `${classNameComponent}__toggle-icon--closed`,
]);

const rootAttrs = computed(() => {
  const { 'data-testid': attrDataTestId, ...restAttrs } = attrs;

  return {
    ...restAttrs,
    'data-testid': dataTestId ?? attrDataTestId,
  };
});

const triggerTestId = computed(() => (dataTestId ? `${dataTestId}-trigger` : undefined));
const labelTestId = computed(() => (dataTestId ? `${dataTestId}-label` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
const removeButtonTestId = computed(() => (dataTestId ? `${dataTestId}-remove` : undefined));

const removeButtonAriaLabel = computed(() => `Usun galaz ${normalizedLabel.value}`);

const showLevelTwoConnector = computed(() => level === 2);
const showLevelTwoSpacer = computed(() => level === 2 && !hasChildren.value);
const showLevelThreeConnector = computed(() => level === 3);
const showLevelTwoBranchLine = computed(() => level === 2 && !isLast);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function handleToggle(): void {
  if (disabled || !hasChildren.value) {
    return;
  }

  isOpen.value = !isOpen.value;
}

function handleRemove(): void {
  if (disabled) return;
  emit('on:remove', id ?? '');
}

function getChildTestId(index: number): string | undefined {
  return dataTestId ? `${dataTestId}-child-${index}` : undefined;
}
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses">
    <div :class="rowClasses">
      <SvgIcon
        v-if="showLevelTwoConnector"
        :class="`${classNameComponent}__connector ${classNameComponent}__connector--level-two`"
        :name="isLast ? 'trialCurve' : 'trial'"
        aria-hidden="true"
      />

      <SvgIcon v-if="hasChildren" :class="arrowClasses" name="arrow" aria-hidden="true" />

      <span
        v-else-if="showLevelTwoSpacer"
        :class="`${classNameComponent}__connector-spacer`"
        aria-hidden="true"
      />

      <SvgIcon
        v-if="showLevelThreeConnector"
        :class="`${classNameComponent}__connector ${classNameComponent}__connector--level-three`"
        :name="isLast ? 'trialCurve' : 'trial'"
        aria-hidden="true"
      />

      <button
        v-if="hasChildren"
        type="button"
        :class="toggleClasses"
        :aria-controls="contentId"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :disabled="disabled"
        :data-testid="triggerTestId"
        @click="handleToggle"
      >
        <span :id="labelId" :class="labelClasses" :data-testid="labelTestId">
          {{ normalizedLabel }}
        </span>
      </button>

      <div v-else :class="`${classNameComponent}__leaf-content`">
        <span :id="labelId" :class="labelClasses" :data-testid="labelTestId">
          {{ normalizedLabel }}
        </span>

        <span :class="`${classNameComponent}__leaf-meta`" v-if="!hasChildren">
          <slot :level="level" />
        </span>
      </div>

      <button
        v-if="canRemove"
        type="button"
        :class="`${classNameComponent}__remove`"
        :disabled="disabled"
        :data-testid="removeButtonTestId"
        :aria-label="removeButtonAriaLabel"
        @click.stop="handleRemove"
      >
        <SvgIcon :class="`${classNameComponent}__remove-icon`" name="close" aria-hidden="true" />
      </button>
    </div>

    <Transition name="tree-list-slide">
      <div v-if="hasChildren && isOpen" :class="`${classNameComponent}__content`">
        <span
          v-if="showLevelTwoBranchLine"
          :class="`${classNameComponent}__branch-line`"
          aria-hidden="true"
        />

        <ul
          :id="contentId"
          :class="`${classNameComponent}__children`"
          :data-testid="contentTestId"
          :aria-labelledby="labelId"
        >
          <li
            v-for="([childrenKey, child], index) in childEntries"
            :key="childrenKey"
            :class="`${classNameComponent}__child`"
          >
            <TreeList
              :canRemove="canRemove"
              :disabled="disabled"
              :dataTestId="getChildTestId(index)"
              :id="childrenKey"
              :isLast="index === childEntries.length - 1"
              :level="level + 1"
              :tree="child"
              @on:remove="(idChildren: string) => emit('on:remove', idChildren)"
            >
              <template #default="slotProps">
                <slot :level="slotProps.level" />
              </template>
            </TreeList>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
