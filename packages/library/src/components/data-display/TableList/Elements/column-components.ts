import { defineAsyncComponent, type Component } from 'vue';
import ArrayColumn from './ArrayColumn.vue';
import DateColumn from './DateColumn.vue';
import EmptyColumn from './EmptyColumn.vue';
import IndexColumn from './IndexColumn.vue';
import LinkColumn from './LinkColumn.vue';
import TextColumn from './TextColumn.vue';

const EditActionColumn = defineAsyncComponent(() => import('./EditActionColumn.vue'));

export const columnsDictionary: Readonly<Record<string, Component>> = {
  action: defineAsyncComponent(() => import('./ActionColumn.vue')),
  array: ArrayColumn,
  date: DateColumn,
  editAction: EditActionColumn,
  EditActionColumn: EditActionColumn,
  editable: defineAsyncComponent(() => import('./EditableColumn.vue')),
  editableInline: defineAsyncComponent(() => import('./EditableInline.vue')),
  expandable: defineAsyncComponent(() => import('./ExpandableColumn.vue')),
  empty: EmptyColumn,
  index: IndexColumn,
  link: LinkColumn,
  status: defineAsyncComponent(() => import('./StatusColumn.vue')),
  stepper: defineAsyncComponent(() => import('./StepperColumn.vue')),
  tag: defineAsyncComponent(() => import('./TagColumn.vue')),
  text: TextColumn,
} as const;
