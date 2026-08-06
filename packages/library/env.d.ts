/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.ce.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, unknown>>;
  export default component;
}
