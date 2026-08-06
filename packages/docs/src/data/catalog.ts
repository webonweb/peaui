import { defineAsyncComponent, type Component } from 'vue';
import type { ComponentType } from 'react';

import { generatedComponentApi } from '../generated/component-api';
import {
  generatedReactComponentApi,
  generatedWebComponentApi,
} from '../generated/framework-component-api';
import type {
  ComponentDefinition,
  FrameworkComponentApi,
  FrameworkComponentDefinition,
  FrameworkId,
} from '../types';
import { componentCopy, fallbackCopy } from './component-copy';

const componentModules = import.meta.glob<{ default: Component }>(
  '../../../library/src/components/*/*/index.vue',
);
const reactComponentModules = import.meta.glob<{
  default: ComponentType<Record<string, unknown>>;
}>('../../../library/src/components/*/*/index.tsx', { eager: true });

export function toSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function resolveComponent(category: string, name: string): Component {
  const suffix = `/components/${category}/${name}/index.vue`;
  const entry = Object.entries(componentModules).find(([file]) =>
    file.replace(/\\/g, '/').endsWith(suffix),
  );

  if (!entry) throw new Error(`Nie znaleziono implementacji komponentu ${category}/${name}.`);
  return defineAsyncComponent(async () => (await entry[1]()).default);
}

function resolveReactComponent(
  category: string,
  sourceName: string,
): ComponentType<Record<string, unknown>> | undefined {
  const suffix = `/components/${category}/${sourceName}/index.tsx`;
  return Object.entries(reactComponentModules).find(([file]) =>
    file.replace(/\\/g, '/').endsWith(suffix),
  )?.[1].default;
}

export const components: ComponentDefinition[] = generatedComponentApi.map((api) => {
  const publicName = api.name === 'PhotoEditior' ? 'PhotoEditor' : api.name;

  return {
    ...api,
    name: publicName,
    component: resolveComponent(api.category, api.name),
    slug: toSlug(publicName),
    copy: componentCopy[api.name] ?? fallbackCopy(publicName),
  };
});

export const categories = [
  ...new Map(
    components.map((component) => [component.category, component.categoryLabel]),
  ).entries(),
].map(([slug, label]) => ({
  slug,
  label,
  components: components.filter((component) => component.category === slug),
}));

export function findComponent(category: string, slug: string): ComponentDefinition | undefined {
  return components.find((component) => component.category === category && component.slug === slug);
}

function enhanceFrameworkComponent(api: FrameworkComponentApi): FrameworkComponentDefinition {
  const vueDefinition = components.find(
    (component) => component.category === api.category && component.name === api.name,
  );

  return {
    ...api,
    component: api.framework === 'vue' ? vueDefinition?.component : undefined,
    reactComponent:
      api.framework === 'react' ? resolveReactComponent(api.category, api.sourceName) : undefined,
    slug: toSlug(api.name),
    copy: vueDefinition?.copy ?? fallbackCopy(api.name),
  };
}

const vueFrameworkComponents: FrameworkComponentDefinition[] = components.map((component) => ({
  ...component,
  framework: 'vue',
  sourceName: component.name === 'PhotoEditor' ? 'PhotoEditior' : component.name,
  status: 'stable',
}));

export const frameworkComponents: Record<FrameworkId, FrameworkComponentDefinition[]> = {
  vue: vueFrameworkComponents,
  react: generatedReactComponentApi.map(enhanceFrameworkComponent),
  'web-components': generatedWebComponentApi.map(enhanceFrameworkComponent),
};

export function getFrameworkComponents(framework: FrameworkId): FrameworkComponentDefinition[] {
  return frameworkComponents[framework];
}

export function getFrameworkCategories(framework: FrameworkId) {
  const entries = getFrameworkComponents(framework);

  return [
    ...new Map(entries.map((component) => [component.category, component.categoryLabel])).entries(),
  ].map(([slug, label]) => ({
    slug,
    label,
    components: entries.filter((component) => component.category === slug),
  }));
}

export function findFrameworkComponent(
  framework: FrameworkId,
  category: string,
  slug: string,
): FrameworkComponentDefinition | undefined {
  return getFrameworkComponents(framework).find(
    (component) => component.category === category && component.slug === slug,
  );
}
