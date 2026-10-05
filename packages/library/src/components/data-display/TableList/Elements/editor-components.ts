import { defineAsyncComponent, type Component } from 'vue';
export const formComponentsDictionary: Readonly<Record<string, Component>> = {
  multiselect: defineAsyncComponent(() => import('@/components/form/FormMultiSelect/index.vue')),
  number: defineAsyncComponent(() => import('@/components/form/FormNumber/index.vue')),
  select: defineAsyncComponent(() => import('@/components/form/FormSelect/index.vue')),
  text: defineAsyncComponent(() => import('@/components/form/FormInput/index.vue')),
};
